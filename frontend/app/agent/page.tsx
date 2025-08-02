"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthGuard } from "@/components/auth-guard"
import { MainHeader } from "@/components/main-header"
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
    <AuthGuard>
      <MainHeader />
      <div className="min-h-screen bg-gradient-to-br from-[#ff4e50] to-[#f9d423]">
        <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Support Agent Dashboard</h1>
          <p className="text-white/90">
            Manage and resolve customer support tickets efficiently.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button className="bg-white text-[#ff4e50] hover:bg-white/90 font-semibold">Take Break</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">My Tickets</CardTitle>
            <UserCheck className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-white/70">Currently assigned</p>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Unassigned</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">5</div>
            <p className="text-xs text-white/70">Need assignment</p>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-white/70">+3 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">45m</div>
            <p className="text-xs text-white/70">First response</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Rating</CardTitle>
            <Star className="h-4 w-4 text-[#f9d423]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4.8</div>
            <p className="text-xs text-white/70">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Ticket Queue */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Ticket Queue</CardTitle>
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
                  <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <Link href={`/tickets/${ticket.id}`} className="font-medium text-white hover:text-[#f9d423]">
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
                    <div className="flex items-center space-x-3 text-xs text-white/60">
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
                      <Button size="sm" className="bg-white text-[#ff4e50] hover:bg-white/90">Assign to Me</Button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Reply</Button>
                        <Button size="sm" className="bg-white text-[#ff4e50] hover:bg-white/90">Resolve</Button>
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
          <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" variant="outline">
                <Users className="h-4 w-4 mr-2 text-[#f9d423]" />
                View All Tickets
              </Button>
              <Button className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2 text-[#f9d423]" />
                Unassigned Queue
              </Button>
              <Button className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2 text-[#f9d423]" />
                Performance Report
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { action: "Resolved", ticket: "TICK-045", time: "5 mins ago" },
                { action: "Replied to", ticket: "TICK-032", time: "15 mins ago" },
                { action: "Assigned", ticket: "TICK-067", time: "1 hour ago" },
                { action: "Escalated", ticket: "TICK-023", time: "2 hours ago" }
              ].map((activity, index) => (
                <div key={index} className="text-sm">
                  <p className="text-white">
                    <span className="font-medium text-[#f9d423]">{activity.action}</span> {activity.ticket}
                  </p>
                  <p className="text-xs text-white/60">{activity.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Knowledge Base */}
          <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Agent Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Troubleshooting Guide",
                "Escalation Procedures",
                "Common Solutions",
                "Contact Directory",
                "SLA Guidelines"
              ].map((resource, index) => (
                <div key={index} className="p-2 border border-white/20 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <p className="text-sm text-white">{resource}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      </div>
    </AuthGuard>
  )
}
