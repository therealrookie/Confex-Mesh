import React from "react";
import axios from "axios";

const PixeraData = [
  { name: "Pixera four (main)", fps: 60, ip: "10.10.10.109", currentTimeline: "Timeline 1", connected: true },
  { name: "Pixera four (backup)", fps: "-", ip: "10.10.10.110", currentTimeline: "-", connected: false },
];

const PixeraStatus = () => {
  const sendPutRequest = async () => {
    console.log("hello");
    try {
      const body = {};
      const response = await fetch(`http://localhost:5000/pixera/timelines`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <div className="d-flex justify-content-between">
      {PixeraData.map((pixera) => (
        <div className="p-2 m-2 border rounded" style={{ minWidth: "300px", maxWidth: "45%" }}>
          <div className="d-flex justify-content-between">
            <h5>{pixera.name}</h5>
            <span
              className={`badge text-light text-bg-${
                pixera.connected ? "success" : "danger"
              } d-flex align-items-center`}
            >
              {pixera.connected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <p>{pixera.fps}</p>
          <p>{pixera.ip}</p>
          <p>{pixera.currentTimeline}</p>

          <img src="/pixera_four.jpg" className="img-fluid p-0 m-0 rounded-3" alt="Pixera four" />
        </div>
      ))}
    </div>
  );
};

export default PixeraStatus;
