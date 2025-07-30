import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopNavbar from '../components/TopNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import { Container, Row, Col , Card} from 'react-bootstrap';
import { Pie, Bar } from 'react-chartjs-2';
import './dashboard.css'; 
import { CircleUserRound } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function SalesDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    

    const API_URL = `${process.env.REACT_APP_BACKEND_URL}/sales/analytics`;

    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
         
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

  const { total_sellers, total_ads, total_buyers, total_reviews ,subscription_countdowns , without_subscription} = analytics;

  let renewalRate = total_sellers > 0 ? (subscription_countdowns / total_sellers * 100).toFixed(2) : 0;

   
  const pieData = {
    labels: ['Active Subscriptions', 'Inactive Subscriptions'],
    datasets: [
      {
        label: 'Sellers',
        data: [subscription_countdowns, without_subscription],
        backgroundColor: ['#4caf50', '#f44336'],
        borderColor: ['#fff', '#fff'],
        borderWidth: 2,
      },
    ],
  };
   
  const barData = {
    labels: ['Renewal Rate'],
    datasets: [
      {
        label: 'Renewal %',
        data: [parseFloat(renewalRate)],
        backgroundColor: '#4caf50',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };
  
  return (
    <>
      <TopNavbar />
      
     

      
      <Container fluid className="analytics-reporting-page">

      
       
        
        
      
        <Row className="g-0">
          
          <Col xs={12} md={2} className="pe-3">
            <Sidebar />
          </Col>

          
          
          
          <Col xs={12} md={10}>
            <div className="content-area">
            <div className="d-flex justify-content-between align-items-center mb-4 bg-secondary p-3 text-white rounded">
              <h2 className="mb-0">Overview</h2>
              <span className="fw-semibold">Hello, Sales Team</span>
      </div>
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

              <Row className='g-6'>
              


               <Col xs={12} md={6} className="text-center mt-4 ">
          <Card className="p-3 shadow-sm custom-card">
            <Card.Header className="text-center fw-bold">
              Subscription Distribution
            </Card.Header>
            <Card.Body className=''>
              <Pie data={pieData} className='' />
            </Card.Body>
          </Card>
        </Col>


            <Col xs={12} md={6} className="text-center mt-4 ">
          <Card className="p-3 shadow-sm custom-card h-100">
            <Card.Header className="text-center fw-bold">Renewal Rate {renewalRate} (%)</Card.Header>
            <Card.Body>
              <Bar data={barData} options={barOptions} className='h-100' />
            </Card.Body>
          </Card>
        </Col>

       
             </Row>
             <Row className="mt-4 g-4">
       
      </Row>

             


             
            </div>
          </Col>
        </Row>

        


      </Container>
    </>
  );
}

export default SalesDashboard;