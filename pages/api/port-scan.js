import net from 'net';

// Maximum number of ports to scan at once (65535 is the maximum port number)
const MAX_PORTS = 65535;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { host, portRange } = req.body;

  if (!host || !portRange) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  // Validate host
  if (!/^[a-zA-Z0-9.-]+$/.test(host)) {
    return res.status(400).json({ message: 'Invalid host format' });
  }

  // Parse port range
  const [startPort, endPort] = portRange.split('-').map(Number);
  
  if (isNaN(startPort) || isNaN(endPort) || startPort < 1 || endPort > 65535 || startPort > endPort) {
    return res.status(400).json({ message: 'Invalid port range. Must be between 1-65535' });
  }

  // Warning for large port ranges but allow them
  let warningMessage = null;
  if (endPort - startPort > 1000) {
    warningMessage = `Scanning a large port range (${endPort - startPort + 1} ports). This may take some time.`;
  }

  const results = [];
  const scanPromises = [];

  console.log(`Starting port scan on ${host} for ports ${startPort}-${endPort}`);

  for (let port = startPort; port <= endPort; port++) {
    scanPromises.push(scanPort(host, port));
  }

  try {
    const portResults = await Promise.all(scanPromises);
    
    // Sort results by port number
    results.push(...portResults.sort((a, b) => a.port - b.port));
    
    // Add summary statistics
    const openPorts = results.filter(r => r.status === 'open').length;
    
    res.status(200).json({ 
      results,
      summary: {
        totalScanned: results.length,
        openPorts,
        closedPorts: results.length - openPorts,
        scanTime: new Date().toISOString(),
        warning: warningMessage
      }
    });
  } catch (error) {
    console.error('Error scanning ports:', error);
    res.status(500).json({ message: 'Error scanning ports', error: error.message });
  }
}

function scanPort(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = 1000; // 1 second timeout

    socket.setTimeout(timeout);

    socket.on('connect', () => {
      socket.destroy();
      resolve({ port, status: 'open' });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ port, status: 'closed' });
    });

    socket.on('error', (err) => {
      socket.destroy();
      // Different error handling based on error type
      if (err.code === 'ECONNREFUSED') {
        resolve({ port, status: 'closed' });
      } else {
        resolve({ port, status: 'closed', error: err.code });
      }
    });

    socket.connect(port, host);
  });
} 