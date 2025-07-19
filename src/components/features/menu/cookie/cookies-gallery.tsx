// CookiesGallery.tsx
import MenuSection from '@/components/features/menu/menu-section';
import CookieCard from '@/components/features/menu/cookie/cookie-card';
import { cookieItems } from '@/components/features/menu/data/menu-items';

const CookiesGallery = () => (
  <MenuSection title="Cookie Collection" icon="🍪">
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cookieItems.map((item, index) => (
        <CookieCard key={`cookie-${index}`} item={item} />
      ))}
    </div>
  </MenuSection>
);

export default CookiesGallery;