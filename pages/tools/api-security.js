import { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, Button, Form, Alert, Table, Badge, Spinner, Row, Col, ProgressBar, Tabs, Tab } from 'react-bootstrap';

export default function APISecurityScanner() {
  const [url, setUrl] = useState('');
  const [apiType, setApiType] = useState('rest');
  const [authType, setAuthType] = useState('none');
  const [authToken, setAuthToken] = useState('');
  const [customHeaders, setCustomHeaders] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('summary');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Lütfen API endpoint URL\'sini girin');
      return;
    }

    // URL doğrulama
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    if (!urlRegex.test(url)) {
      setError('Lütfen geçerli bir URL girin (örn: https://api.example.com)');
      return;
    }

    setIsScanning(true);
    setResults(null);
    setError('');
    setScanProgress(0);

    // Simüle edilmiş tarama süreci
    const simulateScan = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setScanProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Simüle edilmiş sonuçlar
          const mockResults = {
            url: url,
            apiType: apiType,
            scanTime: new Date().toLocaleString(),
            scanDuration: Math.floor(Math.random() * 60) + 30,
            endpoints: [
              {
                path: '/api/v1/users',
                method: 'GET',
                issues: [
                  {
                    type: 'Authentication',
                    severity: 'High',
                    description: 'Endpoint requires no authentication',
                    impact: 'Unauthorized access to user data',
                    recommendation: 'Implement proper authentication mechanisms'
                  }
                ],
                headers: {
                  'Content-Type': 'application/json',
                  'X-Rate-Limit': '100'
                },
                params: ['page', 'limit', 'sort'],
                response: {
                  status: 200,
                  type: 'application/json',
                  schema: '{ users: Array<User> }'
                }
              },
              {
                path: '/api/v1/users/{id}',
                method: 'PUT',
                issues: [
                  {
                    type: 'IDOR',
                    severity: 'Critical',
                    description: 'No proper authorization checks for user ID',
                    impact: 'Users can modify other users\' data',
                    recommendation: 'Implement proper authorization checks'
                  }
                ],
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Required'
                },
                params: ['id'],
                response: {
                  status: 200,
                  type: 'application/json',
                  schema: '{ success: boolean }'
                }
              }
            ],
            vulnerabilities: [
              {
                id: 'API-AUTH-001',
                name: 'Missing Authentication',
                severity: 'High',
                category: 'Authentication',
                description: 'Some endpoints are accessible without authentication',
                affected: ['/api/v1/users', '/api/v1/products'],
                impact: 'Unauthorized access to sensitive data',
                remediation: 'Implement proper authentication for all sensitive endpoints'
              },
              {
                id: 'API-IDOR-001',
                name: 'Insecure Direct Object Reference',
                severity: 'Critical',
                category: 'Authorization',
                description: 'API endpoints vulnerable to IDOR attacks',
                affected: ['/api/v1/users/{id}', '/api/v1/orders/{id}'],
                impact: 'Users can access or modify other users\' data',
                remediation: 'Implement proper authorization checks for all object references'
              },
              {
                id: 'API-RATE-001',
                name: 'Missing Rate Limiting',
                severity: 'Medium',
                category: 'Rate Limiting',
                description: 'No rate limiting implemented on critical endpoints',
                affected: ['/api/v1/auth/login', '/api/v1/users/create'],
                impact: 'Vulnerable to brute force and DoS attacks',
                remediation: 'Implement rate limiting for all endpoints'
              }
            ],
            security_headers: {
              'Content-Security-Policy': false,
              'X-Frame-Options': true,
              'X-XSS-Protection': false,
              'X-Content-Type-Options': true,
              'Strict-Transport-Security': true
            },
            api_info: {
              version: apiType === 'rest' ? 'v1' : '2021-05',
              spec_found: true,
              auth_methods: ['API Key', 'OAuth 2.0'],
              rate_limiting: true,
              cors_enabled: true
            }
          };
          
          setResults(mockResults);
          setIsScanning(false);
          setActiveTab('summary');
        }
      }, 200);
    };

    simulateScan();
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

  return (
    <Layout>
      <h1 className="mb-4">API Güvenlik Tarayıcı</h1>

      <Card className="bg-dark text-light mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>API Endpoint URL</Form.Label>
              <Form.Control 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Örnek: https://api.example.com"
                disabled={isScanning}
              />
              <Form.Text className="text-muted">
                Taranacak API'nin kök URL'sini girin
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>API Tipi</Form.Label>
              <Form.Select 
                value={apiType}
                onChange={(e) => setApiType(e.target.value)}
                disabled={isScanning}
              >
                <option value="rest">REST API</option>
                <option value="graphql">GraphQL API</option>
                <option value="soap">SOAP API</option>
                <option value="grpc">gRPC API</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Kimlik Doğrulama Tipi</Form.Label>
              <Form.Select 
                value={authType}
                onChange={(e) => setAuthType(e.target.value)}
                disabled={isScanning}
              >
                <option value="none">Yok</option>
                <option value="basic">Basic Auth</option>
                <option value="bearer">Bearer Token</option>
                <option value="apikey">API Key</option>
                <option value="oauth2">OAuth 2.0</option>
              </Form.Select>
            </Form.Group>

            {authType !== 'none' && (
              <Form.Group className="mb-3">
                <Form.Label>Kimlik Doğrulama Bilgisi</Form.Label>
                <Form.Control 
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="Token, API Key veya kimlik bilgisi"
                  disabled={isScanning}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Özel HTTP Başlıkları (JSON)</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                value={customHeaders}
                onChange={(e) => setCustomHeaders(e.target.value)}
                placeholder='{"X-Custom-Header": "value"}'
                disabled={isScanning}
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              disabled={!url || isScanning}
              className="mt-2"
            >
              {isScanning ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  API Taranıyor...
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
              <p>API endpoint taranıyor: {url}</p>
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
                {scanProgress < 30 ? "API endpoint'leri keşfediliyor..." : 
                 scanProgress < 70 ? "Güvenlik açıkları taranıyor..." : 
                 "Sonuçlar hazırlanıyor..."}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      {results && (
        <Card className="bg-dark text-light mb-4">
          <Card.Header>
            <h3 className="mb-0">API Güvenlik Analiz Sonuçları</h3>
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
                          <td>API URL</td>
                          <td>{results.url}</td>
                        </tr>
                        <tr>
                          <td>API Tipi</td>
                          <td>{apiType.toUpperCase()}</td>
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
                  </Col>
                </Row>

                <h4 className="mb-3">API Bilgileri</h4>
                <Table variant="dark" bordered>
                  <tbody>
                    <tr>
                      <td>API Versiyonu</td>
                      <td>{results.api_info.version}</td>
                    </tr>
                    <tr>
                      <td>Spec Bulundu</td>
                      <td>
                        <Badge bg={results.api_info.spec_found ? 'success' : 'danger'}>
                          {results.api_info.spec_found ? 'Evet' : 'Hayır'}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>Kimlik Doğrulama Metodları</td>
                      <td>
                        {results.api_info.auth_methods.map((method, index) => (
                          <Badge key={index} bg="info" className="me-2">{method}</Badge>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <td>Rate Limiting</td>
                      <td>
                        <Badge bg={results.api_info.rate_limiting ? 'success' : 'danger'}>
                          {results.api_info.rate_limiting ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>CORS</td>
                      <td>
                        <Badge bg={results.api_info.cors_enabled ? 'success' : 'warning'}>
                          {results.api_info.cors_enabled ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Tab>

              <Tab eventKey="endpoints" title="Endpoint'ler">
                {results.endpoints.map((endpoint, index) => (
                  <Card key={index} className="mb-3 bg-dark border-secondary">
                    <Card.Header>
                      <h5 className="mb-0">
                        <Badge bg="primary" className="me-2">{endpoint.method}</Badge>
                        {endpoint.path}
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <h6>Parametreler</h6>
                          {endpoint.params.length > 0 ? (
                            <ul className="list-unstyled">
                              {endpoint.params.map((param, i) => (
                                <li key={i}>• {param}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted">Parametre yok</p>
                          )}
                        </Col>
                        <Col md={6}>
                          <h6>Yanıt</h6>
                          <p>
                            <Badge bg="success">{endpoint.response.status}</Badge>
                            <span className="ms-2">{endpoint.response.type}</span>
                          </p>
                          <pre className="bg-dark p-2 rounded">
                            <code>{endpoint.response.schema}</code>
                          </pre>
                        </Col>
                      </Row>

                      {endpoint.issues.length > 0 && (
                        <>
                          <h6 className="mt-3">Tespit Edilen Sorunlar</h6>
                          {endpoint.issues.map((issue, i) => (
                            <Alert key={i} variant={getSeverityColor(issue.severity).toLowerCase()}>
                              <h6>{issue.type}</h6>
                              <p className="mb-1">{issue.description}</p>
                              <small>
                                <strong>Etki:</strong> {issue.impact}<br />
                                <strong>Öneri:</strong> {issue.recommendation}
                              </small>
                            </Alert>
                          ))}
                        </>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </Tab>

              <Tab eventKey="vulnerabilities" title="Güvenlik Açıkları">
                {results.vulnerabilities.map((vuln, index) => (
                  <Card key={index} className="mb-3 bg-dark border-secondary">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">{vuln.name}</h5>
                      <Badge bg={getSeverityColor(vuln.severity)}>
                        {vuln.severity}
                      </Badge>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>ID:</strong> {vuln.id}</p>
                      <p><strong>Kategori:</strong> {vuln.category}</p>
                      <p><strong>Açıklama:</strong> {vuln.description}</p>
                      <p><strong>Etkilenen Endpoint'ler:</strong></p>
                      <ul>
                        {vuln.affected.map((path, i) => (
                          <li key={i}>{path}</li>
                        ))}
                      </ul>
                      <p><strong>Etki:</strong> {vuln.impact}</p>
                      <Alert variant="info">
                        <strong>Çözüm Önerisi:</strong> {vuln.remediation}
                      </Alert>
                    </Card.Body>
                  </Card>
                ))}
              </Tab>

              <Tab eventKey="headers" title="Güvenlik Başlıkları">
                <Table variant="dark" striped bordered hover>
                  <thead>
                    <tr>
                      <th>Başlık</th>
                      <th>Durum</th>
                      <th>Açıklama</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(results.security_headers).map(([header, enabled], index) => (
                      <tr key={index}>
                        <td>{header}</td>
                        <td>
                          <Badge bg={enabled ? 'success' : 'danger'}>
                            {enabled ? 'Aktif' : 'Pasif'}
                          </Badge>
                        </td>
                        <td>
                          {getHeaderDescription(header)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Alert variant="info" className="mt-3">
                  <h5>Güvenlik Başlıkları Önerileri</h5>
                  <ul className="mb-0">
                    {!results.security_headers['Content-Security-Policy'] && (
                      <li>Content-Security-Policy başlığını ekleyerek XSS saldırılarına karşı koruma sağlayın</li>
                    )}
                    {!results.security_headers['X-Frame-Options'] && (
                      <li>X-Frame-Options başlığını ekleyerek clickjacking saldırılarını önleyin</li>
                    )}
                    {!results.security_headers['X-XSS-Protection'] && (
                      <li>X-XSS-Protection başlığını ekleyerek tarayıcı XSS korumasını etkinleştirin</li>
                    )}
                    {!results.security_headers['Strict-Transport-Security'] && (
                      <li>HSTS başlığını ekleyerek HTTPS kullanımını zorunlu kılın</li>
                    )}
                  </ul>
                </Alert>
              </Tab>
            </Tabs>
          </Card.Body>
          <Card.Footer>
            <Alert variant="info">
              <h5>Önerilen Adımlar</h5>
              <ol className="mb-0">
                <li>Kritik ve yüksek öncelikli güvenlik açıklarını hemen düzeltin</li>
                <li>Eksik güvenlik başlıklarını ekleyin</li>
                <li>API dokümantasyonunu güncelleyin ve güvenlik gereksinimlerini belirtin</li>
                <li>Tüm endpoint'ler için uygun kimlik doğrulama ve yetkilendirme mekanizmaları ekleyin</li>
                <li>Rate limiting ve CORS politikalarını gözden geçirin</li>
                <li>Düzenli güvenlik taramaları planlayın</li>
                <li>API güvenlik politikası oluşturun ve düzenli olarak güncelleyin</li>
              </ol>
            </Alert>
          </Card.Footer>
        </Card>
      )}
    </Layout>
  );
}

function getHeaderDescription(header) {
  const descriptions = {
    'Content-Security-Policy': 'XSS ve diğer içerik enjeksiyon saldırılarına karşı koruma sağlar',
    'X-Frame-Options': 'Clickjacking saldırılarını önler',
    'X-XSS-Protection': 'Tarayıcı seviyesinde XSS koruması sağlar',
    'X-Content-Type-Options': 'MIME-type sniffing saldırılarını önler',
    'Strict-Transport-Security': 'HTTPS kullanımını zorunlu kılar'
  };
  return descriptions[header] || 'Güvenlik başlığı';
} 