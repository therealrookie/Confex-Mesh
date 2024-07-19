import React, { useState, useEffect } from "react";
import Matrix from "./Matrix";
import styled from "styled-components";
import { PlayIcon, StopIcon, TrashIcon, EditIcon } from "../assets/icons";
import Modal from "./Modal";
import TimelineName from "./TimelineName";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTimelines, setTransportMode, setTimelineName } from "../services/api";
import EditInputs from "./EditInputs";
import { useEditMatrix } from "../context/EditMatrixContext";
import { EditLayerProvider } from "../context/EditLayerContext";
import { getMatrices } from "../services/database";
import axios from "axios";
import MatrixName from "./MatrixName";
import EditTransportMode from "./EditTransportMode";

const BottomBorder = styled.div`
  width: 100%;
  border-bottom: 1px solid black;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const MatrixList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMatrix, setSelectedMatrix] = useState(null);
  const [modalType, setModalType] = useState("");
  const [defaultMatrix, setDefaultMatrix] = useState(null);

  // const { editMatrix, setEditMatrix } = useEditMatrix();

  const queryClient = useQueryClient();

  /*
  const timelinesQuery = useQuery({
    queryKey: ["timelines"],
    queryFn: () => getTimelines(),
  });
  */

  const matrixQuery = useQuery({
    queryKey: ["matrices-unique"],
    queryFn: async () => {
      console.log("Query function called");
      return getMatrices();
    },
    onError: (error) => {
      console.error("Error fetching matrices:", error);
    },
    onSuccess: (data) => {
      console.log("Fetched matrices data:", data);
    },
  });

  /*
  const timelinesTransportMutation = useMutation({
    mutationFn: ({ handle, mode }) => setTransportMode(handle, mode),
    onSuccess: () => {
      queryClient.invalidateQueries(["timelines"]);
    },
  });

  
  const timelineNameMutation = useMutation({
    mutationFn: ({ handle, editName }) => {
      return setTimelineName(handle, editName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["timelines"]);
    },
  });
*/

  const handleModal = (matrix, type) => {
    setSelectedMatrix(matrix);
    setModalType(type);
    setModalOpen(true);
  };
  /*
  const onSaveAction = () => {
    switch (modalType) {
      case "setActive":
        setTransportMode(selectedMatrix?.handle, 1);
        window.location.reload();
        break;
      case "setDefault":
        setDefaultMatrix(selectedMatrix?.handle);
        break;
      case "delete":
        break;
      case "setInactive":
        setTransportMode(selectedMatrix?.handle, 3);
        window.location.reload();
        break;
    }
    setModalOpen(false);
  };
*/

  return (
    <div>
      <h1>Matrix Selection</h1>
      {matrixQuery.isLoading && <div className="spinner-border" role="status"></div>}
      {matrixQuery.isError && <span className="badge text-light text-bg-danger">Error</span>}

      <table className="table mt-5 text-center table-borderless">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Play</th>
            <th>Default</th>
          </tr>
        </thead>

        <tbody>
          {matrixQuery.data != undefined &&
            matrixQuery.data.map((matrix, index) => (
              <React.Fragment key={matrix.matrix_id}>
                <tr key={matrix.matrix_id}>
                  <td>{index}</td>
                  <td>
                    <MatrixName
                      matrixId={matrix.matrix_id}
                      timelineHandle={matrix.timeline_handle}
                      name={matrix.name}
                    />
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
                <tr key={`${matrix.matrix_id}-details`}>
                  <td colSpan="5">
                    <EditLayerProvider>
                      <Matrix matrixId={matrix.matrix_id} />
                    </EditLayerProvider>
                    <BottomBorder />
                  </td>
                </tr>
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatrixList;

/*
      <Modal
        isOpen={modalOpen}
        matrix={[selectedMatrix?.name]}
        onClose={() => setModalOpen(false)}
        onSave={onSaveAction}
        type={modalType}
      />

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
