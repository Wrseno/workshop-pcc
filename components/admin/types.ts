export type RegistrationStatus = "PENDING" | "VERIFY" | "REJECT";
export type SiteMode = "TRAINING_BASIC" | "PCC_CLASS";
export type TeamType = "DIVISI" | "DEPARTEMEN";
export type DepartmentType = "SOFTWARE" | "NETWORK" | "MULTIMEDIA";

export interface Registration {
  id: string;
  namaLengkap: string;
  nim: string;
  programStudi: string;
  jurusan: string;
  pilihanPelatihan: string | null;
  noWa: string;
  buktiFollowPdfUrl: string;
  status: RegistrationStatus;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatarUrl: string | null;
  description: string | null;
  type: TeamType;
  order: number;
  department?: DepartmentType | null;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string | null;
  linkUrl: string | null;
  order: number;
}

export interface QnaItem {
  id: string;
  question: string;
  answer: string;
  mode: SiteMode | null;
  order: number;
}
