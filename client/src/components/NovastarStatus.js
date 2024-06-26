import React, { useEffect, useState } from "react";
import axios from "axios";

const NovastarStatus = () => {
  const [controllers, setControllers] = useState([
    { name: "Novastar MX40-Pro (left)", ip: "10.10.10.106", inputNames: [], connected: false },
    //{ name: "Novastar MX40-Pro (right)", ip: "10.10.10.110", inputNames: [], connected: false },
    //{ name: "Novastar MX40-Pro (backup)", ip: "10.10.10.111", inputNames: [], connected: false },
  ]);

  useEffect(() => {
    controllers.forEach((controller, index) => {
      axios({
        method: "get",
        url: `/novastar/inputdata/${controller.ip}`,
        timeout: 5000, // sets timeout to 5 seconds
      })
        .then((response) => {
          console.log(response.data);
          setControllers((prevControllers) =>
            prevControllers.map((item, idx) =>
              idx === index ? { ...item, inputNames: response.data, connected: true } : item
            )
          );
        })
        .catch((error) => {
          setControllers((prevControllers) =>
            prevControllers.map((item, idx) => (idx === index ? { ...item, connected: false } : item))
          );
        });
    });
  }, []);

  const handleMonitoring = (ip) => {
    axios
      .get(`/monitoring/${ip}`)
      .then((response) => {
        console.log("Monitoring Data:", response.data);
      })
      .catch((error) => {
        console.error("Error during monitoring:", error);
      });
  };

  return (
    <div className="d-flex justify-content-between">
      {controllers.map((controller, index) => (
        <div key={index} className="p-2 m-2 border rounded" style={{ minWidth: "200px", maxWidth: "30%" }}>
          <h5>{controller.name}</h5>
          <p>{controller.ip}</p>
          <p>{controller.currentTimeline}</p>
          <span className={`badge text-light text-bg-${controller.connected ? "success" : "danger"}`}>
            {controller.connected ? "Connected" : "Disconnected"}
          </span>

          <ul>
            {controller.inputNames.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
          <img src="/MX40-Pro.png" className="img-fluid p-0 m-0 rounded-3" alt="Novastar MX40-Pro" />
        </div>
      ))}
    </div>
  );
};

export default NovastarStatus;
