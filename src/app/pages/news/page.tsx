"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/common/loader";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import fetchStrapi from "@/lib/fetch-service-no-graphql";

const ITEMS_PER_PAGE = 2;
const MOBILE_ITEMS_PER_PAGE = 5;
const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://13.218.95.118:1337";

interface NewsItem {
  id: number;
  documentId: string;
  title: string;
  articleDate: string;
  article: any; // changed type to 'any' to accommodate complex article data
  mainPicture: { url: string };
  gallery: { url: string }[];
}

interface NewsCollection {
  data: {
    id: number;
    attributes: {
      documentId: string;
      title: string;
      articleDate: string;
      article: any; // changed type to 'any' to accommodate complex article data
      mainPicture: { data: { attributes: { url: string } } };
      gallery: { data: { attributes: { url: string } }[] };
    };
  }[];
  meta: {
    pagination: {
      total: number;
      page: number;
      pageCount: number;
      pageSize: number;
    };
  };
}

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [desktopPage, setDesktopPage] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const fetchNews = async (page: number, perPage: number) => {
    setLoading(true);
    try {
      const res = await fetchStrapi<NewsCollection>("news-items", {
        "pagination[start]": String(page * perPage),
        "pagination[limit]": String(perPage),
        sort: "articleDate:desc",
        populate: "*",
      });

      const items = res.data.map(({ id, documentId, title, articleDate, article, mainPicture, gallery }) => ({
        id,
        documentId,
        title,
        articleDate,
        article,
        mainPicture,
        gallery
      }));

      setNewsItems(items);
      setTotalPages(res.meta.pagination.pageCount);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const page = isMobile ? mobilePage : desktopPage;
    const perPage = isMobile ? MOBILE_ITEMS_PER_PAGE : ITEMS_PER_PAGE;
    fetchNews(page, perPage);
  }, [desktopPage, mobilePage, isMobile]);

  const Card = ({ item }: { item: NewsItem }) => (
    <div
      onClick={() => {
        setSelected(item);
        if (isMobile) setModalOpen(true);
      }}
      className="rounded-xl overflow-hidden shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
    >
      <div className="relative w-full h-40 sm:h-48 md:h-56">
        <Image
          src={baseUrl + item.mainPicture.url}
          alt={item.title}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="bg-white p-3">
        <h3 className="text-md md:text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
        <p className="text-xs text-gray-500">{formatDate(item.articleDate)}</p>
      </div>
    </div>
  );

  const renderArticleContent = (article: any) => {
    return article.map((block, index) => {
      if (block.type === "paragraph") {
        const text = block.children?.[0]?.text || "";
        return (
          <p key={index} className="my-4 text-gray-800 leading-relaxed whitespace-pre-line">
            {text.trim() === "" ? <br /> : text}
          </p>
        );
      }
      return null;
    });
  };

  if (error) {
    return (
      <div className="text-red-600 p-4 border border-red-300 rounded bg-red-100">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <section className="bg-gray-100 px-4 py-6">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
        Latest News
      </h2>

      {/* Check if there are no news items */}
      {newsItems.length === 0 && !loading && (
        <p className="text-center text-gray-500">No news available.</p>
      )}

      {/* Desktop View */}
      {!isMobile && newsItems.length > 0 && (
        <div className="md:flex gap-6">
          <div className="w-1/3 space-y-4">
            {newsItems.map((item) => (
              <div key={item.id} className={selected?.id === item.id ? "ring ring-blue-500 rounded-xl" : ""}>
                <Card item={item} />
              </div>
            ))}
            {loading && <Loader />}

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setDesktopPage((p) => Math.max(0, p - 1))}
                disabled={desktopPage === 0}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setDesktopPage((p) => p + 1)}
                disabled={desktopPage + 1 >= totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* Detail View */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow max-h-[calc(150vh-150px)] overflow-y-auto">
            {selected ? (
              <>
                {/* Title and Date */}
                <h3 className="text-3xl font-bold text-gray-800">{selected.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{formatDate(selected.articleDate)}</p>

                {/* Main Image */}
                <div className="relative w-full h-60 mb-4">
                  <Image
                    src={baseUrl + selected.mainPicture.url}
                    alt={selected.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>

                {/* Gallery Carousel */}
                {selected.gallery && selected.gallery.length > 0 && (
                  <div className="mb-6 overflow-x-auto flex space-x-4">
                    {selected.gallery.map((img, i) => (
                      <div key={i} className="min-w-[300px]">
                        <Image
                          src={baseUrl + img.url}
                          alt={`Gallery ${i + 1}`}
                          width={300}
                          height={200}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Article Content */}
                <div className="prose prose-lg text-gray-800">
                  {renderArticleContent(selected.article)}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">Select a news item to view details.</p>
            )}
          </div>
        </div>
      )}

      {/* Mobile View */}
      {isMobile && (
        <>
          <div className="space-y-4">
            {newsItems.map((item) => (
              <Card key={item.id} item={item} />
            ))}
            {loading && <Loader />}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setMobilePage((p) => Math.max(0, p - 1))}
              disabled={mobilePage === 0}
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setMobilePage((p) => p + 1)}
              disabled={mobilePage + 1 >= totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Modal */}
          <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white rounded-lg shadow max-h-[90vh] overflow-y-auto w-full max-w-md p-6">
                {selected && (
                  <>
                    <Dialog.Title className="text-xl font-bold mb-2">{selected.title}</Dialog.Title>
                    <p className="text-sm text-gray-500 mb-4">{formatDate(selected.articleDate)}</p>
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={baseUrl + selected.mainPicture.url}
                        alt={selected.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <div
                      className="prose prose-sm text-gray-800"
                      dangerouslySetInnerHTML={{ __html: selected.article }}
                    />
                    <div className="mt-4 text-right">
                      <button
                        onClick={() => setModalOpen(false)}
                        className="px-4 py-2 bg-gray-700 text-white rounded"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </div>
          </Dialog>
        </>
      )}
    </section>
  );
}
