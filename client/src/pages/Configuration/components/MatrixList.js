import React, { useState, useEffect } from "react";
import Matrix from "./Matrix";
import styled from "styled-components";
import { TrashIcon, EditIcon, Reload } from "../../../assets/icons";
import Modal from "./Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTimelines,
  setTransportMode,
  setTimelineName,
  deleteTimeline,
  stopAllTimelines,
  getLayerData,
} from "../../../services/api";
import EditInputs from "./EditInputs";
import { useEditMatrix } from "../context/EditMatrixContext";
import { EditZoneProvider, useEditZone } from "../context/EditZoneContext";
import { usePlayingMatrix } from "../../../context/PlayingMatrixContext";
import {
  deleteMatrix,
  getMatrices,
  updateHandle,
  updateZone,
  getZonesFromMatrixId,
  getPlayerById,
} from "../../../services/database";
import MatrixName from "./MatrixName";
import EditTransportMode from "./EditTransportMode";
import { checkTimelines, createNewTimeline, createNewLayer } from "../services/createTimeline";

const BottomBorder = styled.div`
  width: 100%;
  border-bottom: 1px solid black;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const StyledTable = styled.table`
  width: 100%;
  .matrix-name-column {
    width: 50%; /* Adjust this percentage as needed */
  }
  .icon-column {
    width: 10%; /* Adjust this percentage as needed */
  }
