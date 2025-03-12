import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { ipAddress } = req.body;

  if (!ipAddress) {
    return res.status(400).json({ message: 'IP address is required' });
  }

  // Validate IP address format
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  if (!ipv4Regex.test(ipAddress) && !ipv6Regex.test(ipAddress)) {
    return res.status(400).json({ message: 'Invalid IP address format' });
  }

  try {
    // Use ipinfo.io API to get IP information
    const response = await axios.get(`https://ipinfo.io/${ipAddress}/json`);
    
    // Process location data if available
    if (response.data.loc) {
      const [lat, lon] = response.data.loc.split(',');
      response.data.location = {
        lat,
        lon
      };
    }
    
    // Add timestamp
    response.data.timestamp = new Date().toISOString();
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error analyzing network:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.status(error.response.status).json({ 
        message: 'Error retrieving network information',
        error: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(500).json({ 
        message: 'No response from network information service'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return res.status(500).json({ 
        message: 'Error analyzing network',
        error: error.message
      });
    }
  }
}