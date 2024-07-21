import React, { useState, Fragment } from "react";
import CreateConfiguration from "./components/CreateConfiguration";
import MatrixList from "./components/MatrixList";
import styled from "styled-components";
import PlayerConfiguration from "./components/PlayerConfiguration";
import { EditMatrixProvider } from "./context/EditMatrixContext";
import { EditZoneProvider } from "./context/EditZoneContext";

const Row = styled.div`
  width: 100%;
  height: 100vh;
`;

const Configuration = () => {
  const [activeTab, setActiveTab] = useState("matrixList");

  return (
    <Fragment>
      <Row className="row">
        <div className="col bg-light"></div>
        <div className="col-8">
          <EditMatrixProvider>
            <ul className="nav nav-tabs nav-justified w-100">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "matrixList" ? "active" : ""}`}
                  onClick={() => setActiveTab("matrixList")}
                >
                  Matrix List
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "createConfiguration" ? "active" : ""}`}
                  onClick={() => setActiveTab("createConfiguration")}
                >
                  Create Configuration
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "playerConfiguration" ? "active" : ""}`}
                  onClick={() => setActiveTab("playerConfiguration")}
                >
                  Player Configuration
                </button>
              </li>
            </ul>
            <div className="tab-content">
              {activeTab === "matrixList" && (
                <div className="tab-pane active">
                  <EditZoneProvider>
                    <MatrixList />
                  </EditZoneProvider>
                </div>
              )}
              {activeTab === "createConfiguration" && (
                <div className="tab-pane active">
                  <CreateConfiguration returnTab={setActiveTab} />
                </div>
              )}
              {activeTab === "playerConfiguration" && (
                <div className="tab-pane active">
                  <PlayerConfiguration />
                </div>
              )}
            </div>
          </EditMatrixProvider>
        </div>
        <div className="col bg-light"></div>
      </Row>
    </Fragment>
  );
};

export default Configuration;
