export type Role = "patient" | "provider" | "admin" | "emergency";

export interface Patient {
  address: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  blood: string;
  didURI: string;
  registered: boolean;
  registeredAt: string;
  allergies: string[];
  emergencyContact: string;
}

export interface Provider {
  address: string;
  name: string;
  didURI: string;
  registered: boolean;
  verified: boolean;
  isERQualified: boolean;
  specialty: string;
  licenseNo: string;
  hospital: string;
  verifiedAt?: string;
}

export interface Consent {
  id: string;
  patientAddress: string;
  providerAddress: string;
  providerName: string;
  purpose: string;
  grantedAt: string;
  expiresAt: string;
  active: boolean;
}

export interface RecordAnchor {
  id: string;
  patientAddress: string;
  title: string;
  recordHash: string;
  pointer: string;
  anchoredBy: string;
  anchoredAt: string;
  tombstoned: boolean;
  category: "Lab" | "Imaging" | "Prescription" | "Diagnosis" | "Immunization";
}

export interface EmergencySession {
  patientAddress: string;
  patientName: string;
  doctor: string;
  doctorName: string;
  justification: string;
  triggeredAt: string;
  validUntil: string;
  active: boolean;
  ttlSeconds: number;
}

export interface AuditEvent {
  id: string;
  type:
    | "PatientRegistered"
    | "ProviderRegistered"
    | "ProviderVerified"
    | "ConsentGranted"
    | "ConsentRevoked"
    | "RecordAnchored"
    | "RecordTombstoned"
    | "RecordAccessed"
    | "EmergencyAccessTriggered";
  actor: string;
  actorName: string;
  target: string;
  details: string;
  txHash: string;
  block: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Demo data — replace with real contract / API reads during integration.
// ---------------------------------------------------------------------------

export const currentPatient: Patient = {
  address: "0x7B5f...9C4a",
  name: "Sarah Martinez",
  age: 29,
  gender: "Female",
  blood: "O+",
  didURI: "did:ethr:0x7B5f09abC23DeF4865aA1Bc2d3E4f5G6h7J8k9C4a",
  registered: true,
  registeredAt: "2024-11-12T09:30:00Z",
  allergies: ["Penicillin", "Peanuts"],
  emergencyContact: "+1 555-0198",
};

export const providers: Provider[] = [
  {
    address: "0x3A8f...1D2e",
    name: "Dr. James Carter",
    didURI: "did:ethr:0x3A8fB2cD4E5f6A7b8C9d0E1f2A3b4C5d6E7f1D2e",
    registered: true,
    verified: true,
    isERQualified: false,
    specialty: "Cardiology",
    licenseNo: "LIC-4412-B",
    hospital: "St. Mary's General",
    verifiedAt: "2024-12-03T10:00:00Z",
  },
  {
    address: "0x9D2e...7F0c",
    name: "Dr. Priya Sharma",
    didURI: "did:ethr:0x9D2eF8cA9B0c1D2e3F4a5B6c7D8e9F0a1B2c7F0c",
    registered: true,
    verified: true,
    isERQualified: false,
    specialty: "Internal Medicine",
    licenseNo: "LIC-8876-D",
    hospital: "Lakeside Health Center",
    verifiedAt: "2024-12-18T14:20:00Z",
  },
  {
    address: "0xF1cA...4B6d",
    name: "Dr. Marcus Webb",
    didURI: "did:ethr:0xF1cAdD0E1f2A3b4C5d6E7f8A9b0C1d2E3f4A4B6d",
    registered: true,
    verified: true,
    isERQualified: true,
    specialty: "Emergency Medicine",
    licenseNo: "LIC-2203-E",
    hospital: "Riverside Medical ER",
    verifiedAt: "2025-01-06T08:45:00Z",
  },
  {
    address: "0x2B7c...8E0a",
    name: "Dr. Lena Fischer",
    didURI: "did:ethr:0x2B7cE5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C8E0a",
    registered: true,
    verified: false,
    isERQualified: false,
    specialty: "Dermatology",
    licenseNo: "LIC-9931-F",
    hospital: "Sunset Clinic",
  },
];

export const consents: Consent[] = [
  {
    id: "c1",
    patientAddress: "0x7B5f...9C4a",
    providerAddress: "0x3A8f...1D2e",
    providerName: "Dr. James Carter",
    purpose: "Cardiology checkup and follow-up consultations",
    grantedAt: "2025-08-02T11:00:00Z",
    expiresAt: "2026-02-02T00:00:00Z",
    active: true,
  },
  {
    id: "c2",
    patientAddress: "0x7B5f...9C4a",
    providerAddress: "0x9D2e...7F0c",
    providerName: "Dr. Priya Sharma",
    purpose: "Routine annual physical examination",
    grantedAt: "2026-01-15T10:30:00Z",
    expiresAt: "2026-04-15T00:00:00Z",
    active: true,
  },
  {
    id: "c3",
    patientAddress: "0x7B5f...9C4a",
    providerAddress: "0xA4E8...3C1b",
    providerName: "Dr. David Nguyen",
    purpose: "Physical therapy for knee injury",
    grantedAt: "2025-05-10T09:00:00Z",
    expiresAt: "2025-08-10T00:00:00Z",
    active: false,
  },
];

export const records: RecordAnchor[] = [
  {
    id: "r1",
    patientAddress: "0x7B5f...9C4a",
    title: "Complete Blood Count (CBC) — Lab Report",
    recordHash: "0x6a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
    pointer: "ipfs://QmX7yZ...records/cbc-march-2026.json",
    anchoredBy: "Dr. Priya Sharma",
    anchoredAt: "2026-03-04T13:15:00Z",
    tombstoned: false,
    category: "Lab",
  },
  {
    id: "r2",
    patientAddress: "0x7B5f...9C4a",
    title: "Chest X-Ray — Anteroposterior View",
    recordHash: "0x9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8",
    pointer: "ipfs://QmAbCd...radiology/chest-xray.json",
    anchoredBy: "Sarah Martinez",
    anchoredAt: "2026-02-21T16:40:00Z",
    tombstoned: false,
    category: "Imaging",
  },
  {
    id: "r3",
    patientAddress: "0x7B5f...9C4a",
    title: "Beta-Blocker Prescription — 2025",
    recordHash: "0x3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5",
    pointer: "ipfs://QmZi9X...prescriptions/beta-blocker.json",
    anchoredBy: "Dr. James Carter",
    anchoredAt: "2025-08-05T09:55:00Z",
    tombstoned: false,
    category: "Prescription",
  },
  {
    id: "r4",
    patientAddress: "0x7B5f...9C4a",
    title: "Old Allergy Panel — Superseded",
    recordHash: "0x0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    pointer: "ipfs://QmOldX...superseded/allergy-panel-old.json",
    anchoredBy: "Dr. David Nguyen",
    anchoredAt: "2025-03-14T12:00:00Z",
    tombstoned: true,
    category: "Diagnosis",
  },
];

export const emergencySessions: EmergencySession[] = [
  {
    patientAddress: "0x7B5f...9C4a",
    patientName: "Sarah Martinez",
    doctor: "0xF1cA...4B6d",
    doctorName: "Dr. Marcus Webb",
    justification:
      "Unconscious patient admitted to ER following a motor vehicle accident. Critical vitals require immediate lab access.",
    triggeredAt: "2026-08-28T22:10:00Z",
    validUntil: "2026-08-28T23:10:00Z",
    active: true,
    ttlSeconds: 42,
  },
];

// History of a past (expired) emergency session for the trailing audit
export const pastEmergency: EmergencySession[] = [
  {
    patientAddress: "0x5C9e...2A7f",
    patientName: "Michael Chen",
    doctor: "0xF1cA...4B6d",
    doctorName: "Dr. Marcus Webb",
    justification: "Chest pain with suspected myocardial infarction. ECG unavailable.",
    triggeredAt: "2026-06-11T05:30:00Z",
    validUntil: "2026-06-11T06:30:00Z",
    active: false,
    ttlSeconds: 0,
  },
];

export const auditLogs: AuditEvent[] = [
  {
    id: "e1",
    type: "EmergencyAccessTriggered",
    actor: "0xF1cA...4B6d",
    actorName: "Dr. Marcus Webb",
    target: "0x7B5f...9C4a",
    details: "Break-glass access for motor vehicle accident patient. Duration: 3600s.",
    txHash: "0x8f1c2e...a9b3",
    block: "12,451,339",
    timestamp: "2026-08-28T22:10:00Z",
  },
  {
    id: "e2",
    type: "RecordAccessed",
    actor: "0x3A8f...1D2e",
    actorName: "Dr. James Carter",
    target: "0x7B5f...9C4a",
    details: "Accessed record r3 under consent 'Cardiology checkup'.",
    txHash: "0x1d4a9b...7c2e",
    block: "12,450,981",
    timestamp: "2026-08-27T15:22:00Z",
  },
  {
    id: "e3",
    type: "RecordAnchored",
    actor: "0x9D2e...7F0c",
    actorName: "Dr. Priya Sharma",
    target: "0x7B5f...9C4a",
    details: "Anchored record r1 'CBC Lab Report'. Pointer: ipfs://QmX7yZ...",
    txHash: "0x5c9d3e...1b8f",
    block: "12,450,102",
    timestamp: "2026-03-04T13:15:00Z",
  },
  {
    id: "e4",
    type: "ConsentGranted",
    actor: "0x7B5f...9C4a",
    actorName: "Sarah Martinez",
    target: "0x9D2e...7F0c",
    details: "Consent granted to Dr. Priya Sharma — 'Routine annual physical examination'.",
    txHash: "0x2e6f1a...9d4c",
    block: "12,441,220",
    timestamp: "2026-01-15T10:30:00Z",
  },
  {
    id: "e5",
    type: "ProviderVerified",
    actor: "0x88Aa...6C2f",
    actorName: "Regulator",
    target: "0x9D2e...7F0c",
    details: "Provider Dr. Priya Sharma marked verified (not ER qualified).",
    txHash: "0x7b3d8c...4a9e",
    block: "12,435,780",
    timestamp: "2024-12-18T14:20:00Z",
  },
  {
    id: "e6",
    type: "ConsentRevoked",
    actor: "0x7B5f...9C4a",
    actorName: "Sarah Martinez",
    target: "0xA4E8...3C1b",
    details: "Consent revoked from Dr. David Nguyen — therapy course completed.",
    txHash: "0x4c8e2a...6f1b",
    block: "12,428,004",
    timestamp: "2025-08-11T09:05:00Z",
  },
  {
    id: "e7",
    type: "RecordTombstoned",
    actor: "0x88Aa...6C2f",
    actorName: "Regulator",
    target: "0x7B5f...9C4a",
    details: "Record r4 'Old Allergy Panel' tombstoned as superseded.",
    txHash: "0x9a1f4d...3b7c",
    block: "12,410,650",
    timestamp: "2025-06-19T11:45:00Z",
  },
];

export const registrarPatients: Patient[] = [
  {
    address: "0x7B5f...9C4a",
    name: "Sarah Martinez",
    age: 29,
    gender: "Female",
    blood: "O+",
    didURI: "did:ethr:0x7B5f09abC...9C4a",
    registered: true,
    registeredAt: "2024-11-12T09:30:00Z",
    allergies: ["Penicillin", "Peanuts"],
    emergencyContact: "+1 555-0198",
  },
  {
    address: "0x5C9e...2A7f",
    name: "Michael Chen",
    age: 41,
    gender: "Male",
    blood: "A-",
    didURI: "did:ethr:0x5C9eF8a9...2A7f",
    registered: true,
    registeredAt: "2025-02-07T14:00:00Z",
    allergies: ["Sulfa drugs"],
    emergencyContact: "+1 555-0142",
  },
];