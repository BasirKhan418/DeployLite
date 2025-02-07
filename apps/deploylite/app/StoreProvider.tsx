"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import type { ReactNode } from "react";
import { makeStore, AppStore } from "../lib/store";
import getUserData from "@/hooks/functions/getUserData";
import { add } from "@/lib/features/user/User";
import { add as added } from "@/lib/features/wallet/Wallet";
export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();

    //loading intial data
    let minfunc = async () => {
      let data = await getUserData();
      console.log("data is");
      if (data.success) {
        storeRef.current?.dispatch(added(data.wallet));
        storeRef.current?.dispatch(add(data.user));
      }
    };
    minfunc();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
