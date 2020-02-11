import React from "react";
import { Navbar, Nav } from "react-bootstrap";

export default function Navigation() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/home">Project: Gairos</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/track">Track</Nav.Link>
          <Nav.Link href="/tags">Tags</Nav.Link>
          <Nav.Link href="/tasks">Tasks</Nav.Link>
          <Nav.Link href="/reports">Reports</Nav.Link>
          <Nav.Link href="/history">History</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
