export default function Features() {
  const features = [
    {
      icon: "🤖",
      title: "AI Receptionist",
      description: "Self-learning voice AI that handles scheduling, patient queries, and improves with every call.",
      benefits: [
        "24/7 appointment scheduling",
        "Intelligent patient triage",
        "Handles routine questions",
        "Learns from every interaction",
        "Multi-language support"
      ]
    },
    {
      icon: "📊",
      title: "Analytics & Insights",
      description: "Predict trends, reduce no-shows, and increase case acceptance with data-driven decisions.",
      benefits: [
        "Real-time practice dashboard",
        "Predict patient behavior",
        "Identify growth opportunities",
        "Revenue forecasting",
        "Staff performance tracking"
      ]
    },
    {
      icon: "💬",
      title: "Patient Engagement",
      description: "Connect with patients through automated messaging, reminders, and a personalized portal.",
      benefits: [
        "Two-way SMS & email",
        "Automated appointment reminders",
        "Digital consent forms",
        "Patient education materials",
        "Secure messaging"
      ]
    },
    {
      icon: "🔗",
      title: "200+ Integrations",
      description: "Seamlessly connect with imaging systems, payment processors, and all your favorite tools.",
      benefits: [
        "Dental imaging systems",
        "Payment processors",
        "Email marketing tools",
        "Accounting software",
        "CRM integration"
      ]
    },
    {
      icon: "📱",
      title: "Mobile App",
      description: "Access SmileSync anywhere with our full-featured companion app for iOS and Android.",
      benefits: [
        "Manage appointments on-the-go",
        "Access patient records",
        "Send instant messages",
        "View analytics",
        "Offline mode available"
      ]
    },
    {
      icon: "🔒",
      title: "Enterprise Security",
      description: "Bank-grade security with HIPAA compliance, data encryption, and 99.9% uptime guarantee.",
      benefits: [
        "HIPAA compliant",
        "End-to-end encryption",
        "99.9% uptime SLA",
        "Regular security audits",
        "GDPR compliant"
      ]
    }
  ];

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
            <a href="/features" className="text-blue-600 font-semibold">Features</a>
            <a href="/pricing" className="text-gray-600 hover:text-blue-600 transition">Pricing</a>
            <a href="/about" className="text-gray-600 hover:text-blue-600 transition">About</a>
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
            Everything You Need to Run a
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Modern Dental Practice
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how SmileSync's powerful features help you save time, reduce no-shows, and grow your practice.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Practice?</h2>
          <p className="text-xl mb-10 opacity-90">Join 2,500+ clinics already saving time with SmileSync</p>
          <button className="bg-white text-blue-600 px-12 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition transform hover:scale-105">
            Start Free Trial
          </button>
          <p className="mt-4 text-sm opacity-75">No credit card required. Cancel anytime.</p>
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
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Support</a></li>
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