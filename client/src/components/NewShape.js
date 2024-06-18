import React from "react";

const NewShape = ({ left, width, index }) => {
  return (
    <div
      style={{
        position: "absolute",
        //top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `100%`,
      }}
    />
  );
};

export default NewShape;
