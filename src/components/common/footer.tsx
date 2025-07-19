"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";

export default function Footer() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <footer className="bg-[#001f3f] text-white px-6 py-12 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Column 1: Useful Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Useful Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="/privacy-policy" className="hover:text-gray-300">Privacy Policy</a>
            </li>
            <li>
              <a href="/whistleblowing" className="hover:text-gray-300">Whistleblowing</a>
            </li>
            <li>
              <a href="/about" className="hover:text-gray-300">About Us</a>
            </li>
          </ul>
        </div>

        {/* Column 2: Socials */}
        <div ref={dropdownRef}>
          <h2 className="text-lg font-semibold mb-4">Follow Us</h2>
          <div className="flex justify-start gap-8 text-2xl relative">
            {/* Facebook */}
            <div className="relative">
              <button
                onClick={() =>
                  setActiveDropdown((prev) => (prev === "facebook" ? null : "facebook"))
                }
                className="hover:text-gray-300"
              >
                <FaFacebookF />
              </button>
              {activeDropdown === "facebook" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white text-black text-sm rounded shadow-md p-3 space-y-2 w-52 z-50">
                  <a href="https://facebook.com/@org1" target="_blank" className="block hover:text-blue-800">BoB</a>
                  <a href="https://facebook.com/org2" target="_blank" className="block hover:text-blue-800">FIA</a>
                  <a href="https://facebook.com/org3" target="_blank" className="block hover:text-blue-800">NBFIRA</a>
                </div>
              )}
            </div>

            {/* Instagram */}
            <div className="relative">
              <button
                onClick={() =>
                  setActiveDropdown((prev) => (prev === "instagram" ? null : "instagram"))
                }
                className="hover:text-gray-300"
              >
                <FaInstagram />
              </button>
              {activeDropdown === "instagram" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white text-black text-sm rounded shadow-md p-3 space-y-2 w-52 z-50">
                  <a href="https://instagram.com/@org1" target="_blank" className="block hover:text-pink-700">BoB</a>
                  <a href="https://instagram.com/org2" target="_blank" className="block hover:text-pink-700">FIA</a>
                  <a href="https://instagram.com/org3" target="_blank" className="block hover:text-pink-700">NBFIRA</a>
                </div>
              )}
            </div>

            {/* TikTok */}
            <div className="relative">
              <button
                onClick={() =>
                  setActiveDropdown((prev) => (prev === "tiktok" ? null : "tiktok"))
                }
                className="hover:text-gray-300"
              >
                <FaTiktok />
              </button>
              {activeDropdown === "tiktok" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white text-black text-sm rounded shadow-md p-3 space-y-2 w-52 z-50">
                  <a href="https://tiktok.com/@org1" target="_blank" className="block hover:text-black">BoB</a>
                  <a href="https://tiktok.com/@org2" target="_blank" className="block hover:text-black">FIA</a>
                  <a href="https://tiktok.com/@org3" target="_blank" className="block hover:text-black">NBFIRA</a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Contact Info */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
          <p>
            Email:{" "}
            <a href="mailto:info@atfirstbitecookies.co.bw" className="hover:text-gray-300">
              info@atfirstbitecookies.co.bw
            </a>
          </p>
          <p>
            Phone:{" "}
            <a href="tel:+26776597672" className="hover:text-gray-300">
              +267 76597672
            </a>
          </p>
          <p>
            WhatsApp:{" "}
            <a
              href="https://wa.me/26776597672"
              target="_blank"
              className="hover:text-gray-300"
              rel="noopener noreferrer"
            >
              +267 76597672
            </a>
          </p>
          <p className="mt-2">Plot 1234, Gaborone, Botswana</p>
        </div>
      </div>

      {/* Bottom: Rights Info */}
      <div className="text-center mt-12 text-xs border-t border-white/20 pt-4">
        <p>© {new Date().getFullYear()} FINANCIAL SERVICES REGULATORY FRAMEWORKS. All rights reserved.</p>
        <p>
          Built by{" "}
          <a href="https://tiktok.com/@gimble" className="font-semibold hover:text-gray-300">
            Gimble
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
