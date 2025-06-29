"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoginLoader from "@/utils/Loaders/LoginLoader";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ResetComponent() {
  const searchurl = useSearchParams();
  const router = useRouter();

 
  const [form, setForm] = useState({ otp: "" });
  const [loading, setLoading] = useState(false);

 
  const [timer, setTimer] = useState(30);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

 
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsButtonDisabled(false); 
    }
  }, [timer]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (form.otp === "") {
      toast.error("Please enter the OTP sent to your email.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp: form.otp, token: searchurl?.get("token") || "" }),
    });

    const result = await res.json();
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setTimeout(() => {
        window.open("/", "_self");
      }, 2000);
    } else {
      toast.error(result.message);
    }
  };

  // Reset and start the timer when Resend OTP or WhatsApp button is clicked
  const resetTimer = () => {
    setTimer(30);
    setIsButtonDisabled(true);
  };
  
  const handleResend = async () => {
    resetTimer();
    let data = { token: searchurl?.get("token") || "", status: "resend" };
    try {
      let fetchresult = await fetch("/api/auth/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let result = await fetchresult.json();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Resend endpoint error");
    }
  };

  //sendusing whatsappp
  const handleWhatsApp = async () => {
    resetTimer();
    let data = { token: searchurl?.get("token") || "" };
    try {
      let fetchresult = await fetch("/api/auth/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let result = await fetchresult.json();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Resend endpoint error");
    }
  };
  
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Enter your OTP (one-time password)
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Two-factor authentication is enabled on your account. Please enter the
          OTP sent to your email to access your account.
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              placeholder="XXXX"
              type="number"
              onChange={handleChange}
              value={form.otp}
            />
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            {loading ? <LoginLoader /> : "Login Now →"}
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>

        <div className="m-2">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            Didn't get the OTP?{" "}
            <button
              className={`underline mx-1 ${
                isButtonDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-green-500"
              }`}
              onClick={handleResend}
              disabled={isButtonDisabled}
            >
              Resend OTP
            </button>
            {isButtonDisabled ? ` (Resend available in ${timer}s)` : ""}
          </p>
        </div>

        <div className="m-2">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            Didn't get the OTP?{" "}
            <button
              className={`underline mx-1 ${
                isButtonDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-green-500"
              }`}
              onClick={handleWhatsApp}
              disabled={isButtonDisabled}
            >
              Send using WhatsApp
            </button>
            {isButtonDisabled ? ` (Resend available in ${timer}s)` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

// Gradient Effect for Button
const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

// Label Input Wrapper
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

// Suspense Wrapper for Reset Component
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetComponent />
    </Suspense>
  );
}