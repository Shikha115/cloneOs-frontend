import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { logout } from "../../services/auth.service";
import { useToast } from "../../hooks/use-toast";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuth();
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "nav-sticky border-b border-gray-100" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <img src="/cloneOsWhite.png" alt="CloneOS" className="h-8 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="font-mono text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors" data-testid="nav-features">
              Features
            </a>
            <a href="#how-it-works" className="font-mono text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors" data-testid="nav-how-it-works">
              How it Works
            </a>
            <a href="#testimonials" className="font-mono text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors" data-testid="nav-testimonials">
              Testimonials
            </a>
            <a href="#faq" className="font-mono text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors" data-testid="nav-faq">
              FAQ
            </a>
          </div>

          {/* CTA Buttons - Show logout when logged in */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                {/* <div className="flex items-center gap-2 text-gray-600">
                  <User size={16} />
                  <span className="font-mono text-sm">{user.email}</span>
                </div> */}
                <button
                  onClick={handleLogout}
                  className="font-mono text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors flex items-center gap-2"
                  data-testid="nav-logout"
                >
                  <LogOut size={16} />
                  Logout
                </button>
                <a class="retro-btn retro-btn-primary" data-testid="nav-signup" href="/dashboard\" data-discover="true">Dashboard</a>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-mono text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors"
                  data-testid="nav-login"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="retro-btn retro-btn-primary"
                  data-testid="nav-signup"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100" data-testid="mobile-menu">
            <div className="flex flex-col gap-4">
              <a href="#features" className="font-mono text-sm uppercase tracking-wider py-2">Features</a>
              <a href="#how-it-works" className="font-mono text-sm uppercase tracking-wider py-2">How it Works</a>
              <a href="#testimonials" className="font-mono text-sm uppercase tracking-wider py-2">Testimonials</a>
              <a href="#faq" className="font-mono text-sm uppercase tracking-wider py-2">FAQ</a>
              
              {isAuthenticated && user ? (
                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex items-center gap-2 text-gray-600 py-2">
                    <User size={16} />
                    <span className="font-mono text-sm">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="font-mono text-sm uppercase tracking-wider py-2 text-left flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <Link to="/login" className="font-mono text-sm uppercase tracking-wider py-2">Login</Link>
                  <Link to="/register" className="retro-btn retro-btn-primary text-center">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

