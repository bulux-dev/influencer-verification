import React from 'react';
import { useStore } from '../store/useStore';

function Settings() {
  const { apiKey, setApiKey, claimsLimit, setClaimsLimit } = useStore();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Research Configuration</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
            Perplexity API Key
          </label>
          <input
            type="password"
            id="apiKey"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
          />
          <p className="mt-1 text-sm text-gray-500">
            Required for analyzing influencer content and verifying claims
          </p>
        </div>

        <div>
          <label htmlFor="claimsLimit" className="block text-sm font-medium text-gray-700 mb-2">
            Claims Analysis Limit
          </label>
          <input
            type="number"
            id="claimsLimit"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={claimsLimit}
            onChange={(e) => setClaimsLimit(parseInt(e.target.value))}
            min="1"
            max="1000"
          />
          <p className="mt-1 text-sm text-gray-500">
            Maximum number of claims to analyze per influencer
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Trusted Sources</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pubmed"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="pubmed" className="ml-2 text-sm text-gray-700">
                PubMed Central
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="cochrane"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="cochrane" className="ml-2 text-sm text-gray-700">
                Cochrane Library
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="who"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="who" className="ml-2 text-sm text-gray-700">
                WHO Guidelines
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;