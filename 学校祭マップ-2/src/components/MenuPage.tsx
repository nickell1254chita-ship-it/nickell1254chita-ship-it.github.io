import React, { useState, useEffect } from 'react';
import { Shop, ShopMenu } from '../types';
import { MENUS } from '../data';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

interface MenuPageProps {
  shop: Shop;
  onBack: () => void;
}

export default function MenuPage({ shop, onBack }: MenuPageProps) {
  const menu: ShopMenu | undefined = MENUS[shop.id];
  const [activeTab, setActiveTab] = useState<number>(0);

  // カテゴリや店舗が変わった時にリセット
  useEffect(() => {
    setActiveTab(0);
  }, [shop.id]);

  if (!menu) {
    return (
      <div className="absolute inset-0 bg-[#f2f2f7] z-45 flex flex-col justify-center items-center p-6 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">メニューは準備中です</h3>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-[#007aff] text-white font-bold rounded-full shadow-md text-sm active:scale-95 transition"
        >
          マップに戻る
        </button>
      </div>
    );
  }

  const activeCategory = menu.categories[activeTab];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 26, stiffness: 220 }}
      className="absolute inset-0 bg-[#f2f2f7] z-45 flex flex-col pt-safe overflow-hidden"
    >
      {/* iOS ナビゲーションバー風 */}
      <div className="bg-white/80 backdrop-blur-[30px] border-b border-black/5 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center text-[#007aff] font-semibold text-sm active:opacity-60 transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 -ml-1.5" />
          <span>戻る</span>
        </button>
        <div className="text-center flex-1 min-w-0 px-2">
          <h1 className="text-base font-bold text-gray-900 truncate tracking-tight">
            {shop.name}のメニュー
          </h1>
          <p className="text-[10px] text-gray-400 font-bold tracking-tight truncate">
            {shop.floor}F · {shop.hours}
          </p>
        </div>
        {/* シンメトリー用のダミー要素 */}
        <div className="w-12" />
      </div>

      {/* カテゴリ切り替えタブ (横スクロール可能) */}
      {menu.categories.length > 1 && (
        <div className="bg-white/80 backdrop-blur-[20px] border-b border-black/5 flex overflow-x-auto scrollbar-none px-4 py-2 gap-1.5 flex-shrink-0">
          {menu.categories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition ${
                activeTab === i
                  ? 'bg-[#007aff] text-white'
                  : 'bg-black/[0.04] text-gray-500 hover:bg-black/[0.06]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* アイテムグリッドスクロール */}
      <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-none">
        {activeCategory ? (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-1.5 leading-none">
                {activeCategory.name}
              </h2>
              {activeCategory.sub && (
                <p className="text-[11px] text-gray-400 font-bold mt-1 tracking-wider uppercase">
                  {activeCategory.sub}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3.5 pb-10">
              {activeCategory.items.map((item) => (
                <div
                  key={item.name}
                  className="bg-white rounded-[18px] border border-black/[0.03] shadow-sm overflow-hidden flex flex-col h-full transform transition hover:scale-[1.02]"
                >
                  {/* 画像代わりの巨大絵文字ゾーン */}
                  <div className="aspect-square w-full bg-[#f2f2f7] flex items-center justify-center text-5xl select-none shadow-inner relative">
                    {item.emoji}
                    {item.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm tracking-wider uppercase">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* カード本文 */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 tracking-tight truncate leading-snug">
                        {item.name}
                      </h3>
                      {item.desc && (
                        <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-normal font-medium">
                          {item.desc}
                        </p>
                      )}
                    </div>
                    <div className="mt-3.5 flex justify-between items-baseline pt-1 border-t border-black/[0.03]">
                      <span className="text-base font-black text-gray-900 tracking-tight">
                        ¥{item.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold italic">
                        1品
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 font-medium">
            メニューが登録されていません
          </div>
        )}
      </div>
    </motion.div>
  );
}
