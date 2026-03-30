# Implementation Plan - SPMB SMK Online High School Enrollment System

## Goal Description
Build a comprehensive Next.js web application for an Online High School Enrollment System (SPMB). The system features a responsive UI with Tailwind CSS and shadcn/ui, distinct Student and Admin portals, and a seamless multi-step registration flow utilizing Client-Side OCR for Family Cards (Kartu Keluarga - KK) to securely extract required data locally.

## User Review Required
> [!IMPORTANT]
> **OCR Approach & Library**: We plan to use `tesseract.js` for client-side OCR. This ensures complete privacy because the physical image is processed directly in the user's browser and **not** uploaded to any external server. Please note that client-side OCR precision can vary depending on camera quality and lighting. Does this align with your expectations, or do you have a specific fast/preferred OCR API (e.g., Google Cloud Vision, which would require sending images to a backend momentarily) you would prefer using?
> 
> **Automated Ranking**: The prompt mentions "Automated ranking". How exactly should the ranking formula be calculated for the Admin portal? (e.g., purely based on submission timestamp, or incorporating specific extracted external academic scores?) For now, we set the schema to allow ranking by submission time (FIFO).

## Proposed Architecture & Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + shadcn/ui + Framer Motion (for dynamic, premium animations on multi-step forms)
- **Database + Auth:** Supabase (PostgreSQL, Supabase Auth via Email/Password)
- **State & Form Validation:** `react-hook-form` + `zod`
- **OCR:** `tesseract.js` (client-side initialization)
- **PDF Generation:** `html2canvas` + `jspdf`

## Proposed Changes

### 1. Database Schema Setup (Supabase)
We will establish three primary tables:
- `profiles`: Tied to Supabase `auth.users`, storing `id`, `role` (student/admin), `full_name`, `avatar_url`.
- `registrations`: `id`, `profile_id`, `nisn`, `origin_school`, `kk_number`, `nik`, `birthplace`, `birthdate`, `religion`, `father_name`, `father_nik`, `father_job`, `father_education`, `mother_name`, `mother_nik`, `mother_job`, `mother_education`, `status` (pending/verified/rejected), `created_at`.
- `announcements`: `id`, `title`, `content`, `published_at`.

### 2. Next.js Project Foundation
Initialize the environment using `npx create-next-app@latest`, configure absolute paths, and wrap the app in high-quality design variables (vibrant accents and clean layout). 
Set up Supabase SSR auth utility files (`createClient` for Next.js).

### 3. Application Routing Structure
- `/` (Landing Page): Hero section, info, "Enroll Now" CTA.
- `/auth/login`, `/auth/register`: Authentication flow.
- `/dashboard` (Student Portal Dashboard): Show current registration status, generated ID/PDF card download button.
- `/enroll` (Multi-step Wizard Form):
  - **Step 1**: Basic Info (Name, NISN, Origin School).
  - **Step 2**: Scanning UI (Camera Access using `react-webcam` with a CSS overlay mask to guide the user to fit their KK).
  - **Step 3**: OCR Loading Overlay while `Tesseract.js` runs data extraction parsing text blocks.
  - **Step 4**: Preview & Edit Mode (Zod verified form auto-filled with OCR data).
  - **Step 5**: Success confirmation & db push.
- `/admin` (Admin Dashboard): Protected route viewing aggregate stats, approving documents, and managing announcements/rankings.

### 4. Implementation Workflow & UI Details
1. **Premium Aesthetic Base**: We will build visually appealing UI applying smooth gradients, interactive hover states, and standard modern typographic sizing (Inter or Geist).
2. **Robust Form Handling**: Strict `zod` schema to ensure invalid OCR captures (like a string where a Date should be) are flagged locally before the Supabase insert call.

## Verification Plan

### Automated Tests
- Validate Form schemas ensuring complete robust checking of mandatory fields prior to DB insertion.

### Manual Verification
- Walk through the auth flow as a student and complete the multi-step registration flow.
- Utilize webcam input against a sample image or piece of paper representing a Kartu Keluarga to verify OCR processing & parsing regex accurately outputs expected structured fields into the UI form block.
- Login as Admin, approve the registration document, and visually verify the updated status on the Student portal alongside the functional PDF generation.
