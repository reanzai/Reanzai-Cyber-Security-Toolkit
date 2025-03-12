import Layout from '../components/Layout';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useState } from 'react';

const tools = [
  {
    id: 'vulnerability-scanner',
    title: 'Zafiyet Tarayıcı',
    description: 'Sistem ve uygulamalardaki güvenlik açıklarını tespit edin',
    features: [
      'CVE veritabanı entegrasyonu',
      'Port tarama',
      'Web uygulama güvenlik analizi',
      'Servis versiyonu tespiti'
    ],
    icon: '🔍',
    color: 'danger',
    category: 'tarama'
  },
  {
    id: 'network-analyzer',
    title: 'Ağ Trafik Analizi',
    description: 'Ağ trafiğini gerçek zamanlı olarak izleyin ve analiz edin',
    features: [
      'Paket yakalama ve analiz',
      'Protokol analizi',
      'Trafik filtreleme',
      'İstatistik görselleştirme'
    ],
    icon: '📊',
    color: 'info',
    category: 'ağ'
  },
  {
    id: 'port-scanner',
    title: 'Port Tarayıcı',
    description: 'Açık portları ve çalışan servisleri keşfedin',
    features: [
      'Hızlı port tarama',
      'Servis tespiti',
      'Versiyon analizi',
      'Özel port aralıkları'
    ],
    icon: '🔌',
    color: 'warning',
    category: 'tarama'
  },
  {
    id: 'hash-generator',
    title: 'Hash Üretici',
    description: 'Çeşitli hash algoritmaları ile dosya ve metin hash\'leri oluşturun',
    features: [
      'MD5, SHA-1, SHA-256, SHA-512',
      'Dosya hash hesaplama',
      'Hash karşılaştırma',
      'Toplu hash üretimi'
    ],
    icon: '🔐',
    color: 'secondary',
    category: 'kriptografi'
  },
  {
    id: 'password-checker',
    title: 'Parola Kontrolü',
    description: 'Parolaların gücünü ve güvenliğini test edin',
    features: [
      'Parola gücü analizi',
      'Sızıntı kontrolü',
      'Güvenli parola önerileri',
      'Parola politikası uyumluluk kontrolü'
    ],
    icon: '🔒',
    color: 'success',
    category: 'kriptografi'
  },
  {
    id: 'encryption-tool',
    title: 'Şifreleme Aracı',
    description: 'Veri şifreleme ve şifre çözme işlemleri yapın',
    features: [
      'AES, RSA, ECC şifreleme',
      'Dosya şifreleme',
      'Anahtar yönetimi',
      'Şifreli iletişim'
    ],
    icon: '🔏',
    color: 'primary',
    category: 'kriptografi'
  },
  {
    id: 'dns-lookup',
    title: 'DNS Sorgu',
    description: 'DNS kayıtlarını ve yapılandırmalarını analiz edin',
    features: [
      'A, MX, CNAME, TXT kayıtları',
      'DNS propagasyon kontrolü',
      'DNSSEC doğrulama',
      'Ters DNS sorguları'
    ],
    icon: '🌐',
    color: 'info',
    category: 'ağ'
  },
  {
    id: 'ssl-checker',
    title: 'SSL Denetleyici',
    description: 'SSL/TLS sertifikalarını ve yapılandırmalarını kontrol edin',
    features: [
      'Sertifika geçerlilik kontrolü',
      'Güvenlik açığı tespiti',
      'Protokol analizi',
      'Şifreleme gücü değerlendirmesi'
    ],
    icon: '🔐',
    color: 'success',
    category: 'tarama'
  },
  {
    id: 'web-security',
    title: 'Web Güvenliği',
    description: 'Web uygulamalarının güvenlik durumunu analiz edin',
    features: [
      'XSS, CSRF, SQLi taraması',
      'Header güvenlik analizi',
      'Content Security Policy kontrolü',
      'CORS yapılandırma analizi'
    ],
    icon: '🕸️',
    color: 'danger',
    category: 'tarama'
  },
  {
    id: 'wifi-analyzer',
    title: 'WiFi Analizi',
    description: 'Kablosuz ağları analiz edin ve güvenlik durumunu değerlendirin',
    features: [
      'Ağ keşfi ve sinyal gücü analizi',
      'Şifreleme türü tespiti',
      'Kanal analizi ve optimizasyonu',
      'Güvenlik açığı taraması'
    ],
    icon: '📶',
    color: 'info',
    category: 'ağ'
  },
  {
    id: 'malware-analyzer',
    title: 'Zararlı Yazılım Analizi',
    description: 'Şüpheli dosya ve yazılımları analiz edin',
    features: [
      'Statik ve dinamik analiz',
      'Davranış analizi',
      'Sandbox ortamında çalıştırma',
      'Tehdit istihbaratı entegrasyonu'
    ],
    icon: '🦠',
    color: 'danger',
    category: 'gelişmiş'
  },
  {
    id: 'forensics-tool',
    title: 'Adli Analiz',
    description: 'Dijital adli analiz ve inceleme yapın',
    features: [
      'Disk imajı analizi',
      'Dosya kurtarma',
      'Log analizi',
      'Zaman çizelgesi oluşturma'
    ],
    icon: '🔍',
    color: 'secondary',
    category: 'gelişmiş'
  },
  {
    id: 'api-security',
    title: 'API Güvenliği',
    description: 'API güvenlik testleri ve analizi yapın',
    features: [
      'API endpoint keşfi',
      'Yetkilendirme testleri',
      'Veri doğrulama kontrolü',
      'Rate limiting analizi'
    ],
    icon: '🔌',
    color: 'warning',
    category: 'gelişmiş'
  },
  {
    id: 'threat-intelligence',
    title: 'Tehdit İstihbaratı',
    description: 'Güncel tehdit istihbaratı bilgilerini analiz edin',
    features: [
      'IOC (Indicator of Compromise) analizi',
      'Tehdit aktörü bilgileri',
      'Tehdit beslemeleri entegrasyonu',
      'Risk değerlendirmesi'
    ],
    icon: '🕵️',
    color: 'danger',
    category: 'gelişmiş'
  },
  {
    id: 'osint-tool',
    title: 'OSINT Aracı',
    description: 'Açık kaynak istihbarat toplama ve analizi yapın',
    features: [
      'Sosyal medya analizi',
      'Domain ve IP bilgi toplama',
      'E-posta ve kullanıcı adı araştırma',
      'Coğrafi konum analizi'
    ],
    icon: '🔎',
    color: 'primary',
    category: 'gelişmiş'
  }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory);

  return (
    <Layout>
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Reanzai Siber Güvenlik Araçları</h1>
        <p className="lead">
          Profesyonel siber güvenlik testleri ve analizleri için kapsamlı araç seti
        </p>
      </div>

      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group">
          <Button 
            variant={activeCategory === 'all' ? 'dark' : 'outline-dark'} 
            onClick={() => setActiveCategory('all')}
          >
            Tümü
          </Button>
          <Button 
            variant={activeCategory === 'tarama' ? 'dark' : 'outline-dark'} 
            onClick={() => setActiveCategory('tarama')}
          >
            Tarama Araçları
          </Button>
          <Button 
            variant={activeCategory === 'ağ' ? 'dark' : 'outline-dark'} 
            onClick={() => setActiveCategory('ağ')}
          >
            Ağ Araçları
          </Button>
          <Button 
            variant={activeCategory === 'kriptografi' ? 'dark' : 'outline-dark'} 
            onClick={() => setActiveCategory('kriptografi')}
          >
            Kriptografi
          </Button>
          <Button 
            variant={activeCategory === 'gelişmiş' ? 'dark' : 'outline-dark'} 
            onClick={() => setActiveCategory('gelişmiş')}
          >
            Gelişmiş Araçlar
          </Button>
        </div>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredTools.map((tool) => (
          <Col key={tool.id}>
            <Card className="h-100 shadow-sm hover-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fs-1">{tool.icon}</span>
                  <Badge bg={tool.color} className="px-3 py-2">{tool.title}</Badge>
                </div>
                <Card.Title>{tool.title}</Card.Title>
                <Card.Text>{tool.description}</Card.Text>
                <ul className="small text-muted">
                  {tool.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </Card.Body>
              <Card.Footer className="bg-transparent border-0">
                <Link href={`/tools/${tool.id}`} passHref>
                  <Button variant="outline-dark" className="w-100">
                    Aracı Kullan
                  </Button>
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-5 mb-4">
        <Link href="/about" className="btn btn-outline-light">
          Reanzai Cyber Security Toolkit Hakkında Daha Fazla Bilgi
        </Link>
      </div>
      
      <footer className="text-center mt-5 pb-4">
        <p className="text-muted">
          Geliştirici: <strong className="text-light">Reanzai</strong> | 
          Versiyon: <Badge bg="secondary">1.0.0</Badge>
        </p>
      </footer>
    </Layout>
  );
} 