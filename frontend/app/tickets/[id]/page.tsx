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
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading ticket...</span>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Ticket not found</h1>
          <p className="text-muted-foreground">The ticket you're looking for doesn't exist or you don't have access to it.</p>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tickets
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
          {(user?.role === "agent" || user?.role === "admin") && (
            <Button variant="outline" size="sm">
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Ticket Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3 flex-wrap">
                <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
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
              <div className="flex items-center space-x-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {ticket.created_by_username}
                </span>
                {ticket.assigned_to_username && (
                  <span className="flex items-center">
                    Assigned to {ticket.assigned_to_username}
                  </span>
                )}
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
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
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {ticket.upvotes}
              </Button>
              <Button 
                variant={ticket.user_vote === 'down' ? "default" : "outline"}
                size="sm"
                onClick={() => handleVote('down')}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                {ticket.downvotes}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-base leading-7 whitespace-pre-line">{ticket.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Thread */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Conversation ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  comment.is_agent ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                }`}>
                  {comment.created_by_username.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium">{comment.created_by_username}</span>
                    {comment.is_agent && (
                      <Badge variant="secondary" className="text-xs">Agent</Badge>
                    )}
                    {comment.is_internal && (
                      <Badge variant="outline" className="text-xs">Internal</Badge>
                    )}
                    <span className="text-muted-foreground">
                      {formatDateTime(comment.created_at)}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to reply!</p>
          )}
        </CardContent>
      </Card>

      {/* Reply Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Reply</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReplySubmit} className="space-y-4">
            <Textarea
              placeholder="Type your reply here..."
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              className="min-h-[100px]"
              required
              disabled={submittingReply}
            />
            <div className="flex justify-end space-x-2">
              <Button 
                type="submit" 
                disabled={submittingReply || !newReply.trim()}
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
  )
}
