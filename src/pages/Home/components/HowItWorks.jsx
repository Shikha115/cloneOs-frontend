import { ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Clone",
      description: "Upload your likeness data - voice samples, images, and personality traits. Our AI builds your digital twin."
    },
    {
      number: "02",
      title: "Set Your Terms",
      description: "Define how your clone can be used. Set pricing, approve use cases, and establish boundaries."
    },
    {
      number: "03",
      title: "Go Live & Earn",
      description: "Deploy your clone across platforms. Track usage, collect earnings, and scale your presence."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32" data-testid="how-it-works-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <p className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-4">Process</p>
          <h2 className="font-mono text-4xl md:text-5xl font-bold tracking-tight">
            How It <span className="iridescent-text">Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
              data-testid={`step-${index}`}
            >
              <div className="mb-6">
                <span className="font-mono text-6xl md:text-7xl font-bold text-gray-100">{step.number}</span>
              </div>
              <h3 className="font-mono text-xl md:text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 right-0 translate-x-1/2">
                  <ArrowRight size={24} className="text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
