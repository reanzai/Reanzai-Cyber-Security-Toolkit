import { Server } from 'socket.io';
import pcap from 'pcap';

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', socket => {
      let session = null;

      socket.on('start-capture', data => {
        try {
          if (session) {
            session.close();
          }

          session = pcap.createSession(data.interface, data.filter);

          session.on('packet', raw_packet => {
            const packet = pcap.decode.packet(raw_packet);
            
            // Paket bilgilerini çıkar
            const packetInfo = {
              timestamp: new Date().toISOString(),
              protocol: getProtocol(packet),
              source: getSource(packet),
              destination: getDestination(packet),
              length: raw_packet.length
            };

            socket.emit('packet', packetInfo);
          });
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      socket.on('stop-capture', () => {
        if (session) {
          session.close();
          session = null;
        }
      });

      socket.on('disconnect', () => {
        if (session) {
          session.close();
          session = null;
        }
      });
    });
  }

  res.end();
}

function getProtocol(packet) {
  if (packet.payload?.payload) {
    if (packet.payload.payload.constructor.name === 'TCP') return 'TCP';
    if (packet.payload.payload.constructor.name === 'UDP') return 'UDP';
    if (packet.payload.payload.constructor.name === 'ICMP') return 'ICMP';
  }
  return 'OTHER';
}

function getSource(packet) {
  if (packet.payload?.payload) {
    const ip = packet.payload.saddr;
    const port = packet.payload.payload.sport;
    return port ? `${ip}:${port}` : ip;
  }
  return 'unknown';
}

function getDestination(packet) {
  if (packet.payload?.payload) {
    const ip = packet.payload.daddr;
    const port = packet.payload.payload.dport;
    return port ? `${ip}:${port}` : ip;
  }
  return 'unknown';
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 