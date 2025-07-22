"use client";

import { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import fetchStrapi from "@/lib/fetch-3";

interface OrgSocial {
  name: string;
  slug: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}

interface PrivacyPolicyBlock {
  type: string;
  children: Array<{ text: string }>;
}

interface PrivacyPolicyData {
  data: {
    policy: PrivacyPolicyBlock[];
  };
}

export default function Footer() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [policyBlocks, setPolicyBlocks] = useState<PrivacyPolicyBlock[]>([]);
  const [orgs, setOrgs] = useState<OrgSocial[]>([]);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showWhistleModal, setShowWhistleModal] = useState(false);
  const [whistleName, setWhistleName] = useState("");
  const [whistleEmail, setWhistleEmail] = useState("");
  const [whistleMessage, setWhistleMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "";
  const NAVY = "#001f3f";

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Fetch organisation socials
    fetchStrapi<OrgSocial[]>(
      `/organisations`
    )
      .then(res => setOrgs(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);

    // Fetch privacy policy
    fetchStrapi<PrivacyPolicyData["data"]>(`/privacy-policy`)
      .then(res => res.data?.policy && setPolicyBlocks(res.data.policy))
      .catch(console.error);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleClickOutside(e: MouseEvent) {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setActiveDropdown(null);
    }
  }

  function openPrivacy() { setShowPrivacyModal(true); }
  function openWhistle() { setShowWhistleModal(true); }
  function closeModals() { setShowPrivacyModal(false); setShowWhistleModal(false); }

  async function sendWhistle() {
    const formData = new FormData();
    formData.append(
      'data',
      JSON.stringify({
        name: anonymous ? null : whistleName,
        email: anonymous ? null : whistleEmail,
        message: whistleMessage,
      })
    );
    attachments.forEach(file => formData.append('files.attachment', file));

    try {
      await fetch(`${STRAPI_URL}/api/whistleblowing-reports`, {
        method: 'POST',
        body: formData,
      });
      alert('Report submitted successfully');
      setWhistleName('');
      setWhistleEmail('');
      setWhistleMessage('');
      setAttachments([]);
      closeModals();
    } catch {
      alert('Submission failed');
    }
  }

  const renderPolicy = () =>
    policyBlocks.map((block, idx) => {
      const text = block.children.map(c => c.text).join('');
      if (block.type === 'paragraph') {
        return (
          <p key={idx} className="mb-2 text-gray-800">
            {text}
          </p>
        );
      }
      return (
        <h3 key={idx} className="text-xl font-semibold mb-3">
          {text}
        </h3>
      );
    });

  return (
    <footer className="bg-[#001f3f] text-white px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Useful Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Useful Links</h2>
          <ul className="space-y-2">
            <li>
              <button onClick={openPrivacy} className="hover:text-gray-300">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={openWhistle} className="hover:text-gray-300">
                Whistleblowing
              </button>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div ref={dropdownRef}>
          <h2 className="text-lg font-semibold mb-4">Follow Us</h2>
          <div className="flex gap-6 text-2xl relative">
            {['facebook', 'instagram', 'tiktok'].map(platform => {
              const Icon =
                platform === 'facebook'
                  ? FaFacebookF
                  : platform === 'instagram'
                  ? FaInstagram
                  : FaTiktok;
              return (
                <div key={platform} className="relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(prev =>
                        prev === platform ? null : platform
                      )
                    }
                    className="hover:text-gray-300"
                  >
                    <Icon />
                  </button>
                  {activeDropdown === platform && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white text-black p-3 rounded shadow-md text-sm space-y-1">
                      {orgs.map(o => {
                        const url = o[`${platform}Url` as keyof OrgSocial] as
                          | string
                          | undefined;
                        return url ? (
                          <a
                            key={o.slug}
                            href={url}
                            target="_blank"
                            className="block hover:text-blue-800"
                          >
                            {o.name}
                          </a>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
          <p>
            Email:{' '}
            <a href="mailto:info@fsrf.co.bw" className="hover:text-gray-300">
              info@fsrf.co.bw
            </a>
          </p>
          <p>
            Phone:{' '}
            <a href="tel:+2673567722" className="hover:text-gray-300">
              +267 3567722
            </a>
          </p>
          <p className="mt-2">Plot 1234, Gaborone, Botswana</p>
        </div>
      </div>

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-lg w-full p-6 rounded-lg relative">
            <button
              onClick={closeModals}
              style={{ color: NAVY }}
              className="absolute top-2 right-2 text-xl"
            >
              ✕
            </button>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: NAVY }}
            >
              Privacy Policy
            </h2>
            <div className="overflow-auto max-h-[60vh]">{renderPolicy()}</div>
          </div>
        </div>
      )}

      {/* Whistleblowing Modal */}
      {showWhistleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-6 rounded-lg relative">
            <button
              onClick={closeModals}
              style={{ color: NAVY }}
              className="absolute top-2 right-2 text-xl"
            >
              ✕
            </button>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: NAVY }}
            >
              Whistleblowing Report
            </h2>
            <form
              className="space-y-4"
              onSubmit={e => {
                e.preventDefault();
                sendWhistle();
              }}
            >
              <label className="block">
                <span style={{ color: NAVY }}>Name</span>
                <input
                  type="text"
                  disabled={anonymous}
                  value={whistleName}
                  onChange={e => setWhistleName(e.target.value)}
                  className="w-full border rounded p-2"
                  style={{ borderColor: NAVY }}
                />
              </label>
              <label className="block">
                <span style={{ color: NAVY }}>Email</span>
                <input
                  type="email"
                  disabled={anonymous}
                  value={whistleEmail}
                  onChange={e => setWhistleEmail(e.target.value)}
                  className="w-full border rounded p-2"
                  style={{ borderColor: NAVY }}
                />
              </label>
              <label className="block">
                <span style={{ color: NAVY }}>Message</span>
                <textarea
                  value={whistleMessage}
                  onChange={e => setWhistleMessage(e.target.value)}
                  className="w-full border rounded p-2 h-32"
                  style={{ borderColor: NAVY }}
                />
              </label>
              <div>
                <span style={{ color: NAVY }}>Attachments</span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {attachments.map((file, idx) => ( <div key={idx} className="flex items-center bg-blue-50 border border-black rounded p-2">
                      <svg className="h-5 w-5 text-black mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16c0-2.761 2.239-5 5-5s5 2.239 5 5v1H7v-1z" />
                      </svg>
                      <span className="text-black">{file.name}</span>
                    </div>))}
                  <label htmlFor="file-upload" className="flex items-center justify-center bg-white border border-black rounded p-2 cursor-pointer hover:bg-gray-100">
                    <span className="text-black">+ Add Files</span>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={e => setAttachments(prev => [...prev, ...Array.from(e.target.files || [])])}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={() => setAnonymous(a => !a)}
                />
                <span style={{ color: NAVY }}>Send anonymously</span>
              </label>
              <button
                type="submit"
                className="w-full text-center px-4 py-2 rounded"
                style={{ backgroundColor: NAVY, color: '#fff' }}
              >
                Submit Report
              </button>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
