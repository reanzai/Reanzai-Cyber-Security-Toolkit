import Layout from '../components/Layout';
import { Card, Row, Col, ListGroup, Badge } from 'react-bootstrap';

export default function About() {
  return (
    <Layout>
      <h1 className="mb-4">Hakkında</h1>
      
      <Card className="bg-dark text-light mb-4">
        <Card.Body>
          <Card.Title as="h2">Reanzai Cyber Security Toolkit</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">Versiyon 1.0.0</Card.Subtitle>
          
          <Card.Text>
            Reanzai Cyber Security Toolkit, modern siber güvenlik profesyonelleri, güvenlik araştırmacıları ve 
            meraklıları için tasarlanmış kapsamlı bir araç setidir. Bu platform, ağ analizi, zafiyet taraması, 
            şifreleme, parola güvenliği ve daha birçok alanda güçlü araçlar sunarak siber güvenlik çalışmalarınızı 
            kolaylaştırmayı amaçlamaktadır.
          </Card.Text>
          
          <h4 className="mt-4">Yapımcı</h4>
          <p>
            <strong>Reanzai</strong> tarafından geliştirilmiştir. <br />
            Siber güvenlik alanında uzmanlaşmış, yenilikçi çözümler üreten bir geliştirici.
          </p>
          
          <h4 className="mt-4">Misyonumuz</h4>
          <p>
            Siber güvenlik araçlarını herkes için erişilebilir kılmak ve kullanıcıların dijital varlıklarını 
            korumalarına yardımcı olmak. Modern ve kullanıcı dostu bir arayüz ile karmaşık güvenlik işlemlerini 
            basitleştirerek, hem profesyonellere hem de yeni başlayanlara hitap eden bir platform sunmak.
          </p>
        </Card.Body>
      </Card>
      
      <h2 className="mb-3">Araçlarımız</h2>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card className="bg-dark text-light h-100">
            <Card.Body>
              <Card.Title>Zafiyet Tarayıcısı</Card.Title>
              <Card.Text>
                Sistemlerdeki güvenlik açıklarını tespit etmek için geliştirilmiş kapsamlı bir tarama aracı. 
                CVE veritabanı ile entegre çalışarak güncel zafiyetleri tespit eder ve detaylı raporlar sunar.
              </Card.Text>
              <Badge bg="primary" className="me-1">Zafiyet Analizi</Badge>
              <Badge bg="info" className="me-1">CVE Entegrasyonu</Badge>
              <Badge bg="secondary">Raporlama</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="bg-dark text-light h-100">
            <Card.Body>
              <Card.Title>Ağ Analiz Aracı</Card.Title>
              <Card.Text>
                Ağ trafiğini gerçek zamanlı olarak izleyen ve analiz eden güçlü bir araç. Paket yakalama, 
                protokol analizi ve trafik görselleştirme özellikleri ile ağ güvenliğinizi kontrol altında tutun.
              </Card.Text>
              <Badge bg="primary" className="me-1">Paket Analizi</Badge>
              <Badge bg="info" className="me-1">Trafik İzleme</Badge>
              <Badge bg="secondary">Protokol Analizi</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="bg-dark text-light h-100">
            <Card.Body>
              <Card.Title>Port Tarayıcı</Card.Title>
              <Card.Text>
                Hedef sistemlerdeki açık portları ve çalışan servisleri tespit eden hızlı ve etkili bir tarama aracı. 
                Güvenlik duvarı tespiti ve servis sürüm analizi özellikleri ile ağ haritalaması yapın.
              </Card.Text>
              <Badge bg="primary" className="me-1">Port Tarama</Badge>
              <Badge bg="info" className="me-1">Servis Tespiti</Badge>
              <Badge bg="secondary">Güvenlik Duvarı Analizi</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="bg-dark text-light h-100">
            <Card.Body>
              <Card.Title>DNS Sorgulama</Card.Title>
              <Card.Text>
                Domain adları hakkında kapsamlı bilgi toplayan ve DNS kayıtlarını analiz eden bir araç. 
                MX, A, AAAA, CNAME, TXT ve diğer kayıtları sorgulayarak domain yapılandırmasını inceleyin.
              </Card.Text>
              <Badge bg="primary" className="me-1">DNS Analizi</Badge>
              <Badge bg="info" className="me-1">Kayıt Sorgulama</Badge>
              <Badge bg="secondary">Domain Bilgisi</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="bg-dark text-light h-100">
            <Card.Body>
              <Card.Title>Şifreleme Aracı</Card.Title>
              <Card.Text>
                Metin ve dosyaları güvenli bir şekilde şifrelemek ve şifrelerini çözmek için kullanılan çok yönlü bir araç. 
                AES-256, DES, Triple DES, Rabbit ve RC4 gibi çeşitli şifreleme algoritmaları desteklenmektedir.
              </Card.Text>
              <Badge bg="primary" className="me-1">Şifreleme</Badge>
              <Badge bg="info" className="me-1">Şifre Çözme</Badge>
              <Badge bg="secondary">Dosya Güvenliği</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="bg-dark text-light h-100">
            <Card.Body>
              <Card.Title>Parola Kontrolcüsü</Card.Title>
              <Card.Text>
                Parolaların gücünü analiz eden ve güvenlik açısından değerlendiren bir araç. 
                Karmaşıklık, uzunluk, benzersizlik ve veri ihlallerinde yer alıp almadığı gibi faktörleri kontrol eder.
              </Card.Text>
              <Badge bg="primary" className="me-1">Parola Analizi</Badge>
              <Badge bg="info" className="me-1">Güvenlik Değerlendirmesi</Badge>
              <Badge bg="secondary">İhlal Kontrolü</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="bg-dark text-light h-100">
            <Card.Body>
              <Card.Title>Hash Oluşturucu</Card.Title>
              <Card.Text>
                Metin ve dosyalar için çeşitli hash değerleri oluşturan bir araç. 
                MD5, SHA-1, SHA-256, SHA-512 ve diğer hash algoritmaları desteklenmektedir.
              </Card.Text>
              <Badge bg="primary" className="me-1">Hash Oluşturma</Badge>
              <Badge bg="info" className="me-1">Dosya Bütünlüğü</Badge>
              <Badge bg="secondary">Veri Doğrulama</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="bg-dark text-light h-100">
            <Card.Body>
              <Card.Title>Zararlı Yazılım Analiz Aracı</Card.Title>
              <Card.Text>
                Şüpheli dosyaları analiz ederek zararlı yazılım belirtilerini tespit eden bir araç. 
                Dosya davranışı, imzalar ve şüpheli aktiviteleri inceleyerek güvenlik değerlendirmesi yapar.
              </Card.Text>
              <Badge bg="primary" className="me-1">Zararlı Yazılım Tespiti</Badge>
              <Badge bg="info" className="me-1">Davranış Analizi</Badge>
              <Badge bg="secondary">Tehdit İstihbaratı</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="bg-dark text-light h-100">
            <Card.Body>
              <Card.Title>SSL Denetleyici</Card.Title>
              <Card.Text>
                Web sitelerinin SSL/TLS yapılandırmalarını analiz eden ve güvenlik açıklarını tespit eden bir araç. 
                Sertifika detayları, desteklenen protokoller ve şifreleme yöntemlerini kontrol eder.
              </Card.Text>
              <Badge bg="primary" className="me-1">SSL Analizi</Badge>
              <Badge bg="info" className="me-1">Sertifika Kontrolü</Badge>
              <Badge bg="secondary">Güvenlik Değerlendirmesi</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="bg-dark text-light h-100">
            <Card.Body>
              <Card.Title>Web Güvenlik Tarayıcısı</Card.Title>
              <Card.Text>
                Web uygulamalarındaki güvenlik açıklarını tespit eden kapsamlı bir tarama aracı. 
                XSS, SQL enjeksiyonu, CSRF ve diğer yaygın web zafiyetlerini kontrol eder.
              </Card.Text>
              <Badge bg="primary" className="me-1">Web Güvenliği</Badge>
              <Badge bg="info" className="me-1">Zafiyet Taraması</Badge>
              <Badge bg="secondary">OWASP Uyumlu</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="bg-dark text-light h-100">
            <Card.Body>
              <Card.Title>Adli Analiz Aracı</Card.Title>
              <Card.Text>
                Dijital kanıtları toplayan ve analiz eden adli bilişim aracı. 
                Dosya meta verileri, silinmiş dosyalar ve sistem aktivitelerini inceleyerek adli analiz süreçlerine destek olur.
              </Card.Text>
              <Badge bg="primary" className="me-1">Adli Bilişim</Badge>
              <Badge bg="info" className="me-1">Kanıt Toplama</Badge>
              <Badge bg="secondary">Veri Kurtarma</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="bg-dark text-light h-100">
            <Card.Body>
              <Card.Title>WiFi Analiz Aracı</Card.Title>
              <Card.Text>
                Kablosuz ağları tarayarak güvenlik durumlarını analiz eden bir araç. 
                Ağ sinyalleri, güvenlik protokolleri ve kanal kullanımını inceleyerek WiFi güvenliğinizi değerlendirir.
              </Card.Text>
              <Badge bg="primary" className="me-1">WiFi Güvenliği</Badge>
              <Badge bg="info" className="me-1">Ağ Tarama</Badge>
              <Badge bg="secondary">Sinyal Analizi</Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card className="bg-dark text-light mb-4">
        <Card.Body>
          <h4>Yasal Uyarı</h4>
          <p>
            Reanzai Cyber Security Toolkit, yalnızca yasal ve etik amaçlarla kullanılmak üzere tasarlanmıştır. 
            Bu araçların kötü niyetli veya yetkisiz sistemlere karşı kullanılması yasalara aykırı olabilir. 
            Kullanıcılar, bu araçları yalnızca kendi sistemlerinde veya gerekli izinleri aldıkları sistemlerde kullanmalıdır.
          </p>
          <p>
            Tüm hakları saklıdır. © 2025 Reanzai
          </p>
        </Card.Body>
      </Card>
    </Layout>
  );
} 