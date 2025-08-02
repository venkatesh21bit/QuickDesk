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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  Loader2,
  ChevronDown,
  Play,
  Pause,
  CheckCircle2,
  XCircle
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
      const [dashboardData, allTickets] = await Promise.all([
        api.getDashboardStats(),
        api.getTickets(new URLSearchParams({ 
          ordering: '-priority__level,-created_at',
          page_size: '50'
        }))
      ])
      
      setStats(dashboardData)
      setTickets(allTickets.results || allTickets)
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

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    try {
      await api.updateTicketStatus(ticketId, newStatus)
      // Reload tickets after status update
      loadDashboardData()
    } catch (error) {
      console.error("Failed to update ticket status:", error)
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
      {/* Header */}
      <div className="flex items-center justify-between slide-in-3d">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Agent Dashboard</h1>
          <p className="text-white/70 drop-shadow-sm">
            Manage and resolve customer support tickets.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-white/50 text-white hover:bg-white/20 hover:text-white bg-white/10 button-3d">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Link href="/tickets">
            <Button className="bg-gradient-to-r from-[#ff4e50] to-[#f9d423] hover:from-[#f9d423] hover:to-[#ff4e50] text-white font-semibold button-3d">
              <Ticket className="h-4 w-4 mr-2" />
              All Tickets
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 slide-in-3d" style={{animationDelay: '0.2s'}}>
        <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Assigned</CardTitle>
            <UserCheck className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.assigned_tickets}</div>
          </CardContent>
        </Card>
        <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.in_progress_tickets}</div>
          </CardContent>
        </Card>
        <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.resolved_tickets}</div>
          </CardContent>
        </Card>
        <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Unassigned</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.unassigned_tickets}</div>
          </CardContent>
        </Card>
        <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total</CardTitle>
            <Ticket className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total_tickets}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d slide-in-3d" style={{animationDelay: '0.4s'}}>
        <CardHeader>
          <CardTitle className="text-white">All Tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-3d pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#f9d423]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-white">Status:</label>
              <select 
                className="input-3d p-2 border rounded-md text-sm bg-white/10 border-white/20 text-white focus:border-[#f9d423]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all" className="text-gray-900">All</option>
                <option value="assigned" className="text-gray-900">Assigned</option>
                <option value="in_progress" className="text-gray-900">In Progress</option>
                <option value="waiting_customer" className="text-gray-900">Waiting Customer</option>
                <option value="resolved" className="text-gray-900">Resolved</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-white">Priority:</label>
              <select 
                className="input-3d p-2 border rounded-md text-sm bg-white/10 border-white/20 text-white focus:border-[#f9d423]"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all" className="text-gray-900">All</option>
                <option value="urgent" className="text-gray-900">Urgent</option>
                <option value="high" className="text-gray-900">High</option>
                <option value="medium" className="text-gray-900">Medium</option>
                <option value="low" className="text-gray-900">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4 slide-in-3d" style={{animationDelay: '0.6s'}}>
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket, index) => (
            <Card 
              key={ticket.id} 
              className="card-3d backdrop-blur-md bg-[#0f2027]/80 border-white/20 glass-3d hover:bg-[#0f2027]/90 transition-all"
              style={{animationDelay: `${0.8 + index * 0.1}s`}}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center space-x-3 flex-wrap">
                      <Link 
                        href={`/tickets/${ticket.id}`}
                        className="text-lg font-semibold text-white hover:text-[#f9d423] transition-colors"
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
                        className="bg-white/10"
                      >
                        {ticket.category_name}
                      </Badge>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center space-x-4 text-sm text-white/60">
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
                        <Button size="sm" className="button-3d bg-gradient-to-r from-[#ff4e50] to-[#f9d423] hover:from-[#f9d423] hover:to-[#ff4e50] text-white">
                          View Details
                        </Button>
                      </Link>
                      
                      {/* Status Update Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="button-3d border-white/50 text-white hover:bg-white/20 hover:text-white bg-white/10"
                          >
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Update Status
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white">
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(ticket.id, 'in_progress')}
                            disabled={ticket.status === 'in_progress'}
                            className="cursor-pointer"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(ticket.id, 'resolved')}
                            disabled={ticket.status === 'resolved'}
                            className="cursor-pointer"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(ticket.id, 'closed')}
                            disabled={ticket.status === 'closed'}
                            className="cursor-pointer"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Closed
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(ticket.id, 'open')}
                            disabled={ticket.status === 'open'}
                            className="cursor-pointer"
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Reopen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      {!ticket.assigned_to_username && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAssignTicket(ticket.id)}
                          className="border-white/50 text-white hover:bg-white/20 hover:text-white bg-white/10"
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
          <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
            <CardContent className="py-12 text-center">
              <Ticket className="h-12 w-12 text-white/60 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 text-white">No tickets found</h3>
              <p className="text-white/70">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                  ? "No tickets match your current filters." 
                  : "No tickets are currently available."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Performance Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/70">Tickets Resolved</span>
              <span className="font-medium text-white">{stats.resolved_tickets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/70">Average Response Time</span>
              <span className="font-medium text-white">2.3 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/70">Customer Satisfaction</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-[#f9d423] mr-1" />
                <span className="font-medium text-white">4.8/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Bell className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/tickets?status=open&assigned_to=">
              <Button variant="outline" className="w-full justify-start border-white/50 text-white hover:bg-white/20 hover:text-white bg-white/10">
                <AlertTriangle className="h-4 w-4 mr-2" />
                View Unassigned Tickets
              </Button>
            </Link>
            <Link href="/tickets?priority=urgent">
              <Button variant="outline" className="w-full justify-start border-white/50 text-white hover:bg-white/20 hover:text-white bg-white/10">
                <Clock className="h-4 w-4 mr-2" />
                Urgent Tickets
              </Button>
            </Link>
            <Link href="/tickets?status=waiting_customer">
              <Button variant="outline" className="w-full justify-start border-white/50 text-white hover:bg-white/20 hover:text-white bg-white/10">
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
