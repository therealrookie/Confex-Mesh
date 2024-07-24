import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

// Components
import Configuration from "./pages/Configuration/Configuration";
import Navbar from "./components/Navbar";
import Main from "./pages/Main/Main";
import Control from "./pages/Control/Control";
import Admin from "./pages/Admin/Admin";
import Account from "./pages/Account/Account";
import Login from "./pages/Login/Login";
import Footer from "./components/Footer";
import { PlayingMatrixProvider } from "./context/PlayingMatrixContext";

function App() {
  return (
    <Fragment>
      <Navbar />
      <PlayingMatrixProvider>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/control" element={<Control />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/account" element={<Account />} />
          <Route path="/logout" element={<Login />} />
        </Routes>
      </PlayingMatrixProvider>
    </Fragment>
  );
}

export default App;

/*
      <Footer />


*/
