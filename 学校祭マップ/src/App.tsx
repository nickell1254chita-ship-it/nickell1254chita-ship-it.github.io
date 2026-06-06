import React, { useState, useEffect } from 'react';
import { Shop } from './types';
import { SHOPS } from './data';
import MapArea from './components/MapArea';
import TopBar from './components/TopBar';
import DetailSheet from './components/DetailSheet';
import FavoritePanel from './components/FavoritePanel';
import SearchBar from './components/SearchBar';
import ListPage from './components/ListPage';
import MenuPage from './components/MenuPage';
import { Map, ListMusic, Star } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [currentFloor, setCurrentFloor] = useState<number>(1);
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [favorites, setFavorites] = useState<Shop[]>([]);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  const [isFavoriteOpen, setIsFavoriteOpen] = useState<boolean>(false);
  const [menuShop, setMenuShop] = useState<Shop | null>(null);
  const [mapRotation, setMapRotation] = useState<number>(0);

  // ローカルストレージのお気に入り読込・保存
  useEffect(() => {
    try {
      const stored = localStorage.getItem('school_fest_favs');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('お気に入り情報の読込に失敗しました。', e);
    }
  }, []);

  const handleToggleFavorite = (shop: Shop) => {
    let nextFavs: Shop[];
    const exits = favorites.some((f) => f.id === shop.id);
    if (exits) {
      nextFavs = favorites.filter((f) => f.id !== shop.id);
    } else {
      nextFavs = [...favorites, shop];
    }
    setFavorites(nextFavs);
    try {
      localStorage.setItem('school_fest_favs', JSON.stringify(nextFavs));
    } catch (e) {
      console.error('お気に入り情報の保存に失敗しました。', e);
    }
  };

  // 一覧リスト等から出店位置にジャンプする
  const handleJumpToShop = (shop: Shop) => {
    setActiveTab('map');
    setCurrentFloor(shop.floor);
    setSelectedShop(shop);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1c1c1e] text-black">
      {/* iPhoneを模した美しいモバイルアプレットフレームワーク */}
      <div className="relative w-full max-w-[420px] h-screen sm:h-[860px] sm:max-h-[92vh] bg-[#f2f2f7] sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-[#1c1c1e] overflow-hidden flex flex-col select-none">
        
        {/* メイン画面コンテンツ領域 */}
        <div className="flex-1 relative overflow-hidden">
          {activeTab === 'map' ? (
            <>
              {/* マップ画面 */}
              <MapArea
                currentFloor={currentFloor}
                currentFilter={currentFilter}
                selectedShop={selectedShop}
                onSelectShop={setSelectedShop}
                mapRotation={mapRotation}
                setMapRotation={setMapRotation}
              />

              {/* マップ側上部バー (フィルターのみ) */}
              <div className="transition-all duration-300">
                <TopBar
                  currentFilter={currentFilter}
                  onFilterChange={setCurrentFilter}
                />
              </div>

              {/* 地図左上にフロアセレクターとお気に入り一覧ボタンのスタック */}
              <div className="absolute left-3.5 top-[76px] z-25 flex flex-col gap-2.5 transition-all duration-300">
                {/* お気に入り星ボタン */}
                <button
                  onClick={() => setIsFavoriteOpen(true)}
                  className="w-11 h-11 bg-white/40 backdrop-blur-[35px] saturate-[200%] border border-white/30 text-[#007aff] rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
                  title="保存した出店"
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>

                {/* 階数切換 (セグメントコントロール風の垂直配置) */}
                <div className="bg-white/40 backdrop-blur-[35px] saturate-[200%] rounded-[14px] shadow-md border border-white/30 flex flex-col overflow-hidden w-11">
                  {[4, 3, 2, 1].map((floor) => {
                    const isActive = currentFloor === floor;
                    return (
                      <button
                        key={floor}
                        onClick={() => {
                          setCurrentFloor(floor);
                          setSelectedShop(null); // フロア変更時は一旦詳細を閉じる
                        }}
                        className={`h-9 font-black text-[13px] tracking-tight transition flex items-center justify-center border-b border-black/[0.04] last:border-none cursor-pointer ${
                          isActive
                            ? 'bg-[#007aff]/15 text-[#007aff]'
                            : 'text-[#555] hover:text-black'
                        }`}
                      >
                        {floor}F
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 検索バー */}
              <SearchBar
                onSelectShop={setSelectedShop}
                currentFloor={currentFloor}
                onFloorChange={setCurrentFloor}
                detailOpen={!!selectedShop}
              />

              {/* 詳細ボトムハーフシート */}
              <AnimatePresence>
                {selectedShop && (
                  <DetailSheet
                    shop={selectedShop}
                    onClose={() => setSelectedShop(null)}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenMenu={setMenuShop}
                  />
                )}
              </AnimatePresence>
            </>
          ) : (
            /* 出店一覧・メニューリスト画面 */
            <ListPage
              onSelectShopFromList={handleJumpToShop}
              onOpenMenu={setMenuShop}
            />
          )}

          {/* お気に入りサイドパネル (左ドロワー) */}
          <FavoritePanel
            isOpen={isFavoriteOpen}
            onClose={() => setIsFavoriteOpen(false)}
            favorites={favorites}
            onRemove={handleToggleFavorite}
            onJumpToShop={handleJumpToShop}
          />

          {/* 特定店舗メニュー詳細 (右からフルスクリーンイン) */}
          <AnimatePresence>
            {menuShop && (
              <MenuPage
                shop={menuShop}
                onBack={() => setMenuShop(null)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* タブバー (最下部固定) */}
        <div className="h-[calc(56px+env(safe-area-inset-bottom))] bg-white/40 backdrop-blur-[35px] saturate-[200%] border-t border-white/30 flex items-stretch pb-safe z-30 shadow-[0_-4px_24px_rgba(0,0,0,0.03)]">
          <button
            onClick={() => {
              setActiveTab('map');
              setMenuShop(null);
            }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
              activeTab === 'map' ? 'text-[#007aff]' : 'text-[#8e8e93] hover:text-[#555]'
            }`}
          >
            <Map className="w-5.5 h-5.5" />
            <span className="text-[10px] font-bold tracking-tight">マップ</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('list');
              setMenuShop(null);
            }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
              activeTab === 'list' ? 'text-[#007aff]' : 'text-[#8e8e93] hover:text-[#555]'
            }`}
          >
            <ListMusic className="w-5.5 h-5.5" />
            <span className="text-[10px] font-bold tracking-tight">メニュー</span>
          </button>
        </div>

      </div>
    </div>
  );
}
