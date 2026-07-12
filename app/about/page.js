export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🦷</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              SmileSync
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition">Home</a>
            <a href="/features" className="text-gray-600 hover:text-blue-600 transition">Features</a>
            <a href="/pricing" className="text-gray-600 hover:text-blue-600 transition">Pricing</a>
            <a href="/about" className="text-blue-600 font-semibold">About</a>
            <a href="/contact" className="text-gray-600 hover:text-blue-600 transition">Contact</a>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition transform hover:scale-105">
            Get Demo
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our Mission: Transform
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Dental Practice Management
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're on a mission to help dental practices save time, reduce no-shows, and grow their business with AI-powered tools.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                SmileSync was born from a simple observation: dental practices spend too much time on admin and not enough time with patients.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our founder, a dental practice owner himself, experienced firsthand the challenges of managing appointments, reducing no-shows, and keeping patients engaged.
              </p>
              <p className="text-gray-600 leading-relaxed">
                That's why we built SmileSync – to empower dental professionals with AI-powered tools that handle the busywork, so you can focus on what matters most: your patients.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-teal-500 text-white p-8 rounded-2xl shadow-xl">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-2xl font-bold mb-2">Why We Built SmileSync</h3>
              <p className="text-white/90">
                "Every dental practice deserves technology that works as hard as they do. We created SmileSync to make practice management effortless and intelligent."
              </p>
              <p className="mt-4 font-semibold">— The SmileSync Team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Customer First</h3>
              <p className="text-gray-600">We put dental practices at the heart of everything we do.</p>
            </div>
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-gray-600">We use cutting-edge AI to solve real-world problems.</p>
            </div>
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">Trust</h3>
              <p className="text-gray-600">We're committed to security, reliability, and transparency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 text-center mb-12">Passionate about transforming dental practices</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
              <div className="text-6xl mb-4">👨‍⚕️</div>
              <h3 className="text-xl font-bold">Mr.Damith</h3>
              <p className="text-blue-600 mb-2">CEO & Founder</p>
              <p className="text-gray-600 text-sm">Dental Assistant with 14 years of experience</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold">2,500+</div>
              <div className="text-sm opacity-90">Clinics Worldwide</div>
            </div>
            <div>
              <div className="text-4xl font-bold">40+</div>
              <div className="text-sm opacity-90">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold">99.9%</div>
              <div className="text-sm opacity-90">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold">4.8/5</div>
              <div className="text-sm opacity-90">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Join Us on Our Mission</h2>
          <p className="text-xl text-gray-600 mb-10">Be part of the future of dental practice management</p>
          <button className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition transform hover:scale-105">
            Get Started Today
          </button>
          <p className="mt-4 text-gray-400">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">🦷 SmileSync</h3>
              <p className="text-gray-400">AI-Powered Dental Practice Management</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/features" className="hover:text-white">Features</a></li>
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/contact" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Sales</a></li>
                <li><a href="#" className="hover:text-white">Partners</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2026 SmileSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}