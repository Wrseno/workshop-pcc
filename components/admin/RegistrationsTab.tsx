"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Download,
  Filter,
} from "lucide-react";
import Papa from "papaparse";
import { Registration, RegistrationStatus } from "./types";

interface QuotaInfo {
  software: { current: number; max: number; full: boolean };
  network: { current: number; max: number; full: boolean };
  multimedia: { current: number; max: number; full: boolean };
}

interface RegistrationsTabProps {
  registrations: Registration[];
  departmentFilter: "ALL" | "SOFTWARE" | "NETWORK" | "MULTIMEDIA";
  onFilterChange: (
    filter: "ALL" | "SOFTWARE" | "NETWORK" | "MULTIMEDIA"
  ) => void;
  onUpdateStatus: (id: string, status: RegistrationStatus) => void;
  quotaInfo?: QuotaInfo | null;
}

export function RegistrationsTab({
  registrations,
  departmentFilter,
  onFilterChange,
  onUpdateStatus,
  quotaInfo,
}: RegistrationsTabProps) {
  const filteredRegistrations =
    departmentFilter === "ALL"
      ? registrations
      : registrations.filter((r) => r.pilihanPelatihan === departmentFilter);

  // Check if current filter has full quota
  const isCurrentFilterFull = () => {
    if (!quotaInfo) return false;
    if (departmentFilter === "SOFTWARE") return quotaInfo.software.full;
    if (departmentFilter === "NETWORK") return quotaInfo.network.full;
    if (departmentFilter === "MULTIMEDIA") return quotaInfo.multimedia.full;
    return (
      quotaInfo.software.full &&
      quotaInfo.network.full &&
      quotaInfo.multimedia.full
    );
  };

  const isAllQuotaFull = quotaInfo
    ? quotaInfo.software.full &&
      quotaInfo.network.full &&
      quotaInfo.multimedia.full
    : false;

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

  const exportToCSV = () => {
    const dataToExport = filteredRegistrations.map((reg) => ({
      "Nama Lengkap": reg.namaLengkap,
      NIM: reg.nim,
      "Program Studi": reg.programStudi,
      Jurusan: reg.jurusan,
      "Pilihan Pelatihan": reg.pilihanPelatihan || "-",
      "No WhatsApp": reg.noWa,
      Status: reg.status,
      "Tanggal Daftar": new Date(reg.createdAt).toLocaleString("id-ID"),
      "Bukti Follow PDF": reg.buktiFollowPdfUrl,
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `registrations_${departmentFilter}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border border-gray-800 bg-[#0a0a0a] shadow-xl">
      <CardHeader className="border-b border-gray-800 bg-[#0a0a0a]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-mono text-white">
              REGISTRATION_MANAGEMENT
            </CardTitle>
            <div className="flex flex-wrap gap-3 mt-2 font-mono text-xs">
              <span className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-sm text-gray-300">
                TOTAL:{" "}
                <strong className="text-white">{registrations.length}</strong>
              </span>
              <span className="px-3 py-1 bg-yellow-900/20 border border-yellow-900/50 rounded-sm text-yellow-500">
                PENDING:{" "}
                <strong className="text-yellow-400">
                  {registrations.filter((r) => r.status === "PENDING").length}
                </strong>
              </span>
              <span className="px-3 py-1 bg-green-900/20 border border-green-900/50 rounded-sm text-green-500">
                VERIFIED:{" "}
                <strong className="text-green-400">
                  {registrations.filter((r) => r.status === "VERIFY").length}
                </strong>
              </span>
              <span className="px-3 py-1 bg-red-900/20 border border-red-900/50 rounded-sm text-red-500">
                REJECTED:{" "}
                <strong className="text-red-400">
                  {registrations.filter((r) => r.status === "REJECT").length}
                </strong>
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              value={departmentFilter}
              onValueChange={(value: any) => onFilterChange(value)}
            >
              <SelectTrigger className="w-[180px] bg-[#111] border-gray-800 text-white font-mono">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-gray-800">
                <SelectItem value="ALL" className="text-white font-mono">
                  ALL DEPARTMENTS
                </SelectItem>
                <SelectItem value="SOFTWARE" className="text-white font-mono">
                  SOFTWARE
                </SelectItem>
                <SelectItem value="NETWORK" className="text-white font-mono">
                  NETWORK
                </SelectItem>
                <SelectItem value="MULTIMEDIA" className="text-white font-mono">
                  MULTIMEDIA
                </SelectItem>
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
        {/* Quota Status Display */}
        {quotaInfo && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-lg border ${
                quotaInfo.software.full
                  ? "bg-red-900/20 border-red-900/50"
                  : "bg-blue-900/20 border-blue-900/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-gray-400">
                  SOFTWARE
                </span>
                {quotaInfo.software.full && (
                  <Badge className="bg-red-600 text-white font-mono text-xs">
                    FULL
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold font-mono text-white mt-1">
                {quotaInfo.software.current} / {quotaInfo.software.max}
              </p>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                quotaInfo.network.full
                  ? "bg-red-900/20 border-red-900/50"
                  : "bg-green-900/20 border-green-900/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-gray-400">NETWORK</span>
                {quotaInfo.network.full && (
                  <Badge className="bg-red-600 text-white font-mono text-xs">
                    FULL
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold font-mono text-white mt-1">
                {quotaInfo.network.current} / {quotaInfo.network.max}
              </p>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                quotaInfo.multimedia.full
                  ? "bg-red-900/20 border-red-900/50"
                  : "bg-purple-900/20 border-purple-900/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-gray-400">
                  MULTIMEDIA
                </span>
                {quotaInfo.multimedia.full && (
                  <Badge className="bg-red-600 text-white font-mono text-xs">
                    FULL
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold font-mono text-white mt-1">
                {quotaInfo.multimedia.current} / {quotaInfo.multimedia.max}
              </p>
            </div>
          </div>
        )}

        {/* All Quota Full Warning */}
        {isAllQuotaFull && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-900/50 rounded-lg">
            <p className="font-mono text-red-400 text-center">
              ⚠️ SEMUA KUOTA PELATIHAN SUDAH PENUH - PENDAFTARAN DITUTUP
            </p>
          </div>
        )}

        {/* Table - Hidden when quota is full for selected department */}
        {isCurrentFilterFull() && departmentFilter !== "ALL" ? (
          <div className="p-8 text-center border border-gray-800 rounded-lg bg-gray-900/30">
            <p className="font-mono text-gray-400 text-lg mb-2">
              🔒 KUOTA {departmentFilter} SUDAH PENUH
            </p>
            <p className="font-mono text-gray-500 text-sm">
              Tidak ada slot tersedia untuk departemen ini
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="font-mono text-gray-400">
                    NAME
                  </TableHead>
                  <TableHead className="font-mono text-gray-400">NIM</TableHead>
                  <TableHead className="font-mono text-gray-400">
                    PRODI
                  </TableHead>
                  <TableHead className="font-mono text-gray-400">
                    MAJOR
                  </TableHead>
                  <TableHead className="font-mono text-gray-400">
                    TRAINING
                  </TableHead>
                  <TableHead className="font-mono text-gray-400">
                    WHATSAPP
                  </TableHead>
                  <TableHead className="font-mono text-gray-400">
                    PROOF_PDF
                  </TableHead>
                  <TableHead className="font-mono text-gray-400">
                    STATUS
                  </TableHead>
                  <TableHead className="font-mono text-gray-400">
                    ACTION
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-gray-500 font-mono"
                    >
                      NO_DATA_FOUND
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <TableRow
                      key={reg.id}
                      className="border-gray-800 hover:bg-gray-900/50 transition"
                    >
                      <TableCell className="font-medium font-mono text-white">
                        {reg.namaLengkap}
                      </TableCell>
                      <TableCell className="font-mono text-gray-400">
                        {reg.nim}
                      </TableCell>
                      <TableCell className="font-mono text-gray-400">
                        {reg.programStudi}
                      </TableCell>
                      <TableCell className="font-mono text-gray-400">
                        {reg.jurusan}
                      </TableCell>
                      <TableCell className="font-mono text-blue-400">
                        {reg.pilihanPelatihan || "-"}
                      </TableCell>
                      <TableCell className="font-mono text-gray-400">
                        {reg.noWa}
                      </TableCell>
                      <TableCell>
                        <a
                          href={reg.buktiFollowPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-blue-900/20 hover:text-blue-400 text-gray-400"
                          >
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
                            onClick={() => onUpdateStatus(reg.id, "VERIFY")}
                            disabled={reg.status === "VERIFY"}
                            className="bg-[#111] border-green-900/50 text-green-500 hover:bg-green-900/20 hover:border-green-500 disabled:opacity-30 disabled:bg-transparent"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateStatus(reg.id, "REJECT")}
                            disabled={reg.status === "REJECT"}
                            className="bg-[#111] border-red-900/50 text-red-500 hover:bg-red-900/20 hover:border-red-500 disabled:opacity-30 disabled:bg-transparent"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
