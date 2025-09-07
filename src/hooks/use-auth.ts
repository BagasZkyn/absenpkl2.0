"use client"

import { useEffect, useState } from 'react'
import { authService, AuthState, UserProfile } from '@/lib/auth'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authService.getCurrentState())

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState)
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    return await authService.login(email, password)
  }

  const logout = async () => {
    return await authService.logout()
  }

  // Fungsi untuk fetch ulang user dari Supabase
  const refreshUser = async () => {
    if (authState.user?.id) {
      await authService["fetchUserProfile"](authState.user.id)
    }
  }

  const isAuthenticated = authState.user !== null
  const user = authState.user
  const loading = authState.loading
  const error = authState.error

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    refreshUser
  }
}

export type { UserProfile }