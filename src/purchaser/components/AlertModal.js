import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap'; // Import Modal from react-bootstrap
import './AlertModal.css'; // Import the updated CSS for animation

const AlertModal = ({ isVisible, message, onClose, loading }) => {
    if (!isVisible) return null;

    return (
        <Modal centered show={isVisible} onHide={onClose} className="bouncy-modal">
            <Modal.Header className="justify-content-center p-1 py-lg-1">
                <Modal.Title>Alert</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-lg-2 py-0 py-lg-4 px-sm-3 py-lg-2 custom-card text-center">
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" />
                        <p>Loading...</p>
                    </div>
                ) : (
                    <h5 className="mb-0">{message}</h5>
                )}
            </Modal.Body>
            <Modal.Footer className="p-0 py-lg-0">
                <Button variant="danger" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AlertModal;
