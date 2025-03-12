import { useState } from 'react';
import Layout from '../../components/Layout';

export default function EncryptionTool() {
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [algorithm, setAlgorithm] = useState('aes-256-cbc');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const algorithms = [
    { value: 'aes-256-cbc', label: 'AES-256-CBC' },
    { value: 'aes-192-cbc', label: 'AES-192-CBC' },
    { value: 'aes-128-cbc', label: 'AES-128-CBC' },
    { value: 'des-ede3-cbc', label: 'Triple DES' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setResult('');
    setError('');

    try {
      const response = await fetch('/api/encrypt-decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          password, 
          mode, 
          algorithm 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred during processing');
      }
      
      setResult(data.result);
    } catch (error) {
      console.error('Processing error:', error);
      setError(error.message || 'Failed to process. Please check your inputs and try again.');
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <Layout title="Encryption Tool" description="Encrypt and decrypt text securely using various algorithms">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Encryption Tool</h1>
          <p className="text-gray-400">Encrypt and decrypt text securely using various algorithms</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
          <div className="flex border border-gray-700 rounded-md overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => setMode('encrypt')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                mode === 'encrypt'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              Encrypt
            </button>
            <button
              type="button"
              onClick={() => setMode('decrypt')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                mode === 'decrypt'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              Decrypt
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-2">
                {mode === 'encrypt' ? 'Text to Encrypt' : 'Text to Decrypt'}
              </label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={mode === 'encrypt' ? 'Enter text to encrypt' : 'Enter text to decrypt'}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 min-h-[120px]"
                required
              />
            </div>

            <div>
              <label htmlFor="algorithm" className="block text-sm font-medium text-gray-300 mb-2">
                Algorithm
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
              <p className="mt-1 text-xs text-gray-500">Select the encryption algorithm to use</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password / Secret Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter encryption password"
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">This password will be used to {mode} your text</p>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-500 transition-colors duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed font-medium"
            >
              {processing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                mode === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-8 text-red-400">
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                {mode === 'encrypt' ? 'Encrypted Text' : 'Decrypted Text'}
              </h2>
              <button
                onClick={copyToClipboard}
                className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="bg-gray-900 p-4 rounded-md border border-gray-700 font-mono text-sm break-all">
              {result}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Algorithm: {algorithms.find(a => a.value === algorithm)?.label}
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Security Notes</h2>
          <div className="text-gray-400 space-y-2 text-sm">
            <p>• All encryption and decryption is performed locally in your browser.</p>
            <p>• Your data and passwords are never sent to any server.</p>
            <p>• Use strong, unique passwords for better security.</p>
            <p>• AES-256-CBC is recommended for most secure encryption needs.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 