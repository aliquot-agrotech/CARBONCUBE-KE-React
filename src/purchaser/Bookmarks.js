import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Trash, CartPlus } from "react-bootstrap-icons";
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './Bookmarks.css';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch("https://carboncube-ke-rails-qrvq.onrender.com/purchaser/bookmarks", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched bookmarks data:", data); // Log the response data
        if (data && Array.isArray(data)) {
          setBookmarks(data);
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };
    

    fetchBookmarks();
  }, []);

  const handleDeleteBookmark = async (productId) => {
    try {
      await fetch(`https://carboncube-ke-rails-qrvq.onrender.com/purchaser/bookmarks/${productId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
        }
      });
      setBookmarks(bookmarks.filter((bookmark) => bookmark.product.id !== productId));
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await fetch(`https://carboncube-ke-rails-qrvq.onrender.com/purchaser/cart_items`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ product_id: productId })
      });
      window.alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <>
      <TopNavbar />
      <div className="bookmarks-page">
        <Container fluid className="p-0">
          <Row>
            <Col xs={12} md={2} className="p-0">
              <Sidebar />
            </Col>
            <Col xs={12} md={10} className="p-2">
              <Container>
                <h2>Bookmarked Products</h2>
                <Row>
                  {bookmarks.length === 0 ? (
                    <p>No bookmarks found.</p>
                  ) : (
                    bookmarks.map((bookmark) => (
                      <Col key={bookmark.product.id} md={3} className="mb-4">
                        <Card>
                          <Card.Img variant="top" src={bookmark.product.first_media_url} />
                          <Card.Body className="p-2">
                            <Card.Title>{bookmark.product.title}</Card.Title>
                            <Card.Text>
                              <em className='product-price-label'>Kshs: </em>
                              <strong>
                                {bookmark.product.price ? bookmark.product.price.split('.').map((part, index) => (
                                  <React.Fragment key={index}>
                                    {index === 0 ? (
                                      <span className="price-integer">
                                        {parseInt(part, 10).toLocaleString()}
                                      </span>
                                    ) : (
                                      <>
                                        <span style={{ fontSize: '16px' }}>.</span>
                                        <span className="price-decimal">{part}</span>
                                      </>
                                    )}
                                  </React.Fragment>
                                )) : 'N/A'}
                              </strong>
                              <br />
                              {/* Rating: 
                              <span className="stars">
                                {"★".repeat(bookmark.product.rating)}{" "}
                                {"☆".repeat(5 - bookmark.product.rating)}
                              </span> */}
                            </Card.Text>
                            <div className="d-flex justify-content-between">
                              <Button variant="danger" id="button" onClick={() => handleDeleteBookmark(bookmark.product.id)}>
                                <Trash />
                              </Button>
                              <Button variant="warning" id="button" onClick={() => handleAddToCart(bookmark.product.id)}>
                                <CartPlus />
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  )}
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Bookmarks;
