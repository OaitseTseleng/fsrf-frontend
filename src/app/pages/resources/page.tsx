'use client';

import { useEffect, useState } from 'react';
import fetchStrapi from '@/lib/fetch-service-no-graphql';
import Loader from '@/components/common/loader';

const ITEMS_PER_PAGE = 5;
const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://13.218.95.118:1337";

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

  // Email modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailList, setEmailList] = useState<string[]>([]);
  const [currentResource, setCurrentResource] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetchStrapi('resources', {
        'pagination[start]': String(page * ITEMS_PER_PAGE),
        'pagination[limit]': String(ITEMS_PER_PAGE),
        sort: 'createdAt:desc',
        'filters[title][$containsi]': search,
        populate: '*',
      });

      setResources(res.data || []);
      setTotal(res.meta?.pagination?.total || 0);
      setLoading(false);
    };

    fetchData();
  }, [page, search]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const toggleExpand = (id: number) => setExpandedId(prev => (prev === id ? null : id));

  const openEmailModal = (resource: any) => {
    setCurrentResource(resource);
    setEmailList([]);
    setEmailInput('');
    setEmailError('');
    setShowEmailModal(true);
  };

  const addEmail = () => {
    const email = emailInput.trim();
    if (email && !emailList.includes(email)) {
      setEmailList(prev => [...prev, email]);
    }
    setEmailInput('');
  };

  const handleEmailSubmit = async () => {
    if (!emailList.length || !currentResource) return;
    setIsSending(true);
    setEmailError('');

    try {
      const res = await fetch('/api/send-resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: emailList,
          resource: {
            title: currentResource.title,
            description: currentResource.description,
            downloadAllFile: currentResource.downloadAllFile?.url || null,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowEmailModal(false);
      } else {
        setEmailError(data.error || 'Failed to send email.');
      }
    } catch (error: any) {
      console.error('Email send error:', error);
      setEmailError(error.message || 'Failed to send email.');
    } finally {
      setIsSending(false);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-6">
          {resources.map(resource => {
            const isExpanded = expandedId === resource.id;
            return (
              <div
                key={resource.id}
                className="bg-[#001f3f] text-white p-6 rounded-xl shadow cursor-pointer h-auto"
                onClick={() => toggleExpand(resource.id)}
              >
                <h2 className="text-xl font-semibold mb-2">{resource.title}</h2>
                {resource.description && <p className="text-sm mb-2">{resource.description}</p>}

                {isExpanded && (
                  <>
                    {resource.steps?.map((step, i) => (
                      <div key={i} className="border-t border-white py-2">
                        <p className="font-medium">Step {i + 1}: {step.title}</p>
                        {step.description && <p className="text-sm italic mb-1">{step.description}</p>}
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
                        onClick={e => { e.stopPropagation();
                          if (resource.downloadAllFile?.url) downloadFile(resource.downloadAllFile.url);
                        }}
                        className="cursor-pointer bg-black text-white px-4 py-2 rounded hover:bg-opacity-80"
                      >
                        Download All
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); openEmailModal(resource); }}
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

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-2 right-2 text-xl"
              style={{ color: '#001f3f' }}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#001f3f' }}>
              Email "{currentResource?.title}"
            </h2>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {emailList.map((email, idx) => (
                  <span key={idx} className="bg-gray-200 text-black px-2 py-1 rounded">
                    {email}
                  </span>
                ))}
              </div>
              <input
                type="email"
                placeholder="Enter email and press Enter"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addEmail();
                  }
                }}
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              {emailError && <p className="text-red-600 text-sm">{emailError}</p>}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailSubmit}
                disabled={!emailList.length || isSending}
                className="px-4 py-2 rounded bg-[#001f3f] text-white disabled:opacity-50 flex items-center gap-2"
              >
                {isSending && (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
