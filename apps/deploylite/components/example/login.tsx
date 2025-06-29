"use client";

import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import LoginLoader from "@/utils/Loaders/LoginLoader";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", score: "" });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [keyStrokes, setKeyStrokes] = useState<any[]>([]);
  const [mouseMovements, setMouseMovements] = useState<any[]>([]);
  const [formPatterns, setFormPatterns] = useState<any[]>([]);
  const [confidenceScore, setConfidenceScore] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setFormPatterns(prev => [...prev, {
      field: e.target.id,
      value: e.target.value,
      timestamp: Date.now()
    }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setKeyStrokes(prev => [...prev, {
      key: e.key,
      timestamp: Date.now(),
      type: e.type,
      field: (e.target as HTMLInputElement).id
    }]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const newMovement = {
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    };
    setMouseMovements(prev => [...prev.slice(-49), newMovement]);
  };

  useEffect(() => {
    const calculateMetrics = () => {
      const calcTypingSpeed = () => {
        if (keyStrokes.length < 2) return 0;
        const time = keyStrokes.at(-1)!.timestamp - keyStrokes[0].timestamp;
        return Math.round((keyStrokes.length / time) * 60000);
      };

      const calcRhythm = () => {
        if (keyStrokes.length < 3) return 0;
        const intervals = keyStrokes.slice(1).map((k, i) => k.timestamp - keyStrokes[i].timestamp);
        const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((a, b) => a + (b - avg) ** 2, 0) / intervals.length;
        return Math.min(100, 100 - Math.sqrt(variance) / 10);
      };

      const calcMouse = () => {
        if (mouseMovements.length < 2) return 0;
        let smooth = 0;
        for (let i = 1; i < mouseMovements.length; i++) {
          const dx = mouseMovements[i].x - mouseMovements[i - 1].x;
          const dy = mouseMovements[i].y - mouseMovements[i - 1].y;
          if (Math.sqrt(dx * dx + dy * dy) < 100) smooth++;
        }
        return (smooth / (mouseMovements.length - 1)) * 100;
      };

      const calcForm = () => {
        if (formPatterns.length < 2) return 0;
        let natural = 0;
        for (let i = 1; i < formPatterns.length; i++) {
          const gap = formPatterns[i].timestamp - formPatterns[i - 1].timestamp;
          if (gap > 100 && gap < 5000) natural++;
        }
        return (natural / (formPatterns.length - 1)) * 100;
      };

      const score = (
        (calcTypingSpeed() > 0 ? 1 : 0) * 0.25 +
        (calcRhythm() * 0.25) / 100 +
        (calcMouse() * 0.25) / 100 +
        (calcForm() * 0.25) / 100
      ) * 100;

      setConfidenceScore(Math.round(score));
    };

    calculateMetrics();
  }, [keyStrokes, mouseMovements, formPatterns]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, score: confidenceScore })
    });

    const result = await res.json();
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setTimeout(() => {
        router.push(result.otp ? `/otp?token=${result.token}` : "/");
      }, 2000);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-800 flex items-center justify-center overflow-auto"
      onMouseMove={handleMouseMove}
    >
      <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-xl shadow-xl bg-white dark:bg-zinc-900">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Welcome to DeployLite
        </h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-2">
          Login to get started deploying your application.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <LabelInputContainer>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="you@deploylite.tech"
              type="email"
              value={form.email}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              onKeyUp={handleKeyPress}
              required
            />
          </LabelInputContainer>

          <div className="text-right">
            <Link
              href="/forgot"
              className="text-xs text-blue-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <LabelInputContainer>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              onKeyUp={handleKeyPress}
              required
            />
          </LabelInputContainer>

          <button
            type="submit"
            className="w-full h-10 bg-gradient-to-r from-black to-neutral-700 dark:from-zinc-800 dark:to-zinc-900 text-white rounded-md shadow-md font-medium relative"
          >
            {loading ? <LoginLoader /> : "Login →"}
            <BottomGradient />
          </button>

          <div className="text-center text-sm text-neutral-700 dark:text-neutral-300">
            Don’t have an account?
            <Link href="/signup" className="ml-1 underline text-green-500">
              Sign up
            </Link>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-6" />

          <button
            type="button"
            onClick={() => {
              const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&scope=${process.env.NEXT_PUBLIC_GOOGLE_SCOPE}&response_type=code&access_type=offline`;
              window.open(url, "_self");
            }}
            className="flex items-center justify-center space-x-2 w-full h-10 bg-gray-100 dark:bg-zinc-800 rounded-md shadow-sm text-sm font-medium text-neutral-800 dark:text-neutral-300"
          >
            <IconBrandGoogle className="w-4 h-4" />
            <span>Continue with Google</span>
            <BottomGradient />
          </button>
        </form>
      </div>
    </main>
  );
}

const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex flex-col space-y-1", className)}>{children}</div>;
};
