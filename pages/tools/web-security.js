import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card, Button, Form, Alert, Table, Badge, Spinner, Row, Col, ProgressBar, Tabs, Tab, Dropdown, ButtonGroup, Modal, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileExport, faFileCsv, faFileCode, faFilePdf, faFileAlt, 
  faHistory, faTrashAlt, faEye, faChartBar, faExclamationTriangle, 
  faChevronUp, faChevronDown, faGlobe, faNetworkWired, faLock, 
  faHeading, faInfoCircle, faCogs, faShieldAlt, faArrowUp, 
  faArrowDown, faMinus, faServer, faDatabase, faCode
} from '@fortawesome/free-solid-svg-icons';

export default function WebSecurityScanner() {
  const [url, setUrl] = useState('');
  const [scanType, setScanType] = useState('quick');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('summary');
  
  // Geçmiş taramalar için state'ler
  const [scanHistory, setScanHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedHistoryScan, setSelectedHistoryScan] = useState(null);
  const [showHistoryDetailModal, setShowHistoryDetailModal] = useState(false);

  // Gelişmiş tarama seçenekleri için yeni state'ler
  const [advancedOptions, setAdvancedOptions] = useState({
    portScan: true,
    sslCheck: true,
    headerCheck: true,
    dirBruteforce: false,
    vulnCheck: true,
    techDetection: true,
    wafDetection: true,
    corsCheck: true,
    dnsCheck: true,
    customPaths: '',
    customHeaders: '',
    timeout: 30,
    followRedirects: true,
    maxDepth: 2
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Sayfa yüklendiğinde geçmiş taramaları getir
  useEffect(() => {
    fetchScanHistory();
  }, []);

  // Geçmiş taramaları getir
  const fetchScanHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch('/api/scan-history');
      if (!response.ok) {
        throw new Error('Tarama geçmişi alınamadı');
      }
      const data = await response.json();
      setScanHistory(data);
    } catch (error) {
      console.error('Tarama geçmişi alınamadı:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Geçmiş taramayı sil
  const deleteScanHistory = async (id) => {
    try {
      const response = await fetch(`/api/scan-history?id=${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Tarama silinemedi');
      }
      // Geçmiş taramaları yeniden getir
      fetchScanHistory();
    } catch (error) {
      console.error('Tarama silinemedi:', error);
    }
  };

  // Geçmiş taramayı görüntüle
  const viewHistoryScan = (scan) => {
    setSelectedHistoryScan(scan);
    setShowHistoryDetailModal(true);
    setShowHistoryModal(false);
  };

  // Geçmiş taramayı yeniden yükle
  const loadHistoryScan = (scan) => {
    setResults(scan);
    setShowHistoryModal(false);
    setActiveTab('summary');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Lütfen taranacak bir URL girin');
      return;
    }

    // Basit URL doğrulama
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlRegex.test(url)) {
      setError('Lütfen geçerli bir URL girin (örn: https://example.com)');
      return;
    }

    setIsScanning(true);
    setResults(null);
    setError('');
    setScanProgress(0);

    try {
      // İlerleme çubuğu için interval
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 95) {
            return prev;
          }
          return prev + 5;
        });
      }, 500);

      // Gerçek API endpoint'ine istek gönder
      const response = await fetch('/api/vulnerability-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: url,
          scanType: scanType,
          advancedOptions: advancedOptions
        }),
      });

      clearInterval(progressInterval);
      setScanProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Tarama sırasında bir hata oluştu');
      }

      const data = await response.json();
      setResults(data);
      setActiveTab('summary');
      
      // Tarama geçmişini güncelle
      fetchScanHistory();
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityCount = (severity) => {
    if (!results || !results.vulnerabilities) return 0;
    return results.vulnerabilities.filter(v => v.severity === severity).length;
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'danger';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'secondary';
      default: return 'primary';
    }
  };

  // Güvenli toString fonksiyonu
  const safeToString = (value) => {
    if (value === undefined || value === null) {
      return '-';
    }
    return value.toString();
  };

  const exportToCSV = () => {
    if (!results) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "URL,Scan Type,Scan Time,Scan Duration,Vulnerability ID,Name,Severity,CVSS Score,Description,Location,Remediation\n";

    results.vulnerabilities.forEach(vuln => {
      const row = [
        results.target,
        results.scanType,
        results.timestamp ? new Date(results.timestamp).toLocaleString() : 'N/A',
        results.scanDuration,
        vuln.id || vuln.cveId || 'N/A',
        `"${vuln.title.replace(/"/g, '""')}"`,
        vuln.severity,
        safeToString(vuln.cvssScore),
        `"${vuln.description.replace(/"/g, '""')}"`,
        `"${vuln.affectedComponents.replace(/"/g, '""')}"`,
        `"${vuln.remediation.replace(/"/g, '""')}"`
      ];
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `web_security_scan_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToXML = () => {
    if (!results) return;

    let xmlContent = '<?xml version="1.0" encoding="UTF-8" ?>\n';
    xmlContent += '<WebSecurityScan>\n';
    xmlContent += `  <Target>${escapeXML(results.url)}</Target>\n`;
    xmlContent += `  <ScanType>${results.scanType}</ScanType>\n`;
    xmlContent += `  <ScanTime>${results.scanTime || results.timestamp}</ScanTime>\n`;
    xmlContent += `  <ScanDuration>${results.scanDuration}</ScanDuration>\n`;
    
    xmlContent += '  <Vulnerabilities>\n';
    results.vulnerabilities.forEach(vuln => {
      xmlContent += '    <Vulnerability>\n';
      xmlContent += `      <ID>${vuln.cveId || vuln.id}</ID>\n`;
      xmlContent += `      <Name>${escapeXML(vuln.title)}</Name>\n`;
      xmlContent += `      <Severity>${vuln.severity}</Severity>\n`;
      xmlContent += `      <Confidence>${vuln.cvssScore.toString()}</Confidence>\n`;
      xmlContent += `      <Description>${escapeXML(vuln.description)}</Description>\n`;
      xmlContent += `      <Location>${escapeXML(vuln.affectedComponents)}</Location>\n`;
      xmlContent += `      <Evidence>${escapeXML(vuln.evidence || 'N/A')}</Evidence>\n`;
      xmlContent += `      <Remediation>${escapeXML(vuln.remediation)}</Remediation>\n`;
      if (vuln.references && vuln.references.length > 0) {
        xmlContent += '      <References>\n';
        vuln.references.forEach(ref => {
          xmlContent += `        <Reference>${escapeXML(ref)}</Reference>\n`;
        });
        xmlContent += '      </References>\n';
      }
      xmlContent += '    </Vulnerability>\n';
    });
    xmlContent += '  </Vulnerabilities>\n';
    
    xmlContent += '  <Headers>\n';
    Object.entries(results.headers || {}).forEach(([key, value]) => {
      if (value) {
        xmlContent += `    <Header>\n`;
        xmlContent += `      <Name>${escapeXML(key)}</Name>\n`;
        xmlContent += `      <Value>${escapeXML(value)}</Value>\n`;
        xmlContent += `    </Header>\n`;
      }
    });
    xmlContent += '  </Headers>\n';
    
    xmlContent += '  <Technologies>\n';
    (results.technologies || []).forEach(tech => {
      xmlContent += '    <Technology>\n';
      xmlContent += `      <Name>${escapeXML(tech.name)}</Name>\n`;
      xmlContent += `      <Version>${escapeXML(tech.version)}</Version>\n`;
      xmlContent += `      <Confidence>${tech.confidence}</Confidence>\n`;
      xmlContent += '    </Technology>\n';
    });
    xmlContent += '  </Technologies>\n';
    
    xmlContent += '</WebSecurityScan>';

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `web_security_scan_${new URL(results.url).hostname}_${new Date().toISOString().slice(0,10)}.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    if (!results) return;

    const exportData = {
      target: results.url,
      scanType: results.scanType,
      scanTime: results.scanTime,
      scanDuration: results.scanDuration,
      vulnerabilities: results.vulnerabilities,
      headers: results.headers,
      technologies: results.technologies
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `web_security_scan_${new URL(results.url).hostname}_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToTXT = () => {
    if (!results) return;

    let txtContent = `Web Güvenlik Tarama Raporu\n`;
    txtContent += `=========================\n\n`;
    txtContent += `Hedef URL: ${results.url}\n`;
    txtContent += `Tarama Tipi: ${results.scanType}\n`;
    txtContent += `Tarama Zamanı: ${results.scanTime}\n`;
    txtContent += `Tarama Süresi: ${results.scanDuration} saniye\n\n`;
    
    txtContent += `Bulunan Güvenlik Açıkları (${results.vulnerabilities.length}):\n`;
    txtContent += `=================================\n\n`;
    
    results.vulnerabilities.forEach((vuln, index) => {
      txtContent += `[${index + 1}] ${vuln.title}\n`;
      txtContent += `ID: ${vuln.id}\n`;
      txtContent += `Önem Derecesi: ${vuln.severity}\n`;
      txtContent += `Güven Seviyesi: ${vuln.cvssScore.toString()}\n`;
      txtContent += `Açıklama: ${vuln.description}\n`;
      txtContent += `Konum: ${vuln.affectedComponents}\n`;
      txtContent += `Kanıt: ${vuln.evidence}\n`;
      txtContent += `Çözüm Önerisi: ${vuln.remediation}\n\n`;
    });
    
    txtContent += `HTTP Başlıkları:\n`;
    txtContent += `==============\n\n`;
    Object.entries(results.headers).forEach(([key, value]) => {
      if (value) {
        txtContent += `${key}: ${value}\n`;
      }
    });
    txtContent += `\n`;
    
    txtContent += `Tespit Edilen Teknolojiler:\n`;
    txtContent += `========================\n\n`;
    results.technologies.forEach((tech, index) => {
      txtContent += `[${index + 1}] ${tech.name} ${tech.version} (Güven: ${tech.confidence})\n`;
    });

    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `web_security_scan_${new URL(results.url).hostname}_${new Date().toISOString().slice(0,10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // XML için özel karakterleri kaçış fonksiyonu
  const escapeXML = (str) => {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  // Zafiyet kategorileri için yeni fonksiyon
  const categorizeVulnerabilities = () => {
    if (!results || !results.vulnerabilities) return {};
    
    const categories = {
      'web-app': { title: 'Web Uygulama Güvenliği', items: [], icon: faGlobe },
      'network': { title: 'Ağ Güvenliği', items: [], icon: faNetworkWired },
      'ssl-tls': { title: 'SSL/TLS Güvenliği', items: [], icon: faLock },
      'headers': { title: 'HTTP Başlık Güvenliği', items: [], icon: faHeading },
      'info-disclosure': { title: 'Bilgi İfşası', items: [], icon: faInfoCircle },
      'configuration': { title: 'Yapılandırma Sorunları', items: [], icon: faCogs },
      'other': { title: 'Diğer Güvenlik Sorunları', items: [], icon: faExclamationTriangle }
    };
    
    results.vulnerabilities.forEach(vuln => {
      if (vuln.id.startsWith('SSL-')) {
        categories['ssl-tls'].items.push(vuln);
      } else if (vuln.id.startsWith('PORT-')) {
        categories['network'].items.push(vuln);
      } else if (vuln.id.startsWith('HEADER-')) {
        categories['headers'].items.push(vuln);
      } else if (vuln.id.startsWith('INFO-')) {
        categories['info-disclosure'].items.push(vuln);
      } else if (vuln.id.startsWith('PATH-')) {
        categories['configuration'].items.push(vuln);
      } else if (vuln.id.startsWith('FORM-') || vuln.id.startsWith('WEB-')) {
        categories['web-app'].items.push(vuln);
      } else {
        categories['other'].items.push(vuln);
      }
    });
    
    // Boş kategorileri filtrele
    return Object.fromEntries(
      Object.entries(categories).filter(([_, category]) => category.items.length > 0)
    );
  };

  // Zafiyet trendlerini analiz et
  const analyzeVulnerabilityTrends = () => {
    if (!scanHistory || scanHistory.length < 2) return null;
    
    const latestScan = scanHistory[0];
    const previousScans = scanHistory.filter(scan => 
      scan.target === latestScan.target && scan.id !== latestScan.id
    ).slice(0, 5);
    
    if (previousScans.length === 0) return null;
    
    const trends = {
      improved: [],
      worsened: [],
      unchanged: []
    };
    
    // En son taramayı önceki taramalarla karşılaştır
    previousScans.forEach(prevScan => {
      // Kritik ve yüksek öncelikli zafiyetleri karşılaştır
      const prevHighCount = prevScan.summary.critical + prevScan.summary.high;
      const currentHighCount = latestScan.summary.critical + latestScan.summary.high;
      
      if (currentHighCount < prevHighCount) {
        trends.improved.push({
          scanDate: new Date(prevScan.timestamp).toLocaleDateString(),
          difference: prevHighCount - currentHighCount,
          scanId: prevScan.id
        });
      } else if (currentHighCount > prevHighCount) {
        trends.worsened.push({
          scanDate: new Date(prevScan.timestamp).toLocaleDateString(),
          difference: currentHighCount - prevHighCount,
          scanId: prevScan.id
        });
      } else {
        trends.unchanged.push({
          scanDate: new Date(prevScan.timestamp).toLocaleDateString(),
          scanId: prevScan.id
        });
      }
    });
    
    return trends;
  };

  // Zafiyet risk skorunu hesapla (0-100 arası)
  const calculateRiskScore = () => {
    if (!results || !results.vulnerabilities) return 0;
    
    const weights = {
      'Critical': 10,
      'High': 5,
      'Medium': 2,
      'Low': 1
    };
    
    let totalScore = 0;
    let maxPossibleScore = 100;
    
    results.vulnerabilities.forEach(vuln => {
      totalScore += weights[vuln.severity] || 0;
    });
    
    // Skoru 0-100 arasına normalize et
    return Math.min(Math.round((totalScore / maxPossibleScore) * 100), 100);
  };

  // Risk skoruna göre renk belirle
  const getRiskScoreColor = (score) => {
    if (score >= 75) return 'danger';
    if (score >= 50) return 'warning';
    if (score >= 25) return 'info';
    return 'success';
  };

  // Zafiyet çözüm önerilerini önceliklendir
  const prioritizeRemediation = () => {
    if (!results || !results.vulnerabilities) return [];
    
    // Zafiyetleri önem derecesine göre sırala
    const sortedVulns = [...results.vulnerabilities].sort((a, b) => {
      const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
    
    // İlk 5 öncelikli çözüm önerisini döndür
    return sortedVulns.slice(0, 5).map(vuln => ({
      title: vuln.title,
      severity: vuln.severity,
      remediation: vuln.remediation
    }));
  };

  return (
    <Layout>
      <h1 className="mb-4">Web Güvenlik Tarayıcı</h1>

      <Card className="bg-dark text-light mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Yeni Tarama</h4>
            <Button 
              variant="info" 
              onClick={() => setShowHistoryModal(true)}
              disabled={isScanning}
            >
              <FontAwesomeIcon icon={faHistory} className="me-2" />
              Geçmiş Taramalar
            </Button>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Hedef URL</Form.Label>
              <Form.Control 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Örnek: https://example.com"
                disabled={isScanning}
              />
              <Form.Text className="text-muted">
                Taramak istediğiniz web sitesinin URL'sini girin
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tarama Tipi</Form.Label>
              <Form.Select 
                value={scanType}
                onChange={(e) => setScanType(e.target.value)}
                disabled={isScanning}
              >
                <option value="quick">Hızlı Tarama (Temel Kontroller)</option>
                <option value="standard">Standart Tarama (Önerilen)</option>
                <option value="full">Tam Tarama (Detaylı, Uzun Sürer)</option>
                <option value="custom">Özel Tarama (Gelişmiş Seçenekler)</option>
              </Form.Select>
            </Form.Group>

            <Button 
              variant="secondary" 
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="mb-3"
              disabled={isScanning}
            >
              <FontAwesomeIcon icon={showAdvancedOptions ? faChevronUp : faChevronDown} className="me-2" />
              Gelişmiş Seçenekler
            </Button>

            {showAdvancedOptions && (
              <Card className="bg-dark border-secondary mb-3">
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Check 
                        type="switch"
                        id="portScan"
                        label="Port Tarama"
                        checked={advancedOptions.portScan}
                        onChange={(e) => setAdvancedOptions({...advancedOptions, portScan: e.target.checked})}
                        disabled={isScanning}
                      />
                      <Form.Check 
                        type="switch"
                        id="sslCheck"
                        label="SSL/TLS Kontrolü"
                        checked={advancedOptions.sslCheck}
                        onChange={(e) => setAdvancedOptions({...advancedOptions, sslCheck: e.target.checked})}
                        disabled={isScanning}
                      />
                      <Form.Check 
                        type="switch"
                        id="headerCheck"
                        label="HTTP Başlık Kontrolü"
                        checked={advancedOptions.headerCheck}
                        onChange={(e) => setAdvancedOptions({...advancedOptions, headerCheck: e.target.checked})}
                        disabled={isScanning}
                      />
                      <Form.Check 
                        type="switch"
                        id="dirBruteforce"
                        label="Dizin Tarama"
                        checked={advancedOptions.dirBruteforce}
                        onChange={(e) => setAdvancedOptions({...advancedOptions, dirBruteforce: e.target.checked})}
                        disabled={isScanning}
                      />
                      <Form.Check 
                        type="switch"
                        id="vulnCheck"
                        label="Güvenlik Açığı Kontrolü"
                        checked={advancedOptions.vulnCheck}
                        onChange={(e) => setAdvancedOptions({...advancedOptions, vulnCheck: e.target.checked})}
                        disabled={isScanning}
                      />
                      <Form.Check 
                        type="switch"
                        id="techDetection"
                        label="Teknoloji Tespiti"
                        checked={advancedOptions.techDetection}
                        onChange={(e) => setAdvancedOptions({...advancedOptions, techDetection: e.target.checked})}
                        disabled={isScanning}
                      />
                      <Form.Check 
                        type="switch"
                        id="wafDetection"
                        label="WAF Tespiti"
                        checked={advancedOptions.wafDetection}
                        onChange={(e) => setAdvancedOptions({...advancedOptions, wafDetection: e.target.checked})}
                        disabled={isScanning}
                      />
                      <Form.Check 
                        type="switch"
                        id="corsCheck"
                        label="CORS Kontrolü"
                        checked={advancedOptions.corsCheck}
                        onChange={(e) => setAdvancedOptions({...advancedOptions, corsCheck: e.target.checked})}
                        disabled={isScanning}
                      />
                      <Form.Check 
                        type="switch"
                        id="dnsCheck"
                        label="DNS Kayıtları Kontrolü"
                        checked={advancedOptions.dnsCheck}
                        onChange={(e) => setAdvancedOptions({...advancedOptions, dnsCheck: e.target.checked})}
                        disabled={isScanning}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Özel Dizinler (Her satıra bir dizin)</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3}
                          value={advancedOptions.customPaths}
                          onChange={(e) => setAdvancedOptions({...advancedOptions, customPaths: e.target.value})}
                          placeholder="/admin&#10;/backup&#10;/config"
                          disabled={isScanning}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Özel HTTP Başlıkları (Her satıra bir başlık)</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3}
                          value={advancedOptions.customHeaders}
                          onChange={(e) => setAdvancedOptions({...advancedOptions, customHeaders: e.target.value})}
                          placeholder="X-Custom-Header: value&#10;User-Agent: CustomBot"
                          disabled={isScanning}
                        />
                      </Form.Group>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Zaman Aşımı (saniye)</Form.Label>
                            <Form.Control 
                              type="number" 
                              value={advancedOptions.timeout}
                              onChange={(e) => setAdvancedOptions({...advancedOptions, timeout: parseInt(e.target.value)})}
                              min={1}
                              max={300}
                              disabled={isScanning}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Maksimum Derinlik</Form.Label>
                            <Form.Control 
                              type="number" 
                              value={advancedOptions.maxDepth}
                              onChange={(e) => setAdvancedOptions({...advancedOptions, maxDepth: parseInt(e.target.value)})}
                              min={1}
                              max={10}
                              disabled={isScanning}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Check 
                        type="switch"
                        id="followRedirects"
                        label="Yönlendirmeleri Takip Et"
                        checked={advancedOptions.followRedirects}
                        onChange={(e) => setAdvancedOptions({...advancedOptions, followRedirects: e.target.checked})}
                        disabled={isScanning}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            <Button 
              variant="primary" 
              type="submit" 
              disabled={!url || isScanning}
              className="mt-2"
            >
              {isScanning ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Taranıyor...
                </>
              ) : 'Taramayı Başlat'}
            </Button>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          {isScanning && (
            <div className="mt-4">
              <p>URL taranıyor: {url}</p>
              <ProgressBar 
                animated 
                now={scanProgress} 
                label={`${scanProgress}%`} 
                variant={
                  scanProgress < 30 ? "info" : 
                  scanProgress < 70 ? "warning" : 
                  "success"
                }
                className="mb-3"
              />
              <p className="small text-muted">
                {scanProgress < 30 ? "Hedef analiz ediliyor..." : 
                 scanProgress < 70 ? "Güvenlik açıkları taranıyor..." : 
                 "Sonuçlar hazırlanıyor..."}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      {results && (
        <Card className="bg-dark text-light mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Tarama Sonuçları</h3>
            <Dropdown as={ButtonGroup}>
              <Button variant="success" disabled={!results}>
                <FontAwesomeIcon icon={faFileExport} className="me-2" />
                Dışa Aktar
              </Button>
              <Dropdown.Toggle split variant="success" disabled={!results} />
              <Dropdown.Menu className="bg-dark">
                <Dropdown.Item onClick={exportToCSV} className="text-light">
                  <FontAwesomeIcon icon={faFileCsv} className="me-2" />
                  CSV Formatında İndir
                </Dropdown.Item>
                <Dropdown.Item onClick={exportToXML} className="text-light">
                  <FontAwesomeIcon icon={faFileCode} className="me-2" />
                  XML Formatında İndir
                </Dropdown.Item>
                <Dropdown.Item onClick={exportToJSON} className="text-light">
                  <FontAwesomeIcon icon={faFileCode} className="me-2" />
                  JSON Formatında İndir
                </Dropdown.Item>
                <Dropdown.Item onClick={exportToTXT} className="text-light">
                  <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                  TXT Formatında İndir
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Card.Header>
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              <Tab eventKey="summary" title="Özet">
                <Row className="mb-4">
                  <Col md={6}>
                    <h4>Tarama Bilgileri</h4>
                    <Table variant="dark" bordered>
                      <tbody>
                        <tr>
                          <td>Hedef URL</td>
                          <td>{results.url}</td>
                        </tr>
                        <tr>
                          <td>Tarama Tipi</td>
                          <td>
                            {scanType === 'quick' ? 'Hızlı Tarama' : 
                             scanType === 'standard' ? 'Standart Tarama' : 
                             'Tam Tarama'}
                          </td>
                        </tr>
                        <tr>
                          <td>Tarama Zamanı</td>
                          <td>{results.scanTime}</td>
                        </tr>
                        <tr>
                          <td>Süre</td>
                          <td>{results.scanDuration} saniye</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <h4>Güvenlik Açıkları</h4>
                    <div className="d-flex flex-wrap gap-3 mb-3">
                      <div className="p-3 border border-danger rounded text-center">
                        <h2 className="text-danger mb-0">{getSeverityCount('Critical')}</h2>
                        <small>Kritik</small>
                      </div>
                      <div className="p-3 border border-warning rounded text-center">
                        <h2 className="text-warning mb-0">{getSeverityCount('High')}</h2>
                        <small>Yüksek</small>
                      </div>
                      <div className="p-3 border border-info rounded text-center">
                        <h2 className="text-info mb-0">{getSeverityCount('Medium')}</h2>
                        <small>Orta</small>
                      </div>
                      <div className="p-3 border border-secondary rounded text-center">
                        <h2 className="text-secondary mb-0">{getSeverityCount('Low')}</h2>
                        <small>Düşük</small>
                      </div>
                    </div>
                    <Alert variant={
                      getSeverityCount('Critical') > 0 ? 'danger' :
                      getSeverityCount('High') > 0 ? 'warning' :
                      getSeverityCount('Medium') > 0 ? 'info' : 'success'
                    }>
                      {getSeverityCount('Critical') > 0 ? 'Kritik güvenlik açıkları tespit edildi! Acil önlem alınmalı.' :
                       getSeverityCount('High') > 0 ? 'Yüksek riskli güvenlik açıkları tespit edildi. En kısa sürede düzeltilmeli.' :
                       getSeverityCount('Medium') > 0 ? 'Orta seviyeli güvenlik açıkları tespit edildi.' :
                       'Önemli güvenlik açığı tespit edilmedi.'}
                    </Alert>
                  </Col>
                </Row>

                {results.vulnerabilities && results.vulnerabilities.length > 0 && (
                  <div className="mt-4">
                    <h4>Tespit Edilen Güvenlik Açıkları</h4>
                    <Table variant="dark" striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Açık</th>
                          <th>Şiddet</th>
                          <th>Güven</th>
                          <th>Konum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.vulnerabilities.map((vuln, index) => (
                          <tr key={index}>
                            <td>{vuln.cveId || vuln.id}</td>
                            <td>{vuln.title}</td>
                            <td>
                              <Badge bg={getSeverityColor(vuln.severity)}>
                                {vuln.severity}
                              </Badge>
                            </td>
                            <td>{safeToString(vuln.cvssScore)}</td>
                            <td>{vuln.affectedComponents}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Tab>

              <Tab eventKey="vulnerabilities" title="Güvenlik Açıkları">
                {results.vulnerabilities && results.vulnerabilities.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <h4>Kategorilere Göre Güvenlik Açıkları</h4>
                      <Tabs defaultActiveKey="all" id="vulnerability-categories" className="mb-3">
                        <Tab eventKey="all" title={`Tümü (${results.vulnerabilities.length})`}>
                          {results.vulnerabilities.map((vuln, index) => (
                            <Card key={index} className="mb-3 bg-dark border-secondary">
                              <Card.Header className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">{vuln.title}</h5>
                                <Badge bg={getSeverityColor(vuln.severity)}>
                                  {vuln.severity}
                                </Badge>
                              </Card.Header>
                              <Card.Body>
                                <p><strong>ID:</strong> {vuln.cveId || vuln.id}</p>
                                <p><strong>Açıklama:</strong> {vuln.description}</p>
                                <p><strong>Konum:</strong> {vuln.affectedComponents}</p>
                                <p><strong>Kanıt:</strong> {vuln.evidence || 'N/A'}</p>
                                <p><strong>Güven Seviyesi:</strong> {safeToString(vuln.cvssScore)}</p>
                                {vuln.references && vuln.references.length > 0 && (
                                  <div className="mb-3">
                                    <strong>Referanslar:</strong>
                                    <ul>
                                      {vuln.references.map((ref, i) => (
                                        <li key={i}>
                                          <a href={ref} target="_blank" rel="noopener noreferrer" className="text-info">
                                            {ref}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                <Alert variant="info">
                                  <strong>Çözüm Önerisi:</strong> {vuln.remediation}
                                </Alert>
                              </Card.Body>
                            </Card>
                          ))}
                        </Tab>
                        
                        {Object.entries(categorizeVulnerabilities()).map(([category, data]) => (
                          <Tab 
                            key={category} 
                            eventKey={category} 
                            title={
                              <span>
                                <FontAwesomeIcon icon={data.icon} className="me-2" />
                                {data.title} ({data.items.length})
                              </span>
                            }
                          >
                            {data.items.map((vuln, index) => (
                              <Card key={index} className="mb-3 bg-dark border-secondary">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                  <h5 className="mb-0">{vuln.title}</h5>
                                  <Badge bg={getSeverityColor(vuln.severity)}>
                                    {vuln.severity}
                                  </Badge>
                                </Card.Header>
                                <Card.Body>
                                  <p><strong>ID:</strong> {vuln.cveId || vuln.id}</p>
                                  <p><strong>Açıklama:</strong> {vuln.description}</p>
                                  <p><strong>Konum:</strong> {vuln.affectedComponents}</p>
                                  <p><strong>Kanıt:</strong> {vuln.evidence || 'N/A'}</p>
                                  <p><strong>Güven Seviyesi:</strong> {safeToString(vuln.cvssScore)}</p>
                                  {vuln.references && vuln.references.length > 0 && (
                                    <div className="mb-3">
                                      <strong>Referanslar:</strong>
                                      <ul>
                                        {vuln.references.map((ref, i) => (
                                          <li key={i}>
                                            <a href={ref} target="_blank" rel="noopener noreferrer" className="text-info">
                                              {ref}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  <Alert variant="info">
                                    <strong>Çözüm Önerisi:</strong> {vuln.remediation}
                                  </Alert>
                                </Card.Body>
                              </Card>
                            ))}
                          </Tab>
                        ))}
                      </Tabs>
                    </div>
                  </>
                ) : (
                  <Alert variant="success">
                    Güvenlik açığı tespit edilmedi.
                  </Alert>
                )}
              </Tab>

              <Tab eventKey="risk-analysis" title="Risk Analizi">
                <Row className="mb-4">
                  <Col md={6}>
                    <h4>Genel Risk Değerlendirmesi</h4>
                    <Card className="bg-dark border-secondary mb-4">
                      <Card.Body className="text-center">
                        <h2>Risk Skoru</h2>
                        <div className="d-flex justify-content-center align-items-center my-3">
                          <div 
                            className={`rounded-circle border border-${getRiskScoreColor(calculateRiskScore())} d-flex justify-content-center align-items-center`} 
                            style={{width: '150px', height: '150px'}}
                          >
                            <h1 className={`text-${getRiskScoreColor(calculateRiskScore())}`}>{calculateRiskScore()}</h1>
                          </div>
                        </div>
                        <p className="mb-0">
                          {calculateRiskScore() >= 75 ? 'Kritik risk seviyesi. Acil önlem alınmalı!' :
                           calculateRiskScore() >= 50 ? 'Yüksek risk seviyesi. Kısa sürede önlem alınmalı.' :
                           calculateRiskScore() >= 25 ? 'Orta risk seviyesi. Planlı şekilde önlem alınmalı.' :
                           'Düşük risk seviyesi. Standart güvenlik önlemleri yeterli.'}
                        </p>
                      </Card.Body>
                    </Card>
                    
                    <h4>Öncelikli Çözüm Önerileri</h4>
                    <ListGroup variant="flush">
                      {prioritizeRemediation().map((item, index) => (
                        <ListGroup.Item key={index} className="bg-dark text-light border-secondary">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <Badge bg={getSeverityColor(item.severity)} className="me-2">
                                {item.severity}
                              </Badge>
                              <strong>{item.title}</strong>
                            </div>
                            <Badge bg="secondary">{index + 1}</Badge>
                          </div>
                          <p className="mt-2 mb-0 text-muted">{item.remediation}</p>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Col>
                  
                  <Col md={6}>
                    <h4>Zafiyet Dağılımı</h4>
                    <Card className="bg-dark border-secondary mb-4">
                      <Card.Body>
                        <div className="mb-3">
                          <h5>Önem Derecesine Göre</h5>
                          <div className="d-flex flex-column gap-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Kritik</span>
                              <span>{getSeverityCount('Critical')}</span>
                            </div>
                            <ProgressBar 
                              variant="danger" 
                              now={getSeverityCount('Critical')} 
                              max={results?.vulnerabilities?.length || 1} 
                              className="mb-2"
                            />
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Yüksek</span>
                              <span>{getSeverityCount('High')}</span>
                            </div>
                            <ProgressBar 
                              variant="warning" 
                              now={getSeverityCount('High')} 
                              max={results?.vulnerabilities?.length || 1} 
                              className="mb-2"
                            />
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Orta</span>
                              <span>{getSeverityCount('Medium')}</span>
                            </div>
                            <ProgressBar 
                              variant="info" 
                              now={getSeverityCount('Medium')} 
                              max={results?.vulnerabilities?.length || 1} 
                              className="mb-2"
                            />
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Düşük</span>
                              <span>{getSeverityCount('Low')}</span>
                            </div>
                            <ProgressBar 
                              variant="secondary" 
                              now={getSeverityCount('Low')} 
                              max={results?.vulnerabilities?.length || 1} 
                              className="mb-2"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h5>Kategorilere Göre</h5>
                          <div className="d-flex flex-column gap-2">
                            {Object.entries(categorizeVulnerabilities()).map(([category, data]) => (
                              <div key={category}>
                                <div className="d-flex justify-content-between align-items-center">
                                  <span>{data.title}</span>
                                  <span>{data.items.length}</span>
                                </div>
                                <ProgressBar 
                                  variant={
                                    category === 'ssl-tls' ? 'danger' :
                                    category === 'network' ? 'warning' :
                                    category === 'web-app' ? 'info' :
                                    'secondary'
                                  } 
                                  now={data.items.length} 
                                  max={results?.vulnerabilities?.length || 1} 
                                  className="mb-2"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                    
                    {analyzeVulnerabilityTrends() && (
                      <Card className="bg-dark border-secondary">
                        <Card.Header>
                          <h5 className="mb-0">Zafiyet Trendleri</h5>
                        </Card.Header>
                        <Card.Body>
                          {analyzeVulnerabilityTrends().improved.length > 0 && (
                            <Alert variant="success">
                              <FontAwesomeIcon icon={faArrowDown} className="me-2" />
                              <strong>İyileşme:</strong> Önceki taramalara göre {analyzeVulnerabilityTrends().improved.length} iyileşme tespit edildi.
                            </Alert>
                          )}
                          
                          {analyzeVulnerabilityTrends().worsened.length > 0 && (
                            <Alert variant="danger">
                              <FontAwesomeIcon icon={faArrowUp} className="me-2" />
                              <strong>Kötüleşme:</strong> Önceki taramalara göre {analyzeVulnerabilityTrends().worsened.length} kötüleşme tespit edildi.
                            </Alert>
                          )}
                          
                          {analyzeVulnerabilityTrends().unchanged.length > 0 && (
                            <Alert variant="secondary">
                              <FontAwesomeIcon icon={faMinus} className="me-2" />
                              <strong>Değişim Yok:</strong> Önceki taramalara göre {analyzeVulnerabilityTrends().unchanged.length} taramada değişiklik yok.
                            </Alert>
                          )}
                        </Card.Body>
                      </Card>
                    )}
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="headers" title="HTTP Başlıkları">
                <h4 className="mb-3">HTTP Yanıt Başlıkları</h4>
                <Table variant="dark" striped bordered hover>
                  <thead>
                    <tr>
                      <th>Başlık</th>
                      <th>Değer</th>
                      <th>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(results.headers).map(([key, value], index) => (
                      <tr key={index}>
                        <td>{key}</td>
                        <td>{value || '-'}</td>
                        <td>
                          {key === 'x-powered-by' || key === 'server' ? (
                            <Badge bg="warning">Bilgi İfşası</Badge>
                          ) : value ? (
                            <Badge bg="success">Mevcut</Badge>
                          ) : (
                            <Badge bg="danger">Eksik</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Alert variant="info" className="mt-3">
                  <h5>Güvenlik Başlıkları Önerileri</h5>
                  <ul>
                    {!results.headers['content-security-policy'] && (
                      <li><strong>Content-Security-Policy:</strong> XSS saldırılarına karşı koruma sağlar</li>
                    )}
                    {!results.headers['x-frame-options'] && (
                      <li><strong>X-Frame-Options:</strong> Clickjacking saldırılarına karşı koruma sağlar</li>
                    )}
                    {!results.headers['x-xss-protection'] && (
                      <li><strong>X-XSS-Protection:</strong> Tarayıcı XSS korumasını etkinleştirir</li>
                    )}
                    {!results.headers['strict-transport-security'] && (
                      <li><strong>Strict-Transport-Security:</strong> HTTPS kullanımını zorunlu kılar</li>
                    )}
                    {(results.headers['server'] || results.headers['x-powered-by']) && (
                      <li><strong>Server, X-Powered-By:</strong> Bu başlıkları gizleyerek bilgi ifşasını önleyin</li>
                    )}
                  </ul>
                </Alert>
              </Tab>

              <Tab eventKey="technologies" title="Teknolojiler">
                <h4 className="mb-3">Tespit Edilen Teknolojiler</h4>
                {results.technologies && results.technologies.length > 0 ? (
                  <Table variant="dark" striped bordered hover>
                    <thead>
                      <tr>
                        <th>Teknoloji</th>
                        <th>Versiyon</th>
                        <th>Güven</th>
                        <th>Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.technologies.map((tech, index) => (
                        <tr key={index}>
                          <td>{tech.name}</td>
                          <td>{tech.version}</td>
                          <td>{tech.confidence}</td>
                          <td>
                            {results.vulnerabilities.some(v => v.affectedComponents.includes(`${tech.name} ${tech.version}`)) ? (
                              <Badge bg="danger">Güvenlik Açığı Var</Badge>
                            ) : (
                              <Badge bg="success">Güvenli</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">
                    Teknoloji tespit edilemedi.
                  </Alert>
                )}

                <Alert variant="warning" className="mt-3">
                  <h5>Versiyon Bilgisi Riski</h5>
                  <p>
                    Tespit edilen teknolojilerin versiyonları, bilinen güvenlik açıklarına sahip olabilir.
                    Tüm yazılımların güncel olduğundan emin olun ve düzenli olarak güvenlik güncellemelerini kontrol edin.
                  </p>
                </Alert>
              </Tab>

              <Tab eventKey="infrastructure" title="Altyapı Bilgileri">
                <Row className="mb-4">
                  <Col md={6}>
                    <h4>Web Uygulama Güvenlik Duvarı (WAF)</h4>
                    <Card className="bg-dark border-secondary mb-4">
                      <Card.Body>
                        {results.waf && results.waf.detected ? (
                          <>
                            <Alert variant="warning">
                              <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                              <strong>WAF Tespit Edildi: {results.waf.type}</strong>
                            </Alert>
                            <p><strong>Kanıt:</strong> {results.waf.evidence}</p>
                            <p className="mb-0 text-muted">
                              Web Uygulama Güvenlik Duvarı (WAF), web uygulamalarını çeşitli saldırılara karşı korur. 
                              WAF varlığı, sitenin güvenlik önlemlerinin bir parçasıdır ancak tek başına yeterli değildir.
                            </p>
                          </>
                        ) : (
                          <Alert variant="danger">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                            <strong>WAF Tespit Edilemedi</strong>
                            <p className="mb-0 mt-2">
                              Web Uygulama Güvenlik Duvarı (WAF) tespit edilemedi. Bu, web uygulamanızın SQL Injection, XSS ve diğer yaygın web saldırılarına karşı savunmasız olabileceğini gösterir.
                            </p>
                          </Alert>
                        )}
                      </Card.Body>
                    </Card>
                    
                    <h4>CORS Yapılandırması</h4>
                    <Card className="bg-dark border-secondary mb-4">
                      <Card.Body>
                        {results.cors && Object.keys(results.cors).length > 0 ? (
                          <>
                            <Table variant="dark" bordered size="sm">
                              <thead>
                                <tr>
                                  <th>CORS Başlığı</th>
                                  <th>Değer</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(results.cors).map(([header, value]) => (
                                  value && (
                                    <tr key={header}>
                                      <td>{header}</td>
                                      <td>{value}</td>
                                    </tr>
                                  )
                                ))}
                              </tbody>
                            </Table>
                            
                            {results.cors['access-control-allow-origin'] === '*' ? (
                              <Alert variant="warning" className="mt-3">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                                <strong>Geniş CORS Politikası</strong>
                                <p className="mb-0 mt-2">
                                  CORS politikası tüm kaynaklara izin veriyor (*). Bu, kötü niyetli sitelerin API'nize istek yapmasına izin verebilir.
                                </p>
                              </Alert>
                            ) : results.cors['access-control-allow-origin'] ? (
                              <Alert variant="success" className="mt-3">
                                <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                                <strong>Belirli Kaynaklara İzin Veren CORS Politikası</strong>
                                <p className="mb-0 mt-2">
                                  CORS politikası belirli kaynaklara izin veriyor. Bu, güvenlik açısından iyi bir uygulamadır.
                                </p>
                              </Alert>
                            ) : (
                              <Alert variant="info" className="mt-3">
                                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                <strong>CORS Başlıkları Eksik</strong>
                                <p className="mb-0 mt-2">
                                  CORS başlıkları tespit edilemedi. Bu, sitenin cross-origin istekleri kabul etmediğini gösterebilir.
                                </p>
                              </Alert>
                            )}
                          </>
                        ) : (
                          <Alert variant="info">
                            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                            <strong>CORS Yapılandırması Tespit Edilemedi</strong>
                          </Alert>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6}>
                    <h4>DNS Kayıtları</h4>
                    <Card className="bg-dark border-secondary mb-4">
                      <Card.Body>
                        {results.dns && Object.keys(results.dns).length > 0 ? (
                          <Tabs defaultActiveKey="a" id="dns-records-tabs" className="mb-3">
                            <Tab eventKey="a" title="A Kayıtları">
                              {results.dns.a && results.dns.a.length > 0 ? (
                                <Table variant="dark" bordered size="sm">
                                  <thead>
                                    <tr>
                                      <th>IP Adresi</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {results.dns.a.map((record, index) => (
                                      <tr key={index}>
                                        <td>{record}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              ) : (
                                <Alert variant="info">A kaydı bulunamadı.</Alert>
                              )}
                            </Tab>
                            
                            <Tab eventKey="mx" title="MX Kayıtları">
                              {results.dns.mx && results.dns.mx.length > 0 ? (
                                <Table variant="dark" bordered size="sm">
                                  <thead>
                                    <tr>
                                      <th>Öncelik</th>
                                      <th>Mail Sunucusu</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {results.dns.mx.map((record, index) => (
                                      <tr key={index}>
                                        <td>{record.priority}</td>
                                        <td>{record.exchange}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              ) : (
                                <Alert variant="info">MX kaydı bulunamadı.</Alert>
                              )}
                            </Tab>
                            
                            <Tab eventKey="txt" title="TXT Kayıtları">
                              {results.dns.txt && results.dns.txt.length > 0 ? (
                                <Table variant="dark" bordered size="sm">
                                  <thead>
                                    <tr>
                                      <th>TXT Kaydı</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {results.dns.txt.map((record, index) => (
                                      <tr key={index}>
                                        <td>{Array.isArray(record) ? record.join('') : record}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              ) : (
                                <Alert variant="info">TXT kaydı bulunamadı.</Alert>
                              )}
                            </Tab>
                            
                            <Tab eventKey="ns" title="NS Kayıtları">
                              {results.dns.ns && results.dns.ns.length > 0 ? (
                                <Table variant="dark" bordered size="sm">
                                  <thead>
                                    <tr>
                                      <th>İsim Sunucusu</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {results.dns.ns.map((record, index) => (
                                      <tr key={index}>
                                        <td>{record}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              ) : (
                                <Alert variant="info">NS kaydı bulunamadı.</Alert>
                              )}
                            </Tab>
                          </Tabs>
                        ) : (
                          <Alert variant="info">
                            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                            <strong>DNS Kayıtları Tespit Edilemedi</strong>
                          </Alert>
                        )}
                      </Card.Body>
                    </Card>
                    
                    <h4>E-posta Güvenliği</h4>
                    <Card className="bg-dark border-secondary">
                      <Card.Body>
                        {results.dnsSecurityInfo ? (
                          <div>
                            <Table variant="dark" bordered>
                              <tbody>
                                <tr>
                                  <td>SPF Kaydı</td>
                                  <td>
                                    {results.dnsSecurityInfo.hasSPF ? (
                                      <Badge bg="success">Mevcut</Badge>
                                    ) : (
                                      <Badge bg="danger">Eksik</Badge>
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>DKIM Kaydı</td>
                                  <td>
                                    {results.dnsSecurityInfo.hasDKIM ? (
                                      <Badge bg="success">Mevcut</Badge>
                                    ) : (
                                      <Badge bg="danger">Eksik</Badge>
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>DMARC Kaydı</td>
                                  <td>
                                    {results.dnsSecurityInfo.hasDMARC ? (
                                      <Badge bg="success">Mevcut</Badge>
                                    ) : (
                                      <Badge bg="danger">Eksik</Badge>
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                            
                            {(!results.dnsSecurityInfo.hasSPF || !results.dnsSecurityInfo.hasDMARC) && 
                             results.dns && results.dns.mx && results.dns.mx.length > 0 && (
                              <Alert variant="warning" className="mt-3">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                                <strong>E-posta Güvenlik Eksikliği</strong>
                                <p className="mb-0 mt-2">
                                  E-posta sunucusu tespit edildi ancak 
                                  {!results.dnsSecurityInfo.hasSPF && ' SPF'} 
                                  {!results.dnsSecurityInfo.hasSPF && !results.dnsSecurityInfo.hasDMARC && ' ve'} 
                                  {!results.dnsSecurityInfo.hasDMARC && ' DMARC'} 
                                  {' '}
                                  kaydı bulunamadı. Bu, e-posta sahteciliğine (spoofing) karşı koruma eksikliği anlamına gelir.
                                </p>
                              </Alert>
                            )}
                          </div>
                        ) : (
                          <Alert variant="info">
                            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                            <strong>E-posta Güvenlik Bilgileri Tespit Edilemedi</strong>
                          </Alert>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Card.Body>
          <Card.Footer>
            <Alert variant="info">
              <h5>Sonraki Adımlar</h5>
              <ol>
                <li>Tespit edilen güvenlik açıklarını önceliklendirilmiş şekilde düzeltin</li>
                <li>Eksik güvenlik başlıklarını ekleyin</li>
                <li>Yazılım versiyonlarını güncel tutun</li>
                <li>Düzenli olarak güvenlik taramaları yapın</li>
                <li>Güvenlik açıklarını düzelttikten sonra yeniden tarama yapın</li>
              </ol>
            </Alert>
          </Card.Footer>
        </Card>
      )}

      {/* Geçmiş Taramalar Modalı */}
      <Modal 
        show={showHistoryModal} 
        onHide={() => setShowHistoryModal(false)}
        size="lg"
        centered
        className="text-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Geçmiş Taramalar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoadingHistory ? (
            <div className="text-center p-4">
              <Spinner animation="border" />
              <p className="mt-2">Geçmiş taramalar yükleniyor...</p>
            </div>
          ) : scanHistory.length === 0 ? (
            <Alert variant="info">
              <FontAwesomeIcon icon={faHistory} className="me-2" />
              Henüz kaydedilmiş tarama bulunmuyor.
            </Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>URL</th>
                  <th>Tarama Tipi</th>
                  <th>Güvenlik Açıkları</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {scanHistory.map((scan) => (
                  <tr key={scan.id}>
                    <td>{new Date(scan.timestamp).toLocaleString()}</td>
                    <td>{scan.target}</td>
                    <td>
                      {scan.scanType === 'quick' ? 'Hızlı' : 
                       scan.scanType === 'standard' ? 'Standart' : 'Tam'}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        {scan.summary.critical > 0 && (
                          <Badge bg="danger">{scan.summary.critical} Kritik</Badge>
                        )}
                        {scan.summary.high > 0 && (
                          <Badge bg="warning">{scan.summary.high} Yüksek</Badge>
                        )}
                        {scan.summary.medium > 0 && (
                          <Badge bg="info">{scan.summary.medium} Orta</Badge>
                        )}
                        {scan.summary.low > 0 && (
                          <Badge bg="secondary">{scan.summary.low} Düşük</Badge>
                        )}
                        {scan.summary.critical === 0 && scan.summary.high === 0 && 
                         scan.summary.medium === 0 && scan.summary.low === 0 && (
                          <Badge bg="success">Temiz</Badge>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => loadHistoryScan(scan)}
                          title="Sonuçları Yükle"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        <Button 
                          variant="info" 
                          size="sm"
                          onClick={() => viewHistoryScan(scan)}
                          title="Detayları Görüntüle"
                        >
                          <FontAwesomeIcon icon={faChartBar} />
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => deleteScanHistory(scan.id)}
                          title="Taramayı Sil"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>
            Kapat
          </Button>
          <Button 
            variant="primary" 
            onClick={fetchScanHistory}
            disabled={isLoadingHistory}
          >
            {isLoadingHistory ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Yenileniyor...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faHistory} className="me-2" />
                Yenile
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Geçmiş Tarama Detayları Modalı */}
      <Modal 
        show={showHistoryDetailModal} 
        onHide={() => setShowHistoryDetailModal(false)}
        size="lg"
        centered
        className="text-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Tarama Detayları</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHistoryScan && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Tarama Bilgileri</h5>
                  <Table bordered>
                    <tbody>
                      <tr>
                        <td>Hedef URL</td>
                        <td>{selectedHistoryScan.target}</td>
                      </tr>
                      <tr>
                        <td>Tarama Tipi</td>
                        <td>
                          {selectedHistoryScan.scanType === 'quick' ? 'Hızlı Tarama' : 
                           selectedHistoryScan.scanType === 'standard' ? 'Standart Tarama' : 
                           'Tam Tarama'}
                        </td>
                      </tr>
                      <tr>
                        <td>Tarama Zamanı</td>
                        <td>{new Date(selectedHistoryScan.timestamp).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>Süre</td>
                        <td>{selectedHistoryScan.scanDuration} saniye</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <h5>Güvenlik Açıkları Özeti</h5>
                  <div className="d-flex flex-wrap gap-3 mb-3">
                    <div className="p-3 border border-danger rounded text-center">
                      <h2 className="text-danger mb-0">{selectedHistoryScan.summary.critical}</h2>
                      <small>Kritik</small>
                    </div>
                    <div className="p-3 border border-warning rounded text-center">
                      <h2 className="text-warning mb-0">{selectedHistoryScan.summary.high}</h2>
                      <small>Yüksek</small>
                    </div>
                    <div className="p-3 border border-info rounded text-center">
                      <h2 className="text-info mb-0">{selectedHistoryScan.summary.medium}</h2>
                      <small>Orta</small>
                    </div>
                    <div className="p-3 border border-secondary rounded text-center">
                      <h2 className="text-secondary mb-0">{selectedHistoryScan.summary.low}</h2>
                      <small>Düşük</small>
                    </div>
                  </div>
                </Col>
              </Row>

              {selectedHistoryScan.vulnerabilities && selectedHistoryScan.vulnerabilities.length > 0 ? (
                <>
                  <h5>Tespit Edilen Güvenlik Açıkları</h5>
                  <ListGroup variant="flush">
                    {selectedHistoryScan.vulnerabilities.map((vuln, index) => (
                      <ListGroup.Item key={index} className="bg-light">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6>{vuln.title}</h6>
                            <p className="mb-1">{vuln.description}</p>
                            <small className="text-muted">Konum: {vuln.affectedComponents}</small>
                          </div>
                          <Badge bg={
                            vuln.severity === 'Critical' ? 'danger' :
                            vuln.severity === 'High' ? 'warning' :
                            vuln.severity === 'Medium' ? 'info' : 'secondary'
                          }>
                            {vuln.severity}
                          </Badge>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </>
              ) : (
                <Alert variant="success">
                  <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                  Bu taramada güvenlik açığı tespit edilmedi.
                </Alert>
              )}

              {selectedHistoryScan.technologies && selectedHistoryScan.technologies.length > 0 && (
                <>
                  <h5 className="mt-4">Tespit Edilen Teknolojiler</h5>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>Teknoloji</th>
                        <th>Versiyon</th>
                        <th>Güven</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedHistoryScan.technologies.map((tech, index) => (
                        <tr key={index}>
                          <td>{tech.name}</td>
                          <td>{tech.version}</td>
                          <td>{tech.confidence}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHistoryDetailModal(false)}>
            Kapat
          </Button>
          {selectedHistoryScan && (
            <Button 
              variant="primary" 
              onClick={() => {
                loadHistoryScan(selectedHistoryScan);
                setShowHistoryDetailModal(false);
              }}
            >
              <FontAwesomeIcon icon={faEye} className="me-2" />
              Sonuçları Yükle
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Layout>
  );
} 