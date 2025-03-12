import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text, algorithm } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  if (!algorithm) {
    return res.status(400).json({ message: 'Algorithm is required' });
  }

  const supportedAlgorithms = ['md5', 'sha1', 'sha256', 'sha512'];
  
  if (!supportedAlgorithms.includes(algorithm)) {
    return res.status(400).json({ 
      message: `Unsupported algorithm. Supported algorithms are: ${supportedAlgorithms.join(', ')}` 
    });
  }

  try {
    const hash = crypto.createHash(algorithm).update(text).digest('hex');
    
    res.status(200).json({ 
      hash,
      algorithm,
      textLength: text.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating hash:', error);
    res.status(500).json({ message: 'Error generating hash', error: error.message });
  }
} 