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
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {user.role === "customer" ? "My Tickets" : "All Tickets"}
          </h1>
          <p className="text-muted-foreground">
            View and manage your support tickets
          </p>
        </div>
        <Link href="/tickets/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
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

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                {priorities.map(priority => (
                  <option key={priority.id} value={priority.name}>
                    {priority.name.charAt(0).toUpperCase() + priority.name.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="-created_at">Most Recent</option>
                <option value="created_at">Oldest First</option>
                <option value="-upvotes">Most Voted</option>
                <option value="-priority__level">Highest Priority</option>
                <option value="-updated_at">Recently Updated</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading tickets...</span>
          </div>
        ) : tickets.length > 0 ? (
          tickets.map((ticket) => (
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
                      {ticket.is_internal && (
                        <Badge variant="secondary">Internal</Badge>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
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
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {ticket.upvotes}
                      </Button>
                      <Button 
                        variant={ticket.user_vote === "down" ? "default" : "ghost"} 
                        size="sm"
                        onClick={() => handleVote(ticket.id, "down")}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {ticket.downvotes}
                      </Button>
                      <Button variant="ghost" size="sm">
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
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No tickets found</p>
              <Link href="/tickets/new">
                <Button>
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
              >
                {pageNum}
              </Button>
            )
          })}
          
          <Button 
            variant="outline"
            disabled={!pagination.next}
            onClick={() => loadTickets(pagination.currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
