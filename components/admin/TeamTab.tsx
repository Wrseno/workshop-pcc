"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { TeamMember, TeamType } from "./types";

interface TeamTabProps {
  teamMembers: TeamMember[];
  onDelete: (id: string) => void;
  onSuccess: () => void;
  AddTeamMemberDialog: React.ComponentType<{ onSuccess: () => void }>;
  EditTeamMemberDialog: React.ComponentType<{
    member: TeamMember;
    onSuccess: () => void;
  }>;
}

export function TeamTab({
  teamMembers,
  onDelete,
  onSuccess,
  AddTeamMemberDialog,
  EditTeamMemberDialog,
}: TeamTabProps) {
  const [teamFilter, setTeamFilter] = useState<"ALL" | TeamType>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTeamMembers =
    teamFilter === "ALL"
      ? teamMembers
      : teamMembers.filter((m) => m.type === teamFilter);

  const totalPages = Math.ceil(filteredTeamMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTeamMembers = filteredTeamMembers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (filter: "ALL" | TeamType) => {
    setTeamFilter(filter);
    setCurrentPage(1);
  };

  return (
    <Card className="border border-gray-800 bg-[#0a0a0a] shadow-xl">
      <CardHeader className="border-b border-gray-800 bg-[#0a0a0a]">
        <CardTitle className="text-2xl font-mono text-white">
          TEAM_MANAGEMENT
        </CardTitle>
        <CardDescription className="text-gray-400 font-mono text-xs">
          ./manage_members.sh
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-[#0a0a0a]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <AddTeamMemberDialog onSuccess={onSuccess} />

          <div className="flex items-center gap-2">
            <Label className="text-xs font-mono text-gray-400">FILTER:</Label>
            <div className="flex gap-2">
              <Button
                variant={teamFilter === "ALL" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("ALL")}
                className={
                  teamFilter === "ALL"
                    ? "bg-blue-600 text-white border-0 font-mono"
                    : "bg-[#111] border-gray-800 text-gray-400 hover:text-white font-mono"
                }
              >
                ALL ({teamMembers.length})
              </Button>
              <Button
                variant={teamFilter === "DIVISI" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("DIVISI")}
                className={
                  teamFilter === "DIVISI"
                    ? "bg-cyan-600 text-white border-0 font-mono"
                    : "bg-[#111] border-gray-800 text-gray-400 hover:text-white font-mono"
                }
              >
                DIVISION (
                {teamMembers.filter((m) => m.type === "DIVISI").length})
              </Button>
              <Button
                variant={teamFilter === "DEPARTEMEN" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("DEPARTEMEN")}
                className={
                  teamFilter === "DEPARTEMEN"
                    ? "bg-purple-600 text-white border-0 font-mono"
                    : "bg-[#111] border-gray-800 text-gray-400 hover:text-white font-mono"
                }
              >
                DEPARTMENT (
                {teamMembers.filter((m) => m.type === "DEPARTEMEN").length})
              </Button>
            </div>
          </div>
        </div>

        {/* Division Section */}
        {(teamFilter === "DIVISI" || teamFilter === "ALL") && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-blue-900/20 text-blue-400 border border-blue-900/50 font-mono"
              >
                WORKSHOP_DIVISION
              </Badge>
            </h3>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="font-mono text-gray-400">
                    PHOTO
                  </TableHead>
                  <TableHead className="font-mono text-gray-400">
                    NAME
                  </TableHead>
                  <TableHead className="font-mono text-gray-400">
                    POSITION
                  </TableHead>
                  <TableHead className="font-mono text-gray-400">
                    DESCRIPTION
                  </TableHead>
                  <TableHead className="font-mono text-gray-400">
                    ORDER
                  </TableHead>
                  <TableHead className="font-mono text-gray-400">
                    ACTION
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTeamMembers
                  .filter((m) => m.type === "DIVISI")
                  .map((member) => (
                    <TableRow
                      key={member.id}
                      className="border-gray-800 hover:bg-gray-900/50 transition"
                    >
                      <TableCell>
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-12 h-12 rounded-sm object-cover border border-gray-700"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-sm bg-[#111] border border-gray-800 flex items-center justify-center">
                            <span className="text-sm font-mono text-gray-500">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium font-mono text-white">
                        {member.name}
                      </TableCell>
                      <TableCell className="font-mono text-blue-400">
                        {member.position}
                      </TableCell>
                      <TableCell className="max-w-xs truncate font-mono text-gray-400">
                        {member.description || "-"}
                      </TableCell>
                      <TableCell className="font-mono text-gray-400">
                        {member.order}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <EditTeamMemberDialog
                            member={member}
                            onSuccess={onSuccess}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDelete(member.id)}
                            className="bg-[#111] border-red-900/50 text-red-500 hover:bg-red-900/20 hover:border-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                {paginatedTeamMembers.filter((m) => m.type === "DIVISI")
                  .length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-500 py-8 font-mono"
                    >
                      {teamFilter === "DIVISI"
                        ? "No division members yet"
                        : "No results on this page"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Department Section */}
        {(teamFilter === "DEPARTEMEN" || teamFilter === "ALL") && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-purple-900/20 text-purple-400 border border-purple-900/50 font-mono"
              >
                DEPARTMENT_MEMBERS
              </Badge>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {paginatedTeamMembers
                .filter((m) => m.type === "DEPARTEMEN")
                .map((member) => (
                  <Card
                    key={member.id}
                    className="border border-gray-800 bg-[#111] hover:border-purple-500/50 transition-all"
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-24 h-24 rounded-sm object-cover border border-gray-700"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-sm bg-[#0a0a0a] border border-gray-800 flex items-center justify-center">
                            <span className="text-2xl font-bold font-mono text-gray-600">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-lg font-mono text-white">
                            {member.name}
                          </h4>
                          <p className="text-sm text-purple-400 mb-2 font-mono">
                            {member.position}
                          </p>
                          <p className="text-sm line-clamp-2 text-gray-400 font-mono text-xs">
                            {member.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <EditTeamMemberDialog
                          member={member}
                          onSuccess={onSuccess}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(member.id)}
                          className="flex-1 bg-[#0a0a0a] border-red-900/50 text-red-500 hover:bg-red-900/20 hover:border-red-500 font-mono"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          DELETE
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {paginatedTeamMembers.filter((m) => m.type === "DEPARTEMEN")
                .length === 0 && (
                <Card className="border border-dashed border-gray-800 bg-transparent">
                  <CardContent className="p-8 text-center text-gray-500 font-mono">
                    {teamFilter === "DEPARTEMEN"
                      ? "No department members yet"
                      : "No results on this page"}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 font-mono">
              SHOWING {startIndex + 1} -{" "}
              {Math.min(startIndex + itemsPerPage, filteredTeamMembers.length)}{" "}
              OF {filteredTeamMembers.length} MEMBERS
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-[#111] border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 font-mono"
              >
                PREV
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={
                        currentPage === pageNum
                          ? "bg-blue-600 text-white border-0 font-mono"
                          : "bg-[#111] border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 font-mono"
                      }
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
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
  );
}
