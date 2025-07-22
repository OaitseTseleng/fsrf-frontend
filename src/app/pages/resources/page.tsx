'use client';

import { useEffect, useState } from 'react';
import fetchStrapi from '@/lib/fetch-service-no-graphql';
import Loader from '@/components/common/loader';

const ITEMS_PER_PAGE = 5;
const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * Fetches a file from Strapi and forces a download dialog.
 */
const downloadFile = async (relativeUrl: string) => {
  try {
    const absoluteUrl = baseUrl + relativeUrl;
    const res = await fetch(absoluteUrl);
    if (!res.ok) throw new Error('Network response was not ok');

    const blob = await res.blob();
    const filename = relativeUrl.split('/').pop() || 'file';

    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objUrl);
  } catch (err) {
    console.error('Download failed', err);
    alert('Failed to download file.');
  }
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetchStrapi('resources', {
        'pagination[start]': String(page * ITEMS_PER_PAGE),
        'pagination[limit]': String(ITEMS_PER_PAGE),
        sort: 'createdAt:desc',
        'filters[title][$containsi]': search,
        populate: 'steps.file',
      });

      setResources(res.data || []);
      setTotal(res.meta?.pagination?.total || 0);
      setLoading(false);
    };

    fetchData();
  }, [page, search]);

  const handleDownloadAll = (steps: any[]) => {
    steps.forEach((step) => {
      if (step.file?.url) {
        downloadFile(step.file.url);
      }
    });
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const toggleExpand = (id: number) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="min-h-screen bg-white px-6 py-12 text-black">
      <h1 className="text-3xl font-bold mb-4 text-center">Application Resources</h1>

      <div className="max-w-xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search resources..."
          className="w-full border border-black px-4 py-2 rounded"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map(resource => {
            const isExpanded = expandedId === resource.id;
            return (
              <div
                key={resource.id}
                className="bg-[#001f3f] text-white p-6 rounded-xl shadow cursor-pointer"
                onClick={() => toggleExpand(resource.id)}
              >
                <h2 className="text-xl font-semibold mb-2">{resource.title}</h2>
                {resource.description && <p className="text-sm mb-2">{resource.description}</p>}

                {isExpanded && (
                  <>
                    {resource.steps?.map((step, i) => (
                      <div key={i} className="border-t border-white py-2">
                        <p className="font-medium">
                          Step {i + 1}: {step.title}
                        </p>
                        {step.description && (
                          <p className="text-sm italic mb-1">{step.description}</p>
                        )}
                        {step.file?.url && (
                          <button
                            onClick={e => { e.stopPropagation(); downloadFile(step.file.url); }}
                            className="cursor-pointer text-sm text-blue-300 hover:underline"
                          >
                            Download File
                          </button>
                        )}
                      </div>
                    ))}

                    <div className="mt-4 flex flex-wrap gap-4">
                      <button
                        onClick={e => { e.stopPropagation(); handleDownloadAll(resource.steps || []); }}
                        className="cursor-pointer bg-black text-white px-4 py-2 rounded hover:bg-opacity-80"
                      >
                        Download All
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); alert('Emailing feature coming soon'); }}
                        className="cursor-pointer border border-white px-4 py-2 rounded text-white hover:bg-white hover:text-[#001f3f]"
                      >
                        Email Resource
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`cursor-pointer px-3 py-1 rounded ${i === page ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
