"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AuthProvider } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { authService } from "@/lib/auth"
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  BookOpen, 
  Building,
  User,
  Edit,
  Save,
  X,
  Camera,
  Award,
  Globe,
  Briefcase,
  GraduationCap,
  MapPin as MapPinIcon,
  Clock,
  Star,
  Loader2,
  ChevronRight,
  Linkedin,
  Instagram,
  Github,
  Download,
  Eye,
  EyeOff
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [photoPreview, setPhotoPreview] = useState<string>("")
  const [activeTab, setActiveTab] = useState("personal")
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const { user, isAuthenticated, loading, refreshUser } = useAuth()
  
  // Sync userData with user from Supabase
  const [userData, setUserData] = useState({
    name: "",
    nis: "",
    class: "",
    email: "",
    phone: "",
    school: "",
    major: "",
    internshipCompany: "",
    internshipPosition: "",
    internshipDuration: "",
    address: "",
    birthDate: "",
    gender: "",
    religion: "",
    skills: "",
    achievements: "",
    description: "",
    photo_url: "",
    social_instagram: "",
    social_linkedin: "",
    social_github: ""
  })

  // Ref to store last user data for cancel
  const lastUserRef = useRef(user)

  useEffect(() => {
    if (user) {
      const updatedUserData = {
        name: user.name || "",
        nis: user.nis || "",
        class: user.class || "",
        email: user.email || "",
        phone: user.phone || "",
        school: user.school || "",
        major: user.major || "",
        internshipCompany: user.internship_company || "",
        internshipPosition: user.internship_position || "",
        internshipDuration: user.internship_duration || "",
        address: user.address || "",
        birthDate: user.birth_date || "",
        gender: user.gender || "",
        religion: user.religion || "",
        skills: user.skills || "",
        achievements: user.achievements || "",
        description: user.description || "",
        photo_url: user.photo_url || "",
        social_instagram: user.social_instagram || "",
        social_linkedin: user.social_linkedin || "",
        social_github: user.social_github || ""
      }
      setUserData(updatedUserData)
      lastUserRef.current = updatedUserData
      calculateProfileCompletion(updatedUserData)
    }
  }, [user])

  const calculateProfileCompletion = (data: any) => {
    let completedFields = 0
    const totalFields = 15 // Total fields we care about for completion
    
    if (data.name) completedFields++
    if (data.nis) completedFields++
    if (data.class) completedFields++
    if (data.email) completedFields++
    if (data.phone) completedFields++
    if (data.school) completedFields++
    if (data.major) completedFields++
    if (data.internshipCompany) completedFields++
    if (data.internshipPosition) completedFields++
    if (data.address) completedFields++
    if (data.birthDate) completedFields++
    if (data.gender) completedFields++
    if (data.skills) completedFields++
    if (data.achievements) completedFields++
    if (data.photo_url) completedFields++
    
    setProfileCompletion(Math.round((completedFields / totalFields) * 100))
  }

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }))
  }

  // Upload photo to Supabase Storage
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setErrorMsg("File harus berupa gambar")
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrorMsg("Ukuran file tidak boleh lebih dari 5MB")
      return
    }
    
    setPhotoPreview(URL.createObjectURL(file))
    setSaving(true)
    setErrorMsg("")
    
    try {
      const result = await authService.uploadProfilePhoto(file)
      
      if (result.success && result.photoUrl) {
        setUserData(prev => ({ ...prev, photo_url: result.photoUrl }))
        setPhotoPreview("")
        setSuccessMsg("Foto profil berhasil diupload")
        
        // Refresh user data to get the updated photo
        if (refreshUser) {
          await refreshUser()
        }
      } else {
        setErrorMsg(result.error || "Gagal upload foto.")
      }
    } catch (error) {
      setErrorMsg("Terjadi kesalahan saat upload foto")
      console.error("Upload error:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setErrorMsg("")
    setSuccessMsg("")
    
    try {
      const updateResult = await authService.updateProfile({
        name: userData.name,
        nis: userData.nis,
        class: userData.class,
        email: userData.email,
        phone: userData.phone,
        school: userData.school,
        major: userData.major,
        internship_company: userData.internshipCompany,
        internship_position: userData.internshipPosition,
        internship_duration: userData.internshipDuration,
        address: userData.address,
        birth_date: userData.birthDate,
        gender: userData.gender,
        religion: userData.religion,
        skills: userData.skills,
        achievements: userData.achievements,
        description: userData.description,
        photo_url: userData.photo_url,
        social_instagram: userData.social_instagram,
        social_linkedin: userData.social_linkedin,
        social_github: userData.social_github
      })
      
      if (updateResult.success) {
        setSuccessMsg("Profil berhasil diperbarui")
        setIsEditing(false)
        
        // Refresh user data
        if (refreshUser) {
          await refreshUser()
        }
      } else {
        setErrorMsg(updateResult.error || "Gagal update data.")
      }
    } catch (error) {
      setErrorMsg("Terjadi kesalahan saat menyimpan data")
      console.error("Save error:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setErrorMsg("")
    setSuccessMsg("")
    setPhotoPreview("")
    
    if (lastUserRef.current) {
      setUserData(lastUserRef.current)
    }
  }

  const downloadProfilePDF = () => {
    // In a real app, this would generate and download a PDF
    setSuccessMsg("Fitur download PDF akan segera hadir!")
  }

  if (loading) {
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
          <p className="text-gray-600 dark:text-gray-400">Memuat profil...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Akan di-redirect oleh AuthProvider
  }

  return (
    <AuthProvider requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        
        <main className="container mx-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Profil Siswa
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Kelola informasi profil dan data PKL Anda
              </p>
            </motion.div>

            {/* Success/Error Messages */}
            <AnimatePresence>
              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4 flex items-center"
                >
                  <span>{successMsg}</span>
                  <button onClick={() => setSuccessMsg("")} className="ml-auto">
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 flex items-center"
                >
                  <span>{errorMsg}</span>
                  <button onClick={() => setErrorMsg("")} className="ml-auto">
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Completion */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kelengkapan Profil</span>
                <span className="text-sm font-bold text-blue-600">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Lengkapi profil Anda untuk meningkatkan peluang diterima PKL
              </p>
            </motion.div>

            {/* Profile Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="mb-8 bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                    {/* Profile Photo Section */}
                    <div className="flex-shrink-0 text-center">
                      <div className="relative">
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="relative inline-block"
                        >
                          <Avatar className="h-32 w-32 rounded-2xl ring-4 ring-white dark:ring-gray-800 shadow-xl mx-auto">
                            <AvatarImage src={photoPreview || userData.photo_url || "/avatars/student.png"} alt={userData.name} />
                            <AvatarFallback className="text-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl">
                              {userData.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {isEditing && (
                            <label className="absolute -bottom-2 -right-2 rounded-full h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 flex items-center justify-center cursor-pointer shadow-lg border-2 border-white dark:border-gray-800 transition-all duration-300">
                              <Camera className="h-5 w-5 text-white" />
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handlePhotoUpload} 
                                disabled={saving}
                              />
                            </label>
                          )}
                          {saving && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/60 rounded-2xl">
                              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            </div>
                          )}
                        </motion.div>
                      </div>
                      <div className="mt-4">
                        <Badge variant="secondary" className="text-sm mb-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                          {userData.class}
                        </Badge>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          NIS: {userData.nis}
                        </div>
                      </div>

                      {/* Social Links */}
                      {!isEditing && (
                        <div className="flex justify-center space-x-3 mt-4">
                          {userData.social_linkedin && (
                            <a href={userData.social_linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 transition-colors">
                              <Linkedin className="h-5 w-5" />
                            </a>
                          )}
                          {userData.social_instagram && (
                            <a href={userData.social_instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 transition-colors">
                              <Instagram className="h-5 w-5" />
                            </a>
                          )}
                          {userData.social_github && (
                            <a href={userData.social_github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors">
                              <Github className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Basic Info Section */}
                    <div className="flex-1 min-w-0 text-center lg:text-left">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-sm font-medium">Nama Lengkap</Label>
                              <div className="relative">
                                <Input
                                  id="name"
                                  value={userData.name}
                                  onChange={(e) => handleInputChange('name', e.target.value)}
                                  className="pl-10"
                                  disabled={saving}
                                  placeholder="Nama lengkap siswa"
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                              <div className="relative">
                                <Input
                                  id="email"
                                  type="email"
                                  value={userData.email}
                                  onChange={(e) => handleInputChange('email', e.target.value)}
                                  className="pl-10"
                                  disabled={saving}
                                  placeholder="email@contoh.com"
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="text-sm font-medium">No. HP</Label>
                              <div className="relative">
                                <Input
                                  id="phone"
                                  value={userData.phone}
                                  onChange={(e) => handleInputChange('phone', e.target.value)}
                                  className="pl-10"
                                  disabled={saving}
                                  placeholder="081234567890"
                                />
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="nis" className="text-sm font-medium">NIS</Label>
                              <div className="relative">
                                <Input
                                  id="nis"
                                  value={userData.nis}
                                  onChange={(e) => handleInputChange('nis', e.target.value)}
                                  className="pl-10"
                                  disabled={saving}
                                  placeholder="Nomor Induk Siswa"
                                />
                                <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="class" className="text-sm font-medium">Kelas</Label>
                              <div className="relative">
                                <Input
                                  id="class"
                                  value={userData.class}
                                  onChange={(e) => handleInputChange('class', e.target.value)}
                                  className="pl-10"
                                  disabled={saving}
                                  placeholder="XII RPL 1"
                                />
                                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="school" className="text-sm font-medium">Sekolah</Label>
                              <div className="relative">
                                <Input
                                  id="school"
                                  value={userData.school}
                                  onChange={(e) => handleInputChange('school', e.target.value)}
                                  className="pl-10"
                                  disabled={saving}
                                  placeholder="Nama sekolah"
                                />
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {userData.name}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">{userData.description || "Siswa aktif yang sedang menjalani PKL"}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{userData.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{userData.phone || "-"}</span>
                            </div>
                          </div>
                          
                          {/* Social Links Input in Edit Mode */}
                          {isEditing && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              <div className="space-y-2">
                                <Label htmlFor="linkedin" className="text-sm font-medium">LinkedIn</Label>
                                <div className="relative">
                                  <Input
                                    id="linkedin"
                                    value={userData.social_linkedin}
                                    onChange={(e) => handleInputChange('social_linkedin', e.target.value)}
                                    className="pl-10"
                                    disabled={saving}
                                    placeholder="https://linkedin.com/in/username"
                                  />
                                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="instagram" className="text-sm font-medium">Instagram</Label>
                                <div className="relative">
                                  <Input
                                    id="instagram"
                                    value={userData.social_instagram}
                                    onChange={(e) => handleInputChange('social_instagram', e.target.value)}
                                    className="pl-10"
                                    disabled={saving}
                                    placeholder="https://instagram.com/username"
                                  />
                                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="github" className="text-sm font-medium">GitHub</Label>
                                <div className="relative">
                                  <Input
                                    id="github"
                                    value={userData.social_github}
                                    onChange={(e) => handleInputChange('social_github', e.target.value)}
                                    className="pl-10"
                                    disabled={saving}
                                    placeholder="https://github.com/username"
                                  />
                                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                        {isEditing ? (
                          <>
                            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 min-w-[120px] transition-all duration-300" disabled={saving}>
                              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                              Simpan
                            </Button>
                            <Button onClick={handleCancel} variant="outline" className="min-w-[120px] transition-all duration-300" disabled={saving}>
                              <X className="mr-2 h-4 w-4" />
                              Batal
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 min-w-[120px] transition-all duration-300">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Profil
                            </Button>
                            <Button onClick={downloadProfilePDF} variant="outline" className="min-w-[120px] transition-all duration-300">
                              <Download className="mr-2 h-4 w-4" />
                              Export PDF
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Information Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                  <TabsTrigger value="personal" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 transition-all duration-300">
                    <User className="h-4 w-4 mr-2" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="education" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 transition-all duration-300">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Pendidikan
                  </TabsTrigger>
                  <TabsTrigger value="internship" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 transition-all duration-300">
                    <Briefcase className="h-4 w-4 mr-2" />
                    PKL
                  </TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6">
                  <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
                      <CardTitle className="flex items-center text-gray-900 dark:text-white">
                        <User className="h-5 w-5 mr-2 text-blue-600" />
                        Data Pribadi
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="birthDate">Tanggal Lahir</Label>
                            <Input
                              id="birthDate"
                              type="date"
                              value={userData.birthDate}
                              onChange={(e) => handleInputChange('birthDate', e.target.value)}
                              disabled={saving}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gender">Jenis Kelamin</Label>
                            <Select 
                              value={userData.gender} 
                              onValueChange={(value) => handleInputChange('gender', value)}
                              disabled={saving}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis kelamin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                <SelectItem value="Perempuan">Perempuan</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="religion">Agama</Label>
                            <Select 
                              value={userData.religion} 
                              onValueChange={(value) => handleInputChange('religion', value)}
                              disabled={saving}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih agama" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Islam">Islam</SelectItem>
                                <SelectItem value="Kristen">Kristen</SelectItem>
                                <SelectItem value="Katolik">Katolik</SelectItem>
                                <SelectItem value="Hindu">Hindu</SelectItem>
                                <SelectItem value="Buddha">Buddha</SelectItem>
                                <SelectItem value="Konghucu">Konghucu</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Alamat</Label>
                            <Textarea
                              id="address"
                              value={userData.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              rows={3}
                              disabled={saving}
                              placeholder="Alamat lengkap"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Deskripsi Diri</Label>
                            <Textarea
                              id="description"
                              value={userData.description}
                              onChange={(e) => handleInputChange('description', e.target.value)}
                              rows={3}
                              disabled={saving}
                              placeholder="Ceritakan sedikit tentang diri Anda"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Lahir</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{userData.birthDate || "-"}</div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <User className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Kelamin</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{userData.gender || "-"}</div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Star className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Agama</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{userData.religion || "-"}</div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg md:col-span-2">
                            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Alamat</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{userData.address || "-"}</div>
                            </div>
                          </div>
                          {userData.description && (
                            <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg md:col-span-2">
                              <User className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Tentang Saya</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{userData.description}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Skills and Achievements */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Skills */}
                    <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
                        <CardTitle className="flex items-center text-gray-900 dark:text-white">
                          <Globe className="h-5 w-5 mr-2 text-blue-600" />
                          Keahlian
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        {isEditing ? (
                          <div>
                            <Label htmlFor="skills">Keahlian (pisahkan dengan koma)</Label>
                            <Textarea
                              id="skills"
                              value={userData.skills}
                              onChange={(e) => handleInputChange('skills', e.target.value)}
                              rows={4}
                              placeholder="Contoh: JavaScript, React, Node.js, Python, MySQL"
                              disabled={saving}
                            />
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {userData.skills ? userData.skills.split(',').map((skill, index) => (
                              <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 px-3 py-1 rounded-full">
                                {skill.trim()}
                              </Badge>
                            )) : (
                              <p className="text-gray-500 dark:text-gray-400 text-sm">Belum ada data keahlian</p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Achievements */}
                    <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
                        <CardTitle className="flex items-center text-gray-900 dark:text-white">
                          <Award className="h-5 w-5 mr-2 text-blue-600" />
                          Prestasi
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        {isEditing ? (
                          <div>
                            <Label htmlFor="achievements">Prestasi (pisahkan dengan koma)</Label>
                            <Textarea
                              id="achievements"
                              value={userData.achievements}
                              onChange={(e) => handleInputChange('achievements', e.target.value)}
                              rows={4}
                              placeholder="Contoh: Juara 1 LKS Web Development 2023, Sertifikat BNSP"
                              disabled={saving}
                            />
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {userData.achievements ? userData.achievements.split(',').map((achievement, index) => (
                              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <Award className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{achievement.trim()}</span>
                              </div>
                            )) : (
                              <p className="text-gray-500 dark:text-gray-400 text-sm">Belum ada data prestasi</p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Education Information Tab */}
                <TabsContent value="education">
                  <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
                      <CardTitle className="flex items-center text-gray-900 dark:text-white">
                        <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                        Data Pendidikan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="school">Nama Sekolah</Label>
                            <Input
                              id="school"
                              value={userData.school}
                              onChange={(e) => handleInputChange('school', e.target.value)}
                              disabled={saving}
                              placeholder="Nama sekolah"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="major">Jurusan</Label>
                            <Input
                              id="major"
                              value={userData.major}
                              onChange={(e) => handleInputChange('major', e.target.value)}
                              disabled={saving}
                              placeholder="Jurusan"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="class">Kelas</Label>
                            <Input
                              id="class"
                              value={userData.class}
                              onChange={(e) => handleInputChange('class', e.target.value)}
                              disabled={saving}
                              placeholder="Kelas"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nis">NIS</Label>
                            <Input
                              id="nis"
                              value={userData.nis}
                              onChange={(e) => handleInputChange('nis', e.target.value)}
                              disabled={saving}
                              placeholder="Nomor Induk Siswa"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Building className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Sekolah</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{userData.school || "-"}</div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Jurusan</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{userData.major || "-"}</div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Kelas</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{userData.class || "-"}</div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">NIS</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{userData.nis || "-"}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Internship Information Tab */}
                <TabsContent value="internship">
                  <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
                      <CardTitle className="flex items-center text-gray-900 dark:text-white">
                        <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                        Informasi PKL
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="internshipCompany">Nama Perusahaan</Label>
                            <Input
                              id="internshipCompany"
                              value={userData.internshipCompany}
                              onChange={(e) => handleInputChange('internshipCompany', e.target.value)}
                              disabled={saving}
                              placeholder="Nama perusahaan tempat PKL"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="internshipPosition">Posisi</Label>
                            <Input
                              id="internshipPosition"
                              value={userData.internshipPosition}
                              onChange={(e) => handleInputChange('internshipPosition', e.target.value)}
                              disabled={saving}
                              placeholder="Posisi/jabatan selama PKL"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="internshipDuration">Durasi</Label>
                            <Input
                              id="internshipDuration"
                              value={userData.internshipDuration}
                              onChange={(e) => handleInputChange('internshipDuration', e.target.value)}
                              disabled={saving}
                              placeholder="Contoh: 3 Bulan"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Building className="h-8 w-8 text-indigo-600 mb-3" />
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Perusahaan</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{userData.internshipCompany || "-"}</div>
                          </div>
                          <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <MapPinIcon className="h-8 w-8 text-indigo-600 mb-3" />
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Posisi</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{userData.internshipPosition || "-"}</div>
                          </div>
                          <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Clock className="h-8 w-8 text-indigo-600 mb-3" />
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Durasi</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{userData.internshipDuration || "-"}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
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