import React, { useEffect, useState } from "react";

const HardwareInputs = [
  { id: "Input 1", inputType: "SDI1", player: "Player 1", zones: "5 Zonen", connected: true },
  { id: "Input 2", inputType: "SDI1", player: "Player 1", zones: "5 Zonen", connected: true },
  { id: "Input 3", inputType: "SDI1", player: "Player 1", zones: "5 Zonen", connected: true },
  { id: "Input 4", inputType: "SDI1", player: "Player 1", zones: "5 Zonen", connected: true },
  { id: "Input 5", inputType: "SDI1", player: "Player 1", zones: "5 Zonen", connected: true },
  { id: "Input 6", inputType: "SDI1", player: "Player 1", zones: "5 Zonen", connected: true },
  { id: "Input 7", inputType: "SDI1", player: "Player 1", zones: "5 Zonen", connected: true },
  { id: "Input 8", inputType: "SDI1", player: "Player 1", zones: "5 Zonen", connected: true },
  { id: "Input 9", inputType: "SDI1", player: "Player 1", zones: "5 Zonen", connected: true },
  { id: "Input 10", inputType: "SDI1", player: "Player 1", zones: "5 Zonen", connected: false },
  { id: "Input 11", inputType: "SDI1", player: "Player 1", zones: "5 Zonen", connected: true },
  { id: "Input 12", inputType: "SDI1", player: "Player 1", zones: "5 Zonen", connected: true },
];

const NexshopPlayerStatus = () => {
  const [inputs, setInputs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInputs = async () => {
    try {
      const inputResponse = await fetch(`http://localhost:5000/pixera/inputs/`);
      if (!inputResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const newInputs = await inputResponse.json();
      setInputs(newInputs);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInputs();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center">
        <div className="alert alert-danger" role="alert">
          Error fetching inputs: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center flex-wrap">
      {HardwareInputs.map((input) => (
        <div key={input.id} className="p-2 m-2 border rounded" style={{ minWidth: "150px" }}>
          <h5>{input.id}</h5>
          <p>{input.inputType}</p>
          <p>{input.player}</p>
          <p>{input.zones}</p>
          <span className={`badge text-light text-bg-${input.connected ? "success" : "danger"}`}>
            {input.connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default NexshopPlayerStatus;
