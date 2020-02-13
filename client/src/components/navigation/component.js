import React from "react";
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

export default function Navigation() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/home">Project: Gairos</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/home">
            <FontAwesomeIcon className="icon-fixed-width" icon={faHomeHeart} />
            Home
          </Nav.Link>
          <Nav.Link href="/track">
            <FontAwesomeIcon
              className="icon-fixed-width"
              icon={faHourglassStart}
            />
            Track
          </Nav.Link>
          {/* <Nav.Link href="/tags">
            <FontAwesomeIcon className="icon-fixed-width" icon={faTags} />
            Tags
          </Nav.Link> */}
          <Nav.Link href="/tasks">
            <FontAwesomeIcon className="icon-fixed-width" icon={faTasks} />
            Tasks
          </Nav.Link>
          <Nav.Link href="/reports">
            <FontAwesomeIcon
              className="icon-fixed-width"
              icon={faFileChartLine}
            />
            Reports
          </Nav.Link>
          <Nav.Link href="/history">
            <FontAwesomeIcon className="icon-fixed-width" icon={faHistory} />
            History
          </Nav.Link>
          <Nav.Link href="/about">
            <FontAwesomeIcon className="icon-fixed-width" icon={faInfoSquare} />
            About
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
