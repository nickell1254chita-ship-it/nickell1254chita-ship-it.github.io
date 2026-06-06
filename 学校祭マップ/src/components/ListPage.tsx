import React, { useState } from 'react';
import { Shop } from '../types';
import { SHOPS, GENRES, MENUS } from '../data';
import { ChevronRight, Store, Clock, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ShopIcon from './ShopIcon';

interface ListPageProps {
  onSelectShopFromList: (shop: Shop) => void;
  // メニュー詳細を見るボタン用
  onOpenMenu: (shop: Shop) => void;
}

const GENRE_ORDER = ['all', 'food', 'attraction', 'exhibit', 'stage', 'facility'];

export default function ListPage({ onSelectShopFromList, onOpenMenu }: ListPageProps) {
  const [activeGenre, setActiveGenre] = useState<string>('all');

  const filteredShops = SHOPS.filter(
    (shop) => activeGenre === 'all' || shop.genre === activeGenre
  );

  return (
    <div className="absolute inset-0 bottom-[calc(56px+env(safe-area-inset-bottom))] bg-[#f2f2f7] z-25 flex flex-col pt-safe overflow-hidden">
      {/* ナビゲーションヘッダー */}
      <div className="bg-white/80 backdrop-blur-[35px] border-b border-black/5 px-4.5 pt-4 pb-3 flex-shrink-0">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">メニュー・出店一覧</h1>

        {/* ジャンルタブセグメント */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none mt-3.5 pb-0.5">
          <button
            onClick={() => setActiveGenre('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition ${
              activeGenre === 'all' ? 'bg-[#007aff] text-white' : 'bg-black/[0.04] text-gray-500 hover:bg-black/[0.06]'
            }`}
          >
            すべて
          </button>
          {Object.entries(GENRES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setActiveGenre(key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                activeGenre === key ? 'bg-[#007aff] text-white' : 'bg-black/[0.04] text-gray-500 hover:bg-black/[0.06]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: activeGenre === key ? '#ffffff' : val.color }}
              />
              {val.name}
            </button>
          ))}
        </div>
      </div>

      {/* スクロールするリスト */}
      <div className="flex-1 overflow-y-auto px-4.5 py-4 scrollbar-none pb-20">
        <AnimatePresence mode="popLayout">
          {filteredShops.length === 0 ? (
            <div className="text-center py-20 text-xs font-semibold text-gray-400 select-none">
              該当する出店情報が見つかりません。
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {filteredShops.map((shop) => {
                const shopMenu = MENUS[shop.id];
                const itemsList = shopMenu
                  ? shopMenu.categories.flatMap((c) => c.items)
                  : [];
                const previewItems = itemsList.slice(0, 4);
                const hasMoreItems = itemsList.length > 4;

                const genreColor = GENRES[shop.genre]?.color || '#8e8e93';

                return (
                  <motion.div
                    key={shop.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 24, stiffness: 240 }}
                    className="flex flex-col gap-2.5"
                  >
                    {/* 店舗見出しカード */}
                    <div
                      onClick={() => onSelectShopFromList(shop)}
                      className="bg-white hover:bg-gray-50 rounded-[18px] p-4 shadow-sm border border-black/[0.03] transition flex items-center justify-between cursor-pointer group active:scale-99"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* 店舗アイコン */}
                        <div
                          style={{ borderColor: `${genreColor}25` }}
                          className="w-11 h-11 rounded-[14px] bg-gray-50 border flex items-center justify-center flex-shrink-0 shadow-inner"
                        >
                          <ShopIcon emoji={shop.icon} genre={shop.genre} size={22} />
                        </div>

                        {/* 店舗テキスト情報 */}
                        <div className="min-w-0">
                          <h2 className="text-base font-extrabold text-gray-900 tracking-tight leading-snug group-hover:text-[#007aff] transition">
                            {shop.name}
                          </h2>
                          <div className="text-[10px] text-gray-400 font-bold mt-1 flex items-center gap-3.5">
                            <span className="flex items-center gap-1">
                              <Store className="w-3.5 h-3.5 opacity-60" />
                              {shop.floor}F 教室 / {shop.org}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 opacity-60" />
                              {shop.hours}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 矢印 */}
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#007aff] transition flex-shrink-0 -mr-1" />
                    </div>

                    {/* メニューアイテムプレビュー (食べ物系だけであればメニュープレビューを表示) */}
                    {itemsList.length > 0 ? (
                      <div className="bg-white rounded-[18px] border border-black/[0.03] divide-y divide-black/[0.04] shadow-sm ml-1.5 overflow-hidden">
                        {previewItems.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between p-3.5 gap-2.5"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-2xl w-10 h-10 rounded-full bg-[#f2f2f7] flex items-center justify-center flex-shrink-0">
                                {item.emoji}
                              </span>
                              <div className="min-w-0">
                                <h3 className="text-xs font-bold text-gray-800 tracking-tight flex items-center gap-1.5 leading-none">
                                  {item.name}
                                  {item.badge && (
                                    <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-extrabold tracking-wider leading-none">
                                      {item.badge}
                                    </span>
                                  )}
                                </h3>
                                {item.desc && (
                                  <p className="text-[10px] text-gray-400 font-medium truncate mt-1">
                                    {item.desc}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className="text-xs font-black text-gray-900 flex-shrink-0">
                              ¥{item.price.toLocaleString()}
                            </span>
                          </div>
                        ))}

                        {/* もっと見るボタン */}
                        {hasMoreItems && (
                          <button
                            onClick={() => onOpenMenu(shop)}
                            className="w-full text-center py-3 text-xs font-extrabold text-[#007aff] bg-black/[0.01] hover:bg-black/[0.03] active:bg-black/[0.05] transition cursor-pointer flex items-center justify-center gap-1"
                          >
                            他 {itemsList.length - 4} 件のメニューを見る
                            <ChevronRight className="w-4.5 h-4.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      shop.genre === 'food' && (
                        <div className="text-[11px] text-gray-400 font-bold tracking-tight text-center bg-white rounded-[16px] border border-black/[0.02] py-4 shadow-sm ml-1.5">
                          メニュー情報は準備中です
                        </div>
                      )
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
