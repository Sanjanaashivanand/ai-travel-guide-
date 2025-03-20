"use client";
import dynamic from "next/dynamic";

// ✅ Dynamically import MapComponent to prevent SSR issues
const MapComponent = dynamic(() => import("./components/Maps"), { ssr: false });

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Explore the World</h1>
      <MapComponent />
    </div>
  );
}
