"use client";

import React from "react";
import SignIn from "../../components/SignIn";
import SignUp from "../../components/SignUp";
import { useState } from "react";

const Home = () => {
  const [sign, setSign] = useState(false);

  return (
    <div>
      {sign ? (
        <SignIn sign={sign} setSign={setSign} />
      ) : (
        <SignUp sign={sign} setSign={setSign} />
      )}
    </div>
  );
};

export default Home;
