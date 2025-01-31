import axios from 'axios';
import type { Influencer, Claim, VerificationStatus, ClaimCategory } from '../types';

const PERPLEXITY_API_BASE_URL = 'https://api.perplexity.ai';

const getAxiosInstance = (apiKey: string) => {
  return axios.create({
    baseURL: PERPLEXITY_API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
};

export const analyzeClaims = async (content: string, apiKey: string): Promise<Claim[]> => {
  const api = getAxiosInstance(apiKey);
  
  try {
    const response = await api.post('/analyze', {
      text: content,
      analysis_type: 'health_claims',
    });

    return response.data.claims.map((claim: any) => ({
      id: claim.id,
      content: claim.text,
      category: mapCategory(claim.category),
      status: mapVerificationStatus(claim.verification_status),
      confidenceScore: claim.confidence_score,
      source: claim.source || 'Not specified',
      date: new Date().toISOString().split('T')[0],
    }));
  } catch (error) {
    console.error('Error analyzing claims:', error);
    throw error;
  }
};

export const getInfluencerData = async (handle: string, apiKey: string): Promise<Influencer> => {
  const api = getAxiosInstance(apiKey);
  
  try {
    const response = await api.get(`/influencer/${handle}`);
    const data = response.data;
    
    const claims = await analyzeClaims(data.content, apiKey);
    const claimStats = calculateClaimStats(claims);
    
    return {
      id: data.id,
      name: data.name,
      handle: data.handle,
      avatar: data.avatar_url,
      followers: data.followers_count,
      trustScore: calculateTrustScore(claims),
      claims,
      ...claimStats,
    };
  } catch (error) {
    console.error('Error fetching influencer data:', error);
    throw error;
  }
};

export const searchInfluencers = async (query: string, apiKey: string): Promise<Influencer[]> => {
  const api = getAxiosInstance(apiKey);
  
  try {
    const response = await api.get('/search', {
      params: { q: query, type: 'health_influencer' }
    });
    
    return await Promise.all(
      response.data.results.map(async (result: any) => {
        return await getInfluencerData(result.handle, apiKey);
      })
    );
  } catch (error) {
    console.error('Error searching influencers:', error);
    throw error;
  }
};

// Helper functions
const mapCategory = (category: string): ClaimCategory => {
  const categoryMap: Record<string, ClaimCategory> = {
    'NUTRITION': 'nutrition',
    'MEDICINE': 'medicine',
    'MENTAL_HEALTH': 'mental_health',
    'FITNESS': 'fitness',
  };
  return categoryMap[category.toUpperCase()] || 'other';
};

const mapVerificationStatus = (status: string): VerificationStatus => {
  const statusMap: Record<string, VerificationStatus> = {
    'VERIFIED': 'verified',
    'QUESTIONABLE': 'questionable',
    'DEBUNKED': 'debunked',
  };
  return statusMap[status.toUpperCase()] || 'questionable';
};

const calculateTrustScore = (claims: Claim[]): number => {
  if (claims.length === 0) return 0;
  
  const weights = {
    verified: 1,
    questionable: 0.5,
    debunked: 0,
  };
  
  const totalScore = claims.reduce((acc, claim) => {
    return acc + (weights[claim.status] * claim.confidenceScore);
  }, 0);
  
  return Math.round((totalScore / (claims.length * 100)) * 100);
};

const calculateClaimStats = (claims: Claim[]) => {
  return {
    totalClaims: claims.length,
    verifiedClaims: claims.filter(c => c.status === 'verified').length,
    questionableClaims: claims.filter(c => c.status === 'questionable').length,
    debunkedClaims: claims.filter(c => c.status === 'debunked').length,
  };
};