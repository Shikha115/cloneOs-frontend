import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useAuthStore } from "../../store/auth.store";
import { useLogin } from "../../services/auth.service";



export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAuth } = useAuthStore();
  const { mutateAsync: doLogin, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await doLogin(formData);
      setAuth(result.data.token, result.data.user);
      toast({
        title: "Success",
        description: result.message || "Welcome back!",
      });
      navigate("/");
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Invalid credentials";
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" data-testid="login-page">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-12"
          data-testid="back-to-home"
        >
          <ArrowLeft size={16} />
          <span className="font-mono text-sm uppercase tracking-wider">Back</span>
        </Link>

        <img src="/cloneOsWhite.png" alt="CloneOS" className="h-8 w-auto mb-8" />
        <h1 className="font-mono text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="login-title">
          Welcome Back
        </h1>
        <p className="text-gray-600 mb-8">
          Sign in to access your dashboard.
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
              data-testid="login-email-input"
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
              className="retro-input pr-12"
              placeholder="Your password"
              data-testid="login-password-input"
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

          <button
            type="submit"
            disabled={isPending}
            className="retro-btn retro-btn-primary w-full glitch-hover disabled:opacity-50"
            data-testid="login-submit-btn"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-black font-mono hover:underline" data-testid="signup-link">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

