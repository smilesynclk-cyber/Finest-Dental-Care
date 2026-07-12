export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
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
            <a href="/pricing" className="text-blue-600 font-semibold">Pricing</a>
            <a href="/about" className="text-gray-600 hover:text-blue-600 transition">About</a>
            <a href="/contact" className="text-gray-600 hover:text-blue-600 transition">Contact</a>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition transform hover:scale-105">
            Get Demo
          </button>
        </div>
      </nav>

      {/* Pricing Content */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-center mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 text-center mb-16">Choose the plan that fits your practice</p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-gray-500 mb-4">Perfect for small practices</p>
              <div className="text-4xl font-bold mb-6">$79<span className="text-lg font-normal text-gray-500">/mo</span></div>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li>✓ Single clinic</li>
                <li>✓ Core AI features</li>
                <li>✓ 50+ integrations</li>
                <li>✓ Email support</li>
              </ul>
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105">
                Start Free Trial
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-teal-500 text-white p-8 rounded-2xl shadow-xl border-2 border-blue-600 transform scale-105">
              <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mb-4">Popular</div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-white/80 mb-4">Best for growing clinics</p>
              <div className="text-4xl font-bold mb-6">$199<span className="text-lg font-normal text-white/80">/mo</span></div>
              <ul className="space-y-3 mb-8 text-white/90">
                <li>✓ Multi-clinic support</li>
                <li>✓ Full AI stack</li>
                <li>✓ 200+ integrations</li>
                <li>✓ Priority support</li>
                <li>✓ Advanced analytics</li>
              </ul>
              <button className="w-full bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105">
                Start Free Trial
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-gray-500 mb-4">For large organizations</p>
              <div className="text-4xl font-bold mb-6">Custom</div>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li>✓ DSO-ready</li>
                <li>✓ Custom AI models</li>
                <li>✓ SSO integration</li>
                <li>✓ Dedicated support</li>
                <li>✓ Custom contracts</li>
              </ul>
              <button className="w-full border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}