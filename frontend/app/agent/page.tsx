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
  Users, 
  Search,
  Clock, 
  CheckCircle, 
  AlertTriangle,
  MessageSquare,
  UserCheck,
  TrendingUp,
  Filter,
  Bell,
  Star,
  Loader2
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { AuthGuard } from "@/components/auth-guard"
import { MainHeader } from "@/components/main-header"

interface TicketSummary {
  id: string
  ticket_number: string
  subject: string
  status: string
  priority_name: string
  priority_level: number
  category_name: string
  category_color: string
  created_by_username: string
  assigned_to_username?: string
  created_at: string
  updated_at: string
  comments_count: number
}

interface DashboardStats {
  total_tickets: number
  assigned_tickets: number
  in_progress_tickets: number
  resolved_tickets: number
  unassigned_tickets: number
}

export default function AgentDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [tickets, setTickets] = useState<TicketSummary[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    total_tickets: 0,
    assigned_tickets: 0,
    in_progress_tickets: 0,
    resolved_tickets: 0,
    unassigned_tickets: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "agent")) {
      router.push("/login")
      return
    }

    if (user && user.role === "agent") {
      loadDashboardData()
    }
  }, [user, authLoading, router])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [dashboardData, assignedTickets] = await Promise.all([
        api.getDashboardStats(),
        api.getTickets(new URLSearchParams({ 
          assigned_to: user?.id?.toString() || '',
          ordering: '-priority__level,-created_at',
          page_size: '20'
        }))
      ])
      
      setStats(dashboardData)
      setTickets(assignedTickets.results || assignedTickets)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignTicket = async (ticketId: string) => {
    try {
      await api.assignTicket(ticketId, user?.id?.toString() || '')
      // Reload tickets after assignment
      loadDashboardData()
    } catch (error) {
      console.error("Failed to assign ticket:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive"
      case "assigned": return "default"
      case "in_progress": return "warning"
      case "waiting_customer": return "secondary"
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
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.created_by_username.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority_name.toLowerCase() === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  if (authLoading || loading) {
    return (
      <AuthGuard>
        <MainHeader />
        <div className="min-h-screen bg-gradient-to-br from-[#ff4e50] to-[#f9d423]">
          <div className="container mx-auto py-8">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
              <span className="ml-2 text-white">Loading dashboard...</span>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and resolve customer support tickets.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Link href="/tickets">
            <Button>
              <Ticket className="h-4 w-4 mr-2" />
              All Tickets
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assigned_tickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.in_progress_tickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved_tickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unassigned_tickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_tickets}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>My Tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Status:</label>
              <select 
                className="p-2 border rounded-md text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="waiting_customer">Waiting Customer</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Priority:</label>
              <select 
                className="p-2 border rounded-md text-sm"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center space-x-3 flex-wrap">
                      <Link 
                        href={`/tickets/${ticket.id}`}
                        className="text-lg font-semibold hover:text-primary"
                      >
                        {ticket.subject}
                      </Link>
                      <Badge variant={getStatusColor(ticket.status) as any}>
                        {ticket.status.replace("_", " ")}
                      </Badge>
                      <Badge variant={getPriorityColor(ticket.priority_level) as any}>
                        {ticket.priority_name}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        style={{ borderColor: ticket.category_color, color: ticket.category_color }}
                      >
                        {ticket.category_name}
                      </Badge>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>#{ticket.ticket_number}</span>
                      <span>•</span>
                      <span>Customer: {ticket.created_by_username}</span>
                      <span>•</span>
                      <span>Created {formatDate(ticket.created_at)}</span>
                      <span>•</span>
                      <span>Updated {formatDate(ticket.updated_at)}</span>
                      <span className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {ticket.comments_count} replies
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-4">
                    <div className="flex items-center space-x-2">
                      <Link href={`/tickets/${ticket.id}`}>
                        <Button size="sm">
                          View Details
                        </Button>
                      </Link>
                      {!ticket.assigned_to_username && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAssignTicket(ticket.id)}
                        >
                          Assign to Me
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No tickets found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                  ? "No tickets match your current filters." 
                  : "You don't have any assigned tickets yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Performance Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Tickets Resolved</span>
              <span className="font-medium">{stats.resolved_tickets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Average Response Time</span>
              <span className="font-medium">2.3 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Customer Satisfaction</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="font-medium">4.8/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/tickets?status=open&assigned_to=">
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                View Unassigned Tickets
              </Button>
            </Link>
            <Link href="/tickets?priority=urgent">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Urgent Tickets
              </Button>
            </Link>
            <Link href="/tickets?status=waiting_customer">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Awaiting Customer Response
              </Button>
            </Link>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
