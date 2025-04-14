import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './AlertModal.css'; // Keep this for any additional styling

const AlertModal = ({ isVisible, message, onClose, loading }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only show the alert when isVisible is true
    if (isVisible) {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        html: loading ? 
          '<div class="text-center"><div class="swal2-spinner"></div><p>Loading...</p></div>' : 
          `<h5 class="mb-0">${message}</h5>`,
        confirmButtonText: 'Go to Login',
        showCancelButton: true,
        cancelButtonText: 'Close',
        customClass: {
          popup: 'futuristic-swal rounded-4 glass-bg',
          title: 'fw-semibold text-white',
          htmlContainer: 'text-light',
          actions: 'futuristic-actions',
          confirmButton: 'btn rounded-pill futuristic-confirm',
          cancelButton: 'btn rounded-pill futuristic-cancel'
        },
        backdrop: 'rgba(0, 0, 0, 0.6)',
        buttonsStyling: false,
        allowOutsideClick: true,
        showClass: {
          popup: 'swal2-show',
          backdrop: 'swal2-backdrop-show'
        },
        hideClass: {
          popup: 'swal2-hide',
          backdrop: 'swal2-backdrop-hide'
        }
      }).then((result) => {
        // Clean up modal and call onClose
        const cleanupModal = () => {
          Swal.close();
          document.querySelectorAll('.swal2-container, .swal2-backdrop, .futuristic-swal')
            .forEach(element => element.remove());
          document.body.classList.remove('swal2-shown', 'swal2-height-auto');
          document.body.style.paddingRight = '';
          document.body.style.overflow = '';
        };
        
        cleanupModal();
        
        if (result.isConfirmed) {
          setTimeout(() => {
            navigate('/login');
          }, 100);
        } else {
          onClose(); // Call the onClose function passed from parent
        }
      });
    }
  }, [isVisible, message, onClose, loading, navigate]);

  // This component doesn't render anything directly, it triggers SweetAlert
  return null;
};

export default AlertModal;