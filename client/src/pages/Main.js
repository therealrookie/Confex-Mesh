import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Badge } from "react-bootstrap";
import PreviewWinow from "../components/PreviewWinow";
import NexshopPlayerStatus from "../components/NexshopPlayerStatus";
import SelectedMatrix from "../components/SelectedMatrix";
import PixeraStatus from "../components/PixeraStatus";
import NovastarStatus from "../components/NovastarStatus";
import LedStatus from "../components/LedStatus";

const Main = () => {
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
          <h1>Preview</h1>

          <PreviewWinow />
        </Col>
      </Row>
      <Row>
        <Col>
          <h1>Nexshop Inputs</h1>

          <NexshopPlayerStatus />

          <h1>Selected Matrix</h1>
          <SelectedMatrix />
        </Col>
      </Row>
      <Row>
        <Col>
          <h1>Pixera Media Server</h1>
          <PixeraStatus />
        </Col>
      </Row>
      <Row>
        <Col>
          <h1>LED Wall</h1>
          <h3>Novastar</h3>
          <NovastarStatus />
        </Col>
      </Row>
    </Container>
  );
};

export default Main;
