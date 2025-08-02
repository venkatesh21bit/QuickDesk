"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload } from "lucide-react"

const categories = [
  "Technical Support",
  "Account Issues", 
  "Software Request",
  "Hardware Issues",
  "Access Problems",
  "General Inquiry"
]

const priorities = [
  { value: "low", label: "Low", color: "secondary" },
  { value: "medium", label: "Medium", color: "warning" },
  { value: "high", label: "High", color: "destructive" }
]

export default function CreateTicketPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "medium"
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Ticket submitted:", formData)
    router.push("/tickets")
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create New Ticket</h1>
        <p className="text-muted-foreground">
          Fill out the form below to submit your support request.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject *</label>
              <Input
                placeholder="Brief description of your issue"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setFormData({...formData, category})}
                    className={`p-3 text-sm border rounded-lg text-left transition-colors ${
                      formData.category === category
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority *</label>
              <div className="flex space-x-2">
                {priorities.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => setFormData({...formData, priority: priority.value})}
                    className={`flex items-center space-x-2 p-2 border rounded-lg transition-colors ${
                      formData.priority === priority.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <Badge variant={priority.color as any}>{priority.label}</Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                placeholder="Please provide detailed information about your issue..."
                className="min-h-[120px]"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Attachments (optional)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported formats: PDF, DOC, JPG, PNG (Max 10MB)
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">
                Submit Ticket
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
