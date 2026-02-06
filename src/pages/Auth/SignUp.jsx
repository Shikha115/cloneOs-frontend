import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useRegister } from "../../services/auth.service";

export default function SignUp() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutateAsync: doRegister, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      await doRegister(formData);
      toast({
        title: "Success",
        description: "Registration successful!",
      });
      navigate("/login");
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Failed to create account";
      toast({
        title: "Registration Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const features = [
    "Create unlimited AI clones",
    "Full transparency dashboard",
    "Monetize your likeness",
    "24/7 support"
  ];

  return (
    <div className="min-h-screen flex" data-testid="signup-page">
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
          <h1 className="font-mono text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="signup-title">
            Create Your Account
          </h1>
          <p className="text-gray-600 mb-8">
            Start building your AI clone today.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-mono text-sm uppercase tracking-wider text-gray-500 block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="retro-input"
                placeholder="john@example.com"
                data-testid="signup-email-input"
              />
            </div>

            <div className="relative">
              <label className="font-mono text-sm uppercase tracking-wider text-gray-500 block mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="retro-input pr-12"
                placeholder="Create a password"
                data-testid="signup-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-3 text-gray-400 hover:text-black"
                data-testid="toggle-password"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <label className="font-mono text-sm uppercase tracking-wider text-gray-500 block mb-2">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="retro-input pr-12"
                placeholder="Confirm your password"
                data-testid="signup-confirm-password-input"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 bottom-3 text-gray-400 hover:text-black"
                data-testid="toggle-confirm-password"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="retro-btn retro-btn-primary w-full glitch-hover disabled:opacity-50"
              data-testid="signup-submit-btn"
            >
              {isPending ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-black font-mono hover:underline" data-testid="login-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white flex-col justify-center px-16 lg:px-24">
        <h2 className="font-mono text-3xl font-bold mb-8">
          Everything you need to <span className="iridescent-text">own your likeness</span>
        </h2>
        
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                <Check size={14} />
              </div>
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 p-6 bg-white/5 border border-white/10">
          <p className="text-gray-400 text-sm mb-2">Trusted by</p>
          <p className="font-mono text-4xl font-bold">12,000+</p>
          <p className="text-gray-400">creators worldwide</p>
        </div>
      </div>
    </div>
  );
}

