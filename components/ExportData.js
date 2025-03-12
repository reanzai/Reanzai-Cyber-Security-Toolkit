import { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';

/**
 * ExportData bileşeni - Araç sonuçlarını farklı formatlarda dışa aktarmak için kullanılır
 * @param {Object} props - Bileşen özellikleri
 * @param {Object} props.data - Dışa aktarılacak veri
 * @param {string} props.fileName - Dosya adı (uzantısız)
 * @param {string} props.title - Modal başlığı
 */
export default function ExportData({ data, fileName = 'export', title = 'Veriyi Dışa Aktar' }) {
  const [show, setShow] = useState(false);
  const [format, setFormat] = useState('json');
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setShow(false);
    setSuccess(false);
    setError('');
  };

  const handleShow = () => setShow(true);

  const getFormattedData = () => {
    // Veri kopyasını oluştur
    let exportData = { ...data };

    // Metadata ekle
    if (includeMetadata) {
      exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          toolName: title,
          version: '1.0.0'
        },
        data: exportData
      };
    } else if (includeTimestamp) {
      // Sadece zaman damgası ekle
      exportData.exportDate = new Date().toISOString();
    }

    // Formatı dönüştür
    switch (format) {
      case 'json':
        return JSON.stringify(exportData, null, 2);
      case 'csv':
        return convertToCSV(exportData);
      case 'xml':
        return convertToXML(exportData);
      case 'txt':
        return convertToText(exportData);
      default:
        return JSON.stringify(exportData);
    }
  };

  // JSON'dan CSV'ye dönüştürme
  const convertToCSV = (jsonData) => {
    if (!jsonData || Object.keys(jsonData).length === 0) return '';

    // Düz bir yapı oluştur
    const flattenData = (data, prefix = '') => {
      let result = {};
      
      for (const key in data) {
        if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
          const flatObject = flattenData(data[key], `${prefix}${key}_`);
          result = { ...result, ...flatObject };
        } else if (Array.isArray(data[key])) {
          data[key].forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              const flatObject = flattenData(item, `${prefix}${key}_${index}_`);
              result = { ...result, ...flatObject };
            } else {
              result[`${prefix}${key}_${index}`] = item;
            }
          });
        } else {
          result[`${prefix}${key}`] = data[key];
        }
      }
      
      return result;
    };

    const flatData = flattenData(jsonData);
    const headers = Object.keys(flatData);
    const csvRows = [headers.join(',')];
    csvRows.push(headers.map(header => {
      const value = flatData[header];
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    }).join(','));

    return csvRows.join('\n');
  };

  // JSON'dan XML'e dönüştürme
  const convertToXML = (jsonData) => {
    const jsonToXml = (obj, rootName = 'root') => {
      let xml = `<?xml version="1.0" encoding="UTF-8" ?>\n<${rootName}>`;
      
      const parseObject = (obj, parentName) => {
        for (const key in obj) {
          const value = obj[key];
          
          if (Array.isArray(value)) {
            xml += `<${key}>`;
            value.forEach(item => {
              if (typeof item === 'object' && item !== null) {
                xml += `<item>`;
                parseObject(item, 'item');
                xml += `</item>`;
              } else {
                xml += `<item>${item}</item>`;
              }
            });
            xml += `</${key}>`;
          } else if (typeof value === 'object' && value !== null) {
            xml += `<${key}>`;
            parseObject(value, key);
            xml += `</${key}>`;
          } else {
            xml += `<${key}>${value}</${key}>`;
          }
        }
      };
      
      parseObject(obj, rootName);
      xml += `</${rootName}>`;
      return xml;
    };
    
    return jsonToXml(jsonData, 'exportData');
  };

  // JSON'dan düz metne dönüştürme
  const convertToText = (jsonData) => {
    const parseObject = (obj, indent = 0) => {
      let text = '';
      const spaces = ' '.repeat(indent);
      
      for (const key in obj) {
        const value = obj[key];
        
        if (Array.isArray(value)) {
          text += `${spaces}${key}:\n`;
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              text += `${spaces}  [${index}]:\n${parseObject(item, indent + 4)}`;
            } else {
              text += `${spaces}  [${index}]: ${item}\n`;
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          text += `${spaces}${key}:\n${parseObject(value, indent + 2)}`;
        } else {
          text += `${spaces}${key}: ${value}\n`;
        }
      }
      
      return text;
    };
    
    return parseObject(jsonData);
  };

  const handleExport = () => {
    try {
      const formattedData = getFormattedData();
      const timestamp = includeTimestamp ? `_${new Date().toISOString().replace(/:/g, '-').split('.')[0]}` : '';
      const fullFileName = `${fileName}${timestamp}.${format}`;
      
      // Dosya indirme işlemi
      const blob = new Blob([formattedData], { type: getContentType() });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fullFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess(true);
      setError('');
    } catch (err) {
      setError(`Dışa aktarma hatası: ${err.message}`);
      setSuccess(false);
    }
  };

  const getContentType = () => {
    switch (format) {
      case 'json': return 'application/json';
      case 'csv': return 'text/csv';
      case 'xml': return 'application/xml';
      case 'txt': return 'text/plain';
      default: return 'text/plain';
    }
  };

  return (
    <>
      <Button variant="outline-secondary" onClick={handleShow} className="d-flex align-items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download me-2" viewBox="0 0 16 16">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
        </svg>
        Dışa Aktar
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success && (
            <Alert variant="success" className="mb-3">
              Veri başarıyla dışa aktarıldı!
            </Alert>
          )}
          
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Dosya Formatı</Form.Label>
              <Form.Select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="xml">XML</option>
                <option value="txt">Düz Metin</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="Zaman damgası ekle" 
                checked={includeTimestamp} 
                onChange={(e) => setIncludeTimestamp(e.target.checked)} 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="Metadata ekle (araç bilgileri, versiyon)" 
                checked={includeMetadata} 
                onChange={(e) => setIncludeMetadata(e.target.checked)} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Kapat
          </Button>
          <Button variant="primary" onClick={handleExport}>
            İndir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
} 