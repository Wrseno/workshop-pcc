"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertCircle, CheckCircle2, Clock, XCircle, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-react'

type RegistrationStatus = 'PENDING' | 'VERIFY' | 'REJECT'
type TrainingType = 'SOFTWARE' | 'NETWORK' | 'MULTIMEDIA'

interface Registration {
  id: string
  namaLengkap: string
  nim: string
  programStudi: string
  jurusan: string
  pilihanPelatihan: TrainingType | null
  noWa: string
  status: RegistrationStatus
  createdAt: string
}

interface QuotaInfo {
  software: { current: number; max: number; full: boolean }
  network: { current: number; max: number; full: boolean }
  multimedia: { current: number; max: number; full: boolean }
}

export default function RegisterPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [quotaFull, setQuotaFull] = useState(false)
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null)
  const [userRegistration, setUserRegistration] = useState<Registration | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const itemsPerPage = 10

  const [formData, setFormData] = useState({
    namaLengkap: '',
    nim: '',
    programStudi: '',
    jurusan: '',
    pilihanPelatihan: '',
    noWa: '',
    buktiFollowPdf: null as File | null
  })

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/registrations')
      const data = await res.json()
      setRegistrations(data)

      // Fetch quota info
      const quotaRes = await fetch('/api/registrations/quota')
      const quota = await quotaRes.json()
      
      if (quota && quota.software && quota.network && quota.multimedia) {
        setQuotaInfo(quota)
        
        // Check if all quotas are full
        const allFull = quota.software.full && quota.network.full && quota.multimedia.full
        setQuotaFull(allFull)
      }

      // Check if user already registered
      const nimInput = formData.nim
      if (nimInput) {
        const existing = data.find((r: Registration) => r.nim === nimInput)
        setUserRegistration(existing || null)
      }
    } catch (error) {
      console.error('Failed to fetch registrations', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Upload PDF first if provided
      let pdfUrl = ''
      if (formData.buktiFollowPdf) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', formData.buktiFollowPdf)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        })

        if (!uploadRes.ok) {
          const uploadError = await uploadRes.json()
          setMessage({ type: 'error', text: uploadError.error || 'Gagal mengupload file' })
          setIsLoading(false)
          return
        }

        const uploadData = await uploadRes.json()
        pdfUrl = uploadData.url
      }

      // Submit registration with PDF URL
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          namaLengkap: formData.namaLengkap,
          nim: formData.nim,
          programStudi: formData.programStudi,
          jurusan: formData.jurusan,
          pilihanPelatihan: formData.pilihanPelatihan,
          noWa: formData.noWa,
          buktiFollowPdfUrl: pdfUrl
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Gagal mendaftar' })
      } else {
        setMessage({ type: 'success', text: 'Pendaftaran berhasil! Menunggu verifikasi admin.' })
        setFormData({
          namaLengkap: '',
          nim: '',
          programStudi: '',
          jurusan: '',
          pilihanPelatihan: '',
          noWa: '',
          buktiFollowPdf: null
        })
        fetchRegistrations()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan sistem' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNimBlur = () => {
    const existing = registrations.find(r => r.nim === formData.nim)
    setUserRegistration(existing || null)
  }

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'VERIFY':
        return <Badge variant="secondary" className="bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1" />Verified</Badge>
      case 'REJECT':
        return <Badge variant="secondary" className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
    }
  }

  const getStatusMessage = (status: RegistrationStatus) => {
    switch (status) {
      case 'PENDING':
        return 'Menunggu verifikasi admin'
      case 'VERIFY':
        return 'Pendaftaran berhasil diverifikasi'
      case 'REJECT':
        return 'Pendaftaran ditolak oleh admin'
    }
  }

  // Pagination logic with search filter
  const filteredRegistrations = registrations.filter(reg => 
    reg.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.nim.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRegistrations = filteredRegistrations.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="hover:bg-blue-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pendaftaran Training
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Lengkapi form di bawah untuk mendaftar program pelatihan
          </p>
        </div>

        <Card className="shadow-2xl border-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="text-2xl">Form Pendaftaran</CardTitle>
            <CardDescription>
              Isi form di bawah ini untuk mendaftar pelatihan Divisi Workshop PCC
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {quotaFull && (
              <Alert variant="destructive" className="border-2">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="font-bold">Semua Kuota Penuh</AlertTitle>
                <AlertDescription>
                  Maaf, kuota untuk semua pelatihan sudah penuh.
                </AlertDescription>
              </Alert>
            )}

            {quotaInfo && !quotaFull && (
              <Alert className="border-2 border-blue-300 bg-blue-50">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <AlertTitle className="font-bold text-blue-900">Informasi Kuota</AlertTitle>
                <AlertDescription className="text-blue-700 space-y-1">
                  <div className="flex items-center gap-2">
                    Software: {quotaInfo.software.current}/{quotaInfo.software.max} peserta
                    {quotaInfo.software.full && <Badge variant="destructive" className="text-xs">PENUH</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    Network: {quotaInfo.network.current}/{quotaInfo.network.max} peserta
                    {quotaInfo.network.full && <Badge variant="destructive" className="text-xs">PENUH</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    Multimedia: {quotaInfo.multimedia.current}/{quotaInfo.multimedia.max} peserta
                    {quotaInfo.multimedia.full && <Badge variant="destructive" className="text-xs">PENUH</Badge>}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {userRegistration && (
              <Alert className="border-2 border-blue-300 bg-blue-50">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <AlertTitle className="font-bold text-blue-900">Anda Sudah Terdaftar</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Status Anda: {getStatusMessage(userRegistration.status)}
                </AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="border-2">
                {message.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <AlertDescription className="font-medium">{message.text}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="namaLengkap" className="text-base font-semibold">Nama Lengkap *</Label>
                  <Input
                    id="namaLengkap"
                    required
                    disabled={quotaFull || !!userRegistration}
                    value={formData.namaLengkap}
                    onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                    className="border-2 focus:border-blue-500"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nim" className="text-base font-semibold">NIM *</Label>
                  <Input
                    id="nim"
                    required
                    disabled={quotaFull || !!userRegistration}
                    value={formData.nim}
                    onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                    onBlur={handleNimBlur}
                    className="border-2 focus:border-blue-500"
                    placeholder="Masukkan NIM"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="programStudi" className="text-base font-semibold">Program Studi *</Label>
                  <Input
                    id="programStudi"
                    required
                    disabled={quotaFull || !!userRegistration}
                    value={formData.programStudi}
                    onChange={(e) => setFormData({ ...formData, programStudi: e.target.value })}
                    className="border-2 focus:border-blue-500"
                    placeholder="Contoh: Teknik Informatika"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jurusan" className="text-base font-semibold">Jurusan *</Label>
                  <Input
                    id="jurusan"
                    required
                    disabled={quotaFull || !!userRegistration}
                    value={formData.jurusan}
                    onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                    className="border-2 focus:border-blue-500"
                    placeholder="Contoh: Teknik Elektro"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {!quotaFull && (
                  <div className="space-y-2">
                    <Label htmlFor="pilihanPelatihan" className="text-base font-semibold">Pilihan Pelatihan *</Label>
                    <Select
                      required
                      disabled={!!userRegistration}
                      value={formData.pilihanPelatihan}
                      onValueChange={(value) => setFormData({ ...formData, pilihanPelatihan: value })}
                    >
                      <SelectTrigger className="border-2 focus:border-blue-500">
                        <SelectValue placeholder="Pilih program pelatihan" />
                      </SelectTrigger>
                      <SelectContent className='bg-white'>
                        <SelectItem value="SOFTWARE" disabled={quotaInfo?.software.full}>
                          Software "Membuat Landing Page Bisnis Kopi"
                          {quotaInfo?.software.full && ' (PENUH)'}
                        </SelectItem>
                        <SelectItem value="NETWORK" disabled={quotaInfo?.network.full}>
                          Network "Network Fundamental, Basic Configuration and Routing Basic"
                          {quotaInfo?.network.full && ' (PENUH)'}
                        </SelectItem>
                        <SelectItem value="MULTIMEDIA" disabled={quotaInfo?.multimedia.full}>
                          Multimedia "PCC Maintenance Store - Mobile App UI Design"
                          {quotaInfo?.multimedia.full && ' (PENUH)'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="noWa" className="text-base font-semibold">Nomor WhatsApp *</Label>
                  <Input
                    id="noWa"
                    type="tel"
                    required
                    disabled={quotaFull || !!userRegistration}
                    value={formData.noWa}
                    onChange={(e) => setFormData({ ...formData, noWa: e.target.value })}
                    className="border-2 focus:border-blue-500"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buktiFollowPdf" className="text-base font-semibold">Bukti Follow IG PCC & Workshop (PDF) *</Label>
                <Input
                  id="buktiFollowPdf"
                  type="file"
                  accept="application/pdf"
                  required
                  disabled={quotaFull || !!userRegistration}
                  onChange={(e) => setFormData({ ...formData, buktiFollowPdf: e.target.files?.[0] || null })}
                  className="border-2 cursor-pointer"
                />
                <p className="text-sm text-gray-500 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Upload satu file PDF berisi screenshot bukti follow Instagram PCC dan Workshop</span>
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading || quotaFull || !!userRegistration}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mengirim...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Daftar Sekarang
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Status Table */}
        <Card className="mt-12 shadow-2xl border-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="text-2xl">Status Pendaftaran</CardTitle>
            <CardDescription>Daftar seluruh peserta yang telah mendaftar</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Cari berdasarkan nama atau NIM..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 border-2 focus:border-blue-500"
                />
              </div>
              {searchQuery && (
                <p className="text-sm text-gray-600 mt-2">
                  Ditemukan {filteredRegistrations.length} hasil dari "{searchQuery}"
                </p>
              )}
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold">Nama</TableHead>
                    <TableHead className="font-bold">NIM</TableHead>
                    <TableHead className="font-bold">Jurusan</TableHead>
                    <TableHead className="font-bold">Pelatihan</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRegistrations.map((reg) => (
                    <TableRow key={reg.id} className="hover:bg-blue-50 transition">
                      <TableCell className="font-medium">{reg.namaLengkap}</TableCell>
                      <TableCell>{reg.nim}</TableCell>
                      <TableCell>{reg.jurusan}</TableCell>
                      <TableCell>
                        {reg.pilihanPelatihan ? (
                          <span className="inline-flex items-center gap-1">
                            {reg.pilihanPelatihan === 'SOFTWARE'}
                            {reg.pilihanPelatihan === 'NETWORK'}
                            {reg.pilihanPelatihan === 'MULTIMEDIA'}
                            {reg.pilihanPelatihan}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(reg.status)}</TableCell>
                    </TableRow>
                  ))}
                  {registrations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Belum ada pendaftaran
                      </TableCell>
                    </TableRow>
                  )}
                  {registrations.length > 0 && filteredRegistrations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Tidak ada hasil untuk "{searchQuery}"
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {filteredRegistrations.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 pt-4 border-t">
                <p className="text-sm text-gray-600 font-medium">
                  Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredRegistrations.length)} dari {filteredRegistrations.length} data
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Previous</span>
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 ${currentPage === page ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 border-0' : 'border-2'}`}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-2"
                  >
                    <span className="hidden sm:inline mr-1">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
