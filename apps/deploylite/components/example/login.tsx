"use client";
import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import LoginLoader from "@/utils/Loaders/LoginLoader";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    score: ""
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Behavioral tracking states
  const [keyStrokes, setKeyStrokes] = useState<{ key: string; timestamp: number; type: string; field: string }[]>([]);
  const [mouseMovements, setMouseMovements] = useState<{ x: number; y: number; timestamp: number }[]>([]);
  const [formPatterns, setFormPatterns] = useState<{ field: string; value: string; timestamp: number }[]>([]);
  const [confidenceScore, setConfidenceScore] = useState(0);

  // Handle changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
    const pattern = {
      field: e.target.id,
      value: e.target.value,
      timestamp: Date.now()
    };
    setFormPatterns(prev => [...prev, pattern]);
  };

  // Track typing patterns
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const newKeystroke = {
      key: e.key,
      timestamp: Date.now(),
      type: e.type,
      field: (e.target as HTMLInputElement).name || (e.target as HTMLInputElement).id
    };
    setKeyStrokes(prev => [...prev, newKeystroke]);
  };

  // Track mouse movements
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const newMovement = {
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    };
    setMouseMovements(prev => {
      const movements = [...prev, newMovement];
      return movements.slice(-50);
    });
  };

  // Calculate behavior metrics
  const calculateMetrics = () => {
    // 1. Calculate typing speed
    const calculateTypingSpeed = () => {
      if (keyStrokes.length < 2) return 0;
      const timeSpan = keyStrokes[keyStrokes.length - 1].timestamp - keyStrokes[0].timestamp;
      const characters = keyStrokes.length;
      return Math.round((characters / timeSpan) * 60000);
    };

    // 2. Calculate typing rhythm consistency
    const calculateRhythmConsistency = () => {
      if (keyStrokes.length < 3) return 0;
      const intervals = [];
      for (let i = 1; i < keyStrokes.length; i++) {
        intervals.push(keyStrokes[i].timestamp - keyStrokes[i-1].timestamp);
      }
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / intervals.length;
      return Math.min(100, Math.max(0, 100 - Math.sqrt(variance) / 10));
    };

    // 3. Calculate mouse movement patterns
    const calculateMousePattern = () => {
      if (mouseMovements.length < 2) return 0;
      let smoothness = 0;
      for (let i = 1; i < mouseMovements.length; i++) {
        const dx = mouseMovements[i].x - mouseMovements[i-1].x;
        const dy = mouseMovements[i].y - mouseMovements[i-1].y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < 100) smoothness++;
      }
      return (smoothness / (mouseMovements.length - 1)) * 100;
    };

    // 4. Calculate form filling pattern
    const calculateFormPattern = () => {
      if (formPatterns.length < 2) return 0;
      let naturalness = 0;
      for (let i = 1; i < formPatterns.length; i++) {
        const timeGap = formPatterns[i].timestamp - formPatterns[i-1].timestamp;
        if (timeGap > 100 && timeGap < 5000) naturalness++;
      }
      return (naturalness / (formPatterns.length - 1)) * 100;
    };

    // Calculate final confidence score
    const typingSpeed = calculateTypingSpeed();
    const rhythmConsistency = calculateRhythmConsistency();
    const mousePattern = calculateMousePattern();
    const formPattern = calculateFormPattern();

    const score = (
      (typingSpeed > 0 ? 1 : 0) * 0.25 +
      (rhythmConsistency * 0.25) / 100 +
      (mousePattern * 0.25) / 100 +
      (formPattern * 0.25) / 100
    ) * 100;

    // Log individual values instead of object
    console.log("Typing Speed:", typingSpeed);
    console.log("Rhythm Consistency:", rhythmConsistency);
    console.log("Mouse Pattern:", mousePattern);
    console.log("Form Pattern:", formPattern);
    console.log("Final Score:", Math.round(score));

    setConfidenceScore(Math.round(score));
  };

  // Calculate metrics whenever behavior data changes
  useEffect(() => {
    calculateMetrics();
  }, [keyStrokes, mouseMovements, formPatterns]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        score: confidenceScore
      })
    });
    
    const result = await res.json();
    setLoading(false);
    
    if (result.success) {
      if (result.otp) {
        toast.success(result.message);
        setTimeout(() => {
          router.push(`/otp?token=${result.token}`);
        }, 2000);
      } else {
        toast.success(result.message);
        setTimeout(() => {
          window.open("/", "_self");
        }, 2000);
      }
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div 
      className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black"
      onMouseMove={handleMouseMove}
    >
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to DeployLite
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Login to your account to get started with DeployLite and start deploying your application.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            placeholder="basir@deploylite.tech" 
            type="email" 
            onChange={handleChange} 
            value={form.email}
            onKeyDown={handleKeyPress}
            onKeyUp={handleKeyPress}
          />
        </LabelInputContainer>
        
        <div className="flex justify-end absolute right-10 mb-8">
          <Link href="/forgot" className="text-sm text-neutral-700 dark:text-neutral-300 hover:underline">
            Forgot password?
          </Link>
        </div>
        
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            placeholder="••••••••" 
            type="password" 
            onChange={handleChange} 
            value={form.password}
            onKeyDown={handleKeyPress}
            onKeyUp={handleKeyPress}
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          {loading ? <LoginLoader /> : "Login →"}
          <BottomGradient />
        </button>
        
        <div className="flex justify-center items-center mt-4">
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            Don't have an account? 
            <Link href="/signup" className="underline text-green-500 mx-1">
              Create an account
            </Link>
          </span>
        </div>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="button"
            onClick={() => {
              let url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&scope=${process.env.NEXT_PUBLIC_GOOGLE_SCOPE}&response_type=code&access_type=offline`;
              window.open(url, "_self");
            }}
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

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