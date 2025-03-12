import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { host, apiKey } = req.body;

  if (!host) {
    return res.status(400).json({ message: 'Host is required' });
  }

  if (!apiKey) {
    return res.status(400).json({ message: 'Shodan API key is required' });
  }

  // Validate host format (IP or domain)
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  
  let targetHost = host;
  
  // If it's a domain, try to resolve it to an IP first
  if (domainRegex.test(host) && !ipRegex.test(host)) {
    try {
      const dnsResponse = await axios.get(`https://api.shodan.io/dns/resolve?hostnames=${host}&key=${apiKey}`);
      
      if (dnsResponse.data && dnsResponse.data[host]) {
        targetHost = dnsResponse.data[host];
      } else {
        return res.status(404).json({ message: 'Could not resolve domain to IP address' });
      }
    } catch (error) {
      console.error('DNS resolution error:', error);
      return res.status(500).json({ 
        message: 'Error resolving domain to IP address',
        error: error.response?.data?.error || error.message
      });
    }
  }

  try {
    // Query Shodan for host information
    const response = await axios.get(`https://api.shodan.io/shodan/host/${targetHost}?key=${apiKey}`);
    
    // Return the Shodan data
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Shodan API error:', error);
    
    // Handle specific Shodan API errors
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401) {
        return res.status(401).json({ message: 'Invalid Shodan API key' });
      } else if (status === 404) {
        return res.status(404).json({ message: 'No information available for this host' });
      } else if (status === 429) {
        return res.status(429).json({ message: 'API rate limit exceeded' });
      }
      
      return res.status(status).json({ 
        message: error.response.data.error || 'Error querying Shodan API',
        error: error.response.data
      });
    }
    
    res.status(500).json({ 
      message: 'Error querying Shodan API',
      error: error.message
    });
  }
} 