import React, { useState } from "react";
import { EditIcon, SdiIcon, HdmiIcon } from "../assets/icons";
import styled from "styled-components";

const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px;
  padding-bottom: 10px;
`;

const SlowSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  background-color: currentColor;
  border-radius: 50%;
  opacity: 0.75;
  animation: spinner-grow 2s ease-in-out infinite;
  visibility: ${(props) => (props.$running ? "visible" : "hidden")};
`;

const Dropdown = styled.select`
  width: 80%;

  border: none;
  background-color: transparent;
  color: #fff;
  &:focus {
    outline: none;
  }
  cursor: pointer;
`;

const Badge = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const InputOption = styled.option`
  width: 100%;
  padding: 50px;
  cursor: pointer;
  color: #000;
  border: none;
`;

const InputData = ({ inputs, input, onUpdateInput }) => {
  const initInput = inputs.find((inputVal) => inputVal.name === input) || { name: "n/a", fps: 0, resolution: "n/a" };
  const [selectedInput, setSelectedInput] = useState(initInput);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelect = (e) => {
    const selected = inputs.find((input) => input.name === e.target.value);
    setSelectedInput(selected);
    setDropdownOpen(false); // Close dropdown after selection
    if (selected) {
      onUpdateInput(selected);
    } else {
      console.error("Selected input is undefined:", e.target.value);
    }
  };

  const { name, fps, resolution } = selectedInput;
  const connected = resolution !== "0x0";
  const running = fps > 0;

  return (
    <Container>
      <div className="row">
        <div className="d-flex flex-column">
          <Badge
            className={`badge text-bg-${connected ? "success" : "danger"} text-light `}
            onClick={toggleDropdown}
            aria-expanded={dropdownOpen}
          >
            {name.includes("HDMI") && <HdmiIcon style={{ width: "30px", height: "25px", margin: "0" }} />}
            {name.includes("SDI") && <SdiIcon style={{ width: "30px", height: "25px", margin: "0", fill: "#fff" }} />}
            <Dropdown onChange={handleSelect} value={selectedInput.name}>
              {inputs.map((input, index) => (
                <InputOption key={index} value={input.name}>
                  {input.name}
                </InputOption>
              ))}
            </Dropdown>

            <SlowSpinner role="status" $running={running} />
          </Badge>
        </div>
        <div className="col">
          <div>FPS:</div>
          <div>{fps}</div>
        </div>
        <div className="col">
          <div>Resolution:</div>
          <div>{resolution}</div>
        </div>
      </div>
    </Container>
  );
};

export default InputData;

/* 




            <ul className="dropdown-menu">
              {inputs.map((input, index) => (
                <li>
                  <InputOption key={index} value={input.name} onClick={handleSelect}>
                    {input.name}
                  </InputOption>
                </li>
              ))}
            </ul>




const InputData = ({ inputs, onUpdateInput, playerId }) => {
  const [selectedInput, setSelectedInput] = useState(inputs[0] || "someDefaultInput");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelect = (e) => {
    const selected = inputs.find((input) => input.name === e.target.value);
    setSelectedInput(selected);
    setDropdownOpen(false); // Close dropdown after selection
    if (selected) {
      onUpdateInput(playerId, selected);
    } else {
      console.error("Selected input is undefined:", e.target.value);
    }
  };

  const { name, fps, resolution, running } = selectedInput;
  const connected = resolution !== "0x0";

  return (
    <Container>
      <div className="row">
        <div className="d-flex flex-column">
          <div className="dropdown">
            <Badge
              className={`badge text-bg-${connected ? "success" : "danger"} text-light `}
              onClick={toggleDropdown}
              data-bs-toggle="dropdown"
              aria-expanded={dropdownOpen}
            >
              {name.includes("HDMI") && <HdmiIcon style={{ width: "30px", height: "25px", margin: "0" }} />}
              {name.includes("SDI") && <SdiIcon style={{ width: "30px", height: "25px", margin: "0", fill: "#fff" }} />}
              <p className="m-0 user-select-none">{name}</p>
              <SlowSpinner role="status" running={running} />
            </Badge>

            {dropdownOpen && (
              <Dropdown onChange={handleSelect} value={name}>
                {inputs.map((input, index) => (
                  <option key={index} value={input.name}>
                    {input.name}
                  </option>
                ))}
              </Dropdown>
            )}
          </div>
        </div>
        <div className="col">
          <div>FPS:</div>
          <div>{fps}</div>
        </div>
        <div className="col">
          <div>Resolution:</div>
          <div>{resolution}</div>
        </div>
      </div>
    </Container>
  );
};

export default InputData;


*/
