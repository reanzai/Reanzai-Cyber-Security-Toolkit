import { Container, Nav, Navbar, Button, Dropdown } from 'react-bootstrap';
import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Reanzai Siber Güvenlik Araçları</title>
        <meta name="description" content="Profesyonel siber güvenlik testleri ve analizleri için kapsamlı araç seti" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Link href="/" passHref legacyBehavior>
            <Navbar.Brand>
              <span className="me-2">🛡️</span>
              Reanzai Security
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref legacyBehavior>
                <Nav.Link>Ana Sayfa</Nav.Link>
              </Link>
              
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link}>Tarama Araçları</Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
                  <Link href="/tools/vulnerability-scanner" passHref legacyBehavior>
                    <Dropdown.Item>Zafiyet Tarayıcı</Dropdown.Item>
                  </Link>
                  <Link href="/tools/port-scanner" passHref legacyBehavior>
                    <Dropdown.Item>Port Tarayıcı</Dropdown.Item>
                  </Link>
                  <Link href="/tools/ssl-checker" passHref legacyBehavior>
                    <Dropdown.Item>SSL Denetleyici</Dropdown.Item>
                  </Link>
                  <Link href="/tools/web-security" passHref legacyBehavior>
                    <Dropdown.Item>Web Güvenliği</Dropdown.Item>
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
              
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link}>Ağ Araçları</Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
                  <Link href="/tools/network-analyzer" passHref legacyBehavior>
                    <Dropdown.Item>Ağ Analizi</Dropdown.Item>
                  </Link>
                  <Link href="/tools/wifi-analyzer" passHref legacyBehavior>
                    <Dropdown.Item>WiFi Analizi</Dropdown.Item>
                  </Link>
                  <Link href="/tools/dns-lookup" passHref legacyBehavior>
                    <Dropdown.Item>DNS Sorgu</Dropdown.Item>
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
              
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link}>Kriptografi</Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
                  <Link href="/tools/hash-generator" passHref legacyBehavior>
                    <Dropdown.Item>Hash Üretici</Dropdown.Item>
                  </Link>
                  <Link href="/tools/encryption-tool" passHref legacyBehavior>
                    <Dropdown.Item>Şifreleme Aracı</Dropdown.Item>
                  </Link>
                  <Link href="/tools/password-checker" passHref legacyBehavior>
                    <Dropdown.Item>Parola Kontrolü</Dropdown.Item>
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
              
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link}>Gelişmiş Araçlar</Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
                  <Link href="/tools/malware-analyzer" passHref legacyBehavior>
                    <Dropdown.Item>Zararlı Yazılım Analizi</Dropdown.Item>
                  </Link>
                  <Link href="/tools/forensics-tool" passHref legacyBehavior>
                    <Dropdown.Item>Adli Analiz</Dropdown.Item>
                  </Link>
                  <Link href="/tools/api-security" passHref legacyBehavior>
                    <Dropdown.Item>API Güvenliği</Dropdown.Item>
                  </Link>
                  <Link href="/tools/threat-intelligence" passHref legacyBehavior>
                    <Dropdown.Item>Tehdit İstihbaratı</Dropdown.Item>
                  </Link>
                  <Link href="/tools/osint-tool" passHref legacyBehavior>
                    <Dropdown.Item>OSINT Aracı</Dropdown.Item>
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
            <Nav>
              <Link href="/docs" passHref legacyBehavior>
                <Nav.Link>Dokümantasyon</Nav.Link>
              </Link>
              <Link href="/about" passHref legacyBehavior>
                <Nav.Link>Hakkında</Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="pb-5">
        <main>{children}</main>
      </Container>
    </>
  );
} 