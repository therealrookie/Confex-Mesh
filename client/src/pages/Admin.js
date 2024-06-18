import React, { Fragment } from "react";
import CreateUser from "../components/CreateUser";
import ListUsers from "../components/ListUsers";

const Admin = () => {
  return (
    <Fragment>
      <div className="container">
        <CreateUser></CreateUser>
        <ListUsers></ListUsers>
      </div>
    </Fragment>
  );
};

export default Admin;
