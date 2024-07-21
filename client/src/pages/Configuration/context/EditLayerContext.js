import React, { createContext, useContext, useState } from "react";

const EditLayerContext = createContext();

export const useEditLayer = () => useContext(EditLayerContext);

export const EditLayerProvider = ({ children }) => {
  const [editLayer, setEditLayer] = useState({ handle: null, props: null });

  return <EditLayerContext.Provider value={{ editLayer, setEditLayer }}>{children}</EditLayerContext.Provider>;
};
