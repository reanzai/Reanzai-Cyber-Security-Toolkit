import dns from 'dns';
import { promisify } from 'util';

// Promisify DNS functions
const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);
const resolveCname = promisify(dns.resolveCname);
const resolveMx = promisify(dns.resolveMx);
const resolveNs = promisify(dns.resolveNs);
const resolveTxt = promisify(dns.resolveTxt);
const resolveSoa = promisify(dns.resolveSoa);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { domain, recordType } = req.body;

  if (!domain) {
    return res.status(400).json({ message: 'Domain is required' });
  }

  if (!recordType) {
    return res.status(400).json({ message: 'Record type is required' });
  }

  // Validate domain format
  const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    return res.status(400).json({ message: 'Invalid domain format' });
  }

  try {
    let records = [];
    
    if (recordType === 'ALL') {
      // Fetch all record types
      records = await getAllRecords(domain);
    } else {
      // Fetch specific record type
      records = await getRecords(domain, recordType);
    }
    
    res.status(200).json({
      domain,
      recordType,
      records,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('DNS lookup error:', error);
    
    // Handle specific DNS errors
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return res.status(404).json({ 
        message: `No ${recordType} records found for ${domain}`,
        error: error.code
      });
    }
    
    res.status(500).json({ 
      message: 'Error performing DNS lookup',
      error: error.message
    });
  }
}

async function getRecords(domain, recordType) {
  switch (recordType) {
    case 'A':
      const aRecords = await resolve4(domain);
      return aRecords.map(ip => ({ type: 'A', value: ip }));
      
    case 'AAAA':
      const aaaaRecords = await resolve6(domain);
      return aaaaRecords.map(ip => ({ type: 'AAAA', value: ip }));
      
    case 'CNAME':
      const cnameRecords = await resolveCname(domain);
      return cnameRecords.map(value => ({ type: 'CNAME', value }));
      
    case 'MX':
      const mxRecords = await resolveMx(domain);
      return mxRecords.map(record => ({ 
        type: 'MX', 
        priority: record.priority,
        value: record.exchange 
      }));
      
    case 'NS':
      const nsRecords = await resolveNs(domain);
      return nsRecords.map(value => ({ type: 'NS', value }));
      
    case 'TXT':
      const txtRecords = await resolveTxt(domain);
      return txtRecords.map(values => ({ type: 'TXT', value: values.join(' ') }));
      
    case 'SOA':
      const soaRecord = await resolveSoa(domain);
      return [{ 
        type: 'SOA', 
        data: soaRecord 
      }];
      
    default:
      throw new Error(`Unsupported record type: ${recordType}`);
  }
}

async function getAllRecords(domain) {
  const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA'];
  const results = [];
  
  for (const type of recordTypes) {
    try {
      const records = await getRecords(domain, type);
      results.push(...records);
    } catch (error) {
      // Skip errors for specific record types when fetching all
      console.log(`No ${type} records for ${domain}: ${error.message}`);
    }
  }
  
  return results;
} 