"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  Search,
  Plus,
  Edit,
  MoreHorizontal
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { AuthGuard } from "@/components/auth-guard"
import { MainHeader } from "@/components/main-header"

interface User {
  id: string
  username: string
  email: string
  role: string
  is_active: boolean
  ticket_count?: number
  date_joined: string
}

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers()
      setUsers(response.results || response)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.changeUserRole(userId, newRole)
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } catch (error) {
      console.error("Error updating user role:", error)
    }
  }

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] relative overflow-hidden flex items-center justify-center">
          {/* Floating 3D Elements Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-32 h-32 bg-[#f9d423]/10 rounded-full floating-3d blur-sm"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-[#ff4e50]/10 rounded-full floating-3d" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-[#f9d423]/5 rounded-full floating-3d" style={{animationDelay: '4s'}}></div>
            <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-[#ff4e50]/5 rounded-full floating-3d" style={{animationDelay: '6s'}}></div>
            <div className="absolute bottom-20 right-10 w-28 h-28 bg-[#f9d423]/10 rounded-full floating-3d" style={{animationDelay: '8s'}}></div>
          </div>
          <div className="text-center space-y-4 relative z-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f9d423] border-r-transparent mx-auto" />
            <p className="text-white text-lg font-medium">Loading Users...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] relative overflow-hidden">
        {/* Floating 3D Elements Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#f9d423]/10 rounded-full floating-3d blur-sm"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-[#ff4e50]/10 rounded-full floating-3d" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-[#f9d423]/5 rounded-full floating-3d" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-[#ff4e50]/5 rounded-full floating-3d" style={{animationDelay: '6s'}}></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-[#f9d423]/10 rounded-full floating-3d" style={{animationDelay: '8s'}}></div>
        </div>
        <MainHeader />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-white">User Management</h1>
              <p className="text-white/80 text-lg">
                Manage user accounts, roles, and permissions
              </p>
            </div>

            {/* Search and Actions */}
            <Card className="backdrop-blur-md bg-[#0f2027]/80 border border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <Button className="border-white/50 bg-white/10 hover:bg-white/20 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Users List */}
            <Card className="backdrop-blur-md bg-[#0f2027]/80 border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Users ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/5">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-white">{user.username}</h4>
                          <Badge 
                            variant={user.role === "admin" ? "destructive" : user.role === "agent" ? "default" : "secondary"}
                            className="bg-white/20 text-white border-white/30"
                          >
                            {user.role}
                          </Badge>
                          <Badge 
                            variant={user.is_active ? "default" : "secondary"}
                            className={user.is_active ? "bg-green-500/20 text-green-300 border-green-400/30" : "bg-white/20 text-white/60 border-white/30"}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60">{user.email}</p>
                        <p className="text-xs text-white/50">
                          Joined {new Date(user.date_joined).toLocaleDateString()}
                          {user.ticket_count !== undefined && ` • ${user.ticket_count} tickets`}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select 
                          className="p-2 text-sm border border-white/20 rounded bg-white/10 text-white"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        >
                          <option value="customer" className="bg-[#0f2027] text-white">Customer</option>
                          <option value="agent" className="bg-[#0f2027] text-white">Agent</option>
                          <option value="admin" className="bg-[#0f2027] text-white">Admin</option>
                        </select>
                        <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-white/30 mx-auto mb-4" />
                      <p className="text-white/60">No users found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
