"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageCircle, Clock, User, FileText, Send, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { AuthGuard } from "@/components/auth-guard"
import { MainHeader } from "@/components/main-header"

interface Ticket {
  id: string
  ticket_number: string
  subject: string
  description: string
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

interface Comment {
  id: string
  content: string
  created_by_username: string
  is_agent: boolean
  is_internal: boolean
  created_at: string
  updated_at: string
}

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newReply, setNewReply] = useState("")
  const [submittingReply, setSubmittingReply] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user && params.id) {
      loadTicketData()
    }
  }, [user, authLoading, router, params.id])

  const loadTicketData = async () => {
    setLoading(true)
    try {
      const [ticketData, commentsData] = await Promise.all([
        api.getTicket(params.id),
        api.getTicketComments(params.id)
      ])
      
      setTicket(ticketData)
      setComments(commentsData.results || commentsData)
    } catch (error) {
      console.error("Failed to load ticket data:", error)
      // TODO: Show error message to user
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (type: 'up' | 'down') => {
    if (!ticket) return
    
    try {
      await api.voteTicket(ticket.id, type)
      // Reload ticket to get updated vote counts
      const updatedTicket = await api.getTicket(params.id)
      setTicket(updatedTicket)
    } catch (error) {
      console.error("Failed to vote:", error)
      // TODO: Show error message to user
    }
  }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReply.trim() || !ticket) return

    setSubmittingReply(true)
    try {
      await api.createComment(ticket.id, {
        content: newReply,
        is_internal: false
      })
      
      setNewReply("")
      // Reload comments to show the new reply
      const commentsData = await api.getTicketComments(params.id)
      setComments(commentsData.results || commentsData)
    } catch (error) {
      console.error("Failed to submit reply:", error)
      // TODO: Show error message to user
    } finally {
      setSubmittingReply(false)
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (authLoading || loading) {
    return (
      <AuthGuard>
        <MainHeader />
        <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
          <div className="container mx-auto py-8">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-[#f9d423]" />
              <span className="ml-2 text-white">Loading ticket...</span>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!ticket) {
    return (
      <AuthGuard>
        <MainHeader />
        <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
          <div className="container mx-auto py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Ticket not found</h1>
              <p className="text-white/70">The ticket you're looking for doesn't exist or you don't have access to it.</p>
              <Button className="mt-4 bg-gradient-to-r from-[#ff4e50] to-[#f9d423] hover:from-[#f9d423] hover:to-[#ff4e50] text-white" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
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
        
        <div className="container mx-auto py-8 max-w-4xl space-y-6 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tickets
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
          {(user?.role === "agent" || user?.role === "admin") && (
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Ticket Header */}
      <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3 flex-wrap">
                <CardTitle className="text-2xl text-white">{ticket.subject}</CardTitle>
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
              <div className="flex items-center space-x-4 text-sm text-white/60 flex-wrap">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-[#f9d423]" />
                  {ticket.created_by_username}
                </span>
                {ticket.assigned_to_username && (
                  <span className="flex items-center">
                    Assigned to {ticket.assigned_to_username}
                  </span>
                )}
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-[#f9d423]" />
                  Created {formatDateTime(ticket.created_at)}
                </span>
                <span>#{ticket.ticket_number}</span>
              </div>
            </div>
            
            {/* Voting */}
            <div className="flex items-center space-x-2">
              <Button 
                variant={ticket.user_vote === 'up' ? "default" : "outline"}
                size="sm"
                onClick={() => handleVote('up')}
                className={ticket.user_vote === 'up' ? "bg-[#f9d423] text-[#0f2027] hover:bg-[#f9d423]/90" : "bg-white/10 border-white/20 text-white hover:bg-white/20"}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {ticket.upvotes}
              </Button>
              <Button 
                variant={ticket.user_vote === 'down' ? "default" : "outline"}
                size="sm"
                onClick={() => handleVote('down')}
                className={ticket.user_vote === 'down' ? "bg-red-500 text-white hover:bg-red-600" : "bg-white/10 border-white/20 text-white hover:bg-white/20"}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                {ticket.downvotes}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-base leading-7 whitespace-pre-line text-white/90">{ticket.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Thread */}
      <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <MessageCircle className="h-5 w-5 mr-2 text-[#f9d423]" />
            Conversation ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  comment.is_agent ? 'bg-[#f9d423] text-[#0f2027]' : 'bg-white/20 text-white'
                }`}>
                  {comment.created_by_username.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium text-white">{comment.created_by_username}</span>
                    {comment.is_agent && (
                      <Badge variant="secondary" className="text-xs bg-[#f9d423]/20 text-[#f9d423] border-[#f9d423]/30">Agent</Badge>
                    )}
                    {comment.is_internal && (
                      <Badge variant="outline" className="text-xs border-white/30 text-white/70">Internal</Badge>
                    )}
                    <span className="text-white/60">
                      {formatDateTime(comment.created_at)}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line text-white/90">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/60 text-center py-4">No comments yet. Be the first to reply!</p>
          )}
        </CardContent>
      </Card>

      {/* Reply Form */}
      <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Add Reply</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReplySubmit} className="space-y-4">
            <Textarea
              placeholder="Type your reply here..."
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#f9d423] focus:ring-[#f9d423]"
              required
              disabled={submittingReply}
            />
            <div className="flex justify-end space-x-2">
              <Button 
                type="submit" 
                disabled={submittingReply || !newReply.trim()}
                className="bg-white text-[#ff4e50] hover:bg-white/90"
              >
                {submittingReply ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </>
                )}
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
