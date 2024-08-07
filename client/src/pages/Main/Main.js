import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Badge } from "react-bootstrap";
import PreviewWinow from "./components/PreviewWinow";
import NexshopPlayerStatus from "./components/NexshopPlayerStatus";
import SelectedMatrix from "./components/SelectedMatrix";
import PixeraStatus from "./components/PixeraStatus";
import NovastarStatus from "./components/NovastarStatus";
import LedStatus from "./components/LedStatus";

const Main = () => {
  const [brightness, setBrightness] = useState(50); // Default brightness
  const [isAutoBrightness, setIsAutoBrightness] = useState(false); // Auto-brightness off by default

  const handleBrightnessChange = (e) => {
    setBrightness(e.target.value);
  };

  const toggleAutoBrightness = () => {
    setIsAutoBrightness(!isAutoBrightness);
  };

  return (
    <Container>
      <Row className="my-4">
        <h1>Selected Matrix</h1>
        <SelectedMatrix />
      </Row>
      <Row>
        <Col>
          <h1>Pixera Media Server</h1>
          <PixeraStatus />
        </Col>
      </Row>
      <Row>
        <Col>
          <h1>Novastar</h1>
          <NovastarStatus />
        </Col>
      </Row>
    </Container>
  );
};

export default Main;

/*
        <Col>
          <h1>Preview</h1>

          <PreviewWinow />
        </Col>

              <Row>
        <Col>
          <h1>Nexshop Inputs</h1>

          <NexshopPlayerStatus />
        </Col>
      </Row>

                <LedStatus />



*/
