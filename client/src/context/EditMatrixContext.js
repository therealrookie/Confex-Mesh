import React, { createContext, useContext, useState } from "react";

const EditMatrixContext = createContext();

export const useEditMatrix = () => useContext(EditMatrixContext);

export const EditMatrixProvider = ({ children }) => {
  const [editMatrix, setEditMatrix] = useState(false);

  return <EditMatrixContext.Provider value={{ editMatrix, setEditMatrix }}>{children}</EditMatrixContext.Provider>;
};
