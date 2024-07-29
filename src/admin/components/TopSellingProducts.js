import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import './TopSellingProducts.css'; // Make sure this file contains your CSS

const TopSellingProducts = ({ data }) => {
  return (
    <Row>
      {Object.entries(data).map(([category, product]) => (
        <Col xs={12} md={6} lg={4} key={product.product_id} className="mb-4">
          <Card className="h-100"> {/* Ensure cards fill the column height */}
            <Card.Body>
              <Card.Title>{product.product_title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted text-center">{category}</Card.Subtitle>
              <Card.Text>
                <strong>Sold:</strong> {product.total_sold}
              </Card.Text>
              <Card.Text>
                <strong>Price:</strong> Ksh {product.product_price}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TopSellingProducts;
