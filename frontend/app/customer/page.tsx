"use client"

import * as React from "react"
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
  Filter
} from "lucide-react"

const mockCustomerTickets = [
  {
    id: "TICK-001",
    subject: "Cannot access email account",
    status: "open",
    priority: "high",
    category: "Technical Support",
    created: "2024-01-15T10:30:00Z",
    updated: "2 hours ago",
    replies: 3
  },
  {
    id: "TICK-002", 
    subject: "Software installation request",
    status: "in-progress",
    priority: "medium", 
    category: "Software Request",
    created: "2024-01-14T09:15:00Z",
    updated: "1 day ago",
    replies: 1
  },
  {
    id: "TICK-003",
    subject: "Password reset completed",
    status: "resolved",
    priority: "low",
    category: "Account Issues",
    created: "2024-01-12T16:20:00Z",
    updated: "3 days ago",
    replies: 2
  }
]

export default function CustomerDashboard() {
  const [searchTerm, setSearchTerm] = React.useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive"
      case "in-progress": return "warning"
      case "resolved": return "success"
      case "closed": return "secondary"
      default: return "secondary"
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Dashboard</h1>
          <p className="text-muted-foreground">
            Track your support tickets and get help when you need it.
          </p>
        </div>
        <Link href="/tickets/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Ticket
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2h</div>
            <p className="text-xs text-muted-foreground">Response time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* My Tickets */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Recent Tickets</CardTitle>
                <Link href="/tickets">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCustomerTickets.map((ticket) => (
                <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{ticket.subject}</p>
                        <Badge variant={getStatusColor(ticket.status) as any} className="text-xs">
                          {ticket.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        <span>{ticket.id}</span>
                        <span>•</span>
                        <span>{ticket.category}</span>
                        <span>•</span>
                        <span>Updated {ticket.updated}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {ticket.replies}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/tickets/new">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Ticket
                </Button>
              </Link>
              <Link href="/tickets">
                <Button variant="outline" className="w-full justify-start">
                  <Ticket className="h-4 w-4 mr-2" />
                  View All My Tickets
                </Button>
              </Link>
              <Link href="/knowledge-base">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Knowledge Base
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Help Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Help Articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "How to reset your password",
                "Setting up email on mobile",
                "VPN connection guide",
                "Software installation requests",
                "Reporting security issues"
              ].map((article, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                  <p className="text-sm">{article}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Service</span>
                <Badge variant="success">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">VPN Gateway</span>
                <Badge variant="success">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Support Portal</span>
                <Badge variant="success">Operational</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
