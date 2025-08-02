"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageCircle, Clock, User, FileText, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

// Mock ticket data
const mockTicket = {
  id: "TICK-001",
  subject: "Cannot access company email",
  description: "I'm unable to log into my company email account. Getting authentication errors when trying to access through Outlook and webmail. The error message says 'Authentication failed' but I'm sure my password is correct. This started happening yesterday after the system maintenance window.",
  status: "open",
  priority: "high",
  category: "Technical Support",
  created: "2024-01-15T10:30:00Z",
  updated: "2024-01-15T14:20:00Z",
  author: "John Doe",
  authorEmail: "john.doe@company.com",
  assignee: "Support Agent",
  votes: 5,
  replies: [
    {
      id: 1,
      author: "Support Agent",
      content: "Hi John, I see you're having trouble accessing your email. Let's troubleshoot this step by step. First, can you confirm if you've tried resetting your password recently?",
      timestamp: "2024-01-15T11:00:00Z",
      isAgent: true
    },
    {
      id: 2,
      author: "John Doe", 
      content: "Hi, thanks for the quick response. No, I haven't tried resetting my password yet. Should I do that? Also, I want to mention that I can access other company systems fine, just email is having issues.",
      timestamp: "2024-01-15T11:30:00Z",
      isAgent: false
    },
    {
      id: 3,
      author: "Support Agent",
      content: "Thanks for that information. Since other systems are working, it's likely an email-specific issue. Before resetting your password, let's try a few things:\n\n1. Clear your browser cache and cookies\n2. Try accessing email from an incognito/private browser window\n3. Check if you can access email from your mobile device\n\nTry these steps and let me know the results.",
      timestamp: "2024-01-15T12:00:00Z",
      isAgent: true
    }
  ]
}

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [newReply, setNewReply] = useState("")
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)

  const handleVote = (type: 'up' | 'down') => {
    setUserVote(userVote === type ? null : type)
  }

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newReply.trim()) {
      // Handle reply submission
      console.log("New reply:", newReply)
      setNewReply("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive"
      case "in-progress": return "warning" 
      case "resolved": return "success"
      case "closed": return "secondary"
      default: return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive"
      case "medium": return "warning"
      case "low": return "secondary"
      default: return "secondary"
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
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
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </div>
      </div>

      {/* Ticket Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-2xl">{mockTicket.subject}</CardTitle>
                <Badge variant={getStatusColor(mockTicket.status) as any}>
                  {mockTicket.status}
                </Badge>
                <Badge variant={getPriorityColor(mockTicket.priority) as any}>
                  {mockTicket.priority} priority
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {mockTicket.author}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Created {formatDateTime(mockTicket.created)}
                </span>
                <span>#{mockTicket.id}</span>
                <span>{mockTicket.category}</span>
              </div>
            </div>
            
            {/* Voting */}
            <div className="flex items-center space-x-2">
              <Button 
                variant={userVote === 'up' ? "default" : "outline"}
                size="sm"
                onClick={() => handleVote('up')}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {mockTicket.votes + (userVote === 'up' ? 1 : 0)}
              </Button>
              <Button 
                variant={userVote === 'down' ? "default" : "outline"}
                size="sm"
                onClick={() => handleVote('down')}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-base leading-7">{mockTicket.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Thread */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Conversation ({mockTicket.replies.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockTicket.replies.map((reply) => (
            <div key={reply.id} className="flex space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                reply.isAgent ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              }`}>
                {reply.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-medium">{reply.author}</span>
                  {reply.isAgent && (
                    <Badge variant="secondary" className="text-xs">Agent</Badge>
                  )}
                  <span className="text-muted-foreground">
                    {formatDateTime(reply.timestamp)}
                  </span>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-line">{reply.content}</p>
                </div>
              </div>
            </div>
          ))}
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
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline">
                Save Draft
              </Button>
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Send Reply
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
