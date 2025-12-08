"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit } from "lucide-react";
import { createTeamMember, updateTeamMember } from "@/app/actions/team";
import { createSponsor, updateSponsor } from "@/app/actions/sponsors";
import { createQnaItem, updateQnaItem } from "@/app/actions/qna";
import { TeamMember, TeamType, Sponsor, QnaItem } from "./types";

// ============ TEAM MEMBER DIALOGS ============

export function AddTeamMemberDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    avatarUrl: "",
    description: "",
    type: "DIVISI" as TeamType,
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTeamMember(formData);
      setOpen(false);
      setFormData({
        name: "",
        position: "",
        avatarUrl: "",
        description: "",
        type: "DIVISI",
        order: 0,
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to add team member", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-mono border border-blue-500/50">
          <Plus className="w-4 h-4 mr-2" />
          ADD_MEMBER
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-gray-800 text-white">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="font-mono text-xl">
            ADD_TEAM_MEMBER
          </DialogTitle>
          <DialogDescription className="font-mono text-gray-400 text-xs">
            ./insert_new_personnel.sh
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">
              MEMBER_TYPE *
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value: TeamType) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="bg-[#111] border-gray-800 text-white font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-gray-800 text-white">
                <SelectItem
                  value="DIVISI"
                  className="focus:bg-gray-800 focus:text-white font-mono"
                >
                  WORKSHOP_DIVISION
                </SelectItem>
                <SelectItem
                  value="DEPARTEMEN"
                  className="focus:bg-gray-800 focus:text-white font-mono"
                >
                  DEPARTMENT_MEMBER
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">NAME *</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Full name"
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">
              POSITION *
            </Label>
            <Input
              required
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder="Ex: Head of Division"
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">
              AVATAR_URL
            </Label>
            <Input
              value={formData.avatarUrl}
              onChange={(e) =>
                setFormData({ ...formData, avatarUrl: e.target.value })
              }
              placeholder="https://example.com/photo.jpg"
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
            <p className="text-xs text-gray-500 font-mono">
              Direct link to photo
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">
              DESCRIPTION {formData.type === "DEPARTEMEN" && "*"}
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Short description..."
              rows={4}
              required={formData.type === "DEPARTEMEN"}
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
            <p className="text-xs text-gray-500 font-mono">
              {formData.type === "DIVISI"
                ? "Optional for division"
                : "Required for department"}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ORDER</Label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-mono"
            >
              SAVE_MEMBER
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditTeamMemberDialog({
  member,
  onSuccess,
}: {
  member: TeamMember;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: member.name,
    position: member.position,
    avatarUrl: member.avatarUrl || "",
    description: member.description || "",
    type: member.type,
    order: member.order,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTeamMember(member.id, formData);
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to update team member", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-gray-800 text-white">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="font-mono text-xl">
            EDIT_TEAM_MEMBER
          </DialogTitle>
          <DialogDescription className="font-mono text-gray-400 text-xs">
            ./update_personnel_data.sh
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">
              MEMBER_TYPE *
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value: TeamType) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="bg-[#111] border-gray-800 text-white font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-gray-800 text-white">
                <SelectItem
                  value="DIVISI"
                  className="focus:bg-gray-800 focus:text-white font-mono"
                >
                  WORKSHOP_DIVISION
                </SelectItem>
                <SelectItem
                  value="DEPARTEMEN"
                  className="focus:bg-gray-800 focus:text-white font-mono"
                >
                  DEPARTMENT_MEMBER
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">NAME *</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">
              POSITION *
            </Label>
            <Input
              required
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">
              AVATAR_URL
            </Label>
            <Input
              value={formData.avatarUrl}
              onChange={(e) =>
                setFormData({ ...formData, avatarUrl: e.target.value })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">
              DESCRIPTION {formData.type === "DEPARTEMEN" && "*"}
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              required={formData.type === "DEPARTEMEN"}
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ORDER</Label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-mono"
            >
              UPDATE_MEMBER
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============ SPONSOR DIALOGS ============

export function AddSponsorDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    linkUrl: "",
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSponsor(formData);
      setOpen(false);
      setFormData({ name: "", logoUrl: "", linkUrl: "", order: 0 });
      onSuccess();
    } catch (error) {
      console.error("Failed to add sponsor", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-mono border border-blue-500/50">
          <Plus className="w-4 h-4 mr-2" />
          ADD_SPONSOR
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0a0a0a] border border-gray-800 text-white">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="font-mono text-xl">ADD_SPONSOR</DialogTitle>
          <DialogDescription className="font-mono text-gray-400 text-xs">
            ./insert_sponsor.sh
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">NAME *</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">LOGO_URL</Label>
            <Input
              value={formData.logoUrl}
              onChange={(e) =>
                setFormData({ ...formData, logoUrl: e.target.value })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">LINK_URL</Label>
            <Input
              value={formData.linkUrl}
              onChange={(e) =>
                setFormData({ ...formData, linkUrl: e.target.value })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ORDER</Label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-mono"
            >
              SAVE_SPONSOR
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditSponsorDialog({
  sponsor,
  onSuccess,
}: {
  sponsor: Sponsor;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: sponsor.name,
    logoUrl: sponsor.logoUrl || "",
    linkUrl: sponsor.linkUrl || "",
    order: sponsor.order,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSponsor(sponsor.id, formData);
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to update sponsor", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0a0a0a] border border-gray-800 text-white">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="font-mono text-xl">EDIT_SPONSOR</DialogTitle>
          <DialogDescription className="font-mono text-gray-400 text-xs">
            ./update_sponsor_data.sh
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">NAME *</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">LOGO_URL</Label>
            <Input
              value={formData.logoUrl}
              onChange={(e) =>
                setFormData({ ...formData, logoUrl: e.target.value })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">LINK_URL</Label>
            <Input
              value={formData.linkUrl}
              onChange={(e) =>
                setFormData({ ...formData, linkUrl: e.target.value })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ORDER</Label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-mono"
            >
              UPDATE_SPONSOR
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============ QnA DIALOGS ============

export function AddQnaDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    mode: "ALL",
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createQnaItem({
        ...formData,
        mode: formData.mode === "ALL" ? null : formData.mode,
      });
      setOpen(false);
      setFormData({ question: "", answer: "", mode: "ALL", order: 0 });
      onSuccess();
    } catch (error) {
      console.error("Failed to add QnA", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-mono border border-blue-500/50">
          <Plus className="w-4 h-4 mr-2" />
          ADD_QNA
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0a0a0a] border border-gray-800 text-white">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="font-mono text-xl">ADD_QNA</DialogTitle>
          <DialogDescription className="font-mono text-gray-400 text-xs">
            ./insert_qna_data.sh
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">
              QUESTION *
            </Label>
            <Input
              required
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ANSWER *</Label>
            <Textarea
              required
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">
              MODE (OPTIONAL)
            </Label>
            <Select
              value={formData.mode}
              onValueChange={(value) =>
                setFormData({ ...formData, mode: value })
              }
            >
              <SelectTrigger className="bg-[#111] border-gray-800 text-white font-mono">
                <SelectValue placeholder="ALL_MODES" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-gray-800 text-white">
                <SelectItem
                  value="ALL"
                  className="focus:bg-gray-800 focus:text-white font-mono"
                >
                  ALL_MODES
                </SelectItem>
                <SelectItem
                  value="TRAINING_BASIC"
                  className="focus:bg-gray-800 focus:text-white font-mono"
                >
                  TRAINING_BASIC
                </SelectItem>
                <SelectItem
                  value="PCC_CLASS"
                  className="focus:bg-gray-800 focus:text-white font-mono"
                >
                  PCC_CLASS
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ORDER</Label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-mono"
            >
              SAVE_QNA
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditQnaDialog({
  item,
  onSuccess,
}: {
  item: QnaItem;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    question: item.question,
    answer: item.answer,
    mode: item.mode || "ALL",
    order: item.order,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateQnaItem(item.id, {
        ...formData,
        mode: formData.mode === "ALL" ? null : formData.mode,
      });
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to update QnA", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0a0a0a] border border-gray-800 text-white">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="font-mono text-xl">EDIT_QNA</DialogTitle>
          <DialogDescription className="font-mono text-gray-400 text-xs">
            ./update_qna_data.sh
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">
              QUESTION *
            </Label>
            <Input
              required
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ANSWER *</Label>
            <Textarea
              required
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
              rows={4}
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">
              MODE (OPTIONAL)
            </Label>
            <Select
              value={formData.mode}
              onValueChange={(value) =>
                setFormData({ ...formData, mode: value })
              }
            >
              <SelectTrigger className="bg-[#111] border-gray-800 text-white font-mono">
                <SelectValue placeholder="ALL_MODES" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-gray-800 text-white">
                <SelectItem
                  value="ALL"
                  className="focus:bg-gray-800 focus:text-white font-mono"
                >
                  ALL_MODES
                </SelectItem>
                <SelectItem
                  value="TRAINING_BASIC"
                  className="focus:bg-gray-800 focus:text-white font-mono"
                >
                  TRAINING_BASIC
                </SelectItem>
                <SelectItem
                  value="PCC_CLASS"
                  className="focus:bg-gray-800 focus:text-white font-mono"
                >
                  PCC_CLASS
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-mono text-gray-400">ORDER</Label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              className="bg-[#111] border-gray-800 text-white font-mono"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-mono"
            >
              UPDATE_QNA
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
