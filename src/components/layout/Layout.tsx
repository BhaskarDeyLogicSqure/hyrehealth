import React from "react";
import { Footer } from "./footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
