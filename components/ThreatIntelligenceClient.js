import { useState } from 'react';
import Layout from './Layout';
import { Card, Button, Form, Alert, Table, Badge, Spinner, Row, Col, Tabs, Tab, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShieldAlt, faExclamationTriangle, faInfoCircle, faGlobe, faServer, faCode } from '@fortawesome/free-solid-svg-icons';

export default function ThreatIntelligenceClient() {
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState('ip');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query) {
      setError('Lütfen bir sorgu girin');
      return;
    }

    setIsLoading(true);
    setResults(null);
    setError('');

    try {
      // Gerçek API endpoint'ine istek gönder
      const response = await fetch('/api/threat-intelligence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          queryType
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sorgu sırasında bir hata oluştu');
      }

      const data = await response.json();
      setResults(data);
      setActiveTab('summary');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Simüle edilmiş tehdit istihbaratı sonuçları
  const simulateResults = () => {
    const ipResults = {
      query: query,
      queryType: 'ip',
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

    const domainResults = {
      query: query,
      queryType: 'domain',
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

    const hashResults = {
      query: query,
      queryType: 'hash',
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

    if (queryType === 'ip') {
      return ipResults;
    } else if (queryType === 'domain') {
      return domainResults;
    } else if (queryType === 'hash') {
      return hashResults;
    }
  };

  const handleSimulate = () => {
    if (!query) {
      setError('Lütfen bir sorgu girin');
      return;
    }
    
    setResults(simulateResults());
  };

  const renderIPResults = () => {
    if (!results || !results.results) return null;
    const data = results.results;

    return (
      <>
        <Card className="mb-4 bg-dark text-light">
          <Card.Header>
            <h4>IP Bilgileri</h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>IP Adresi:</strong> {data.ip}</p>
                <p><strong>Ülke:</strong> {data.location.country}</p>
                <p><strong>Şehir:</strong> {data.location.city}</p>
                <p><strong>Koordinatlar:</strong> {data.location.latitude}, {data.location.longitude}</p>
              </Col>
              <Col md={6}>
                <p><strong>Tehdit Skoru:</strong> <Badge bg={data.reputation.score > 70 ? 'danger' : data.reputation.score > 40 ? 'warning' : 'success'}>{data.reputation.score}/100</Badge></p>
                <p><strong>Kategori:</strong> {data.reputation.category}</p>
                <p><strong>Son Rapor:</strong> {data.reputation.lastReported}</p>
                <p><strong>Kara Listeler:</strong> {data.blacklists.join(', ')}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mb-4 bg-dark text-light">
          <Card.Header>
            <h4>Tespit Edilen Aktiviteler</h4>
          </Card.Header>
          <Card.Body>
            <Table variant="dark" striped bordered hover>
              <thead>
                <tr>
                  <th>Aktivite Tipi</th>
                  <th>İlk Görülme</th>
                  <th>Son Görülme</th>
                  <th>Sıklık</th>
                  <th>Detaylar</th>
                </tr>
              </thead>
              <tbody>
                {data.activities.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.type}</td>
                    <td>{activity.firstSeen}</td>
                    <td>{activity.lastSeen}</td>
                    <td>{activity.frequency}</td>
                    <td>
                      {activity.targets && <div>Hedefler: {activity.targets.join(', ')}</div>}
                      {activity.malwareFamily && <div>Zararlı Yazılım: {activity.malwareFamily}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Card className="mb-4 bg-dark text-light">
          <Card.Header>
            <h4>İlişkili IP Adresleri</h4>
          </Card.Header>
          <Card.Body>
            <ul className="list-group list-group-flush bg-dark">
              {data.relatedIPs.map((ip, index) => (
                <li key={index} className="list-group-item bg-dark text-light">{ip}</li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      </>
    );
  };

  const renderDomainResults = () => {
    if (!results || !results.results) return null;
    const data = results.results;

    return (
      <>
        <Card className="mb-4 bg-dark text-light">
          <Card.Header>
            <h4>Alan Adı Bilgileri</h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Alan Adı:</strong> {data.domain}</p>
                <p><strong>Kayıt Şirketi:</strong> {data.registrationInfo.registrar}</p>
                <p><strong>Oluşturma Tarihi:</strong> {data.registrationInfo.creationDate}</p>
                <p><strong>Bitiş Tarihi:</strong> {data.registrationInfo.expirationDate}</p>
                <p><strong>Son Güncelleme:</strong> {data.registrationInfo.lastUpdated}</p>
              </Col>
              <Col md={6}>
                <p><strong>Tehdit Skoru:</strong> <Badge bg={data.reputation.score > 70 ? 'danger' : data.reputation.score > 40 ? 'warning' : 'success'}>{data.reputation.score}/100</Badge></p>
                <p><strong>Kategori:</strong> {data.reputation.category}</p>
                <p><strong>Son Rapor:</strong> {data.reputation.lastReported}</p>
                <p><strong>Kara Listeler:</strong> {data.blacklists.join(', ')}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mb-4 bg-dark text-light">
          <Card.Header>
            <h4>DNS Kayıtları</h4>
          </Card.Header>
          <Card.Body>
            <Table variant="dark" striped bordered hover>
              <thead>
                <tr>
                  <th>Kayıt Tipi</th>
                  <th>Değer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A</td>
                  <td>{data.dns.a.join(', ')}</td>
                </tr>
                <tr>
                  <td>MX</td>
                  <td>{data.dns.mx.join(', ')}</td>
                </tr>
                <tr>
                  <td>NS</td>
                  <td>{data.dns.ns.join(', ')}</td>
                </tr>
                <tr>
                  <td>TXT</td>
                  <td>{data.dns.txt.join(', ')}</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Card className="mb-4 bg-dark text-light">
          <Card.Header>
            <h4>Tespit Edilen Aktiviteler</h4>
          </Card.Header>
          <Card.Body>
            <Table variant="dark" striped bordered hover>
              <thead>
                <tr>
                  <th>Aktivite Tipi</th>
                  <th>İlk Görülme</th>
                  <th>Son Görülme</th>
                  <th>Sıklık</th>
                  <th>Hedefler</th>
                </tr>
              </thead>
              <tbody>
                {data.activities.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.type}</td>
                    <td>{activity.firstSeen}</td>
                    <td>{activity.lastSeen}</td>
                    <td>{activity.frequency}</td>
                    <td>{activity.targets.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Card className="mb-4 bg-dark text-light">
          <Card.Header>
            <h4>İlişkili Alan Adları</h4>
          </Card.Header>
          <Card.Body>
            <ul className="list-group list-group-flush bg-dark">
              {data.relatedDomains.map((domain, index) => (
                <li key={index} className="list-group-item bg-dark text-light">{domain}</li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      </>
    );
  };

  const renderHashResults = () => {
    if (!results || !results.results) return null;
    const data = results.results;

    return (
      <>
        <Card className="mb-4 bg-dark text-light">
          <Card.Header>
            <h4>Dosya Bilgileri</h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Hash:</strong> {data.hash}</p>
                <p><strong>Dosya Adı:</strong> {data.fileInfo.fileName}</p>
                <p><strong>Dosya Boyutu:</strong> {data.fileInfo.fileSize}</p>
                <p><strong>Dosya Tipi:</strong> {data.fileInfo.fileType}</p>
                <p><strong>Derleme Zamanı:</strong> {data.fileInfo.compilationTime}</p>
              </Col>
              <Col md={6}>
                <p><strong>Tehdit Skoru:</strong> <Badge bg={data.reputation.score > 70 ? 'danger' : data.reputation.score > 40 ? 'warning' : 'success'}>{data.reputation.score}/100</Badge></p>
                <p><strong>Kategori:</strong> {data.reputation.category}</p>
                <p><strong>Son Rapor:</strong> {data.reputation.lastReported}</p>
                <p><strong>Tespit Oranı:</strong> {data.detections.antivirusCount}/{data.detections.totalEngines}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mb-4 bg-dark text-light">
          <Card.Header>
            <h4>Zararlı Yazılım Bilgileri</h4>
          </Card.Header>
          <Card.Body>
            <p><strong>Tür:</strong> {data.malwareInfo.type}</p>
            <p><strong>Aile:</strong> {data.malwareInfo.family}</p>
            <p><strong>Yetenekler:</strong></p>
            <ul>
              {data.malwareInfo.capabilities.map((capability, index) => (
                <li key={index}>{capability}</li>
              ))}
            </ul>
          </Card.Body>
        </Card>

        <Card className="mb-4 bg-dark text-light">
          <Card.Header>
            <h4>İlişkili Hash Değerleri</h4>
          </Card.Header>
          <Card.Body>
            <ul className="list-group list-group-flush bg-dark">
              {data.relatedHashes.map((hash, index) => (
                <li key={index} className="list-group-item bg-dark text-light">{hash}</li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      </>
    );
  };

  const renderResults = () => {
    if (!results || !results.results) return null;

    if (results.queryType === 'ip') {
      return renderIPResults();
    } else if (results.queryType === 'domain') {
      return renderDomainResults();
    } else if (results.queryType === 'hash') {
      return renderHashResults();
    }

    return <Alert variant="warning">Desteklenmeyen sorgu tipi</Alert>;
  };

  return (
    <Layout>
      <h1 className="mb-4">Tehdit İstihbaratı</h1>
      
      <Card className="bg-dark text-light mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Sorgu Tipi</Form.Label>
              <Form.Select 
                value={queryType}
                onChange={(e) => setQueryType(e.target.value)}
                disabled={isLoading}
              >
                <option value="ip">IP Adresi</option>
                <option value="domain">Alan Adı</option>
                <option value="hash">Dosya Hash (MD5, SHA1, SHA256)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                {queryType === 'ip' ? 'IP Adresi' : 
                 queryType === 'domain' ? 'Alan Adı' : 
                 'Hash Değeri'}
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    queryType === 'ip' ? 'Örn: 8.8.8.8' :
                    queryType === 'domain' ? 'Örn: example.com' :
                    'Örn: d41d8cd98f00b204e9800998ecf8427e'
                  }
                  disabled={isLoading}
                />
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Sorgulanıyor...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSearch} className="me-2" />
                      Sorgula
                    </>
                  )}
                </Button>
                <Button variant="secondary" onClick={handleSimulate} disabled={isLoading}>
                  Simüle Et
                </Button>
              </InputGroup>
              <Form.Text className="text-muted">
                {queryType === 'ip' ? 'Bir IP adresinin tehdit istihbaratı bilgilerini sorgulayın' :
                 queryType === 'domain' ? 'Bir alan adının tehdit istihbaratı bilgilerini sorgulayın' :
                 'Bir dosya hash değerinin tehdit istihbaratı bilgilerini sorgulayın'}
              </Form.Text>
            </Form.Group>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Card.Body>
      </Card>

      {results && results.results && results.results.reputation && (
        <Card className="bg-dark text-light mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Tehdit İstihbaratı Sonuçları</h3>
            <Badge bg={
              results.results.reputation.score > 70 ? 'danger' :
              results.results.reputation.score > 40 ? 'warning' :
              'success'
            } className="fs-6">
              {results.results.reputation.score > 70 ? 'Yüksek Risk' :
               results.results.reputation.score > 40 ? 'Orta Risk' :
               'Düşük Risk'}
            </Badge>
          </Card.Header>
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              <Tab eventKey="summary" title="Özet">
                <Alert variant={
                  results.results.reputation.score > 70 ? 'danger' :
                  results.results.reputation.score > 40 ? 'warning' :
                  'success'
                }>
                  <FontAwesomeIcon icon={
                    results.results.reputation.score > 70 ? faExclamationTriangle :
                    results.results.reputation.score > 40 ? faInfoCircle :
                    faShieldAlt
                  } className="me-2" />
                  {results.results.reputation.score > 70 ? 'Bu sorgu yüksek riskli olarak tespit edilmiştir!' :
                   results.results.reputation.score > 40 ? 'Bu sorgu orta riskli olarak tespit edilmiştir.' :
                   'Bu sorgu düşük riskli olarak tespit edilmiştir.'}
                </Alert>

                <Row className="mb-4">
                  <Col md={6}>
                    <Card className="bg-dark border-secondary">
                      <Card.Header>
                        <h5 className="mb-0">
                          <FontAwesomeIcon icon={
                            queryType === 'ip' ? faServer :
                            queryType === 'domain' ? faGlobe :
                            faCode
                          } className="me-2" />
                          {queryType === 'ip' ? 'IP Bilgileri' :
                           queryType === 'domain' ? 'Alan Adı Bilgileri' :
                           'Dosya Bilgileri'}
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        {queryType === 'ip' && (
                          <>
                            <p><strong>IP:</strong> {results.results.ip}</p>
                            <p><strong>Konum:</strong> {results.results.location.country}, {results.results.location.city}</p>
                          </>
                        )}
                        {queryType === 'domain' && (
                          <>
                            <p><strong>Alan Adı:</strong> {results.results.domain}</p>
                            <p><strong>Kayıt Şirketi:</strong> {results.results.registrationInfo.registrar}</p>
                            <p><strong>Oluşturma Tarihi:</strong> {results.results.registrationInfo.creationDate}</p>
                          </>
                        )}
                        {queryType === 'hash' && (
                          <>
                            <p><strong>Hash:</strong> {results.results.hash}</p>
                            <p><strong>Dosya Adı:</strong> {results.results.fileInfo.fileName}</p>
                            <p><strong>Dosya Tipi:</strong> {results.results.fileInfo.fileType}</p>
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="bg-dark border-secondary">
                      <Card.Header>
                        <h5 className="mb-0">
                          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                          Tehdit Bilgileri
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <p><strong>Tehdit Skoru:</strong> <Badge bg={
                          results.results.reputation.score > 70 ? 'danger' :
                          results.results.reputation.score > 40 ? 'warning' :
                          'success'
                        }>{results.results.reputation.score}/100</Badge></p>
                        <p><strong>Kategori:</strong> {results.results.reputation.category}</p>
                        <p><strong>Son Rapor:</strong> {results.results.reputation.lastReported}</p>
                        {queryType === 'ip' && (
                          <p><strong>Kara Listeler:</strong> {results.results.blacklists.join(', ')}</p>
                        )}
                        {queryType === 'domain' && (
                          <p><strong>Kara Listeler:</strong> {results.results.blacklists.join(', ')}</p>
                        )}
                        {queryType === 'hash' && (
                          <p><strong>Tespit Oranı:</strong> {results.results.detections.antivirusCount}/{results.results.detections.totalEngines}</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {queryType === 'ip' && results.results.activities && results.results.activities.length > 0 && (
                  <Card className="bg-dark border-secondary mb-4">
                    <Card.Header>
                      <h5 className="mb-0">Son Aktiviteler</h5>
                    </Card.Header>
                    <Card.Body>
                      <Table variant="dark" striped bordered hover>
                        <thead>
                          <tr>
                            <th>Aktivite Tipi</th>
                            <th>Son Görülme</th>
                            <th>Sıklık</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.results.activities.map((activity, index) => (
                            <tr key={index}>
                              <td>{activity.type}</td>
                              <td>{activity.lastSeen}</td>
                              <td>{activity.frequency}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                )}

                {queryType === 'domain' && results.results.activities && results.results.activities.length > 0 && (
                  <Card className="bg-dark border-secondary mb-4">
                    <Card.Header>
                      <h5 className="mb-0">Son Aktiviteler</h5>
                    </Card.Header>
                    <Card.Body>
                      <Table variant="dark" striped bordered hover>
                        <thead>
                          <tr>
                            <th>Aktivite Tipi</th>
                            <th>Son Görülme</th>
                            <th>Sıklık</th>
                            <th>Hedefler</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.results.activities.map((activity, index) => (
                            <tr key={index}>
                              <td>{activity.type}</td>
                              <td>{activity.lastSeen}</td>
                              <td>{activity.frequency}</td>
                              <td>{activity.targets.join(', ')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                )}

                {queryType === 'hash' && (
                  <Card className="bg-dark border-secondary mb-4">
                    <Card.Header>
                      <h5 className="mb-0">Zararlı Yazılım Bilgileri</h5>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Tür:</strong> {results.results.malwareInfo.type}</p>
                      <p><strong>Aile:</strong> {results.results.malwareInfo.family}</p>
                      <p><strong>Yetenekler:</strong> {results.results.malwareInfo.capabilities.join(', ')}</p>
                    </Card.Body>
                  </Card>
                )}
              </Tab>
              <Tab eventKey="details" title="Detaylar">
                {renderResults()}
              </Tab>
            </Tabs>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Son güncelleme: {new Date().toLocaleString()}</small>
          </Card.Footer>
        </Card>
      )}
    </Layout>
  );
} 