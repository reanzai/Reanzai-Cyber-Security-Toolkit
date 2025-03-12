import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card, Button, Form, Alert, Table, Badge, Spinner, Row, Col, Tabs, Tab, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShieldAlt, faExclamationTriangle, faInfoCircle, faGlobe, faServer, faCode } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';

// Tamamen istemci tarafında render edilecek bileşen
const ThreatIntelligenceClient = dynamic(() => import('../../components/ThreatIntelligenceClient'), {
  ssr: false,
  loading: () => (
    <Layout>
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </Spinner>
        <p className="mt-3">Tehdit İstihbaratı aracı yükleniyor...</p>
      </div>
    </Layout>
  )
});

export default function ThreatIntelligence() {
  return <ThreatIntelligenceClient />;
} 