"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle2, XCircle, Clock, LogOut, ExternalLink, Trash2, Plus, Edit } from 'lucide-react'

type RegistrationStatus = 'PENDING' | 'VERIFY' | 'REJECT'
type SiteMode = 'TRAINING_BASIC' | 'PCC_CLASS'
type TeamType = 'DIVISI' | 'DEPARTEMEN'

interface Registration {
  id: string
  namaLengkap: string
  nim: string
  programStudi: string
  jurusan: string
  pilihanPelatihan: string | null
  noWa: string
  buktiFollowPdfUrl: string
  status: RegistrationStatus
  createdAt: string
}

interface TeamMember {
  id: string
  name: string
  position: string
  avatarUrl: string | null
  description: string | null
  type: TeamType
  order: number
}

interface Sponsor {
  id: string
  name: string
  logoUrl: string | null
  linkUrl: string | null
  order: number
}

interface QnaItem {
  id: string
  question: string
  answer: string
  mode: SiteMode | null
  order: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [qnaItems, setQnaItems] = useState<QnaItem[]>([])
  const [siteMode, setSiteMode] = useState<SiteMode>('TRAINING_BASIC')
  const [isLoading, setIsLoading] = useState(true)
  
  // Team pagination and filter states
  const [teamFilter, setTeamFilter] = useState<'ALL' | TeamType>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchData()
    }
  }, [status, router])

  const fetchData = async () => {
    try {
      const [regRes, teamRes, sponsorRes, qnaRes, configRes] = await Promise.all([
        fetch('/api/registrations'),
        fetch('/api/team'),
        fetch('/api/sponsors'),
        fetch('/api/qna'),
        fetch('/api/config')
      ])

      const [regData, teamData, sponsorData, qnaData, configData] = await Promise.all([
        regRes.json(),
        teamRes.json(),
        sponsorRes.json(),
        qnaRes.json(),
        configRes.json()
      ])

      setRegistrations(regData)
      setTeamMembers(teamData)
      setSponsors(sponsorData)
      setQnaItems(qnaData)
      setSiteMode(configData.mode)
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateRegistrationStatus = async (id: string, status: RegistrationStatus) => {
    try {
      const response = await fetch(`/api/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        alert(`Failed to update registration: ${errorData.error || 'Unknown error'}`)
        return
      }
      
      fetchData()
    } catch (error) {
      console.error('Failed to update status', error)
      alert('Failed to update registration. Please check console for details.')
    }
  }

  const updateSiteMode = async (mode: SiteMode) => {
    try {
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      })
      setSiteMode(mode)
    } catch (error) {
      console.error('Failed to update mode', error)
    }
  }

  const deleteTeamMember = async (id: string) => {
    try {
      await fetch(`/api/team/${id}`, { method: 'DELETE' })
      fetchData()
    } catch (error) {
      console.error('Failed to delete team member', error)
    }
  }

  const deleteSponsor = async (id: string) => {
    try {
      await fetch(`/api/sponsors/${id}`, { method: 'DELETE' })
      fetchData()
    } catch (error) {
      console.error('Failed to delete sponsor', error)
    }
  }

  const deleteQnaItem = async (id: string) => {
    try {
      await fetch(`/api/qna/${id}`, { method: 'DELETE' })
      fetchData()
    } catch (error) {
      console.error('Failed to delete QnA item', error)
    }
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

  // Filter and paginate team members
  const filteredTeamMembers = teamFilter === 'ALL' 
    ? teamMembers 
    : teamMembers.filter(m => m.type === teamFilter)
  
  const totalPages = Math.ceil(filteredTeamMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTeamMembers = filteredTeamMembers.slice(startIndex, startIndex + itemsPerPage)

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: 'ALL' | TeamType) => {
    setTeamFilter(filter)
    setCurrentPage(1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Kelola data workshop PCC</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => signOut()}
            className="border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="registrations" className="space-y-6">
          <TabsList className="bg-white shadow-md border-0 p-1.5 h-auto">
            <TabsTrigger 
              value="registrations"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white px-6 py-3 font-semibold rounded-lg transition-all"
            >
              Pendaftaran
            </TabsTrigger>
            <TabsTrigger 
              value="config"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white px-6 py-3 font-semibold rounded-lg transition-all"
            >
              Konfigurasi
            </TabsTrigger>
            <TabsTrigger 
              value="team"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white px-6 py-3 font-semibold rounded-lg transition-all"
            >
              Tim
            </TabsTrigger>
            <TabsTrigger 
              value="sponsors"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white px-6 py-3 font-semibold rounded-lg transition-all"
            >
              Sponsor
            </TabsTrigger>
            <TabsTrigger 
              value="qna"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white px-6 py-3 font-semibold rounded-lg transition-all"
            >
              QnA
            </TabsTrigger>
          </TabsList>

          {/* Registrations Tab */}
          <TabsContent value="registrations">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-2xl">Manajemen Pendaftaran</CardTitle>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 font-medium text-sm">
                    Total: <strong>{registrations.length}</strong>
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 rounded-full text-yellow-700 font-medium text-sm">
                    Pending: <strong>{registrations.filter(r => r.status === 'PENDING').length}</strong>
                  </span>
                  <span className="px-3 py-1 bg-green-100 rounded-full text-green-700 font-medium text-sm">
                    Verified: <strong>{registrations.filter(r => r.status === 'VERIFY').length}</strong>
                  </span>
                  <span className="px-3 py-1 bg-red-100 rounded-full text-red-700 font-medium text-sm">
                    Rejected: <strong>{registrations.filter(r => r.status === 'REJECT').length}</strong>
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIM</TableHead>
                      <TableHead>Prodi</TableHead>
                      <TableHead>Jurusan</TableHead>
                      <TableHead>Pelatihan</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Bukti PDF</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-medium">{reg.namaLengkap}</TableCell>
                        <TableCell>{reg.nim}</TableCell>
                        <TableCell>{reg.programStudi}</TableCell>
                        <TableCell>{reg.jurusan}</TableCell>
                        <TableCell>{reg.pilihanPelatihan || '-'}</TableCell>
                        <TableCell>{reg.noWa}</TableCell>
                        <TableCell>
                          <a href={reg.buktiFollowPdfUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        </TableCell>
                        <TableCell>{getStatusBadge(reg.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRegistrationStatus(reg.id, 'VERIFY')}
                              disabled={reg.status === 'VERIFY'}
                              className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRegistrationStatus(reg.id, 'REJECT')}
                              disabled={reg.status === 'REJECT'}
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-2xl">Mode Website</CardTitle>
                <CardDescription className="text-base">Ubah mode tampilan website</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Pilih Mode</Label>
                  <Select value={siteMode} onValueChange={(value) => updateSiteMode(value as SiteMode)}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRAINING_BASIC">Training Basic</SelectItem>
                      <SelectItem value="PCC_CLASS">PCC Class</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-gray-700">
                      Mode saat ini: <span className="px-3 py-1 bg-white rounded-full text-purple-600 font-bold">
                        {siteMode === 'TRAINING_BASIC' ? 'Training Basic' : 'PCC Class'}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-2xl">Manajemen Tim</CardTitle>
                <CardDescription className="text-base">Kelola anggota Divisi Workshop dan Departemen</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <AddTeamMemberDialog onSuccess={fetchData} />
                  
                  {/* Filter */}
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-semibold">Filter:</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={teamFilter === 'ALL' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange('ALL')}
                        className={teamFilter === 'ALL' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : ''}
                      >
                        Semua ({teamMembers.length})
                      </Button>
                      <Button
                        variant={teamFilter === 'DIVISI' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange('DIVISI')}
                        className={teamFilter === 'DIVISI' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : ''}
                      >
                        Divisi ({teamMembers.filter(m => m.type === 'DIVISI').length})
                      </Button>
                      <Button
                        variant={teamFilter === 'DEPARTEMEN' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange('DEPARTEMEN')}
                        className={teamFilter === 'DEPARTEMEN' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
                      >
                        Departemen ({teamMembers.filter(m => m.type === 'DEPARTEMEN').length})
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Team Members Grid/Table */}
                {teamFilter === 'DIVISI' || teamFilter === 'ALL' ? (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">Divisi Workshop</Badge>
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Foto</TableHead>
                          <TableHead>Nama</TableHead>
                          <TableHead>Jabatan</TableHead>
                          <TableHead>Deskripsi</TableHead>
                          <TableHead>Order</TableHead>
                          <TableHead>Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedTeamMembers.filter(m => m.type === 'DIVISI').map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>
                              {member.avatarUrl ? (
                                <img src={member.avatarUrl} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-sm font-semibold">{member.name.charAt(0)}</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.position}</TableCell>
                            <TableCell className="max-w-xs truncate">{member.description || '-'}</TableCell>
                            <TableCell>{member.order}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <EditTeamMemberDialog member={member} onSuccess={fetchData} />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteTeamMember(member.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {paginatedTeamMembers.filter(m => m.type === 'DIVISI').length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              {teamFilter === 'DIVISI' ? 'Belum ada anggota divisi' : 'Tidak ada hasil pada halaman ini'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ) : null}

                {/* Departemen Section */}
                {teamFilter === 'DEPARTEMEN' || teamFilter === 'ALL' ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">Anggota Departemen</Badge>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {paginatedTeamMembers.filter(m => m.type === 'DEPARTEMEN').map((member) => (
                        <Card key={member.id} className="border-2">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              {member.avatarUrl ? (
                                <img src={member.avatarUrl} alt={member.name} className="w-24 h-24 rounded-lg object-cover" />
                              ) : (
                                <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <span className="text-2xl font-bold">{member.name.charAt(0)}</span>
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg">{member.name}</h4>
                                <p className="text-sm text-muted-foreground mb-2">{member.position}</p>
                                <p className="text-sm line-clamp-2">{member.description}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <EditTeamMemberDialog member={member} onSuccess={fetchData} />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteTeamMember(member.id)}
                                className="flex-1"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {paginatedTeamMembers.filter(m => m.type === 'DEPARTEMEN').length === 0 && (
                        <Card className="border-2 border-dashed">
                          <CardContent className="p-8 text-center text-muted-foreground">
                            {teamFilter === 'DEPARTEMEN' ? 'Belum ada anggota departemen' : 'Tidak ada hasil pada halaman ini'}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t">
                    <p className="text-sm text-gray-600">
                      Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredTeamMembers.length)} dari {filteredTeamMembers.length} anggota
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      
                      {/* Page Numbers */}
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum
                          if (totalPages <= 5) {
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className={currentPage === pageNum ? 'bg-gradient-to-r from-blue-500 to-purple-500' : ''}
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sponsors Tab */}
          <TabsContent value="sponsors">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-2xl">Manajemen Sponsor</CardTitle>
                <CardDescription className="text-base">Kelola sponsor workshop</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <AddSponsorDialog onSuccess={fetchData} />
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Logo URL</TableHead>
                      <TableHead>Link URL</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sponsors.map((sponsor) => (
                      <TableRow key={sponsor.id}>
                        <TableCell>{sponsor.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{sponsor.logoUrl || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate">{sponsor.linkUrl || '-'}</TableCell>
                        <TableCell>{sponsor.order}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <EditSponsorDialog sponsor={sponsor} onSuccess={fetchData} />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteSponsor(sponsor.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QnA Tab */}
          <TabsContent value="qna">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-2xl">Manajemen QnA</CardTitle>
                <CardDescription className="text-base">Kelola pertanyaan dan jawaban</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <AddQnaDialog onSuccess={fetchData} />
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pertanyaan</TableHead>
                      <TableHead>Jawaban</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {qnaItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.question}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.answer}</TableCell>
                        <TableCell>{item.mode || 'All'}</TableCell>
                        <TableCell>{item.order}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <EditQnaDialog item={item} onSuccess={fetchData} />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteQnaItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function AddTeamMemberDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ 
    name: '', 
    position: '', 
    avatarUrl: '', 
    description: '',
    type: 'DIVISI' as TeamType,
    order: 0 
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      setOpen(false)
      setFormData({ name: '', position: '', avatarUrl: '', description: '', type: 'DIVISI', order: 0 })
      onSuccess()
    } catch (error) {
      console.error('Failed to add team member', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="w-4 h-4 mr-2" />Tambah Anggota</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Tambah Anggota Tim</DialogTitle>
          <DialogDescription>Tambahkan anggota divisi workshop atau departemen</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipe Anggota *</Label>
            <Select value={formData.type} onValueChange={(value: TeamType) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DIVISI">Divisi Workshop</SelectItem>
                <SelectItem value="DEPARTEMEN">Anggota Departemen</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Nama *</Label>
            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nama lengkap" />
          </div>
          <div className="space-y-2">
            <Label>Jabatan *</Label>
            <Input required value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} placeholder="Contoh: Ketua Divisi, Anggota" />
          </div>
          <div className="space-y-2">
            <Label>Avatar URL</Label>
            <Input value={formData.avatarUrl} onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })} placeholder="https://example.com/photo.jpg" />
            <p className="text-sm text-muted-foreground">URL foto anggota</p>
          </div>
          <div className="space-y-2">
            <Label>Deskripsi {formData.type === 'DEPARTEMEN' && '*'}</Label>
            <Textarea 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              placeholder="Deskripsi singkat tentang anggota..."
              rows={4}
              required={formData.type === 'DEPARTEMEN'}
            />
            <p className="text-sm text-muted-foreground">
              {formData.type === 'DIVISI' ? 'Opsional untuk divisi' : 'Wajib untuk departemen'}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Order (urutan tampil)</Label>
            <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} />
          </div>
          <DialogFooter>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditTeamMemberDialog({ member, onSuccess }: { member: TeamMember, onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ 
    name: member.name, 
    position: member.position, 
    avatarUrl: member.avatarUrl || '', 
    description: member.description || '',
    type: member.type,
    order: member.order 
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch(`/api/team/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      setOpen(false)
      onSuccess()
    } catch (error) {
      console.error('Failed to update team member', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Edit Anggota Tim</DialogTitle>
          <DialogDescription>Perbarui informasi anggota</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipe Anggota *</Label>
            <Select value={formData.type} onValueChange={(value: TeamType) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DIVISI">Divisi Workshop</SelectItem>
                <SelectItem value="DEPARTEMEN">Anggota Departemen</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Nama *</Label>
            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Jabatan *</Label>
            <Input required value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Avatar URL</Label>
            <Input value={formData.avatarUrl} onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi {formData.type === 'DEPARTEMEN' && '*'}</Label>
            <Textarea 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              rows={4}
              required={formData.type === 'DEPARTEMEN'}
            />
          </div>
          <div className="space-y-2">
            <Label>Order</Label>
            <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} />
          </div>
          <DialogFooter>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddSponsorDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', logoUrl: '', linkUrl: '', order: 0 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      setOpen(false)
      setFormData({ name: '', logoUrl: '', linkUrl: '', order: 0 })
      onSuccess()
    } catch (error) {
      console.error('Failed to add sponsor', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="w-4 h-4 mr-2" />Tambah Sponsor</Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Tambah Sponsor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nama</Label>
            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Link URL</Label>
            <Input value={formData.linkUrl} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Order</Label>
            <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} />
          </div>
          <DialogFooter>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditSponsorDialog({ sponsor, onSuccess }: { sponsor: Sponsor, onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ 
    name: sponsor.name, 
    logoUrl: sponsor.logoUrl || '', 
    linkUrl: sponsor.linkUrl || '', 
    order: sponsor.order 
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch(`/api/sponsors/${sponsor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      setOpen(false)
      onSuccess()
    } catch (error) {
      console.error('Failed to update sponsor', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Edit Sponsor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nama</Label>
            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Link URL</Label>
            <Input value={formData.linkUrl} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Order</Label>
            <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} />
          </div>
          <DialogFooter>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddQnaDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ question: '', answer: '', mode: 'ALL', order: 0 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/qna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          mode: formData.mode === 'ALL' ? null : formData.mode
        })
      })
      setOpen(false)
      setFormData({ question: '', answer: '', mode: 'ALL', order: 0 })
      onSuccess()
    } catch (error) {
      console.error('Failed to add QnA', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="w-4 h-4 mr-2" />Tambah QnA</Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Tambah QnA</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Pertanyaan</Label>
            <Input required value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Jawaban</Label>
            <Textarea required value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Mode (opsional)</Label>
            <Select value={formData.mode} onValueChange={(value) => setFormData({ ...formData, mode: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Semua mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua mode</SelectItem>
                <SelectItem value="TRAINING_BASIC">Training Basic</SelectItem>
                <SelectItem value="PCC_CLASS">PCC Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Order</Label>
            <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} />
          </div>
          <DialogFooter>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditQnaDialog({ item, onSuccess }: { item: QnaItem, onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ 
    question: item.question, 
    answer: item.answer, 
    mode: item.mode || 'ALL', 
    order: item.order 
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch(`/api/qna/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          mode: formData.mode === 'ALL' ? null : formData.mode
        })
      })
      setOpen(false)
      onSuccess()
    } catch (error) {
      console.error('Failed to update QnA', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Edit QnA</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Pertanyaan</Label>
            <Input required value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Jawaban</Label>
            <Textarea required value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Mode (opsional)</Label>
            <Select value={formData.mode} onValueChange={(value) => setFormData({ ...formData, mode: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Semua mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua mode</SelectItem>
                <SelectItem value="TRAINING_BASIC">Training Basic</SelectItem>
                <SelectItem value="PCC_CLASS">PCC Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Order</Label>
            <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} />
          </div>
          <DialogFooter>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
