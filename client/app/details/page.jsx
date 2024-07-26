'use client'

import React, { useState } from "react";
import PersonalInfo from "../../components/PersonalInfo";
import TravelInfo from "../../components/TravelInfo";

const page = () => {
  const [info, setInfo] = useState(true)
  return (
    <div>
      {info ? (
        <PersonalInfo info={info} setInfo={setInfo} />
      ) : (
        <TravelInfo/>
      )}
    </div>
  );
  
};

export default page;
