'use client';

import { useForm, ValidationError } from '@formspree/react';

export default function Contact() {
  // REPLACE "your-form-id" WITH YOUR ACTUAL FORMSPREE FORM ID
  // Example: If your form URL is https://formspree.io/f/xabcde123
  // Then your form ID is "xabcde123"
  const [state, handleSubmit] = useForm("mzdlynpj");

  if (state.succeeded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
          <p className="text-gray-600 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
          <a href="/" className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition inline-block">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
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
            <a href="/about" className="text-gray-600 hover:text-blue-600 transition">About</a>
            <a href="/contact" className="text-blue-600 font-semibold">Contact</a>
          </div>
          <a href="/contact" className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition transform hover:scale-105 inline-block">
            Get Demo
          </a>
        </div>
      </nav>

      {/* Contact Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <h1 className="text-5xl font-bold text-center mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 text-center mb-16">
            Ready to transform your practice? We're here to help.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Name *</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                  <ValidationError prefix="Name" field="name" errors={state.errors} />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                  <ValidationError prefix="Email" field="email" errors={state.errors} />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone"
                    placeholder="+94 (76) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Clinic Name</label>
                  <input 
                    type="text" 
                    id="clinic"
                    name="clinic"
                    placeholder="Your dental practice"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Message *</label>
                  <textarea 
                    id="message"
                    name="message"
                    rows="4"
                    placeholder="Tell us about your practice and what you're looking for..."
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  ></textarea>
                  <ValidationError prefix="Message" field="message" errors={state.errors} />
                </div>
                
                <button 
                  type="submit" 
                  disabled={state.submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <h4 className="font-semibold">Our Office</h4>
                      <p className="text-gray-600">Colombo,<br />Sri Lanka, 010000</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">📧</span>
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-gray-600">smilesynclk@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">📞</span>
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-gray-600">+94 70 110 7445</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🕐</span>
                    <div>
                      <h4 className="font-semibold">Hours</h4>
                      <p className="text-gray-600">Mon-Sun: 8:00 AM - 11:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick CTA */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-2xl">
                <h4 className="text-xl font-bold mb-2">Book a Free Demo</h4>
                <p className="text-gray-600 mb-4">See SmileSync in action with a personalized demo.</p>
                <a 
                  href="/contact" 
                  className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition inline-block"
                >
                  Schedule Now
                </a>
              </div>
            </div>
          </div>
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
                <li><a href="/features" className="hover:text-white transition">Features</a></li>
                <li><a href="/pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
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