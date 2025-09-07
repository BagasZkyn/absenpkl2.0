"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AuthProvider } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  BookOpen, 
  Building,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon,
  Zap,
  Shield,
  Target,
  User
} from "lucide-react"

export default function Dashboard() {
  const [currentTime] = useState(new Date())
  const { user, isAuthenticated, logout } = useAuth()

  const attendanceStats = {
    totalDays: 120,
    presentDays: 115,
    absentDays: 3,
    lateDays: 2,
    percentage: 95.8
  }

  const recentActivities = [
    { date: "2024-01-15", time: "08:00", status: "Hadir", description: "Absen masuk tepat waktu" },
    { date: "2024-01-14", time: "08:15", status: "Terlambat", description: "Absen masuk terlambat 15 menit" },
    { date: "2024-01-13", time: "08:00", status: "Hadir", description: "Absen masuk tepat waktu" },
    { date: "2024-01-12", time: "07:55", status: "Hadir", description: "Absen masuk lebih awal" },
  ]

  const formatGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Selamat Pagi"
    if (hour < 15) return "Selamat Siang"
    if (hour < 18) return "Selamat Sore"
    return "Selamat Malam"
  }

  const formatDate = () => {
    return currentTime.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const userData = user ? {
    name: user.name,
    class: user.class,
    internshipCompany: user.internship_company,
    email: user.email
  } : {
    name: "User",
    class: "Unknown",
    internshipCompany: "Unknown",
    email: "user@example.com"
  }

  return (
    <AuthProvider requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-black dark:via-gray-900 dark:to-black">
        <Navbar />
        
        <main className="container mx-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {formatGreeting()}, {userData.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {formatDate()} - Selamat datang di dashboard Absen PKL
              </p>
            </div>

            {/* User Summary Card */}
            <Card className="mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Square Avatar */}
                  <div className="flex-shrink-0">
                    <Avatar className="h-16 w-16 rounded-xl ring-4 ring-blue-500/20">
                      <AvatarImage src="/avatars/student.png" alt={userData.name} />
                      <AvatarFallback className="text-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl">
                        {userData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Basic User Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {userData.name}
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-4 space-y-1 sm:space-y-0">
                      <Badge variant="secondary" className="text-xs inline-flex justify-center sm:justify-start">
                        {userData.class}
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {userData.internshipCompany}
                      </span>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                    onClick={() => window.location.href = '/profil'}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Lihat Profil
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-xl transform hover:scale-105 transition-transform">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Absen Sekarang</span>
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Lakukan absensi harian Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-gray-100">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    Absen Masuk
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900 dark:text-white">Statistik Kehadiran</span>
                  </CardTitle>
                  <CardDescription>
                    Ringkasan kehadiran Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{attendanceStats.percentage}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tingkat Kehadiran</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {attendanceStats.presentDays}/{attendanceStats.totalDays} hari
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span className="text-gray-900 dark:text-white">Target PKL</span>
                  </CardTitle>
                  <CardDescription>
                    Progress pencapaian Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">87%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Selesai</div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{attendanceStats.totalDays}</div>
                  <div className="text-sm opacity-90">Total Hari</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{attendanceStats.presentDays}</div>
                  <div className="text-sm opacity-90">Hadir</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{attendanceStats.absentDays}</div>
                  <div className="text-sm opacity-90">Tidak Hadir</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{attendanceStats.lateDays}</div>
                  <div className="text-sm opacity-90">Terlambat</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-900 dark:text-white">Aktivitas Terkini</span>
                </CardTitle>
                <CardDescription>
                  Riwayat absensi Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          activity.status === 'Hadir' ? 'bg-green-500' : 
                          activity.status === 'Terlambat' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            {activity.date} - {activity.time}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {activity.description}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          activity.status === 'Hadir' ? 'default' : 
                          activity.status === 'Terlambat' ? 'secondary' : 'destructive'
                        }
                        className={
                          activity.status === 'Hadir' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                          activity.status === 'Terlambat' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                          'bg-red-100 text-red-800 hover:bg-red-200'
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <BottomNavigation />
      </div>
    </AuthProvider>
  )
}