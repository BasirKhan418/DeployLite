import React from "react";
import Login from "@/components/example/login";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import CheckAuth from "@/actions/CheckAuth";
const page = () => {
  // const cook = cookies();
  // let token: any = cook.get("token");
  // if (token) {
  //   redirect("/");
  // } 
  let result = CheckAuth();
  if (result) {
    redirect("/");
  }
  return (
    <div className="flex justify-center items-center h-[100vh] bg-gradient-to-br from-gray-900 to-indigo-800">
      <div className="absolute">
      <Login />
      </div>
    </div>
  );
};

export default page;
