"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMenu, HiX } from "react-icons/hi";
import { usePathname } from 'next/navigation';


export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const onHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass = `transition-all duration-300 ${
    isSticky
      ? "fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-md py-2"
      : "relative w-full py-2"
  }`;

  return (
    <nav className={`${navClass} px-6 bg-white/80 border-b border-amber-100`}>
      <div className="flex justify-between items-center">
        {/* Logo and Name */}
        <div className="flex items-center gap-3">
          <span>
            <a href="/">
              <Image
                src="/images/mainlogo.png"
                alt="Logo"
                width={100}
                height={100}
                className="w-16 hover:rotate-12 transition-transform duration-300"
              />
            </a>
          </span>
          <span className="text-2xl font-bungee text-amber-900"><a href="/">At First Bite Cookies</a></span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-10 items-center">
          {/* Conditional anchor or link */}
          {onHomePage ? (
            <>
              <a href="#chooseus" className="text-lg font-bungee text-amber-900 hover:text-amber-600">Why Choose Us?</a>
              <a href="#menu" className="text-lg font-bungee text-amber-900 hover:text-amber-600">Menu</a>
            </>
          ) : (
            <>
              <Link href="/" className="text-lg font-bungee text-amber-900 hover:text-amber-600">Home</Link>
            </>
          )}

          <a href="#footer" className="text-lg font-bungee text-amber-900 hover:text-amber-600">Contact Us</a>
          <Link href="/pages/ordernow" className="text-lg font-bungee text-amber-900 hover:text-amber-600">Order Now</Link>
        </div>

        {/* Hamburger Icon - Mobile Only */}
        <button
          className="md:hidden text-amber-900 text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="flex flex-col mt-4 md:hidden gap-4 text-amber-900 text-lg">
          {/* Conditional anchor or link */}
          {onHomePage ? (
            <>
              <a href="#chooseus" className="text-lg font-bungee text-amber-900 hover:text-amber-600">Why Choose Us?</a>
              <a href="#menu" className="text-lg font-bungee text-amber-900 hover:text-amber-600">Menu</a>
            </>
          ) : (
            <>
              <Link href="/" className="text-lg font-bungee text-amber-900 hover:text-amber-600">Home</Link>
            </>
          )}

          <a href="#footer" className="text-lg font-bungee text-amber-900 hover:text-amber-600">Contact Us</a>
          <Link href="/pages/ordernow" className="text-lg font-bungee text-amber-900 hover:text-amber-600">Order Now</Link>
        </div>
      )}
    </nav>
  );
}
