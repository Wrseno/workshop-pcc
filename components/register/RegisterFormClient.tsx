"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { createRegistration, getQuotaInfo } from "@/app/actions/registrations";
import { uploadFile } from "@/app/actions/upload";

type RegistrationStatus = "PENDING" | "VERIFY" | "REJECT";
type TrainingType = "SOFTWARE" | "NETWORK" | "MULTIMEDIA";

interface Registration {
  id: string;
  namaLengkap: string;
  nim: string;
  programStudi: string;
  jurusan: string;
  pilihanPelatihan: TrainingType | null;
  noWa: string;
  status: RegistrationStatus;
  createdAt: string;
}

interface QuotaInfo {
  software: { current: number; max: number; full: boolean };
  network: { current: number; max: number; full: boolean };
  multimedia: { current: number; max: number; full: boolean };
}

interface RegisterFormClientProps {
  initialRegistrations: Registration[];
  initialQuota: QuotaInfo | null;
}

export default function RegisterFormClient({
  initialRegistrations,
  initialQuota,
}: RegisterFormClientProps) {
  const [registrations, setRegistrations] =
    useState<Registration[]>(initialRegistrations);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [quotaFull, setQuotaFull] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(initialQuota);
  const [userRegistration, setUserRegistration] = useState<Registration | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    namaLengkap: "",
    nim: "",
    programStudi: "",
    jurusan: "",
    pilihanPelatihan: "",
    noWa: "",
    buktiFollowPdf: null as File | null,
  });

  useEffect(() => {
    if (quotaInfo) {
      const allFull =
        quotaInfo.software.full &&
        quotaInfo.network.full &&
        quotaInfo.multimedia.full;
      setQuotaFull(allFull);
    }
  }, [quotaInfo]);

  const refreshQuota = async () => {
    const result = await getQuotaInfo();
    if (result.success && result.data) {
      setQuotaInfo(result.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate PDF file size (max 2MB)
    if (formData.buktiFollowPdf) {
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (formData.buktiFollowPdf.size > maxSize) {
        setMessage({ type: "error", text: "Ukuran file PDF maksimal 2MB" });
        return;
      }
    }

    startTransition(async () => {
      try {
        // Upload PDF first if provided
        let pdfUrl = "";
        if (formData.buktiFollowPdf) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", formData.buktiFollowPdf);

          const uploadResult = await uploadFile(uploadFormData);

          if (!uploadResult.success) {
            setMessage({
              type: "error",
              text: uploadResult.error || "Gagal mengupload file",
            });
            return;
          }

          pdfUrl = uploadResult.url!;
        }

        // Submit registration with PDF URL
        const result = await createRegistration({
          namaLengkap: formData.namaLengkap,
          nim: formData.nim,
          programStudi: formData.programStudi,
          jurusan: formData.jurusan,
          pilihanPelatihan: formData.pilihanPelatihan as TrainingType,
          noWa: formData.noWa,
          buktiFollowPdfUrl: pdfUrl,
        });

        if (!result.success) {
          setMessage({
            type: "error",
            text: result.error || "Gagal mendaftar",
          });
        } else {
          setMessage({
            type: "success",
            text: "Pendaftaran berhasil! Menunggu verifikasi admin.",
          });
          setFormData({
            namaLengkap: "",
            nim: "",
            programStudi: "",
            jurusan: "",
            pilihanPelatihan: "",
            noWa: "",
            buktiFollowPdf: null,
          });

          // Refresh quota after successful registration
          await refreshQuota();

          // Reload page to get updated registrations
          window.location.reload();
        }
      } catch (error) {
        setMessage({ type: "error", text: "Terjadi kesalahan sistem" });
      }
    });
  };

  const handleNimBlur = () => {
    const existing = registrations.find((r) => r.nim === formData.nim);
    setUserRegistration(existing || null);
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "VERIFY":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "REJECT":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
    }
  };

  const getStatusMessage = (status: RegistrationStatus) => {
    switch (status) {
      case "PENDING":
        return "Menunggu verifikasi admin";
      case "VERIFY":
        return "Pendaftaran berhasil diverifikasi";
      case "REJECT":
        return "Pendaftaran ditolak oleh admin";
    }
  };

  // Pagination logic with search filter
  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.nim.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRegistrations = filteredRegistrations.slice(
    startIndex,
    endIndex
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#030712] bg-grid-white/[0.02] text-white font-sans selection:bg-purple-500/30">
      {/* Header */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-gray-800 font-mono"
            >
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
            <CardTitle className="text-2xl font-mono text-white">
              Initialize_Registration
            </CardTitle>
            <CardDescription className="text-gray-400 font-mono text-xs">
              ./fill_form_data.sh
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 bg-[#0a0a0a]">
            {quotaFull && (
              <Alert
                variant="destructive"
                className="border border-red-900 bg-red-900/20 text-red-400"
              >
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="font-bold font-mono">
                  ERR_QUOTA_FULL
                </AlertTitle>
                <AlertDescription>
                  Kuota pelatihan telah penuh. Pendaftaran ditutup.
                </AlertDescription>
              </Alert>
            )}

            {quotaInfo && !quotaFull && (
              <Alert className="border border-blue-900 bg-blue-900/10 text-blue-400">
                <AlertCircle className="h-5 w-5 text-blue-400" />
                <AlertTitle className="font-bold font-mono">
                  SYSTEM_STATUS
                </AlertTitle>
                <AlertDescription className="text-blue-300/80 space-y-1 font-mono text-xs mt-2">
                  <div className="flex items-center gap-2">
                    Software: {quotaInfo.software.current}/
                    {quotaInfo.software.max}
                    {quotaInfo.software.full && (
                      <Badge variant="destructive" className="text-[10px]">
                        FULL
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    Network: {quotaInfo.network.current}/{quotaInfo.network.max}
                    {quotaInfo.network.full && (
                      <Badge variant="destructive" className="text-[10px]">
                        FULL
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    Multimedia: {quotaInfo.multimedia.current}/
                    {quotaInfo.multimedia.max}
                    {quotaInfo.multimedia.full && (
                      <Badge variant="destructive" className="text-[10px]">
                        FULL
                      </Badge>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {userRegistration && (
              <Alert className="border border-purple-900 bg-purple-900/10 text-purple-400">
                <AlertCircle className="h-5 w-5 text-purple-400" />
                <AlertTitle className="font-bold font-mono">
                  ALREADY_REGISTERED
                </AlertTitle>
                <AlertDescription className="text-purple-300/80 font-mono text-sm">
                  Status: {getStatusMessage(userRegistration.status)}
                </AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
                className={`border ${
                  message.type === "error"
                    ? "border-red-900 bg-red-900/20"
                    : "border-green-900 bg-green-900/20 text-green-400"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <AlertDescription className="font-mono">
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="namaLengkap"
                    className="text-xs font-mono text-gray-400"
                  >
                    NAMA_LENGKAP *
                  </Label>
                  <Input
                    id="namaLengkap"
                    required
                    value={formData.namaLengkap}
                    onChange={(e) =>
                      setFormData({ ...formData, namaLengkap: e.target.value })
                    }
                    disabled={isPending || quotaFull}
                    className="bg-[#111] border-gray-700 text-white placeholder:text-gray-600 focus:border-blue-500 font-mono"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="nim"
                    className="text-xs font-mono text-gray-400"
                  >
                    NIM *
                  </Label>
                  <Input
                    id="nim"
                    required
                    value={formData.nim}
                    onChange={(e) =>
                      setFormData({ ...formData, nim: e.target.value })
                    }
                    onBlur={handleNimBlur}
                    disabled={isPending || quotaFull}
                    className="bg-[#111] border-gray-700 text-white placeholder:text-gray-600 focus:border-blue-500 font-mono"
                    placeholder="4.33.23.0.01"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="programStudi"
                    className="text-xs font-mono text-gray-400"
                  >
                    PROGRAM_STUDI *
                  </Label>
                  <Input
                    id="programStudi"
                    required
                    value={formData.programStudi}
                    onChange={(e) =>
                      setFormData({ ...formData, programStudi: e.target.value })
                    }
                    disabled={isPending || quotaFull}
                    className="bg-[#111] border-gray-700 text-white placeholder:text-gray-600 focus:border-blue-500 font-mono"
                    placeholder="Teknik Informatika"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="jurusan"
                    className="text-xs font-mono text-gray-400"
                  >
                    JURUSAN *
                  </Label>
                  <Input
                    id="jurusan"
                    required
                    value={formData.jurusan}
                    onChange={(e) =>
                      setFormData({ ...formData, jurusan: e.target.value })
                    }
                    disabled={isPending || quotaFull}
                    className="bg-[#111] border-gray-700 text-white placeholder:text-gray-600 focus:border-blue-500 font-mono"
                    placeholder="Teknik Elektro"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="pilihanPelatihan"
                  className="text-xs font-mono text-gray-400"
                >
                  PILIHAN_PELATIHAN *
                </Label>
                <Select
                  value={formData.pilihanPelatihan}
                  onValueChange={(value) =>
                    setFormData({ ...formData, pilihanPelatihan: value })
                  }
                  disabled={isPending || quotaFull}
                  required
                >
                  <SelectTrigger className="bg-[#111] border-gray-700 text-white focus:border-blue-500 font-mono">
                    <SelectValue placeholder="-- Pilih Pelatihan --" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-gray-700 text-white">
                    <SelectItem
                      value="SOFTWARE"
                      disabled={quotaInfo?.software.full}
                      className="font-mono hover:bg-gray-800 focus:bg-gray-800"
                    >
                      Software {quotaInfo?.software.full && "(FULL)"}
                    </SelectItem>
                    <SelectItem
                      value="NETWORK"
                      disabled={quotaInfo?.network.full}
                      className="font-mono hover:bg-gray-800 focus:bg-gray-800"
                    >
                      Network {quotaInfo?.network.full && "(FULL)"}
                    </SelectItem>
                    <SelectItem
                      value="MULTIMEDIA"
                      disabled={quotaInfo?.multimedia.full}
                      className="font-mono hover:bg-gray-800 focus:bg-gray-800"
                    >
                      Multimedia {quotaInfo?.multimedia.full && "(FULL)"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="noWa"
                  className="text-xs font-mono text-gray-400"
                >
                  NOMOR_WHATSAPP *
                </Label>
                <Input
                  id="noWa"
                  required
                  type="tel"
                  value={formData.noWa}
                  onChange={(e) =>
                    setFormData({ ...formData, noWa: e.target.value })
                  }
                  disabled={isPending || quotaFull}
                  className="bg-[#111] border-gray-700 text-white placeholder:text-gray-600 focus:border-blue-500 font-mono"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="buktiFollowPdf"
                  className="text-xs font-mono text-gray-400"
                >
                  BUKTI_FOLLOW_PDF *
                </Label>
                <Input
                  id="buktiFollowPdf"
                  required
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      buktiFollowPdf: e.target.files?.[0] || null,
                    })
                  }
                  disabled={isPending || quotaFull}
                  className="bg-[#111] border-gray-700 text-white file:bg-gray-800 file:text-gray-300 file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded font-mono cursor-pointer"
                />
                <p className="text-xs text-gray-500 font-mono">
                  Bukti screenshot follow Instagram{" "}
                  <Link
                    href="https://instagram.com/pccpolines"
                    className="text-blue-500 underline"
                    target="_blank"
                  >
                    @pccpolines
                  </Link>{" "}
                  dan{" "}
                  <Link
                    href="https://instagram.com/workshop.pcc"
                    className="text-blue-500 underline"
                    target="_blank"
                  >
                    @workshop.pcc
                  </Link>{" "}
                  dalam satu PDF, maks 2MB.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isPending || quotaFull || !!userRegistration}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded font-mono tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending
                  ? "PROCESSING..."
                  : userRegistration
                  ? "ALREADY_REGISTERED"
                  : "SUBMIT_REGISTRATION"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Registration List - Hidden when all quota is full */}
        {!quotaFull && (
          <Card className="mt-8 bg-[#0a0a0a] border border-gray-800">
            <CardHeader className="border-b border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-mono text-white">
                    Registration_List
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono text-xs mt-1">
                    Total: {filteredRegistrations.length} registrants
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    placeholder="Search by name or NIM..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 bg-[#111] border-gray-700 text-white placeholder:text-gray-600 focus:border-blue-500 font-mono md:w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-transparent">
                      <TableHead className="text-gray-400 font-mono text-xs">
                        No
                      </TableHead>
                      <TableHead className="text-gray-400 font-mono text-xs">
                        Nama
                      </TableHead>
                      <TableHead className="text-gray-400 font-mono text-xs">
                        NIM
                      </TableHead>
                      <TableHead className="text-gray-400 font-mono text-xs">
                        Pelatihan
                      </TableHead>
                      <TableHead className="text-gray-400 font-mono text-xs">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRegistrations.map((reg, idx) => (
                      <TableRow
                        key={reg.id}
                        className="border-gray-800 hover:bg-gray-900/50"
                      >
                        <TableCell className="font-mono text-gray-400 text-sm">
                          {startIndex + idx + 1}
                        </TableCell>
                        <TableCell className="font-mono text-white text-sm">
                          {reg.namaLengkap}
                        </TableCell>
                        <TableCell className="font-mono text-gray-400 text-sm">
                          {reg.nim}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {reg.pilihanPelatihan || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(reg.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
                  <p className="text-sm text-gray-400 font-mono">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="font-mono border-gray-700 hover:bg-gray-800"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="font-mono border-gray-700 hover:bg-gray-800"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
