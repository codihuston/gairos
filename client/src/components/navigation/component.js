import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHomeHeart,
  faHourglassStart,
  // faTags,
  faTasks,
  faFileChartLine,
  faHistory,
  faInfoSquare
} from "@fortawesome/pro-duotone-svg-icons";

import { component as LogoutButton } from "../logout-button";

export default function Navigation() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/home">Project: Gairos</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/home">
            <FontAwesomeIcon className="icon-fixed-width" icon={faHomeHeart} />
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/track">
            <FontAwesomeIcon
              className="icon-fixed-width"
              icon={faHourglassStart}
            />
            Track
          </Nav.Link>
          {/* <Nav.Link as={Link} to="/tags">
            <FontAwesomeIcon className="icon-fixed-width" icon={faTags} />
            Tags
          </Nav.Link> */}
          <Nav.Link as={Link} to="/tasks">
            <FontAwesomeIcon className="icon-fixed-width" icon={faTasks} />
            Tasks
          </Nav.Link>
          <Nav.Link as={Link} to="/reports">
            <FontAwesomeIcon
              className="icon-fixed-width"
              icon={faFileChartLine}
            />
            Reports
          </Nav.Link>
          <Nav.Link as={Link} to="/history">
            <FontAwesomeIcon className="icon-fixed-width" icon={faHistory} />
            History
          </Nav.Link>
          <Nav.Link as={Link} to="/about">
            <FontAwesomeIcon className="icon-fixed-width" icon={faInfoSquare} />
            About
          </Nav.Link>
          <Nav.Link as={Link} to="/logout">
            <LogoutButton />
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
