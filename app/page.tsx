"use client";
import dynamic from "next/dynamic";

// ✅ Dynamically import MapComponent to prevent SSR issues
const MapComponent = dynamic(() => import("./components/Maps"), { ssr: false });

export default function HomePage() {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-gray-100">
      <header className="p-4 text-center text-3xl font-bold text-primary">
        Explore the World
      </header>
      <main className="flex-1">
        <MapComponent />
      </main>
    </div>
  );
}
