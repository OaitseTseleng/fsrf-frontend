'use client';

import Image from 'next/image';

interface HeroSlideProps {
  image: string;
  title: string;
  description: string;
  isActive: boolean;
}

export default function HeroSlide({ image, title, description, isActive }: HeroSlideProps) {
  return (
    <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      <Image src={image} alt={title} fill className="object-cover" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Text Box with translucent background */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
        <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl max-w-3xl text-center">
          <h2 className="text-5xl font-extrabold mb-4 drop-shadow-lg" style={{ color: 'rgb(198, 156, 59)' }}>
            {title}
          </h2>
          <p className="text-xl drop-shadow-md" style={{ color: 'rgb(192, 161, 89)' }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
