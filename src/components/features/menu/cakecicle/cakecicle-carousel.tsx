import MenuSection from '@/components/features/menu/menu-section';
import CakecicleCard from '@/components/features/menu/cakecicle/cakecicle-card';
import { cakecicleItems } from '@/components/features/menu/data/menu-items';

export default function CakeciclesCarousel() {
  return (
    <MenuSection title="Cakecicle Magic" icon="🎂">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cakecicleItems.map((item, index) => (
          <CakecicleCard key={`cakecicle-${index}`} item={item} />
        ))}
      </div>
    </MenuSection>
  );
}