`;

const MatrixList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMatrix, setSelectedMatrix] = useState(null);
  const [modalType, setModalType] = useState("");
  const [matrixIdToUpdate, setMatrixIdToUpdate] = useState(null);

  const { editMatrix, setEditMatrix } = useEditMatrix();
  const { editZone, setEditZone } = useEditZone();
  const { playingMatrix, setPlayingMatrix, updatePlayingMatrix } = usePlayingMatrix();
  const queryClient = useQueryClient();

  const timelinesQuery = useQuery({
    queryKey: ["timelines"],
    queryFn: () => getTimelines(),
  });

  const matrixQuery = useQuery({
    queryKey: ["matrices"],
    queryFn: async () => {
      return getMatrices();
    },
    onError: (error) => {
      console.error("Error fetching matrices:", error);
    },
  });

  const zonesQuery = useQuery({
    queryKey: ["zones", matrixIdToUpdate],
    queryFn: () => getZonesFromMatrixId(matrixIdToUpdate),
    enabled: !!matrixIdToUpdate,
  });

  const handleModal = (matrix, type) => {
    setSelectedMatrix(matrix);
    setModalType(type);
    setModalOpen(true);
  };

  const playSelectedMatrix = async () => {
    if (playingMatrix) {
      await setTransportMode(playingMatrix.timeline_handle, 3);
    }
    await setTransportMode(selectedMatrix.timeline_handle, 1);
    setPlayingMatrix(selectedMatrix);
    updatePlayingMatrix();
  };

  const onSaveAction = () => {
    switch (modalType) {
      case "setActive":
        playSelectedMatrix();
        updatePlayingMatrix();
        break;
      case "delete":
        deleteMatrix(selectedMatrix.matrix_id);
        deleteTimeline(selectedMatrix.timeline_handle);
        break;
      case "setInactive":
        setTransportMode(selectedMatrix.timeline_handle, 3);
        updatePlayingMatrix();

        break;
    }

    setModalOpen(false);
    window.location.reload();
  };

  const reloadTimelines = async () => {
    const missingTimelines = checkTimelines(await timelinesQuery.data, await matrixQuery.data);
    console.log("MISSING TIMELINES", missingTimelines);
    missingTimelines.forEach(async (matrixId) => {
      const timelineHandle = await updateTimeline(matrixId);
      updateLayers(timelineHandle, matrixId);
    });
  };

  const updateTimeline = async (matrixId) => {
    const matrix = matrixQuery.data.find((matrix) => matrix.matrix_id === matrixId);
    const timelineHandle = await createNewTimeline(matrix.name);
    const updateMatrixData = await updateHandle(timelineHandle, matrixId);
    console.log("HANDLE", timelineHandle);
    return parseInt(timelineHandle);
  };

  const updateLayers = async (timelineHandle, matrixId) => {
    const zones = await getZonesFromMatrixId(matrixId);
    zones.map(async (zone) => {
      const player = await getPlayerById(zone.player_id);
      console.log("LEFT: ", zone.pos_left);
      const layerHandle = await createNewLayer(timelineHandle, zone.pos_left, player, zone.section);
      console.log("LAYER: ", layerHandle);
    });
  };

  return (
    <div>
      <Modal
        isOpen={modalOpen}
        matrix={[selectedMatrix?.name]}
        onClose={() => setModalOpen(false)}
        onSave={onSaveAction}
        type={modalType}
      />

      {editMatrix ? (
        <h1>Edit Matrix</h1>
      ) : (
        <div className="d-flex w-100 justify-content-between align-items-center">
          <h1>Matrix List</h1>
          <Reload
            onClick={() => {
              reloadTimelines();
            }}
            style={{ cursor: "pointer", width: "25px", height: "25px", marginRight: "20px" }}
          ></Reload>
        </div>
      )}
      {editMatrix ? <p>Edit the inputs of the following Matrix</p> : <p>List of currently available matrices</p>}

      {matrixQuery.isLoading && <div className="spinner-border" role="status"></div>}
      {matrixQuery.isError && <span className="badge text-light text-bg-danger">Error</span>}

      <StyledTable className="table mt-5 text-center table-borderless">
        <thead>
          <tr>
            <th className="icon-column">#</th>
            <th className="matrix-name-column">Name</th>
            <th className="icon-column">Play</th>
            <th className="icon-column">Edit</th>
            <th className="icon-column">Delete</th>
          </tr>
        </thead>
        <tbody>
          {matrixQuery.data != undefined &&
            matrixQuery.data.map(
              (matrix, index) =>
                (editMatrix === matrix.matrix_id || !editMatrix) && (
                  <React.Fragment key={matrix.matrix_id}>
                    <tr key={matrix.matrix_id}>
                      <td className="icon-column">{index + 1}</td>
                      <td className="matrix-name-column">
                        <MatrixName
                          matrixId={matrix.matrix_id}
                          timelineHandle={matrix.timeline_handle}
                          name={matrix.name}
                        />
                      </td>
                      <td className="icon-column">
                        <EditTransportMode
                          timeline={matrix}
                          changeTransportMode={(timeline, type) => handleModal(timeline, type)}
                        />
                      </td>
                      <td className="icon-column">
                        <EditIcon
                          onClick={() => {
                            setEditMatrix(editMatrix === matrix.matrix_id ? null : matrix.matrix_id);
                            setEditZone({
                              zoneId: null,
                              matrixId: null,
                              playerId: null,
                              layerHandle: null,
                              section: null,
                              ratio: null,
                            });
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                      <td className="icon-column">
                        <TrashIcon
                          onClick={() => {
                            handleModal(matrix, "delete");
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                    <tr key={`${matrix.matrix_id}-details`}>
                      <td colSpan="9">
                        <Matrix matrixId={matrix.matrix_id} />
                        {editMatrix === matrix.matrix_id && <EditInputs matrixId={matrix.matrix_id}></EditInputs>}
                        <BottomBorder />
                      </td>
                    </tr>
                  </React.Fragment>
                )
            )}
        </tbody>
      </StyledTable>
    </div>
  );
};

export default MatrixList;

/*
                        <td>
                    <input
                      className="form-check-input input-checked-warning border-dark"
                      type="radio"
                      name="defaultMatrix"
                      checked={false}
                      onChange={() => {}}
                      style={{ cursor: "pointer" }}
                    />
                  </td>


*/

/*
              <tr key={`${timeline.handle}-details`}>
                <td colSpan="5">
                  <EditLayerProvider>
                    <Matrix handle={timeline.handle} />
                    {editMatrix === timeline.handle && <EditInputs timelineHandle={timeline.handle}></EditInputs>}
                  </EditLayerProvider>
                  <BottomBorder />
                </td>
              </tr>




          {matrixQuery.data.map((matrix, index) => (
            <React.Fragment key={matrix.matrix_id}>
              <tr key={matrix.matrix_id}>
                <td>{index}</td>
                <td>
                  <MatrixName matrixId={matrix.matrix_id} timelineHandle={matrix.timeline_handle} name={matrix.name} />
                </td>
                <td>
                  <EditTransportMode timelineHandle={matrix.timeline_handle} />
                </td>
                <td>
                  <input
                    className="form-check-input input-checked-warning border-dark"
                    type="radio"
                    name="defaultMatrix"
                    checked={false}
                    onChange={() => {}}
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td>
                  <IconContainer>
                    <div>
                      <EditIcon
                        onClick={() => {
                          //setEditMatrix(editMatrix === timeline.handle ? null : timeline.handle);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <div>
                      <TrashIcon
                        onClick={() => {
                          //handleModal(timeline, "delete");
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </IconContainer>
                </td>
              </tr>
              <tr key={`${matrix.matrix_id}-details`}></tr>
            </React.Fragment>
          ))}
*/

/*
  if (timelinesQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (timelinesQuery.isError) {
    return <pre>{JSON.stringify(timelinesQuery.error)}</pre>;
  }

  if (!timelinesQuery.data) {
    return <p>No timelines available</p>;
  }

*/

/*   
{timelinesQuery.data.map((timeline, index) => (
            <React.Fragment key={timeline.handle}>
              <tr key={index}>
                <td>{index}</td>
                <td>
                  <TimelineName
                    handle={timeline.handle}
                    name={timeline.name}
                    onSave={(handle, editName) => timelineNameMutation.mutate({ handle, editName })}
                  />
                </td>
                <td>
                  {timeline.transportMode === 1 ? (
                    <StopIcon
                      onClick={() => {
                        handleModal(timeline, "setInactive");
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <PlayIcon
                      onClick={() => {
                        handleModal(timeline, "setActive");
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </td>
                <td>
                  <input
                    className="form-check-input input-checked-warning border-dark"
                    type="radio"
                    name="defaultMatrix"
                    checked={timeline.handle === defaultMatrix}
                    onChange={() => {
                      handleModal(timeline, "setDefault");
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td>
                  <IconContainer>
                    <div>
                      <EditIcon
                        onClick={() => {
                          setEditMatrix(editMatrix === timeline.handle ? null : timeline.handle);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <div>
                      <TrashIcon
                        onClick={() => {
                          handleModal(timeline, "delete");
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </IconContainer>
                </td>
              </tr>
              <tr key={`${timeline.handle}-details`}>
                <td colSpan="5">
                  <EditLayerProvider>
                    <Matrix handle={timeline.handle} />
                    {editMatrix === timeline.handle && <EditInputs timelineHandle={timeline.handle}></EditInputs>}
                  </EditLayerProvider>
                  <BottomBorder />
                </td>
              </tr>
            </React.Fragment>
          ))}
*/
