'use client';

import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import HeroSlide from './hero-slide';
import Loader from '@/components/common/loader';
import fetch from '@/lib/fetch-service';

const HERO_QUERY = gql`
  query {
    heroItems {
      title
      description
      image {
        url
      }
    }
  }
`;

const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface Slide {
  title: string;
  description: string;
  image: string;
}

export default function Hero() {
  const { data, loading, error } = fetch(HERO_QUERY);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [height, setHeight] = useState('100vh');

  useEffect(() => {
    const updateHeight = () => {
      const nav = document.querySelector('nav');
      const navHeight = nav?.clientHeight || 0;
      setHeight(`calc(100vh - ${navHeight}px)`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const slides: Slide[] = data?.heroItems?.map((slide: any): Slide => ({
    title: slide.title,
    description: slide.description,
    image: baseUrl + slide.image?.url,
  })) || [];

  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  if (loading) {
    return <div className="text-white p-6"><Loader /></div>;
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-100 border border-red-400 p-4 rounded-md m-4">
        <h2 className="font-bold">Something went wrong</h2>
        <p>{error.message || 'Unable to load hero slides. Please try again later.'}</p>
      </div>
    );
  }

  return (
    <section
      style={{ height }}
      className="relative w-full overflow-hidden px-1 py-1 transition-all duration-300 ease-in-out"
    >
      {slides.map((slide: Slide, index: number) => (
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
