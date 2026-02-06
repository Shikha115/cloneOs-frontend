import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "CloneOS gave me back my time. My AI clone handles fan interactions 24/7 while I focus on creating new content.",
      author: "Alex Rivera",
      role: "Content Creator, 2M+ followers"
    },
    {
      quote: "The transparency features are game-changing. I know exactly how my likeness is being used and I'm in complete control.",
      author: "Jordan Chen",
      role: "Professional Speaker"
    },
    {
      quote: "I've earned more from my AI clone in 6 months than I did from traditional appearances in 2 years.",
      author: "Morgan Blake",
      role: "Influencer & Entrepreneur"
    }
  ];

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-[#F4F4F0]" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <p className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-4">Testimonials</p>
          <h2 className="font-mono text-4xl md:text-5xl font-bold tracking-tight">
            Trusted by <span className="iridescent-text">Creators</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 border-l-2 border-black animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`testimonial-${index}`}
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#000" strokeWidth={0} />
                ))}
              </div>
              <p className="text-lg mb-6 leading-relaxed">"{testimonial.quote}"</p>
              <div>
                <p className="font-mono font-semibold">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
