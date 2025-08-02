"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  Settings, 
  BarChart3,
  Shield, 
  Database,
  TrendingUp,
  Clock,
  UserCheck
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { AuthGuard } from "@/components/auth-guard"
import { MainHeader } from "@/components/main-header"

interface AdminStats {
  total_users: number
  total_tickets: number
  active_agents: number
  total_categories: number
  avg_resolution_time: string
  satisfaction_rate: string
}

export default function AdminPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    total_tickets: 0,
    active_agents: 0,
    total_categories: 0,
    avg_resolution_time: "0h 0m",
    satisfaction_rate: "0%"
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.getAdminStats()
      setStats(response)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-[#ff4e50] to-[#f9d423] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-r-transparent mx-auto" />
            <p className="text-white text-lg font-medium">Loading Admin Dashboard...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-[#ff4e50] to-[#f9d423] relative overflow-hidden">
        {/* Floating 3D Elements Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-40 h-40 bg-white/10 rounded-full floating-3d blur-sm"></div>
          <div className="absolute top-60 right-20 w-32 h-32 bg-white/5 rounded-full floating-3d" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-1/3 w-24 h-24 bg-white/10 rounded-full floating-3d" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full floating-3d" style={{animationDelay: '6s'}}></div>
        </div>
        
        <MainHeader />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4 slide-in-3d">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">Admin Dashboard</h1>
              <p className="text-white/80 text-lg drop-shadow-md">
                Welcome back, {user?.username}. Here's what's happening with your system.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border border-white/20 text-white glass-3d">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-[#f9d423]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.total_users}</div>
                </CardContent>
              </Card>
              
              <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border border-white/20 text-white glass-3d">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Tickets</CardTitle>
                  <Database className="h-4 w-4 text-[#f9d423]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.total_tickets}</div>
                </CardContent>
              </Card>
              
              <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border border-white/20 text-white glass-3d">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Active Agents</CardTitle>
                  <UserCheck className="h-4 w-4 text-[#f9d423]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.active_agents}</div>
                </CardContent>
              </Card>
              
              <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border border-white/20 text-white glass-3d">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Categories</CardTitle>
                  <Shield className="h-4 w-4 text-[#f9d423]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.total_categories}</div>
                </CardContent>
              </Card>
              
              <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border border-white/20 text-white glass-3d">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Avg Resolution</CardTitle>
                  <Clock className="h-4 w-4 text-[#f9d423]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.avg_resolution_time}</div>
                </CardContent>
              </Card>
              
              <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border border-white/20 text-white glass-3d">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Satisfaction</CardTitle>
                  <TrendingUp className="h-4 w-4 text-[#f9d423]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.satisfaction_rate}</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border border-white/20 hover:bg-[#0f2027]/90 transition-all cursor-pointer group glass-3d">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-[#f9d423] group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <CardTitle className="text-lg text-white">User Management</CardTitle>
                      <p className="text-sm text-white/60">
                        Manage user accounts and permissions
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border border-white/20 hover:bg-[#0f2027]/90 transition-all cursor-pointer group glass-3d">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-8 w-8 text-[#f9d423] group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <CardTitle className="text-lg text-white">Analytics</CardTitle>
                      <p className="text-sm text-white/60">
                        View detailed system analytics
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border border-white/20 hover:bg-[#0f2027]/90 transition-all cursor-pointer group glass-3d">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Settings className="h-8 w-8 text-[#f9d423] group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <CardTitle className="text-lg text-white">System Settings</CardTitle>
                      <p className="text-sm text-white/60">
                        Configure system preferences
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
