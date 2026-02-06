import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="min-h-screen flex items-center justify-center pt-20 hero-gradient grain-overlay"
      data-testid="hero-section"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-in">
            <p className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-6" data-testid="hero-tagline">
              Your Digital Twin Platform
            </p>
            <h1 className="font-mono text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-8" data-testid="hero-title">
              Own Your
              <br />
              <span className="iridescent-text">AI Likeness</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10 max-w-lg" data-testid="hero-description">
              Create, control, and monetize your AI clone with complete transparency. 
              Scale your presence while you sleep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="retro-btn retro-btn-primary flex items-center justify-center gap-2 glitch-hover"
                data-testid="hero-cta-primary"
              >
                Start Creating <ArrowRight size={16} />
              </Link>
              <Link
                to="/waitlist"
                className="retro-btn retro-btn-secondary flex items-center justify-center gap-2"
                data-testid="hero-cta-secondary"
              >
                Join Waitlist
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative animate-fade-in-delay-2">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1676542592529-f19af3c3e856?w=600&h=700&fit=crop"
                alt="AI Portrait"
                className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
                data-testid="hero-image"
              />

              {/* Floating stats */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 border border-gray-200 shadow-lg animate-float">
                <p className="font-mono text-xs uppercase tracking-wider text-gray-500">Active Clones</p>
                <p className="font-mono text-3xl font-bold">12,847</p>
              </div>
              <div className="absolute -top-6 -right-6 bg-black text-white p-4 animate-float" style={{ animationDelay: '0.5s' }}>
                <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Revenue Generated</p>
                <p className="font-mono text-3xl font-bold">$2.4M+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16">
          <a href="#features" className="animate-bounce">
            <ChevronDown size={32} className="text-gray-400" />
          </a>
        </div>
      </div>
    </section>
  );
}
