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
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/purchaser/wish_lists`, {
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
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/purchaser/wish_lists/${adId}`, {
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
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <Card.Title className="mb-1">{wish_list.ad.title}</Card.Title>
                                <Card.Text className="mb-0">
                                  <em className='ad-price-label' style={{ fontSize: '13px' }}>Kshs: </em>
                                  <strong className="text-danger" style={{ fontSize: '18px' }}>
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
                                </Card.Text>
                              </div>
                              
                              <Button
                                variant="danger"
                                id="button"
                                onClick={() => handleDeleteWishList(wish_list.ad.id)}
                              >
                                <Trash />
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
