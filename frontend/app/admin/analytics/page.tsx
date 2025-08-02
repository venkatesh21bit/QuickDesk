"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Database,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { AuthGuard } from "@/components/auth-guard"
import { MainHeader } from "@/components/main-header"

interface AnalyticsData {
  total_tickets: number
  open_tickets: number
  in_progress_tickets: number
  closed_tickets: number
  total_users: number
  active_agents: number
  avg_resolution_time: string
  satisfaction_rate: string
  tickets_this_month: number
  tickets_last_month: number
  resolution_trend: number
  customer_satisfaction_trend: number
}

export default function AdminAnalyticsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    total_tickets: 0,
    open_tickets: 0,
    in_progress_tickets: 0,
    closed_tickets: 0,
    total_users: 0,
    active_agents: 0,
    avg_resolution_time: "0h 0m",
    satisfaction_rate: "0%",
    tickets_this_month: 0,
    tickets_last_month: 0,
    resolution_trend: 0,
    customer_satisfaction_trend: 0
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await api.getAdminStats()
      setAnalytics(response)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] relative overflow-hidden flex items-center justify-center">
          {/* Floating 3D Elements Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-32 h-32 bg-[#f9d423]/10 rounded-full floating-3d blur-sm"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-[#ff4e50]/10 rounded-full floating-3d" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-[#f9d423]/5 rounded-full floating-3d" style={{animationDelay: '4s'}}></div>
            <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-[#ff4e50]/5 rounded-full floating-3d" style={{animationDelay: '6s'}}></div>
            <div className="absolute bottom-20 right-10 w-28 h-28 bg-[#f9d423]/10 rounded-full floating-3d" style={{animationDelay: '8s'}}></div>
          </div>
          <div className="text-center space-y-4 relative z-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f9d423] border-r-transparent mx-auto" />
            <p className="text-white text-lg font-medium">Loading Analytics...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] relative overflow-hidden">
        {/* Floating 3D Elements Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#f9d423]/10 rounded-full floating-3d blur-sm"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-[#ff4e50]/10 rounded-full floating-3d" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-[#f9d423]/5 rounded-full floating-3d" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-[#ff4e50]/5 rounded-full floating-3d" style={{animationDelay: '6s'}}></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-[#f9d423]/10 rounded-full floating-3d" style={{animationDelay: '8s'}}></div>
        </div>
        <MainHeader />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-white/80 text-lg">
                System performance metrics and insights
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="backdrop-blur-md bg-[#0f2027]/80 border border-white/20 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Tickets</CardTitle>
                  <Database className="h-4 w-4 text-[#f9d423]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.total_tickets}</div>
                  <div className="text-xs text-white/60 mt-1">
                    {analytics.tickets_this_month > analytics.tickets_last_month ? (
                      <span className="flex items-center gap-1 text-green-300">
                        <TrendingUp className="h-3 w-3" />
                        +{analytics.tickets_this_month - analytics.tickets_last_month} this month
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-300">
                        <TrendingDown className="h-3 w-3" />
                        {analytics.tickets_this_month - analytics.tickets_last_month} this month
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-md bg-[#0f2027]/80 border border-white/20 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Open Tickets</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.open_tickets}</div>
                  <div className="text-xs text-white/60 mt-1">
                    Requires attention
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-md bg-[#0f2027]/80 border border-white/20 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.in_progress_tickets}</div>
                  <div className="text-xs text-white/60 mt-1">
                    Being worked on
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-md bg-[#0f2027]/80 border border-white/20 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Resolved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.closed_tickets}</div>
                  <div className="text-xs text-white/60 mt-1">
                    Successfully closed
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="backdrop-blur-md bg-[#0f2027]/80 border border-white/20 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-[#f9d423]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.total_users}</div>
                  <div className="text-xs text-white/60 mt-1">
                    {analytics.active_agents} active agents
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-md bg-[#0f2027]/80 border border-white/20 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Avg Resolution Time</CardTitle>
                  <Clock className="h-4 w-4 text-[#f9d423]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.avg_resolution_time}</div>
                  <div className="text-xs text-white/60 mt-1">
                    {analytics.resolution_trend > 0 ? (
                      <span className="flex items-center gap-1 text-red-300">
                        <TrendingUp className="h-3 w-3" />
                        +{analytics.resolution_trend}% vs last month
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-300">
                        <TrendingDown className="h-3 w-3" />
                        {analytics.resolution_trend}% vs last month
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-md bg-[#0f2027]/80 border border-white/20 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Satisfaction Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-[#f9d423]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.satisfaction_rate}</div>
                  <div className="text-xs text-white/60 mt-1">
                    {analytics.customer_satisfaction_trend > 0 ? (
                      <span className="flex items-center gap-1 text-green-300">
                        <TrendingUp className="h-3 w-3" />
                        +{analytics.customer_satisfaction_trend}% vs last month
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-300">
                        <TrendingDown className="h-3 w-3" />
                        {analytics.customer_satisfaction_trend}% vs last month
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Insights */}
            <Card className="backdrop-blur-md bg-[#0f2027]/80 border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#f9d423]" />
                  System Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Ticket Distribution</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Open</span>
                        <span className="text-white">{Math.round((analytics.open_tickets / analytics.total_tickets) * 100) || 0}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">In Progress</span>
                        <span className="text-white">{Math.round((analytics.in_progress_tickets / analytics.total_tickets) * 100) || 0}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Resolved</span>
                        <span className="text-white">{Math.round((analytics.closed_tickets / analytics.total_tickets) * 100) || 0}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">System Health</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Resolution Rate</span>
                        <span className="text-green-300">{Math.round((analytics.closed_tickets / analytics.total_tickets) * 100) || 0}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Agent Utilization</span>
                        <span className="text-[#f9d423]">{Math.round((analytics.in_progress_tickets / analytics.active_agents) * 100) || 0}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Customer Satisfaction</span>
                        <span className="text-green-300">{analytics.satisfaction_rate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
