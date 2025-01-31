import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpRight, TrendingUp, AlertTriangle, XCircle } from 'lucide-react';
import { formatNumber } from '../lib/utils';
import { searchInfluencers } from '../services/api';
import type { Influencer } from '../types';
import { useStore } from '../store/useStore';

function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiKey } = useStore();

  useEffect(() => {
    const fetchInfluencers = async () => {
      if (!searchTerm.trim() || !apiKey) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const results = await searchInfluencers(searchTerm, apiKey);
        setInfluencers(results);
      } catch (err) {
        setError('Failed to fetch influencers. Please check your API key and try again.');
        console.error('Error fetching influencers:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchInfluencers, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, apiKey]);

  if (!apiKey) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Influencer Verification</h2>
        <p className="text-gray-600 mb-6">Please set up your Perplexity API key in the settings to get started.</p>
        <button
          onClick={() => navigate('/settings')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Go to Settings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Influencer Verification Dashboard</h1>
        <div className="mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search influencers..."
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing influencer data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!loading && !error && influencers.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-600">No influencers found. Try a different search term.</p>
        </div>
      )}

      <div className="grid gap-6 mb-8 md:grid-cols-3">
        {influencers.map((influencer) => (
          <div
            key={influencer.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/influencer/${influencer.id}`)}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={influencer.avatar}
                  alt={influencer.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{influencer.name}</h3>
                  <p className="text-sm text-gray-500">{influencer.handle}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Followers</p>
                  <p className="text-lg font-semibold">{formatNumber(influencer.followers)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trust Score</p>
                  <p className="text-lg font-semibold text-indigo-600">{influencer.trustScore}%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 rounded-lg p-2">
                  <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Verified</p>
                  <p className="font-semibold">{influencer.verifiedClaims}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Questionable</p>
                  <p className="font-semibold">{influencer.questionableClaims}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2">
                  <XCircle className="h-5 w-5 text-red-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Debunked</p>
                  <p className="font-semibold">{influencer.debunkedClaims}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center text-indigo-600 text-sm">
                View Details
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;