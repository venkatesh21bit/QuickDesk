"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { Search, ThumbsUp, ThumbsDown, MessageCircle, HelpCircle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { MainHeader } from "@/components/main-header"

const mockQuestions = [
  {
    id: 1,
    question: "How do I reset my password?",
    answer: "To reset your password:\n1. Go to the login page\n2. Click on 'Forgot Password?'\n3. Enter your email address\n4. Check your email for reset instructions\n5. Follow the link and create a new password\n\nIf you don't receive the email within 10 minutes, check your spam folder or contact support.",
    category: "Account Issues",
    votes: 145,
    views: 2834,
    helpful: true,
    lastUpdated: "2024-01-15"
  },
  {
    id: 2,
    question: "How do I install new software on my work computer?",
    answer: "Software installation process:\n1. Submit a software request ticket through the portal\n2. Specify the software name and business justification\n3. Wait for IT approval (usually 2-3 business days)\n4. Once approved, download from the company software center\n5. If you need installation help, contact IT support\n\nNote: Unauthorized software installation may violate company policy.",
    category: "Software Request",
    votes: 98,
    views: 1567,
    helpful: true,
    lastUpdated: "2024-01-12"
  },
  {
    id: 3,
    question: "Why can't I access my company email?",
    answer: "Common email access issues and solutions:\n1. Check your internet connection\n2. Verify your username and password\n3. Try clearing browser cache and cookies\n4. Disable browser extensions temporarily\n5. Try accessing email from a different browser\n6. Check if your account is locked (contact IT if needed)\n\nIf none of these work, submit a support ticket with error messages.",
    category: "Technical Support",
    votes: 87,
    views: 1234,
    helpful: true,
    lastUpdated: "2024-01-10"
  },
  {
    id: 4,
    question: "How do I connect to the company VPN?",
    answer: "VPN connection steps:\n1. Download the company VPN client from the software center\n2. Install the application with admin privileges\n3. Use your AD credentials to log in\n4. Select the appropriate server location\n5. Click connect and wait for confirmation\n\nTroubleshooting:\n- Ensure you're using the latest VPN client version\n- Check if your firewall is blocking the connection\n- Try different server locations if connection fails",
    category: "Network",
    votes: 76,
    views: 945,
    helpful: true,
    lastUpdated: "2024-01-08"
  },
  {
    id: 5,
    question: "My printer is not working, what should I do?",
    answer: "Printer troubleshooting steps:\n1. Check if the printer is powered on and connected\n2. Verify paper and ink/toner levels\n3. Clear any paper jams\n4. Restart both printer and computer\n5. Check printer queue for stuck jobs\n6. Update or reinstall printer drivers\n7. Try printing a test page\n\nIf problems persist, submit a hardware support ticket with printer model and error details.",
    category: "Hardware Issues",
    votes: 65,
    views: 823,
    helpful: true,
    lastUpdated: "2024-01-05"
  },
  {
    id: 6,
    question: "How do I request access to a specific system or application?",
    answer: "Access request process:\n1. Submit an access request ticket\n2. Specify the system/application name\n3. Provide business justification\n4. Include your manager's approval if required\n5. Wait for security review (2-5 business days)\n6. Complete any required training before access is granted\n\nEmergency access requests are processed within 4 hours during business hours.",
    category: "Access Problems",
    votes: 54,
    views: 657,
    helpful: true,
    lastUpdated: "2024-01-03"
  },
  {
    id: 7,
    question: "What are the company's IT support hours?",
    answer: "IT Support Hours:\n- Standard Support: Monday-Friday, 8:00 AM - 6:00 PM\n- Emergency Support: 24/7 for critical issues\n- Weekend Support: Saturday 9:00 AM - 1:00 PM (limited)\n\nResponse Times:\n- High Priority: 1 hour\n- Medium Priority: 4 hours\n- Low Priority: 24 hours\n\nFor after-hours emergencies, call the emergency hotline: (555) 123-4567",
    category: "General Inquiry",
    votes: 43,
    views: 578,
    helpful: true,
    lastUpdated: "2024-01-01"
  },
  {
    id: 8,
    question: "How do I backup my important files?",
    answer: "File backup options:\n1. Company Cloud Storage (recommended):\n   - Automatic sync for Documents folder\n   - 100GB storage limit per user\n   - Access via web portal or desktop app\n\n2. Manual Backup:\n   - Copy files to network drive (H: drive)\n   - Use external drives for large files\n   - Create regular backup schedules\n\n3. Automated Solutions:\n   - Enable Windows File History\n   - Configure cloud backup software\n   - Set up regular backup reminders\n\nCritical files should always have multiple backup copies.",
    category: "Technical Support",
    votes: 39,
    views: 467,
    helpful: true,
    lastUpdated: "2023-12-28"
  }
]

