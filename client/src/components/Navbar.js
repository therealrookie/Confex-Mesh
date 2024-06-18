import React from "react";
import CustomLink from "./CustomLink";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-dark sticky-top">
      <div className="container-fluid">
        <h3 className="navbar-brand text-primary">LED-Mesh</h3>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav justify-content-center flex-grow-1">
            <CustomLink to="/">Main</CustomLink>
            <CustomLink to="/control">Control</CustomLink>
            <CustomLink to="/configuration">Configuration</CustomLink>
            <CustomLink to="/admin">Admin</CustomLink>
            <li className="nav-item dropdown ms-auto">
              <a
                className="nav-link dropdown-toggle text-primary"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Nachname, Vorname
              </a>
              <ul className="dropdown-menu bg-dark">
                <li>
                  <CustomLink to="/account" baseClassName="dropdown-item" className="text-primary">
                    Settings
                  </CustomLink>
                </li>
                <li>
                  <CustomLink to="/logout" baseClassName="dropdown-item" className="text-danger">
                    Logout
                  </CustomLink>
                </li>
              </ul>
            </li>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
