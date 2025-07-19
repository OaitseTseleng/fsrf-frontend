export interface MenuTag {
  label: string;
  icon: string;
}

export interface Flavor {
  name: string;
  color: string;
}

export interface MenuItem {
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface CookieItem extends MenuItem {
  tags: MenuTag[];
}

export interface CakecicleItem extends MenuItem {
  tags: MenuTag[];
}