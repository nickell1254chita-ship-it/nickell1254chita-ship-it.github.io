import React from 'react';
import { Shop } from '../types';
import { GENRES } from '../data';
import { X, Trash2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ShopIcon from './ShopIcon';

interface FavoritePanelProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Shop[];
  onRemove: (shopId: Shop) => void;
  onJumpToShop: (shop: Shop) => void;
}

export default function FavoritePanel({
  isOpen,
  onClose,
  favorites,
  onRemove,
  onJumpToShop,
}: FavoritePanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 黒半透明の背景オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black z-45"
          />

          {/* ドロワーパネル */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute top-0 left-0 bottom-0 w-[290px] bg-white/40 backdrop-blur-[35px] saturate-[200%] z-50 shadow-2xl border-r border-white/30 flex flex-col pt-safe pb-[calc(12px+env(safe-area-inset-bottom))]"
          >
            {/* ヘッダー */}
            <div className="px-5 pt-4 pb-3 flex justify-between items-center border-b border-black/5 flex-shrink-0">
               <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                <span className="text-[#007aff]">★</span>
                保存した出店
              </h3>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-black/[0.05] hover:bg-black/[0.08] flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 一覧リスト */}
            <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2 scrollbar-none">
              {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-65 select-none md:py-24">
                  <div className="w-12 h-12 rounded-full border-[1.5px] border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-xl font-bold mb-3">
                    ★
                  </div>
                  <p className="text-xs font-semibold text-gray-400">
                    保存した出店がここに表示されます。
                  </p>
                </div>
              ) : (
                favorites.map((shop) => (
                  <div
                    key={shop.id}
                    onClick={() => {
                      onJumpToShop(shop);
                      onClose();
                    }}
                    className="group bg-white hover:bg-gray-50 active:scale-98 transition rounded-[14px] p-3 border border-black/[0.03] shadow-sm flex items-center gap-2.5 cursor-pointer relative"
                  >
                    {/* 絵文字 / ジャンルアイコン */}
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-black/5 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                      <ShopIcon emoji={shop.icon} genre={shop.genre} size={18} />
                    </div>

                    {/* テキスト情報 */}
                    <div className="flex-1 min-w-0 pr-1">
                      <h4 className="text-sm font-bold text-gray-900 truncate tracking-tight">
                        {shop.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-300" />
                        {shop.floor}F · {GENRES[shop.genre]?.name}
                      </p>
                    </div>

                    {/* 削除ボタン */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(shop);
                      }}
                      className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition border border-red-100/30 flex-shrink-0 cursor-pointer"
                      title="削除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
