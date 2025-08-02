"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HelpCircle, LogOut, Settings, User, Search } from "lucide-react"
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
        ]
      case "admin":
        return [
          { name: "Admin Panel", href: "/admin" },
          { name: "User Management", href: "/admin/users" },
          { name: "Analytics", href: "/admin/analytics" },
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
    <header className="sticky top-0 z-50 w-full navbar-3d backdrop-blur-md bg-[#0f2027]/95 border-b border-white/20">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <HelpCircle className="h-8 w-8 text-[#f9d423] transition-transform group-hover:scale-110 group-hover:rotate-12" />
            <span className="text-xl font-bold text-white drop-shadow-lg">QuickDesk</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navigation.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-all duration-300 hover:text-[#f9d423] relative px-3 py-2 rounded-md",
                "hover:shadow-lg hover:transform hover:scale-105",
                pathname === item.href
                  ? "text-[#f9d423] bg-white/10 shadow-lg button-3d"
                  : "text-white/80 hover:bg-white/10"
              )}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60 z-10" />
            <Input
              type="search"
              placeholder="Search tickets..."
              className="w-64 pl-8 input-3d bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#f9d423] focus:shadow-lg"
            />
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <div className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-lg badge-3d">
                  {user.first_name || user.username} ({user.role})
                </div>
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-[#f9d423] button-3d">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-[#f9d423] button-3d">
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-[#f9d423] button-3d" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-white text-[#ff4e50] hover:bg-white/90 font-semibold button-3d bounce-3d">
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
