import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import SalesPerformance from '../components/SalesPerformance';
import TopSellingProducts from '../components/TopSellingProducts';
import PurchaserInsights from '../components/PurchaserInsights';
import VendorInsights from '../components/VendorInsights';
import CategoryAnalytics from '../components/CategoryAnalytics';
import Spinner from "react-spinkit";
import '../css/AnalyticsReporting.css';

const AnalyticsReporting = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://carboncube-ke-rails-4xo3.onrender.com/admin/analytics', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    })
      .then(response => response.json())
      .then(data => {
        setAnalyticsData(data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  }, []);

  const formatCurrency = (value) => {
    return value?.split('.').map((part, index) => (
      <React.Fragment key={index}>
        {index === 0 ? (
          <span>{parseInt(part, 10).toLocaleString()}</span>
        ) : (
          <>
            <span style={{ fontSize: '10px' }}>.</span>
            <span>{(part || '00').padEnd(2, '0').slice(0, 2)}</span>
          </>
        )}
      </React.Fragment>
    )) || 'Ksh 0';
  };

  if (loading) {
    return (
      <div className="centered-loader">
        <Spinner variant="warning" name="cube-grid" style={{ width: 100, height: 100 }} />
      </div>
    );
  }

  if (!analyticsData) {
    return <div>Error loading data</div>;
  }

  return (
    <>
      <TopNavbar />
      <Container fluid className="analytics-reporting-page">
        <Row>
          <Col xs={12} md={2} className="p-0">
            <Sidebar />
          </Col>
          <Col xs={12} md={10} lg={9} className="content-area">
            <Row>
              {[
                { title: "Total Vendors", value: analyticsData.total_vendors },
                { title: "Total Purchasers", value: analyticsData.total_purchasers },
                { title: "Total Orders", value: analyticsData.total_orders },
                { title: "Total Products", value: analyticsData.total_products },
              ].map(({ title, value }, index) => (
                <Col xs={6} md={3} key={index}>
                  <Card className="mb-2 mb-lg-4 custom-card">
                    <Card.Header className="justify-content-center">{title}</Card.Header>
                    <Card.Body>
                      <Card.Text className="text-center">
                        <strong>{parseInt(value, 10).toLocaleString()}</strong>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <Row>
              <Col xs={6} md={3}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Reviews
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className="text-center">
                      <strong>{parseInt(analyticsData.total_reviews, 10).toLocaleString()}</strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Products Sold
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className="text-center"><strong>{analyticsData.total_products_sold_out}</strong></Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={3}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Revenue
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className="analytics-price-container text-center">
                      <span><em className='analytics-product-price-label text-success'>Kshs: </em></span>
                      <strong style={{ fontSize: '18px' }} className="text-danger">
                        {formatCurrency(analyticsData.total_revenue)}
                      </strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Category Analytics
                  </Card.Header>
                  <Card.Body>
                    <CategoryAnalytics data={analyticsData.best_selling_categories} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Sales Performance (Last 3 Months)
                  </Card.Header>
                  <Card.Body>
                    <SalesPerformance data={analyticsData.sales_performance} totalRevenue={parseFloat(analyticsData.total_revenue)} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={12}>
                <Card className="mb-4 custom-card">
                <Card.Header className="justify-content-center">
                    Top Selling Products
                  </Card.Header>
                  <Card.Body className='p-3'>
                    {/* <Card.Title className="text-center">Top Selling Products</Card.Title> */}
                    <TopSellingProducts data={analyticsData.best_selling_products} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Purchaser Insights
                  </Card.Header>
                  <Card.Body className="px-2">
                    <PurchaserInsights data={analyticsData.purchasers_insights} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Vendor Insights
                  </Card.Header>
                  <Card.Body className="px-2">
                    <VendorInsights data={analyticsData.vendors_insights} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AnalyticsReporting;