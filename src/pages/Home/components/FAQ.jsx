import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "How does CloneOS protect my likeness?",
      answer: "CloneOS uses advanced AI watermarking and blockchain-based verification to ensure your clone is always traceable. Every interaction is logged, and you maintain full control over usage permissions."
    },
    {
      question: "What can my AI clone do?",
      answer: "Your clone can engage in conversations, create personalized content, conduct virtual meetings, and represent you across digital platforms - all while maintaining your unique voice and personality."
    },
    {
      question: "How do I earn money with my clone?",
      answer: "Set your own rates for different interaction types. Earnings are automatically collected through smart contracts and deposited directly to your account. You can also license your clone for specific campaigns."
    },
    {
      question: "Can I control where my clone appears?",
      answer: "Absolutely. You approve every platform and use case. Our consent management system lets you whitelist or blacklist specific applications, brands, or content types."
    },
    {
      question: "Is my data secure?",
      answer: "Your likeness data is encrypted and stored securely. We never sell or share your data. You can delete your clone and all associated data at any time."
    }
  ];

  return (
    <section id="faq" className="py-24 md:py-32" data-testid="faq-section">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="mb-16 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-4">FAQ</p>
          <h2 className="font-mono text-4xl md:text-5xl font-bold tracking-tight">
            Got <span className="iridescent-text">Questions?</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray-200 px-6 bg-white"
              data-testid={`faq-item-${index}`}
            >
              <AccordionTrigger className="font-mono text-left py-6 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
