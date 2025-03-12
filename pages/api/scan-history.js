import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Tarama geçmişi dosyasının yolu
const HISTORY_FILE = path.join(process.cwd(), 'data', 'scan-history.json');

// Data klasörünün varlığını kontrol et ve yoksa oluştur
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Tarama geçmişini yükle
function loadScanHistory() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) {
      fs.writeFileSync(HISTORY_FILE, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Tarama geçmişi yüklenirken hata oluştu:', error);
    return [];
  }
}

// Tarama geçmişini kaydet
function saveScanHistory(history) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Tarama geçmişi kaydedilirken hata oluştu:', error);
    return false;
  }
}

export default async function handler(req, res) {
  // CORS için OPTIONS isteğini işle
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // GET: Tarama geçmişini getir
  if (req.method === 'GET') {
    try {
      const history = loadScanHistory();
      const { id, limit, sort, filter } = req.query;

      // Belirli bir taramayı getir
      if (id) {
        const scan = history.find(item => item.id === id);
        if (!scan) {
          return res.status(404).json({ message: 'Tarama bulunamadı' });
        }
        return res.status(200).json(scan);
      }

      // Tüm taramaları getir, isteğe bağlı filtreleme ve sıralama
      let result = [...history];

      // Filtreleme
      if (filter) {
        const filterObj = JSON.parse(filter);
        if (filterObj.target) {
          result = result.filter(item => item.target.includes(filterObj.target));
        }
        if (filterObj.scanType) {
          result = result.filter(item => item.scanType === filterObj.scanType);
        }
        if (filterObj.severity) {
          result = result.filter(item => 
            item.summary[filterObj.severity.toLowerCase()] > 0
          );
        }
      }

      // Sıralama
      if (sort) {
        const [field, order] = sort.split(':');
        result.sort((a, b) => {
          if (field === 'timestamp') {
            return order === 'desc' 
              ? new Date(b.timestamp) - new Date(a.timestamp)
              : new Date(a.timestamp) - new Date(b.timestamp);
          }
          return 0;
        });
      } else {
        // Varsayılan olarak en yeni taramalar üstte
        result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }

      // Limit
      if (limit) {
        result = result.slice(0, parseInt(limit));
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Tarama geçmişi alınırken hata oluştu:', error);
      return res.status(500).json({ message: 'Tarama geçmişi alınamadı', error: error.message });
    }
  }

  // POST: Yeni tarama ekle
  if (req.method === 'POST') {
    try {
      const scanData = req.body;
      
      // Gerekli alanları kontrol et
      if (!scanData.target || !scanData.scanType) {
        return res.status(400).json({ message: 'Geçersiz tarama verisi' });
      }

      // Tarama geçmişini yükle
      const history = loadScanHistory();
      
      // Yeni tarama için benzersiz ID oluştur
      const newScan = {
        ...scanData,
        id: uuidv4(),
        timestamp: scanData.timestamp || new Date().toISOString()
      };
      
      // Taramayı geçmişe ekle (en fazla 100 tarama sakla)
      history.unshift(newScan);
      if (history.length > 100) {
        history.length = 100;
      }
      
      // Geçmişi kaydet
      if (saveScanHistory(history)) {
        return res.status(201).json({ message: 'Tarama başarıyla kaydedildi', scan: newScan });
      } else {
        return res.status(500).json({ message: 'Tarama kaydedilemedi' });
      }
    } catch (error) {
      console.error('Tarama kaydedilirken hata oluştu:', error);
      return res.status(500).json({ message: 'Tarama kaydedilemedi', error: error.message });
    }
  }

  // DELETE: Tarama sil
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      // ID kontrolü
      if (!id) {
        return res.status(400).json({ message: 'Silinecek tarama ID\'si belirtilmedi' });
      }
      
      // Tarama geçmişini yükle
      const history = loadScanHistory();
      
      // Taramayı bul
      const index = history.findIndex(item => item.id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Tarama bulunamadı' });
      }
      
      // Taramayı sil
      history.splice(index, 1);
      
      // Geçmişi kaydet
      if (saveScanHistory(history)) {
        return res.status(200).json({ message: 'Tarama başarıyla silindi' });
      } else {
        return res.status(500).json({ message: 'Tarama silinemedi' });
      }
    } catch (error) {
      console.error('Tarama silinirken hata oluştu:', error);
      return res.status(500).json({ message: 'Tarama silinemedi', error: error.message });
    }
  }

  // Desteklenmeyen HTTP metodu
  return res.status(405).json({ message: 'Method not allowed' });
} 