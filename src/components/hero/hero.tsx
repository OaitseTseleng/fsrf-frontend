'use client';

import { useEffect, useRef, useState } from 'react';
import { gql } from '@apollo/client';
import HeroSlide from './hero-slide';
import Loader from '@/components/common/loader';
import fetch from '@/lib/fetch-service';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '@/css/calendar-custom.css';

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

const EVENTS_QUERY = gql`
  query {
    events {
      documentId
      title
      date
      location
    }
  }
`;

const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface Slide {
  title: string;
  description: string;
  image: string;
}

interface Event {
  documentId: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export default function Hero() {
  const { data: heroData, loading: heroLoading, error: heroError } = fetch(HERO_QUERY);
  const { data: eventData, loading: eventLoading, error: eventError } = fetch(EVENTS_QUERY);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [height, setHeight] = useState('100vh');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clickedDate, setClickedDate] = useState<Date | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  const slides: Slide[] =
    heroData?.heroItems?.map((slide: any): Slide => ({
      title: slide.title,
      description: slide.description,
      image: baseUrl + slide.image?.url,
    })) || [];

  const events: Event[] = eventData?.events || [];
  const upcomingEvents = events.filter((event) => new Date(event.date) >= new Date());

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

  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  if (heroLoading || eventLoading) return <div className="text-white p-6"><Loader /></div>;

  if (heroError || eventError)
    return (
      <div className="text-red-500 bg-red-100 border border-red-400 p-4 rounded-md m-4">
        <h2 className="font-bold">Something went wrong</h2>
        <p>{heroError?.message || eventError?.message || 'Unable to load content.'}</p>
      </div>
    );

  const eventsOnDate = (date: Date) => {
    const formatted = date.toISOString().split('T')[0];
    return events.filter((e) => e.date.startsWith(formatted));
  };

  const handleDateClick = (date: Date) => {
    setClickedDate(date);
  };

  // Handle previous and next buttons for web
  const handlePrevSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const handleNextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* HERO SECTION */}
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

      {/* EVENTS + CALENDAR SECTION */}
      <section className="w-full flex flex-col md:flex-row bg-white">
        {/* Left: Upcoming Events */}
        <div className="md:w-[70%] w-full bg-[#001f3f] text-white p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
          <div className="w-full overflow-hidden">
            <div
              ref={sliderRef}
              className="flex gap-4 min-w-full overflow-x-auto whitespace-nowrap scrollbar-hide"
            >
              {(upcomingEvents.length > 0
                ? [...upcomingEvents, ...upcomingEvents]
                : []
              ).map((event, idx) => (
                <div
                  key={`${event.documentId}-${idx}`}
                  className="min-w-[250px] bg-[#003366] p-4 rounded-md shadow-md flex-shrink-0"
                >
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-300">
                    {new Date(event.date).toDateString()}
                  </p>
                  <p className="text-sm mt-1">{event.location}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Web: Add Prev and Next buttons for the event slider */}
          <div className="hidden md:flex justify-between pt-5">
            <button onClick={handlePrevSlide} className="bg-[#003366] text-white px-4 py-2 rounded-md">
              Prev
            </button>
            <button onClick={handleNextSlide} className="bg-[#003366] text-white px-4 py-2 rounded-md">
              Next
            </button>
          </div>
        </div>

        {/* Right: Calendar */}
        <div className="md:w-[30%] w-full bg-white text-[#001f3f] p-4 flex flex-col justify-center items-center md:items-start">
          <h2 className="text-lg font-bold mb-2">Event Calendar</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={({ date }) => {
              const dayEvents = eventsOnDate(date);
              if (dayEvents.length > 0) {
                const isPast = new Date(date) < new Date();
                return isPast ? 'event-day-red' : 'event-day-green';
              }
              return '';
            }}
            onClickDay={handleDateClick}
            className="w-full md:w-auto" // Full width on mobile and auto on desktop
          />

          {clickedDate && (
            <div className="mt-4 p-4 bg-[#001f3f] text-white rounded-md shadow-lg">
              <h3 className="text-xl font-semibold">
                Events on {clickedDate.toDateString()}
              </h3>
              <div className="space-y-2 mt-4">
                {eventsOnDate(clickedDate).map((e) => (
                  <div key={e.documentId} className="p-2 bg-[#003366] rounded-md">
                    <strong>{e.title}</strong>
                    <p className="text-sm">{new Date(e.date).toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
