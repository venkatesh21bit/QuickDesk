"use client"

import * as React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { User, Mail, Phone, Building, MapPin, Clock, Save, Eye, EyeOff, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { AuthGuard } from "@/components/auth-guard"
import { MainHeader } from "@/components/main-header"

function ProfilePageContent() {
  const { user, updateProfile, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    bio: "",
    location: "",
    timezone: "",
  })
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        department: user.department || "",
        bio: user.profile?.bio || "",
        location: user.profile?.location || "",
        timezone: user.profile?.timezone || "",
      })
    }
  }, [user, isLoading, router])

  // Handle tab parameter from URL
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'settings') {
      setActiveTab('settings')
    } else {
      setActiveTab('profile')
    }
  }, [searchParams])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setMessage("")

    try {
      const success = await updateProfile(formData)
      if (success) {
        setMessage("Profile updated successfully!")
      } else {
        setError("Failed to update profile. Please try again.")
      }
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangingPassword(true)
    setError("")
    setMessage("")

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError("New passwords do not match")
      setChangingPassword(false)
      return
    }

    if (passwordData.new_password.length < 6) {
      setError("New password must be at least 6 characters long")
      setChangingPassword(false)
      return
    }

    try {
      // For now, let's implement a simple password change through profile update
      // You'll need to add a proper changePassword endpoint to your API
      setMessage("Password change functionality needs to be implemented in the backend!")
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      })
    } catch (error: any) {
      setError(error.message || "Failed to change password")
    } finally {
      setChangingPassword(false)
    }
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

  const timezones = [
    "America/New_York",
    "America/Chicago", 
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney",
    "Pacific/Auckland"
  ]

  if (isLoading || !user) {
    return (
      <AuthGuard>
        <MainHeader />
        <div className="min-h-screen bg-gradient-to-br from-[#ff4e50] to-[#f9d423]">
          <div className="container mx-auto py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="mt-4 text-white/70">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <MainHeader />
      <div className="min-h-screen bg-gradient-to-br from-[#ff4e50] to-[#f9d423]">
        <div className="container mx-auto py-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <User className="h-8 w-8 text-[#f9d423]" />
              <h1 className="text-4xl font-bold text-white">Profile Settings</h1>
            </div>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Manage your account information and preferences
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-white/10 rounded-lg p-1 backdrop-blur-md">
              <button 
                className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "profile" 
                    ? "bg-white text-[#ff4e50] shadow-md" 
                    : "text-white hover:text-[#f9d423]"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile Information
              </button>
              <button 
                className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "settings" 
                    ? "bg-white text-[#ff4e50] shadow-md" 
                    : "text-white hover:text-[#f9d423]"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                Account Settings
              </button>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <Card className="backdrop-blur-md bg-green-500/20 border-green-400/30 shadow-xl">
              <CardContent className="p-4">
                <p className="text-green-100 text-center">{message}</p>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="backdrop-blur-md bg-red-500/20 border-red-400/30 shadow-xl">
              <CardContent className="p-4">
                <p className="text-red-100 text-center">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Tab Content */}
          {activeTab === "profile" && (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Profile Information */}
            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="h-5 w-5 mr-2 text-[#f9d423]" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="first_name" className="text-sm font-medium text-white">First Name</label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#f9d423]"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last_name" className="text-sm font-medium text-white">Last Name</label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#f9d423]"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-white">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#f9d423]"
                        placeholder="john.doe@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-white">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#f9d423]"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="department" className="text-sm font-medium text-white">Department</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-white/60 z-10" />
                      <select
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:border-[#f9d423] focus:ring-[#f9d423] appearance-none"
                      >
                        <option value="" className="text-gray-900">Select department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept} className="text-gray-900">
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium text-white">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#f9d423]"
                        placeholder="San Francisco, CA"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="timezone" className="text-sm font-medium text-white">Timezone</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-white/60 z-10" />
                      <select
                        id="timezone"
                        value={formData.timezone}
                        onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                        className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:border-[#f9d423] focus:ring-[#f9d423] appearance-none"
                      >
                        <option value="" className="text-gray-900">Select timezone</option>
                        {timezones.map((tz) => (
                          <option key={tz} value={tz} className="text-gray-900">
                            {tz}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium text-white">Bio</label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#f9d423]"
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-white text-[#ff4e50] hover:bg-white/90 font-semibold"
                    disabled={saving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-[#f9d423]" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="current_password" className="text-sm font-medium text-white">Current Password</label>
                    <div className="relative">
                      <Input
                        id="current_password"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#f9d423]"
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white hover:bg-white/10"
                        onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="new_password" className="text-sm font-medium text-white">New Password</label>
                    <div className="relative">
                      <Input
                        id="new_password"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#f9d423]"
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white hover:bg-white/10"
                        onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirm_password" className="text-sm font-medium text-white">Confirm New Password</label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#f9d423]"
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white hover:bg-white/10"
                        onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-white text-[#ff4e50] hover:bg-white/90 font-semibold"
                    disabled={changingPassword}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {changingPassword ? "Changing..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          )}

          {/* Settings Tab Content */}
          {activeTab === "settings" && (
          <div className="space-y-8">
            {/* Account Information */}
            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-white/10 rounded-lg border border-white/20">
                    <div className="text-2xl font-bold text-white">{user.role.toUpperCase()}</div>
                    <div className="text-white/70">Account Role</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-lg border border-white/20">
                    <div className="text-2xl font-bold text-white">{user.username}</div>
                    <div className="text-white/70">Username</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-lg border border-white/20">
                    <div className="text-2xl font-bold text-white">{user.id}</div>
                    <div className="text-white/70">User ID</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-[#f9d423]" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg border border-white/20">
                    <div>
                      <h4 className="text-white font-medium">Email Notifications</h4>
                      <p className="text-white/70 text-sm">Receive email updates about your tickets</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg border border-white/20">
                    <div>
                      <h4 className="text-white font-medium">SMS Notifications</h4>
                      <p className="text-white/70 text-sm">Receive SMS updates for urgent tickets</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg border border-white/20">
                    <div>
                      <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                      <p className="text-white/70 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                      Enable
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          )}

          {/* Account Information - Shown on both tabs */}
          {/* Remove the duplicate account information that was showing outside tabs */}
        </div>
      </div>
    </AuthGuard>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <AuthGuard>
        <MainHeader />
        <div className="min-h-screen bg-gradient-to-br from-[#ff4e50] to-[#f9d423]">
          <div className="container mx-auto py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="mt-4 text-white/70">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    }>
      <ProfilePageContent />
    </Suspense>
  )
}
