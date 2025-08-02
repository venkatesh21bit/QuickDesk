"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Ticket, TrendingUp, Clock, CheckCircle, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { AuthGuard } from "@/components/auth-guard"
import { MainHeader } from "@/components/main-header"

interface DashboardStats {
  total_tickets: number
  open_tickets: number
  in_progress_tickets: number
  resolved_tickets: number
  closed_tickets: number
  urgent_tickets: number
  my_tickets?: number
  assigned_tickets?: number
  avg_response_time?: string
  avg_resolution_time?: string
}

interface TicketData {
  id: string
  ticket_number: string
  subject: string
  status: string
  priority_name: string
  priority_level: number
  created_at: string
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentTickets, setRecentTickets] = useState<TicketData[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingTickets, setLoadingTickets] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      loadDashboardData()
    }
  }, [user, isLoading, router])

  const loadDashboardData = async () => {
    try {
      // Load dashboard stats
      const statsData = await api.getDashboardStats()
      setStats(statsData)
      setLoadingStats(false)

      // Load recent tickets
      const params = new URLSearchParams({
        ordering: '-created_at',
        limit: '5'
      })
      const ticketsData = await api.getTickets(params)
      setRecentTickets(ticketsData.results || [])
      setLoadingTickets(false)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      setLoadingStats(false)
      setLoadingTickets(false)
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "open":
        return "destructive"
      case "in_progress":
        return "warning"
      case "resolved":
        return "success"
      case "closed":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getPriorityVariant = (priorityLevel: number) => {
    switch (priorityLevel) {
      case 4: // Urgent
        return "destructive"
      case 3: // High
        return "warning"
      case 2: // Medium
        return "default"
      case 1: // Low
        return "secondary"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (isLoading || !user) {
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
          <div className="container mx-auto py-8 relative z-10">
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f9d423] border-r-transparent mx-auto"></div>
                <p className="text-white text-lg font-medium">Loading dashboard...</p>
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
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back, {user.first_name || user.username}
            </h1>
            <p className="text-white/70">
              Here's what's happening with your support tickets today.
            </p>
          </div>
          <Button 
            onClick={() => router.push("/tickets/new")}
            className="bg-gradient-to-r from-[#ff4e50] to-[#f9d423] hover:from-[#f9d423] hover:to-[#ff4e50] text-white font-semibold button-3d bounce-3d"
          >
            <Ticket className="h-4 w-4 mr-2" />
            Create New Ticket
          </Button>
        </div>      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loadingStats ? "..." : stats?.total_tickets || 0}
            </div>
            <p className="text-xs text-white/60">
              {user.role === "customer" ? "Your tickets" : "All tickets"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Open Tickets</CardTitle>
            <Clock className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loadingStats ? "..." : stats?.open_tickets || 0}
            </div>
            <p className="text-xs text-white/60">
              Need attention
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">In Progress</CardTitle>
            <Users className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loadingStats ? "..." : stats?.in_progress_tickets || 0}
            </div>
            <p className="text-xs text-white/60">
              Being worked on
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loadingStats ? "..." : stats?.resolved_tickets || 0}
            </div>
            <p className="text-xs text-white/60">
              Completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
          <CardHeader>
            <CardTitle className="text-white">Recent Tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingTickets ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentTickets.length > 0 ? (
              recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border border-white/20 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                     onClick={() => router.push(`/tickets/${ticket.id}`)}>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">{ticket.subject}</p>
                    <p className="text-xs text-white/60">
                      {ticket.ticket_number} • {formatDate(ticket.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getPriorityVariant(ticket.priority_level)}>
                      {ticket.priority_name}
                    </Badge>
                    <Badge variant={getStatusVariant(ticket.status)}>
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-white/60">
                <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50 text-[#f9d423]" />
                <p className="text-white">No tickets found</p>
                <Button 
                  variant="outline" 
                  className="mt-2 border-white/30 text-white hover:bg-white/10 button-3d"
                  onClick={() => router.push("/tickets/new")}
                >
                  Create your first ticket
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start bg-gradient-to-r from-[#ff4e50] to-[#f9d423] hover:from-[#f9d423] hover:to-[#ff4e50] text-white font-semibold button-3d"
              onClick={() => router.push("/tickets/new")}
            >
              <Ticket className="h-4 w-4 mr-2" />
              Create New Ticket
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => router.push("/tickets")}
            >
              <Clock className="h-4 w-4 mr-2 text-[#f9d423]" />
              View All Tickets
            </Button>
            {user.role !== "customer" && (
              <Button 
                variant="outline" 
                className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => router.push(`/${user.role}`)}
              >
                <Users className="h-4 w-4 mr-2 text-[#f9d423]" />
                {user.role === "agent" ? "Agent Dashboard" : "Admin Panel"}
              </Button>
            )}
            <Button 
              variant="outline" 
              className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => router.push("/profile")}
            >
              <Users className="h-4 w-4 mr-2 text-[#f9d423]" />
              Profile Settings
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
