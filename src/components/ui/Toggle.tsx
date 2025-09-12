"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { setRole } from "@/lib/redux/slice";

export default function RoleToggle() {
  const role = useSelector((state: RootState) => state.role.value);
  const dispatch = useDispatch();

  return (
    <div className="bg-sky w-[8rem] flex rounded-full max-w-[19rem] shadow-xl">
      <button
        onClick={() => dispatch(setRole("Admin"))}
        className={`flex-1 w-[50%] px-3 py-1 rounded-full text-[.8rem] font-semibold transition-all ${
          role === "Admin"
            ? "bg-white text-black"
            : "bg-sky text-white"
        }`}
      >
        Admin
      </button>
      <button
        onClick={() => dispatch(setRole("Judge"))}
        className={`flex-1 w-[50%] px-3 py-1 rounded-full text-[.8rem] font-semibold transition-all ${
          role === "Judge"
            ? "bg-white text-black"
            : "bg-sky text-white"
        }`}
      >
        Judge
      </button>
    </div>
  );
}
