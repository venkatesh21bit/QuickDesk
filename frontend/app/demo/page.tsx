"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Shield, UserCheck, HelpCircle } from "lucide-react"

export default function DemoPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <HelpCircle className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold">QuickDesk</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive help desk solution with role-based dashboards for customers, support agents, and administrators.
        </p>
      </div>

      {/* Role Dashboards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Users className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <CardTitle>Customer Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Create tickets, track progress, and access self-service resources.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>• Create support tickets</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Track ticket status</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Search & filter tickets</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Knowledge base access</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Vote on tickets</span>
              </div>
            </div>
            <div className="pt-4 space-y-2">
              <Link href="/customer">
                <Button className="w-full">View Customer Dashboard</Button>
              </Link>
              <p className="text-xs text-muted-foreground text-center">
                Login: customer@quickdesk.com
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <UserCheck className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <CardTitle>Agent Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Manage ticket queues, respond to customers, and track performance.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>• Ticket queue management</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Assign & respond to tickets</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Performance metrics</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Customer satisfaction</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Knowledge base tools</span>
              </div>
            </div>
            <div className="pt-4 space-y-2">
              <Link href="/agent">
                <Button className="w-full">View Agent Dashboard</Button>
              </Link>
              <p className="text-xs text-muted-foreground text-center">
                Login: agent@quickdesk.com
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-purple-500 mx-auto mb-2" />
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Manage users, categories, and monitor system-wide analytics.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>• User management</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Category management</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• System analytics</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Performance reports</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• System configuration</span>
              </div>
            </div>
            <div className="pt-4 space-y-2">
              <Link href="/admin">
                <Button className="w-full">View Admin Dashboard</Button>
              </Link>
              <p className="text-xs text-muted-foreground text-center">
                Login: admin@quickdesk.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold">Key Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Role-Based Access</h3>
            <p className="text-sm text-muted-foreground">
              Different interfaces for customers, agents, and administrators
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Ticket Management</h3>
            <p className="text-sm text-muted-foreground">
              Complete lifecycle from creation to resolution
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Search & Filter</h3>
            <p className="text-sm text-muted-foreground">
              Advanced filtering and search capabilities
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Performance metrics and reporting
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold">Quick Access</h2>
        <div className="flex justify-center space-x-4">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/tickets/new">
            <Button variant="outline">Create Ticket</Button>
          </Link>
          <Link href="/tickets">
            <Button variant="outline">View All Tickets</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
