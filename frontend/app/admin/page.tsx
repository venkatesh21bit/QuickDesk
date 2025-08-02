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
  Users, 
  Settings, 
  BarChart3,
  Shield, 
  Database,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react"

const mockAdminStats = {
  totalUsers: 156,
  totalTickets: 2834,
  activeAgents: 12,
  categories: 8,
  avgResolutionTime: "2.4h",
  satisfactionRate: "94%"
}

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@company.com", role: "customer", status: "active", tickets: 5 },
  { id: 2, name: "Jane Smith", email: "jane@company.com", role: "agent", status: "active", tickets: 23 },
  { id: 3, name: "Mike Johnson", email: "mike@company.com", role: "customer", status: "inactive", tickets: 2 },
  { id: 4, name: "Sarah Wilson", email: "sarah@company.com", role: "agent", status: "active", tickets: 18 }
]

const mockCategories = [
  { id: 1, name: "Technical Support", tickets: 45, description: "Hardware and software issues" },
  { id: 2, name: "Account Issues", tickets: 23, description: "Login and account related problems" },
  { id: 3, name: "Software Request", tickets: 18, description: "Software installation requests" },
  { id: 4, name: "Hardware Issues", tickets: 12, description: "Physical hardware problems" }
]

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("overview")

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-[#ff4e50] to-[#f9d423]">
        <MainHeader />
        <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
            <p className="text-white/90">
              Manage users, categories, and monitor system performance.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <BarChart3 className="h-4 w-4 mr-2 text-[#f9d423]" />
              Analytics
            </Button>
            <Button className="bg-white text-[#ff4e50] hover:bg-white/90">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>      {/* Navigation Tabs */}
      <div className="border-b border-white/20">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "users", label: "User Management", icon: Users },
            { id: "categories", label: "Categories", icon: Database },
            { id: "analytics", label: "Analytics", icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-[#f9d423] text-[#f9d423]"
                  : "border-transparent text-white/70 hover:text-white hover:border-white/30"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
                <Users className="h-4 w-4 text-[#f9d423]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{mockAdminStats.totalUsers}</div>
                <p className="text-xs text-white/60">+12 this month</p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Tickets</CardTitle>
                <AlertTriangle className="h-4 w-4 text-[#f9d423]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{mockAdminStats.totalTickets}</div>
                <p className="text-xs text-white/60">+89 this week</p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Active Agents</CardTitle>
                <UserCheck className="h-4 w-4 text-[#f9d423]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{mockAdminStats.activeAgents}</div>
                <p className="text-xs text-white/60">Online now</p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Categories</CardTitle>
                <Database className="h-4 w-4 text-[#f9d423]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{mockAdminStats.categories}</div>
                <p className="text-xs text-white/60">Active categories</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Avg Resolution</CardTitle>
                <Clock className="h-4 w-4 text-[#f9d423]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{mockAdminStats.avgResolutionTime}</div>
                <p className="text-xs text-white/60">15% faster</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Satisfaction</CardTitle>
                <CheckCircle className="h-4 w-4 text-[#f9d423]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{mockAdminStats.satisfactionRate}</div>
                <p className="text-xs text-white/60">+2% this month</p>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Database</span>
                  <Badge variant="success">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Email Service</span>
                  <Badge variant="success">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">File Storage</span>
                  <Badge variant="warning">80% Full</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">API Response</span>
                  <Badge variant="success">125ms avg</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Recent Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { action: "Created category", detail: "Hardware Issues", time: "2 hours ago" },
                  { action: "Updated user role", detail: "jane@company.com → Agent", time: "4 hours ago" },
                  { action: "System backup", detail: "Completed successfully", time: "6 hours ago" },
                  { action: "Updated SLA", detail: "Response time: 2h → 1h", time: "1 day ago" }
                ].map((activity, index) => (
                  <div key={index} className="text-sm">
                    <p className="text-white">
                      <span className="font-medium text-[#f9d423]">{activity.action}:</span> {activity.detail}
                    </p>
                    <p className="text-xs text-white/60">{activity.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
            </div>
            <Button className="bg-white text-[#ff4e50] hover:bg-white/90">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/5">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-white">{user.name}</p>
                        <Badge variant={user.role === "agent" ? "info" : "secondary"}>
                          {user.role}
                        </Badge>
                        <Badge variant={user.status === "active" ? "success" : "secondary"}>
                          {user.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-white/60">
                        <span>{user.email}</span>
                        <span>•</span>
                        <span>{user.tickets} tickets</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Ticket Categories</h2>
            <Button className="bg-white text-[#ff4e50] hover:bg-white/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {mockCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/5">
                    <div className="space-y-1">
                      <p className="font-medium text-white">{category.name}</p>
                      <p className="text-sm text-white/70">{category.description}</p>
                      <p className="text-xs text-white/60">{category.tickets} tickets</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Ticket Volume Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-white/5 border border-white/20 rounded">
                  <p className="text-white/60">Chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Resolution Time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-white/5 border border-white/20 rounded">
                  <p className="text-white/60">Chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Agent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-white/5 border border-white/20 rounded">
                  <p className="text-white/60">Chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-white/5 border border-white/20 rounded">
                  <p className="text-white/60">Chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
        </div>
      </div>
    </AuthGuard>
  )
}
