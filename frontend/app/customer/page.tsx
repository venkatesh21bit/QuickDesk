"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Ticket, 
  Plus, 
  Search,
  Clock, 
  CheckCircle, 
  AlertTriangle,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Filter,
  Loader2
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"

interface TicketSummary {
  id: string
  ticket_number: string
  subject: string
  status: string
  priority_name: string
  priority_level: number
  category_name: string
  category_color: string
  created_at: string
  updated_at: string
  comments_count: number
}

interface DashboardStats {
  total_tickets: number
  open_tickets: number
  in_progress_tickets: number
  resolved_tickets: number
  closed_tickets: number
}

export default function CustomerDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [tickets, setTickets] = useState<TicketSummary[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    total_tickets: 0,
    open_tickets: 0,
    in_progress_tickets: 0,
    resolved_tickets: 0,
    closed_tickets: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "customer")) {
      router.push("/login")
      return
    }

    if (user && user.role === "customer") {
      loadDashboardData()
    }
  }, [user, authLoading, router])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [dashboardData, ticketsData] = await Promise.all([
        api.getDashboardStats(),
        api.getTickets(new URLSearchParams({ 
          created_by: user?.id?.toString() || '',
          ordering: '-created_at',
          page_size: '10'
        }))
      ])
      
      setStats(dashboardData)
      setTickets(ticketsData.results || ticketsData)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive"
      case "in_progress": return "warning"
      case "resolved": return "success"
      case "closed": return "secondary"
      default: return "secondary"
    }
  }

  const getPriorityColor = (level: number) => {
    switch (level) {
      case 4: return "destructive" // Urgent
      case 3: return "warning"     // High
      case 2: return "default"     // Medium
      case 1: return "secondary"   // Low
      default: return "secondary"
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

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ff4e50] to-[#f9d423]">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Loading dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff4e50] to-[#f9d423]">
      <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Customer Dashboard</h1>
          <p className="text-white/70">
            Track your support tickets and get help when you need it.
          </p>
        </div>
        <Link href="/tickets/new">
          <Button className="bg-white text-[#ff4e50] hover:bg-white/90 font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            Create New Ticket
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total_tickets}</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Open</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.open_tickets}</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.in_progress_tickets}</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.resolved_tickets}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Recent Tickets</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/60" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#f9d423]"
                />
              </div>
              <Link href="/tickets">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                  View All
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTickets.length > 0 ? (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Link 
                        href={`/tickets/${ticket.id}`}
                        className="font-medium text-white hover:text-[#f9d423]"
                      >
                        {ticket.subject}
                      </Link>
                      <Badge variant={getStatusColor(ticket.status) as any}>
                        {ticket.status.replace("_", " ")}
                      </Badge>
                      <Badge variant={getPriorityColor(ticket.priority_level) as any}>
                        {ticket.priority_name}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <span>#{ticket.ticket_number}</span>
                      <Badge 
                        variant="outline" 
                        style={{ borderColor: ticket.category_color, color: ticket.category_color }}
                        className="bg-white/10"
                      >
                        {ticket.category_name}
                      </Badge>
                      <span>Created {formatDate(ticket.created_at)}</span>
                      <span className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {ticket.comments_count} replies
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-white/60">
                    Updated {formatDate(ticket.updated_at)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Ticket className="h-12 w-12 text-white/60 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 text-white">No tickets found</h3>
              <p className="text-white/70 mb-4">
                {searchTerm ? "No tickets match your search." : "You haven't created any tickets yet."}
              </p>
              <Link href="/tickets/new">
                <Button className="bg-white text-[#ff4e50] hover:bg-white/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Ticket
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl hover:bg-[#0f2027]/90 transition-all cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-[#f9d423]" />
              <div>
                <CardTitle className="text-lg text-white">Knowledge Base</CardTitle>
                <p className="text-sm text-white/70">
                  Browse articles and find answers
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl hover:bg-[#0f2027]/90 transition-all cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-8 w-8 text-[#f9d423]" />
              <div>
                <CardTitle className="text-lg text-white">Live Chat</CardTitle>
                <p className="text-sm text-white/70">
                  Get instant help from our team
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl hover:bg-[#0f2027]/90 transition-all cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-[#f9d423]" />
              <div>
                <CardTitle className="text-lg text-white">System Status</CardTitle>
                <p className="text-sm text-white/70">
                  Check current system health
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
      </div>
    </div>
  )
}
