import { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, Button, Form, Alert, Table, Badge, Spinner, Row, Col, Tabs, Tab, ListGroup } from 'react-bootstrap';

export default function ForensicsTool() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [analysisType, setAnalysisType] = useState('file');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
      setError('');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!file && analysisType === 'file') {
      setError('Lütfen analiz edilecek bir dosya seçin');
      return;
    }

    setIsAnalyzing(true);
    setResults(null);
    setError('');

    // Simüle edilmiş analiz süreci
    setTimeout(() => {
      try {
        // Simüle edilmiş sonuçlar
        const mockResults = {
          fileName: fileName || 'disk_image.dd',
          fileSize: file ? file.size : 4294967296, // 4GB
          analysisType: analysisType,
          analysisTime: new Date().toLocaleString(),
          fileMetadata: {
            md5: '5eb63bbbe01eeed093cb22bb8f5acdc3',
            sha1: '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed',
            sha256: '8bb0cf6eb9b17d0f7d22b456f121257dc1254e1f01665370476383ea776df414',
            fileType: file ? (file.type || 'application/octet-stream') : 'application/octet-stream',
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString(),
            modifiedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString(),
            accessedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toLocaleString()
          },
          recoveredFiles: [
            { name: 'document.docx', path: '/Users/user/Documents/', size: 2457600, deleted: true, recoveryStatus: 'Tam' },
            { name: 'image.jpg', path: '/Users/user/Pictures/', size: 1048576, deleted: true, recoveryStatus: 'Kısmi' },
            { name: 'backup.zip', path: '/Users/user/Downloads/', size: 10485760, deleted: false, recoveryStatus: 'Tam' },
            { name: 'notes.txt', path: '/Users/user/Documents/', size: 4096, deleted: true, recoveryStatus: 'Tam' },
            { name: 'presentation.pptx', path: '/Users/user/Documents/', size: 3145728, deleted: false, recoveryStatus: 'Tam' }
          ].filter(() => Math.random() > 0.3),
          timeline: [
            { timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(), event: 'Dosya silindi', path: '/Users/user/Documents/document.docx', user: 'user' },
            { timestamp: new Date(Date.now() - 45 * 60 * 1000).toLocaleString(), event: 'Dosya oluşturuldu', path: '/Users/user/Documents/new_file.txt', user: 'user' },
            { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(), event: 'Dosya değiştirildi', path: '/Users/user/Documents/notes.txt', user: 'user' },
            { timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toLocaleString(), event: 'Dosya indirildi', path: '/Users/user/Downloads/backup.zip', user: 'user' },
            { timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleString(), event: 'Kullanıcı girişi', path: 'N/A', user: 'user' },
            { timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(), event: 'Sistem başlatıldı', path: 'N/A', user: 'system' }
          ],
          artifacts: {
            browserHistory: [
              { timestamp: new Date(Date.now() - 15 * 60 * 1000).toLocaleString(), url: 'https://example.com/login', title: 'Login - Example', browser: 'Chrome' },
              { timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(), url: 'https://mail.example.com', title: 'Webmail - Example', browser: 'Chrome' },
              { timestamp: new Date(Date.now() - 60 * 60 * 1000).toLocaleString(), url: 'https://search.example.com?q=forensics+tools', title: 'Search: forensics tools', browser: 'Chrome' }
            ],
            recentDocuments: [
              { timestamp: new Date(Date.now() - 20 * 60 * 1000).toLocaleString(), name: 'document.docx', application: 'Microsoft Word' },
              { timestamp: new Date(Date.now() - 40 * 60 * 1000).toLocaleString(), name: 'spreadsheet.xlsx', application: 'Microsoft Excel' },
              { timestamp: new Date(Date.now() - 90 * 60 * 1000).toLocaleString(), name: 'presentation.pptx', application: 'Microsoft PowerPoint' }
            ],
            userAccounts: [
              { username: 'admin', lastLogin: new Date(Date.now() - 48 * 60 * 60 * 1000).toLocaleString(), accountType: 'Administrator' },
              { username: 'user', lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleString(), accountType: 'Standard' },
              { username: 'guest', lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleString(), accountType: 'Guest' }
            ]
          },
          networkActivity: [
            { timestamp: new Date(Date.now() - 10 * 60 * 1000).toLocaleString(), sourceIP: '192.168.1.100', destinationIP: '93.184.216.34', port: 443, protocol: 'HTTPS' },
            { timestamp: new Date(Date.now() - 25 * 60 * 1000).toLocaleString(), sourceIP: '192.168.1.100', destinationIP: '172.217.169.78', port: 443, protocol: 'HTTPS' },
            { timestamp: new Date(Date.now() - 35 * 60 * 1000).toLocaleString(), sourceIP: '192.168.1.100', destinationIP: '104.244.42.193', port: 443, protocol: 'HTTPS' }
          ]
        };
        
        setResults(mockResults);
      } catch (err) {
        setError('Analiz sırasında bir hata oluştu: ' + err.message);
      } finally {
        setIsAnalyzing(false);
      }
    }, 3000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout>
      <h1 className="mb-4">Adli Analiz Araçları</h1>

      <Card className="bg-dark text-light mb-4">
        <Card.Body>
          <Form onSubmit={handleAnalyze}>
            <Form.Group className="mb-3">
              <Form.Label>Analiz Tipi</Form.Label>
              <Form.Select 
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
                disabled={isAnalyzing}
              >
                <option value="file">Dosya Analizi</option>
                <option value="disk">Disk İmajı Analizi</option>
                <option value="memory">Bellek Dökümü Analizi</option>
                <option value="log">Log Analizi</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Analiz Edilecek Dosya</Form.Label>
              <Form.Control 
                type="file" 
                onChange={handleFileChange}
                disabled={isAnalyzing}
              />
              <Form.Text className="text-muted">
                {analysisType === 'file' && 'Analiz edilecek dosyayı seçin'}
                {analysisType === 'disk' && 'Disk imajı dosyasını seçin (.dd, .img, .raw)'}
                {analysisType === 'memory' && 'Bellek dökümü dosyasını seçin (.dmp, .mem)'}
                {analysisType === 'log' && 'Log dosyasını seçin (.log, .txt)'}
              </Form.Text>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              disabled={(analysisType === 'file' && !file) || isAnalyzing}
              className="mt-2"
            >
              {isAnalyzing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Analiz Ediliyor...
                </>
              ) : 'Analiz Et'}
            </Button>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          {isAnalyzing && (
            <div className="mt-4 text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Analiz yapılıyor, lütfen bekleyin...</p>
              <p className="small text-muted">Bu işlem birkaç dakika sürebilir</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {results && (
        <Card className="bg-dark text-light mb-4">
          <Card.Header>
            <h3 className="mb-0">Adli Analiz Sonuçları</h3>
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
                    <h4>Analiz Bilgileri</h4>
                    <Table variant="dark" bordered>
                      <tbody>
                        <tr>
                          <td>Dosya Adı</td>
                          <td>{results.fileName}</td>
                        </tr>
                        <tr>
                          <td>Dosya Boyutu</td>
                          <td>{formatFileSize(results.fileSize)}</td>
                        </tr>
                        <tr>
                          <td>Analiz Tipi</td>
                          <td>
                            {results.analysisType === 'file' && 'Dosya Analizi'}
                            {results.analysisType === 'disk' && 'Disk İmajı Analizi'}
                            {results.analysisType === 'memory' && 'Bellek Dökümü Analizi'}
                            {results.analysisType === 'log' && 'Log Analizi'}
                          </td>
                        </tr>
                        <tr>
                          <td>Analiz Zamanı</td>
                          <td>{results.analysisTime}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <h4>Dosya Özeti</h4>
                    <Table variant="dark" bordered>
                      <tbody>
                        <tr>
                          <td>MD5 Hash</td>
                          <td><code>{results.fileMetadata.md5}</code></td>
                        </tr>
                        <tr>
                          <td>SHA-1 Hash</td>
                          <td><code>{results.fileMetadata.sha1}</code></td>
                        </tr>
                        <tr>
                          <td>SHA-256 Hash</td>
                          <td><code>{results.fileMetadata.sha256}</code></td>
                        </tr>
                        <tr>
                          <td>Dosya Türü</td>
                          <td>{results.fileMetadata.fileType}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>

                <h4 className="mt-4">Zaman Çizelgesi</h4>
                <Table variant="dark" striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Zaman</th>
                      <th>Olay</th>
                      <th>Yol</th>
                      <th>Kullanıcı</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.timeline.map((event, index) => (
                      <tr key={index}>
                        <td>{event.timestamp}</td>
                        <td>{event.event}</td>
                        <td>{event.path}</td>
                        <td>{event.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>

              <Tab eventKey="files" title="Kurtarılan Dosyalar">
                {results.recoveredFiles && results.recoveredFiles.length > 0 ? (
                  <Table variant="dark" striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Dosya Adı</th>
                        <th>Yol</th>
                        <th>Boyut</th>
                        <th>Durum</th>
                        <th>Kurtarma Durumu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.recoveredFiles.map((file, index) => (
                        <tr key={index}>
                          <td>{file.name}</td>
                          <td>{file.path}</td>
                          <td>{formatFileSize(file.size)}</td>
                          <td>
                            <Badge bg={file.deleted ? 'danger' : 'success'}>
                              {file.deleted ? 'Silinmiş' : 'Mevcut'}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={
                              file.recoveryStatus === 'Tam' ? 'success' : 
                              file.recoveryStatus === 'Kısmi' ? 'warning' : 'danger'
                            }>
                              {file.recoveryStatus}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">
                    Kurtarılabilir dosya bulunamadı.
                  </Alert>
                )}
              </Tab>

              <Tab eventKey="artifacts" title="Dijital Kanıtlar">
                <Row>
                  <Col md={6}>
                    <h4 className="mb-3">Tarayıcı Geçmişi</h4>
                    {results.artifacts.browserHistory && results.artifacts.browserHistory.length > 0 ? (
                      <Table variant="dark" striped bordered hover>
                        <thead>
                          <tr>
                            <th>Zaman</th>
                            <th>URL</th>
                            <th>Başlık</th>
                            <th>Tarayıcı</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.artifacts.browserHistory.map((item, index) => (
                            <tr key={index}>
                              <td>{item.timestamp}</td>
                              <td>{item.url}</td>
                              <td>{item.title}</td>
                              <td>{item.browser}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <Alert variant="info">
                        Tarayıcı geçmişi bulunamadı.
                      </Alert>
                    )}
                  </Col>
                  <Col md={6}>
                    <h4 className="mb-3">Son Kullanılan Belgeler</h4>
                    {results.artifacts.recentDocuments && results.artifacts.recentDocuments.length > 0 ? (
                      <Table variant="dark" striped bordered hover>
                        <thead>
                          <tr>
                            <th>Zaman</th>
                            <th>Dosya Adı</th>
                            <th>Uygulama</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.artifacts.recentDocuments.map((item, index) => (
                            <tr key={index}>
                              <td>{item.timestamp}</td>
                              <td>{item.name}</td>
                              <td>{item.application}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <Alert variant="info">
                        Son kullanılan belge bulunamadı.
                      </Alert>
                    )}
                  </Col>
                </Row>

                <h4 className="mt-4 mb-3">Kullanıcı Hesapları</h4>
                {results.artifacts.userAccounts && results.artifacts.userAccounts.length > 0 ? (
                  <Table variant="dark" striped bordered hover>
                    <thead>
                      <tr>
                        <th>Kullanıcı Adı</th>
                        <th>Son Giriş</th>
                        <th>Hesap Türü</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.artifacts.userAccounts.map((account, index) => (
                        <tr key={index}>
                          <td>{account.username}</td>
                          <td>{account.lastLogin}</td>
                          <td>
                            <Badge bg={
                              account.accountType === 'Administrator' ? 'danger' : 
                              account.accountType === 'Standard' ? 'primary' : 'secondary'
                            }>
                              {account.accountType}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">
                    Kullanıcı hesabı bulunamadı.
                  </Alert>
                )}
              </Tab>

              <Tab eventKey="network" title="Ağ Aktivitesi">
                <h4 className="mb-3">Ağ Bağlantıları</h4>
                {results.networkActivity && results.networkActivity.length > 0 ? (
                  <Table variant="dark" striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Zaman</th>
                        <th>Kaynak IP</th>
                        <th>Hedef IP</th>
                        <th>Port</th>
                        <th>Protokol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.networkActivity.map((activity, index) => (
                        <tr key={index}>
                          <td>{activity.timestamp}</td>
                          <td>{activity.sourceIP}</td>
                          <td>{activity.destinationIP}</td>
                          <td>{activity.port}</td>
                          <td>{activity.protocol}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">
                    Ağ aktivitesi bulunamadı.
                  </Alert>
                )}
              </Tab>

              <Tab eventKey="metadata" title="Metadata">
                <h4 className="mb-3">Dosya Metadata Bilgileri</h4>
                <Table variant="dark" bordered>
                  <tbody>
                    <tr>
                      <td>Oluşturulma Tarihi</td>
                      <td>{results.fileMetadata.createdAt}</td>
                    </tr>
                    <tr>
                      <td>Değiştirilme Tarihi</td>
                      <td>{results.fileMetadata.modifiedAt}</td>
                    </tr>
                    <tr>
                      <td>Erişim Tarihi</td>
                      <td>{results.fileMetadata.accessedAt}</td>
                    </tr>
                    <tr>
                      <td>MD5 Hash</td>
                      <td><code>{results.fileMetadata.md5}</code></td>
                    </tr>
                    <tr>
                      <td>SHA-1 Hash</td>
                      <td><code>{results.fileMetadata.sha1}</code></td>
                    </tr>
                    <tr>
                      <td>SHA-256 Hash</td>
                      <td><code>{results.fileMetadata.sha256}</code></td>
                    </tr>
                    <tr>
                      <td>Dosya Türü</td>
                      <td>{results.fileMetadata.fileType}</td>
                    </tr>
                  </tbody>
                </Table>
              </Tab>
            </Tabs>
          </Card.Body>
          <Card.Footer>
            <Alert variant="info">
              <h5>Adli Analiz Raporu</h5>
              <p>
                Bu rapor, seçilen dosya veya imaj üzerinde yapılan adli analiz sonuçlarını içermektedir.
                Rapor, dosya kurtarma, zaman çizelgesi, dijital kanıtlar ve ağ aktivitesi gibi bilgileri içerir.
                Adli inceleme amacıyla bu raporu PDF olarak dışa aktarabilirsiniz.
              </p>
              <div className="d-flex gap-2 mt-3">
                <Button variant="primary" size="sm" disabled>
                  Raporu PDF Olarak İndir
                </Button>
                <Button variant="secondary" size="sm" disabled>
                  Raporu Yazdır
                </Button>
                <Button variant="warning" size="sm" disabled>
                  Kanıtları Dışa Aktar
                </Button>
              </div>
            </Alert>
          </Card.Footer>
        </Card>
      )}
    </Layout>
  );
} 