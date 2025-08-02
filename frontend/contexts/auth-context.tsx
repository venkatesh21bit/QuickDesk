"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { api } from "@/lib/api"

interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  role: "customer" | "agent" | "admin"
  phone?: string
  department?: string
  profile?: {
    avatar?: string
    bio?: string
    location?: string
    timezone?: string
  }
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (userData: any) => Promise<boolean>
  updateProfile: (profileData: any) => Promise<boolean>
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    setIsLoading(true)
    try {
      const userData = await api.getProfile()
      setUser(userData)
    } catch (error) {
      console.log("Not authenticated")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.login(username, password)
      if (response.user) {
        setUser(response.user)
        return true
      }
      return false
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Login failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await api.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      setIsLoading(false)
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await api.register(userData)
      return true
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(error.message || "Registration failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (profileData: any): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedUser = await api.updateProfile(profileData)
      setUser(updatedUser)
      return true
    } catch (error: any) {
      console.error("Profile update error:", error)
      setError(error.message || "Profile update failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      updateProfile, 
      isLoading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
