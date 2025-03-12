import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card, Button, Form, Alert, Table, Badge, Spinner, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function NetworkAnalyzer() {
  const [interface_, setInterface] = useState('');
  const [interfaces, setInterfaces] = useState([
    { name: 'eth0', description: 'Ethernet Adaptörü' },
    { name: 'wlan0', description: 'Kablosuz Adaptör' },
    { name: 'lo', description: 'Loopback Arayüzü' }
  ]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [packets, setPackets] = useState([]);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalPackets: 0,
    bytesReceived: 0,
    protocols: {},
    topSources: {},
    topDestinations: {}
  });
  const [filter, setFilter] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Paket/Saniye',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  });
  const [captureInterval, setCaptureInterval] = useState(null);

  const startCapture = () => {
    if (!interface_) {
      setError('Lütfen bir ağ arayüzü seçin');
      return;
    }

    setIsCapturing(true);
    setError('');
    setPackets([]);
    setStats({
      totalPackets: 0,
      bytesReceived: 0,
      protocols: {},
      topSources: {},
      topDestinations: {}
    });
    
    // Simüle edilmiş paket yakalama
    const interval = setInterval(() => {
      const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS'];
      const sources = ['192.168.1.100', '192.168.1.101', '192.168.1.102', '10.0.0.1', '172.16.0.1'];
      const destinations = ['192.168.1.1', '8.8.8.8', '1.1.1.1', '142.250.187.78', '104.244.42.65'];
      
      const newPacket = {
        timestamp: new Date().toLocaleTimeString(),
        source: sources[Math.floor(Math.random() * sources.length)],
        destination: destinations[Math.floor(Math.random() * destinations.length)],
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        length: Math.floor(Math.random() * 1500) + 64,
        info: 'Paket bilgisi'
      };
      
      setPackets(prev => [...prev, newPacket]);
      updateStats(newPacket);
      updateChart();
    }, 1000);
    
    setCaptureInterval(interval);
  };

  const stopCapture = () => {
    setIsCapturing(false);
    if (captureInterval) {
      clearInterval(captureInterval);
      setCaptureInterval(null);
    }
  };

  const updateStats = (packet) => {
    setStats(prev => {
      // Protokol sayısını güncelle
      const protocols = {...prev.protocols};
      protocols[packet.protocol] = (protocols[packet.protocol] || 0) + 1;
      
      // Kaynak IP sayısını güncelle
      const topSources = {...prev.topSources};
      topSources[packet.source] = (topSources[packet.source] || 0) + 1;
      
      // Hedef IP sayısını güncelle
      const topDestinations = {...prev.topDestinations};
      topDestinations[packet.destination] = (topDestinations[packet.destination] || 0) + 1;
      
      return {
        totalPackets: prev.totalPackets + 1,
        bytesReceived: prev.bytesReceived + packet.length,
        protocols,
        topSources,
        topDestinations
      };
    });
  };

  const updateChart = () => {
    const now = new Date().toLocaleTimeString();
    setChartData(prev => {
      const newLabels = [...prev.labels, now];
      const newData = [...prev.datasets[0].data, 1]; // Her saniye 1 paket
      
      // Son 10 veriyi tut
      if (newLabels.length > 10) {
        newLabels.shift();
        newData.shift();
      }
      
      return {
        labels: newLabels,
        datasets: [{
          ...prev.datasets[0],
          data: newData
        }]
      };
    });
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ağ Trafiği Analizi'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Temizleme işlemi
  useEffect(() => {
    return () => {
      if (captureInterval) {
        clearInterval(captureInterval);
      }
    };
  }, [captureInterval]);

  return (
    <Layout>
      <h1 className="mb-4">Ağ Trafik Analizi</h1>

      <Card className="bg-dark text-light mb-4">
        <Card.Body>
          <Form className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Ağ Arayüzü</Form.Label>
              <Form.Select
                value={interface_}
                onChange={(e) => setInterface(e.target.value)}
                disabled={isCapturing}
              >
                <option value="">Arayüz Seçin</option>
                {interfaces.map((iface) => (
                  <option key={iface.name} value={iface.name}>
                    {iface.name} - {iface.description}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Paket Filtresi</Form.Label>
              <Form.Control
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="örn: tcp port 80"
                disabled={isCapturing}
              />
            </Form.Group>

            <Button
              variant={isCapturing ? "danger" : "primary"}
              onClick={isCapturing ? stopCapture : startCapture}
              disabled={!interface_}
            >
              {isCapturing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Yakala Durdur
                </>
              ) : (
                'Yakalamayı Başlat'
              )}
            </Button>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Card.Body>
      </Card>

      {isCapturing && (
        <>
          <Card className="bg-dark text-light mb-4">
            <Card.Body>
              <h3 className="mb-3">İstatistikler</h3>
              <Row>
                <Col md={4}>
                  <p>Toplam Paket: {stats.totalPackets}</p>
                  <p>Toplam Veri: {(stats.bytesReceived / 1024).toFixed(2)} KB</p>
                  
                  <h5 className="mt-4">Protokol Dağılımı</h5>
                  <Table variant="dark" size="sm">
                    <thead>
                      <tr>
                        <th>Protokol</th>
                        <th>Sayı</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(stats.protocols).map(([protocol, count]) => (
                        <tr key={protocol}>
                          <td>{protocol}</td>
                          <td>{count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
                <Col md={8}>
                  <Line data={chartData} options={chartOptions} />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="bg-dark text-light mb-4">
            <Card.Body>
              <h3 className="mb-3">Yakalanan Paketler</h3>
              <div className="table-responsive">
                <Table variant="dark" striped bordered hover>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Zaman</th>
                      <th>Kaynak</th>
                      <th>Hedef</th>
                      <th>Protokol</th>
                      <th>Uzunluk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packets.map((packet, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{packet.timestamp}</td>
                        <td>{packet.source}</td>
                        <td>{packet.destination}</td>
                        <td>
                          <Badge bg={
                            packet.protocol === 'TCP' ? 'primary' :
                            packet.protocol === 'UDP' ? 'success' :
                            packet.protocol === 'ICMP' ? 'warning' :
                            packet.protocol === 'HTTP' ? 'info' :
                            packet.protocol === 'HTTPS' ? 'secondary' : 'dark'
                          }>
                            {packet.protocol}
                          </Badge>
                        </td>
                        <td>{packet.length} bytes</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </Layout>
  );
} 