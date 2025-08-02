"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { HelpCircle, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    const success = await login(formData.email, formData.password)
    if (success) {
      router.push("/")
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ff4e50] to-[#f9d423] px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <HelpCircle className="h-10 w-10 text-[#f9d423]" />
            <span className="text-3xl font-bold text-white">QuickDesk</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-white/70">
            Sign in to your account to access your support tickets
          </p>
        </div>

        {/* Login Form */}
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Username</label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  required
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

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-white">
                  <input type="checkbox" className="rounded bg-white/10 border-white/20" />
                  <span>Remember me</span>
                </label>
                <Button variant="link" className="px-0 text-sm text-[#f9d423] hover:text-[#f9d423]/80">
                  Forgot password?
                </Button>
              </div>

              <Button type="submit" className="w-full bg-white text-[#ff4e50] hover:bg-white/90 font-semibold" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-white/70">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#f9d423] hover:text-[#f9d423]/80 font-medium">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <Card className="backdrop-blur-md bg-[#0f2027]/60 border-white/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <p className="text-sm font-medium text-white">Demo Credentials</p>
              <div className="text-xs text-white/60 space-y-2">
                <div className="border border-white/20 rounded p-2 bg-white/5">
                  <p className="font-medium text-white">Customer:</p>
                  <p>Username: customer</p>
                  <p>Password: password</p>
                </div>
                <div className="border border-white/20 rounded p-2 bg-white/5">
                  <p className="font-medium text-white">Agent:</p>
                  <p>Username: agent</p>
                  <p>Password: password</p>
                </div>
                <div className="border border-white/20 rounded p-2 bg-white/5">
                  <p className="font-medium text-white">Admin:</p>
                  <p>Username: admin</p>
                  <p>Password: password</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
