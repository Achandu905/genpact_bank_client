import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {

  return (
    <div className="sidebar">
     
      <Link to="/profile">Manage Profile</Link>
      <button >Logout</button>
    </div>
  );
};

export default Sidebar;