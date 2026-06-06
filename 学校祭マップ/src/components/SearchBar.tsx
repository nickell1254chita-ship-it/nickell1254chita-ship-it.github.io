import React, { useState, useRef, useEffect } from 'react';
import { Shop } from '../types';
import { SHOPS } from '../data';
import { Search, X, MapPin } from 'lucide-react';
import ShopIcon from './ShopIcon';

interface SearchBarProps {
  onSelectShop: (shop: Shop) => void;
  currentFloor: number;
  onFloorChange: (floor: number) => void;
  // 詳細シートが開いている間、検索バーを美しく退避させるための指標
  detailOpen: boolean;
}

export default function SearchBar({
  onSelectShop,
  currentFloor,
  onFloorChange,
  detailOpen,
}: SearchBarProps) {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Shop[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // インクリメンタルサーチ
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      return;
    }

    const filtered = SHOPS.filter(
      (shop) =>
        shop.name.toLowerCase().includes(q) ||
        shop.label.toLowerCase().includes(q) ||
        shop.org.toLowerCase().includes(q) ||
        shop.desc.toLowerCase().includes(q)
    ).slice(0, 8);

    setResults(filtered);
  }, [query]);

  // フォーカス外タップで閉じる
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectResult = (shop: Shop) => {
    setQuery('');
    setResults([]);
    setIsFocused(false);
    if (shop.floor !== currentFloor) {
      onFloorChange(shop.floor);
    }
    // 少し遅延させてからセレクトすることでスムーズなアニメーションに調和
    setTimeout(() => {
      onSelectShop(shop);
    }, 150);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
  };

  // 詳細ハーフシートが開いている時は、上部にスライドし、左右のフロートボタンを避けるためにパディングを調整する
  const wrapperClass = detailOpen
    ? "absolute left-0 right-0 top-[76px] px-16 z-35 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0.34,1)]"
    : "absolute left-0 right-0 bottom-[calc(56px+env(safe-area-inset-bottom))] pb-4 px-4 z-35 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0.34,1)]";

  return (
    <div className={wrapperClass}>
      <div ref={containerRef} className="relative w-full max-w-xl mx-auto pointer-events-auto">
        {/* インクリメンタルサーチ結果 (入力欄の上部に美しくオーバーレイ展開) */}
        {isFocused && (query.trim().length > 0) && (
          <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 bg-white/45 backdrop-blur-[30px] saturate-[200%] rounded-[18px] border border-white/30 shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto flex flex-col scrollbar-none z-50">
            {results.length === 0 ? (
              <div className="p-5 text-center text-xs font-semibold text-gray-500 select-none">
                「{query}」に一致する出店が見つかりません
              </div>
            ) : (
              results.map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => handleSelectResult(shop)}
                  className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 last:border-none active:bg-black/5 cursor-pointer hover:bg-black/[0.02] transition"
                >
                  <div className="w-9 h-9 rounded-full bg-white/40 border border-white/40 flex items-center justify-center text-base shadow-inner">
                    <ShopIcon emoji={shop.icon} genre={shop.genre} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900 truncate tracking-tight">
                      {shop.name}
                    </div>
                    <div className="text-[10px] text-gray-500 font-medium mt-0.5 truncate">
                      {shop.floor}F · {shop.org} · {shop.price}
                    </div>
                  </div>
                  <div className="text-[10px] bg-[#007aff]/15 text-[#007aff] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-[#007aff]/20">
                    <MapPin className="w-2.5 h-2.5" />
                    {shop.floor}F
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 検索入力ボックス */}
        <div className="flex items-center gap-2 px-4 py-3.5 bg-white/40 backdrop-blur-[35px] saturate-[200%] border border-white/40 shadow-xl rounded-[18px] transition-all focus-within:shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="出店や教室、団体を検索"
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 font-semibold placeholder-gray-400/90 caret-[#007aff]"
          />
          {query && (
            <button
              onClick={handleClear}
              className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
