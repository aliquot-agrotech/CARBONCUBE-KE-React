import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import './TopSellingProducts.css';

const TopSellingProducts = ({ data }) => {
  return (
    <Row>
      {data.map((product) => (
        <Col xs={12} md={6} lg={4} key={product.product_id} className="mb-4">
          <Card className="h-100">
          <Card.Img
              className="analytics-card-img-top product-image"
              variant="top"
              src={product.media && product.media.length > 0 ? product.media[0] : 'default-image-url'}
            />
            <Card.Body className="analytics-card-body text-center p-0">
              <Card.Title>{product.product_title}</Card.Title>
              <Card.Text className="analytics-price-container">
                <em className='analytics-product-price-label'>Kshs: </em>
                <strong>
                  {product.product_price.split('.').map((part, index) => (
                      <React.Fragment key={index}>
                          {index === 0 ? (
                              <span className="analytics-price-integer">
                                  {parseInt(part, 10).toLocaleString()} {/* Add commas to the integer part */}
                              </span>
                          ) : (
                              <>
                                  <span style={{ fontSize: '16px' }}>.</span>
                                  <span className="analytics-price-decimal">{part}</span>
                              </>
                          )}
                      </React.Fragment>
                  ))}
                </strong>
              </Card.Text>
              <Card.Text>
                <strong>Sold:</strong> {product.total_sold}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TopSellingProducts;
