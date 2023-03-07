import React from "react";

const Footer = () => {
  return (
    <span
      className="block text-sm sm:text-center text-gray-400 poppins"
      style={{
        position: "fixed",
        bottom: "0",
        width: "100%",
        textAlign: "center",
        padding: "1rem",
      }}
    >
      Built by{" "}
      <a
        href="https://twitter.com/EtrapayInc"
        target={"_blank"}
        rel="noopener noreferrer"
        className="text-blue-400"
      >
        etrapay
      </a>
    </span>
  );
};

export default Footer;
