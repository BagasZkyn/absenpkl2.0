"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch" // Import the Switch component
import {
  Clock,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Settings,
  Zap,
  HandPlatter,
  Bell,
  RotateCcw,
  Download,
  Shield,
  CalendarDays,
  Timer
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { motion, AnimatePresence } from "framer-motion"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function AbsenPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [autoInTime, setAutoInTime] = useState("08:00")
  const [autoOutTime, setAutoOutTime] = useState("16:00")
  const [isAutoAttendanceEnabled, setIsAutoAttendanceEnabled] = useState(true) // State for the toggle
  const [attendanceStatus, setAttendanceStatus] = useState({
    today: [],
    checkedIn: false,
    checkedOut: false,
    lastAction: null,
    location: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Simulate getting user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAttendanceStatus(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }))
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    }

    // Simulate loading attendance data
    const loadData = setTimeout(() => {
      setIsLoading(false)
      setAttendanceStatus({
        today: [
          { type: "in", time: "08:00:15", status: "success", mode: "manual" },
          { type: "out", time: "12:00:30", status: "success", mode: "manual" },
          { type: "in", time: "13:00:45", status: "success", mode: "manual" }
        ],
        checkedIn: true,
        checkedOut: false,
        lastAction: { type: "in", time: "13:00:45" },
        location: { lat: -6.2088, lng: 106.8456 }
      })
    }, 1500)

    return () => {
      clearInterval(timer)
      clearTimeout(loadData)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleCheckIn = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setAttendanceStatus(prev => ({
        ...prev,
        today: [...prev.today, { type: "in", time: currentTime.toLocaleTimeString(), status: "success", mode: "manual" }],
        checkedIn: true,
        lastAction: { type: "in", time: currentTime.toLocaleTimeString() }
      }))
      showNotification("Absen masuk berhasil dicatat", "success")
    }, 1000)
  }

  const handleCheckOut = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setAttendanceStatus(prev => ({
        ...prev,
        today: [...prev.today, { type: "out", time: currentTime.toLocaleTimeString(), status: "success", mode: "manual" }],
        checkedOut: true,
        lastAction: { type: "out", time: currentTime.toLocaleTimeString() }
      }))
      showNotification("Absen pulang berhasil dicatat", "success")
    }, 1000)
  }

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
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

  const calculateWorkingHours = () => {
    if (!attendanceStatus.checkedIn) return 0
    const firstCheckIn = attendanceStatus.today.find(a => a.type === "in")?.time
    if (!firstCheckIn) return 0

    const [hours, minutes, seconds] = firstCheckIn.split(':').map(Number)
    const checkInTime = new Date()
    checkInTime.setHours(hours, minutes, seconds)

    const diffMs = currentTime - checkInTime
    const diffHrs = diffMs / (1000 * 60 * 60)

    return Math.max(0, Math.min(diffHrs, 9)) // Max 9 hours for display
  }

  const workingHours = calculateWorkingHours()
  const progressValue = (workingHours / 9) * 100

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Sistem Absensi PKL
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {formatDate()}
            </p>
            <div className="text-2xl md:text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 mt-2">
              {formatTime()}
            </div>
          </motion.div>

          {/* Notification */}
          <AnimatePresence>
            {notification.show && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-lg mb-6 flex items-center ${
                  notification.type === "success"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:red-green-900/30 dark:text-red-300"
                }`}
              >
                {notification.type === "success" ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 mr-2" />
                )}
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Manual Attendance Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
                      <HandPlatter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900 dark:text-white">
                        Absen Manual
                      </CardTitle>
                      <CardDescription>
                        Lakukan absensi secara manual dengan menekan tombol
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Check In Button */}
                    <div className={`p-6 rounded-xl border-2 ${attendanceStatus.checkedIn ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'}`}>
                      <div className="text-center">
                        <div className={`mx-auto h-14 w-14 rounded-full flex items-center justify-center ${attendanceStatus.checkedIn ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300' : 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300'}`}>
                          <CheckCircle className="h-7 w-7" />
                        </div>
                        <h3 className="font-semibold text-lg mt-4 text-gray-900 dark:text-white">
                          Absen Masuk
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {attendanceStatus.checkedIn ?
                            `Tercatat: ${attendanceStatus.today.find(a => a.type === "in")?.time}` :
                            "Belum melakukan absen masuk"}
                        </p>
                        <Button
                          className={`mt-4 w-full ${attendanceStatus.checkedIn ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                          onClick={handleCheckIn}
                          disabled={attendanceStatus.checkedIn || isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center">
                              <RotateCcw className="h-4 w-4 animate-spin mr-2" />
                              Memproses...
                            </div>
                          ) : attendanceStatus.checkedIn ? (
                            "Sudah Absen"
                          ) : (
                            "Absen Masuk"
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Check Out Button */}
                    <div className={`p-6 rounded-xl border-2 ${attendanceStatus.checkedOut ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'}`}>
                      <div className="text-center">
                        <div className={`mx-auto h-14 w-14 rounded-full flex items-center justify-center ${attendanceStatus.checkedOut ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300' : 'bg-amber-100 text-amber-600 dark:bg-amber-800 dark:text-amber-300'}`}>
                          <XCircle className="h-7 w-7" />
                        </div>
                        <h3 className="font-semibold text-lg mt-4 text-gray-900 dark:text-white">
                          Absen Pulang
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {attendanceStatus.checkedOut ?
                            `Tercatat: ${attendanceStatus.today.find(a => a.type === "out")?.time}` :
                            "Belum melakukan absen pulang"}
                        </p>
                        <Button
                          className={`mt-4 w-full ${attendanceStatus.checkedOut ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'}`}
                          onClick={handleCheckOut}
                          disabled={attendanceStatus.checkedOut || isLoading || !attendanceStatus.checkedIn}
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center">
                              <RotateCcw className="h-4 w-4 animate-spin mr-2" />
                              Memproses...
                            </div>
                          ) : attendanceStatus.checkedOut ? (
                            "Sudah Pulang"
                          ) : (
                            "Absen Pulang"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Working Hours Progress */}
                  <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Jam Kerja Hari Ini</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{workingHours.toFixed(1)} jam</span>
                    </div>
                    <Progress value={progressValue} className="h-2" />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">0 jam</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">9 jam</span>
                    </div>
                  </div>

                  {/* Location Info */}
                  {attendanceStatus.location && (
                    <div className="mt-4 flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Lokasi: {attendanceStatus.location.lat.toFixed(4)}, {attendanceStatus.location.lng.toFixed(4)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Auto Attendance Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-3">
                      <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900 dark:text-white">
                        Absen Otomatis
                      </CardTitle>
                      <CardDescription>
                        Atur jadwal absensi otomatis untuk masuk dan pulang
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="in-time" className="text-gray-700 dark:text-gray-300 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Waktu Masuk Otomatis
                        </Label>
                        <Input
                          id="in-time"
                          type="time"
                          value={autoInTime}
                          onChange={(e) => setAutoInTime(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="out-time" className="text-gray-700 dark:text-gray-300 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Waktu Pulang Otomatis
                        </Label>
                        <Input
                          id="out-time"
                          type="time"
                          value={autoOutTime}
                          onChange={(e) => setAutoOutTime(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* === NEW: Toggle Switch === */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <Label htmlFor="auto-attendance-toggle" className="flex flex-col space-y-1 cursor-pointer">
                        <span className="font-medium text-gray-900 dark:text-white">Aktifkan Fitur Otomatis</span>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          Nyalakan untuk absen masuk & pulang otomatis.
                        </span>
                      </Label>
                      <Switch
                        id="auto-attendance-toggle"
                        checked={isAutoAttendanceEnabled}
                        onCheckedChange={setIsAutoAttendanceEnabled}
                      />
                    </div>
                    {/* === END NEW === */}

                    {/* === UPDATED: Status Display === */}
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-start">
                        <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div className="w-full">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-purple-700 dark:text-purple-300">Status Absen Otomatis</h4>
                            <Badge className={`${isAutoAttendanceEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                              {isAutoAttendanceEnabled ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </div>
                          <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                            {isAutoAttendanceEnabled ? 'Sistem akan mencatat absensi pada waktu yang ditentukan.' : 'Fitur absen otomatis saat ini dimatikan.'}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* === END UPDATED === */}


                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center">
                        <Timer className="h-4 w-4 mr-1" />
                        Jadwal Absen Otomatis
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Masuk:</span>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            {autoInTime}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Pulang:</span>
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                            {autoOutTime}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Simpan Pengaturan Otomatis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Attendance History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">
                      Riwayat Absensi Hari Ini
                    </CardTitle>
                    <CardDescription>
                      Catatan absensi masuk dan pulang Anda hari ini
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Ekspor
                </Button>
              </CardHeader>
              <CardContent>
                {attendanceStatus.today.length > 0 ? (
                  <div className="space-y-3">
                    {attendanceStatus.today.map((attendance, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${attendance.type === "in" ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                            {attendance.type === "in" ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {attendance.type === "in" ? "Masuk" : "Pulang"}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {attendance.time}
                            </div>
                          </div>
                        </div>
                        <Badge variant={attendance.mode === "auto" ? "default" : "secondary"}>
                          {attendance.mode === "auto" ? "Otomatis" : "Manual"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Belum ada catatan absensi hari ini</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}