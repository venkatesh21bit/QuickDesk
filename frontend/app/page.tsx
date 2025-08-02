"use client"

import * as React from "react"
import { Ticket, TrendingUp, Clock, CheckCircle, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to QuickDesk</h1>
          <p className="text-muted-foreground">
            Manage your support tickets efficiently and get help when you need it.
          </p>
        </div>
        <Button>
          <Ticket className="h-4 w-4 mr-2" />
          Create New Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              -1 from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground">
              +3 this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">
              15% faster
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                id: "TICK-001",
                title: "Cannot access email",
                status: "open",
                priority: "high",
                created: "2 hours ago"
              },
              {
                id: "TICK-002", 
                title: "Software installation request",
                status: "in-progress",
                priority: "medium",
                created: "1 day ago"
              },
              {
                id: "TICK-003",
                title: "Password reset needed",
                status: "resolved",
                priority: "low",
                created: "3 days ago"
              }
            ].map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{ticket.title}</p>
                  <p className="text-xs text-muted-foreground">{ticket.id} • {ticket.created}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={
                      ticket.priority === "high" 
                        ? "destructive" 
                        : ticket.priority === "medium" 
                        ? "warning" 
                        : "secondary"
                    }
                  >
                    {ticket.priority}
                  </Badge>
                  <Badge 
                    variant={
                      ticket.status === "open"
                        ? "destructive"
                        : ticket.status === "in-progress"
                        ? "warning"
                        : "success"
                    }
                  >
                    {ticket.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "How to reset your password",
              "Email setup guide",
              "VPN connection troubleshooting", 
              "Software installation requests",
              "Hardware replacement process"
            ].map((article, index) => (
              <div key={index} className="flex items-center p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center mr-3">
                  <span className="text-xs font-medium">{index + 1}</span>
                </div>
                <p className="text-sm">{article}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
