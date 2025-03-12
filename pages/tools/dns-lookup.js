import { useState } from 'react';
import Layout from '../../components/Layout';

export default function DnsLookup() {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lookupHistory, setLookupHistory] = useState([]);

  const recordTypes = [
    { value: 'A', label: 'A (IPv4 Address)' },
    { value: 'AAAA', label: 'AAAA (IPv6 Address)' },
    { value: 'CNAME', label: 'CNAME (Canonical Name)' },
    { value: 'MX', label: 'MX (Mail Exchange)' },
    { value: 'NS', label: 'NS (Name Server)' },
    { value: 'TXT', label: 'TXT (Text)' },
    { value: 'SOA', label: 'SOA (Start of Authority)' },
    { value: 'ALL', label: 'ALL (All Records)' }
  ];

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    setError('');

    try {
      const response = await fetch('/api/dns-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain, recordType }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred during DNS lookup');
      }
      
      setResults(data);
      
      // Add to lookup history
      const newLookup = {
        id: Date.now(),
        domain,
        recordType,
        timestamp: new Date().toISOString(),
        recordCount: data.records?.length || 0
      };
      
      setLookupHistory(prev => [newLookup, ...prev].slice(0, 5));
    } catch (error) {
      console.error('DNS lookup error:', error);
      setError(error.message || 'Failed to complete the DNS lookup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="DNS Lookup" description="Perform DNS lookups and analyze records">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">DNS Lookup</h1>
          <p className="text-gray-400">Perform DNS lookups and analyze records for any domain</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
              <form onSubmit={handleLookup} className="space-y-6">
                <div>
                  <label htmlFor="domain" className="block text-sm font-medium text-gray-300 mb-2">
                    Domain Name
                  </label>
                  <input
                    type="text"
                    id="domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="Enter domain name (e.g., example.com)"
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter a domain name without http:// or https://</p>
                </div>

                <div>
                  <label htmlFor="recordType" className="block text-sm font-medium text-gray-300 mb-2">
                    Record Type
                  </label>
                  <select
                    id="recordType"
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-green-500"
                  >
                    {recordTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-500 transition-colors duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Looking up...
                    </span>
                  ) : (
                    'Lookup DNS'
                  )}
                </button>
              </form>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-8 text-red-400">
                <p>{error}</p>
              </div>
            )}

            {results && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">DNS Records for {results.domain}</h2>
                  <div className="text-sm text-gray-400">
                    {results.records?.length || 0} records found
                  </div>
                </div>

                {results.records && results.records.length > 0 ? (
                  <div className="space-y-4">
                    {results.records.map((record, index) => (
                      <div key={index} className="bg-gray-900/70 rounded-md p-4 border border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-green-500">{record.type}</div>
                          <div className="text-xs text-gray-500">TTL: {record.ttl || 'N/A'}</div>
                        </div>
                        <div className="font-mono text-sm break-all text-white">
                          {record.value || record.data || JSON.stringify(record)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No DNS records found for this domain and record type.
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  Lookup performed at: {new Date(results.timestamp).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 text-white">Lookup History</h2>
              {lookupHistory.length > 0 ? (
                <div className="space-y-4">
                  {lookupHistory.map((lookup) => (
                    <div key={lookup.id} className="bg-gray-900/50 p-3 rounded-md border border-gray-700">
                      <div className="font-medium text-white">{lookup.domain}</div>
                      <div className="text-sm text-gray-400">Type: {lookup.recordType}</div>
                      <div className="flex justify-between items-center mt-2 text-xs">
                        <div className="text-gray-500">{new Date(lookup.timestamp).toLocaleString()}</div>
                        <div className="text-green-500">{lookup.recordCount} records</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-4">
                  No lookup history yet.
                </div>
              )}
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">DNS Record Types</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium text-white">A Record</div>
                  <div className="text-gray-400">Maps a domain to an IPv4 address</div>
                </div>
                <div>
                  <div className="font-medium text-white">AAAA Record</div>
                  <div className="text-gray-400">Maps a domain to an IPv6 address</div>
                </div>
                <div>
                  <div className="font-medium text-white">CNAME Record</div>
                  <div className="text-gray-400">Creates an alias for another domain</div>
                </div>
                <div>
                  <div className="font-medium text-white">MX Record</div>
                  <div className="text-gray-400">Specifies mail servers for the domain</div>
                </div>
                <div>
                  <div className="font-medium text-white">TXT Record</div>
                  <div className="text-gray-400">Stores text information (SPF, DKIM, etc.)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 