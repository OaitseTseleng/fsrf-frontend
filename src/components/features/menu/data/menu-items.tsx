import { CookieItem, CakecicleItem } from '@/components/features/menu/types/menu.d';

export const cookieItems: CookieItem[] = [
  {
    name: 'Midnight Chocolate',
    price: 4.99,
    description: '72% dark chocolate with sea salt flakes',
    image: '/images/cookies/vanilla.jpeg',
    tags: [
      { label: 'Vegan', icon: '🌱' },
      { label: 'GF', icon: '🌾' }
    ]
  },
  // Add more cookie items...
];

export const cakecicleItems: CakecicleItem[] = [
  {
    name: 'Unicorn Fantasy',
    price: 6.99,
    description: 'Vanilla cake with rainbow sprinkles core',
    image: '/images/cakecicles/vanilla.jpeg',
    tags: [
      { label: 'Vegan', icon: '🌱' },
      { label: 'GF', icon: '🌾' }
    ],
  },
  // Add more cakecicle items...
];