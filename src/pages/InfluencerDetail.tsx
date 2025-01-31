import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, AlertTriangle, XCircle } from 'lucide-react';
import type { Influencer, VerificationStatus } from '../types';
import { getInfluencerData } from '../services/api';
import { useStore } from '../store/useStore';

function InfluencerDetail() {
  const { id } = useParams();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiKey } = useStore();

  useEffect(() => {
    const fetchInfluencerData = async () => {
      if (!id || !apiKey) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getInfluencerData(id, apiKey);
        setInfluencer(data);
      } catch (err) {
        setError('Failed to fetch influencer details. Please try again.');
        console.error('Error fetching influencer details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencerData();
  }, [id, apiKey]);

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'questionable':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'debunked':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return 'bg-green-50 text-green-700';
      case 'questionable':
        return 'bg-yellow-50 text-yellow-700';
      case 'debunked':
        return 'bg-red-50 text-red-700';
    }
  };

  if (!apiKey) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">API Key Required</h2>
        <p className="text-gray-600 mb-6">Please set up your Perplexity API key in the settings to view influencer details.</p>
        <Link
          to="/settings"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Go to Settings
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading influencer data...</p>
      </div>
    );
  }

  if (error || !influencer) {
    return (
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center text-indigo-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || 'Influencer not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Link to="/" className="inline-flex items-center text-indigo-600 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center mb-6">
          <img
            src={influencer.avatar}
            alt={influencer.name}
            className="w-16 h-16 rounded-full"
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">{influencer.name}</h1>
            <p className="text-gray-500">{influencer.handle}</p>
          </div>
          <div className="ml-auto">
            <div className="text-right">
              <p className="text-sm text-gray-500">Trust Score</p>
              <p className="text-3xl font-bold text-indigo-600">{influencer.trustScore}%</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Claims</h2>
          <div className="space-y-4">
            {influencer.claims.map((claim) => (
              <div
                key={claim.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-2">{claim.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="capitalize">{claim.category}</span>
                      <span>•</span>
                      <span>{claim.date}</span>
                      <span>•</span>
                      <span>{claim.source}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(claim.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(claim.status)}
                        <span className="capitalize">{claim.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Confidence</p>
                      <p className="font-semibold">{claim.confidenceScore}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfluencerDetail;