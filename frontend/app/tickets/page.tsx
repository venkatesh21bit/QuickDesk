"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { Search, Filter, Plus, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const mockTickets = [
  {
    id: "TICK-001",
    subject: "Cannot access company email",
    description: "I'm unable to log into my company email account. Getting authentication errors.",
    status: "open",
    priority: "high",
    category: "Technical Support",
    created: "2024-01-15T10:30:00Z",
    updated: "2024-01-15T14:20:00Z",
    author: "John Doe",
    votes: 5,
    replies: 3
  },
  {
    id: "TICK-002",
    subject: "Software installation request - Adobe Creative Suite",
    description: "Need Adobe Creative Suite installed for graphic design work.",
    status: "in-progress", 
    priority: "medium",
    category: "Software Request",
    created: "2024-01-14T09:15:00Z",
    updated: "2024-01-15T11:45:00Z",
    author: "Jane Smith",
    votes: 2,
    replies: 1
  },
  {
    id: "TICK-003",
    subject: "Password reset needed",
    description: "Forgot my password and need it reset for my account.",
    status: "resolved",
    priority: "low",
    category: "Account Issues",
    created: "2024-01-12T16:20:00Z",
    updated: "2024-01-13T10:30:00Z",
    author: "Mike Johnson",
    votes: 1,
    replies: 2
  }
]

const statusOptions = ["all", "open", "in-progress", "resolved", "closed"]
const priorityOptions = ["all", "low", "medium", "high"]
const categoryOptions = ["all", "Technical Support", "Account Issues", "Software Request", "Hardware Issues"]

export default function TicketsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive"
      case "in-progress": return "warning"
      case "resolved": return "success"
      case "closed": return "secondary"
      default: return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive"
      case "medium": return "warning"
      case "low": return "secondary"
      default: return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Tickets</h1>
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
                {statusOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                {priorityOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
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
                {categoryOptions.map(option => (
                  <option key={option} value={option}>
                    {option === "all" ? "All Categories" : option}
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
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="votes">Most Voted</option>
                <option value="replies">Most Replied</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {mockTickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-center space-x-3">
                    <Link 
                      href={`/tickets/${ticket.id}`}
                      className="text-lg font-semibold hover:text-primary"
                    >
                      {ticket.subject}
                    </Link>
                    <Badge variant={getStatusColor(ticket.status) as any}>
                      {ticket.status}
                    </Badge>
                    <Badge variant={getPriorityColor(ticket.priority) as any}>
                      {ticket.priority}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {ticket.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{ticket.id}</span>
                    <span>•</span>
                    <span>{ticket.category}</span>
                    <span>•</span>
                    <span>Created {formatDate(ticket.created)}</span>
                    <span>•</span>
                    <span>Updated {formatDate(ticket.updated)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {ticket.votes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {ticket.replies}
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    by {ticket.author}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <Button variant="outline" disabled>Previous</Button>
        <Button variant="outline">1</Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">3</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  )
}
