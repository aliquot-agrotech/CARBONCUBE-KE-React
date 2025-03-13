import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import CategoryClickEvents from '../components/CategoryClickEvents';
import TopWishListedAds from '../components/TopWishListedAds';
import PurchaserInsights from '../components/PurchaserInsights';
import VendorInsights from '../components/VendorInsights';
import CategoryAnalytics from '../components/CategoryAnalytics';
import CategoryWishlists from '../components/CategoryWishlists';
import { AgeGroupChart, GenderDistributionChart, EmploymentChart, IncomeChart, EducationChart, SectorChart } from "../components/PurchaserDemographics";
import { VendorAgeGroupChart, VendorGenderDistributionChart, VendorCategoryChart, VendorTierChart } from "../components/VendorDemographics";
import Spinner from "react-spinkit";
import '../css/AnalyticsReporting.css';

const AnalyticsReporting = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/analytics`, {
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
                { title: "Total Wishlists", value: analyticsData.total_ads_wish_listed },
              ].map(({ title, value }, index, array) => (
                <Col 
                  xs={array.length % 2 !== 0 && index === array.length - 1 ? 12 : 6} 
                  md={4} 
                  key={index}
                >
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
              <Col xs={12} md={6}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Category Ads Analytics
                  </Card.Header>
                  <Card.Body>
                    <CategoryAnalytics data={analyticsData.ads_per_category} />
                  </Card.Body>
                </Card>
              </Col>
              
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Category WishListed Ads
                  </Card.Header>
                  <Card.Body>
                    <CategoryWishlists data={analyticsData.category_wishlist_data} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={12}>
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

            {/* Purchaser Demographics Charts Section */}
            <Row>
              <Col xs={12}>
                <h3 className="text-center my-2 my-lg-4">Purchaser Demographics</h3>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Age Group Distribution</Card.Header>
                  <Card.Body className="px-3 py-2">
                    <AgeGroupChart data={analyticsData.age_groups} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Employment Status</Card.Header>
                  <Card.Body className="px-3 py-2">
                    <EmploymentChart data={analyticsData.employment_data} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
            <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Income Distribution</Card.Header>
                  <Card.Body className="px-3 py-2">
                    <IncomeChart data={analyticsData.income_data} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Sector Distribution</Card.Header>
                  <Card.Body className="px-3 py-2">
                    <SectorChart data={analyticsData.sector_data} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Gender Distribution</Card.Header>
                  <Card.Body className="px-3 py-2">
                    <GenderDistributionChart data={analyticsData.gender_distribution} />
                  </Card.Body>
                </Card>
              </Col>
              
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Education Level</Card.Header>
                  <Card.Body className="px-3 py-2">
                    <EducationChart data={analyticsData.education_data} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Vendor Demographics Charts Section */}
            <Row>
              <Col xs={12}>
                <h3 className="text-center my-2 my-lg-4">Vendor Demographics</h3>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Age Group Distribution</Card.Header>
                  <Card.Body className="px-3 py-2">
                    <VendorAgeGroupChart data={analyticsData.vendor_age_groups} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Category Distribution</Card.Header>
                  <Card.Body className="px-3 py-2">
                    <VendorCategoryChart data={analyticsData.category_data} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Gender Distribution</Card.Header>
                  <Card.Body className="px-3 py-2">
                    <VendorGenderDistributionChart data={analyticsData.vendor_gender_distribution} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Tier Distribution</Card.Header>
                  <Card.Body className="px-3 py-2">
                    <VendorTierChart data={analyticsData.tier_data} />
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