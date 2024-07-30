import React, { useEffect, useState } from "react";
import { getNovastarIp } from "../../../services/database";
import { checkNovastarConnection } from "../../../services/novastarApi";
import { useQuery } from "@tanstack/react-query";

const NovastarStatus = () => {
  const [controllers, setControllers] = useState([
    {
      device: "main",
      name: "Novastar MX40-Pro (main)",
      ip: null,
      connected: false,
      loading: true,
      error: false,
    },
    {
      device: "hot",
      name: "Novastar MX40-Pro (backup hot)",
      ip: null,
      connected: false,
      loading: true,
      error: false,
    },
    {
      device: "cold",
      name: "Novastar MX40-Pro (backup cold)",
      ip: null,
      connected: false,
      loading: true,
      error: false,
    },
  ]);

  useEffect(() => {
    const updateIps = async () => {
      const updatedControllers = await Promise.all(
        controllers.map(async (controller) => {
          try {
            const { data } = await getNovastarIp(controller.device);
            return { ...controller, ip: data };
          } catch (error) {
            return { ...controller, error: true };
          }
        })
      );
      setControllers(updatedControllers);
    };

    updateIps();
  }, []);

  useEffect(() => {
    const updateConnectionStatus = async () => {
      const updatedControllers = await Promise.all(
        controllers.map(async (controller) => {
          if (controller.ip) {
            try {
              const isConnected = await checkNovastarConnection(controller.ip);
              return { ...controller, connected: isConnected, loading: false };
            } catch (error) {
              return { ...controller, connected: false, loading: false, error: true };
            }
          }
          return controller;
        })
      );
      setControllers(updatedControllers);
    };

    if (controllers.every((controller) => controller.ip !== null)) {
      updateConnectionStatus();
    }
  }, [controllers]);

  return (
    <div className="d-flex justify-content-between flex-wrap">
      {controllers.map((controller, index) => (
        <div key={index} className="p-2 m-2 border rounded" style={{ minWidth: "200px", maxWidth: "30%" }}>
          <h5>{controller.name}</h5>
          <p>{controller.ip}</p>
          {controller.loading ? (
            <div className="spinner-border" role="status"></div>
          ) : (
            <span className={`badge text-light text-bg-${controller.connected ? "success" : "danger"}`}>
              {controller.connected ? "Connected" : "Disconnected"}
            </span>
          )}
          <img src="/MX40-Pro.png" className="img-fluid p-0 m-0 rounded-3" alt="Novastar MX40-Pro" />
        </div>
      ))}
    </div>
  );
};

export default NovastarStatus;
