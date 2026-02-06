import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 md:py-32 bg-black text-white" data-testid="cta-section">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <h2 className="font-mono text-4xl md:text-6xl font-bold tracking-tight mb-8">
          Ready to Create Your <span className="iridescent-text">Digital Twin?</span>
        </h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Join thousands of creators who are scaling their presence and earning while they sleep.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="retro-btn bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2 glitch-hover"
            data-testid="cta-signup"
          >
            Get Started Free <ArrowRight size={16} />
          </Link>
          <Link
            to="/waitlist"
            className="retro-btn border border-gray-700 text-white hover:bg-gray-900 flex items-center justify-center gap-2"
            data-testid="cta-waitlist"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
