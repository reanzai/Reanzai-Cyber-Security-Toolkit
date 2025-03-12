import { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, Button, Form, Alert, Table, Badge, Spinner, Row, Col, ProgressBar } from 'react-bootstrap';

export default function SSLChecker() {
  const [domain, setDomain] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!domain) {
      setError('Lütfen bir domain veya IP adresi girin');
      return;
    }

    // Basit domain doğrulama
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      setError('Lütfen geçerli bir domain adı girin (örn: example.com)');
      return;
    }

    setIsChecking(true);
    setResults(null);
    setError('');

    // Simüle edilmiş SSL kontrol süreci
    setTimeout(() => {
      try {
        // Simüle edilmiş sonuçlar
        const mockResults = {
          domain: domain,
          ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          scanTime: new Date().toLocaleString(),
          certificate: {
            subject: `CN=${domain}`,
            issuer: Math.random() > 0.7 ? 'Let\'s Encrypt Authority X3' : 'DigiCert SHA2 Secure Server CA',
            validFrom: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            validTo: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            daysRemaining: Math.floor(Math.random() * 365),
            serialNumber: Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase(),
            version: 3,
            signatureAlgorithm: 'SHA256withRSA',
            keyStrength: 2048
          },
          protocols: [
            { name: 'TLS 1.3', supported: Math.random() > 0.3, secure: true },
            { name: 'TLS 1.2', supported: Math.random() > 0.1, secure: true },
            { name: 'TLS 1.1', supported: Math.random() > 0.5, secure: false },
            { name: 'TLS 1.0', supported: Math.random() > 0.7, secure: false },
            { name: 'SSL 3.0', supported: Math.random() > 0.9, secure: false }
          ],
          ciphers: [
            { name: 'TLS_AES_256_GCM_SHA384', strength: 'Güçlü', secure: true },
            { name: 'TLS_CHACHA20_POLY1305_SHA256', strength: 'Güçlü', secure: true },
            { name: 'TLS_AES_128_GCM_SHA256', strength: 'Güçlü', secure: true },
            { name: 'ECDHE-RSA-AES256-GCM-SHA384', strength: 'Güçlü', secure: true },
            { name: 'ECDHE-RSA-AES128-GCM-SHA256', strength: 'Güçlü', secure: true },
            { name: 'DHE-RSA-AES256-GCM-SHA384', strength: 'Orta', secure: true },
            { name: 'AES256-SHA', strength: 'Zayıf', secure: false },
            { name: 'DES-CBC3-SHA', strength: 'Zayıf', secure: false }
          ].filter(() => Math.random() > 0.5),
          vulnerabilities: [
            { name: 'Heartbleed', detected: Math.random() > 0.9, severity: 'Kritik', description: 'OpenSSL\'deki bellek sızıntısı güvenlik açığı' },
            { name: 'POODLE', detected: Math.random() > 0.8, severity: 'Yüksek', description: 'SSL 3.0 protokolündeki güvenlik açığı' },
            { name: 'FREAK', detected: Math.random() > 0.9, severity: 'Orta', description: 'Zayıf şifreleme kullanımı güvenlik açığı' },
            { name: 'DROWN', detected: Math.random() > 0.9, severity: 'Yüksek', description: 'SSLv2 protokolündeki güvenlik açığı' },
            { name: 'ROBOT', detected: Math.random() > 0.9, severity: 'Yüksek', description: 'RSA şifreleme güvenlik açığı' },
            { name: 'BEAST', detected: Math.random() > 0.7, severity: 'Orta', description: 'TLS 1.0 protokolündeki güvenlik açığı' }
          ].filter(() => Math.random() > 0.7),
          securityHeaders: [
            { name: 'Strict-Transport-Security', present: Math.random() > 0.3, value: 'max-age=31536000; includeSubDomains' },
            { name: 'Content-Security-Policy', present: Math.random() > 0.5, value: 'default-src \'self\'' },
            { name: 'X-Content-Type-Options', present: Math.random() > 0.4, value: 'nosniff' },
            { name: 'X-Frame-Options', present: Math.random() > 0.3, value: 'SAMEORIGIN' },
            { name: 'X-XSS-Protection', present: Math.random() > 0.4, value: '1; mode=block' },
            { name: 'Referrer-Policy', present: Math.random() > 0.6, value: 'strict-origin-when-cross-origin' }
          ],
          overallRating: Math.floor(Math.random() * 5) + 1
        };
        
        setResults(mockResults);
      } catch (err) {
        setError('SSL kontrol sırasında bir hata oluştu: ' + err.message);
      } finally {
        setIsChecking(false);
      }
    }, 2000);
  };

  const getRatingColor = (rating) => {
    switch(rating) {
      case 5: return 'success';
      case 4: return 'info';
      case 3: return 'primary';
      case 2: return 'warning';
      default: return 'danger';
    }
  };

  return (
    <Layout>
      <h1 className="mb-4">SSL/TLS Sertifika Analizi</h1>

      <Card className="bg-dark text-light mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Domain veya IP Adresi</Form.Label>
              <Form.Control 
                type="text" 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Örnek: example.com"
                disabled={isChecking}
              />
              <Form.Text className="text-muted">
                SSL/TLS sertifikasını kontrol etmek istediğiniz domain adını girin
              </Form.Text>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              disabled={!domain || isChecking}
              className="mt-2"
            >
              {isChecking ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Kontrol Ediliyor...
                </>
              ) : 'SSL Kontrol Et'}
            </Button>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Card.Body>
      </Card>

      {results && (
        <>
          <Card className="bg-dark text-light mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">SSL Analiz Sonuçları</h3>
              <div>
                <Badge bg={getRatingColor(results.overallRating)} className="p-2">
                  Genel Değerlendirme: {Array(results.overallRating).fill('★').join('')}
                  {Array(5 - results.overallRating).fill('☆').join('')}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h4>Genel Bilgiler</h4>
                  <Table variant="dark" bordered>
                    <tbody>
                      <tr>
                        <td>Domain</td>
                        <td>{results.domain}</td>
                      </tr>
                      <tr>
                        <td>IP Adresi</td>
                        <td>{results.ip}</td>
                      </tr>
                      <tr>
                        <td>Kontrol Zamanı</td>
                        <td>{results.scanTime}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <h4>Sertifika Bilgileri</h4>
                  <Table variant="dark" bordered>
                    <tbody>
                      <tr>
                        <td>Konu</td>
                        <td>{results.certificate.subject}</td>
                      </tr>
                      <tr>
                        <td>Veren</td>
                        <td>{results.certificate.issuer}</td>
                      </tr>
                      <tr>
                        <td>Geçerlilik</td>
                        <td>
                          {results.certificate.validFrom} - {results.certificate.validTo}
                          <br />
                          <Badge bg={results.certificate.daysRemaining > 30 ? 'success' : 'danger'}>
                            {results.certificate.daysRemaining} gün kaldı
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td>Anahtar Gücü</td>
                        <td>
                          {results.certificate.keyStrength} bit
                          <Badge bg={results.certificate.keyStrength >= 2048 ? 'success' : 'warning'} className="ms-2">
                            {results.certificate.keyStrength >= 2048 ? 'Güçlü' : 'Zayıf'}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td>İmza Algoritması</td>
                        <td>{results.certificate.signatureAlgorithm}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              <h4 className="mt-4">Desteklenen Protokoller</h4>
              <Table variant="dark" striped bordered hover>
                <thead>
                  <tr>
                    <th>Protokol</th>
                    <th>Durum</th>
                    <th>Güvenlik</th>
                  </tr>
                </thead>
                <tbody>
                  {results.protocols.map((protocol, index) => (
                    <tr key={index}>
                      <td>{protocol.name}</td>
                      <td>
                        <Badge bg={protocol.supported ? 'success' : 'secondary'}>
                          {protocol.supported ? 'Destekleniyor' : 'Desteklenmiyor'}
                        </Badge>
                      </td>
                      <td>
                        {protocol.supported && (
                          <Badge bg={protocol.secure ? 'success' : 'danger'}>
                            {protocol.secure ? 'Güvenli' : 'Güvenli Değil'}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {results.ciphers && results.ciphers.length > 0 && (
                <>
                  <h4 className="mt-4">Şifreleme Yöntemleri</h4>
                  <Table variant="dark" striped bordered hover>
                    <thead>
                      <tr>
                        <th>Şifreleme</th>
                        <th>Güç</th>
                        <th>Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.ciphers.map((cipher, index) => (
                        <tr key={index}>
                          <td>{cipher.name}</td>
                          <td>
                            <Badge bg={
                              cipher.strength === 'Güçlü' ? 'success' :
                              cipher.strength === 'Orta' ? 'warning' : 'danger'
                            }>
                              {cipher.strength}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={cipher.secure ? 'success' : 'danger'}>
                              {cipher.secure ? 'Önerilen' : 'Önerilmeyen'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}

              {results.vulnerabilities && results.vulnerabilities.length > 0 && (
                <>
                  <h4 className="mt-4">Tespit Edilen Güvenlik Açıkları</h4>
                  <Table variant="dark" striped bordered hover>
                    <thead>
                      <tr>
                        <th>Açık</th>
                        <th>Şiddet</th>
                        <th>Açıklama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.vulnerabilities.map((vuln, index) => (
                        <tr key={index}>
                          <td>{vuln.name}</td>
                          <td>
                            <Badge bg={
                              vuln.severity === 'Kritik' ? 'danger' :
                              vuln.severity === 'Yüksek' ? 'warning' : 'info'
                            }>
                              {vuln.severity}
                            </Badge>
                          </td>
                          <td>{vuln.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}

              <h4 className="mt-4">Güvenlik Başlıkları</h4>
              <Table variant="dark" striped bordered hover>
                <thead>
                  <tr>
                    <th>Başlık</th>
                    <th>Durum</th>
                    <th>Değer</th>
                  </tr>
                </thead>
                <tbody>
                  {results.securityHeaders.map((header, index) => (
                    <tr key={index}>
                      <td>{header.name}</td>
                      <td>
                        <Badge bg={header.present ? 'success' : 'danger'}>
                          {header.present ? 'Mevcut' : 'Eksik'}
                        </Badge>
                      </td>
                      <td>{header.present ? header.value : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className="bg-dark text-light mb-4">
            <Card.Header>
              <h3 className="mb-0">Öneriler</h3>
            </Card.Header>
            <Card.Body>
              <Alert variant={results.overallRating >= 4 ? 'success' : results.overallRating >= 3 ? 'warning' : 'danger'}>
                <h5>SSL/TLS Yapılandırma Değerlendirmesi</h5>
                <p>
                  {results.overallRating >= 4 
                    ? 'SSL/TLS yapılandırmanız genel olarak güvenli görünüyor.' 
                    : results.overallRating >= 3 
                      ? 'SSL/TLS yapılandırmanızda bazı iyileştirmeler yapılabilir.' 
                      : 'SSL/TLS yapılandırmanızda önemli güvenlik sorunları tespit edildi.'}
                </p>
                
                <h6 className="mt-3">İyileştirme Önerileri:</h6>
                <ul>
                  {results.protocols.some(p => !p.secure && p.supported) && (
                    <li>Güvenli olmayan protokolleri devre dışı bırakın (SSL 3.0, TLS 1.0, TLS 1.1)</li>
                  )}
                  {results.ciphers.some(c => !c.secure) && (
                    <li>Zayıf şifreleme yöntemlerini devre dışı bırakın</li>
                  )}
                  {results.certificate.keyStrength < 2048 && (
                    <li>Daha güçlü bir anahtar (en az 2048 bit) ile yeni bir sertifika alın</li>
                  )}
                  {results.certificate.daysRemaining <= 30 && (
                    <li>Sertifikanız yakında sona erecek, yenileme işlemlerini başlatın</li>
                  )}
                  {results.securityHeaders.some(h => !h.present) && (
                    <li>Eksik güvenlik başlıklarını ekleyin</li>
                  )}
                  {results.vulnerabilities && results.vulnerabilities.length > 0 && (
                    <li>Tespit edilen güvenlik açıklarını gidermek için SSL/TLS yapılandırmanızı güncelleyin</li>
                  )}
                </ul>
              </Alert>
            </Card.Body>
          </Card>
        </>
      )}
    </Layout>
  );
} 