export type ServiceType =
  | "mainland"
  | "free-zone"
  | "offshore"
  | "pro-services"
  | "visa"
  | "golden-visa"
  | "other";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceInterest: ServiceType;
  message?: string;
  source: "website" | "whatsapp" | "referral" | "walk-in";
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  createdAt: Date;
}

export interface Application {
  id: string;
  leadId: string;
  serviceType: ServiceType;
  stage:
    | "draft"
    | "documents_pending"
    | "submitted"
    | "processing"
    | "approved"
    | "rejected";
  documents: Document[];
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  applicationId: string;
  name: string;
  type:
    | "passport"
    | "emirates_id"
    | "visa"
    | "noc"
    | "moa"
    | "bank_statement"
    | "other";
  fileUrl: string;
  verified: boolean;
  uploadedAt: Date;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  startingPrice?: number;
  currency: "AED";
}

export interface FreeZone {
  id: string;
  name: string;
  shortName: string;
  location: string;
  industry: string[];
  minCost: number;
  maxCost: number;
  officeRequired: boolean;
  visaQuota: number;
  foreignOwnership: number;
  highlights: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
