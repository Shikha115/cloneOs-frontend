import { Shield, Eye, DollarSign, Zap } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: "Full Transparency",
      description: "Know exactly where, when, and how your AI clone is used. Complete audit trails and consent management.",
      size: "large"
    },
    {
      icon: Eye,
      title: "Total Visibility",
      description: "Real-time dashboard showing all clone interactions.",
      size: "small"
    },
    {
      icon: DollarSign,
      title: "Earn Passively",
      description: "Monetize every interaction. Set your rates, collect royalties automatically.",
      size: "small"
    },
    {
      icon: Zap,
      title: "Scale Infinitely",
      description: "Your clone can be everywhere at once. Engage millions simultaneously without lifting a finger.",
      size: "large"
    }
  ];

  return (
    <section id="features" className="py-24 md:py-32 bg-[#F4F4F0]" data-testid="features-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <p className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-4">Features</p>
          <h2 className="font-mono text-4xl md:text-5xl font-bold tracking-tight">
            Control Your <span className="iridescent-text">Digital Self</span>
          </h2>
        </div>

        <div className="bento-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`retro-card p-8 md:p-12 ${
                feature.size === "large" ? "bento-item-large" : "bento-item-small"
              } animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`feature-card-${index}`}
            >
              <feature.icon size={32} className="mb-6" strokeWidth={1.5} />
              <h3 className="font-mono text-xl md:text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
