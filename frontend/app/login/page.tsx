"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { HelpCircle, Eye, EyeOff, User, Shield, UserCog } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [selectedRole, setSelectedRole] = useState<"customer" | "agent" | "admin">("customer")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const roleOptions = [
    {
      value: "customer" as const,
      label: "Customer",
      icon: User,
      description: "Submit and track support tickets",
      color: "bg-gradient-to-r from-[#ff4e50] to-[#f9d423]"
    },
    {
      value: "agent" as const,
      label: "Support Agent", 
      icon: UserCog,
      description: "Handle and resolve customer tickets",
      color: "bg-gradient-to-r from-[#f9d423] to-[#ff4e50]"
    },
    {
      value: "admin" as const,
      label: "Administrator",
      icon: Shield,
      description: "Manage system and users",
      color: "bg-gradient-to-r from-[#0f2027] to-[#ff4e50]"
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Append role to email for demo purposes to trigger correct role assignment
    const roleEmail = `${selectedRole}.${formData.email}`
    
    const success = await login(roleEmail, formData.password)
    if (success) {
      // Redirect based on role
      switch (selectedRole) {
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
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ff4e50] to-[#f9d423] px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <HelpCircle className="h-10 w-10 text-[#0f2027]" />
            <span className="text-3xl font-bold text-white">QuickDesk</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-white/90">
            Sign in to your account to access your support tickets
          </p>
        </div>

        {/* Role Selection */}
        <Card className="backdrop-blur-md bg-[#0f2027]/90 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Choose Your Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {roleOptions.map((role) => {
                const Icon = role.icon
                return (
                  <div
                    key={role.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                      selectedRole === role.value
                        ? "border-[#f9d423] bg-gradient-to-r from-[#f9d423]/20 to-[#ff4e50]/20 shadow-lg"
                        : "border-white/30 hover:border-[#f9d423]/70 bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setSelectedRole(role.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${role.color} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-white">{role.label}</h3>
                          {selectedRole === role.value && (
                            <Badge variant="default" className="bg-[#f9d423] text-[#0f2027] font-semibold">Selected</Badge>
                          )}
                        </div>
                        <p className="text-sm text-[#333333]">{role.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className="backdrop-blur-md bg-[#0f2027]/90 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-[#f9d423] focus:ring-[#f9d423]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-[#f9d423] focus:ring-[#f9d423]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-white/70 hover:text-white hover:bg-white/10"
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

              <Button 
                type="submit" 
                className="w-full bg-white text-[#ff4e50] hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : `Sign in as ${roleOptions.find(r => r.value === selectedRole)?.label}`}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-white/90">
            Don't have an account?{" "}
            <Button variant="link" className="px-0 text-sm text-[#f9d423] hover:text-[#f9d423]/80">
              Sign up here
            </Button>
          </p>
        </div>

        {/* Demo Credentials */}
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-[#f9d423]/30 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <p className="text-sm font-medium text-white">Demo Credentials</p>
              <div className="text-xs text-white/90 space-y-2">
                <div className="border rounded p-2 bg-white/10 border-white/20">
                  <p className="font-medium text-[#f9d423]">Customer:</p>
                  <p className="text-white">Email: customer@quickdesk.com</p>
                  <p className="text-white">Password: demo123</p>
                </div>
                <div className="border rounded p-2 bg-white/10 border-white/20">
                  <p className="font-medium text-[#f9d423]">Agent:</p>
                  <p className="text-white">Email: agent@quickdesk.com</p>
                  <p className="text-white">Password: demo123</p>
                </div>
                <div className="border rounded p-2 bg-white/10 border-white/20">
                  <p className="font-medium text-[#0f2027] bg-[#f9d423] px-2 py-1 rounded">Admin:</p>
                  <p className="text-white">Email: admin@quickdesk.com</p>
                  <p className="text-white">Password: demo123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
