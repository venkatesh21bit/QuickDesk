"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { MainHeader } from "@/components/main-header"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"

export default function CreateTicketPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [categories, setCategories] = useState<any[]>([])
  const [priorities, setPriorities] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "",
    priority: ""
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [categoriesData, prioritiesData] = await Promise.all([
        api.getCategories(),
        api.getPriorities()
      ])
      setCategories(categoriesData.results || categoriesData)
      setPriorities(prioritiesData.results || prioritiesData)
    } catch (error) {
      console.error("Failed to load data:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const ticketData = {
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        priority: formData.priority
      }
      
      await api.createTicket(ticketData)
      router.push("/tickets")
    } catch (error) {
      console.error("Failed to create ticket:", error)
      // TODO: Show error message to user
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
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
        
        <div className="container mx-auto py-8 max-w-2xl relative z-10">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4 text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-white">Create New Ticket</h1>
        <p className="text-white/90">
          Fill out the form below to submit your support request.
        </p>
      </div>

      <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Ticket Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Subject *</label>
              <Input
                placeholder="Brief description of your issue"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Category *</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData({...formData, category: category.id})}
                    className={`p-3 text-sm border rounded-lg text-left transition-colors ${
                      formData.category === category.id
                        ? "border-[#f9d423] bg-[#f9d423]/20 text-white"
                        : "border-white/20 text-white hover:bg-white/10"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Priority *</label>
              <div className="flex space-x-2 flex-wrap">
                {priorities.map((priority) => (
                  <button
                    key={priority.id}
                    type="button"
                    onClick={() => setFormData({...formData, priority: priority.id})}
                    className={`flex items-center space-x-2 p-2 border rounded-lg transition-colors ${
                      formData.priority === priority.id
                        ? "border-[#f9d423] bg-[#f9d423]/20"
                        : "border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <Badge variant="outline" className="text-white border-white/40">
                      {priority.name}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Description *</label>
              <Textarea
                placeholder="Please provide detailed information about your issue..."
                className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-white/60"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Attachments (optional)</label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center bg-white/5">
                <Upload className="h-8 w-8 mx-auto text-[#f9d423] mb-2" />
                <p className="text-sm text-white/70">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-white/60 mt-1">
                  Supported formats: PDF, DOC, JPG, PNG (Max 10MB)
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex space-x-3">
              <Button 
                type="submit" 
                className="flex-1 bg-white text-[#ff4e50] hover:bg-white/90 font-semibold"
                disabled={loading || !formData.subject || !formData.description || !formData.category || !formData.priority}
              >
                {loading ? "Creating Ticket..." : "Submit Ticket"}
              </Button>
              <Button type="button" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
