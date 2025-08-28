// Navbar.js
import React from "react";
import "./Navbar.css"; 

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <h1 className="nav-logo">📝 Notebook</h1>
        <div className="nav-right">
          Anslation — <span>Frontend Intern Mini Project</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
