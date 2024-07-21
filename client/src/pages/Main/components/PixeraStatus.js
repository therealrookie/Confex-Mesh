import React, { useState, useEffect } from "react";
import { getInputs, getEffects } from "../../../services/api";
import { useQuery } from "@tanstack/react-query";

const PixeraData = [
  { name: "Pixera four (main)", fps: 60, ip: "10.10.10.109", currentTimeline: "Timeline 1", connected: true },
  { name: "Pixera four (backup)", fps: "-", ip: "10.10.10.110", currentTimeline: "-", connected: false },
];

const PixeraStatus = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const inputsQuery = useQuery({
    queryKey: ["inputs"],
    queryFn: async () => getInputs(),
  });

  console.log("INPUTS: ", inputsQuery.data);

  /*
  const { data: effectsData } = useQuery({
    queryKey: ["effects"],
    queryFn: async () => getEffects(),
  });
*/
  return (
    <div className="d-flex justify-content-between">
      {PixeraData.map((pixera, index) => (
        <div key={pixera.name} className="p-2 m-2 border rounded" style={{ minWidth: "300px", maxWidth: "45%" }}>
          <div className="d-flex justify-content-between">
            <h5>{pixera.name}</h5>
            {inputsQuery.isLoading ? (
              <div className="spinner-border" role="status"></div>
            ) : (
              <span
                className={`badge text-light text-bg-${
                  inputsQuery.isError ? "danger" : "success"
                } d-flex align-items-center`}
              >
                {inputsQuery.isError ? "Disconnected" : "Connected"}
              </span>
            )}
          </div>
          <p>{inputsQuery.isLoading ? "..." : inputsQuery.isError ? "-" : pixera.fps}</p>
          <p>{pixera.ip}</p>
          <p>{inputsQuery.isLoading ? "..." : inputsQuery.isError ? "-" : pixera.currentTimeline}</p>

          <img src="/pixera_four.jpg" className="img-fluid p-0 m-0 rounded-3" alt="Pixera four" />
        </div>
      ))}
    </div>
  );
};

export default PixeraStatus;

/*

    

*/
