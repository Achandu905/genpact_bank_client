import React from "react";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Navcomponent from "./NavComponent";

const Layout = ({ children }) => {
  

  return (
    <>
      <Navcomponent />
      {/* <Sidebar /> */}
      <div className="content">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;