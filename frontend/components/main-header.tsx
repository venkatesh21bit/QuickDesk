"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, HelpCircle, LogOut, Settings, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

export function MainHeader() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Role-based navigation
  const getNavigationForRole = () => {
    if (!user) {
      return [
        { name: "Dashboard", href: "/dashboard" },
        { name: "My Tickets", href: "/tickets" },
        { name: "Create Ticket", href: "/tickets/new" },
      ]
    }

    switch (user.role) {
      case "customer":
        return [
          { name: "Dashboard", href: "/customer" },
          { name: "My Tickets", href: "/tickets" },
          { name: "Create Ticket", href: "/tickets/new" },
        ]
      case "agent":
        return [
          { name: "Agent Dashboard", href: "/agent" },
          { name: "Ticket Queue", href: "/tickets" },
          { name: "My Assignments", href: "/tickets?filter=assigned" },
        ]
      case "admin":
        return [
          { name: "Admin Panel", href: "/admin" },
          { name: "User Management", href: "/admin?tab=users" },
          { name: "Analytics", href: "/admin?tab=analytics" },
          { name: "All Tickets", href: "/tickets" },
        ]
      default:
        return [
          { name: "Dashboard", href: "/dashboard" },
          { name: "My Tickets", href: "/tickets" },
          { name: "Create Ticket", href: "/tickets/new" },
        ]
    }
  }

  const navigation = getNavigationForRole()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <HelpCircle className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">QuickDesk</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tickets..."
              className="w-64 pl-8"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <div className="text-sm text-muted-foreground">
                  {user.first_name || user.username} ({user.role})
                </div>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="default">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
