"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Ticket, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Users, 
  AlertTriangle,
  MessageSquare,
  Plus
} from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your support activity.
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 new this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2h</div>
            <p className="text-xs text-muted-foreground">
              Average response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: "TICK-001",
                  title: "Cannot access email account",
                  status: "open",
                  priority: "high",
                  updated: "2 hours ago",
                  replies: 3
                },
                {
                  id: "TICK-002", 
                  title: "Software installation request",
                  status: "in-progress",
                  priority: "medium",
                  updated: "1 day ago",
                  replies: 1
                },
                {
                  id: "TICK-003",
                  title: "Password reset needed",
                  status: "resolved",
                  priority: "low",
                  updated: "3 days ago",
                  replies: 2
                },
                {
                  id: "TICK-004",
                  title: "VPN connection issues",
                  status: "open", 
                  priority: "medium",
                  updated: "5 days ago",
                  replies: 0
                }
              ].map((ticket) => (
                <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{ticket.title}</p>
                        <Badge 
                          variant={
                            ticket.status === "open"
                              ? "destructive"
                              : ticket.status === "in-progress"
                              ? "warning"
                              : "success"
                          }
                          className="text-xs"
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        <span>{ticket.id}</span>
                        <span>•</span>
                        <span className="capitalize">{ticket.priority} priority</span>
                        <span>•</span>
                        <span>Updated {ticket.updated}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {ticket.replies > 0 && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {ticket.replies}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              <div className="pt-2">
                <Link href="/tickets">
                  <Button variant="outline" className="w-full">
                    View All Tickets
                  </Button>
                </Link>
              </div>
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
                  View My Tickets
                </Button>
              </Link>
              <Link href="/knowledge-base">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Browse Knowledge Base
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Knowledge Base Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "How to reset your password",
                "Setting up VPN access",
                "Email troubleshooting guide", 
                "Software installation process",
                "Hardware replacement requests"
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
                <span className="text-sm">File Server</span>
                <Badge variant="warning">Maintenance</Badge>
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
