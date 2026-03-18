import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { GuestRegistration } from "./components/GuestRegistration";
import { Records } from "./components/Records";
import { AdminPanel } from "./components/AdminPanel";
import { AdminLogin } from "./components/AdminLogin";
import { AdminRegister } from "./components/AdminRegister";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/register",
    Component: GuestRegistration,
  },
  {
    path: "/records",
    Component: Records,
  },
  {
    path: "/admin",
    Component: AdminPanel,
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin/register",
    Component: AdminRegister,
  },
]);