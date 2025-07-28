import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopNavbar from '../components/TopNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import { Container, Row, Col } from 'react-bootstrap';
import './dashboard.css'; 
import { CircleUserRound } from 'lucide-react';

function SalesDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token)

    const API_URL = `${process.env.REACT_APP_BACKEND_URL}/sales/analytics`;

    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
         console.log('Full API response:', res.data)
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <>
        <TopNavbar />
        <div className="container mt-5">
          <div className="alert alert-info">Loading dashboard...</div>
        </div>
      </>
    );
  }

  if (!analytics) {
    return (
      <>
        <TopNavbar />
        <div className="container mt-5">
          <div className="alert alert-danger">Failed to load analytics data.</div>
        </div>
      </>
    );  
  }

  const { total_sellers, total_ads, total_buyers, total_reviews } = analytics;
  
  return (
    <>
      <TopNavbar />
      
      {/* Header Section */}
      <div className="container mt-2">
        <h2 className="mb-4">Sales Dashboard</h2>
        <div className='d-flex justify-content-between align-items-center'>
          <h3 className='text-success'>Overview</h3>
          <div className='d-flex align-items-center'>
            <CircleUserRound className='text-success' />
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <Container fluid className="analytics-reporting-page">
        <Row className="g-0">
          {/* Sidebar */}
          <Col xs={12} md={2} className="pe-3">
            <Sidebar />
          </Col>
          
          {/* Main Content Area */}
          <Col xs={12} md={10}>
            <div className="content-area">
              <Row className="g-3">
                {[
                  { title: "Total Sellers", value: analytics.total_sellers },
                  { title: "Total Buyers", value: analytics.total_buyers },
                  { title: "Total Reviews", value: analytics.total_reviews },
                  { title: "Total Ads", value: analytics.total_ads },
                  { title: "Total Wishlists", value: analytics.total_ads_wish_listed },
                ].map(({ title, value }, index) => (
                  <Col xs={12} sm={6} lg={4} xl={3} key={index}>
                    <div className="stat-card p-3 rounded shadow-sm bg-white h-100">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0 fw-semibold text-muted">{title}</h6>
                        <div className="dots">⋯</div>
                      </div>
                      <h3 className="fw-bold">{value || 0}</h3>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SalesDashboard;