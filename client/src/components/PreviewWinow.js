import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";

const PreviewWinow = () => {
  const [deviceID, setDeviceID] = useState();
  const [devices, setDevices] = useState([]);

  const handleDevices = React.useCallback(
    (mediaDevices) => setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  // Optional: Automatically select the OBS camera if it matches a name pattern
  useEffect(() => {
    const obsCamera = devices.find((device) => device.label.includes("OBS"));
    if (obsCamera) {
      setDeviceID(obsCamera.deviceId);
    }
  }, [devices]);

  const PreviewContainer = styled.div`
    width: 100%; // Ensures the container takes the full width of its parent
    video {
      width: 100% !important; // Ensures the video scales to the width of its container
      height: auto !important; // Maintains aspect ratio
    }
  `;

  return (
    <PreviewContainer>
      <Webcam audio={false} videoConstraints={{ deviceId: deviceID ? { exact: deviceID } : undefined }} />
    </PreviewContainer>
  );
};

export default PreviewWinow;
