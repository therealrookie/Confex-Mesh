import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransportMode } from "../services/api";
import { getMatrices } from "../services/database";

const PlayingMatrixContext = createContext();

export const usePlayingMatrix = () => useContext(PlayingMatrixContext);

export const PlayingMatrixProvider = ({ children }) => {
  const [playingMatrix, setPlayingMatrix] = useState(null);

  // Fetch all matrices
  const { data: matrices, isLoading: isLoadingMatrices } = useQuery({
    queryKey: ["matrices"],
    queryFn: getMatrices,
    onError: (error) => {
      console.error("Error fetching matrices:", error);
    },
  });

  // Function to update the playing matrix based on transport mode
  const updatePlayingMatrix = async () => {
    if (matrices) {
      for (const matrix of matrices) {
        try {
          const transportMode = await getTransportMode(matrix.timeline_handle);
          if (transportMode === 1) {
            setPlayingMatrix(matrix);
            return;
          }
        } catch (error) {
          console.error("Error fetching transport mode:", error);
        }
      }
      setPlayingMatrix(null); // If no matrix is in playing mode, set to null
    }
  };

  // Use useEffect to update playing matrix when matrices data changes
  useEffect(() => {
    updatePlayingMatrix();
  }, [matrices]);

  return (
    <PlayingMatrixContext.Provider value={{ playingMatrix, setPlayingMatrix, updatePlayingMatrix }}>
      {children}
    </PlayingMatrixContext.Provider>
  );
};
