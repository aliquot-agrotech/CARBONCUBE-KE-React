import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import './TopWishListedAds.css';

const TopWishListedAds = ({ data }) => {
  return (
    <Row>
      {data.map((ad) => (
        <Col xs={12} md={6} lg={4} key={ad.ad_id} className="mb-1 mb-lg-2">
          <Card className="h-100">
            <Card.Img
              className="ad-image"
              variant="top"
              src={ad.ad_media && ad.ad_media.length > 0 ? ad.ad_media[0] : 'https://via.placeholder.com/150'}
            />
            <Card.Body className="analytics-card-body p-0 mx-2">
              <Card.Title className='d-flex justify-content-start mb-0' style={{ fontSize: '17px' }}>{ad.ad_title}</Card.Title>
              <Card.Text className="d-flex justify-content-between align-items-center">
                <strong>Wishlisted:&nbsp;</strong> 
                <span className="badge bg-primary">{ad.wishlist_count} wishes</span>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TopWishListedAds;
