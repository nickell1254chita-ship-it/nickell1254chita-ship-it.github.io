import React from 'react';
import {
  Utensils,
  Coffee,
  Ghost,
  Target,
  Palette,
  BookOpen,
  IceCream,
  Gamepad2,
  Soup,
  Dices,
  Cookie,
  Key,
  Pizza,
  Tv,
  Camera,
  Flame,
  Sparkles,
  Beaker,
  Cake,
  Music,
  Dna,
  Mic,
  Activity,
  Heart,
  Store,
  FolderOpen
} from 'lucide-react';

const EMOJI_ICON_MAP: Record<string, React.ComponentType<any>> = {
  '🍡': Utensils,      // たこ焼き
  '🧋': Coffee,        // タピオカミルクティー
  '👻': Ghost,         // お化け屋敷
  '🎯': Target,        // 射的
  '🎨': Palette,       // 美術部
  '📚': BookOpen,      // 文芸部
  '🍦': IceCream,      // クレープ
  '🎮': Gamepad2,      // ゲーセン
  '🍜': Soup,          // ラーメン
  '🎲': Dices,         // カジノ
  '🍩': Cookie,        // チュロス＆ドーナツ
  '🏰': Key,           // 脱出ゲーム
  '🍕': Pizza,         // ピザ
  '🎭': Tv,            // 演劇部 (VenetianMask の代わりのシネマ/テレビ)
  '📷': Camera,        // 写真部
  '🍢': Soup,          // おでん
  '🍫': Cookie,        // チョコバナナ (Cookie / スウィーツ)
  '🎪': Sparkles,      // メイドカフェ
  '🔬': Beaker,        // 科学部
  '🍰': Cake,          // ケーキ
  '☕': Coffee,        // 猫カフェ
  '💃': Music,         // ダンス
  '🧬': Dna,           // 生物部
  '🥟': Utensils,      // 餃子
  '🎤': Mic,           // メインステージ
  '🩹': Activity,      // 救護室
};

const GENRE_FALLBACK_MAP: Record<string, React.ComponentType<any>> = {
  food: Utensils,
  attraction: Gamepad2,
  exhibit: BookOpen,
  stage: Music,
  facility: Activity,
};

interface ShopIconProps {
  emoji: string;
  genre?: string;
  className?: string;
  size?: number;
  color?: string; // 指定された場合はそれを使う。ない場合はデフォルト。
}

export default function ShopIcon({
  emoji,
  genre,
  className = '',
  size = 18,
  color,
}: ShopIconProps) {
  // マッピングからアイコンコンポーネントを取得
  let IconComponent = EMOJI_ICON_MAP[emoji];

  // 見つからない場合はジャンルのフォールバック
  if (!IconComponent && genre) {
    IconComponent = GENRE_FALLBACK_MAP[genre];
  }

  // それでも見つからない場合は一般的なストア
  if (!IconComponent) {
    IconComponent = Store;
  }

  // デフォルト色
  const defaultColors: Record<string, string> = {
    food: '#ff7043',       // 飲食（オレンジ）
    attraction: '#ab47bc', // アトラクション（パープル）
    exhibit: '#29b6f6',    // 展示（ライトブルー）
    stage: '#ec407a',      // ステージ（ピンク）
    facility: '#8e8e93',   // 施設（グレー）
  };

  const finalColor = color || (genre ? defaultColors[genre] : '#555555');

  return (
    <IconComponent
      size={size}
      className={className}
      style={{ color: finalColor }}
      strokeWidth={2.5}
    />
  );
}
