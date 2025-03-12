// Tehdit İstihbaratı API endpoint'i
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query, queryType } = req.body;

  if (!query) {
    return res.status(400).json({ message: 'Sorgu belirtilmedi' });
  }

  if (!['ip', 'domain', 'hash'].includes(queryType)) {
    return res.status(400).json({ message: 'Geçersiz sorgu tipi' });
  }

  try {
    // Gerçek bir API çağrısı yapılabilir, şimdilik simüle edilmiş veriler döndürelim
    const results = simulateResults(query, queryType);
    
    // Gerçek bir API çağrısı simülasyonu için gecikme
    await new Promise(resolve => setTimeout(resolve, 1500));

    return res.status(200).json(results);
  } catch (error) {
    console.error('Threat intelligence error:', error);
    return res.status(500).json({ 
      message: 'Sorgu sırasında bir hata oluştu',
      error: error.message 
    });
  }
}

// Simüle edilmiş tehdit istihbaratı sonuçları
function simulateResults(query, queryType) {
  if (queryType === 'ip') {
    return {
      query,
      queryType,
      timestamp: new Date().toISOString(),
      results: {
        ip: query,
        location: {
          country: 'Rusya',
          city: 'Moskova',
          latitude: 55.7558,
          longitude: 37.6173
        },
        reputation: {
          score: 85,
          category: 'Kötü Amaçlı',
          lastReported: '2023-03-01'
        },
        activities: [
          {
            type: 'Brute Force',
            firstSeen: '2023-01-15',
            lastSeen: '2023-03-01',
            frequency: 'Yüksek',
            targets: ['SSH', 'RDP', 'Web Uygulamaları']
          },
          {
            type: 'Malware C2',
            firstSeen: '2023-02-10',
            lastSeen: '2023-02-28',
            frequency: 'Orta',
            malwareFamily: 'Emotet'
          }
        ],
        relatedIPs: [
          '192.168.1.2',
          '192.168.1.3',
          '192.168.1.4'
        ],
        blacklists: [
          'AbuseIPDB',
          'Spamhaus',
          'Emerging Threats'
        ]
      }
    };
  } else if (queryType === 'domain') {
    return {
      query,
      queryType,
      timestamp: new Date().toISOString(),
      results: {
        domain: query,
        registrationInfo: {
          registrar: 'GoDaddy.com, LLC',
          creationDate: '2020-05-15',
          expirationDate: '2025-05-15',
          lastUpdated: '2022-11-20'
        },
        reputation: {
          score: 75,
          category: 'Şüpheli',
          lastReported: '2023-02-15'
        },
        dns: {
          a: ['192.168.1.1'],
          mx: ['mail.example.com'],
          ns: ['ns1.example.com', 'ns2.example.com'],
          txt: ['v=spf1 include:_spf.example.com ~all']
        },
        activities: [
          {
            type: 'Phishing',
            firstSeen: '2023-01-20',
            lastSeen: '2023-02-15',
            frequency: 'Düşük',
            targets: ['Bankacılık', 'E-posta']
          }
        ],
        relatedDomains: [
          'example2.com',
          'example3.com'
        ],
        blacklists: [
          'PhishTank',
          'SURBL'
        ]
      }
    };
  } else if (queryType === 'hash') {
    return {
      query,
      queryType,
      timestamp: new Date().toISOString(),
      results: {
        hash: query,
        fileInfo: {
          fileName: 'malicious.exe',
          fileSize: '2.5 MB',
          fileType: 'Windows Executable',
          compilationTime: '2023-01-10'
        },
        reputation: {
          score: 95,
          category: 'Zararlı',
          lastReported: '2023-02-28'
        },
        malwareInfo: {
          type: 'Trojan',
          family: 'Emotet',
          capabilities: ['Keylogger', 'Data Exfiltration', 'Persistence']
        },
        detections: {
          antivirusCount: 45,
          totalEngines: 68,
          firstSeen: '2023-01-15',
          lastSeen: '2023-02-28'
        },
        relatedHashes: [
          'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          'q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f'
        ]
      }
    };
  }
} 