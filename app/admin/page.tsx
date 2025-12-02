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
import { CheckCircle2, XCircle, Clock, LogOut, ExternalLink, Trash2, Plus, Edit, Download, Filter } from 'lucide-react'
import Papa from 'papaparse'
import { getRegistrations, updateRegistrationStatus, deleteRegistration } from '@/app/actions/registrations'
import { getConfig, updateConfig } from '@/app/actions/config'
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '@/app/actions/team'
import { getSponsors, createSponsor, updateSponsor, deleteSponsor } from '@/app/actions/sponsors'
import { getQnaItems, createQnaItem, updateQnaItem, deleteQnaItem } from '@/app/actions/qna'

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
  
  // Registration filter state
  const [departmentFilter, setDepartmentFilter] = useState<'ALL' | 'SOFTWARE' | 'NETWORK' | 'MULTIMEDIA'>('ALL')
  
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
      const [regResult, teamResult, sponsorResult, qnaResult, configResult] = await Promise.all([
        getRegistrations(),
        getTeamMembers(),
        getSponsors(),
        getQnaItems(),
        getConfig()
      ])

      if (regResult.success && regResult.data) setRegistrations(regResult.data.map(r => ({ ...r, createdAt: new Date(r.createdAt).toISOString() })))
      if (teamResult.success && teamResult.data) setTeamMembers(teamResult.data)
      if (sponsorResult.success && sponsorResult.data) setSponsors(sponsorResult.data)
      if (qnaResult.success && qnaResult.data) setQnaItems(qnaResult.data)
      if (configResult.success && configResult.data) setSiteMode(configResult.data.mode)
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateRegistrationStatus = async (id: string, status: RegistrationStatus) => {
    try {
      const result = await updateRegistrationStatus(id, status)
      
      if (!result.success) {
        alert(`Failed to update registration: ${result.error || 'Unknown error'}`)
        return
      }
      
      fetchData()
    } catch (error) {
      console.error('Failed to update status', error)
      alert('Failed to update registration. Please check console for details.')
    }
  }

  const handleUpdateSiteMode = async (mode: SiteMode) => {
    try {
      const result = await updateConfig(mode)
      if (result.success) {
        setSiteMode(mode)
      }
    } catch (error) {
      console.error('Failed to update mode', error)
    }
  }

  const handleDeleteTeamMember = async (id: string) => {
    try {
      await deleteTeamMember(id)
      fetchData()
    } catch (error) {
      console.error('Failed to delete team member', error)
    }
  }

  const handleDeleteSponsor = async (id: string) => {
    try {
      await deleteSponsor(id)
      fetchData()
    } catch (error) {
      console.error('Failed to delete sponsor', error)
    }
  }

  const handleDeleteQnaItem = async (id: string) => {
    try {
      await deleteQnaItem(id)
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

  // Filter registrations by department
  const filteredRegistrations = departmentFilter === 'ALL'
    ? registrations
    : registrations.filter(r => r.pilihanPelatihan === departmentFilter)

  // Export to CSV function
  const exportToCSV = () => {
    const dataToExport = filteredRegistrations.map(reg => ({
      'Nama Lengkap': reg.namaLengkap,
      'NIM': reg.nim,
      'Program Studi': reg.programStudi,
      'Jurusan': reg.jurusan,
      'Pilihan Pelatihan': reg.pilihanPelatihan || '-',
      'No WhatsApp': reg.noWa,
      'Status': reg.status,
      'Tanggal Daftar': new Date(reg.createdAt).toLocaleString('id-ID'),
      'Bukti Follow PDF': reg.buktiFollowPdfUrl
    }))

    const csv = Papa.unparse(dataToExport)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `registrations_${departmentFilter}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
      <div className="flex items-center justify-center min-h-screen bg-[#030712] bg-grid-white/[0.02]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">INITIALIZING_DASHBOARD...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712] bg-grid-white/[0.02] p-4 md:p-8 text-white font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-800 pb-8">
          <div>
            <h1 className="text-4xl font-bold font-mono text-white mb-2">
              ADMIN_DASHBOARD
            </h1>
            <p className="text-gray-400 font-mono text-sm">./manage_workshop_data.sh</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => signOut()}
            className="bg-[#111] border-gray-800 text-red-400 hover:bg-red-900/20 hover:text-red-300 hover:border-red-900 font-mono"
          >
            <LogOut className="w-4 h-4 mr-2" />
            LOGOUT_SESSION
          </Button>
        </div>

        <Tabs defaultValue="registrations" className="space-y-6">
          <TabsList className="bg-[#0a0a0a] border border-gray-800 p-1.5 h-auto">
            <TabsTrigger 
              value="registrations"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400 px-6 py-3 font-mono rounded-md transition-all"
            >
              REGISTRATIONS
            </TabsTrigger>
            <TabsTrigger 
              value="config"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 px-6 py-3 font-mono rounded-md transition-all"
            >
              CONFIG
            </TabsTrigger>
            <TabsTrigger 
              value="team"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-gray-400 px-6 py-3 font-mono rounded-md transition-all"
            >
              TEAM
            </TabsTrigger>
            <TabsTrigger 
              value="sponsors"
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white text-gray-400 px-6 py-3 font-mono rounded-md transition-all"
            >
              SPONSORS
            </TabsTrigger>
            <TabsTrigger 
              value="qna"
              className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-gray-400 px-6 py-3 font-mono rounded-md transition-all"
            >
              QnA
            </TabsTrigger>
          </TabsList>

          {/* Registrations Tab */}
          <TabsContent value="registrations">
            <Card className="border border-gray-800 bg-[#0a0a0a] shadow-xl">
              <CardHeader className="border-b border-gray-800 bg-[#0a0a0a]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl font-mono text-white">REGISTRATION_MANAGEMENT</CardTitle>
                    <div className="flex flex-wrap gap-3 mt-2 font-mono text-xs">
                      <span className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-sm text-gray-300">
                        TOTAL: <strong className="text-white">{registrations.length}</strong>
                      </span>
                      <span className="px-3 py-1 bg-yellow-900/20 border border-yellow-900/50 rounded-sm text-yellow-500">
                        PENDING: <strong className="text-yellow-400">{registrations.filter(r => r.status === 'PENDING').length}</strong>
                      </span>
                      <span className="px-3 py-1 bg-green-900/20 border border-green-900/50 rounded-sm text-green-500">
                        VERIFIED: <strong className="text-green-400">{registrations.filter(r => r.status === 'VERIFY').length}</strong>
                      </span>
                      <span className="px-3 py-1 bg-red-900/20 border border-red-900/50 rounded-sm text-red-500">
                        REJECTED: <strong className="text-red-400">{registrations.filter(r => r.status === 'REJECT').length}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={departmentFilter} onValueChange={(value: any) => setDepartmentFilter(value)}>
                      <SelectTrigger className="w-[180px] bg-[#111] border-gray-800 text-white font-mono">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-gray-800">
                        <SelectItem value="ALL" className="text-white font-mono">ALL DEPARTMENTS</SelectItem>
                        <SelectItem value="SOFTWARE" className="text-white font-mono">SOFTWARE</SelectItem>
                        <SelectItem value="NETWORK" className="text-white font-mono">NETWORK</SelectItem>
                        <SelectItem value="MULTIMEDIA" className="text-white font-mono">MULTIMEDIA</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={exportToCSV}
                      className="bg-green-600 hover:bg-green-700 text-white font-mono"
                      disabled={filteredRegistrations.length === 0}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      EXPORT_CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-[#0a0a0a]">
                <div className="overflow-x-auto">
                  <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-transparent">
                      <TableHead className="font-mono text-gray-400">NAME</TableHead>
                      <TableHead className="font-mono text-gray-400">NIM</TableHead>
                      <TableHead className="font-mono text-gray-400">PRODI</TableHead>
                      <TableHead className="font-mono text-gray-400">MAJOR</TableHead>
                      <TableHead className="font-mono text-gray-400">TRAINING</TableHead>
                      <TableHead className="font-mono text-gray-400">WHATSAPP</TableHead>
                      <TableHead className="font-mono text-gray-400">PROOF_PDF</TableHead>
                      <TableHead className="font-mono text-gray-400">STATUS</TableHead>
                      <TableHead className="font-mono text-gray-400">ACTION</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500 font-mono">
                          NO_DATA_FOUND
                        </TableCell>
                      </TableRow>
                    ) : filteredRegistrations.map((reg) => (
                      <TableRow key={reg.id} className="border-gray-800 hover:bg-gray-900/50 transition">
                        <TableCell className="font-medium font-mono text-white">{reg.namaLengkap}</TableCell>
                        <TableCell className="font-mono text-gray-400">{reg.nim}</TableCell>
                        <TableCell className="font-mono text-gray-400">{reg.programStudi}</TableCell>
                        <TableCell className="font-mono text-gray-400">{reg.jurusan}</TableCell>
                        <TableCell className="font-mono text-blue-400">{reg.pilihanPelatihan || '-'}</TableCell>
                        <TableCell className="font-mono text-gray-400">{reg.noWa}</TableCell>
                        <TableCell>
                          <a href={reg.buktiFollowPdfUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="hover:bg-blue-900/20 hover:text-blue-400 text-gray-400">
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
                              onClick={() => handleUpdateRegistrationStatus(reg.id, 'VERIFY')}
                              disabled={reg.status === 'VERIFY'}
                              className="bg-[#111] border-green-900/50 text-green-500 hover:bg-green-900/20 hover:border-green-500 disabled:opacity-30 disabled:bg-transparent"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateRegistrationStatus(reg.id, 'REJECT')}
                              disabled={reg.status === 'REJECT'}
                              className="bg-[#111] border-red-900/50 text-red-500 hover:bg-red-900/20 hover:border-red-500 disabled:opacity-30 disabled:bg-transparent"
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
            <Card className="border border-gray-800 bg-[#0a0a0a] shadow-xl">
              <CardHeader className="border-b border-gray-800 bg-[#0a0a0a]">
                <CardTitle className="text-2xl font-mono text-white">SYSTEM_CONFIGURATION</CardTitle>
                <CardDescription className="text-gray-400 font-mono text-xs">./configure_site_mode.sh</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-[#0a0a0a]">
                <div className="space-y-4">
                  <Label className="text-xs font-mono text-gray-400">SELECT_MODE</Label>
                  <Select value={siteMode} onValueChange={(value) => handleUpdateSiteMode(value as SiteMode)}>
                    <SelectTrigger className="h-12 bg-[#111] border-gray-800 text-white font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-gray-800 text-white">
                      <SelectItem value="TRAINING_BASIC" className="focus:bg-gray-800 focus:text-white font-mono">TRAINING_BASIC</SelectItem>
                      <SelectItem value="PCC_CLASS" className="focus:bg-gray-800 focus:text-white font-mono">PCC_CLASS</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-4 p-4 bg-blue-900/10 rounded-lg border border-blue-900/30">
                    <p className="text-sm font-mono text-blue-400">
                      CURRENT_MODE: <span className="px-3 py-1 bg-blue-900/30 rounded-sm text-blue-300 font-bold ml-2 border border-blue-800">
                        {siteMode === 'TRAINING_BASIC' ? 'TRAINING_BASIC' : 'PCC_CLASS'}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card className="border border-gray-800 bg-[#0a0a0a] shadow-xl">
              <CardHeader className="border-b border-gray-800 bg-[#0a0a0a]">
                <CardTitle className="text-2xl font-mono text-white">TEAM_MANAGEMENT</CardTitle>
                <CardDescription className="text-gray-400 font-mono text-xs">./manage_personnel.sh</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-[#0a0a0a]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <AddTeamMemberDialog onSuccess={fetchData} />
                  
                  {/* Filter */}
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-mono text-gray-400">FILTER:</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={teamFilter === 'ALL' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange('ALL')}
                        className={teamFilter === 'ALL' ? 'bg-blue-600 text-white border-0 font-mono' : 'bg-[#111] border-gray-800 text-gray-400 hover:text-white font-mono'}
                      >
                        ALL ({teamMembers.length})
                      </Button>
                      <Button
                        variant={teamFilter === 'DIVISI' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange('DIVISI')}
                        className={teamFilter === 'DIVISI' ? 'bg-cyan-600 text-white border-0 font-mono' : 'bg-[#111] border-gray-800 text-gray-400 hover:text-white font-mono'}
                      >
                        DIVISION ({teamMembers.filter(m => m.type === 'DIVISI').length})
                      </Button>
                      <Button
                        variant={teamFilter === 'DEPARTEMEN' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange('DEPARTEMEN')}
                        className={teamFilter === 'DEPARTEMEN' ? 'bg-purple-600 text-white border-0 font-mono' : 'bg-[#111] border-gray-800 text-gray-400 hover:text-white font-mono'}
                      >
                        DEPARTMENT ({teamMembers.filter(m => m.type === 'DEPARTEMEN').length})
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Team Members Grid/Table */}
                {teamFilter === 'DIVISI' || teamFilter === 'ALL' ? (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-900/20 text-blue-400 border border-blue-900/50 font-mono">WORKSHOP_DIVISION</Badge>
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800 hover:bg-transparent">
                          <TableHead className="font-mono text-gray-400">PHOTO</TableHead>
                          <TableHead className="font-mono text-gray-400">NAME</TableHead>
                          <TableHead className="font-mono text-gray-400">POSITION</TableHead>
                          <TableHead className="font-mono text-gray-400">DESCRIPTION</TableHead>
                          <TableHead className="font-mono text-gray-400">ORDER</TableHead>
                          <TableHead className="font-mono text-gray-400">ACTION</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedTeamMembers.filter(m => m.type === 'DIVISI').map((member) => (
                          <TableRow key={member.id} className="border-gray-800 hover:bg-gray-900/50 transition">
                            <TableCell>
                              {member.avatarUrl ? (
                                <img src={member.avatarUrl} alt={member.name} className="w-12 h-12 rounded-sm object-cover border border-gray-700" />
                              ) : (
                                <div className="w-12 h-12 rounded-sm bg-[#111] border border-gray-800 flex items-center justify-center">
                                  <span className="text-sm font-mono text-gray-500">{member.name.charAt(0)}</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-medium font-mono text-white">{member.name}</TableCell>
                            <TableCell className="font-mono text-blue-400">{member.position}</TableCell>
                            <TableCell className="max-w-xs truncate font-mono text-gray-400">{member.description || '-'}</TableCell>
                            <TableCell className="font-mono text-gray-400">{member.order}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <EditTeamMemberDialog member={member} onSuccess={fetchData} />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteTeamMember(member.id)}
                                  className="bg-[#111] border-red-900/50 text-red-500 hover:bg-red-900/20 hover:border-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {paginatedTeamMembers.filter(m => m.type === 'DIVISI').length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-500 py-8 font-mono">
                              {teamFilter === 'DIVISI' ? 'No division members yet' : 'No results on this page'}
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
                      <Badge variant="secondary" className="bg-purple-900/20 text-purple-400 border border-purple-900/50 font-mono">DEPARTMENT_MEMBERS</Badge>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {paginatedTeamMembers.filter(m => m.type === 'DEPARTEMEN').map((member) => (
                        <Card key={member.id} className="border border-gray-800 bg-[#111] hover:border-purple-500/50 transition-all">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              {member.avatarUrl ? (
                                <img src={member.avatarUrl} alt={member.name} className="w-24 h-24 rounded-sm object-cover border border-gray-700" />
                              ) : (
                                <div className="w-24 h-24 rounded-sm bg-[#0a0a0a] border border-gray-800 flex items-center justify-center">
                                  <span className="text-2xl font-bold font-mono text-gray-600">{member.name.charAt(0)}</span>
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="font-bold text-lg font-mono text-white">{member.name}</h4>
                                <p className="text-sm text-purple-400 mb-2 font-mono">{member.position}</p>
                                <p className="text-sm line-clamp-2 text-gray-400 font-mono text-xs">{member.description}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <EditTeamMemberDialog member={member} onSuccess={fetchData} />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteTeamMember(member.id)}
                                className="flex-1 bg-[#0a0a0a] border-red-900/50 text-red-500 hover:bg-red-900/20 hover:border-red-500 font-mono"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                DELETE
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {paginatedTeamMembers.filter(m => m.type === 'DEPARTEMEN').length === 0 && (
                        <Card className="border border-dashed border-gray-800 bg-transparent">
                          <CardContent className="p-8 text-center text-gray-500 font-mono">
                            {teamFilter === 'DEPARTEMEN' ? 'No department members yet' : 'No results on this page'}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
                    <p className="text-xs text-gray-500 font-mono">
                      SHOWING {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredTeamMembers.length)} OF {filteredTeamMembers.length} MEMBERS
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="bg-[#111] border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 font-mono"
                      >
                        PREV
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
                              className={currentPage === pageNum ? 'bg-blue-600 text-white border-0 font-mono' : 'bg-[#111] border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 font-mono'}
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
                        className="bg-[#111] border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 font-mono"
                      >
                        NEXT
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sponsors Tab */}
          <TabsContent value="sponsors">
            <Card className="border border-gray-800 bg-[#0a0a0a] shadow-xl">
              <CardHeader className="border-b border-gray-800 bg-[#0a0a0a]">
                <CardTitle className="text-2xl font-mono text-white">SPONSOR_MANAGEMENT</CardTitle>
                <CardDescription className="text-gray-400 font-mono text-xs">./manage_partners.sh</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-[#0a0a0a]">
                <AddSponsorDialog onSuccess={fetchData} />
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-transparent">
                      <TableHead className="font-mono text-gray-400">NAME</TableHead>
                      <TableHead className="font-mono text-gray-400">LOGO_URL</TableHead>
                      <TableHead className="font-mono text-gray-400">LINK_URL</TableHead>
                      <TableHead className="font-mono text-gray-400">ORDER</TableHead>
                      <TableHead className="font-mono text-gray-400">ACTION</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sponsors.map((sponsor) => (
                      <TableRow key={sponsor.id} className="border-gray-800 hover:bg-gray-900/50 transition">
                        <TableCell className="font-medium font-mono text-white">{sponsor.name}</TableCell>
                        <TableCell className="max-w-xs truncate font-mono text-gray-400">{sponsor.logoUrl || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate font-mono text-blue-400">{sponsor.linkUrl || '-'}</TableCell>
                        <TableCell className="font-mono text-gray-400">{sponsor.order}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <EditSponsorDialog sponsor={sponsor} onSuccess={fetchData} />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteSponsor(sponsor.id)}
                              className="bg-[#111] border-red-900/50 text-red-500 hover:bg-red-900/20 hover:border-red-500"
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
            <Card className="border border-gray-800 bg-[#0a0a0a] shadow-xl">
              <CardHeader className="border-b border-gray-800 bg-[#0a0a0a]">
                <CardTitle className="text-2xl font-mono text-white">QnA_MANAGEMENT</CardTitle>
                <CardDescription className="text-gray-400 font-mono text-xs">./manage_faq.sh</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-[#0a0a0a]">
                <AddQnaDialog onSuccess={fetchData} />
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-transparent">
                      <TableHead className="font-mono text-gray-400">QUESTION</TableHead>
                      <TableHead className="font-mono text-gray-400">ANSWER</TableHead>
                      <TableHead className="font-mono text-gray-400">MODE</TableHead>
                      <TableHead className="font-mono text-gray-400">ORDER</TableHead>
                      <TableHead className="font-mono text-gray-400">ACTION</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {qnaItems.map((item) => (
                      <TableRow key={item.id} className="border-gray-800 hover:bg-gray-900/50 transition">
                        <TableCell className="font-medium font-mono text-white">{item.question}</TableCell>
                        <TableCell className="max-w-xs truncate font-mono text-gray-400">{item.answer}</TableCell>
                        <TableCell className="font-mono text-blue-400">{item.mode || 'All'}</TableCell>
                        <TableCell className="font-mono text-gray-400">{item.order}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <EditQnaDialog item={item} onSuccess={fetchData} />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteQnaItem(item.id)}
                              className="bg-[#111] border-red-900/50 text-red-500 hover:bg-red-900/20 hover:border-red-500"
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
      await createTeamMember(formData)
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-mono border border-blue-500/50"><Plus className="w-4 h-4 mr-2" />ADD_MEMBER</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-gray-800 text-white">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="font-mono text-xl">ADD_TEAM_MEMBER</DialogTitle>
          <DialogDescription className="font-mono text-gray-400 text-xs">./insert_new_personnel.sh</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">MEMBER_TYPE *</Label>
            <Select value={formData.type} onValueChange={(value: TeamType) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="bg-[#111] border-gray-800 text-white font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-gray-800 text-white">
                <SelectItem value="DIVISI" className="focus:bg-gray-800 focus:text-white font-mono">WORKSHOP_DIVISION</SelectItem>
                <SelectItem value="DEPARTEMEN" className="focus:bg-gray-800 focus:text-white font-mono">DEPARTMENT_MEMBER</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">NAME *</Label>
            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">POSITION *</Label>
            <Input required value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} placeholder="Ex: Head of Division" className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">AVATAR_URL</Label>
            <Input value={formData.avatarUrl} onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })} placeholder="https://example.com/photo.jpg" className="bg-[#111] border-gray-800 text-white font-mono" />
            <p className="text-xs text-gray-500 font-mono">Direct link to photo</p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">DESCRIPTION {formData.type === 'DEPARTEMEN' && '*'}</Label>
            <Textarea 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              placeholder="Short description..."
              rows={4}
              required={formData.type === 'DEPARTEMEN'}
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
            <p className="text-xs text-gray-500 font-mono">
              {formData.type === 'DIVISI' ? 'Optional for division' : 'Required for department'}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ORDER</Label>
            <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-mono">SAVE_MEMBER</Button>
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
      await updateTeamMember(member.id, formData)
      setOpen(false)
      onSuccess()
    } catch (error) {
      console.error('Failed to update team member', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"><Edit className="w-4 h-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-gray-800 text-white">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="font-mono text-xl">EDIT_TEAM_MEMBER</DialogTitle>
          <DialogDescription className="font-mono text-gray-400 text-xs">./update_personnel_data.sh</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">MEMBER_TYPE *</Label>
            <Select value={formData.type} onValueChange={(value: TeamType) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="bg-[#111] border-gray-800 text-white font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-gray-800 text-white">
                <SelectItem value="DIVISI" className="focus:bg-gray-800 focus:text-white font-mono">WORKSHOP_DIVISION</SelectItem>
                <SelectItem value="DEPARTEMEN" className="focus:bg-gray-800 focus:text-white font-mono">DEPARTMENT_MEMBER</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">NAME *</Label>
            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">POSITION *</Label>
            <Input required value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">AVATAR_URL</Label>
            <Input value={formData.avatarUrl} onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">DESCRIPTION {formData.type === 'DEPARTEMEN' && '*'}</Label>
            <Textarea 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              rows={4}
              required={formData.type === 'DEPARTEMEN'}
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ORDER</Label>
            <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-mono">UPDATE_MEMBER</Button>
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
      await createSponsor(formData)
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-mono border border-blue-500/50"><Plus className="w-4 h-4 mr-2" />ADD_SPONSOR</Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0a0a0a] border border-gray-800 text-white">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="font-mono text-xl">ADD_SPONSOR</DialogTitle>
          <DialogDescription className="font-mono text-gray-400 text-xs">./insert_sponsor.sh</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">NAME *</Label>
            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">LOGO_URL</Label>
            <Input value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">LINK_URL</Label>
            <Input value={formData.linkUrl} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ORDER</Label>
            <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-mono">SAVE_SPONSOR</Button>
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
      await updateSponsor(sponsor.id, formData)
      setOpen(false)
      onSuccess()
    } catch (error) {
      console.error('Failed to update sponsor', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0a0a0a] border border-gray-800 text-white">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="font-mono text-xl">EDIT_SPONSOR</DialogTitle>
          <DialogDescription className="font-mono text-gray-400 text-xs">./update_sponsor_data.sh</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">NAME *</Label>
            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">LOGO_URL</Label>
            <Input value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">LINK_URL</Label>
            <Input value={formData.linkUrl} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ORDER</Label>
            <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-mono">UPDATE_SPONSOR</Button>
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
      await createQnaItem({
        ...formData,
        mode: formData.mode === 'ALL' ? null : formData.mode
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-mono border border-blue-500/50"><Plus className="w-4 h-4 mr-2" />ADD_QNA</Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0a0a0a] border border-gray-800 text-white">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="font-mono text-xl">ADD_QNA</DialogTitle>
          <DialogDescription className="font-mono text-gray-400 text-xs">./insert_qna_data.sh</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">QUESTION *</Label>
            <Input required value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ANSWER *</Label>
            <Textarea required value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">MODE (OPTIONAL)</Label>
            <Select value={formData.mode} onValueChange={(value) => setFormData({ ...formData, mode: value })}>
              <SelectTrigger className="bg-[#111] border-gray-800 text-white font-mono">
                <SelectValue placeholder="ALL_MODES" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-gray-800 text-white">
                <SelectItem value="ALL" className="focus:bg-gray-800 focus:text-white font-mono">ALL_MODES</SelectItem>
                <SelectItem value="TRAINING_BASIC" className="focus:bg-gray-800 focus:text-white font-mono">TRAINING_BASIC</SelectItem>
                <SelectItem value="PCC_CLASS" className="focus:bg-gray-800 focus:text-white font-mono">PCC_CLASS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ORDER</Label>
            <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-mono">SAVE_QNA</Button>
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
      await updateQnaItem(item.id, {
        ...formData,
        mode: formData.mode === 'ALL' ? null : formData.mode
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
        <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0a0a0a] border border-gray-800 text-white">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="font-mono text-xl">EDIT_QNA</DialogTitle>
          <DialogDescription className="font-mono text-gray-400 text-xs">./update_qna_data.sh</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">QUESTION *</Label>
            <Input required value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ANSWER *</Label>
            <Textarea required value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} rows={4} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">MODE (OPTIONAL)</Label>
            <Select value={formData.mode} onValueChange={(value) => setFormData({ ...formData, mode: value })}>
              <SelectTrigger className="bg-[#111] border-gray-800 text-white font-mono">
                <SelectValue placeholder="ALL_MODES" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-gray-800 text-white">
                <SelectItem value="ALL" className="focus:bg-gray-800 focus:text-white font-mono">ALL_MODES</SelectItem>
                <SelectItem value="TRAINING_BASIC" className="focus:bg-gray-800 focus:text-white font-mono">TRAINING_BASIC</SelectItem>
                <SelectItem value="PCC_CLASS" className="focus:bg-gray-800 focus:text-white font-mono">PCC_CLASS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ORDER</Label>
            <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="bg-[#111] border-gray-800 text-white font-mono" />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-mono">UPDATE_QNA</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
