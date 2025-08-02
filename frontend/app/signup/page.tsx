"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { HelpCircle, Eye, EyeOff, User, Mail, Building, UserCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"

export default function SignUpPage() {
  const router = useRouter()
  const { register, isLoading, error: authError } = useAuth()
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    password_confirm: "",
    department: "",
    phone: "",
    role: "customer"
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Update local error when auth error changes
  React.useEffect(() => {
    if (authError) {
      // Handle specific validation errors
      const errorMessage = authError
      
      if (errorMessage.toLowerCase().includes('username') && (errorMessage.toLowerCase().includes('already exists') || errorMessage.toLowerCase().includes('already taken'))) {
        setError("This username is already taken. Please choose a different username.")
      } else if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('already exists')) {
        setError("An account with this email already exists. Please use a different email or try logging in.")
      } else if (errorMessage.toLowerCase().includes('user with this email already exists')) {
        setError("An account with this email already exists. Please use a different email or try logging in.")
      } else if (errorMessage.toLowerCase().includes('user with this username already exists')) {
        setError("This username is already taken. Please choose a different username.")
      } else {
        setError(errorMessage)
      }
    }
  }, [authError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.password !== formData.password_confirm) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions")
      return
    }

    const success = await register(formData)
    if (success) {
      router.push("/")
    }
    // Error will be handled by the useEffect above
  }

  const departments = [
    "Information Technology",
    "Human Resources", 
    "Finance & Accounting",
    "Sales & Marketing",
    "Operations",
    "Customer Service",
    "Research & Development",
    "Legal & Compliance",
    "Facilities Management",
    "Other"
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] px-4 py-8 relative overflow-hidden">
      {/* Floating 3D Elements Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#f9d423]/10 rounded-full floating-3d blur-sm"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-[#ff4e50]/5 rounded-full floating-3d" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/3 w-24 h-24 bg-[#f9d423]/10 rounded-full floating-3d" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-[#ff4e50]/5 rounded-full floating-3d" style={{animationDelay: '6s'}}></div>
      </div>
      
      <div className="w-full max-w-lg space-y-8 relative z-10">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <HelpCircle className="h-10 w-10 text-[#f9d423]" />
            <span className="text-3xl font-bold text-white">QuickDesk</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Create your account</h1>
          <p className="text-white/70">
            Join QuickDesk to manage your support tickets and get help faster
          </p>
        </div>

        {/* Sign Up Form */}
        <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
          <CardHeader>
            <CardTitle className="text-white">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
              
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">First Name</label>
                  <Input
                    type="text"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Last Name</label>
                  <Input
                    type="text"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    type="email"
                    placeholder="john.doe@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Phone Number (Optional)</label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Department</label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-white/60 z-10" />
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:border-[#f9d423] focus:ring-[#f9d423] appearance-none"
                    required
                  >
                    <option value="" className="text-gray-900">Select your department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept} className="text-gray-900">
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Role</label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-3 h-4 w-4 text-white/60 z-10" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:border-[#f9d423] focus:ring-[#f9d423] appearance-none"
                  >
                    <option value="customer" className="text-gray-900">Customer</option>
                    <option value="agent" className="text-gray-900">Support Agent</option>
                    <option value="admin" className="text-gray-900">Administrator</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white hover:bg-white/10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Confirm Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.password_confirm}
                    onChange={(e) => setFormData({...formData, password_confirm: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white hover:bg-white/10"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox" 
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded bg-white/10 border-white/20" 
                  required
                />
                <label className="text-sm text-white">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#f9d423] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#f9d423] hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#ff4e50] to-[#f9d423] hover:from-[#f9d423] hover:to-[#ff4e50] text-white font-semibold button-3d disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={isLoading || !acceptTerms}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-white/70">
            Already have an account?{" "}
            <Link href="/login" className="text-[#f9d423] hover:text-[#f9d423]/80 font-medium">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Help Information */}
        <Card className="backdrop-blur-md bg-[#0f2027]/60 border-white/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <p className="text-sm font-medium text-white">Need Help?</p>
              <div className="text-xs text-white/60 space-y-2">
                <p>
                  If you're having trouble creating your account, please contact your IT administrator 
                  or reach out to our support team for assistance.
                </p>
                <div className="border border-white/20 rounded p-2 bg-white/5">
                  <p className="font-medium text-white">Support Contact:</p>
                  <p>Email: support@quickdesk.com</p>
                  <p>Phone: (555) 123-4567</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
