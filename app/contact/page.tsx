export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative pb-4">
          Contact Us
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-primary-500 to-primary-400 rounded"></span>
        </h1>
        <p className="text-lg text-gray-600">
          You can send contact enquiry
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Name *
            </label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
              Subject *
            </label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              required 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              placeholder="What is this about?"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
              Message *
            </label>
            <textarea 
              id="message" 
              name="message" 
              required 
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-vertical"
              placeholder="Your message here..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Send Message
          </button>
        </form>
      </div>

      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 md:p-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Get In Touch</h2>
        <p className="text-gray-700 leading-relaxed">
          For any inquiries, suggestions, or feedback, please feel free to contact us. 
          We are here to help and would love to hear from you.
        </p>
      </div>
    </div>
  )
}

