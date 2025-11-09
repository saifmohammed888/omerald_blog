import Link from 'next/link'

export default function FAQPage() {
  const faqs = [
    {
      question: "What is Omerald?",
      answer: "Omerald is a medical ecosystem platform dedicated to bringing back the glorious Indian Medical System along with all other proven medical systems from around the world. Our mission is to provide the best medical care to Indians belonging to various walks of life."
    },
    {
      question: "How can I access articles on Omerald?",
      answer: "You can browse all articles by visiting the Articles page. Our articles cover various health topics, wellness practices, and medical insights. All articles are free to read and share."
    },
    {
      question: "What are Health Topics?",
      answer: "Health Topics are curated collections of information about specific health conditions, wellness practices, and medical subjects. These topics help you understand various aspects of health and wellness in a structured way."
    },
    {
      question: "Can I contribute articles to Omerald?",
      answer: "Yes! We welcome contributions from medical professionals, health experts, and writers. Please contact us through our Contact Us page to learn more about our submission process."
    },
    {
      question: "Is the information on Omerald medically verified?",
      answer: "We strive to provide accurate and reliable health information. Our articles are reviewed by medical professionals, but please consult with your healthcare provider for personalized medical advice."
    },
    {
      question: "How do I contact Omerald?",
      answer: "You can reach us through our Contact Us page. We typically respond within 24-48 hours. For urgent matters, please use the contact form on our website."
    },
    {
      question: "Are the articles available in multiple languages?",
      answer: "Currently, our articles are primarily in English. We are working on expanding to include content in regional Indian languages to make health information more accessible."
    },
    {
      question: "Can I share articles from Omerald?",
      answer: "Yes, you are welcome to share our articles. We encourage sharing knowledge about health and wellness. Please ensure proper attribution when sharing our content."
    },
    {
      question: "How often is new content published?",
      answer: "We regularly publish new articles and health topics. Subscribe to our updates or check back frequently to stay informed about the latest health and wellness information."
    },
    {
      question: "Is there a mobile app for Omerald?",
      answer: "Currently, Omerald is available as a web platform optimized for mobile devices. We are working on developing a dedicated mobile app for better accessibility."
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative pb-4">
          Frequently Asked Questions
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded"></span>
        </h1>
        <p className="text-lg text-gray-600">
          Find answers to common questions about Omerald and our services
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {faq.question}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6">
          If you couldn&apos;t find the answer you&apos;re looking for, please feel free to contact us.
        </p>
        <Link 
          href="/contact" 
          className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Contact Us
        </Link>
      </div>
    </div>
  )
}

