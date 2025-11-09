import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.jpg"
                  alt="Omerald Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold gradient-text">Omerald</h3>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Creating a sustainable, upgrading and updating medical system everyday.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Site Overview</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/articles" className="text-gray-300 hover:text-white transition-colors">Articles</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/user-agreement" className="text-gray-300 hover:text-white transition-colors">User Agreement</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Mission</h4>
            <p className="text-gray-300 leading-relaxed">
              A Medical Ecosystem to bring back glorious Indian Medical System along with all other proven 
              medical systems all around the world to bring best medical care to Indians belonging to various walks of life.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; Copyright 2025 - Omerald. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

