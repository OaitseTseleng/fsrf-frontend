"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const navbarClasses = scrolled
    ? "bg-white text-[#001F54] shadow"
    : "bg-white text-[#001F54] ";

  const linkClasses = scrolled
    ? "text-[#001F54] hover:text-blue-600"
    : "text-[#001F54] hover:text-blue-600";

  return (
    <nav className={`sticky top-0 z-50 transition-colors ${navbarClasses}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <span>
          <a href="/">
            <Image
              src="/images/mainlogo.jpg"
              alt="Logo"
              width={100}
              height={100}
              className="w-16 hover:rotate-12 transition-transform duration-300"
            />
          </a>
        </span>
        <div className="flex space-x-6 items-center">
          <Link href="/" className={linkClasses}>
            Home
          </Link>
          <Link href="/about" className={linkClasses}>
            About
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`${linkClasses} focus:outline-none`}
            >
              Organisations ▼
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded shadow-lg">
                <Link
                  href="/orgs/list"
                  className="block px-4 py-2 text-[#001F54] hover:bg-gray-100"
                >
                  View All Orgs
                </Link>
                <Link
                  href="/orgs/register"
                  className="block px-4 py-2 text-[#001F54] hover:bg-gray-100"
                >
                  Register Org
                </Link>
              </div>
            )}
          </div>
          <Link href="/contact" className={linkClasses}>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
