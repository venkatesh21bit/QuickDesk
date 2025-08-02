"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  Users, 
  MessageSquare, 
  Shield, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Play
} from "lucide-react"

export default function Home() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  // Keep the authentication logic but don't auto-redirect
  // Instead, we'll show the landing page to everyone
  
  const handleGetStarted = () => {
    if (user) {
      // If logged in, redirect based on role
      switch (user.role) {
        case "admin":
          router.push("/admin")
          break
        case "agent":
          router.push("/agent")
          break
        case "customer":
        default:
          router.push("/dashboard")
          break
      }
    } else {
      // If not logged in, go to login
      router.push("/login")
    }
  }

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff4e50] to-[#f9d423]">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm bg-[#0f2027]/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#f9d423] to-[#ff4e50] rounded-lg flex items-center justify-center">
              <span className="text-[#0f2027] font-bold text-sm">Q</span>
            </div>
            <span className="font-semibold text-xl text-white">QuickDesk</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white/90 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-white/90 hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="text-white/90 hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-white/90 hover:text-white transition-colors">Contact</a>
          </nav>
          <Button onClick={handleLogin} variant="outline" className="border-white/30 text-white hover:bg-white/10">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-[#0f2027]/80 text-[#f9d423] border-[#f9d423]/30 backdrop-blur-sm">
            ✨ New: AI-Powered Support
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Card Beaker and<br />
            Support and Your<br />
            <span className="text-[#0f2027]">Prasupport</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your customer support with our intelligent help desk solution. 
            Streamline tickets, enhance productivity, and deliver exceptional customer experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-white text-[#ff4e50] hover:bg-white/90 font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-white/30 text-white hover:bg-white/10">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          {/* Hero Image Placeholder */}
          <div className="mt-12 relative">
            <div className="bg-[#0f2027]/80 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-2xl shadow-[#0f2027]/20">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#ff4e50] rounded-full"></div>
                    <div className="w-3 h-3 bg-[#f9d423] rounded-full"></div>
                    <div className="w-3 h-3 bg-[#0f2027] rounded-full"></div>
                  </div>
                  <div className="text-sm text-[#333333]">quickdesk.com</div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-[#ff4e50] to-[#f9d423] rounded w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-[#f9d423] to-[#ff4e50] rounded w-1/2"></div>
                  <div className="h-4 bg-gradient-to-r from-[#0f2027] to-[#ff4e50] rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#0f2027]/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Funcionalee for suoritisukonce
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Everything you need to provide world-class customer support
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg bg-[#0f2027]/80 backdrop-blur-md hover:bg-[#0f2027]/90 transition-all duration-300 border border-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#ff4e50] to-[#f9d423] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Smart Ticketing</h3>
                <p className="text-white/90 text-sm">
                  Automatically categorize and route tickets to the right agents
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-[#0f2027]/80 backdrop-blur-md hover:bg-[#0f2027]/90 transition-all duration-300 border border-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#f9d423] to-[#ff4e50] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Lightning Fast</h3>
                <p className="text-white/90 text-sm">
                  Respond to customers in seconds with our optimized interface
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-[#0f2027]/80 backdrop-blur-md hover:bg-[#0f2027]/90 transition-all duration-300 border border-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#0f2027] to-[#ff4e50] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Secure</h3>
                <p className="text-white/90 text-sm">
                  Enterprise-grade security to protect your customer data
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-[#0f2027]/80 backdrop-blur-md hover:bg-[#0f2027]/90 transition-all duration-300 border border-white/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#ff4e50] to-[#0f2027] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Team Collaboration</h3>
                <p className="text-white/90 text-sm">
                  Work together seamlessly with real-time collaboration tools
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-[#0f2027]/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Communities with Help Desk
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#f9d423] to-[#ff4e50] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-[#0f2027]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Automated Responses</h3>
                    <p className="text-white/90">Set up intelligent auto-responses for common queries</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#f9d423] to-[#ff4e50] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-[#0f2027]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Knowledge Base</h3>
                    <p className="text-white/90">Build a comprehensive knowledge base for self-service</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#f9d423] to-[#ff4e50] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-[#0f2027]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Analytics & Insights</h3>
                    <p className="text-white/90">Track performance and identify improvement opportunities</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#f9d423] to-[#ff4e50] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-[#0f2027]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Multi-channel Support</h3>
                    <p className="text-white/90">Handle tickets from email, chat, and social media in one place</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-[#0f2027]/80 backdrop-blur-md rounded-xl p-8 border border-white/20">
                <img 
                  src="/api/placeholder/500/400" 
                  alt="Team collaboration" 
                  className="rounded-lg w-full h-64 object-cover bg-gradient-to-br from-[#ff4e50] to-[#f9d423]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-[#0f2027]/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Shares Resources
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of companies already using QuickDesk
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg bg-[#0f2027]/80 backdrop-blur-md border border-white/20">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-[#f9d423] fill-current" />
                  <Star className="h-5 w-5 text-[#f9d423] fill-current" />
                  <Star className="h-5 w-5 text-[#f9d423] fill-current" />
                  <Star className="h-5 w-5 text-[#f9d423] fill-current" />
                  <Star className="h-5 w-5 text-[#f9d423] fill-current" />
                </div>
                <h3 className="font-semibold text-white mb-2">Quick Backup</h3>
                <p className="text-white/90 mb-4">
                  "QuickDesk has transformed how we handle customer support. 
                  Response times are down 60% and customer satisfaction is at an all-time high."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#ff4e50] to-[#f9d423] rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-white">Sarah Johnson</p>
                    <p className="text-sm text-[#333333]">Support Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-[#0f2027]/80 backdrop-blur-md border border-white/20">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-[#f9d423] fill-current" />
                  <Star className="h-5 w-5 text-[#f9d423] fill-current" />
                  <Star className="h-5 w-5 text-[#f9d423] fill-current" />
                  <Star className="h-5 w-5 text-[#f9d423] fill-current" />
                  <Star className="h-5 w-5 text-[#f9d423] fill-current" />
                </div>
                <h3 className="font-semibold text-white mb-2">Project & Management</h3>
                <p className="text-white/90 mb-4">
                  "The automation features save us hours every day. 
                  Our team can focus on complex issues while routine queries are handled automatically."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#f9d423] to-[#ff4e50] rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-white">Mike Chen</p>
                    <p className="text-sm text-[#333333]">Operations Director</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-white text-[#ff4e50] hover:bg-white/90 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#0f2027] via-[#0f2027] to-[#0f2027] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#f9d423] to-[#ff4e50] rounded-lg flex items-center justify-center">
                  <span className="text-[#0f2027] font-bold text-sm">Q</span>
                </div>
                <span className="font-semibold text-xl">QuickDesk</span>
              </div>
              <p className="text-white/90">
                The modern help desk solution for growing teams.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-[#f9d423]">Product</h4>
              <ul className="space-y-2 text-white/90">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-[#f9d423]">Company</h4>
              <ul className="space-y-2 text-white/90">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-[#f9d423]">Support</h4>
              <ul className="space-y-2 text-white/90">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/90">
            <p>&copy; 2025 QuickDesk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
