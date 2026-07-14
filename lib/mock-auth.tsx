"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface MockUser {
  id: string
  name: string
  email: string
  image?: string | null
}

interface MockAuthContextType {
  user: MockUser | null
  status: "loading" | "authenticated" | "unauthenticated"
  signIn: (email: string) => void
  signOut: () => void
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined)

const STORAGE_KEY = "ai-engineering-demo-user"

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  useEffect(() => {
    // Check localStorage for existing session
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedUser = JSON.parse(stored)
        setUser(parsedUser)
        setStatus("authenticated")
      } else {
        setStatus("unauthenticated")
      }
    } catch {
      setStatus("unauthenticated")
    }
  }, [])

  const signIn = (email: string) => {
    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      name: email.split("@")[0],
      email,
      image: null,
    }
    setUser(newUser)
    setStatus("authenticated")
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
  }

  const signOut = () => {
    setUser(null)
    setStatus("unauthenticated")
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <MockAuthContext.Provider value={{ user, status, signIn, signOut }}>
      {children}
    </MockAuthContext.Provider>
  )
}

export function useMockAuth() {
  const context = useContext(MockAuthContext)
  if (context === undefined) {
    throw new Error("useMockAuth must be used within a MockAuthProvider")
  }
  return context
}
