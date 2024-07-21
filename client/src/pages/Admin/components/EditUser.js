import React, { Fragment, useState } from "react";

const EditUser = ({ user }) => {
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [language, setLanguage] = useState(user.language);

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const body = { firstName, lastName, email, language };
      const response = await fetch(`http://localhost:5000/users/${user.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  const setDefault = () => {
    setFirstName();
    setLastName();
    setEmail();
    setLanguage();
  };

  return (
    <Fragment>
      <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target={`#id${user.user_id}`}>
        Edit
      </button>
      <div className="modal" id={`id${user.user_id}`} onClick={() => setDefault}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit user</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setDefault}></button>
            </div>

            <div className="modal-body">
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
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-warning" data-bs-dismiss="modal" onClick={(e) => updateUser(e)}>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditUser;
