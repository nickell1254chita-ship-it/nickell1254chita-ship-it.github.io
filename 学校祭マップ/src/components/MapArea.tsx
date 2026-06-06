import React, { useState, useEffect, useRef, useTransition } from 'react';
import { Shop } from '../types';
import { SHOPS } from '../data';
import { Plus, Minus, Navigation } from 'lucide-react';
import ShopIcon from './ShopIcon';

interface MapAreaProps {
  currentFloor: number;
  currentFilter: string;
  selectedShop: Shop | null;
  onSelectShop: (shop: Shop) => void;
  // 以下は外部からズーム・パンを操作したり追跡するためのProps（ジャイロ連携含む）
  mapRotation: number;
  setMapRotation: React.Dispatch<React.SetStateAction<number>>;
}

const VIEWBOX_W = 1000;
const VIEWBOX_H = 700;

export default function MapArea({
  currentFloor,
  currentFilter,
  selectedShop,
  onSelectShop,
  mapRotation,
  setMapRotation,
}: MapAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // トランスフォーム状態
  const [zoom, setZoom] = useState<number>(() => {
    if ([1, 2].includes(currentFloor)) return 1.8;
    if ([3, 4].includes(currentFloor)) return 1.35;
    return 1.2;
  });
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);

  // マウス、タッチイベント状態
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // ピンチズーム用
  const pinchStartDistRef = useRef<number>(0);
  const pinchStartZoomRef = useRef<number>(1);
  const isPinchingRef = useRef<boolean>(false);
  const pinchStartPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pinchStartMidRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // ジャイロセンサー状態
  const [gyroActive, setGyroActive] = useState<boolean>(false);

  // 画面リサイズ監視
  const [, forceUpdate] = useState<number>(0);
  useEffect(() => {
    const handleResize = () => {
      forceUpdate((prev) => prev + 1);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ズーム・パンのアニメーション適用（ブラウザがベクターを美しく再描画できるようにシンプルな2Dトランスフォームを使用）
  const transformStyle: React.CSSProperties = {
    transform: `translate(${panX}px, ${panY}px) rotate(${mapRotation}deg) scale(${zoom})`,
    transition: isDragging || isPinchingRef.current ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
  };

  // 1. 各階 of SVG領域サイズに基づいてスクリーン変換（SVG -> Screen）
  const getMapMetrics = () => {
    if (!containerRef.current) return { scale: 1, offsetX: 0, offsetY: 0, w: 1000, h: 700 };
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    
    // 1階と2階は viewBox 1132x540、3階は 730x311、4階は 730x312、それ以外は 1000x700 に合わせる
    const viewboxW = (currentFloor === 1 || currentFloor === 2)
      ? 1132
      : ((currentFloor === 3 || currentFloor === 4) ? 730 : VIEWBOX_W);
    const viewboxH = (currentFloor === 1 || currentFloor === 2)
      ? 540
      : (currentFloor === 3 ? 311 : (currentFloor === 4 ? 312 : VIEWBOX_H));

    const scale = Math.min(w / viewboxW, h / viewboxH);
    const renderedW = viewboxW * scale;
    const renderedH = viewboxH * scale;
    const offsetX = (w - renderedW) / 2;
    const offsetY = (h - renderedH) / 2;
    return { scale, offsetX, offsetY, w, h };
  };

  const svgToScreen = (sx: number, sy: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const W = containerRef.current.clientWidth;
    const H = containerRef.current.clientHeight;
    const m = getMapMetrics();

    // SVG内座標からCanvas上でのスケール位置
    const lx = m.offsetX + sx * m.scale;
    const ly = m.offsetY + sy * m.scale;

    // canvasの中心を基準に回転とズーム
    const cx = W / 2;
    const cy = H / 2;
    const dx = lx - cx;
    const dy = ly - cy;

    // 回転
    const rad = (mapRotation * Math.PI) / 180;
    const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
    const ry = dx * Math.sin(rad) + dy * Math.cos(rad);

    // ズーム＆パン
    return {
      x: cx + rx * zoom + panX,
      y: cy + ry * zoom + panY,
    };
  };

  // フロアが変更された場合、ズームとパンをリセットする
  // 1階、2階、3階、4階はサイズが約1.8倍、かつそれぞれ適切な座標を中心に配置。それ以外の階は通常のサイズ（zoom: 1.2）で中心リセット
  useEffect(() => {
    if (currentFloor === 1 || currentFloor === 2) {
      const targetZoom = 1.8;
      setZoom(targetZoom);
      if (containerRef.current) {
        const W = containerRef.current.clientWidth;
        const H = containerRef.current.clientHeight;
        const m = getMapMetrics();

        // メインステージのSVG座標 (x: 386, y: 280)
        const tx = m.offsetX + 386 * m.scale;
        const ty = m.offsetY + 280 * m.scale;

        const cx = W / 2;
        const cy = H / 2;

        const dx = tx - cx;
        const dy = ty - cy;

        const rad = (mapRotation * Math.PI) / 180;
        const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
        const ry = dx * Math.sin(rad) + dy * Math.cos(rad);

        setPanX(-rx * targetZoom);
        setPanY(-ry * targetZoom);
      } else {
        setPanX(0);
        setPanY(0);
      }
    } else if (currentFloor === 3 || currentFloor === 4) {
      const targetZoom = 1.35;
      setZoom(targetZoom);
      if (containerRef.current) {
        const W = containerRef.current.clientWidth;
        const H = containerRef.current.clientHeight;
        const m = getMapMetrics();

        // 3F/4F 職員室・視聴覚室のSVG座標 (x: 387, y: 50)
        const tx = m.offsetX + 387 * m.scale;
        const ty = m.offsetY + 50 * m.scale;

        const cx = W / 2;
        const cy = H / 2;

        const dx = tx - cx;
        const dy = ty - cy;

        const rad = (mapRotation * Math.PI) / 180;
        const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
        const ry = dx * Math.sin(rad) + dy * Math.cos(rad);

        setPanX(-rx * targetZoom);
        setPanY(-ry * targetZoom);
      } else {
        setPanX(0);
        setPanY(0);
      }
    } else {
      setZoom(1.2);
      setPanX(0);
      setPanY(0);
    }
  }, [currentFloor]);

  // 指定店舗へスクロール/フォーカスする（コンポーネントが選択されたとき）
  const previousSelectedShopId = useRef<string | null>(null);
  useEffect(() => {
    if (selectedShop && selectedShop.floor === currentFloor && selectedShop.id !== previousSelectedShopId.current) {
      previousSelectedShopId.current = selectedShop.id;
      // shopのSVG座標から現在の画面位置を計算し、詳細シートを考慮して上部に寄せて配置する
      if (containerRef.current) {
        const W = containerRef.current.clientWidth;
        const H = containerRef.current.clientHeight;
        const m = getMapMetrics();

        // 目的地のSVG座標を canvas 空間に変換
        const tx = m.offsetX + selectedShop.x * m.scale;
        const ty = m.offsetY + selectedShop.y * m.scale;

        // ボトムハーフ詳細シートがピンを隠さないよう、オフセット（-90px）を適用してフォーカス
        const cx = W / 2;
        const cy = H / 2 - 90;

        const dx = tx - cx;
        const dy = ty - cy;

        // 回転方向を加味
        const rad = (mapRotation * Math.PI) / 180;
        const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
        const ry = dx * Math.sin(rad) + dy * Math.cos(rad);

        // 指定階に応じたターゲットズームを設定
        const targetZoom = ([1, 2].includes(currentFloor))
          ? 1.8
          : (([3, 4].includes(currentFloor)) ? 1.35 : 1.2);
        setZoom(targetZoom);
        setPanX(-rx * targetZoom);
        setPanY(-ry * targetZoom);
      }
    } else if (!selectedShop) {
      previousSelectedShopId.current = null;
    }
  }, [selectedShop, currentFloor]);

  // モニターズーム調整（表示エリアの中心を固定基準にしてズームする）
  const zoomAround = (newZoom: number) => {
    if (!containerRef.current) {
      setZoom(newZoom);
      return;
    }
    const W = containerRef.current.clientWidth;
    const H = containerRef.current.clientHeight;
    const cx = W / 2;
    const cy = H / 2;

    const ratio = newZoom / zoom;
    const newPanX = cx - (cx - panX) * ratio;
    const newPanY = cy - (cy - panY) * ratio;

    setZoom(newZoom);
    setPanX(newPanX);
    setPanY(newPanY);
  };

  const handleZoomIn = () => {
    zoomAround(Math.min(zoom + 0.6, 4.0));
  };

  const handleZoomOut = () => {
    zoomAround(Math.max(zoom - 0.6, 0.5));
  };

  // ドラッグ（マウス）
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('.map-control-btn') || target.closest('.pin-element')) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { x: panX, y: panY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPanX(panStartRef.current.x + dx);
    setPanY(panStartRef.current.y + dy);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // タッチ（1本指パン、2本指ピンチ）
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('.map-control-btn') || target.closest('.pin-element')) return;

    if (e.touches.length === 2) {
      isPinchingRef.current = true;
      setIsDragging(false);
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      pinchStartDistRef.current = Math.sqrt(dx * dx + dy * dy);
      pinchStartZoomRef.current = zoom;
      pinchStartPanRef.current = { x: panX, y: panY };
      pinchStartMidRef.current = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };
    } else if (e.touches.length === 1) {
      isPinchingRef.current = false;
      setIsDragging(true);
      const touch = e.touches[0];
      dragStartRef.current = { x: touch.clientX, y: touch.clientY };
      panStartRef.current = { x: panX, y: panY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && isPinchingRef.current) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ratio = dist / pinchStartDistRef.current;
      const nextZoom = Math.min(Math.max(pinchStartZoomRef.current * ratio, 0.5), 4.0);

      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;
      const zoomRatio = nextZoom / pinchStartZoomRef.current;

      const newPanX = midX - (midX - pinchStartPanRef.current.x) * zoomRatio;
      const newPanY = midY - (midY - pinchStartPanRef.current.y) * zoomRatio;

      setZoom(nextZoom);
      setPanX(newPanX);
      setPanY(newPanY);
    } else if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.x;
      const dy = touch.clientY - dragStartRef.current.y;
      setPanX(panStartRef.current.x + dx);
      setPanY(panStartRef.current.y + dy);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    isPinchingRef.current = false;
  };

  // ジャイロの登録
  const handleGyroToggle = async () => {
    if (gyroActive) {
      setGyroActive(false);
      setMapRotation(0);
    } else {
      try {
        const anyWindow = window as any;
        if (
          typeof anyWindow.DeviceOrientationEvent !== 'undefined' &&
          typeof anyWindow.DeviceOrientationEvent.requestPermission === 'function'
        ) {
          const permission = await anyWindow.DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            setGyroActive(true);
          } else {
            alert('方位センサーへのアクセスが許可されませんでした。');
          }
        } else {
          // 一般的なブラウザ (iOS 13未満 or Android)
          setGyroActive(true);
        }
      } catch (err) {
        alert('センサー起動エラー、または未対応のデバイスです。');
      }
    }
  };

  useEffect(() => {
    if (!gyroActive) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      let alpha = e.alpha ?? 0;
      const anyEvent = e as any;
      if (anyEvent.webkitCompassHeading !== undefined) {
        alpha = anyEvent.webkitCompassHeading;
      }
      // 北を上にするよう回転角を適用
      setMapRotation(-alpha);
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [gyroActive]);

  // ジャンル別カラーマップ
  const genreColors: Record<string, string> = {
    food: '#ff7043',
    attraction: '#ab47bc',
    exhibit: '#29b6f6',
    stage: '#ec407a',
    facility: '#8e8e93',
  };

  const floorShops = SHOPS.filter((s) => s.floor === currentFloor);

  return (
    <div
      id="map-container-area"
      ref={containerRef}
      className="absolute top-0 left-0 right-0 bottom-[calc(56px+env(safe-area-inset-bottom))] bg-[#f2f2f7] overflow-hidden touch-action-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* マップキャンバス（SVGを包含） */}
      <div
        id="map-canvas-wrapper"
        ref={canvasRef}
        style={transformStyle}
        className="absolute top-0 left-0 w-full h-full transform-origin-center pointer-events-none"
      >
        {/* 各フロアのSVG */}
        {/* 1F */}
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-auto transition-opacity duration-300 ${
            currentFloor === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          viewBox="0 0 1132 540"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
        >
          {/* キャンバス背景（ニュアンスグレー） */}
          <rect width="1132" height="540" fill="#f4f5f8" rx="16" />

          <defs>
            {/* Apple Maps風のソフトなシャドウ */}
            <filter id="apple-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="#000000" floodOpacity="0.06" />
            </filter>
            <mask id="path-1-inside-1_0_1" fill="white">
              <path d="M745.164 252L729.928 263.519H729.916L364.164 540L0 263.25L585.365 263.463L673.664 196L745.164 252Z"/>
            </mask>
          </defs>

          {/* 地図のメイン基礎道路・グラウンド中庭敷地 */}
          <path
            d="M745.164 252L729.928 263.519H729.916L364.164 540L0 263.25L585.365 263.463L673.664 196L745.164 252Z"
            fill="#eaecef"
            stroke="#d1d1d6"
            strokeWidth="2"
          />
          <path
            d="M745.164 252L745.767 252.798L746.804 252.014L745.781 251.213L745.164 252ZM729.928 263.519V264.519H730.263L730.531 264.316L729.928 263.519ZM729.916 263.519V262.519H729.581L729.313 262.721L729.916 263.519ZM364.164 540L363.559 540.796L364.162 541.255L364.767 540.798L364.164 540ZM0 263.25L0.000363689 262.25L-2.97 262.249L-0.605063 264.046L0 263.25ZM585.365 263.463L585.365 264.463L585.703 264.463L585.972 264.258L585.365 263.463ZM673.664 196L674.281 195.213L673.672 194.736L673.057 195.205L673.664 196ZM745.164 252L744.561 251.202L729.325 262.721L729.928 263.519L730.531 264.316L745.767 252.798L745.164 252ZM729.928 263.519V262.519H729.916V263.519V264.519H729.928V263.519ZM729.916 263.519L729.313 262.721L363.561 539.202L364.164 540L364.767 540.798L730.519 264.316L729.916 263.519ZM364.164 540L364.769 539.204L0.605063 262.454L0 263.25L-0.605063 264.046L363.559 540.796L364.164 540ZM0 263.25L-0.000363689 264.25L585.365 264.463L585.365 263.463L585.366 262.463L0.000363689 262.25L0 263.25ZM585.365 263.463L585.972 264.258L674.271 196.795L673.664 196L673.057 195.205L584.758 262.668L585.365 263.463ZM673.664 196L673.047 196.787L744.547 252.787L745.164 252L745.781 251.213L674.281 195.213L673.664 196Z"
            fill="#d8dce2"
            mask="url(#path-1-inside-1_0_1)"
          />

          {/* コネクターライン・経路線 */}
          <path d="M189.164 329.5L138.664 368.5" stroke="#acb1ba" strokeWidth="1.5" />
          <path d="M662.664 314.5L614.664 274" stroke="#acb1ba" strokeWidth="1.5" />

          {/* 各部屋・施設（Apple Maps風の白塗りにグレー境界、柔らかい影） */}
          {/* A Aブロック メインアリーナ（旧サイエンス・実験棟） */}
          <path
            d="M849.166 331.369L695.486 213L973.169 0.625005L1131.06 117.538L849.166 331.369Z"
            fill="#fafbfc"
            stroke="#cbd0d8"
            strokeWidth="1.5"
            filter="url(#apple-shadow)"
          />

          {/* 中央・左側の主要教室ブロック群 */}
          {/* トイレ（旧家庭科実習室：淡いブルー/ニュアンスグレー） */}
          <rect x="325.164" y="359.5" width="65" height="50" fill="#f4f6fa" stroke="#b0c4de" strokeWidth="1.5" rx="8" filter="url(#apple-shadow)" />
          {/* 渡り廊下部屋 */}
          <rect x="233.164" y="311.5" width="44" height="34" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" rx="6" />
          
          {/* メインステージ (LINKS HALL) - ひときわ大きく、アクセントブルーの境界 */}
          <rect x="321.164" y="230.5" width="131" height="98" fill="#f0f6ff" stroke="#007aff" strokeWidth="2" rx="12" filter="url(#apple-shadow)" />
          
          {/* 北側救護室 */}
          <rect x="496.164" y="248.5" width="67" height="50" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" rx="8" filter="url(#apple-shadow)" />
          
          {/* 以前総合案内所があった部屋（名無し） */}
          <rect x="165.164" y="248.5" width="67" height="50" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" rx="8" filter="url(#apple-shadow)" />

          <rect x="247.664" y="248" width="60" height="15" fill="#fcfdfe" stroke="#cbd0d8" strokeWidth="1" rx="3" />

          {/* 渡り廊下及び別セクションルート */}
          <path
            d="M932.222 30.7773L695.169 212.365L674.48 196.008L912.588 15.3144L932.222 30.7773Z"
            fill="#ffffff"
            stroke="#cbd0d8"
            strokeWidth="1.5"
          />
          <path
            d="M413.346 501.502L364.659 539.37L245.49 449.497L295.663 411.13L413.346 501.502Z"
            fill="#ffffff"
            stroke="#cbd0d8"
            strokeWidth="1.5"
            filter="url(#apple-shadow)"
          />
          <path
            d="M102.495 263.999L256.825 381.988L205.654 418.849L1.58252 263.79L102.495 263.999Z"
            fill="#ffffff"
            stroke="#cbd0d8"
            strokeWidth="1.5"
            filter="url(#apple-shadow)"
          />
          <path
            d="M744.342 251.993L437.165 483.872L387.491 446.002L695.159 213.63L744.342 251.993Z"
            fill="#f7f8fa"
            stroke="#cbd0d8"
            strokeWidth="1.5"
          />

          <path d="M475.664 378.5L525.664 418" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M497.164 362.721L547.728 402M578.463 378.134L529.386 339.352M563.591 313C563.988 313.398 596.64 338.855 613.164 351.782" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M585.164 296L635.664 335" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M650.164 246L701.664 284.5" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M317.664 427.5C317.264 427.9 284.164 453.667 267.664 466.5" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M340.164 444.5L290.164 483.5" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M211.164 346L161.164 385" stroke="#cbd0d8" strokeWidth="1.2" />

          {/* 精密な文字配置・各部屋の日本語ラベル */}
          <text x="386" y="274" fontSize="12" fill="#1c1c1e" textAnchor="middle" fontWeight="800">
            メインステージ
          </text>
          <text x="386" y="292" fontSize="9.5" fill="#007aff" textAnchor="middle" fontWeight="700" letterSpacing="1.5">
            リンクスホール
          </text>

           <text x="530" y="278" fontSize="11" fill="#3a3a3c" textAnchor="middle" fontWeight="700">
            救護室
          </text>
 

          <text x="357" y="389" fontSize="11" fill="#4682b4" textAnchor="middle" fontWeight="800">
            トイレ
          </text>

          <text x="914" y="150" fontSize="15" fill="#1c1c1e" textAnchor="middle" fontWeight="900" letterSpacing="1.5">
            メインアリーナ
          </text>
        </svg>

        {/* 2F */}
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-auto transition-opacity duration-300 ${
            currentFloor === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          viewBox="0 0 1132 540"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
        >
          {/* キャンバス背景（ニュアンスグレー） */}
          <rect width="1132" height="540" fill="#f4f5f8" rx="16" />

          <defs>
            <mask id="path-1-inside-1_0_2" fill="white">
              <path d="M745.164 252L729.928 263.519H729.916L364.164 540L0 263.25L585.365 263.463L673.664 196L745.164 252Z"/>
            </mask>
          </defs>

          {/* 地図 of 2F メイン基礎道路・グラウンド中庭敷地 */}
          <path
            d="M745.164 252L729.928 263.519H729.916L364.164 540L0 263.25L585.365 263.463L673.664 196L745.164 252Z"
            fill="#eaecef"
            stroke="#d1d1d6"
            strokeWidth="2"
          />
          <path
            d="M745.164 252L745.767 252.798L746.804 252.014L745.781 251.213L745.164 252ZM729.928 263.519V264.519H730.263L730.531 264.316L729.928 263.519ZM729.916 263.519V262.519H729.581L729.313 262.721L729.916 263.519ZM364.164 540L363.559 540.796L364.162 541.255L364.767 540.798L364.164 540ZM0 263.25L0.000363689 262.25L-2.97 262.249L-0.605063 264.046L0 263.25ZM585.365 263.463L585.365 264.463L585.703 264.463L585.972 264.258L585.365 263.463ZM673.664 196L674.281 195.213L673.672 194.736L673.057 195.205L673.664 196ZM745.164 252L744.561 251.202L729.325 262.721L729.928 263.519L730.531 264.316L745.767 252.798L745.164 252ZM729.928 263.519V262.519H729.916V263.519V264.519H729.928V263.519ZM729.916 263.519L729.313 262.721L363.561 539.202L364.164 540L364.767 540.798L730.519 264.316L729.916 263.519ZM364.164 540L364.769 539.204L0.605063 262.454L0 263.25L-0.605063 264.046L363.559 540.796L364.164 540ZM0 263.25L-0.000363689 264.25L585.365 264.463L585.365 263.463L585.366 262.463L0.000363689 262.25L0 263.25ZM585.365 263.463L585.972 264.258L674.271 196.795L673.664 196L673.057 195.205L584.758 262.668L585.365 263.463ZM673.664 196L673.047 196.787L744.547 252.787L745.164 252L745.781 251.213L674.281 195.213L673.664 196ZM729.928 263.519V262.519H729.916V263.519V264.519H729.928V263.519ZM729.916 263.519L729.313 262.721L363.561 539.202L364.164 540L364.767 540.798L730.519 264.316L729.916 263.519ZM364.164 540L364.769 539.204L0.605063 262.454L0 263.25L-0.605063 264.046L363.559 540.796L364.164 540ZM0 263.25L-0.000363689 264.25L585.365 264.463L585.365 263.463L585.366 262.463L0.000363689 262.25L0 263.25ZM585.365 263.463L585.972 264.258L674.271 196.795L673.664 196L673.057 195.205L584.758 262.668L585.365 263.463ZM673.664 196L673.047 196.787L744.547 252.787L745.164 252L745.781 251.213L674.281 195.213L673.664 196Z"
            fill="#d8dce2"
            mask="url(#path-1-inside-1_0_2)"
          />

          {/* コネクターライン・経路線 */}
          <path d="M662.664 314.5L614.664 274" stroke="#cbd0d8" strokeWidth="1.2" />

          {/* 各部屋・施設（Apple Maps風の白塗りにグレー境界、柔らかい影） */}
          <path
            d="M849.166 331.369L695.486 213L973.169 0.625005L1131.06 117.538L849.166 331.369Z"
            fill="#fafbfc"
            stroke="#cbd0d8"
            strokeWidth="1.5"
            filter="url(#apple-shadow)"
          />
          <rect x="325.164" y="359.5" width="65" height="50" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" rx="8" filter="url(#apple-shadow)" />
          <rect x="321.164" y="230.5" width="131" height="98" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" rx="12" filter="url(#apple-shadow)" />
          <rect x="496.164" y="248.5" width="67" height="50" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" rx="8" filter="url(#apple-shadow)" />
          <rect x="165.164" y="248.5" width="67" height="50" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" rx="8" filter="url(#apple-shadow)" />

          <path d="M932.222 30.7773L695.169 212.365L674.48 196.008L912.588 15.3144L932.222 30.7773Z" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" filter="url(#apple-shadow)" />
          <path d="M413.35 501.5L364.661 539.368L69.4688 313.985L119.173 273.14L413.35 501.5Z" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" filter="url(#apple-shadow)" />
          <path d="M744.342 251.993L437.165 483.872L387.491 446.002L695.159 213.63L744.342 251.993Z" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" filter="url(#apple-shadow)" />

          {/* 細部境界や中庭・通路の補助線 */}
          <path d="M475.664 378.5L525.664 418" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M497.164 362.721L547.728 402M578.463 378.134L529.386 339.352M563.591 313C563.988 313.398 596.64 338.855 613.164 351.782" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M585.164 296L635.664 335" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M650.164 246L701.664 284.5" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M356.164 457.5L306.164 496.5" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M155.664 302L105.664 341" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M205.664 341L155.664 380" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M255.664 380L205.664 419" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M306.664 418.5L256.664 457.5" stroke="#cbd0d8" strokeWidth="1.2" />

          {/* 長らく待ち望まれた斜め新棟と3年生の教室配置 */}
          <path
            d="M452.894 471.859L402.228 431.123L694.154 213.631L743.35 252.916L452.894 471.859Z"
            fill="#ffffff"
            stroke="#cbd0d8"
            strokeWidth="1.5"
            filter="url(#apple-shadow)"
          />
          {/* 各部屋の境界。明るいカラーテーマに合わせて目立ちすぎないグレーに変更 */}
          <path d="M492.42 441L443.42 400" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M683.42 299L634.42 258" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M648.42 326L599.42 285" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M714.779 275.5L665.523 234" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M610.42 353L561.42 312" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M572.42 382L523.42 341" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M534.42 410L485.42 369" stroke="#cbd0d8" strokeWidth="1.2" />

           {/* ==================== 2階テキストラベルの配置（Apple Maps調の美しさ） ==================== */}
 


          {/* トイレ */}
          <text x="357" y="389" fontSize="11" fill="#4682b4" textAnchor="middle" fontWeight="800">
            トイレ
          </text>

          {/* アリーナ */}
          <text x="914" y="150" fontSize="14" fill="#3a3a3c" textAnchor="middle" fontWeight="800">
            サブアリーナ
          </text>
        </svg>

        {/* 3F */}
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-auto transition-opacity duration-300 ${
            currentFloor === 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          viewBox="0 0 730 311"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
        >
          {/* キャンバス背景（ニュアンスグレー） */}
          <rect width="730" height="311" fill="#f4f5f8" rx="16" />

          <defs>
            {/* Apple Maps風のソフトなシャドウ */}
            <filter id="apple-shadow-3f" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#000000" floodOpacity="0.06" />
            </filter>
            <mask id="path-1-inside-1_0_1_3f" fill="white">
              <path d="M729.919 34.2666L364.164 310.75L0 34L729.919 34.2666Z"/>
            </mask>
          </defs>

          {/* 地図のメイン基礎道路・グラウンド中庭敷地 */}
          <path
            d="M729.919 34.2666L364.164 310.75L0 34L729.919 34.2666Z"
            fill="#eaecef"
            stroke="#d1d1d6"
            strokeWidth="2"
          />
          <path
            d="M729.919 34.2666L730.522 35.0643L732.899 33.2677L729.919 33.2666L729.919 34.2666ZM364.164 310.75L363.559 311.546L364.162 312.005L364.767 311.548L364.164 310.75ZM0 34L0.000365248 33L-2.97001 32.9989L-0.605063 34.7962L0 34ZM729.919 34.2666L729.316 33.4689L363.561 309.952L364.164 310.75L364.767 311.548L730.522 35.0643L729.919 34.2666ZM364.164 310.75L364.769 309.954L0.605063 33.2038L0 34L-0.605063 34.7962L363.559 311.546L364.164 310.75ZM0 34L-0.000365248 35L729.919 35.2666L729.919 34.2666L729.919 33.2666L0.000365248 33L0 34Z"
            fill="#d8dce2"
            mask="url(#path-1-inside-1_0_1_3f)"
          />

          {/* 渡り廊下・別セクションルート（仕切りの下に配置されるよう先に描画） */}
          <path d="M413.684 271.501L364.996 309.369L90.3164 100.992L141.502 60.6348L413.684 271.501Z" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" filter="url(#apple-shadow-3f)" />
          <path d="M453.23 241.857L402.563 201.123L560.99 82.6318L610.687 122.489L453.23 241.857Z" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" filter="url(#apple-shadow-3f)" />

          {/* コネクターライン・経路線 */}
          <path d="M561 82.5L626.5 35" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M356.5 227.5L306.5 266.5" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M156 72L104.5 113" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M206 111L156 150" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M256 150L206 189" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M307 188.5L257 227.5" stroke="#cbd0d8" strokeWidth="1.2" />

          {/* 斜め新棟の各部屋境界線（仕切り：渡り廊下の白塗りに隠されないように後に描画） */}
          <path d="M492.756 211L443.756 170" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M572.756 152L523.756 111" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M691 63L658 34.5" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M629.756 109L580.756 68" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M534.756 180L485.756 139" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M142 61L107.5 34" stroke="#cbd0d8" strokeWidth="1.2" />

          {/* 部屋の配置（Apple Maps風ソフトシャドウと淡い色合い） */}
          {/* トイレ */}
          <rect x="325.5" y="129.5" width="65" height="50" fill="#f4f6fa" stroke="#b0c4de" strokeWidth="1.5" rx="8" filter="url(#apple-shadow-3f)" />
          {/* 職員室 (大部屋) */}
          <rect x="321.5" y="0.5" width="131" height="98" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" rx="12" filter="url(#apple-shadow-3f)" />
          {/* 図書室 */}
          <rect x="496.5" y="18.5" width="67" height="50" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" rx="8" filter="url(#apple-shadow-3f)" />
          {/* 音楽室 */}
          <rect x="165.5" y="18.5" width="67" height="50" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" rx="8" filter="url(#apple-shadow-3f)" />

          {/* テキストラベル情報 */}
          <text x="358" y="159" fontSize="11" fill="#4682b4" textAnchor="middle" fontWeight="800">
            トイレ
          </text>
          
          <text x="387" y="44" fontSize="12" fill="#1c1c1e" textAnchor="middle" fontWeight="800">
            職員室
          </text>
          <text x="387" y="60" fontSize="9" fill="#007aff" textAnchor="middle" fontWeight="700" letterSpacing="1.2">
            本館職員室
          </text>


        </svg>

        {/* 4F */}
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-auto transition-opacity duration-300 ${
            currentFloor === 4 ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          viewBox="0 0 730 312"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
        >
          {/* キャンバス背景（ニュアンスグレーに変更） */}
          <rect width="730" height="312" fill="#f4f5f8" rx="16" />

          <defs>
            {/* Apple Maps風のソフトなシャドウ（4F用） */}
            <filter id="apple-shadow-4f" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#000000" floodOpacity="0.06" />
            </filter>
            <mask id="path-1-inside-1_0_1_4f" fill="white">
              <path d="M729.919 35.2666L364.164 311.75L0 35L729.919 35.2666Z" />
            </mask>
          </defs>

          {/* 地図のメイン基礎道路・グラウンド中庭敷地（3Fと同じくライトグレーに） */}
          <path
            d="M729.919 35.2666L364.164 311.75L0 35L729.919 35.2666Z"
            fill="#eaecef"
            stroke="#d1d1d6"
            strokeWidth="2"
          />
          <path
            d="M729.919 35.2666L730.522 36.0643L732.899 34.2677L729.919 34.2666L729.919 35.2666ZM364.164 311.75L363.559 312.546L364.162 313.005L364.767 312.548L364.164 311.75ZM0 35L0.000365248 34L-2.97001 33.9989L-0.605063 35.7962L0 35ZM729.919 35.2666L729.316 34.4689L363.561 310.952L364.164 311.75L364.767 312.548L730.522 36.0643L729.919 35.2666ZM364.164 311.75L364.769 310.954L0.605063 34.2038L0 35L-0.605063 35.7962L363.559 312.546L364.164 311.75ZM0 35L-0.000365248 36L729.919 36.2666L729.919 35.2666L729.919 34.2666L0.000365248 34L0 35Z"
            fill="#d8dce2"
            mask="url(#path-1-inside-1_0_1_4f)"
          />

          {/* 通路・別セクションルート（仕切りの下に配置されるよう先に描画、白＋ソフトな枠組み・シャドウ） */}
          <path d="M413.685 271.5L364.995 309.369L100.333 109.004L153.492 69.627L413.685 271.5Z" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" filter="url(#apple-shadow-4f)" />
          <path d="M453.232 241.86L402.567 201.126L596.979 58.1359L644.917 98.5858L453.232 241.86Z" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" filter="url(#apple-shadow-4f)" />

          {/* コネクターライン・経路線 */}
          <path d="M356.5 227.5L306.5 266.5" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M206 111L155 150.5" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M256 150L206 189" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M307 188.5L257 227.5" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M153.5 69.5L107.5 34" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M597 58L627.5 36" stroke="#cbd0d8" strokeWidth="1.2" />

          {/* 斜め新棟の各部屋境界線（仕切り：渡り廊下の白塗りに隠されないように後に描画） */}
          <path d="M492.756 211L443.756 170" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M572.756 152L523.756 111" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M610.756 125L561.756 84" stroke="#cbd0d8" strokeWidth="1.2" />
          <path d="M534.756 180L485.756 139" stroke="#cbd0d8" strokeWidth="1.2" />

          {/* 教室・特別室（Apple Maps調デザイン） */}
          {/* トイレ */}
          <rect x="325.5" y="129.5" width="65" height="50" fill="#f4f6fa" stroke="#b0c4de" strokeWidth="1.5" rx="8" filter="url(#apple-shadow-4f)" />
          {/* 視聴覚室 */}
          <rect x="321.5" y="0.5" width="131" height="98" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" rx="12" filter="url(#apple-shadow-4f)" />
          {/* 美術室 */}
          <rect x="496.5" y="18.5" width="67" height="50" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" rx="8" filter="url(#apple-shadow-4f)" />
          {/* PC教室 */}
          <rect x="165.5" y="18.5" width="67" height="50" fill="#ffffff" stroke="#cbd0d8" strokeWidth="1.5" rx="8" filter="url(#apple-shadow-4f)" />

          {/* 文字情報 */}
          <text x="358" y="159" fontSize="11" fill="#4682b4" textAnchor="middle" fontWeight="800">
            トイレ
          </text>
          

        </svg>
      </div>

      {/* ピンレイヤー、canvasの外側に絶対配置して座標を手動変換する（ピン内の文字が回転しないため、かつスムーズにするため） */}
      <div id="pins-overlay-layer" className="absolute inset-0 pointer-events-none">
        {floorShops.map((shop) => {
          const isSelected = selectedShop?.id === shop.id;
          
          // 詳細表示中は、選択しているショップ以外のピンを非表示にする
          const isHiddenByDetail = selectedShop !== null && !isSelected;
          const isHidden = (currentFilter !== 'all' && currentFilter !== shop.genre) || isHiddenByDetail;
          
          const pos = svgToScreen(shop.x, shop.y);
          const themeColor = genreColors[shop.genre];

          return (
            <div
              key={shop.id}
              className={`pin-element absolute cursor-pointer pointer-events-auto transform -translate-x-1/2 -translate-y-[100%] transition-all duration-300 select-none ${
                isHidden ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'
              }`}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                zIndex: isSelected ? 35 : 10,
              }}
              onClick={() => onSelectShop(shop)}
            >
              <div
                className={`flex flex-col items-center group transition-transform ${
                  isSelected ? 'scale-115' : 'hover:scale-105 active:scale-95'
                }`}
              >
                {/* Apple Maps風マーカー（外側白、内側白地に色付きアイコン） */}
                <div
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-[2px]`}
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: isSelected ? '#007aff' : '#ffffff',
                  }}
                >
                  <ShopIcon emoji={shop.icon} genre={shop.genre} size={16} />
                  {/* 小さい三角マーカー */}
                  <div
                    className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[5px]"
                    style={{
                      borderLeftColor: 'transparent',
                      borderRightColor: 'transparent',
                      borderTColor: isSelected ? '#007aff' : '#ffffff',
                    }}
                  />
                </div>

                {/* ラベル */}
                <div className="mt-1 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-[4px] border border-black/5 shadow-md flex items-center justify-center">
                  <span className="text-[9px] font-bold text-gray-900 tracking-tight whitespace-nowrap">
                    {shop.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 右側のフローティングコントロール（プラス、マイナス、方位（ジャイロ）） */}
      <div className="map-control-btn absolute right-3.5 top-[76px] flex flex-col gap-2.5 z-25 transition-all duration-300">
        {/* ジャイロ(方位)コンパスボタン */}
        <button
          onClick={handleGyroToggle}
          className={`w-11 h-11 rounded-full flex items-center justify-center border shadow-md active:scale-95 transition-all duration-300 ${
            gyroActive
              ? 'bg-[#007aff] text-white border-transparent shadow-[#007aff]/30 shadow-lg'
              : 'bg-white/40 backdrop-blur-[35px] saturate-[200%] border-white/30 text-[#007aff]'
          }`}
          title="方位センサー連動"
        >
          <div
            style={{
              transform: `rotate(${mapRotation}deg)`,
              transition: 'transform 0.15s ease',
            }}
          >
            {/* 方位磁針風のアイコン */}
            <Navigation className="w-5 h-5 fill-current" />
          </div>
        </button>

        {/* ズームスタック */}
        <div className="bg-white/40 backdrop-blur-[35px] saturate-[200%] rounded-[14px] shadow-md border border-white/30 flex flex-col overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-11 h-11 flex items-center justify-center text-[#007aff] hover:bg-black/5 active:bg-black/10 transition"
          >
            <Plus className="w-5 h-5" />
          </button>
          <div className="h-[0.5px] bg-black/10 w-full" />
          <button
            onClick={handleZoomOut}
            className="w-11 h-11 flex items-center justify-center text-[#007aff] hover:bg-black/5 active:bg-black/10 transition"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
