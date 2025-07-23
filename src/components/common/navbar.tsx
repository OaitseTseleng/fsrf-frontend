"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import fetchStrapi from "@/lib/fetch-service-no-graphql"; // Import the custom fetchStrapi function

const ORGS_API_PATH = "organisations"; // Endpoint for fetching organisations

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [organisations, setOrganisations] = useState([]);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        const data = await fetchStrapi(ORGS_API_PATH); // Use fetchStrapi for the call
        setOrganisations(data?.data || []); // Assuming the data is inside the 'data' property
      } catch (err) {
        console.error("Error fetching organisations:", err);
      }
    };

    fetchOrganisations();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        aboutDropdownRef.current &&
        !aboutDropdownRef.current.contains(target)
      ) {
        setAboutDropdownOpen(false);
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
        <span className="text-xl font-semibold">FINANCIAL SERVICES REGULATORY FRAMEWORKS</span>
        <div className="flex space-x-6 items-center">
          <Link href="/" className={linkClasses}>
            Home
          </Link>
          <Link href="/pages/news" className={linkClasses}>
            News
          </Link>

          <div className="relative" ref={aboutDropdownRef}>
            <button
              onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
              className={`${linkClasses} focus:outline-none`}
            >
              About Us ▼
            </button>
            {aboutDropdownOpen && (
              <div className="absolute left-0 mt-2 bg-white border rounded-md shadow-lg w-30 max-h-96 overflow-auto z-50">
                {organisations.map((org: any) => (
                  <Link
                    key={org.id} // Use 'id' for key instead of 'slug'
                    href={`/pages/organisations/${org.slug}`} // Correct link path
                    className="block px-4 py-2 text-sm text-[#001F54] hover:bg-gray-100"
                  >
                    {org.name} {/* Access name from 'attributes' */}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/pages/resources" className={linkClasses}>
            Resources
          </Link>
        </div>
      </div>
    </nav>
  );
}