const categories = [
  "All Categories",
  "Account Issues",
  "Technical Support", 
  "Software Request",
  "Hardware Issues",
  "Network",
  "Access Problems",
  "General Inquiry"
]

export default function PopularQuestionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)

  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || question.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleVote = (questionId: number, isUpvote: boolean) => {
    // Handle voting logic here
    console.log(`Vote ${isUpvote ? 'up' : 'down'} for question ${questionId}`)
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
        <div className="container mx-auto py-8 space-y-6 relative z-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <HelpCircle className="h-8 w-8 text-[#f9d423]" />
              <h1 className="text-4xl font-bold text-white">Popular Questions</h1>
            </div>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Find quick answers to the most frequently asked questions. Can't find what you're looking for? 
              <Link href="/tickets/new" className="text-[#f9d423] hover:underline ml-1">Create a new ticket</Link>
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Search Knowledge Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  placeholder="Search questions and answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-[#f9d423] text-[#0f2027] hover:bg-[#f9d423]/90"
                        : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
                <CardContent className="p-8 text-center">
                  <HelpCircle className="h-12 w-12 text-[#f9d423] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No questions found</h3>
                  <p className="text-white/70">
                    Try adjusting your search terms or browse different categories
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredQuestions.map((question) => (
                <Card key={question.id} className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Question Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <button
                            onClick={() => setExpandedQuestion(
                              expandedQuestion === question.id ? null : question.id
                            )}
                            className="text-left w-full group"
                          >
                            <h3 className="text-lg font-semibold text-white group-hover:text-[#f9d423] transition-colors">
                              {question.question}
                            </h3>
                          </button>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-white/60">
                            <Badge variant="secondary" className="bg-white/10 text-white">
                              {question.category}
                            </Badge>
                            <span>{question.views} views</span>
                            <span>Updated {question.lastUpdated}</span>
                          </div>
                        </div>
                        <ArrowRight 
                          className={`h-5 w-5 text-white/60 transition-transform ${
                            expandedQuestion === question.id ? "rotate-90" : ""
                          }`} 
                        />
                      </div>

                      {/* Expanded Answer */}
                      {expandedQuestion === question.id && (
                        <div className="space-y-4 pt-4 border-t border-white/20">
                          <div className="prose prose-invert max-w-none">
                            <div className="text-white/90 whitespace-pre-wrap leading-relaxed">
                              {question.answer}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-white/60">Was this helpful?</span>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVote(question.id, true)}
                                  className="text-white hover:bg-white/10"
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1 text-[#f9d423]" />
                                  {question.votes}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVote(question.id, false)}
                                  className="text-white hover:bg-white/10"
                                >
                                  <ThumbsDown className="h-4 w-4 text-white/60" />
                                </Button>
                              </div>
                            </div>
                            <Link href="/tickets/new">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                              >
                                Still need help?
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Additional Help */}
          <Card className="backdrop-blur-md bg-[#0f2027]/80 border-white/20 shadow-xl">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Can't find what you're looking for?</h3>
              <p className="text-white/70 mb-4">
                Our support team is here to help! Create a ticket and we'll get back to you as soon as possible.
              </p>
              <div className="flex justify-center space-x-3">
                <Link href="/tickets/new">
                  <Button className="bg-white text-[#ff4e50] hover:bg-white/90 font-semibold">
                    Create New Ticket
                  </Button>
                </Link>
                <Link href="/tickets">
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    View My Tickets
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
