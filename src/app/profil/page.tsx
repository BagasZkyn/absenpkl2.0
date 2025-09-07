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
  Loader2
} from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [photoPreview, setPhotoPreview] = useState<string>("")
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
    photo_url: ""
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
        photo_url: user.photo_url || ""
      }
      setUserData(updatedUserData)
      lastUserRef.current = updatedUserData
    }
  }, [user])

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
        photo_url: userData.photo_url
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-black dark:via-gray-900 dark:to-black">
        <Navbar />
        
        <main className="container mx-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Profil Siswa
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Informasi lengkap data diri dan PKL
              </p>
            </div>

            {/* Success/Error Messages */}
            {successMsg && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {errorMsg}
              </div>
            )}

            {/* Profile Header Card */}
            <Card className="mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                  {/* Profile Photo Section */}
                  <div className="flex-shrink-0 text-center">
                    <div className="relative">
                      <div className="relative">
                        <Avatar className="h-32 w-32 rounded-2xl ring-4 ring-blue-500/20 mx-auto shadow-lg">
                          <AvatarImage src={photoPreview || userData.photo_url || "/avatars/student.png"} alt={userData.name} />
                          <AvatarFallback className="text-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl">
                            {userData.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <label className="absolute -bottom-2 -right-2 rounded-full h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 flex items-center justify-center cursor-pointer shadow-lg border-2 border-white dark:border-gray-900">
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
                      </div>
                    </div>
                    <div className="mt-4">
                      <Badge variant="secondary" className="text-sm mb-2">
                        {userData.class}
                      </Badge>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        NIS: {userData.nis}
                      </div>
                    </div>
                  </div>

                  {/* Basic Info Section */}
                  <div className="flex-1 min-w-0 text-center lg:text-left">
                    {isEditing ? (
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <Label htmlFor="name" className="absolute left-3 -top-2 bg-white dark:bg-gray-900 px-1 text-xs text-blue-600 rounded shadow">Nama Lengkap</Label>
                            <Input
                              id="name"
                              value={userData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              className="mt-4 pl-10"
                              disabled={saving}
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                          </div>
                          <div className="relative">
                            <Label htmlFor="email" className="absolute left-3 -top-2 bg-white dark:bg-gray-900 px-1 text-xs text-blue-600 rounded shadow">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={userData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="mt-4 pl-10"
                              disabled={saving}
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <Label htmlFor="phone" className="absolute left-3 -top-2 bg-white dark:bg-gray-900 px-1 text-xs text-blue-600 rounded shadow">No. HP</Label>
                            <Input
                              id="phone"
                              value={userData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="mt-4 pl-10"
                              disabled={saving}
                            />
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                          </div>
                          <div className="relative">
                            <Label htmlFor="nis" className="absolute left-3 -top-2 bg-white dark:bg-gray-900 px-1 text-xs text-blue-600 rounded shadow">NIS</Label>
                            <Input
                              id="nis"
                              value={userData.nis}
                              onChange={(e) => handleInputChange('nis', e.target.value)}
                              className="mt-4 pl-10"
                              disabled={saving}
                            />
                            <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <Label htmlFor="class" className="absolute left-3 -top-2 bg-white dark:bg-gray-900 px-1 text-xs text-blue-600 rounded shadow">Kelas</Label>
                            <Input
                              id="class"
                              value={userData.class}
                              onChange={(e) => handleInputChange('class', e.target.value)}
                              className="mt-4 pl-10"
                              disabled={saving}
                            />
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                          </div>
                          <div className="relative">
                            <Label htmlFor="school" className="absolute left-3 -top-2 bg-white dark:bg-gray-900 px-1 text-xs text-blue-600 rounded shadow">Sekolah</Label>
                            <Input
                              id="school"
                              value={userData.school}
                              onChange={(e) => handleInputChange('school', e.target.value)}
                              className="mt-4 pl-10"
                              disabled={saving}
                            />
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {userData.name}
                        </h2>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:space-x-6 space-y-2 lg:space-y-0 mb-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{userData.email}</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{userData.phone}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="sticky bottom-0 left-0 w-full z-10 flex flex-row items-center justify-center gap-4 py-4 bg-gradient-to-t from-white/90 dark:from-gray-900/90 backdrop-blur-md">
                      {isEditing ? (
                        <>
                          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 min-w-[120px]" disabled={saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Simpan
                          </Button>
                          <Button onClick={handleCancel} variant="outline" className="min-w-[120px]" disabled={saving}>
                            <X className="mr-2 h-4 w-4" />
                            Batal
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profil
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Personal Information */}
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900 dark:text-white">Data Pribadi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="birthDate">Tanggal Lahir</Label>
                          <Input
                            id="birthDate"
                            value={userData.birthDate}
                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                            className="mt-1"
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <Label htmlFor="gender">Jenis Kelamin</Label>
                          <Input
                            id="gender"
                            value={userData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="mt-1"
                            disabled={saving}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="religion">Agama</Label>
                        <Input
                          id="religion"
                          value={userData.religion}
                          onChange={(e) => handleInputChange('religion', e.target.value)}
                          className="mt-1"
                          disabled={saving}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Alamat</Label>
                        <Textarea
                          id="address"
                          value={userData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="mt-1"
                          rows={3}
                          disabled={saving}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Tanggal Lahir</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{userData.birthDate || "-"}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Jenis Kelamin</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{userData.gender || "-"}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Star className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Agama</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{userData.religion || "-"}</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Alamat</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{userData.address || "-"}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* School Information */}
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900 dark:text-white">Data Sekolah</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="school">Nama Sekolah</Label>
                        <Input
                          id="school"
                          value={userData.school}
                          onChange={(e) => handleInputChange('school', e.target.value)}
                          className="mt-1"
                          disabled={saving}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="major">Jurusan</Label>
                          <Input
                            id="major"
                            value={userData.major}
                            onChange={(e) => handleInputChange('major', e.target.value)}
                            className="mt-1"
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <Label htmlFor="class">Kelas</Label>
                          <Input
                            id="class"
                            value={userData.class}
                            onChange={(e) => handleInputChange('class', e.target.value)}
                            className="mt-1"
                            disabled={saving}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Building className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Nama Sekolah</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{userData.school}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Jurusan</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{userData.major}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Award className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Kelas</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{userData.class}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Internship Information */}
            <Card className="mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-900 dark:text-white">Informasi PKL</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="internshipCompany">Perusahaan</Label>
                      <Input
                        id="internshipCompany"
                        value={userData.internshipCompany}
                        onChange={(e) => handleInputChange('internshipCompany', e.target.value)}
                        className="mt-1"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <Label htmlFor="internshipPosition">Posisi</Label>
                      <Input
                        id="internshipPosition"
                        value={userData.internshipPosition}
                        onChange={(e) => handleInputChange('internshipPosition', e.target.value)}
                        className="mt-1"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <Label htmlFor="internshipDuration">Durasi</Label>
                      <Input
                        id="internshipDuration"
                        value={userData.internshipDuration}
                        onChange={(e) => handleInputChange('internshipDuration', e.target.value)}
                        className="mt-1"
                        disabled={saving}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-indigo-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Perusahaan</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{userData.internshipCompany}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="h-5 w-5 text-indigo-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Posisi</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{userData.internshipPosition}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-indigo-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Durasi</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{userData.internshipDuration}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills and Achievements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Skills */}
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900 dark:text-white">Keahlian</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div>
                      <Label htmlFor="skills">Keahlian</Label>
                      <Textarea
                        id="skills"
                        value={userData.skills}
                        onChange={(e) => handleInputChange('skills', e.target.value)}
                        className="mt-1"
                        rows={4}
                        placeholder="Contoh: JavaScript, React, Node.js, Python, MySQL"
                        disabled={saving}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {userData.skills ? userData.skills.split(', ').map((skill, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {skill}
                        </Badge>
                      )) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Belum ada data keahlian</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900 dark:text-white">Prestasi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div>
                      <Label htmlFor="achievements">Prestasi</Label>
                      <Textarea
                        id="achievements"
                        value={userData.achievements}
                        onChange={(e) => handleInputChange('achievements', e.target.value)}
                        className="mt-1"
                        rows={4}
                        placeholder="Contoh: Juara 1 LKS Web Development 2023, Sertifikat BNSP"
                        disabled={saving}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {userData.achievements ? userData.achievements.split(', ').map((achievement, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <Award className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{achievement}</span>
                        </div>
                      )) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Belum ada data prestasi</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <BottomNavigation />
      </div>
    </AuthProvider>
  )
}