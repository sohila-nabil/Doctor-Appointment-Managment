import React from "react";
import Landing from "../components/Landing";
import Speciality from "../components/Speciality";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <div>
      <Landing />
      <Speciality/>
      <TopDoctors/>
      <Banner/>
    </div>
  );
};

export default Home;
