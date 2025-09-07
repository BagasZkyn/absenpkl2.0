"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AuthProvider } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  User,
  Bell,
  CalendarDays,
  BarChart3,
  Download,
  ChevronRight,
  Loader2,
  Sunrise,
  Sun,
  Moon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Simulate loading
    const loadTimer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => {
      clearInterval(timer)
      clearTimeout(loadTimer)
    }
  }, [])

  const attendanceStats = {
    totalDays: 120,
    presentDays: 115,
    absentDays: 3,
    lateDays: 2,
    percentage: 95.8,
    monthlyData: [
      { month: "Jan", present: 22, absent: 0, late: 0 },
      { month: "Feb", present: 20, absent: 0, late: 2 },
      { month: "Mar", present: 23, absent: 0, late: 0 },
      { month: "Apr", present: 21, absent: 1, late: 0 },
      { month: "Mei", present: 22, absent: 0, late: 0 },
      { month: "Jun", present: 19, absent: 2, late: 0 },
    ]
  }

  const pklProgress = {
    completed: 87,
    daysRemaining: 18,
    tasks: [
      { name: "Laporan Mingguan", completed: 5, total: 8 },
      { name: "Proyek Utama", completed: 1, total: 1 },
      { name: "Presentasi", completed: 0, total: 1 },
    ]
  }

  const recentActivities = [
    { id: 1, date: "2024-01-15", time: "08:00", status: "Hadir", description: "Absen masuk tepat waktu", location: "Kantor Pusat" },
    { id: 2, date: "2024-01-14", time: "08:15", status: "Terlambat", description: "Absen masuk terlambat 15 menit", location: "Kantor Pusat" },
    { id: 3, date: "2024-01-13", time: "08:00", status: "Hadir", description: "Absen masuk tepat waktu", location: "Kantor Cabang" },
    { id: 4, date: "2024-01-12", time: "07:55", status: "Hadir", description: "Absen masuk lebih awal", location: "Kantor Pusat" },
  ]

  const announcements = [
    { id: 1, title: "Libur Nasional", date: "2024-01-25", content: "Hari ini merupakan libur nasional, tidak ada kegiatan PKL." },
    { id: 2, title: "Pelatihan Keterampilan", date: "2024-01-28", content: "Akan diadakan pelatihan keterampilan soft skills untuk semua peserta PKL." },
    { id: 3, title: "Pengumpulan Laporan", date: "2024-02-01", content: "Jangan lupa untuk mengumpulkan laporan mingguan paling lambat hari Jumat." },
  ]

  const formatGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 11) return "Selamat Pagi"
    if (hour < 15) return "Selamat Siang"
    if (hour < 19) return "Selamat Sore"
    return "Selamat Malam"
  }

  const getGreetingIcon = () => {
    const hour = currentTime.getHours()
    if (hour < 11) return <Sunrise className="h-6 w-6" />
    if (hour < 15) return <Sun className="h-6 w-6" />
    if (hour < 19) return <Sun className="h-6 w-6" />
    return <Moon className="h-6 w-6" />
  }

  const formatDate = () => {
    return currentTime.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = () => {
    return currentTime.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const userData = user ? {
    name: user.name,
    class: user.class,
    internshipCompany: user.internship_company,
    internshipPosition: user.internship_position,
    email: user.email,
    photo_url: user.photo_url
  } : {
    name: "User",
    class: "Unknown",
    internshipCompany: "Unknown",
    internshipPosition: "Unknown",
    email: "user@example.com",
    photo_url: ""
  }

  const handleCheckIn = () => {
    // In a real app, this would trigger the check-in process
    console.log("Check-in triggered");
  }

  const handleCheckOut = () => {
    // In a real app, this would trigger the check-out process
    console.log("Check-out triggered");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <Loader2 className="h-12 w-12 text-blue-600" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        
        <main className="container mx-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getGreetingIcon()}
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {formatGreeting()}, {userData.name.split(' ')[0]}!
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {formatDate()}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-2xl md:text-3xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  {formatTime()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Waktu saat ini
                </div>
              </div>
            </motion.div>

            {/* Tabs Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl max-w-md">
                  <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 transition-all duration-300">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="attendance" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 transition-all duration-300">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Kehadiran
                  </TabsTrigger>
                  <TabsTrigger value="progress" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 transition-all duration-300">
                    <Target className="h-4 w-4 mr-2" />
                    Progress
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-8">
                  {/* User Summary Card */}
                  <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        {/* Square Avatar */}
                        <div className="flex-shrink-0">
                          <Avatar className="h-20 w-20 rounded-xl ring-4 ring-blue-500/20 shadow-lg">
                            <AvatarImage src={userData.photo_url || "/avatars/student.png"} alt={userData.name} />
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
                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            {userData.internshipPosition} • {userData.internshipCompany}
                          </p>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                              {userData.class}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Mail className="h-3 w-3 mr-1" />
                              {userData.email}
                            </Badge>
                          </div>
                        </div>

                        {/* View Profile Button */}
                        <Button 
                          className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300"
                          onClick={() => window.location.href = '/profil'}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Lihat Profil
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-xl transform hover:scale-105 transition-transform duration-300">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <Zap className="h-5 w-5" />
                          <span>Absen Masuk</span>
                        </CardTitle>
                        <CardDescription className="text-blue-100">
                          Lakukan absensi harian Anda
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-gray-100" onClick={handleCheckIn}>
                          <ClockIcon className="mr-2 h-4 w-4" />
                          Absen Sekarang
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0 shadow-xl transform hover:scale-105 transition-transform duration-300">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5" />
                          <span>Absen Pulang</span>
                        </CardTitle>
                        <CardDescription className="text-green-100">
                          Tandai selesai bekerja
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="secondary" className="w-full bg-white text-green-600 hover:bg-gray-100" onClick={handleCheckOut}>
                          <ClockIcon className="mr-2 h-4 w-4" />
                          Absen Pulang
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl transform hover:scale-105 transition-transform duration-300">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <span className="text-gray-900 dark:text-white">Statistik</span>
                        </CardTitle>
                        <CardDescription>
                          Ringkasan kehadiran
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

                    <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl transform hover:scale-105 transition-transform duration-300">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <Target className="h-5 w-5 text-green-600" />
                          <span className="text-gray-900 dark:text-white">Target PKL</span>
                        </CardTitle>
                        <CardDescription>
                          Progress pencapaian
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-1">{pklProgress.completed}%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Selesai</div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${pklProgress.completed}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Stats and Activities Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Stats Overview */}
                    <div className="lg:col-span-1">
                      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl h-full">
                        <CardHeader>
                          <CardTitle className="flex items-center text-gray-900 dark:text-white">
                            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                            Statistik Kehadiran
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg text-center py-4">
                              <div className="text-2xl font-bold">{attendanceStats.totalDays}</div>
                              <div className="text-sm opacity-90">Total Hari</div>
                            </Card>
                            
                            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg text-center py-4">
                              <div className="text-2xl font-bold">{attendanceStats.presentDays}</div>
                              <div className="text-sm opacity-90">Hadir</div>
                            </Card>
                            
                            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg text-center py-4">
                              <div className="text-2xl font-bold">{attendanceStats.absentDays}</div>
                              <div className="text-sm opacity-90">Tidak Hadir</div>
                            </Card>
                            
                            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-lg text-center py-4">
                              <div className="text-2xl font-bold">{attendanceStats.lateDays}</div>
                              <div className="text-sm opacity-90">Terlambat</div>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Activities */}
                    <div className="lg:col-span-2">
                      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl h-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center text-gray-900 dark:text-white">
                              <Clock className="h-5 w-5 mr-2 text-blue-600" />
                              Aktivitas Terkini
                            </CardTitle>
                            <CardDescription>
                              Riwayat absensi Anda
                            </CardDescription>
                          </div>
                          <Button variant="outline" size="sm">
                            Lihat Semua
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {recentActivities.map((activity) => (
                              <motion.div 
                                key={activity.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                              >
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
                                    <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center mt-1">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {activity.location}
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
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Announcements */}
                  <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center text-gray-900 dark:text-white">
                          <Bell className="h-5 w-5 mr-2 text-blue-600" />
                          Pengumuman
                        </CardTitle>
                        <CardDescription>
                          Informasi terbaru untuk peserta PKL
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        Lihat Semua
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {announcements.map((announcement) => (
                          <motion.div 
                            key={announcement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-blue-700 dark:text-blue-300">{announcement.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                <CalendarDays className="h-3 w-3 mr-1" />
                                {announcement.date}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{announcement.content}</p>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Attendance Tab */}
                <TabsContent value="attendance">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
                        <CardHeader>
                          <CardTitle className="text-gray-900 dark:text-white">
                            Riwayat Kehadiran
                          </CardTitle>
                          <CardDescription>
                            Data kehadiran bulan ini
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {attendanceStats.monthlyData.map((monthData, index) => (
                              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {monthData.month}
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-green-600">{monthData.present}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Hadir</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-red-600">{monthData.absent}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Absen</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-yellow-600">{monthData.late}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Terlambat</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="lg:col-span-1">
                      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl h-full">
                        <CardHeader>
                          <CardTitle className="text-gray-900 dark:text-white">
                            Ringkasan Kehadiran
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Kehadiran</span>
                              <span className="font-semibold">{attendanceStats.percentage}%</span>
                            </div>
                            <Progress value={attendanceStats.percentage} className="h-2" />
                            
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Hadir</span>
                              <span className="font-semibold">{attendanceStats.presentDays} hari</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Tidak Hadir</span>
                              <span className="font-semibold text-red-600">{attendanceStats.absentDays} hari</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Terlambat</span>
                              <span className="font-semibold text-yellow-600">{attendanceStats.lateDays} hari</span>
                            </div>
                            
                            <Button className="w-full mt-4">
                              <Download className="h-4 w-4 mr-2" />
                              Unduh Laporan
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Progress Tab */}
                <TabsContent value="progress">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
                        <CardHeader>
                          <CardTitle className="text-gray-900 dark:text-white">
                            Progress PKL
                          </CardTitle>
                          <CardDescription>
                            Status penyelesaian tugas dan proyek
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600 dark:text-gray-400">Progress Keseluruhan</span>
                                <span className="font-semibold">{pklProgress.completed}%</span>
                              </div>
                              <Progress value={pklProgress.completed} className="h-3" />
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                {pklProgress.daysRemaining} hari tersisa
                              </div>
                            </div>
                            
                            {pklProgress.tasks.map((task, index) => (
                              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium text-gray-900 dark:text-white">{task.name}</span>
                                  <span className="text-sm font-semibold">{task.completed}/{task.total}</span>
                                </div>
                                <Progress value={(task.completed / task.total) * 100} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="lg:col-span-1">
                      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl h-full">
                        <CardHeader>
                          <CardTitle className="text-gray-900 dark:text-white">
                            Pencapaian
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200 dark:border-blue-700">
                              <div className="text-2xl font-bold text-blue-600">15</div>
                              <div className="text-sm text-blue-800 dark:text-blue-200">Hari beruntun hadir tepat waktu</div>
                            </div>
                            
                            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl border border-green-200 dark:border-green-700">
                              <div className="text-2xl font-bold text-green-600">8</div>
                              <div className="text-sm text-green-800 dark:text-green-200">Tugas diselesaikan lebih awal</div>
                            </div>
                            
                            <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl border border-yellow-200 dark:border-yellow-700">
                              <div className="text-2xl font-bold text-yellow-600">5</div>
                              <div className="text-sm text-yellow-800 dark:text-yellow-200">Penghargaan dari mentor</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </main>
        
        <BottomNavigation />
      </div>
    </AuthProvider>
  )
}