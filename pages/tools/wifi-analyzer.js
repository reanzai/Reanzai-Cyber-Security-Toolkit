import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card, Button, Form, Alert, Table, Badge, Spinner, Row, Col, ProgressBar, Tabs, Tab } from 'react-bootstrap';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function WifiAnalyzer() {
  const [interface_, setInterface] = useState('');
  const [interfaces, setInterfaces] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [networks, setNetworks] = useState([]);
  const [error, setError] = useState('');
  const [scanCount, setScanCount] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [activeTab, setActiveTab] = useState('networks');
  const [signalHistory, setSignalHistory] = useState({});
  const [scanInterval, setScanInterval] = useState(null);

  useEffect(() => {
    // Simüle edilmiş arayüzler
    setInterfaces([
      { id: 'wlan0', name: 'Wi-Fi Adapter', description: 'Intel Wireless-AC 9560' },
      { id: 'wlan1', name: 'External Wi-Fi', description: 'Alfa AWUS036ACH' }
    ]);

    return () => {
      if (scanInterval) {
        clearInterval(scanInterval);
      }
    };
  }, []);

  const startScan = () => {
    if (!interface_) {
      setError('Lütfen bir ağ arayüzü seçin');
      return;
    }

    setIsScanning(true);
    setError('');
    setScanCount(0);

    // İlk taramayı hemen yap
    performScan();

    // Düzenli tarama için interval başlat
    const interval = setInterval(performScan, 5000);
    setScanInterval(interval);
  };

  const stopScan = () => {
    setIsScanning(false);
    if (scanInterval) {
      clearInterval(scanInterval);
      setScanInterval(null);
    }
  };

  const performScan = () => {
    // Simüle edilmiş WiFi ağları
    const mockNetworks = [
      {
        ssid: 'HomeNetwork',
        bssid: '00:11:22:33:44:55',
        channel: 6,
        frequency: 2437,
        signal: -45 - Math.floor(Math.random() * 10),
        quality: 70 + Math.floor(Math.random() * 10),
        security: ['WPA2-PSK'],
        vendor: 'TP-Link',
        firstSeen: new Date().toLocaleString(),
        lastSeen: new Date().toLocaleString()
      },
      {
        ssid: 'Office_5G',
        bssid: 'AA:BB:CC:DD:EE:FF',
        channel: 36,
        frequency: 5180,
        signal: -55 - Math.floor(Math.random() * 10),
        quality: 60 + Math.floor(Math.random() * 10),
        security: ['WPA2-Enterprise'],
        vendor: 'Cisco',
        firstSeen: new Date().toLocaleString(),
        lastSeen: new Date().toLocaleString()
      },
      {
        ssid: 'GuestWiFi',
        bssid: '11:22:33:44:55:66',
        channel: 11,
        frequency: 2462,
        signal: -65 - Math.floor(Math.random() * 10),
        quality: 50 + Math.floor(Math.random() * 10),
        security: ['WPA2-PSK'],
        vendor: 'Netgear',
        firstSeen: new Date().toLocaleString(),
        lastSeen: new Date().toLocaleString()
      },
      {
        ssid: 'CoffeeShop',
        bssid: '22:33:44:55:66:77',
        channel: 1,
        frequency: 2412,
        signal: -75 - Math.floor(Math.random() * 10),
        quality: 30 + Math.floor(Math.random() * 10),
        security: ['Open'],
        vendor: 'Ubiquiti',
        firstSeen: new Date().toLocaleString(),
        lastSeen: new Date().toLocaleString()
      },
      {
        ssid: 'Apartment_5G',
        bssid: '33:44:55:66:77:88',
        channel: 44,
        frequency: 5220,
        signal: -60 - Math.floor(Math.random() * 10),
        quality: 55 + Math.floor(Math.random() * 10),
        security: ['WPA3-Personal'],
        vendor: 'Asus',
        firstSeen: new Date().toLocaleString(),
        lastSeen: new Date().toLocaleString()
      }
    ];

    // Rastgele bazı ağları filtrele
    const filteredNetworks = mockNetworks.filter(() => Math.random() > 0.2);
    
    // Ağları sinyal gücüne göre sırala
    const sortedNetworks = filteredNetworks.sort((a, b) => b.signal - a.signal);
    
    // Ağları güncelle
    setNetworks(sortedNetworks);
    
    // Sinyal geçmişini güncelle
    const newSignalHistory = { ...signalHistory };
    sortedNetworks.forEach(network => {
      if (!newSignalHistory[network.bssid]) {
        newSignalHistory[network.bssid] = [];
      }
      
      // En fazla 10 veri noktası tut
      if (newSignalHistory[network.bssid].length >= 10) {
        newSignalHistory[network.bssid].shift();
      }
      
      newSignalHistory[network.bssid].push({
        time: new Date().toLocaleTimeString(),
        signal: network.signal,
        quality: network.quality
      });
    });
    
    setSignalHistory(newSignalHistory);
    setScanCount(prev => prev + 1);
  };

  const getSecurityColor = (security) => {
    if (security.includes('Open')) return 'danger';
    if (security.includes('WEP')) return 'warning';
    if (security.includes('WPA3')) return 'success';
    return 'primary';
  };

  const getSignalStrength = (signal) => {
    if (signal >= -50) return 'Mükemmel';
    if (signal >= -60) return 'İyi';
    if (signal >= -70) return 'Orta';
    return 'Zayıf';
  };

  const getSignalColor = (signal) => {
    if (signal >= -50) return 'success';
    if (signal >= -60) return 'info';
    if (signal >= -70) return 'warning';
    return 'danger';
  };

  const selectNetwork = (network) => {
    setSelectedNetwork(network);
    setActiveTab('details');
  };

  const getChannelUtilization = () => {
    const channels2G = Array(14).fill(0);
    const channels5G = Array(24).fill(0);
    
    networks.forEach(network => {
      if (network.frequency < 3000) {
        channels2G[network.channel - 1] += 1;
      } else {
        const index = Math.floor((network.channel - 36) / 4);
        if (index >= 0 && index < channels5G.length) {
          channels5G[index] += 1;
        }
      }
    });
    
    return {
      channels2G,
      channels5G
    };
  };

  const channelData = getChannelUtilization();

  const channelChart2G = {
    labels: Array.from({length: 14}, (_, i) => `${i + 1}`),
    datasets: [
      {
        label: '2.4 GHz Kanal Kullanımı',
        data: channelData.channels2G,
        backgroundColor: 'rgba(0, 255, 157, 0.5)',
        borderColor: 'rgba(0, 255, 157, 1)',
        borderWidth: 1
      }
    ]
  };

  const channelChart5G = {
    labels: Array.from({length: 24}, (_, i) => `${36 + i * 4}`),
    datasets: [
      {
        label: '5 GHz Kanal Kullanımı',
        data: channelData.channels5G,
        backgroundColor: 'rgba(51, 181, 229, 0.5)',
        borderColor: 'rgba(51, 181, 229, 1)',
        borderWidth: 1
      }
    ]
  };

  const securityDistribution = () => {
    const securityTypes = {};
    
    networks.forEach(network => {
      network.security.forEach(sec => {
        if (!securityTypes[sec]) {
          securityTypes[sec] = 0;
        }
        securityTypes[sec] += 1;
      });
    });
    
    return {
      labels: Object.keys(securityTypes),
      datasets: [
        {
          data: Object.values(securityTypes),
          backgroundColor: [
            'rgba(0, 255, 157, 0.7)',
            'rgba(51, 181, 229, 0.7)',
            'rgba(255, 187, 51, 0.7)',
            'rgba(255, 68, 68, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ],
          borderColor: [
            'rgba(0, 255, 157, 1)',
            'rgba(51, 181, 229, 1)',
            'rgba(255, 187, 51, 1)',
            'rgba(255, 68, 68, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const signalChart = (bssid) => {
    if (!signalHistory[bssid] || signalHistory[bssid].length === 0) {
      return null;
    }
    
    return {
      labels: signalHistory[bssid].map(item => item.time),
      datasets: [
        {
          label: 'Sinyal Gücü (dBm)',
          data: signalHistory[bssid].map(item => Math.abs(item.signal)),
          borderColor: 'rgba(255, 68, 68, 1)',
          backgroundColor: 'rgba(255, 68, 68, 0.2)',
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Sinyal Kalitesi (%)',
          data: signalHistory[bssid].map(item => item.quality),
          borderColor: 'rgba(0, 255, 157, 1)',
          backgroundColor: 'rgba(0, 255, 157, 0.2)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const signalChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Sinyal Gücü (dBm)'
        },
        min: 0,
        max: 100
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Sinyal Kalitesi (%)'
        },
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Kanal Kullanımı'
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Güvenlik Dağılımı'
      }
    }
  };

  return (
    <Layout>
      <h1 className="mb-4">WiFi Ağ Analizi</h1>

      <Card className="bg-dark text-light mb-4">
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>WiFi Arayüzü</Form.Label>
              <Form.Select
                value={interface_}
                onChange={(e) => setInterface_(e.target.value)}
                disabled={isScanning}
              >
                <option value="">Arayüz Seçin</option>
                {interfaces.map((iface) => (
                  <option key={iface.id} value={iface.id}>
                    {iface.name} - {iface.description}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="primary"
                onClick={startScan}
                disabled={!interface_ || isScanning}
              >
                {isScanning ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Taranıyor...
                  </>
                ) : 'Taramayı Başlat'}
              </Button>

              {isScanning && (
                <Button
                  variant="danger"
                  onClick={stopScan}
                >
                  Taramayı Durdur
                </Button>
              )}
            </div>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          {isScanning && (
            <div className="mt-3">
              <small className="text-muted">
                Tarama sayısı: {scanCount} | Son tarama: {new Date().toLocaleTimeString()}
              </small>
            </div>
          )}
        </Card.Body>
      </Card>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="networks" title="Ağlar">
          {networks.length > 0 ? (
            <Card className="bg-dark text-light">
              <Card.Body>
                <div className="table-responsive">
                  <Table variant="dark" striped bordered hover>
                    <thead>
                      <tr>
                        <th>SSID</th>
                        <th>BSSID</th>
                        <th>Kanal</th>
                        <th>Sinyal</th>
                        <th>Güvenlik</th>
                        <th>Üretici</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {networks.map((network) => (
                        <tr key={network.bssid}>
                          <td>{network.ssid || '<Gizli Ağ>'}</td>
                          <td><small>{network.bssid}</small></td>
                          <td>
                            {network.channel}
                            <small className="d-block text-muted">
                              {network.frequency < 3000 ? '2.4 GHz' : '5 GHz'}
                            </small>
                          </td>
                          <td>
                            <Badge bg={getSignalColor(network.signal)}>
                              {network.signal} dBm
                            </Badge>
                            <small className="d-block mt-1">
                              {getSignalStrength(network.signal)}
                            </small>
                            <ProgressBar 
                              now={network.quality} 
                              variant={getSignalColor(network.signal)} 
                              className="mt-1" 
                              style={{height: '5px'}} 
                            />
                          </td>
                          <td>
                            {network.security.map((sec, i) => (
                              <Badge 
                                key={i} 
                                bg={getSecurityColor(network.security)} 
                                className="me-1"
                              >
                                {sec}
                              </Badge>
                            ))}
                          </td>
                          <td>{network.vendor}</td>
                          <td>
                            <Button 
                              variant="info" 
                              size="sm" 
                              onClick={() => selectNetwork(network)}
                            >
                              Detaylar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Alert variant="info">
              Henüz ağ taraması yapılmadı. Taramayı başlatmak için yukarıdaki butona tıklayın.
            </Alert>
          )}
        </Tab>

        <Tab eventKey="channels" title="Kanal Analizi">
          <Card className="bg-dark text-light">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h4 className="mb-3">2.4 GHz Kanal Kullanımı</h4>
                  <div className="chart-container">
                    <Bar data={channelChart2G} options={chartOptions} />
                  </div>
                  <Alert variant="info" className="mt-3">
                    <strong>Önerilen 2.4 GHz Kanalları:</strong> 1, 6, 11 (çakışma olmayan kanallar)
                  </Alert>
                </Col>
                <Col md={6}>
                  <h4 className="mb-3">5 GHz Kanal Kullanımı</h4>
                  <div className="chart-container">
                    <Bar data={channelChart5G} options={chartOptions} />
                  </div>
                  <Alert variant="info" className="mt-3">
                    <strong>Önerilen 5 GHz Kanalları:</strong> 36, 40, 44, 48 (daha az kullanılan kanallar)
                  </Alert>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="security" title="Güvenlik Analizi">
          <Card className="bg-dark text-light">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h4 className="mb-3">Güvenlik Dağılımı</h4>
                  <div className="chart-container">
                    <Pie data={securityDistribution()} options={pieOptions} />
                  </div>
                </Col>
                <Col md={6}>
                  <h4 className="mb-3">Güvenlik Değerlendirmesi</h4>
                  <Table variant="dark" bordered>
                    <thead>
                      <tr>
                        <th>Güvenlik Tipi</th>
                        <th>Değerlendirme</th>
                        <th>Öneri</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Open</td>
                        <td><Badge bg="danger">Güvensiz</Badge></td>
                        <td>Açık ağlar şifreleme kullanmaz ve tüm trafik izlenebilir. Kullanmaktan kaçının.</td>
                      </tr>
                      <tr>
                        <td>WEP</td>
                        <td><Badge bg="danger">Güvensiz</Badge></td>
                        <td>WEP kolayca kırılabilir. WPA2 veya WPA3 kullanın.</td>
                      </tr>
                      <tr>
                        <td>WPA</td>
                        <td><Badge bg="warning">Orta</Badge></td>
                        <td>WPA eski bir protokoldür. WPA2 veya WPA3 kullanın.</td>
                      </tr>
                      <tr>
                        <td>WPA2-PSK</td>
                        <td><Badge bg="primary">İyi</Badge></td>
                        <td>Güçlü bir şifre ile kullanıldığında güvenlidir.</td>
                      </tr>
                      <tr>
                        <td>WPA2-Enterprise</td>
                        <td><Badge bg="success">Çok İyi</Badge></td>
                        <td>Kurumsal ortamlar için önerilir.</td>
                      </tr>
                      <tr>
                        <td>WPA3</td>
                        <td><Badge bg="success">Mükemmel</Badge></td>
                        <td>En yeni ve en güvenli protokol.</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="details" title="Ağ Detayları" disabled={!selectedNetwork}>
          {selectedNetwork && (
            <Card className="bg-dark text-light">
              <Card.Header>
                <h3 className="mb-0">{selectedNetwork.ssid || '<Gizli Ağ>'}</h3>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h4 className="mb-3">Ağ Bilgileri</h4>
                    <Table variant="dark" bordered>
                      <tbody>
                        <tr>
                          <td>SSID</td>
                          <td>{selectedNetwork.ssid || '<Gizli Ağ>'}</td>
                        </tr>
                        <tr>
                          <td>BSSID</td>
                          <td>{selectedNetwork.bssid}</td>
                        </tr>
                        <tr>
                          <td>Kanal</td>
                          <td>
                            {selectedNetwork.channel}
                            <small className="d-block text-muted">
                              {selectedNetwork.frequency < 3000 ? '2.4 GHz' : '5 GHz'} ({selectedNetwork.frequency} MHz)
                            </small>
                          </td>
                        </tr>
                        <tr>
                          <td>Sinyal Gücü</td>
                          <td>
                            <Badge bg={getSignalColor(selectedNetwork.signal)}>
                              {selectedNetwork.signal} dBm
                            </Badge>
                            <small className="d-block mt-1">
                              {getSignalStrength(selectedNetwork.signal)}
                            </small>
                          </td>
                        </tr>
                        <tr>
                          <td>Sinyal Kalitesi</td>
                          <td>
                            {selectedNetwork.quality}%
                            <ProgressBar 
                              now={selectedNetwork.quality} 
                              variant={getSignalColor(selectedNetwork.signal)} 
                              className="mt-1" 
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Güvenlik</td>
                          <td>
                            {selectedNetwork.security.map((sec, i) => (
                              <Badge 
                                key={i} 
                                bg={getSecurityColor(selectedNetwork.security)} 
                                className="me-1"
                              >
                                {sec}
                              </Badge>
                            ))}
                          </td>
                        </tr>
                        <tr>
                          <td>Üretici</td>
                          <td>{selectedNetwork.vendor}</td>
                        </tr>
                        <tr>
                          <td>İlk Görülme</td>
                          <td>{selectedNetwork.firstSeen}</td>
                        </tr>
                        <tr>
                          <td>Son Görülme</td>
                          <td>{selectedNetwork.lastSeen}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <h4 className="mb-3">Sinyal Geçmişi</h4>
                    {signalHistory[selectedNetwork.bssid] && signalHistory[selectedNetwork.bssid].length > 0 ? (
                      <div className="chart-container">
                        <Line 
                          data={signalChart(selectedNetwork.bssid)} 
                          options={signalChartOptions} 
                        />
                      </div>
                    ) : (
                      <Alert variant="info">
                        Henüz yeterli sinyal verisi toplanmadı. Daha fazla tarama yapın.
                      </Alert>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Tab>
      </Tabs>
    </Layout>
  );
} 