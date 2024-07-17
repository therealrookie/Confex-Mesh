import React, { useState, useEffect } from "react";
import axios from "axios";

const PixeraData = [
  { name: "Pixera four (main)", fps: 60, ip: "10.10.10.109", currentTimeline: "Timeline 1", connected: true },
  { name: "Pixera four (backup)", fps: "-", ip: "10.10.10.110", currentTimeline: "-", connected: false },
];

const PixeraStatus = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPixera = async () => {
    try {
      const inputResponse = await fetch(`http://localhost:5000/pixera/inputs/`);
      if (!inputResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const newInputs = await inputResponse.json();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPixera();
  }, []);

  return (
    <div className="d-flex justify-content-between">
      {PixeraData.map((pixera, index) => (
        <div key={pixera.name} className="p-2 m-2 border rounded" style={{ minWidth: "300px", maxWidth: "45%" }}>
          <div className="d-flex justify-content-between">
            <h5>{pixera.name}</h5>
            {loading ? (
              <div className="spinner-border" role="status"></div>
            ) : (
              <span className={`badge text-light text-bg-${error ? "danger" : "success"} d-flex align-items-center`}>
                {error ? "Disconnected" : "Connected"}
              </span>
            )}
          </div>
          <p>{loading ? "..." : error ? "-" : pixera.fps}</p>
          <p>{pixera.ip}</p>
          <p>{loading ? "..." : error ? "-" : pixera.currentTimeline}</p>

          <img src="/pixera_four.jpg" className="img-fluid p-0 m-0 rounded-3" alt="Pixera four" />
        </div>
      ))}
    </div>
  );
};

export default PixeraStatus;
