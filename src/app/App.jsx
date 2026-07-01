import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import InstallButton from "../public/components/InstallButton";

export default function App() {
  return (
    <>

      {/* <div className="fixed top-0 left-0 w-full h-[100vh]  z-99 animate-pulse" >
      <p className="text-red-500 text-2xl justify-center h-full">Website Under Maintenace </p>
    </div> */}

      <RouterProvider router={router} />
      <InstallButton />
    </>
  );
}