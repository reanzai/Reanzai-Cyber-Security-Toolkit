import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function HashGenerator() {
  const [text, setText] = useState('');
  const [algorithm, setAlgorithm] = useState('md5');
  const [hashResult, setHashResult] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const algorithms = [
    { value: 'md5', label: 'MD5' },
    { value: 'sha1', label: 'SHA-1' },
    { value: 'sha256', label: 'SHA-256' },
    { value: 'sha512', label: 'SHA-512' }
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setHashResult('');
    setError('');

    try {
      const response = await fetch('/api/hash-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, algorithm }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred during hash generation');
      }
      
      setHashResult(data.hash);
    } catch (error) {
      console.error('Hash generation error:', error);
      setError(error.message || 'Failed to generate hash. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hashResult)
      .then(() => {
        alert('Hash copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Head>
        <title>Hash Generator - Cyber Security Toolkit</title>
      </Head>

      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-green-500">Cyber</span>Security Toolkit
          </h1>
          <Link href="/" className="text-gray-400 hover:text-green-500 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Hash Generator</h2>
            <p className="text-gray-400">Generate cryptographic hashes from text using various algorithms</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-2">
                  Text to Hash
                </label>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to generate hash"
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 min-h-[120px]"
                  required
                />
              </div>

              <div>
                <label htmlFor="algorithm" className="block text-sm font-medium text-gray-300 mb-2">
                  Hash Algorithm
                </label>
                <select
                  id="algorithm"
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-green-500"
                >
                  {algorithms.map((algo) => (
                    <option key={algo.value} value={algo.value}>
                      {algo.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-500 transition-colors duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed font-medium"
              >
                {generating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Hash'
                )}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-8 text-red-400">
              <p>{error}</p>
            </div>
          )}

          {hashResult && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Hash Result</h2>
                <button
                  onClick={copyToClipboard}
                  className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition-colors"
                >
                  Copy
                </button>
              </div>
              <div className="bg-gray-900 p-4 rounded-md border border-gray-700 font-mono text-sm break-all">
                {hashResult}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Algorithm: {algorithms.find(a => a.value === algorithm)?.label}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-auto py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 mb-4 md:mb-0">
              © 2024 Cyber Security Toolkit. All rights reserved.
            </div>
            <div className="text-gray-500">
              Developed by <span className="text-green-500 font-medium">Reanzai</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 