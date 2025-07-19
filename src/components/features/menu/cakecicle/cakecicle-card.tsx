import Image from 'next/image';
import { CakecicleItem } from '@/components/features/menu/types/menu.d';

interface CakecicleCardProps {
  item: CakecicleItem;
}

export default function CakecicleCard({ item }: CakecicleCardProps) {
  return (
    <div className="group relative h-96 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* Cakecicle Image with Gradient Overlay */}
      <div className="relative h-full w-full">
        <Image 
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
      </div>

      {/* Floating Price Tag */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg z-10">
        <span className="font-bold text-amber-600">P {item.price.toFixed(2)}</span>
      </div>

      {/* Cakecicle Info (Appears on hover) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-2xl font-bold mb-1">{item.name}</h3>
        <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {item.description}
        </p>
        
        {/* Tags */}
        <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
          {item.tags.map((tag, i) => (
            <span 
              key={i}
              className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
            >
              {tag.icon} {tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
}