'use client';

import { useEffect, useState } from 'react';
import HeroSlide from './hero-slide';

const slides = [
  {
    image: '/images/heroSlides/brown.jpeg',
    title: 'Delicious Cookies Delivered',
    description: 'Freshly baked goodness, right at your doorstep.',
  },
  {
    image: '/images/heroSlides/blue.jpeg',
    title: 'Treat Yourself Today',
    description: 'Every bite brings joy and comfort.',
  },
  {
    image: '/images/heroSlides/white.jpg',
    title: 'Baked with Love',
    description: 'Made with care using premium ingredients.',
  },
  // ➕ Add up to 10 slides here
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[300px] w-full overflow-hidden px-1 py-1">
      {slides.map((slide, index) => (
        <HeroSlide
          key={index}
          image={slide.image}
          title={slide.title}
          description={slide.description}
          isActive={index === currentIndex}
        />
      ))}
    </section>
  );
}
