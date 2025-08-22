"use client"

import { useState } from "react"
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ChevronUp,
  Heart
} from "lucide-react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="text-white" style={{ background: "linear-gradient(to bottom, #262535, #000000)" }}>
      {/* Newsletter Section */}
      <div style={{ background: "linear-gradient(to right, #764D2C, #000F30)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">Stay Connected</h3>
            <p className="text-lg mb-8 opacity-90">
              Get exclusive insights, growth tips, and be the first to know about our latest resources
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={handleNewsletterSubmit}>
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-white px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                style={{ color: "#764D2C" }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text" 
                  style={{ backgroundImage: "linear-gradient(to right, #764D2C, #262535)" }}>
                The Growth Club
              </h2>
              <p className="text-gray-400 mt-4 text-lg leading-relaxed">
                Empowering your journey to personal and professional growth. Discover resources curated for ambitious minds.
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: "#764D2C" }} />
                <span>123 Growth Avenue, Development City, DC 12345</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-5 h-5 flex-shrink-0" style={{ color: "#764D2C" }} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-5 h-5 flex-shrink-0" style={{ color: "#764D2C" }} />
                <span>hello@thegrowthclub.com</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Follow Our Journey</h4>
              <div className="flex space-x-4">
                {[
                  { Icon: Facebook, href: "#", label: "Facebook" },
                  { Icon: Instagram, href: "#", label: "Instagram" },
                  { Icon: Twitter, href: "#", label: "Twitter" },
                  { Icon: Youtube, href: "#", label: "YouTube" }
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 group"
                    style={{ 
                      background: "linear-gradient(to right, #000F30, #262535)",
                    }}
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center justify-between md:block">
              <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
              <button 
                className="md:hidden"
                onClick={() => toggleSection("quickLinks")}
              >
                <ChevronUp className={`w-5 h-5 transition-transform ${expandedSection === "quickLinks" ? "" : "rotate-180"}`} />
              </button>
            </div>
            <ul className={`space-y-3 ${expandedSection === "quickLinks" || expandedSection === null ? "block" : "hidden"} md:block`}>
              {["About Us", "Contact", "Careers", "Press", "Blog", "Resources"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Member Support */}
          <div>
            <div className="flex items-center justify-between md:block">
              <h4 className="font-semibold mb-4 text-lg">Member Support</h4>
              <button 
                className="md:hidden"
                onClick={() => toggleSection("memberSupport")}
              >
                <ChevronUp className={`w-5 h-5 transition-transform ${expandedSection === "memberSupport" ? "" : "rotate-180"}`} />
              </button>
            </div>
            <ul className={`space-y-3 ${expandedSection === "memberSupport" || expandedSection === null ? "block" : "hidden"} md:block`}>
              {["Help Center", "Community Guidelines", "Member Benefits", "Growth Guide", "Progress Tracking", "FAQ"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="flex items-center justify-between md:block">
              <h4 className="font-semibold mb-4 text-lg">Legal</h4>
              <button 
                className="md:hidden"
                onClick={() => toggleSection("legal")}
              >
                <ChevronUp className={`w-5 h-5 transition-transform ${expandedSection === "legal" ? "" : "rotate-180"}`} />
              </button>
            </div>
            <ul className={`space-y-3 ${expandedSection === "legal" || expandedSection === null ? "block" : "hidden"} md:block`}>
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility", "Security", "Sitemap"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods & Trust Badges */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: "#262535" }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div>
              <h5 className="text-sm font-semibold mb-3 text-gray-300">Secure Payments</h5>
              <div className="flex space-x-4">
                {["💳", "💰", "🏦", "📱", "💎"].map((icon, index) => (
                  <div 
                    key={index}
                    className="w-12 h-8 rounded-lg flex items-center justify-center text-xl hover:opacity-80 transition-all cursor-pointer"
                    style={{ backgroundColor: "#262535" }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-semibold mb-3 text-gray-300 text-center">Trusted By</h5>
              <div className="flex space-x-4">
                {["🛡️", "✅", "🔒", "⭐", "🏆"].map((icon, index) => (
                  <div 
                    key={index}
                    className="w-12 h-8 rounded-lg flex items-center justify-center text-xl hover:opacity-80 transition-all cursor-pointer"
                    style={{ backgroundColor: "#000F30" }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t" style={{ borderColor: "#262535" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>&copy; 2025 The Growth Club. All rights reserved.</span>
              <span className="hidden md:inline">|</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>for growth enthusiasts</span>
              </span>
            </div>
            
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 group"
              style={{ 
                background: "linear-gradient(to right, #764D2C, #262535)",
              }}
            >
              <span className="text-sm font-medium">Back to Top</span>
              <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}