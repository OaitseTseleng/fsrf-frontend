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
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Text Box with navy background */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
        <div className="bg-[#0a1a2f]/80 backdrop-blur-md p-6 rounded-xl max-w-3xl text-center border border-white/10">
          <h2 className="text-5xl font-extrabold mb-4 drop-shadow-lg text-white">
            {title}
          </h2>
          <p className="text-xl drop-shadow text-[#d0d0d0]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
