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
import { QnaItem } from "./types";

interface QnaTabProps {
  qnaItems: QnaItem[];
  onDelete: (id: string) => void;
  onSuccess: () => void;
  AddQnaDialog: React.ComponentType<{ onSuccess: () => void }>;
  EditQnaDialog: React.ComponentType<{ item: QnaItem; onSuccess: () => void }>;
}

export function QnaTab({
  qnaItems,
  onDelete,
  onSuccess,
  AddQnaDialog,
  EditQnaDialog,
}: QnaTabProps) {
  return (
    <Card className="border border-gray-800 bg-[#0a0a0a] shadow-xl">
      <CardHeader className="border-b border-gray-800 bg-[#0a0a0a]">
        <CardTitle className="text-2xl font-mono text-white">
          QnA_MANAGEMENT
        </CardTitle>
        <CardDescription className="text-gray-400 font-mono text-xs">
          ./manage_faq.sh
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-[#0a0a0a]">
        <AddQnaDialog onSuccess={onSuccess} />
        <Table className="mt-4">
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-transparent">
              <TableHead className="font-mono text-gray-400">
                QUESTION
              </TableHead>
              <TableHead className="font-mono text-gray-400">ANSWER</TableHead>
              <TableHead className="font-mono text-gray-400">MODE</TableHead>
              <TableHead className="font-mono text-gray-400">ORDER</TableHead>
              <TableHead className="font-mono text-gray-400">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {qnaItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500 font-mono"
                >
                  NO_FAQ_FOUND
                </TableCell>
              </TableRow>
            ) : (
              qnaItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-gray-800 hover:bg-gray-900/50 transition"
                >
                  <TableCell className="font-medium font-mono text-white">
                    {item.question}
                  </TableCell>
                  <TableCell className="max-w-xs truncate font-mono text-gray-400">
                    {item.answer}
                  </TableCell>
                  <TableCell className="font-mono text-blue-400">
                    {item.mode || "All"}
                  </TableCell>
                  <TableCell className="font-mono text-gray-400">
                    {item.order}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <EditQnaDialog item={item} onSuccess={onSuccess} />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(item.id)}
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
