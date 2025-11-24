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
    <div className="min-h-screen bg-[#030712] bg-grid-white/[0.02] text-white font-sans selection:bg-purple-500/30">
      {/* Header */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 font-mono">
              <ArrowLeft className="w-4 h-4 mr-2" />
              _BACK_TO_HOME
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              &lt;REGISTRATION /&gt;
            </span>
          </h1>
          <p className="text-lg text-gray-400 font-mono">
            // Lengkapi form di bawah untuk mendaftar program pelatihan
          </p>
        </div>

        <Card className="bg-[#0a0a0a] border border-gray-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <CardHeader className="border-b border-gray-800 bg-[#0a0a0a]">
            <CardTitle className="text-2xl font-mono text-white">Initialize_Registration</CardTitle>
            <CardDescription className="text-gray-400 font-mono text-xs">
              ./fill_form_data.sh
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 bg-[#0a0a0a]">
            {quotaFull && (
              <Alert variant="destructive" className="border border-red-900 bg-red-900/20 text-red-400">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="font-bold font-mono">ERR_QUOTA_FULL</AlertTitle>
                <AlertDescription>
                  Kuota pelatihan telah penuh. Pendaftaran ditutup.
                </AlertDescription>
              </Alert>
            )}

            {quotaInfo && !quotaFull && (
              <Alert className="border border-blue-900 bg-blue-900/10 text-blue-400">
                <AlertCircle className="h-5 w-5 text-blue-400" />
                <AlertTitle className="font-bold font-mono">SYSTEM_STATUS</AlertTitle>
                <AlertDescription className="text-blue-300/80 space-y-1 font-mono text-xs mt-2">
                  <div className="flex items-center gap-2">
                    Software: {quotaInfo.software.current}/{quotaInfo.software.max}
                    {quotaInfo.software.full && <Badge variant="destructive" className="text-[10px]">FULL</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    Network: {quotaInfo.network.current}/{quotaInfo.network.max}
                    {quotaInfo.network.full && <Badge variant="destructive" className="text-[10px]">FULL</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    Multimedia: {quotaInfo.multimedia.current}/{quotaInfo.multimedia.max}
                    {quotaInfo.multimedia.full && <Badge variant="destructive" className="text-[10px]">FULL</Badge>}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {userRegistration && (
              <Alert className="border border-purple-900 bg-purple-900/10 text-purple-400">
                <AlertCircle className="h-5 w-5 text-purple-400" />
                <AlertTitle className="font-bold font-mono">ALREADY_REGISTERED</AlertTitle>
                <AlertDescription className="text-purple-300/80 font-mono text-sm">
                  Status: {getStatusMessage(userRegistration.status)}
                </AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={`border ${message.type === 'error' ? 'border-red-900 bg-red-900/20' : 'border-green-900 bg-green-900/20 text-green-400'}`}>
                {message.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <AlertDescription className="font-mono">{message.text}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="namaLengkap" className="text-xs font-mono text-gray-400">NAMA_LENGKAP *</Label>
                  <Input
                    id="namaLengkap"
                    required
                    disabled={quotaFull || !!userRegistration}
                    value={formData.namaLengkap}
                    onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                    className="bg-[#111] border-gray-800 text-white focus:border-purple-500 focus:ring-purple-500/20 font-mono text-sm"
                    placeholder="Masukan nama lengkap"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nim" className="text-xs font-mono text-gray-400">NIM *</Label>
                  <Input
                    id="nim"
                    required
                    disabled={quotaFull || !!userRegistration}
                    value={formData.nim}
                    onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                    onBlur={handleNimBlur}
                    className="bg-[#111] border-gray-800 text-white focus:border-purple-500 focus:ring-purple-500/20 font-mono text-sm"
                    placeholder="Masukan NIM"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="programStudi" className="text-xs font-mono text-gray-400">PROGRAM_STUDI *</Label>
                  <Input
                    id="programStudi"
                    required
                    disabled={quotaFull || !!userRegistration}
                    value={formData.programStudi}
                    onChange={(e) => setFormData({ ...formData, programStudi: e.target.value })}
                    className="bg-[#111] border-gray-800 text-white focus:border-purple-500 focus:ring-purple-500/20 font-mono text-sm"
                    placeholder="Ex: Teknologi Rekayasa Komputer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jurusan" className="text-xs font-mono text-gray-400">JURUSAN *</Label>
                  <Input
                    id="jurusan"
                    required
                    disabled={quotaFull || !!userRegistration}
                    value={formData.jurusan}
                    onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                    className="bg-[#111] border-gray-800 text-white focus:border-purple-500 focus:ring-purple-500/20 font-mono text-sm"
                    placeholder="Ex: Teknik Elektro"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {!quotaFull && (
                  <div className="space-y-2">
                    <Label htmlFor="pilihanPelatihan" className="text-xs font-mono text-gray-400">PILIH_PELATIHAN *</Label>
                    <Select
                      required
                      disabled={!!userRegistration}
                      value={formData.pilihanPelatihan}
                      onValueChange={(value) => setFormData({ ...formData, pilihanPelatihan: value })}
                    >
                      <SelectTrigger className="bg-[#111] border-gray-800 text-white focus:border-purple-500 focus:ring-purple-500/20 font-mono text-sm">
                        <SelectValue placeholder="Pilih program pelatihan" />
                      </SelectTrigger>
                      <SelectContent className='bg-[#0a0a0a] border-gray-800 text-white'>
                        <SelectItem value="SOFTWARE" disabled={quotaInfo?.software.full} className="focus:bg-gray-800 focus:text-white">
                          Software "Membuat Landing Page Bisnis Kopi"
                          {quotaInfo?.software.full && ' (FULL)'}
                        </SelectItem>
                        <SelectItem value="NETWORK" disabled={quotaInfo?.network.full} className="focus:bg-gray-800 focus:text-white">
                          Network "Network Fundamental, Basic Configuration and Routing Basic"
                          {quotaInfo?.network.full && ' (FULL)'}
                        </SelectItem>
                        <SelectItem value="MULTIMEDIA" disabled={quotaInfo?.multimedia.full} className="focus:bg-gray-800 focus:text-white">
                          Multimedia "PCC Maintenance Store - Mobile App UI Design"
                          {quotaInfo?.multimedia.full && ' (FULL)'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="noWa" className="text-xs font-mono text-gray-400">NOMOR_WHATSAPP *</Label>
                  <Input
                    id="noWa"
                    type="tel"
                    required
                    disabled={quotaFull || !!userRegistration}
                    value={formData.noWa}
                    onChange={(e) => setFormData({ ...formData, noWa: e.target.value })}
                    className="bg-[#111] border-gray-800 text-white focus:border-purple-500 focus:ring-purple-500/20 font-mono text-sm"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buktiFollowPdf" className="text-xs font-mono text-gray-400">BUKTI_FOLLOW_PCC_&_WORKSHOP (PDF) *</Label>
                <Input
                  id="buktiFollowPdf"
                  type="file"
                  accept="application/pdf"
                  required
                  disabled={quotaFull || !!userRegistration}
                  onChange={(e) => setFormData({ ...formData, buktiFollowPdf: e.target.files?.[0] || null })}
                  className="bg-[#111] border-gray-800 text-white cursor-pointer file:bg-gray-800 file:text-white file:border-0 file:mr-4 file:py-2 file:px-4 hover:file:bg-gray-700"
                />
                <p className="text-xs text-gray-500 flex items-start gap-2 font-mono">
                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>
                    Upload satu file PDF yang berisi screenshot dari Instagram PCC & Workshop (
                      <Link href="https://instagram.com/pccpolines" target="_blank" className="text-blue-400 hover:underline">
                      @pccpolines 
                      </Link>
                      {" "}&{" "}
                      <Link href="https://instagram.com/workshop.pcc" target="_blank" className="text-blue-400 hover:underline">
                      @workshop.pcc
                      </Link>
                      )</span>
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono py-6 border border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all"
                disabled={isLoading || quotaFull || !!userRegistration}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    PROCESSING...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    INITIALIZE_REGISTRATION
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Status Table */}
        <Card className="mt-12 bg-[#0a0a0a] border border-gray-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-500"></div>
          <CardHeader className="border-b border-gray-800 bg-[#0a0a0a]">
            <CardTitle className="text-2xl font-mono text-white">Registration_Status</CardTitle>
            <CardDescription className="text-gray-400 font-mono text-xs">./view_participants.sh</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 bg-[#0a0a0a]">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by name or NIM..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-[#111] border-gray-800 text-white focus:border-purple-500 focus:ring-purple-500/20 font-mono text-sm"
                />
              </div>
              {searchQuery && (
                <p className="text-xs text-gray-500 mt-2 font-mono">
                  Found {filteredRegistrations.length} results for "{searchQuery}"
                </p>
              )}
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="font-bold font-mono text-gray-400">NAME</TableHead>
                    <TableHead className="font-bold font-mono text-gray-400">NIM</TableHead>
                    <TableHead className="font-bold font-mono text-gray-400">MAJOR</TableHead>
                    <TableHead className="font-bold font-mono text-gray-400">TRAINING</TableHead>
                    <TableHead className="font-bold font-mono text-gray-400">STATUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRegistrations.map((reg) => (
                    <TableRow key={reg.id} className="border-gray-800 hover:bg-gray-900/50 transition">
                      <TableCell className="font-medium font-mono text-white">{reg.namaLengkap}</TableCell>
                      <TableCell className="font-mono text-gray-400">{reg.nim}</TableCell>
                      <TableCell className="font-mono text-gray-400">{reg.jurusan}</TableCell>
                      <TableCell className="font-mono text-blue-400">
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
                      <TableCell colSpan={5} className="text-center text-gray-500 py-8 font-mono">
                        No registrations found
                      </TableCell>
                    </TableRow>
                  )}
                  {registrations.length > 0 && filteredRegistrations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-8 font-mono">
                        No results for "{searchQuery}"
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {filteredRegistrations.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500 font-mono">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredRegistrations.length)} of {filteredRegistrations.length} data
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-[#111] border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 font-mono"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">PREV</span>
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
                          className={`w-10 h-10 font-mono ${currentPage === page ? 'bg-blue-600 text-white border-0' : 'bg-[#111] border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'}`}
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
                    className="bg-[#111] border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 font-mono"
                  >
                    <span className="hidden sm:inline mr-1">NEXT</span>
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
