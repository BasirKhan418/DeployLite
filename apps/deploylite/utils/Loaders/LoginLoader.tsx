"use client";
import React, { useEffect, useState } from 'react';

export default function LoginLoader() {
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    import('ldrs').then((mod) => {
      mod.tailspin.register();
      setRegistered(true);
    });
  }, []);

  if (!registered) return null;

  return (
    <span className="ml-2 flex justify-center items-center">
      <l-tailspin size="30" stroke="4" speed="1" color="white"></l-tailspin>
    </span>
  );
}
