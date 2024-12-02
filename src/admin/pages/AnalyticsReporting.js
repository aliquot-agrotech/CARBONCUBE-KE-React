import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import SalesPerformance from '../components/SalesPerformance';
import TopSellingProducts from '../components/TopSellingProducts';
import PurchaserInsights from '../components/PurchaserInsights';
import VendorInsights from '../components/VendorInsights';
import CategoryAnalytics from '../components/CategoryAnalytics'; // Ensure this is imported
import Spinner from "react-spinkit";
import '../css/AnalyticsReporting.css';

const AnalyticsReporting = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://carboncube-ke-rails-4xo3.onrender.com/admin/analytics', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'), // Replace with your actual token
      },
    })
      .then(response => response.json())
      .then(data => {
        setAnalyticsData(data);
        setLoading(false);
      })
      .catch(error => {
        // console.error('Error fetching analytics data:', error);
        setLoading(false);
      });
  }, []);

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
              <Col xs={6} md={3}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Vendors
                  </Card.Header>
                  <Card.Body>
                    {/* <Card.Title className="text-center">Total Vendors</Card.Title> */}
                    <Card.Text className="text-center">
                        <strong>{parseInt(analyticsData.total_vendors, 10).toLocaleString()}</strong> {/* Add commas to the total reviews */}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Purchasers
                  </Card.Header>
                  <Card.Body>
                    {/* <Card.Title className="text-center">Total Purchasers</Card.Title> */}
                    <Card.Text className="text-center">
                        <strong>{parseInt(analyticsData.total_purchasers, 10).toLocaleString()}</strong> {/* Add commas to the total reviews */}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Orders
                  </Card.Header>
                  <Card.Body>
                    {/* <Card.Title className="text-center">Total Orders</Card.Title> */}
                    <Card.Text className="text-center">
                        <strong>{parseInt(analyticsData.total_orders, 10).toLocaleString()}</strong> {/* Add commas to the total reviews */}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Products
                  </Card.Header>
                  <Card.Body>
                    {/* <Card.Title className="text-center">Total Products</Card.Title> */}
                    <Card.Text className="text-center">
                        <strong>{parseInt(analyticsData.total_products, 10).toLocaleString()}</strong> {/* Add commas to the total reviews */}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xs={6} md={3}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Reviews
                  </Card.Header>
                  <Card.Body>
                    {/* <Card.Title className="text-center">Total Reviews</Card.Title> */}
                    <Card.Text className="text-center">
                        <strong>{parseInt(analyticsData.total_reviews, 10).toLocaleString()}</strong> {/* Add commas to the total reviews */}
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
                    {/* <Card.Title className="text-center">Total Products Sold Out</Card.Title> */}
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
                    {/* <Card.Title className="text-center">Total Revenue</Card.Title> */}
                    {/* <Card.Text className="text-center">Ksh: {analyticsData.total_revenue}</Card.Text> */}
                    <Card.Text className="analytics-price-container justify-content-center">
                      <span><em className='analytics-product-price-label text-success'>Kshs: </em></span>
                      <strong style={{ fontSize: '18px' }} className="text-danger">
                        {analyticsData.total_revenue.split('.').map((part, index) => (
                          <React.Fragment key={index}>
                            {index === 0 ? (
                              <span className="analytics-price-integer">
                                {parseInt(part, 10).toLocaleString()} {/* Add commas to the integer part */}
                              </span>
                            ) : (
                              <>
                                <span style={{ fontSize: '10px' }}>.</span>
                                <span className="analytics-price-decimal">
                                  {(part || '00').padEnd(2, '0').slice(0, 2)} {/* Ensure two decimal points */}
                                </span>
                              </>
                            )}
                          </React.Fragment>
                        ))}
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
                    {/* <Card.Title className="text-center">Category Analytics</Card.Title> */}
                    <CategoryAnalytics data={analyticsData.best_selling_categories} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Sales Performance (Last 3 Months)
                  </Card.Header>
                  <Card.Body >
                    <SalesPerformance data={analyticsData.sales_performance} totalRevenue={parseFloat(analyticsData.total_revenue)}/>
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
                  <Card.Body>
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
                  <Card.Body>
                    {/* <Card.Title className="text-center">Purchaser Insights</Card.Title> */}
                    <PurchaserInsights data={analyticsData.purchasers_insights} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Vendor Insights
                  </Card.Header>
                  <Card.Body>
                    {/* <Card.Title className="text-center">Purchaser Insights</Card.Title> */}
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
