"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteMode } from "./types";

interface ConfigTabProps {
  siteMode: SiteMode;
  onModeChange: (mode: SiteMode) => void;
}

export function ConfigTab({ siteMode, onModeChange }: ConfigTabProps) {
  return (
    <Card className="border border-gray-800 bg-[#0a0a0a] shadow-xl">
      <CardHeader className="border-b border-gray-800 bg-[#0a0a0a]">
        <CardTitle className="text-2xl font-mono text-white">
          SYSTEM_CONFIGURATION
        </CardTitle>
        <CardDescription className="text-gray-400 font-mono text-xs">
          ./configure_site_mode.sh
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-[#0a0a0a]">
        <div className="space-y-4">
          <Label className="text-xs font-mono text-gray-400">SELECT_MODE</Label>
          <Select
            value={siteMode}
            onValueChange={(value) => onModeChange(value as SiteMode)}
          >
            <SelectTrigger className="h-12 bg-[#111] border-gray-800 text-white font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-gray-800">
              <SelectItem
                value="TRAINING_BASIC"
                className="text-white font-mono"
              >
                TRAINING_BASIC
              </SelectItem>
              <SelectItem value="PCC_CLASS" className="text-white font-mono">
                PCC_CLASS
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-6 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
            <p className="text-sm text-gray-300 font-mono">
              <span className="text-purple-400">CURRENT_MODE:</span> {siteMode}
            </p>
            <p className="text-xs text-gray-500 font-mono mt-2">
              {siteMode === "TRAINING_BASIC"
                ? "→ Mode pelatihan dasar untuk trainee baru"
                : "→ Mode kelas PCC untuk trainee lanjutan"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
