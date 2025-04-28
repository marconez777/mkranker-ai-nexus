
import { Outlet } from "react-router-dom";
import HomePage from "./HomePage";

const Index = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <HomePage />
      <Outlet />
    </div>
  );
};

export default Index;
