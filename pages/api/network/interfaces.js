import { networkInterfaces } from 'os';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const interfaces = [];
    const netInterfaces = networkInterfaces();

    for (const [name, nets] of Object.entries(netInterfaces)) {
      for (const net of nets) {
        // Skip internal interfaces
        if (!net.internal) {
          interfaces.push({
            name,
            description: `${net.family} - ${net.address}`,
            address: net.address,
            netmask: net.netmask,
            family: net.family,
            mac: net.mac
          });
        }
      }
    }

    return res.status(200).json({ interfaces });
  } catch (error) {
    console.error('Network interfaces error:', error);
    return res.status(500).json({ 
      message: 'Ağ arayüzleri alınamadı',
      error: error.message 
    });
  }
} 