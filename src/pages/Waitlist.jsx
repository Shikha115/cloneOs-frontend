import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Check } from "lucide-react";
import axios from "axios";
import { toast } from "../hooks/use-toast";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const API = `${BACKEND_URL}/api`;

export default function Waitlist() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/waitlist`, formData);
      setSubmitted(true);
      toast({
        title: "Success",
        description: "You're on the list!",
      });
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to join waitlist";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" data-testid="waitlist-success">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} />
          </div>
          <h1 className="font-mono text-3xl md:text-4xl font-bold tracking-tight mb-4">
            You're on the list!
          </h1>
          <p className="text-gray-600 mb-8">
            We'll reach out soon with exclusive early access and updates about CloneOS.
          </p>
          <Link 
            to="/" 
            className="retro-btn retro-btn-primary inline-flex items-center gap-2"
            data-testid="back-home-btn"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" data-testid="waitlist-page">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-12"
          data-testid="back-to-home"
        >
          <ArrowLeft size={16} />
          <span className="font-mono text-sm uppercase tracking-wider">Back</span>
        </Link>

        <div className="max-w-md">
          <img src="/cloneOsWhite.png" alt="CloneOS" className="h-8 w-auto mb-8" />
          <h1 className="font-mono text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="waitlist-title">
            Get Early Access
          </h1>
          <p className="text-gray-600 mb-8">
            Join our waitlist to be the first to know when we launch new features and exclusive access.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-mono text-sm uppercase tracking-wider text-gray-500 block mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="retro-input"
                placeholder="John Doe"
                data-testid="waitlist-name-input"
              />
            </div>

            <div>
              <label className="font-mono text-sm uppercase tracking-wider text-gray-500 block mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="retro-input"
                placeholder="john@example.com"
                data-testid="waitlist-email-input"
              />
            </div>

            <div>
              <label className="font-mono text-sm uppercase tracking-wider text-gray-500 block mb-2">
                Company (Optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="retro-input"
                placeholder="Your company"
                data-testid="waitlist-company-input"
              />
            </div>

            <div>
              <label className="font-mono text-sm uppercase tracking-wider text-gray-500 block mb-2">
                How do you plan to use CloneOS? (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="retro-input resize-none"
                placeholder="Tell us about your use case..."
                data-testid="waitlist-message-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="retro-btn retro-btn-primary w-full flex items-center justify-center gap-2 glitch-hover disabled:opacity-50"
              data-testid="waitlist-submit-btn"
            >
              {loading ? "Joining..." : (
                <>
                  Join Waitlist <Send size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-500 text-center">
            We respect your privacy. No spam, ever.
          </p>
        </div>
      </div>

      {/* Right Panel - Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F4F4F0] flex-col justify-center px-16 lg:px-24">
        <div className="max-w-md">
          <p className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-6">
            Why Join the Waitlist?
          </p>
          
          <div className="space-y-8">
            <div>
              <h3 className="font-mono text-xl font-semibold mb-2">Early Access</h3>
              <p className="text-gray-600">Be among the first to create your AI clone and start earning.</p>
            </div>
            <div>
              <h3 className="font-mono text-xl font-semibold mb-2">Exclusive Updates</h3>
              <p className="text-gray-600">Get insider information on new features and platform updates.</p>
            </div>
            <div>
              <h3 className="font-mono text-xl font-semibold mb-2">Founding Member Benefits</h3>
              <p className="text-gray-600">Special perks and pricing for early adopters.</p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-300">
            <p className="font-mono text-sm text-gray-500 mb-2">Current waitlist</p>
            <p className="font-mono text-4xl font-bold">8,432</p>
            <p className="text-gray-500">people ahead of you</p>
          </div>
        </div>
      </div>
    </div>
  );
}

