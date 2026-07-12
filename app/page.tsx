'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createClient } from '@/lib/client'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // If logged in, redirect to dashboard based on role
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('email', session.user.email)
          .maybeSingle()
        
        if (userData?.role === 'owner' || userData?.role === 'admin') {
          router.push('/protected/admin')
        } else if (userData?.role === 'doctor') {
          router.push('/protected/dashboard/doctor')
        } else {
          router.push('/protected/dashboard/reception')
        }
      }
    }
    
    checkSession()
  }, [router])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Clean Header with Login Button */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🦷</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              SmileSync
            </span>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <a href="/" className="text-blue-600 font-semibold">Home</a>
            <a href="/features" className="text-gray-600 hover:text-blue-600 transition">Features</a>
            <a href="/pricing" className="text-gray-600 hover:text-blue-600 transition">Pricing</a>
            <a href="/about" className="text-gray-600 hover:text-blue-600 transition">About</a>
            <a href="/contact" className="text-gray-600 hover:text-blue-600 transition">Contact</a>
          </div>
          {/* Login Button - Only one in the header */}
          <button 
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2.5 rounded-full hover:shadow-xl transition transform hover:scale-105 font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30"
          >
            <span className="text-lg">🔐</span>
            <span>Login</span>
          </button>
        </div>
      </nav>

      {/* Hero Section - Removed extra login button */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-teal-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse">
              🚀 Now Available Worldwide
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transform Your Dental Practice
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                With AI That Learns
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              SmileSync automates admin, predicts no-shows, and gives you 30% more time with patients. 
              Join 2,500+ clinics already saving time and growing revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition transform hover:scale-105">
                Start Free Trial
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition transform hover:scale-105">
                Watch Demo ▶
              </button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-gray-500">
              <span className="flex items-center">⭐ 4.8/5 Rating</span>
              <span className="flex items-center">🌍 40+ Countries</span>
              <span className="flex items-center">🏆 2,500+ Clinics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500 text-sm uppercase tracking-wider mb-6">Trusted by leading dental practices worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <span className="text-2xl font-bold text-gray-400">🦷 Finest Dental Care</span>
            <span className="text-2xl font-bold text-gray-400">⭐ SmileCare</span>
            <span className="text-2xl font-bold text-gray-400">🏥 MediDent</span>
            <span className="text-2xl font-bold text-gray-400">💎 Pearl Dental</span>
            <span className="text-2xl font-bold text-gray-400">🌟 BrightSmile</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-4xl font-bold mt-2 mb-4">Why Choose SmileSync?</h2>
            <p className="text-xl text-gray-600">Everything you need to run a modern dental practice</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-3">AI Receptionist</h3>
              <p className="text-gray-600 leading-relaxed">Self-learning voice AI that handles scheduling and patient queries.</p>
              <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition">Learn more →</div>
            </div>
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3">Analytics & Insights</h3>
              <p className="text-gray-600 leading-relaxed">Predict trends, reduce no-shows, and increase case acceptance.</p>
              <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition">Learn more →</div>
            </div>
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="text-6xl mb-4">🔗</div>
              <h3 className="text-2xl font-bold mb-3">200+ Integrations</h3>
              <p className="text-gray-600 leading-relaxed">Connect with imaging, payments, and all your favorite tools.</p>
              <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition">Learn more →</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Simple Setup</span>
            <h2 className="text-4xl font-bold mt-2 mb-4">How SmileSync Works</h2>
            <p className="text-xl text-gray-600">Get started in minutes, not weeks</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your account in under 2 minutes</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">Connect Your Practice</h3>
              <p className="text-gray-600">Import patients and staff in one click</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Start Saving Time</h3>
              <p className="text-gray-600">Let AI handle the busywork instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl font-bold mt-2">What Our Clients Say</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="text-yellow-400 text-xl mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 italic mb-4">"The AI receptionist paid for itself in the first month. SmileSync has transformed our practice."</p>
              <div>
                <p className="font-bold">Dr. Sarah Chen</p>
                <p className="text-gray-500 text-sm">SmileWorks Dental, NYC</p>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="text-yellow-400 text-xl mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 italic mb-4">"No-shows dropped by 40% in just 2 months. We've never been more efficient."</p>
              <div>
                <p className="font-bold">Dr. James Wilson</p>
                <p className="text-gray-500 text-sm">Wilson Dental Group, LA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold animate-pulse">2,500+</div>
              <div className="text-sm opacity-90">Clinics Worldwide</div>
            </div>
            <div>
              <div className="text-4xl font-bold animate-pulse">30%</div>
              <div className="text-sm opacity-90">Fewer No-Shows</div>
            </div>
            <div>
              <div className="text-4xl font-bold animate-pulse">99.9%</div>
              <div className="text-sm opacity-90">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-4xl font-bold animate-pulse">4.8/5</div>
              <div className="text-sm opacity-90">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Resources</span>
            <h2 className="text-4xl font-bold mt-2">Latest Insights</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-bold mb-2">5 Ways AI Improves Patient Retention</h3>
              <p className="text-gray-600 text-sm">Discover how AI can help you build stronger patient relationships.</p>
              <a href="#" className="text-blue-600 text-sm font-semibold mt-3 inline-block">Read more →</a>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-bold mb-2">Reducing No-Shows by 40%</h3>
              <p className="text-gray-600 text-sm">Learn the proven strategies to minimize appointment cancellations.</p>
              <a href="#" className="text-blue-600 text-sm font-semibold mt-3 inline-block">Read more →</a>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-bold mb-2">The Future of Dental Tech</h3>
              <p className="text-gray-600 text-sm">Emerging trends that will shape dental practices in 2026.</p>
              <a href="#" className="text-blue-600 text-sm font-semibold mt-3 inline-block">Read more →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-6">Subscribe to get the latest dental tech insights</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address"
              className="px-4 py-3 rounded-full text-gray-900 flex-1 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* CTA - Removed the duplicate login button */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Practice?</h2>
          <p className="text-xl text-gray-600 mb-10">Join 2,500+ clinics already saving time with SmileSync</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition transform hover:scale-105">
              Watch Demo
            </button>
          </div>
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
              <div className="flex gap-4 mt-4">
                <a href="https://instagram.com/smilesynclk" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-pink-400 transition-colors" aria-label="Instagram">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-full inline-flex items-center justify-center w-10 h-10">📷</span>
                </a>
                <a href="https://facebook.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-400 transition-colors" aria-label="Facebook">
                  <span className="bg-blue-600 text-white px-3 py-2 rounded-full inline-flex items-center justify-center w-10 h-10">👍</span>
                </a>
                <a href="https://linkedin.com/company/smilesync" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-500 transition-colors" aria-label="LinkedIn">
                  <span className="bg-blue-700 text-white px-3 py-2 rounded-full inline-flex items-center justify-center w-10 h-10">💼</span>
                </a>
                <a href="https://youtube.com/@SmileSynclk" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-red-500 transition-colors" aria-label="YouTube">
                  <span className="bg-red-600 text-white px-3 py-2 rounded-full inline-flex items-center justify-center w-10 h-10">▶️</span>
                </a>
                <a href="https://twitter.com/smilesync" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-400 transition-colors" aria-label="Twitter">
                  <span className="bg-gray-800 text-white px-3 py-2 rounded-full inline-flex items-center justify-center w-10 h-10">🐦</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/features" className="hover:text-white transition">Features</a></li>
                <li><a href="/pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2026 SmileSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}