"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Sponsor } from "./types";

interface SponsorsTabProps {
  sponsors: Sponsor[];
  onDelete: (id: string) => void;
  onSuccess: () => void;
  AddSponsorDialog: React.ComponentType<{ onSuccess: () => void }>;
  EditSponsorDialog: React.ComponentType<{
    sponsor: Sponsor;
    onSuccess: () => void;
  }>;
}

export function SponsorsTab({
  sponsors,
  onDelete,
  onSuccess,
  AddSponsorDialog,
  EditSponsorDialog,
}: SponsorsTabProps) {
  return (
    <Card className="border border-gray-800 bg-[#0a0a0a] shadow-xl">
      <CardHeader className="border-b border-gray-800 bg-[#0a0a0a]">
        <CardTitle className="text-2xl font-mono text-white">
          SPONSOR_MANAGEMENT
        </CardTitle>
        <CardDescription className="text-gray-400 font-mono text-xs">
          ./manage_partners.sh
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-[#0a0a0a]">
        <AddSponsorDialog onSuccess={onSuccess} />
        <Table className="mt-4">
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-transparent">
              <TableHead className="font-mono text-gray-400">NAME</TableHead>
              <TableHead className="font-mono text-gray-400">
                LOGO_URL
              </TableHead>
              <TableHead className="font-mono text-gray-400">
                LINK_URL
              </TableHead>
              <TableHead className="font-mono text-gray-400">ORDER</TableHead>
              <TableHead className="font-mono text-gray-400">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sponsors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500 font-mono"
                >
                  NO_SPONSORS_FOUND
                </TableCell>
              </TableRow>
            ) : (
              sponsors.map((sponsor) => (
                <TableRow
                  key={sponsor.id}
                  className="border-gray-800 hover:bg-gray-900/50 transition"
                >
                  <TableCell className="font-medium font-mono text-white">
                    {sponsor.name}
                  </TableCell>
                  <TableCell className="max-w-xs truncate font-mono text-gray-400">
                    {sponsor.logoUrl || "-"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate font-mono text-blue-400">
                    {sponsor.linkUrl || "-"}
                  </TableCell>
                  <TableCell className="font-mono text-gray-400">
                    {sponsor.order}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <EditSponsorDialog
                        sponsor={sponsor}
                        onSuccess={onSuccess}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(sponsor.id)}
                        className="bg-[#111] border-red-900/50 text-red-500 hover:bg-red-900/20 hover:border-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
