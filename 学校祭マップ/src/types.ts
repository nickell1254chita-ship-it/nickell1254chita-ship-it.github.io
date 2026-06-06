export interface MenuItem {
  name: string;
  price: number;
  badge: string | null;
  desc: string | null;
  emoji: string;
}

export interface MenuCategory {
  name: string;
  sub: string | null;
  items: MenuItem[];
}

export interface ShopMenu {
  categories: MenuCategory[];
}

export interface Shop {
  id: string;
  floor: number;
  x: number;
  y: number;
  genre: 'food' | 'attraction' | 'exhibit' | 'stage' | 'facility';
  icon: string;
  name: string;
  label: string;
  org: string;
  hours: string;
  price: string;
  desc: string;
  stars: number;
}

export interface Genre {
  name: string;
  color: string;
}
