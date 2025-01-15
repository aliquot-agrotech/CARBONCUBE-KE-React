import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Trash, CartPlus } from "react-bootstrap-icons";
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import '../css/WishLists.css';

const WishList = () => {
  const [wish_lists, setWishLists] = useState([]);

  useEffect(() => {
    const fetchWishLists = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch("https://carboncube-ke-rails-cu22.onrender.com/purchaser/wish_lists", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // console.log("Fetched wish_lists data:", data); // Log the response data
        if (data && Array.isArray(data)) {
          setWishLists(data);
        } else {
          // console.error("Invalid data format:", data);
        }
      } catch (error) {
        // console.error("Error fetching wish_lists:", error);
      }
    };
    

    fetchWishLists();
  }, []);

  const handleDeleteWishList = async (adId) => {
    try {
      await fetch(`https://carboncube-ke-rails-cu22.onrender.com/purchaser/wish_lists/${adId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
        }
      });
      setWishLists(wish_lists.filter((wish_list) => wish_list.ad.id !== adId));
    } catch (error) {
      // console.error("Error deleting wish_list:", error);
    }
  };

  const handleAddToCart = async (adId) => {
    try {
      await fetch(`https://carboncube-ke-rails-cu22.onrender.com/purchaser/cart_items`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ad_id: adId })
      });
      window.alert("Ad added to cart!");
    } catch (error) {
      // console.error("Error adding to cart:", error);
    }
  };

  return (
    <>
      <TopNavbar />
      <div className="wish_lists-page">
        <Container fluid className="p-0">
          <Row>
            <Col xs={12} md={2} className="p-0">
              <Sidebar />
            </Col>
            <Col xs={12} md={10} className="p-2">
              <Container>
                <h2>Wishlist Ads</h2>
                <Row>
                  {wish_lists.length === 0 ? (
                    <p>No wishlists ads found.</p>
                  ) : (
                    wish_lists.map((wish_list) => (
                      <Col key={wish_list.ad.id} md={3} className="mb-4">
                        <Card>
                          <Card.Img variant="top" src={wish_list.ad.first_media_url} />
                          <Card.Body className="p-2 wish_list-body">
                            <Card.Title>{wish_list.ad.title}</Card.Title>
                            <Card.Text >
                              <em className='ad-price-label' style={{ fontSize: '13px' }}>Kshs: </em>
                              <strong className="text-success">
                                {wish_list.ad.price ? parseFloat(wish_list.ad.price).toFixed(2).split('.').map((part, index) => (
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
                                {"★".repeat(wish_list.ad.rating)}{" "}
                                {"☆".repeat(5 - wish_list.ad.rating)}
                              </span> */}
                            </Card.Text>
                            <div className="d-flex justify-content-between">
                              <Button variant="danger" id="button" onClick={() => handleDeleteWishList(wish_list.ad.id)}>
                                <Trash />
                              </Button>
                              <Button variant="warning" id="button" onClick={() => handleAddToCart(wish_list.ad.id)}>
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

export default WishList;
