"use client"

import * as React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthGuard } from "@/components/auth-guard"
import { MainHeader } from "@/components/main-header"
import { 
  Settings, 
  Bell, 
  Mail, 
  Shield, 
  Palette,
  Globe,
  Lock,
  User
} from "lucide-react"

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [browserNotifications, setBrowserNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <AuthGuard>
      <MainHeader />
      <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] relative overflow-hidden">
        {/* Floating 3D Elements Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#f9d423]/10 rounded-full floating-3d blur-sm"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-[#ff4e50]/10 rounded-full floating-3d" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-[#f9d423]/5 rounded-full floating-3d" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-[#ff4e50]/5 rounded-full floating-3d" style={{animationDelay: '6s'}}></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-[#f9d423]/10 rounded-full floating-3d" style={{animationDelay: '8s'}}></div>
        </div>
        
        <div className="container mx-auto py-8 space-y-8 relative z-10">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
              <p className="text-white/90">
                Manage your account preferences and notifications.
              </p>
            </div>
          </div>

          {/* Settings Content */}
          <div className="max-w-4xl space-y-6">
            {/* Account Settings */}
            <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Account Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-white">First Name</label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#f9d423]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-white">Last Name</label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#f9d423]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#f9d423]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-white">Phone Number</label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#f9d423]"
                  />
                </div>
                <Button className="bg-white text-[#ff4e50] hover:bg-white/90 font-semibold">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-[#f9d423]" />
                      <label className="text-white font-medium">Email Notifications</label>
                    </div>
                    <p className="text-sm text-white/70">
                      Receive updates about your tickets via email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-4 h-4 text-[#f9d423] bg-white/10 border-white/20 rounded focus:ring-[#f9d423]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-[#f9d423]" />
                      <label className="text-white font-medium">Browser Notifications</label>
                    </div>
                    <p className="text-sm text-white/70">
                      Show desktop notifications for urgent updates
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={browserNotifications}
                    onChange={(e) => setBrowserNotifications(e.target.checked)}
                    className="w-4 h-4 text-[#f9d423] bg-white/10 border-white/20 rounded focus:ring-[#f9d423]"
                  />
                </div>
                <Button className="bg-white text-[#ff4e50] hover:bg-white/90 font-semibold">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="text-sm font-medium text-white">Current Password</label>
                  <Input
                    id="currentPassword"
                    type="password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#f9d423]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium text-white">New Password</label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#f9d423]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-white">Confirm New Password</label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#f9d423]"
                  />
                </div>
                <Button className="bg-white text-[#ff4e50] hover:bg-white/90 font-semibold">
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Display Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4 text-[#f9d423]" />
                      <label className="text-white font-medium">Dark Mode</label>
                    </div>
                    <p className="text-sm text-white/70">
                      Toggle between light and dark themes
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    className="w-4 h-4 text-[#f9d423] bg-white/10 border-white/20 rounded focus:ring-[#f9d423]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white font-medium flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-[#f9d423]" />
                    <span>Language</span>
                  </label>
                  <select className="w-full p-2 border rounded-md bg-white/10 border-white/20 text-white focus:border-[#f9d423]">
                    <option value="en" className="text-gray-900">English</option>
                    <option value="es" className="text-gray-900">Spanish</option>
                    <option value="fr" className="text-gray-900">French</option>
                    <option value="de" className="text-gray-900">German</option>
                  </select>
                </div>
                <Button className="bg-white text-[#ff4e50] hover:bg-white/90 font-semibold">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
