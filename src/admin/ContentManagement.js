import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal, Table, Card } from 'react-bootstrap';
import { Trash, Pencil } from 'react-bootstrap-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './ContentManagement.css';  // Custom CSS

const ContentManagement = () => {
    const [aboutData, setAboutData] = useState(null);
    const [faqsData, setFaqsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [currentEdit, setCurrentEdit] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const aboutResponse = await fetch('http://localhost:3000/admin/abouts', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                const faqsResponse = await fetch('http://localhost:3000/admin/faqs', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });

                console.log('About response status:', aboutResponse.status);
                console.log('FAQs response status:', faqsResponse.status);

                if (!aboutResponse.ok || !faqsResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const about = await aboutResponse.json();
                const faqs = await faqsResponse.json();

                console.log('Fetched aboutData:', about);
                console.log('Fetched faqsData:', faqs);

                setAboutData(about);
                setFaqsData(faqs);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = (dataType, data) => {
        setCurrentEdit({ type: dataType, data });
        setEditMode(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentEdit((prev) => ({
            ...prev,
            data: {
                ...prev.data,
                [name]: value,
            },
        }));
    };

    const handleSaveChanges = async () => {
        try {
            const { type, data } = currentEdit;
            const url = `http://localhost:3000/admin/${type}/${data.id}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            if (type === 'abouts') {
                console.log('Updated aboutData:', data);
                setAboutData([data]);  // Ensure aboutData remains an array
            } else if (type === 'faqs') {
                console.log('Updated FAQ:', data);
                setFaqsData((prevFaqs) =>
                    prevFaqs.map((faq) => (faq.id === data.id ? data : faq))
                );
            }

            setEditMode(false);
            setCurrentEdit(null);
        } catch (error) {
            console.error('Error saving changes:', error);
            setError('Error saving changes');
        }
    };

    const handleDeleteFaq = async (faqId) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/faqs/${faqId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setFaqsData(prevFaqs => prevFaqs.filter(faq => faq.id !== faqId));
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            setError('Error deleting FAQ');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const about = aboutData && aboutData.length > 0 ? aboutData[0] : null;

    return (
        <>
            <TopNavbar />
            <div className="content-management-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={2} className="p-0">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={10} className="p-4">
                            {/* About Us Section */}
                            <div className="section">
                                <h2>About Us</h2>
                                <Card>
                                    <Card.Header className="text-center">
                                        ABOUT US
                                    </Card.Header>
                                    <Card.Body>
                                        <Form>
                                            <Form.Group controlId="formDescription" className="text-center">
                                                <Form.Label style={{ fontWeight: 'bold' }}>Description</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="description"
                                                    value={about?.description || ''}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formMission" className="text-center">
                                                <Form.Label style={{ fontWeight: 'bold' }}>Mission</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="mission"
                                                    value={about?.mission || ''}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formVision" className="text-center">
                                                <Form.Label style={{ fontWeight: 'bold' }}>Vision</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="vision"
                                                    value={about?.vision || ''}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formValues" className="text-center">
                                                <Form.Label style={{ fontWeight: 'bold' }}>Values</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="values"
                                                    value={(Array.isArray(about?.values) ? about.values.join(', ') : '') || ''}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formWhyChooseUs" className="text-center">
                                                <Form.Label style={{ fontWeight: 'bold' }}>Why Choose Us</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="why_choose_us"
                                                    value={about?.why_choose_us || ''}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formImageUrl"className="text-center">
                                                <Form.Label style={{ fontWeight: 'bold' }}>Image URL</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="image_url"
                                                    value={about?.image_url || ''}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Card.Body>
                                    <Card.Footer className="text-center">
                                        <Button
                                            variant="warning"
                                            onClick={() => handleEditClick('abouts', about)}
                                            id="button"
                                            disabled={!about}
                                        >
                                            <Pencil /> Edit
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </div>

                            {/* FAQs Section */}
                            <div className="section">
                                <h2>FAQs</h2>
                                <Table hover className="faqs-table text-center">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Question</th>
                                            <th>Answer</th>
                                            <th>Edit</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {faqsData.length > 0 ? (
                                            faqsData.map((faq) => (
                                                <tr key={faq.id}>
                                                    <td>{faq.id}</td>
                                                    <td>{faq.question}</td>
                                                    <td>{faq.answer}</td>
                                                    <td>
                                                        <Button
                                                            variant="warning"
                                                            onClick={() => handleEditClick('faqs', faq)}
                                                            id="button"
                                                        >
                                                            <Pencil />
                                                            </Button>
                                                    </td>
                                                    <td>
                                                        
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => handleDeleteFaq(faq.id)}
                                                            id="button"
                                                        >
                                                            <Trash />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4">No data available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </Container>

                {/* Edit Modal */}
                <Modal show={editMode} onHide={() => setEditMode(false)} size="lg">
                    <Modal.Header>
                        <Modal.Title>Edit {currentEdit?.type === 'abouts' ? 'About Us' : 'FAQ'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {currentEdit && (
                            <Form>
                                {currentEdit.type === 'abouts' && (
                                    <>
                                        <Form.Group controlId="formDescription" className="text-center">
                                            <Form.Label style={{ fontWeight: 'bold' }}>Description</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="description"
                                                value={currentEdit.data.description}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formMission" className="text-center">
                                            <Form.Label style={{ fontWeight: 'bold' }}>Mission</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="mission"
                                                value={currentEdit.data.mission}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formVision" className="text-center">
                                            <Form.Label style={{ fontWeight: 'bold' }}>Vision</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="vision"
                                                value={currentEdit.data.vision}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formValues" className="text-center">
                                            <Form.Label style={{ fontWeight: 'bold' }}>Values</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="values"
                                                value={(Array.isArray(currentEdit.data.values) ? currentEdit.data.values.join(', ') : '')}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formWhyChooseUs" className="text-center">
                                            <Form.Label style={{ fontWeight: 'bold' }}>Why Choose Us</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="why_choose_us"
                                                value={currentEdit.data.why_choose_us}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formImageUrl" className="text-center">
                                            <Form.Label style={{ fontWeight: 'bold' }}>Image URL</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="image_url"
                                                value={currentEdit.data.image_url}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </>
                                )}
                                {currentEdit.type === 'faqs' && (
                                    <>
                                        <Form.Group controlId="formQuestion" className="text-center">
                                            <Form.Label style={{ fontWeight: 'bold' }}>Question</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="question"
                                                value={currentEdit.data.question}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formAnswer" className="text-center">
                                            <Form.Label style={{ fontWeight: 'bold' }}>Answer</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="answer"
                                                value={currentEdit.data.answer}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </>
                                )}
                            </Form>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" className='me-3' id="button" onClick={() => setEditMode(false)}>
                            Close
                        </Button>
                        <Button variant="warning" id="button" onClick={handleSaveChanges}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default ContentManagement;
