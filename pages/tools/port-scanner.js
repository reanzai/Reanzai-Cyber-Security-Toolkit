import { useState } from 'react';
import Layout from '../../components/Layout';

export default function PortScanner() {
  const [host, setHost] = useState('');
  const [portRange, setPortRange] = useState('1-1000');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const [shodanApiKey, setShodanApiKey] = useState('');
  const [shodanData, setShodanData] = useState(null);
  const [loadingShodan, setLoadingShodan] = useState(false);
  const [shodanError, setShodanError] = useState('');
  const [showApiSettings, setShowApiSettings] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    setScanning(true);
    setResults([]);
    setSummary(null);
    setError('');

    try {
      const response = await fetch('/api/port-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ host, portRange }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred during scanning');
      }
      
      setResults(data.results);
      setSummary(data.summary);
      
      // Add to scan history
      const newScan = {
        id: Date.now(),
        host,
        portRange,
        timestamp: new Date().toISOString(),
        openPorts: data.summary.openPorts
      };
      
      setScanHistory(prev => [newScan, ...prev].slice(0, 5));
    } catch (error) {
      console.error('Scanning error:', error);
      setError(error.message || 'Failed to complete the scan. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const handleShodanLookup = async () => {
    if (!shodanApiKey) {
      setShodanError('Shodan API key is required');
      return;
    }

    if (!host) {
      setShodanError('Host is required for Shodan lookup');
      return;
    }

    setLoadingShodan(true);
    setShodanData(null);
    setShodanError('');

    try {
      const response = await fetch('/api/shodan-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          host, 
          apiKey: shodanApiKey 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred during Shodan lookup');
      }
      
      setShodanData(data);
    } catch (error) {
      console.error('Shodan lookup error:', error);
      setShodanError(error.message || 'Failed to complete the Shodan lookup. Please check your API key and try again.');
    } finally {
      setLoadingShodan(false);
    }
  };

  return (
    <Layout title="Port Scanner" description="Scan for open ports on a target host or IP address">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Port Scanner</h1>
          <p className="text-gray-400">Scan for open ports on a target host or IP address</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
              <form onSubmit={handleScan} className="space-y-6">
                <div>
                  <label htmlFor="host" className="block text-sm font-medium text-gray-300 mb-2">
                    Target Host
                  </label>
                  <input
                    type="text"
                    id="host"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    placeholder="Enter hostname or IP (e.g., localhost)"
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter a hostname or IP address to scan</p>
                </div>

                <div>
                  <label htmlFor="portRange" className="block text-sm font-medium text-gray-300 mb-2">
                    Port Range
                  </label>
                  <input
                    type="text"
                    id="portRange"
                    value={portRange}
                    onChange={(e) => setPortRange(e.target.value)}
                    placeholder="Enter port range (e.g., 1-1000)"
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Format: start-end (e.g., 1-1000 or 1-65535 for all ports)</p>
                </div>

                <button
                  type="submit"
                  disabled={scanning}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-500 transition-colors duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed font-medium"
                >
                  {scanning ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scanning...
                    </span>
                  ) : (
                    'Start Scan'
                  )}
                </button>
              </form>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-8 text-red-400">
                <p>{error}</p>
              </div>
            )}

            {summary?.warning && (
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-8 text-yellow-400">
                <p>{summary.warning}</p>
              </div>
            )}

            {summary && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-white">Scan Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-900/50 rounded-md p-4 border border-gray-700">
                    <div className="text-sm text-gray-400">Total Ports</div>
                    <div className="text-2xl font-bold text-white">{summary.totalScanned}</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-md p-4 border border-green-900/30">
                    <div className="text-sm text-gray-400">Open Ports</div>
                    <div className="text-2xl font-bold text-green-500">{summary.openPorts}</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-md p-4 border border-red-900/30">
                    <div className="text-sm text-gray-400">Closed Ports</div>
                    <div className="text-2xl font-bold text-red-400">{summary.closedPorts}</div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  Scan completed at: {new Date(summary.scanTime).toLocaleString()}
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">Scan Results</h2>
                  <div className="text-sm text-gray-400">
                    {results.filter(r => r.status === 'open').length} open of {results.length} ports
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {results.filter(r => r.status === 'open').map((result, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-md border bg-green-900/20 border-green-700 text-green-400"
                    >
                      <div className="font-medium">Port {result.port}</div>
                      <div className="text-sm">OPEN</div>
                    </div>
                  ))}
                </div>
                {results.filter(r => r.status === 'open').length === 0 && (
                  <div className="text-gray-400 text-center py-4">
                    No open ports found in the specified range.
                  </div>
                )}
              </div>
            )}

            {/* Shodan Integration */}
            <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Shodan Integration</h2>
                <button
                  onClick={() => setShowApiSettings(!showApiSettings)}
                  className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition-colors"
                >
                  {showApiSettings ? 'Hide Settings' : 'Show Settings'}
                </button>
              </div>

              {showApiSettings && (
                <div className="mb-6 p-4 bg-gray-900/50 rounded-md border border-gray-700">
                  <div className="mb-4">
                    <label htmlFor="shodanApiKey" className="block text-sm font-medium text-gray-300 mb-2">
                      Shodan API Key
                    </label>
                    <input
                      type="text"
                      id="shodanApiKey"
                      value={shodanApiKey}
                      onChange={(e) => setShodanApiKey(e.target.value)}
                      placeholder="Enter your Shodan API key"
                      className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Get your API key from <a href="https://account.shodan.io/" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">Shodan.io</a>
                    </p>
                  </div>
                </div>
              )}

              <p className="text-gray-400 mb-4">
                Shodan is a search engine for Internet-connected devices. Use it to get additional information about the target host.
              </p>

              <button
                onClick={handleShodanLookup}
                disabled={loadingShodan || !host || !shodanApiKey}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-500 transition-colors duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed font-medium"
              >
                {loadingShodan ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Querying Shodan...
                  </span>
                ) : (
                  'Lookup on Shodan'
                )}
              </button>

              {shodanError && (
                <div className="mt-4 bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-400">
                  <p>{shodanError}</p>
                </div>
              )}

              {shodanData && (
                <div className="mt-6 space-y-4">
                  <div className="bg-gray-900/70 rounded-md p-4 border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-2">Host Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400">IP Address</div>
                        <div className="font-medium text-white">{shodanData.ip_str}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Country</div>
                        <div className="font-medium text-white">{shodanData.country_name || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Organization</div>
                        <div className="font-medium text-white">{shodanData.org || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">ISP</div>
                        <div className="font-medium text-white">{shodanData.isp || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  {shodanData.ports && shodanData.ports.length > 0 && (
                    <div className="bg-gray-900/70 rounded-md p-4 border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-2">Open Ports (Shodan)</h3>
                      <div className="flex flex-wrap gap-2">
                        {shodanData.ports.map((port) => (
                          <span key={port} className="px-2 py-1 bg-green-900/30 text-green-400 rounded border border-green-800">
                            {port}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {shodanData.vulns && shodanData.vulns.length > 0 && (
                    <div className="bg-gray-900/70 rounded-md p-4 border border-red-700">
                      <h3 className="text-lg font-medium text-white mb-2">Vulnerabilities</h3>
                      <div className="space-y-2">
                        {shodanData.vulns.map((vuln) => (
                          <div key={vuln} className="px-3 py-2 bg-red-900/30 text-red-400 rounded border border-red-800">
                            <a 
                              href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${vuln}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {vuln}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 text-white">Scan History</h2>
              {scanHistory.length > 0 ? (
                <div className="space-y-4">
                  {scanHistory.map((scan) => (
                    <div key={scan.id} className="bg-gray-900/50 p-3 rounded-md border border-gray-700">
                      <div className="font-medium text-white">{scan.host}</div>
                      <div className="text-sm text-gray-400">Ports: {scan.portRange}</div>
                      <div className="flex justify-between items-center mt-2 text-xs">
                        <div className="text-gray-500">{new Date(scan.timestamp).toLocaleString()}</div>
                        <div className="text-green-500">{scan.openPorts} open</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-4">
                  No scan history yet.
                </div>
              )}
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Common Ports</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">21</span>
                  <span className="text-white">FTP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">22</span>
                  <span className="text-white">SSH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">23</span>
                  <span className="text-white">Telnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">25</span>
                  <span className="text-white">SMTP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">53</span>
                  <span className="text-white">DNS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">80</span>
                  <span className="text-white">HTTP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">443</span>
                  <span className="text-white">HTTPS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">3306</span>
                  <span className="text-white">MySQL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">3389</span>
                  <span className="text-white">RDP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 