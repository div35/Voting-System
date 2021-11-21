import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
const NavHeading = () => {
  return (
    <div>
      <Navbar bg="dark" variant="dark" collapseOnSelect className="rounded-bottom mb-3">
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            E - Voting System
          </Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link as={NavLink} to="/login">
              <i className="fas fa-sign-in-alt"></i> &nbsp; LogIn
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavHeading;
