import React, { useState, useEffect } from "react";
import { PlayIcon, StopIcon } from "../assets/icons";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Timeline from "./Timeline";

const Timelines = () => {
  const [timelines, setTimelines] = useState([]);

  const fetchTimelines = async () => {
    try {
      const timelineResponse = await fetch("http://localhost:5000/pixera/timeline/names");
      const data = await timelineResponse.json();
      setTimelines(data);

      //setTimelines(timelines);

      // Fetch layer details for each timeline
      //timelines.forEach((timeline) => {
      //fetchLayerDetails(timeline.handle);
      //});
    } catch (error) {
      console.error("Failed to fetch timelines:", error);
    }
  };

  const setTransportMode = async (handle, mode) => {
    try {
      const response = await fetch(`http://localhost:5000/pixera/timeline/set-transport/${handle}/${mode}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to set transport mode");
      }
      console.log("Transport mode set:", await response.json());
    } catch (error) {
      console.error("Error setting transport mode:", error.message);
    }
  };

  useEffect(() => {
    fetchTimelines();
  }, []); // Only run on mount

  return (
    <div className="container mt-4">
      <h2>Timelines</h2>
      {timelines.map((timeline) => (
        <Timeline handle={timeline.handle} name={timeline.name} />
      ))}
      <ListGroup>
        {timelines.map((timeline) => (
          <ListGroup.Item key={timeline.handle} className="d-flex justify-content-between align-items-center">
            {timeline.name}
            <div>
              <Button variant="primary" onClick={() => setTransportMode(timeline.handle, 1)}>
                <PlayIcon />
              </Button>
              <Button variant="danger" onClick={() => setTransportMode(timeline.handle, 3)}>
                <StopIcon />
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Timelines;

/*

*/
