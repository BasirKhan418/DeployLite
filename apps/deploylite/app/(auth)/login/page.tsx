import React from "react";
import Login from "@/components/example/login";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
const page = () => {
  // const cook = cookies();
  // let token: any = cook.get("token");
  // if (token) {
  //   redirect("/");
  // } 
  return (
    <div className="flex justify-center items-center h-[100vh] bg-gradient-to-br from-blue-100 to-indigo-200">
      <Login />
    </div>
  );
};

export default page;
