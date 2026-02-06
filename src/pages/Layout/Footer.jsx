import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-16 border-t border-gray-200" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <img src="/cloneOsWhite.png" alt="CloneOS" className="h-6 w-auto mb-6" />
            <p className="text-gray-600 max-w-sm">
              The platform for creating, controlling, and monetizing your AI likeness with complete transparency.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-mono text-sm uppercase tracking-wider mb-4">Product</p>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-600 hover:text-black transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-black transition-colors">How It Works</a></li>
              <li><a href="#faq" className="text-gray-600 hover:text-black transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-sm uppercase tracking-wider mb-4">Company</p>
            <ul className="space-y-3">
              <li><Link to="/waitlist" className="text-gray-600 hover:text-black transition-colors">Contact</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-sm text-gray-500">
            © {new Date().getFullYear()} CloneOS. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-black transition-colors">
              Twitter
            </a>
            <a href="#" className="text-gray-500 hover:text-black transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-gray-500 hover:text-black transition-colors">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
