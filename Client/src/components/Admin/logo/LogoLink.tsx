import React from "react";
import logoNav from "../../../assets/images/logoHeader/logo.svg";

const LogoLink: React.FC = () => {
  return (
    <a href="/admin" className="flex ml-2 md:mr-24">
      <img src={logoNav} className="h-8 mr-3" alt="FlowBite Logo" />
      <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
        E-Com
      </span>
    </a>
  );
};

export default LogoLink;
