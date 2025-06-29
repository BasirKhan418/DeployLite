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
    storeRef.current = makeStore();

    const initializeStore = async () => {
      try {
        const data = await getUserData();
        console.log("User data fetched:", data?.success ? "Success" : "Failed");
        
        if (data?.success && storeRef.current) {
          if (data.wallet && typeof data.wallet === 'object') {
            storeRef.current.dispatch(added(data.wallet));
          }
          if (data.user && typeof data.user === 'object') {
            storeRef.current.dispatch(add(data.user));
          }
        }
      } catch (error) {
        console.error("Failed to initialize store:", error);
      }
    };
    
    if (typeof window !== 'undefined') {
      initializeStore();
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}