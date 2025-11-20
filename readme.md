# Prompt: Build Training Registration Website (Next.js + Prisma + Supabase, No Participant Login)

You are an expert full-stack engineer.  
Build a **training registration website** with the following requirements.

The website is **purely for training registration**, no participant login is required.  
Only **admin** has an authentication-protected dashboard.

Tech stack:

- **Next.js (App Router)** — Server Components first
- **TypeScript**
- **Supabase PostgreSQL**
- **Prisma ORM**
- **Supabase Storage** for storing PDF upload
- **Tailwind CSS**
- **shadcn/ui** for modern UI components  
- **Design theme:** clean, responsive, modern, **blue color palette**

---

# 1. Website Overview

This website handles **pendaftaran pelatihan Divisi Workshop PCC**.

It includes:

- Public Landing Page
- Public Registration Page
- Admin Dashboard (protected)
- No login for participants
- Only admins can access `/admin`

---

# 2. Landing Page Requirements (`/`)

Sections to include:

### 1. Hero Section
- Explanation of **Divisi Workshop PCC**
- CTA button “Daftar Pelatihan”
- Badge showing active website mode:
  - `Training Basic`
  - `PCC Class`
- Mode determines description content
- Use shadcn components (`Button`, `Badge`, `Card`) with blue accents

### 2. Training Section
Three types of training:

- Software  
- Network  
- Multimedia  

Each includes:
- Title  
- Description (changes according to mode)  
- Icon/illustration  
- Use shadcn `Card` grid layout

### 3. Team Section
List of team members:
- Name  
- Position  
- Avatar/photo  
- Stored and editable via Admin Dashboard

### 4. Sponsorship Section
Logos or sponsor names  
(admin-customizable)

### 5. QnA Section
FAQ items  
(admin-customizable, supports mode-specific QnA)

---

# 3. Registration Page (`/register`)

Participants do **not** need to log in.

Use shadcn form components (`Form`, `Input`, `Select`, `Button`, `Alert`).

## Registration Form Fields

- Nama Lengkap  
- NIM  
- Program Studi  
- Jurusan  
- Pilihan Pelatihan (Software / Network / Multimedia)  
- Nomor WhatsApp  
- **Bukti Follow IG PCC & Workshop (merged into ONE PDF upload)**  
  - Upload as a **single PDF file** containing screenshots  
  - File stored in **Supabase Storage**  
  - DB stores file URL/path

## Registration Flow

### (A) Quota Limitation
- Max quota = **35**
- Count participants with:
  - status = `pending`
  - status = `verify`
- If quota ≥ 35:
  - Hide training selection field
  - Disable the form
  - Show shadcn `Alert`: **“Kuota penuh”**

### (B) After Registration
- Save registration with status = `pending`
- Disable the form for that NIM (NIM cannot register twice)
- Show status information under the form

### Status Display Under Form
Always show a **public table** containing all participants:

Columns:
- Nama  
- NIM  
- Pelatihan  
- Status (`pending` / `verify` / `reject`)  

Use shadcn `Table` + status `Badge`.

Messages:
- `pending`: Menunggu verifikasi admin  
- `verify`: Pendaftaran berhasil diverifikasi  
- `reject`: Pendaftaran ditolak oleh admin  

### (C) Form Locking per NIM
If a participant already registered:
- Prevent re-register
- Show message:
  > “Anda sudah terdaftar. Status Anda: {status}”

---

# 4. Admin Dashboard (`/admin`)

Protected route (admin-only).  
Use shadcn components to build a modern dashboard:

- `Tabs`
- `Card`
- `Table`
- `Button`
- `Dialog` / `Sheet`
- `Form`
- `Input`
- `Textarea`
- `Select`
- `Badge`

## Admin Features

### 1. Manage Participants
Table view showing:

- Nama
- NIM
- Program Studi
- Jurusan
- Pelatihan
- Nomor WhatsApp
- **Bukti Follow PDF (download/view link)**
- Status (`pending`, `verify`, `reject`)
- Action buttons:
  - Verify
  - Reject

Updating status MUST refresh registration quota automatically.

### 2. Mode Customization
Admin can switch between:

- `TRAINING_BASIC`
- `PCC_CLASS`

Changes:
- Hero section
- Training descriptions
- QnA content (if mode-specific)

### 3. **Content Customization**
Admin can edit:

#### a. Team Members
- Name  
- Position  
- Avatar URL  
- Sort order  
- CRUD operations  
Rendered on the landing page.

#### b. Sponsors
- Name  
- Logo URL  
- Link URL (optional)  
- Sort order  
- CRUD operations  

#### c. QnA Items
- Question  
- Answer  
- Optional `mode` field (null = appears in all modes)  
- Sort order  
- CRUD operations  
Rendered on landing page using shadcn `Accordion` or `Card`.

---

# 5. Prisma Data Model

```prisma
model Registration {
  id                    String               @id @default(cuid())
  namaLengkap           String
  nim                   String               @unique
  programStudi          String
  jurusan               String
  pilihanPelatihan      TrainingType?
  noWa                  String
  buktiFollowPdfUrl     String               // single PDF file stored in Supabase Storage
  status                RegistrationStatus   @default(PENDING)
  createdAt             DateTime             @default(now())
  updatedAt             DateTime             @updatedAt
}

enum RegistrationStatus {
  PENDING
  VERIFY
  REJECT
}

enum TrainingType {
  SOFTWARE
  NETWORK
  MULTIMEDIA
}

model SiteConfig {
  id    Int      @id @default(1)
  mode  SiteMode @default(TRAINING_BASIC)
}

enum SiteMode {
  TRAINING_BASIC
  PCC_CLASS
}

model TeamMember {
  id        String   @id @default(cuid())
  name      String
  position  String
  avatarUrl String?
  order     Int       @default(0)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Sponsor {
  id        String   @id @default(cuid())
  name      String
  logoUrl   String?
  linkUrl   String?
  order     Int       @default(0)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model QnaItem {
  id        String   @id @default(cuid())
  question  String
  answer    String
  mode      SiteMode?
  order     Int       @default(0)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
