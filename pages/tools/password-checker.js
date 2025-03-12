import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function PasswordChecker() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const checkPassword = (e) => {
    e.preventDefault();
    
    // Reset result
    setResult(null);
    
    if (!password) return;
    
    // Check password strength
    const strength = calculatePasswordStrength(password);
    setResult(strength);
  };

  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    let feedback = [];
    
    // Length check
    if (pwd.length < 8) {
      feedback.push('Password is too short (minimum 8 characters)');
    } else {
      score += 1;
    }
    
    // Complexity checks
    if (/[A-Z]/.test(pwd)) score += 1;
    else feedback.push('Add uppercase letters');
    
    if (/[a-z]/.test(pwd)) score += 1;
    else feedback.push('Add lowercase letters');
    
    if (/[0-9]/.test(pwd)) score += 1;
    else feedback.push('Add numbers');
    
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    else feedback.push('Add special characters');
    
    // Common patterns check
    if (/^(123|abc|qwerty|password|admin|letmein|welcome)/i.test(pwd)) {
      score -= 1;
      feedback.push('Avoid common patterns');
    }
    
    // Repeated characters
    if (/(.)\1{2,}/.test(pwd)) {
      score -= 1;
      feedback.push('Avoid repeated characters');
    }
    
    // Calculate strength level
    let strength = 'Very Weak';
    let color = 'red';
    
    if (score >= 5) {
      strength = 'Very Strong';
      color = 'green';
    } else if (score === 4) {
      strength = 'Strong';
      color = 'green';
    } else if (score === 3) {
      strength = 'Medium';
      color = 'yellow';
    } else if (score === 2) {
      strength = 'Weak';
      color = 'orange';
    }
    
    // Calculate crack time estimation (very simplified)
    let crackTimeEstimate = 'Less than a second';
    
    if (score === 5) crackTimeEstimate = 'Centuries';
    else if (score === 4) crackTimeEstimate = 'Several years';
    else if (score === 3) crackTimeEstimate = 'Several months';
    else if (score === 2) crackTimeEstimate = 'Several days';
    else if (score === 1) crackTimeEstimate = 'Several hours';
    
    return {
      score,
      strength,
      color,
      feedback,
      crackTimeEstimate
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Head>
        <title>Password Strength Checker - Cyber Security Toolkit</title>
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
            <h2 className="text-3xl font-bold text-white mb-2">Password Strength Checker</h2>
            <p className="text-gray-400">Check the strength and security of your passwords</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
            <form onSubmit={checkPassword} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password to check"
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
                <p className="mt-1 text-xs text-gray-500">Your password is never stored or transmitted</p>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-500 transition-colors duration-300 font-medium"
              >
                Check Password Strength
              </button>
            </form>
          </div>

          {result && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Password Analysis</h2>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Strength:</span>
                  <span className={`font-medium ${
                    result.color === 'green' ? 'text-green-500' : 
                    result.color === 'yellow' ? 'text-yellow-500' : 
                    result.color === 'orange' ? 'text-orange-500' : 'text-red-500'
                  }`}>
                    {result.strength}
                  </span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      result.color === 'green' ? 'bg-green-500' : 
                      result.color === 'yellow' ? 'bg-yellow-500' : 
                      result.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${(result.score / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Estimated crack time:</div>
                  <div className="font-medium text-white">{result.crackTimeEstimate}</div>
                </div>
                
                {result.feedback.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Suggestions to improve:</div>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {result.feedback.map((item, index) => (
                        <li key={index} className="text-red-400">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.feedback.length === 0 && (
                  <div className="text-green-500">
                    Great job! Your password meets all security criteria.
                  </div>
                )}
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