import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="footer" className="bg-amber-900 text-white px-6 py-10">
      {/* Top: Two Halves */}
      <div className="flex flex-col md:flex-row text-center md:text-left items-start md:items-start">
        {/* Left Half - Contact Info */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-center justify-start">
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p>Email: <a href="mailto:info@atfirstbitecookies.co.bw" className="hover:text-amber-300 transition-colors">info@atfirstbitecookies.co.bw</a></p>
          <p>Phone: <a href="tel:+26776597672" className="hover:text-amber-300 transition-colors">+267 76597672</a></p>
          <p>WhatsApp: <a href="https://wa.me/76597672" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">+267 76597672</a></p>
        </div>

        {/* Right Half - Social Links */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-center justify-start">
          <h2 className="text-xl font-semibold mb-2">Follow Us</h2>
          <div className="flex gap-6 text-2xl">
            <a href="https://facebook.com/At-First-Bite-Cookies" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">
              <FaInstagram />
            </a>
            <a href="https://tiktok.com/@atfirstbitecookie" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom: Rights Info */}
      <div className="text-center mt-8 text-sm border-t border-white/30 pt-4">
        <p>© {new Date().getFullYear()} At First Bite Cookies. All rights reserved.</p>
        <p>Built with ❤️ by  <span className="font-semibold "><a href="https://tiktok.com">Gimble</a></span>.</p>
      </div>
    </footer>
  );
}
