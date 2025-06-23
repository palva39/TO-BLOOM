import React from "react";

export default function ButterflyLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="relative w-24 h-24">
        {/* Butterfly body */}
        <div className="absolute left-1/2 top-1/2 w-2 h-10 bg-purple-400 rounded-full -translate-x-1/2 -translate-y-1/2 z-10" />
        {/* Left wing */}
        <div className="absolute left-1/2 top-1/2 w-12 h-12 bg-pink-200 rounded-full -translate-x-full -translate-y-1/2 animate-[butterflywing_1s_ease-in-out_infinite] opacity-80" />
        {/* Right wing */}
        <div className="absolute left-1/2 top-1/2 w-12 h-12 bg-pink-300 rounded-full translate-x-0 -translate-y-1/2 animate-[butterflywing_1s_ease-in-out_infinite_reverse] opacity-80" />
        {/* Antennae */}
        <div
          className="absolute left-1/2 top-1/2 w-1 h-6 bg-purple-300 rounded-full -translate-x-1/2 -translate-y-10 rotate-[-20deg]"
          style={{ top: "10%" }}
        />
        <div
          className="absolute left-1/2 top-1/2 w-1 h-6 bg-purple-300 rounded-full -translate-x-1/2 -translate-y-10 rotate-[20deg]"
          style={{ top: "10%" }}
        />
      </div>
      <p className="mt-8 text-lg text-purple-600 font-semibold animate-pulse">
        Cargando...
      </p>
      <style>{`
        @keyframes butterflywing {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          50% { transform: scaleY(1.2) scaleX(1.1); }
        }
      `}</style>
    </div>
  );
}
