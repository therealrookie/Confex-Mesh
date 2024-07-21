import React, { createContext, useContext, useState } from "react";

const EditZoneContext = createContext();

export const useEditZone = () => useContext(EditZoneContext);

export const EditZoneProvider = ({ children }) => {
  const [editZone, setEditZone] = useState({
    zoneId: null,
    matrixId: null,
    playerId: null,
    layerHandle: null,
    section: null,
    ratio: null,
  });

  return <EditZoneContext.Provider value={{ editZone, setEditZone }}>{children}</EditZoneContext.Provider>;
};
