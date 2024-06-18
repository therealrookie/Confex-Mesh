import React from "react";
import { Link, Element } from "react-scroll";
import styled from "styled-components";

const NavColContainer = styled.div`
  top: 75px;
  left: -180px;
`;

const NavColumn = () => {
  return (
    <NavColContainer className="container justify-content-center fixed-top">
      <nav class="nav flex-column">
        <Link className="nav-link text-dark">Matrix Selection</Link>

        <Link className="nav-link text-dark">Matrix Configuration</Link>

        <Link className="nav-link text-dark">Player Configuration</Link>
      </nav>
    </NavColContainer>
  );
};

export default NavColumn;

/**
           aria-current="page"
          to="matrix-selection"
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}

          to="matrix-configuration"
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}

          to="player-configuration"
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}

 */
