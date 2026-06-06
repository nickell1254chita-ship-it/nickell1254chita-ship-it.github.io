import React, { useEffect, useState } from 'react';
import { Shop } from '../types';
import { GENRES, MENUS } from '../data';
import { Share2, X, Star, ChevronRight, Clock, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DetailSheetProps {
  shop: Shop | null;
  onClose: () => void;
  favorites: Shop[];
  onToggleFavorite: (shop: Shop) => void;
  onOpenMenu: (shop: Shop) => void;
}

export default function DetailSheet({
  shop,
  onClose,
  favorites,
  onToggleFavorite,
  onOpenMenu,
}: DetailSheetProps) {
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!shop) return null;

  const isFavorited = favorites.some((f) => f.id === shop.id);
  const hasMenu = !!MENUS[shop.id];

  const handleShare = () => {
    // 擬似的なコピー処理
    const shareText = `【${shop.name}】「${shop.desc}」フロア: ${shop.floor}F 団体: ${shop.org} @北海道科学大学高校 学校祭`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
  };

  const genreInfo = GENRES[shop.genre];
  const themeColor = genreInfo?.color || '#007aff';

  return (
    <motion.div
      key={shop.id}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.85 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.05, bottom: 0.75 }}
      onDragEnd={(_, info) => {
        // 下方向に100px以上ドラッグ、または下方向へのスワイプ速度が早い場合に閉じる
        if (info.offset.y > 100 || info.velocity.y > 300) {
          onClose();
        }
      }}
      className="absolute left-0 right-0 bottom-0 z-40 bg-white/40 backdrop-blur-[35px] saturate-[200%] rounded-t-[24px] shadow-[0_-12px_36px_rgba(0,0,0,0.06)] border-t border-white/30 max-h-[75vh] min-h-[300px] flex flex-col overflow-hidden pb-[calc(16px+env(safe-area-inset-bottom))]"
    >
      {/* スワイプ用のハンドルバー */}
      <div className="w-9 h-1.5 bg-black/15 rounded-full mx-auto my-3 flex-shrink-0 cursor-pointer" />


        {/* コントロールヘッダー */}
        <div className="px-4 pb-2 flex justify-between items-center flex-shrink-0 gap-2">
          {/* コピーシェアボタン */}
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-black/[0.06] hover:bg-black/[0.1] active:scale-95 transition flex items-center justify-center text-[#007aff] relative"
            title="情報をコピーしてシェア"
          >
            <Share2 className="w-4 h-4" />
            {copied && (
              <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap opacity-100 transition-opacity">
                コピーしました！
              </span>
            )}
          </button>

          {/* 出店名と場所 */}
          <div className="flex-1 text-center min-w-0">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight truncate leading-tight">
              {shop.name}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate font-medium">
              場所: {shop.floor}F 教室
            </p>
          </div>

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/[0.06] hover:bg-black/[0.1] active:scale-95 transition flex items-center justify-center text-gray-500"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* メインアクション */}
        <div className="px-4 py-3 flex gap-2.5 flex-shrink-0">
          <button
            onClick={() => onToggleFavorite(shop)}
            style={{
              borderColor: isFavorited ? 'transparent' : 'rgba(120,120,128,0.18)',
              backgroundColor: isFavorited ? '#007aff' : 'rgba(120,120,128,0.06)',
              color: isFavorited ? '#ffffff' : '#007aff',
            }}
            className="flex-1 h-12 rounded-[14px] font-bold text-sm tracking-wide transition flex items-center justify-center gap-1.5 active:scale-98 shadow-sm border"
          >
            <Star className={`w-4.5 h-4.5 ${isFavorited ? 'fill-current' : ''}`} />
            <span>{isFavorited ? '保存済み' : 'お気に入りに保存'}</span>
          </button>
        </div>

        {/* 営業サマリー・プライス・ジャンル */}
        <div className="border-y border-black/[0.06] flex text-center py-3 bg-black/[0.01] flex-shrink-0">
          <div className="flex-1 border-r border-black/[0.06]">
            <span className="text-[10px] font-bold text-gray-400 block tracking-tight">
              混雑・営業時間
            </span>
            <span className="inline-block px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 text-xs font-bold mt-1">
              営業中
            </span>
          </div>
          <div className="flex-1 border-r border-black/[0.06]">
            <span className="text-[10px] font-bold text-gray-400 block tracking-tight">
              価格帯
            </span>
            <span className="font-bold text-gray-800 text-[13px] block mt-1">
              {shop.price}
            </span>
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-bold text-gray-400 block tracking-tight">
              ジャンル
            </span>
            <span
              className="inline-block px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold mt-1"
              style={{ backgroundColor: themeColor }}
            >
              {genreInfo?.name || 'その他'}
            </span>
          </div>
        </div>

        {/* スクロール本体 */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 scrollbar-none">
          <p className="text-[14px] leading-relaxed text-gray-700 tracking-wide font-medium mb-4">
            {shop.desc}
          </p>

          {/* 食系等メニューを見るボタン */}
          {hasMenu && (
            <button
              onClick={() => onOpenMenu(shop)}
              className="w-full h-11 bg-white hover:bg-gray-50 text-[#007aff] font-bold text-[14px] rounded-[12px] shadow-sm border border-black/5 flex items-center justify-between px-4 transition active:scale-98 mb-4 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🍽</span>
                <span>メニューを見る</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>
          )}

          {/* メタ情報リスト */}
          <div className="bg-white/50 backdrop-blur-md rounded-[16px] border border-black/[0.03] overflow-hidden">
            <div className="flex justify-between items-center py-3.5 px-4 border-b border-black/[0.05]">
              <span className="text-xs font-bold text-gray-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gray-400" />
                出店団体
              </span>
              <span className="text-xs font-semibold text-gray-800">{shop.org}</span>
            </div>
            <div className="flex justify-between items-center py-3.5 px-4 border-b border-black/[0.05]">
              <span className="text-xs font-bold text-gray-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                営業時間
              </span>
              <span className="text-xs font-semibold text-gray-800">{shop.hours}</span>
            </div>
            <div className="flex justify-between items-center py-3.5 px-4">
              <span className="text-xs font-bold text-gray-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                フロア階層
              </span>
              <span className="text-xs font-semibold text-gray-800">{shop.floor}F</span>
            </div>
          </div>
        </div>
      </motion.div>
  );
}
