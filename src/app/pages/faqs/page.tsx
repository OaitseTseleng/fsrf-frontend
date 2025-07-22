import React from "react";
import fetchStrapi from "@/lib/fetch-3";

interface FAQItem {
  id: number;
  attributes: {
    question: string;
    answer: string;
  };
}

export default async function FAQsPage() {
  // Fetch all FAQs from Strapi
  const response = await fetchStrapi<FAQItem[]>(`/faqs?populate=*`);
  const faqs = response.data;

  return (
    <div className="min-h-screen bg-[#001F54] px-4 py-12">
      <div className="max-w-3xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
        <div className="space-y-10">
          {faqs.map(({ id, question,  answer}) => (
            <div key={id}>
              <h2 className="text-2xl font-semibold mb-2">{question}</h2>
              <p className="text-gray-200 leading-relaxed">{answer}</p>
            </div>
          ))}
          {faqs.length === 0 && (
            <p className="text-gray-300">No FAQs available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
