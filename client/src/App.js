import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

// Components
import Status from "./pages/Status";
import Configuration from "./pages/Configuration";
import Timeline from "./pages/Timeline";
import Users from "./pages/users";
import Navbar from "./components/Navbar";
import Main from "./pages/Main";
import Control from "./pages/Control";
import Admin from "./pages/Admin";
import Account from "./pages/Account";
import Login from "./pages/Login";

function App() {
  return (
    <Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/control" element={<Control />} />
        <Route path="/configuration" element={<Configuration />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/account" element={<Account />} />
        <Route path="/logout" element={<Login />} />
      </Routes>
    </Fragment>
  );
}

export default App;
