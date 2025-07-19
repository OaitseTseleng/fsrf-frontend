'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import SlideModal from './news-slide';
import Loader from '@/components/common/loader';
import fetch from '@/lib/fetch-service';
import Image from 'next/image';

const NEWS_QUERY = gql`
  query {
    newsItems {
      documentId
      title
      articleDate
      article
      mainPicture {
        url
      }
    }
  }
`;

const baseUrl = 'http://localhost:1337';

export default function NewsSection() {
  const { data, error, loading } = fetch(NEWS_QUERY);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  if (loading) return <div className="text-white p-6"><Loader /></div>;
  if (error) return (
    <div className="text-red-500 bg-red-100 border border-red-400 p-4 rounded-md m-4">
      <h2 className="font-bold">Something went wrong</h2>
      <p>{error.message || 'Unable to load news items. Please try again later.'}</p>
    </div>
  );

  const handleOpen = (item: any) => {
    const formattedDate = formatDate(item.articleDate);
    setSelected({
      id: item.documentId,
      title: item.title,
      date: formattedDate,
      image: item.mainPicture?.url || '',
    });
    setModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }); // dd/mm/yyyy
  };

  return (
    <section className="px-4 py-6 bg-black">
      <h2 className="text-3xl font-bold text-white mb-4">Latest News</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {data?.newsItems?.map((item: any) => (
          <div
            key={item.documentId}
            onClick={() => handleOpen(item)}
            className="relative cursor-pointer h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition"
          >
          <Image
            src={`${baseUrl}${item.mainPicture?.url}`} // use a fallback image if URL is empty
            alt={item.title}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="absolute inset-0"
          />
          <div className="relative z-10 p-4">
            {/* Your title, date, and content */}
            <h3 className="font-semibold text-xl text-white">{item.title}</h3>
            <p className="text-xs text-gray-400">{new Date(item.articleDate).toLocaleDateString('en-GB')}</p>
          </div>
          </div>
        ))}
      </div>

      {selected && (
        <SlideModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          content={selected}
        />
      )}
    </section>
  );
}
