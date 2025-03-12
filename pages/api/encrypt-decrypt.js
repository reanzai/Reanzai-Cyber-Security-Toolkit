import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text, password, mode, algorithm } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  if (!mode || !['encrypt', 'decrypt'].includes(mode)) {
    return res.status(400).json({ message: 'Valid mode (encrypt or decrypt) is required' });
  }

  const supportedAlgorithms = ['aes-256-cbc', 'aes-192-cbc', 'aes-128-cbc', 'des-ede3-cbc'];
  
  if (!algorithm || !supportedAlgorithms.includes(algorithm)) {
    return res.status(400).json({ 
      message: `Unsupported algorithm. Supported algorithms are: ${supportedAlgorithms.join(', ')}` 
    });
  }

  try {
    let result;
    
    if (mode === 'encrypt') {
      result = encrypt(text, password, algorithm);
    } else {
      result = decrypt(text, password, algorithm);
    }
    
    res.status(200).json({ 
      result,
      mode,
      algorithm,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error during ${mode}ion:`, error);
    res.status(500).json({ 
      message: `Error during ${mode}ion: ${error.message}`,
      error: error.message
    });
  }
}

function encrypt(text, password, algorithm) {
  // Create a key from the password
  const key = crypto.scryptSync(password, 'salt', getKeyLength(algorithm));
  
  // Create a random initialization vector
  const iv = crypto.randomBytes(16);
  
  // Create cipher
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return the IV and encrypted data as a single string
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText, password, algorithm) {
  // Split the encrypted text into IV and data
  const parts = encryptedText.split(':');
  
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted text format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  // Create a key from the password
  const key = crypto.scryptSync(password, 'salt', getKeyLength(algorithm));
  
  // Create decipher
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  
  // Decrypt the text
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

function getKeyLength(algorithm) {
  switch (algorithm) {
    case 'aes-256-cbc':
      return 32; // 256 bits
    case 'aes-192-cbc':
      return 24; // 192 bits
    case 'aes-128-cbc':
      return 16; // 128 bits
    case 'des-ede3-cbc':
      return 24; // Triple DES uses 24 bytes (192 bits)
    default:
      return 32; // Default to 256 bits
  }
} 