import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Trash, CartPlus } from "react-bootstrap-icons";
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:3000/purchaser/bookmarks", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.bookmarks) {
          setBookmarks(data.bookmarks);
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
      await fetch(`http://localhost:3000/purchaser/bookmarks/${productId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
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
      await fetch(`http://localhost:3000/purchaser/cart`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
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
                <h2>Bookmarked Items</h2>
                <Row>
                  {bookmarks.length === 0 ? (
                    <p>No bookmarks found.</p>
                  ) : (
                    bookmarks.map((bookmark) => (
                      <Col key={bookmark.product.id} md={4} className="mb-4">
                        <Card>
                          <Card.Img variant="top" src={bookmark.product.first_media_url} />
                          <Card.Body>
                            <Card.Title>{bookmark.product.title}</Card.Title>
                            <Card.Text>
                              Price: KSh {bookmark.product.price.toLocaleString()}
                              <br />
                              Rating: 
                              <span className="stars">
                                {"★".repeat(bookmark.product.rating)}{" "}
                                {"☆".repeat(5 - bookmark.product.rating)}
                              </span>
                            </Card.Text>
                            <div className="d-flex justify-content-between">
                              <Button variant="danger" onClick={() => handleDeleteBookmark(bookmark.product.id)}>
                                <Trash /> Delete
                              </Button>
                              <Button variant="success" onClick={() => handleAddToCart(bookmark.product.id)}>
                                <CartPlus /> Add to Cart
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
