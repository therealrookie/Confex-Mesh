import React, { Fragment, useState } from "react";

const CreateUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [language, setLanguage] = useState("English");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      // Include email in the body object
      const body = { firstName, lastName, email, password, language };
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log("Response: ", response);
    } catch (err) {
      console.error("Error: ", err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5">Create User</h1>
      <form onSubmit={onSubmitForm} className="container mt-5">
        <div className="mb-3">
          <label htmlFor="firstNameInput" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="firstNameInput"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastNameInput" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="lastNameInput"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          {" "}
          {/* Email input field */}
          <label htmlFor="emailInput" className="form-label">
            Email
          </label>
          <input
            type="email" // Ensuring proper email format
            className="form-control"
            id="emailInput"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="passwordInput" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="passwordInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="repeatPasswordInput" className="form-label">
            Repeat Password
          </label>
          <input
            type="password"
            className="form-control"
            id="repeatPasswordInput"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <p>Select Language</p>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="languageOptions"
              id="englishRadio"
              value="English"
              checked={language === "English"}
              onChange={(e) => setLanguage(e.target.value)}
            />
            <label className="form-check-label" htmlFor="englishRadio">
              English
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="languageOptions"
              id="germanRadio"
              value="German"
              checked={language === "German"}
              onChange={(e) => setLanguage(e.target.value)}
            />
            <label className="form-check-label" htmlFor="germanRadio">
              Deutsch
            </label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Create User
        </button>
      </form>
    </Fragment>
  );
};

export default CreateUser;
