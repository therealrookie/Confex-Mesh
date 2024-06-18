import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Badge } from "react-bootstrap";

const Status = () => {
  const [brightness, setBrightness] = useState(50); // Default brightness
  const [isAutoBrightness, setIsAutoBrightness] = useState(false); // Auto-brightness off by default

  // Example data for devices
  const miniPCs = [
    { ip: "192.168.1.1", isConnected: true },
    { ip: "192.168.1.1", isConnected: true },
    { ip: "192.168.1.1", isConnected: true },
    { ip: "192.168.1.1", isConnected: true },
    { ip: "192.168.1.1", isConnected: true },
    { ip: "192.168.1.1", isConnected: true },
    { ip: "192.168.1.1", isConnected: true },
  ];

  const pixeraServers = [
    { ip: "192.168.2.1", fps: 60, isConnected: true },
    { ip: "192.168.2.1", fps: 60, isConnected: true },
  ];

  const novastarMX40Pro = { ip: "192.168.3.1", isConnected: true, cabinets: "40/40" };

  const handleBrightnessChange = (e) => {
    setBrightness(e.target.value);
  };

  const toggleAutoBrightness = () => {
    setIsAutoBrightness(!isAutoBrightness);
  };

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h2>Brightness Control</h2>
          <Form>
            <Form.Group>
              <Form.Label>Brightness: {brightness}%</Form.Label>
              <Form.Range
                disabled={isAutoBrightness}
                value={brightness}
                onChange={handleBrightnessChange}
                min="0"
                max="100"
              />
            </Form.Group>
            <Button variant="primary" onClick={toggleAutoBrightness}>
              {isAutoBrightness ? "Switch to Manual" : "Switch to Automatic"}
            </Button>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Nexshop Players</h3>
          {miniPCs.map((pc, index) => (
            <p key={index}>
              <Badge bg={pc.isConnected ? "success" : "danger"}>{pc.isConnected ? "Connected" : "Disconnected"}</Badge>
              IP: {pc.ip}{" "}
            </p>
          ))}
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Pixera four Media Servers</h3>
          {pixeraServers.map((server, index) => (
            <p key={index}>
              <Badge bg={server.isConnected ? "success" : "danger"}>
                {server.isConnected ? "Connected" : "Disconnected"}
              </Badge>
              IP: {server.ip}, FPS: {server.fps}{" "}
            </p>
          ))}
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Novastar MX40-Pro</h3>
          <p>
            <Badge bg={novastarMX40Pro.isConnected ? "success" : "danger"}>
              {novastarMX40Pro.isConnected ? "Connected" : "Disconnected"}
            </Badge>
            IP: {novastarMX40Pro.ip}, Cabinets: {novastarMX40Pro.cabinets}{" "}
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Status;
