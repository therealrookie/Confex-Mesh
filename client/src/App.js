import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

// Components
import Configuration from "./pages/Configuration";
import Navbar from "./components/Navbar";
import Main from "./pages/Main";
import Control from "./pages/Control";
import Admin from "./pages/Admin";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Footer from "./components/Footer";

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
      <Footer />
    </Fragment>
  );
}

export default App;
