import React, { Fragment } from "react";
import CreateConfiguration from "../components/CreateConfiguration";
import MatrixList from "../components/MatrixList";
import styled from "styled-components";
import { Link, Element } from "react-scroll";
import PlayerConfiguration from "../components/PlayerConfiguration";
import { EditMatrixProvider } from "../context/EditMatrixContext";

const Row = styled.div`
  width: 100%;
  height: 100ve;
`;

const Configuration = () => {
  return (
    <Fragment>
      <Row className="row">
        <div className="col bg-light"></div>
        <div className="col-8">
          <Element name="matrix-selection"></Element>
          <EditMatrixProvider>
            <MatrixList />
          </EditMatrixProvider>
          <Element name="matrix-configuration"></Element>
          <Element name="player-configuration">
            <PlayerConfiguration />
          </Element>
        </div>
        <div className="col bg-light"></div>
      </Row>
    </Fragment>
  );
};

export default Configuration;

/**
           <NavColumn />
<CreateConfiguration />
 */
