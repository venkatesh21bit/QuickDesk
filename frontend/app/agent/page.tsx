"use client"

import * as React from "react"
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
  Star
} from "lucide-react"

const mockAgentTickets = [
  {
    id: "TICK-001",
    subject: "Cannot access email account",
    status: "assigned",
    priority: "high",
    category: "Technical Support",
    customer: "John Doe",
    created: "2 hours ago",
    lastUpdate: "30 mins ago",
    assignee: "me"
  },
  {
    id: "TICK-002", 
    subject: "VPN connection issues",
    status: "in-progress",
    priority: "medium", 
    category: "Network",
    customer: "Jane Smith",
    created: "4 hours ago",
    lastUpdate: "1 hour ago",
    assignee: "me"
  },
  {
    id: "TICK-003",
    subject: "Software installation request",
    status: "waiting-customer",
    priority: "low",
    category: "Software Request",
    customer: "Mike Johnson",
    created: "1 day ago",
    lastUpdate: "6 hours ago",
    assignee: "me"
  },
  {
    id: "TICK-004",
    subject: "Printer not working",
    status: "unassigned",
    priority: "medium",
    category: "Hardware",
    customer: "Sarah Wilson",
    created: "3 hours ago",
    lastUpdate: "3 hours ago",
    assignee: null
  }
]

export default function AgentDashboard() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filter, setFilter] = React.useState("my-tickets")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned": return "info"
      case "in-progress": return "warning"
      case "waiting-customer": return "secondary"
      case "unassigned": return "destructive"
      case "resolved": return "success"
      default: return "secondary"
    }
  }

  const filteredTickets = mockAgentTickets.filter(ticket => {
    if (filter === "my-tickets") return ticket.assignee === "me"
    if (filter === "unassigned") return ticket.assignee === null
    return true
  })

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Agent Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and resolve customer support tickets efficiently.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button>Take Break</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Tickets</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Currently assigned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Need assignment</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45m</div>
            <p className="text-xs text-muted-foreground">First response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Ticket Queue */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ticket Queue</CardTitle>
                <div className="flex items-center space-x-2">
                  <select 
                    className="text-sm border rounded px-2 py-1"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Tickets</option>
                    <option value="my-tickets">My Tickets</option>
                    <option value="unassigned">Unassigned</option>
                  </select>
                </div>
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
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <Link href={`/tickets/${ticket.id}`} className="font-medium hover:text-primary">
                        {ticket.subject}
                      </Link>
                      <Badge variant={getStatusColor(ticket.status) as any} className="text-xs">
                        {ticket.status.replace('-', ' ')}
                      </Badge>
                      <Badge 
                        variant={ticket.priority === "high" ? "destructive" : ticket.priority === "medium" ? "warning" : "secondary"}
                        className="text-xs"
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span>{ticket.id}</span>
                      <span>•</span>
                      <span>{ticket.customer}</span>
                      <span>•</span>
                      <span>{ticket.category}</span>
                      <span>•</span>
                      <span>Created {ticket.created}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {ticket.assignee === null ? (
                      <Button size="sm">Assign to Me</Button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">Reply</Button>
                        <Button size="sm">Resolve</Button>
                      </div>
                    )}
                  </div>
                </div>
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
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                View All Tickets
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Unassigned Queue
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Performance Report
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { action: "Resolved", ticket: "TICK-045", time: "5 mins ago" },
                { action: "Replied to", ticket: "TICK-032", time: "15 mins ago" },
                { action: "Assigned", ticket: "TICK-067", time: "1 hour ago" },
                { action: "Escalated", ticket: "TICK-023", time: "2 hours ago" }
              ].map((activity, index) => (
                <div key={index} className="text-sm">
                  <p>
                    <span className="font-medium">{activity.action}</span> {activity.ticket}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Knowledge Base */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Troubleshooting Guide",
                "Escalation Procedures",
                "Common Solutions",
                "Contact Directory",
                "SLA Guidelines"
              ].map((resource, index) => (
                <div key={index} className="p-2 border rounded hover:bg-accent cursor-pointer transition-colors">
                  <p className="text-sm">{resource}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
