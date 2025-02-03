import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import CategoryClickEvents from '../components/CategoryClickEvents';
import TopWishListedAds from '../components/TopWishListedAds';
import PurchaserInsights from '../components/PurchaserInsights';
import VendorInsights from '../components/VendorInsights';
import CategoryAnalytics from '../components/CategoryAnalytics';
import OrderStatus from '../components/OrderStatus';
import Spinner from "react-spinkit";
import '../css/AnalyticsReporting.css';

const AnalyticsReporting = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://carboncube-ke-rails-cu22.onrender.com/admin/analytics', {
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

  // const formatCurrency = (value) => {
  //   return value?.split('.').map((part, index) => (
  //     <React.Fragment key={index}>
  //       {index === 0 ? (
  //         <span>{parseInt(part, 10).toLocaleString()}</span>
  //       ) : (
  //         <>
  //           <span style={{ fontSize: '10px' }}>.</span>
  //           <span>{(part || '00').padEnd(2, '0').slice(0, 2)}</span>
  //         </>
  //       )}
  //     </React.Fragment>
  //   )) || 'Ksh 0';
  // };

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
                { title: "Total Reviews", value: analyticsData.total_reviews },
                { title: "Total Ads", value: analyticsData.total_ads },
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
              {/* <Col xs={6} md={3}>
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
              </Col> */}
              <Col xs={6} md={3}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Ads Wishlisted
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className="text-center"><strong>{analyticsData.total_ads_wish_listed}</strong></Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              {/* <Col xs={12} md={3}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Revenue
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className="analytics-price-container text-center">
                      <span><em className='analytics-ad-price-label text-success'>Kshs: </em></span>
                      <strong style={{ fontSize: '16px' }} className="text-danger">
                        {formatCurrency(analyticsData.total_revenue)}
                      </strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col> */}
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Category Analytics
                  </Card.Header>
                  <Card.Body>
                    <CategoryAnalytics data={analyticsData.ads_per_category} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Category Click Events
                  </Card.Header>
                  <Card.Body>
                    <CategoryClickEvents data={analyticsData.category_click_events} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={12}>
                <Card className="mb-4 custom-card">
                <Card.Header className="justify-content-center">
                    Top Wishlisted Ads
                  </Card.Header>
                  <Card.Body className='p-3'>
                    {/* <Card.Title className="text-center">Top WishListed Ads</Card.Title> */}
                    <TopWishListedAds data={analyticsData.top_wishlisted_ads} />
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

            <Row>
            <Col xs={12} md={12}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Order Status Insights
                  </Card.Header>
                  <Card.Body>
                    <OrderStatus data={analyticsData.order_counts_by_status} />
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