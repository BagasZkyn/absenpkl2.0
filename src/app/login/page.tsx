"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, EyeOff, School, Mail, Lock, Loader2, User, Send, X, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { motion, AnimatePresence } from "framer-motion"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [contactAdminOpen, setContactAdminOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)
  const router = useRouter()
  const { login, loading, error, isAuthenticated } = useAuth()

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      return
    }

    const result = await login(email, password)
    
    if (result.success) {
      router.push("/")
    }
  }

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactLoading(true)
    
    // Simulate API call to send request to admin
    setTimeout(() => {
      setContactLoading(false)
      setContactSubmitted(true)
      
      // Reset form after success
      setTimeout(() => {
        setContactForm({ name: "", email: "", message: "" })
        setContactSubmitted(false)
        setContactAdminOpen(false)
      }, 2000)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo dan Brand dengan Animasi */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto h-20 w-20 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center mb-4 shadow-lg"
          >
            <School className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Absen PKL
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sistem Absensi Prakerin Modern
          </p>
        </motion.div>

        {/* Login Form dengan Animasi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-2xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                Masuk ke Akun
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Masukkan email dan password untuk melanjutkan
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pb-4">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@sekolah.sch.id"
                      className="pl-10 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      className="pl-10 pr-10 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer transition-colors">
                    Lupa password?
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pt-0">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  disabled={loading || !email || !password}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Masuk...</span>
                    </div>
                  ) : (
                    "Masuk"
                  )}
                </Button>
                
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Belum punya akun?{" "}
                  <Dialog open={contactAdminOpen} onOpenChange={setContactAdminOpen}>
                    <DialogTrigger asChild>
                      <span className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium cursor-pointer transition-colors">
                        Hubungi Admin
                      </span>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white">
                          {contactSubmitted ? "Permintaan Terkirim!" : "Permintaan Akun Baru"}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                          {contactSubmitted 
                            ? "Permintaan Anda telah berhasil dikirim. Admin akan menghubungi Anda melalui email." 
                            : "Isi form berikut untuk meminta pembuatan akun baru. Admin akan menghubungi Anda melalui email."}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <AnimatePresence mode="wait">
                        {contactSubmitted ? (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center py-8"
                          >
                            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                            <p className="text-center text-gray-600 dark:text-gray-400">
                              Permintaan Anda telah berhasil dikirim. Admin akan menghubungi Anda melalui email.
                            </p>
                          </motion.div>
                        ) : (
                          <motion.form
                            key="form"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onSubmit={handleContactSubmit}
                            className="space-y-4 py-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nama Lengkap</Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                  id="name"
                                  type="text"
                                  placeholder="Nama lengkap Anda"
                                  className="pl-10 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                                  value={contactForm.name}
                                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="contact-email" className="text-gray-700 dark:text-gray-300">Email</Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                  id="contact-email"
                                  type="email"
                                  placeholder="email@contoh.com"
                                  className="pl-10 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                                  value={contactForm.email}
                                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">Pesan</Label>
                              <Textarea
                                id="message"
                                placeholder="Jelaskan mengapa Anda membutuhkan akses ke sistem ini"
                                className="rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-h-[100px]"
                                value={contactForm.message}
                                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                                required
                              />
                            </div>
                            
                            <div className="flex justify-end space-x-2 pt-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setContactAdminOpen(false)}
                                disabled={contactLoading}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Batal
                              </Button>
                              <Button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                                disabled={contactLoading}
                              >
                                {contactLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <Send className="h-4 w-4 mr-2" />
                                )}
                                Kirim Permintaan
                              </Button>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>

        {/* Quick Access dengan Animasi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Akses cepat untuk demo:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs rounded-lg border-gray-300 dark:border-gray-600"
              onClick={() => fillDemoCredentials("admin@sekolah.sch.id", "admin123")}
              disabled={loading}
            >
              Demo Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs rounded-lg border-gray-300 dark:border-gray-600"
              onClick={() => fillDemoCredentials("siswa@sekolah.sch.id", "siswa123")}
              disabled={loading}
            >
              Demo Siswa
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}