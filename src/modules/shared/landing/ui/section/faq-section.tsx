import React from 'react';
import { SectionTitle } from '../component/common/section-title';
import { FaqItem } from '../component/faq/faq-item';

export const FaqSection = () => {
  const faqs = [
    {
      question: 'What is Ekofy and how is it different from other streaming platforms?',
      answer:
        'Ekofy is a unique platform that empowers independent artists by providing tools to upload music, offer custom services, and connect directly with listeners. Unlike traditional streaming services, we focus on artist-listener interaction, allowing fans to request custom work and artists to monetize their skills beyond just streaming.',
    },
    {
      question: 'How do artists earn money on Ekofy?',
      answer:
        'Artists earn through multiple revenue streams: streaming royalties, custom service packages, direct commissions from listeners, and exclusive content offerings. We provide transparent royalty management and integrated payment solutions, ensuring artists receive fair compensation for their work.',
    },
    {
      question: 'Can I use Ekofy as a listener without being an artist?',
      answer:
        'Absolutely! Ekofy offers a rich listening experience with personalized recommendations, curated playlists, and the unique ability to interact with artists directly. You can discover independent music, support your favorite artists, and even request custom tracks or collaborations.',
    },
    {
      question: 'What are service packages and how do they work?',
      answer:
        'Service packages are customizable offerings created by artists. These can include custom song commissions, production services, mixing and mastering, vocal features, or any other musical service. Artists set their prices and terms, and listeners can browse and purchase these services directly through the platform.',
    },
    {
      question: 'Is my payment information secure on Ekofy?',
      answer:
        'Yes, we use industry-standard encryption and secure payment gateways to protect all transactions. We integrate with trusted payment providers like Stripe to ensure your financial information is safe and secure. We never store sensitive payment details on our servers.',
    },
    {
      question: 'How does Ekofy ensure fair royalty distribution?',
      answer:
        'We use transparent royalty management systems that track every stream and transaction. Artists can view detailed analytics and revenue breakdowns in real-time. Our payment structure is designed to give artists a fair share of revenue, with clear terms and no hidden fees.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer:
        'Yes, you can cancel your subscription at any time without penalties. If you cancel, you will continue to have access to premium features until the end of your current billing period. You can also easily resubscribe whenever you want.',
    },
    {
      question: 'What audio quality does Ekofy support?',
      answer:
        'Ekofy supports high-quality audio streaming with multiple quality options. Free users get standard quality, while Premium and Pro subscribers enjoy high-fidelity streaming for the best listening experience.',
    },
  ];

  return (
    <section id="faq" className="py-20 px-4 bg-main-dark-bg-1">
      <div className="max-w-4xl mx-auto">
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about Ekofy"
          centered
          className="mb-16"
        />
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};
