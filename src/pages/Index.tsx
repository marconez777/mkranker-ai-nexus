
import { Outlet } from "react-router-dom";
import HomePage from "./HomePage";

const Index = () => {
  return (
    <>
      <HomePage />
      <Outlet />
    </>
  );
};

export default Index;
