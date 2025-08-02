"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Filter, Plus, ThumbsUp, ThumbsDown, MessageCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { MainHeader } from "@/components/main-header"

interface Ticket {
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
  upvotes: number
  downvotes: number
  comments_count: number
  user_vote?: "up" | "down" | null
  created_at: string
  updated_at: string
  is_internal: boolean
}

interface PaginatedResponse {
  count: number
  next: string | null
  previous: string | null
  results: Ticket[]
}

export default function TicketsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("-created_at")
  const [categories, setCategories] = useState<any[]>([])
  const [priorities, setPriorities] = useState<any[]>([])
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    currentPage: 1,
    totalPages: 1
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      loadInitialData()
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadTickets()
    }
  }, [searchTerm, statusFilter, priorityFilter, categoryFilter, sortBy, user])

  const loadInitialData = async () => {
    try {
      const [categoriesData, prioritiesData] = await Promise.all([
        api.getCategories(),
        api.getPriorities()
      ])
      setCategories(categoriesData.results || categoriesData)
      setPriorities(prioritiesData.results || prioritiesData)
    } catch (error) {
      console.error("Failed to load initial data:", error)
    }
  }

  const loadTickets = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ordering: sortBy,
      })

      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (priorityFilter !== 'all') {
        const priority = priorities.find(p => p.name === priorityFilter)
        if (priority) params.append('priority', priority.id)
      }
      if (categoryFilter !== 'all') {
        const category = categories.find(c => c.name === categoryFilter)
        if (category) params.append('category', category.id)
      }

      const response: PaginatedResponse = await api.getTickets(params)
      setTickets(response.results)
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
        currentPage: page,
        totalPages: Math.ceil(response.count / 20) // Assuming 20 items per page
      })
    } catch (error) {
      console.error("Failed to load tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (ticketId: string, voteType: "up" | "down") => {
    try {
      await api.voteTicket(ticketId, voteType)
      // Reload tickets to get updated vote counts
      loadTickets(pagination.currentPage)
    } catch (error) {
      console.error("Failed to vote:", error)
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

  if (authLoading || !user) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
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
        
      <div className="container mx-auto py-8 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {user.role === "customer" ? "My Tickets" : "All Tickets"}
            </h1>
            <p className="text-white/70">
              View and manage your support tickets
            </p>
          </div>
          <Link href="/tickets/new">
            <Button className="bg-white text-[#ff4e50] hover:bg-white/90 font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#f9d423]"
              />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-white">Status</label>
                <select 
                  className="w-full p-2 border rounded-md bg-white/10 border-white/20 text-white focus:border-[#f9d423]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all" className="text-gray-900">All Status</option>
                <option value="open" className="text-gray-900">Open</option>
                <option value="in_progress" className="text-gray-900">In Progress</option>
                <option value="resolved" className="text-gray-900">Resolved</option>
                <option value="closed" className="text-gray-900">Closed</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-white">Priority</label>
              <select 
                className="w-full p-2 border rounded-md bg-white/10 border-white/20 text-white focus:border-[#f9d423]"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all" className="text-gray-900">All Priorities</option>
                {priorities.map(priority => (
                  <option key={priority.id} value={priority.name} className="text-gray-900">
                    {priority.name.charAt(0).toUpperCase() + priority.name.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-white">Category</label>
              <select 
                className="w-full p-2 border rounded-md bg-white/10 border-white/20 text-white focus:border-[#f9d423]"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all" className="text-gray-900">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name} className="text-gray-900">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-white">Sort By</label>
              <select 
                className="w-full p-2 border rounded-md bg-white/10 border-white/20 text-white focus:border-[#f9d423]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="-created_at" className="text-gray-900">Most Recent</option>
                <option value="created_at" className="text-gray-900">Oldest First</option>
                <option value="-upvotes" className="text-gray-900">Most Voted</option>
                <option value="-priority__level" className="text-gray-900">Highest Priority</option>
                <option value="-updated_at" className="text-gray-900">Recently Updated</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#f9d423]" />
              <span className="ml-2 text-white">Loading tickets...</span>
            </CardContent>
          </Card>
        ) : tickets.length > 0 ? (
          tickets.map((ticket) => (
            <Card key={ticket.id} className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl hover:bg-[#0f2027]/90 transition-all">
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
                      {ticket.is_internal && (
                        <Badge variant="secondary" className="bg-white/20 text-white">Internal</Badge>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center space-x-4 text-xs text-white/60">
                      <span>{ticket.ticket_number}</span>
                      <span>•</span>
                      <span>by {ticket.created_by_username}</span>
                      {ticket.assigned_to_username && (
                        <>
                          <span>•</span>
                          <span>assigned to {ticket.assigned_to_username}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>Created {formatDate(ticket.created_at)}</span>
                      <span>•</span>
                      <span>Updated {formatDate(ticket.updated_at)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant={ticket.user_vote === "up" ? "default" : "ghost"} 
                        size="sm"
                        onClick={() => handleVote(ticket.id, "up")}
                        className={ticket.user_vote === "up" ? "bg-[#f9d423] text-[#0f2027] hover:bg-[#f9d423]/90" : "text-white hover:bg-white/10 hover:text-[#f9d423]"}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {ticket.upvotes}
                      </Button>
                      <Button 
                        variant={ticket.user_vote === "down" ? "default" : "ghost"} 
                        size="sm"
                        onClick={() => handleVote(ticket.id, "down")}
                        className={ticket.user_vote === "down" ? "bg-red-500 text-white hover:bg-red-600" : "text-white hover:bg-white/10 hover:text-red-400"}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {ticket.downvotes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-[#f9d423]">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {ticket.comments_count}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
            <CardContent className="py-12 text-center">
              <p className="text-white/70 mb-4">No tickets found</p>
              <Link href="/tickets/new">
                <Button className="bg-white text-[#ff4e50] hover:bg-white/90 font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first ticket
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button 
            variant="outline" 
            disabled={!pagination.previous}
            onClick={() => loadTickets(pagination.currentPage - 1)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:bg-white/5 disabled:text-white/40"
          >
            Previous
          </Button>
          
          {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
            const pageNum = i + 1
            return (
              <Button
                key={pageNum}
                variant={pagination.currentPage === pageNum ? "default" : "outline"}
                onClick={() => loadTickets(pageNum)}
                className={pagination.currentPage === pageNum 
                  ? "bg-[#f9d423] text-[#0f2027] hover:bg-[#f9d423]/90" 
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }
              >
                {pageNum}
              </Button>
            )
          })}
          
          <Button 
            variant="outline"
            disabled={!pagination.next}
            onClick={() => loadTickets(pagination.currentPage + 1)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:bg-white/5 disabled:text-white/40"
          >
            Next
          </Button>
        </div>
      )}
      </div>
    </div>
    </>
  )
}
