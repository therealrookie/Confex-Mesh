import React from "react";

const RatioTabs = ({ activeTab, setActiveTab }) => {
  const ratios = ["144:9", "64:9", "32:9", "16:9"];

  return (
    <ul className="nav nav-tabs nav-justified mb-2 w-100">
      {ratios.map((ratio) => (
        <li className="nav-item" key={ratio}>
          <a className={`nav-link ${activeTab === ratio ? "active" : ""}`} onClick={() => setActiveTab(ratio)}>
            {ratio}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default RatioTabs;
