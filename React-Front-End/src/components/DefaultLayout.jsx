import { Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContexProvider";
import axiosClient from "../axios";
import { Toast } from "./Toast";
import { NavComponent } from "./NavComponent";

export function DefaultLayout() {
  return (
    <>
      <div className="min-h-full">
        <NavComponent />
        <Outlet />
        <Toast />
      </div>
    </>
  );
}
