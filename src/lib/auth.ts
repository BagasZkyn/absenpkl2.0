import { supabase } from './supabase'

export interface UserProfile {
  id: string
  email: string
  name: string
  nis: string
  class: string
  phone: string
  school: string
  major: string
  internship_company: string
  internship_position: string
  internship_duration: string
  address?: string
  birth_date?: string
  gender?: string
  religion?: string
  skills?: string
  achievements?: string
  description?: string
  photo_url?: string
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: UserProfile | null
  loading: boolean
  error: string | null
}

class AuthService {
  private static instance: AuthService
  private authState: AuthState = {
    user: null,
    loading: true,
    error: null
  }
  private listeners: Array<(state: AuthState) => void> = []

  private constructor() {
    this.initializeAuth()
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  private async initializeAuth() {
    try {
      // Check for existing session
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        throw error
      }

      if (session) {
        await this.fetchUserProfile(session.user.id)
      } else {
        this.authState.loading = false
        this.notifyListeners()
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await this.fetchUserProfile(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          this.authState.user = null
          this.authState.loading = false
          this.notifyListeners()
        }
      })
    } catch (error) {
      this.authState.error = error instanceof Error ? error.message : 'Authentication error'
      this.authState.loading = false
      this.notifyListeners()
    }
  }

  private async fetchUserProfile(userId: string) {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data: newProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert([{
                id: user.id,
                email: user.email!,
                name: user.user_metadata?.name || user.email!.split('@')[0],
                nis: '',
                class: '',
                phone: '',
                school: '',
                major: '',
                internship_company: '',
                internship_position: '',
                internship_duration: '',
                address: '',
                birth_date: '',
                gender: '',
                religion: '',
                skills: '',
                achievements: '',
                description: '',
                photo_url: ''
              }])
              .select()
              .single()

            if (createError) {
              throw createError
            }

            this.authState.user = newProfile
          }
        } else {
          throw error
        }
      } else {
        this.authState.user = profile
      }
    } catch (error) {
      this.authState.error = error instanceof Error ? error.message : 'Failed to fetch user profile'
    } finally {
      this.authState.loading = false
      this.notifyListeners()
    }
  }

  async login(email: string, password: string) {
    try {
      this.authState.loading = true
      this.authState.error = null
      this.notifyListeners()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      this.authState.error = errorMessage
      this.authState.loading = false
      this.notifyListeners()
      return { success: false, error: errorMessage }
    }
  }

  async logout() {
    try {
      await supabase.auth.signOut()
      this.authState.user = null
      this.authState.error = null
      this.notifyListeners()
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed'
      this.authState.error = errorMessage
      this.notifyListeners()
      return { success: false, error: errorMessage }
    }
  }

  async updateProfile(profileData: Partial<UserProfile>) {
    try {
      if (!this.authState.user) {
        throw new Error('No user logged in')
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.authState.user.id)

      if (error) {
        throw error
      }

      // Fetch ulang data user dari Supabase agar state frontend langsung ter-refresh
      await this.fetchUserProfile(this.authState.user.id)

      return { success: true, data: this.authState.user }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      this.authState.error = errorMessage
      this.notifyListeners()
      return { success: false, error: errorMessage }
    }
  }

  async uploadProfilePhoto(file: File): Promise<{ success: boolean; photoUrl?: string; error?: string }> {
      try {
        if (!this.authState.user) {
          throw new Error("No user logged in")
        }
    
        const fileExt = file.name.split(".").pop()
        const fileName = `${this.authState.user.id}-${Date.now()}.${fileExt}`
        const filePath = `avatars/${fileName}` // ⬅ ganti folder storage
    
        // Upload ke bucket "avatars"
        const { error: uploadError } = await supabase.storage
          .from("avatars") // ⬅ ganti dari profile-photos
          .upload(filePath, file, { upsert: true })
    
        if (uploadError) throw uploadError
    
        // Ambil public URL
        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)
    
        // Update kolom photo_url
        const updateResult = await this.updateProfile({ photo_url: data.publicUrl })
        if (!updateResult.success) throw new Error(updateResult.error)
    
        return { success: true, photoUrl: data.publicUrl }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to upload photo"
        return { success: false, error: errorMessage }
      }
    }
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    // Immediately call with current state
    listener(this.authState)
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.authState }))
  }

  getCurrentState(): AuthState {
    return { ...this.authState }
  }

  isAuthenticated(): boolean {
    return !!this.authState.user
  }

  getUser(): UserProfile | null {
    return this.authState.user
  }
}

export const authService = AuthService.getInstance()