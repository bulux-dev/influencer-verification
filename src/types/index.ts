export type VerificationStatus = 'verified' | 'questionable' | 'debunked';
export type ClaimCategory = 'nutrition' | 'medicine' | 'mental_health' | 'fitness' | 'other';

export interface Claim {
  id: string;
  content: string;
  category: ClaimCategory;
  status: VerificationStatus;
  confidenceScore: number;
  source: string;
  date: string;
}

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers: number;
  trustScore: number;
  claims: Claim[];
  totalClaims: number;
  verifiedClaims: number;
  questionableClaims: number;
  debunkedClaims: number;
}