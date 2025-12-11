"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";
import {
  getRegistrations,
  updateRegistrationStatus,
  getQuotaInfo,
} from "@/app/actions/registrations";
import { getConfig, updateConfig } from "@/app/actions/config";
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/app/actions/team";
import {
  getSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
} from "@/app/actions/sponsors";
import {
  getQnaItems,
  createQnaItem,
  updateQnaItem,
  deleteQnaItem,
} from "@/app/actions/qna";
import {
  Registration,
  SiteMode,
  TeamMember,
  Sponsor,
  QnaItem,
  RegistrationStatus,
} from "@/components/admin/types";
import { RegistrationsTab } from "@/components/admin/RegistrationsTab";
import { ConfigTab } from "@/components/admin/ConfigTab";
import { TeamTab } from "@/components/admin/TeamTab";
import { SponsorsTab } from "@/components/admin/SponsorsTab";
import { QnaTab } from "@/components/admin/QnaTab";
import {
  AddTeamMemberDialog,
  EditTeamMemberDialog,
  AddSponsorDialog,
  EditSponsorDialog,
  AddQnaDialog,
  EditQnaDialog,
} from "@/components/admin/dialogs";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [qnaItems, setQnaItems] = useState<QnaItem[]>([]);
  const [siteMode, setSiteMode] = useState<SiteMode>("TRAINING_BASIC");
  const [isLoading, setIsLoading] = useState(true);
  const [quotaInfo, setQuotaInfo] = useState<{
    software: { current: number; max: number; full: boolean };
    network: { current: number; max: number; full: boolean };
    multimedia: { current: number; max: number; full: boolean };
  } | null>(null);

  // Registration filter state
  const [departmentFilter, setDepartmentFilter] = useState<
    "ALL" | "SOFTWARE" | "NETWORK" | "MULTIMEDIA"
  >("ALL");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      const [
        regResult,
        teamResult,
        sponsorResult,
        qnaResult,
        configResult,
        quotaResult,
      ] = await Promise.all([
        getRegistrations(),
        getTeamMembers(),
        getSponsors(),
        getQnaItems(),
        getConfig(),
        getQuotaInfo(),
      ]);

      if (regResult.success && regResult.data)
        setRegistrations(
          regResult.data.map((r) => ({
            ...r,
            createdAt: new Date(r.createdAt).toISOString(),
          }))
        );
      if (teamResult.success && teamResult.data)
        setTeamMembers(
          teamResult.data.map((t) => ({
            ...t,
            department: t.department ?? undefined,
          }))
        );
      if (sponsorResult.success && sponsorResult.data)
        setSponsors(sponsorResult.data);
      if (qnaResult.success && qnaResult.data) setQnaItems(qnaResult.data);
      if (configResult.success && configResult.data)
        setSiteMode(configResult.data.mode);
      if (quotaResult.success && quotaResult.data)
        setQuotaInfo(quotaResult.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRegistrationStatus = async (
    id: string,
    status: RegistrationStatus
  ) => {
    try {
      const result = await updateRegistrationStatus(id, status);

      if (!result.success) {
        alert(
          `Failed to update registration: ${result.error || "Unknown error"}`
        );
        return;
      }

      fetchData();
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update registration. Please check console for details.");
    }
  };

  const handleUpdateSiteMode = async (mode: SiteMode) => {
    try {
      const result = await updateConfig(mode);
      if (result.success) {
        setSiteMode(mode);
      }
    } catch (error) {
      console.error("Failed to update mode", error);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    try {
      await deleteTeamMember(id);
      fetchData();
    } catch (error) {
      console.error("Failed to delete team member", error);
    }
  };

  const handleDeleteSponsor = async (id: string) => {
    try {
      await deleteSponsor(id);
      fetchData();
    } catch (error) {
      console.error("Failed to delete sponsor", error);
    }
  };

  const handleDeleteQnaItem = async (id: string) => {
    try {
      await deleteQnaItem(id);
      fetchData();
    } catch (error) {
      console.error("Failed to delete QnA item", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030712] bg-grid-white/[0.02]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">INITIALIZING_DASHBOARD...</p>
        </div>
      </div>
    );
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
            <p className="text-gray-400 font-mono text-sm">
              ./manage_workshop_data.sh
            </p>
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

          <TabsContent value="registrations">
            <RegistrationsTab
              registrations={registrations}
              departmentFilter={departmentFilter}
              onFilterChange={setDepartmentFilter}
              onUpdateStatus={handleUpdateRegistrationStatus}
              quotaInfo={quotaInfo}
            />
          </TabsContent>

          <TabsContent value="config">
            <ConfigTab
              siteMode={siteMode}
              onModeChange={handleUpdateSiteMode}
            />
          </TabsContent>

          <TabsContent value="team">
            <TeamTab
              teamMembers={teamMembers}
              onDelete={handleDeleteTeamMember}
              onSuccess={fetchData}
              AddTeamMemberDialog={AddTeamMemberDialog}
              EditTeamMemberDialog={EditTeamMemberDialog}
            />
          </TabsContent>

          <TabsContent value="sponsors">
            <SponsorsTab
              sponsors={sponsors}
              onDelete={handleDeleteSponsor}
              onSuccess={fetchData}
              AddSponsorDialog={AddSponsorDialog}
              EditSponsorDialog={EditSponsorDialog}
            />
          </TabsContent>

          <TabsContent value="qna">
            <QnaTab
              qnaItems={qnaItems}
              onDelete={handleDeleteQnaItem}
              onSuccess={fetchData}
              AddQnaDialog={AddQnaDialog}
              EditQnaDialog={EditQnaDialog}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
