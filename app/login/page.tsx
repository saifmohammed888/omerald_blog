export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Login</h1>
        <p className="text-gray-600">Welcome back to Omerald</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <form className="space-y-6">
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
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password *
            </label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="remember" 
              name="remember" 
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-700 cursor-pointer">
              Remember me
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  )
}

