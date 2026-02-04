"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2 } from "lucide-react";

interface SiteConfig {
  mode: SiteMode;
  maxQuotaSoftware: number;
  maxQuotaNetwork: number;
  maxQuotaMultimedia: number;
  waLinkSoftware?: string | null;
  waLinkNetwork?: string | null;
  waLinkMultimedia?: string | null;
}

interface ConfigTabProps {
  config: SiteConfig | null;
  onUpdateConfig: (data: Partial<SiteConfig>) => Promise<void>;
}

export function ConfigTab({ config, onUpdateConfig }: ConfigTabProps) {
  const [formData, setFormData] = useState<SiteConfig>({
    mode: "TRAINING_BASIC",
    maxQuotaSoftware: 35,
    maxQuotaNetwork: 35,
    maxQuotaMultimedia: 35,
    waLinkSoftware: "",
    waLinkNetwork: "",
    waLinkMultimedia: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateConfig(formData);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!config) return <div className="text-white p-6">Loading configuration...</div>;

  return (
    <Card className="border border-gray-800 bg-[#0a0a0a] shadow-xl">
      <CardHeader className="border-b border-gray-800 bg-[#0a0a0a]">
        <CardTitle className="text-2xl font-mono text-white">
          SYSTEM_CONFIGURATION
        </CardTitle>
        <CardDescription className="text-gray-400 font-mono text-xs">
          ./configure_system.sh
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-[#0a0a0a] space-y-8">
        
        {/* Site Mode */}
        <div className="space-y-4">
          <Label className="text-xs font-mono text-gray-400">SELECT_MODE</Label>
          <Select
            value={formData.mode}
            onValueChange={(value) => setFormData({...formData, mode: value as SiteMode})}
          >
            <SelectTrigger className="h-12 bg-[#111] border-gray-800 text-white font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-gray-800">
              <SelectItem value="TRAINING_BASIC" className="text-white font-mono">TRAINING_BASIC</SelectItem>
              <SelectItem value="PCC_CLASS" className="text-white font-mono">PCC_CLASS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quotas */}
        <div className="space-y-4">
          <Label className="text-xs font-mono text-gray-400 border-b border-gray-800 pb-2 block w-full">MAX_QUOTAS</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-2">
                <Label className="text-xs text-gray-500">Software</Label>
                <Input 
                   type="number" 
                   value={formData.maxQuotaSoftware} 
                   onChange={e => setFormData({...formData, maxQuotaSoftware: parseInt(e.target.value)})}
                   className="bg-[#111] border-gray-800 text-white font-mono"
                />
             </div>
             <div className="space-y-2">
                <Label className="text-xs text-gray-500">Network</Label>
                <Input 
                   type="number" 
                   value={formData.maxQuotaNetwork} 
                   onChange={e => setFormData({...formData, maxQuotaNetwork: parseInt(e.target.value)})}
                   className="bg-[#111] border-gray-800 text-white font-mono"
                />
             </div>
             <div className="space-y-2">
                <Label className="text-xs text-gray-500">Multimedia</Label>
                <Input 
                   type="number" 
                   value={formData.maxQuotaMultimedia} 
                   onChange={e => setFormData({...formData, maxQuotaMultimedia: parseInt(e.target.value)})}
                   className="bg-[#111] border-gray-800 text-white font-mono"
                />
             </div>
          </div>
        </div>

        {/* WA Links */}
        <div className="space-y-4">
          <Label className="text-xs font-mono text-gray-400 border-b border-gray-800 pb-2 block w-full">WHATSAPP_LINKS</Label>
          <div className="space-y-4">
             <div className="space-y-2">
                <Label className="text-xs text-gray-500">Software Group Link</Label>
                <Input 
                   value={formData.waLinkSoftware || ''} 
                   onChange={e => setFormData({...formData, waLinkSoftware: e.target.value})}
                   className="bg-[#111] border-gray-800 text-white font-mono"
                   placeholder="https://chat.whatsapp.com/..."
                />
             </div>
             <div className="space-y-2">
                <Label className="text-xs text-gray-500">Network Group Link</Label>
                <Input 
                   value={formData.waLinkNetwork || ''} 
                   onChange={e => setFormData({...formData, waLinkNetwork: e.target.value})}
                   className="bg-[#111] border-gray-800 text-white font-mono"
                   placeholder="https://chat.whatsapp.com/..."
                />
             </div>
             <div className="space-y-2">
                <Label className="text-xs text-gray-500">Multimedia Group Link</Label>
                <Input 
                   value={formData.waLinkMultimedia || ''} 
                   onChange={e => setFormData({...formData, waLinkMultimedia: e.target.value})}
                   className="bg-[#111] border-gray-800 text-white font-mono"
                   placeholder="https://chat.whatsapp.com/..."
                />
             </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700 font-mono">
           {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> SAVING...</> : "SAVE_CONFIGURATION"}
        </Button>

      </CardContent>
    </Card>
  );
}
