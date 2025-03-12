import { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, Button, Form, Alert, Table, Badge, Spinner, Row, Col, Tabs, Tab } from 'react-bootstrap';
import CryptoJS from 'crypto-js';

export default function EncryptionTool() {
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [textPassword, setTextPassword] = useState('');
  const [textAlgorithm, setTextAlgorithm] = useState('aes');
  const [textResult, setTextResult] = useState('');
  const [textOperation, setTextOperation] = useState('encrypt');
  const [textError, setTextError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [filePassword, setFilePassword] = useState('');
  const [fileAlgorithm, setFileAlgorithm] = useState('aes');
  const [fileOperation, setFileOperation] = useState('encrypt');
  const [fileError, setFileError] = useState('');
  const [fileResult, setFileResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleTextSubmit = (e) => {
    e.preventDefault();
    
    if (!textInput) {
      setTextError('Lütfen şifrelenecek veya çözülecek metin girin');
      return;
    }
    
    if (!textPassword) {
      setTextError('Lütfen bir şifre girin');
      return;
    }
    
    setIsProcessing(true);
    setTextError('');
    setTextResult('');
    
    try {
      let result = '';
      
      if (textOperation === 'encrypt') {
        switch (textAlgorithm) {
          case 'aes':
            result = CryptoJS.AES.encrypt(textInput, textPassword).toString();
            break;
          case 'des':
            result = CryptoJS.DES.encrypt(textInput, textPassword).toString();
            break;
          case 'tripledes':
            result = CryptoJS.TripleDES.encrypt(textInput, textPassword).toString();
            break;
          case 'rabbit':
            result = CryptoJS.Rabbit.encrypt(textInput, textPassword).toString();
            break;
          case 'rc4':
            result = CryptoJS.RC4.encrypt(textInput, textPassword).toString();
            break;
          default:
            result = CryptoJS.AES.encrypt(textInput, textPassword).toString();
        }
      } else {
        try {
          switch (textAlgorithm) {
            case 'aes':
              result = CryptoJS.AES.decrypt(textInput, textPassword).toString(CryptoJS.enc.Utf8);
              break;
            case 'des':
              result = CryptoJS.DES.decrypt(textInput, textPassword).toString(CryptoJS.enc.Utf8);
              break;
            case 'tripledes':
              result = CryptoJS.TripleDES.decrypt(textInput, textPassword).toString(CryptoJS.enc.Utf8);
              break;
            case 'rabbit':
              result = CryptoJS.Rabbit.decrypt(textInput, textPassword).toString(CryptoJS.enc.Utf8);
              break;
            case 'rc4':
              result = CryptoJS.RC4.decrypt(textInput, textPassword).toString(CryptoJS.enc.Utf8);
              break;
            default:
              result = CryptoJS.AES.decrypt(textInput, textPassword).toString(CryptoJS.enc.Utf8);
          }
          
          if (!result) {
            throw new Error('Şifre çözme başarısız oldu. Yanlış şifre veya algoritma.');
          }
        } catch (error) {
          throw new Error('Şifre çözme başarısız oldu. Yanlış şifre veya algoritma.');
        }
      }
      
      setTextResult(result);
    } catch (error) {
      setTextError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
      setFileError('');
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setFileError('Lütfen bir dosya seçin');
      return;
    }
    
    if (!filePassword) {
      setFileError('Lütfen bir şifre girin');
      return;
    }
    
    setIsProcessing(true);
    setFileError('');
    setFileResult(null);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const fileContent = event.target.result;
        let result = '';
        let resultType = '';
        let resultName = '';
        
        if (fileOperation === 'encrypt') {
          // Dosya içeriğini base64'e çevir
          const wordArray = CryptoJS.lib.WordArray.create(fileContent);
          const base64 = CryptoJS.enc.Base64.stringify(wordArray);
          
          // Şifrele
          switch (fileAlgorithm) {
            case 'aes':
              result = CryptoJS.AES.encrypt(base64, filePassword).toString();
              break;
            case 'des':
              result = CryptoJS.DES.encrypt(base64, filePassword).toString();
              break;
            case 'tripledes':
              result = CryptoJS.TripleDES.encrypt(base64, filePassword).toString();
              break;
            case 'rabbit':
              result = CryptoJS.Rabbit.encrypt(base64, filePassword).toString();
              break;
            case 'rc4':
              result = CryptoJS.RC4.encrypt(base64, filePassword).toString();
              break;
            default:
              result = CryptoJS.AES.encrypt(base64, filePassword).toString();
          }
          
          resultType = 'text/plain';
          resultName = `${fileName}.enc`;
        } else {
          try {
            // Şifreyi çöz
            let decrypted = '';
            switch (fileAlgorithm) {
              case 'aes':
                decrypted = CryptoJS.AES.decrypt(fileContent, filePassword).toString(CryptoJS.enc.Utf8);
                break;
              case 'des':
                decrypted = CryptoJS.DES.decrypt(fileContent, filePassword).toString(CryptoJS.enc.Utf8);
                break;
              case 'tripledes':
                decrypted = CryptoJS.TripleDES.decrypt(fileContent, filePassword).toString(CryptoJS.enc.Utf8);
                break;
              case 'rabbit':
                decrypted = CryptoJS.Rabbit.decrypt(fileContent, filePassword).toString(CryptoJS.enc.Utf8);
                break;
              case 'rc4':
                decrypted = CryptoJS.RC4.decrypt(fileContent, filePassword).toString(CryptoJS.enc.Utf8);
                break;
              default:
                decrypted = CryptoJS.AES.decrypt(fileContent, filePassword).toString(CryptoJS.enc.Utf8);
            }
            
            if (!decrypted) {
              throw new Error('Şifre çözme başarısız oldu. Yanlış şifre veya algoritma.');
            }
            
            // Base64'ten binary'ye çevir
            const binary = atob(decrypted);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
            }
            
            result = bytes.buffer;
            resultType = 'application/octet-stream';
            resultName = fileName.endsWith('.enc') ? fileName.slice(0, -4) : `decrypted_${fileName}`;
          } catch (error) {
            throw new Error('Şifre çözme başarısız oldu. Yanlış şifre veya algoritma.');
          }
        }
        
        setFileResult({
          content: result,
          type: resultType,
          name: resultName
        });
      } catch (error) {
        setFileError(error.message);
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setFileError('Dosya okuma hatası');
      setIsProcessing(false);
    };
    
    if (fileOperation === 'encrypt') {
      reader.readAsArrayBuffer(selectedFile);
    } else {
      reader.readAsText(selectedFile);
    }
  };

  const downloadResult = () => {
    if (!fileResult) return;
    
    const blob = new Blob([fileResult.content], { type: fileResult.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileResult.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textResult)
      .then(() => {
        alert('Sonuç panoya kopyalandı!');
      })
      .catch(err => {
        console.error('Kopyalama hatası:', err);
      });
  };

  return (
    <Layout>
      <h1 className="mb-4">Şifreleme Aracı</h1>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="text" title="Metin Şifreleme">
          <Card className="bg-dark text-light mb-4">
            <Card.Body>
              <Form onSubmit={handleTextSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>İşlem</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Şifrele"
                      name="textOperation"
                      id="encrypt-text"
                      checked={textOperation === 'encrypt'}
                      onChange={() => setTextOperation('encrypt')}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Şifre Çöz"
                      name="textOperation"
                      id="decrypt-text"
                      checked={textOperation === 'decrypt'}
                      onChange={() => setTextOperation('decrypt')}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Algoritma</Form.Label>
                  <Form.Select
                    value={textAlgorithm}
                    onChange={(e) => setTextAlgorithm(e.target.value)}
                  >
                    <option value="aes">AES-256</option>
                    <option value="des">DES</option>
                    <option value="tripledes">Triple DES</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="rc4">RC4</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    {textOperation === 'encrypt' ? 'Şifrelenecek Metin' : 'Çözülecek Metin'}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={textOperation === 'encrypt' ? 'Şifrelenecek metni girin' : 'Çözülecek şifreli metni girin'}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    value={textPassword}
                    onChange={(e) => setTextPassword(e.target.value)}
                    placeholder="Şifre girin"
                  />
                  <Form.Text className="text-muted">
                    Güçlü bir şifre kullanın ve şifrenizi unutmayın. Kayıp şifreler kurtarılamaz.
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      İşleniyor...
                    </>
                  ) : textOperation === 'encrypt' ? 'Şifrele' : 'Şifre Çöz'}
                </Button>
              </Form>

              {textError && (
                <Alert variant="danger" className="mt-3">
                  {textError}
                </Alert>
              )}

              {textResult && (
                <div className="mt-4">
                  <h4>Sonuç</h4>
                  <div className="p-3 bg-dark border border-secondary rounded">
                    <pre className="text-light mb-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                      {textResult}
                    </pre>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={copyToClipboard}
                  >
                    Panoya Kopyala
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="file" title="Dosya Şifreleme">
          <Card className="bg-dark text-light mb-4">
            <Card.Body>
              <Form onSubmit={handleFileSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>İşlem</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Şifrele"
                      name="fileOperation"
                      id="encrypt-file"
                      checked={fileOperation === 'encrypt'}
                      onChange={() => setFileOperation('encrypt')}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Şifre Çöz"
                      name="fileOperation"
                      id="decrypt-file"
                      checked={fileOperation === 'decrypt'}
                      onChange={() => setFileOperation('decrypt')}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Algoritma</Form.Label>
                  <Form.Select
                    value={fileAlgorithm}
                    onChange={(e) => setFileAlgorithm(e.target.value)}
                  >
                    <option value="aes">AES-256</option>
                    <option value="des">DES</option>
                    <option value="tripledes">Triple DES</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="rc4">RC4</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    {fileOperation === 'encrypt' ? 'Şifrelenecek Dosya' : 'Çözülecek Dosya'}
                  </Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                  />
                  <Form.Text className="text-muted">
                    {fileOperation === 'encrypt' 
                      ? 'Şifrelenecek dosyayı seçin' 
                      : 'Çözülecek şifreli dosyayı seçin (.enc uzantılı)'}
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    value={filePassword}
                    onChange={(e) => setFilePassword(e.target.value)}
                    placeholder="Şifre girin"
                  />
                  <Form.Text className="text-muted">
                    Güçlü bir şifre kullanın ve şifrenizi unutmayın. Kayıp şifreler kurtarılamaz.
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={isProcessing || !selectedFile}
                >
                  {isProcessing ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      İşleniyor...
                    </>
                  ) : fileOperation === 'encrypt' ? 'Şifrele' : 'Şifre Çöz'}
                </Button>
              </Form>

              {fileError && (
                <Alert variant="danger" className="mt-3">
                  {fileError}
                </Alert>
              )}

              {fileResult && (
                <div className="mt-4">
                  <Alert variant="success">
                    <h5>İşlem Başarılı!</h5>
                    <p>
                      {fileOperation === 'encrypt' 
                        ? 'Dosya başarıyla şifrelendi.' 
                        : 'Dosya şifresi başarıyla çözüldü.'}
                    </p>
                    <Button
                      variant="primary"
                      onClick={downloadResult}
                    >
                      Dosyayı İndir
                    </Button>
                  </Alert>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="info" title="Bilgi">
          <Card className="bg-dark text-light mb-4">
            <Card.Body>
              <h4>Şifreleme Algoritmaları</h4>
              <Table variant="dark" bordered>
                <thead>
                  <tr>
                    <th>Algoritma</th>
                    <th>Güvenlik</th>
                    <th>Açıklama</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>AES-256</td>
                    <td><Badge bg="success">Çok Yüksek</Badge></td>
                    <td>Advanced Encryption Standard, 256-bit anahtar uzunluğu ile en güvenli simetrik şifreleme algoritmasıdır.</td>
                  </tr>
                  <tr>
                    <td>DES</td>
                    <td><Badge bg="danger">Düşük</Badge></td>
                    <td>Data Encryption Standard, 56-bit anahtar uzunluğu ile artık güvenli kabul edilmemektedir.</td>
                  </tr>
                  <tr>
                    <td>Triple DES</td>
                    <td><Badge bg="warning">Orta</Badge></td>
                    <td>DES algoritmasının üç kez uygulanmasıyla oluşturulmuştur. DES'ten daha güvenlidir ancak modern standartlara göre yavaştır.</td>
                  </tr>
                  <tr>
                    <td>Rabbit</td>
                    <td><Badge bg="primary">Yüksek</Badge></td>
                    <td>Yüksek hızlı akış şifrelemesi, 128-bit anahtar kullanır.</td>
                  </tr>
                  <tr>
                    <td>RC4</td>
                    <td><Badge bg="danger">Düşük</Badge></td>
                    <td>Rivest Cipher 4, bilinen güvenlik açıkları nedeniyle artık önerilmemektedir.</td>
                  </tr>
                </tbody>
              </Table>

              <h4 className="mt-4">Güvenlik Önerileri</h4>
              <Alert variant="info">
                <ul className="mb-0">
                  <li>Hassas veriler için her zaman AES-256 kullanın.</li>
                  <li>Güçlü ve benzersiz şifreler kullanın (en az 12 karakter, büyük/küçük harf, rakam ve özel karakterler içeren).</li>
                  <li>Şifrelerinizi güvenli bir şekilde saklayın, kayıp şifreler kurtarılamaz.</li>
                  <li>Önemli dosyaların şifrelenmemiş yedeklerini güvenli bir yerde saklayın.</li>
                  <li>Şifrelenmiş verileri paylaşırken şifreyi asla aynı kanaldan göndermeyin.</li>
                </ul>
              </Alert>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Layout>
  );
} 