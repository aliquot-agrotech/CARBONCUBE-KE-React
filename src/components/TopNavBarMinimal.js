// src/components/TopNavbarMinimal.js
import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import "./TopNavBarMinimal.css";

const TopNavBarMinimal = () => {
	return (
		<Navbar
			bg="dark"
			variant="dark"
			expand="lg"
			className="fixed-top navbar p-1"
		>
			<Container fluid>
				{/* Left: Logo */}
				<Navbar.Brand href="/" className="d-flex align-items-center">
					<img
						src={`${process.env.PUBLIC_URL}/logo.png`}
						alt="Carboncube Logo"
						width="50"
						height="50"
						className="d-inline-block align-top"
					/>
					{/* <span className="ms-0 fw-bold" style={{ color: '#ffc107' }}>
                        ARBONCUBE
                    </span> */}
				</Navbar.Brand>

				{/* Toggle button for mobile */}
				<Navbar.Toggle aria-controls="top-navbar-collapse" />

				{/* Right: Links (collapsible) */}
				<Navbar.Collapse
					id="top-navbar-collapse"
					className="justify-content-end"
				>
					<Nav className="align-items-center">
						<Nav.Link href="/seller/tiers" className="text-white">
							Tiers & Pricing
						</Nav.Link>
						<Nav.Link href="/terms-and-conditions" className="text-white">
							Terms & Conditions
						</Nav.Link>
						<Nav.Link href="/privacy" className="text-white">
							Privacy Policy
						</Nav.Link>
						<Nav.Link href="/about-us" className="text-white">
							About Us
						</Nav.Link>
						<Nav.Link href="/contact-us" className="text-white">
							Contact Us
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default TopNavBarMinimal;
