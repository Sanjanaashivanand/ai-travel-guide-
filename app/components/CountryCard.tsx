import React, { useState } from "react";
import Image from "next/image";

interface CountryCardProps {
  country: string;
  capital: string;
  population: string;
  flag: string;
  fact: string;
  loadingFact?: boolean;
  error?: string;
}

const CountryCard: React.FC<CountryCardProps> = ({
  country,
  capital,
  population,
  flag,
  fact,
  loadingFact,
  error,
}) => {
  const [showFacts, setShowFacts] = useState(false);

  const toggleFacts = () => setShowFacts((prev) => !prev);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 p-4 rounded-lg w-56 sm:w-64 shadow-lg">
        <h3 className="text-lg font-bold text-center mb-2">⚠️ Error</h3>
        <p className="text-sm text-center">{error}</p>
        <p className="mt-2 text-xs text-center text-gray-500">
          We couldn’t load info for <strong>{country || "this country"}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 border border-primary rounded-lg shadow-lg p-3 w-56 sm:w-64 h-auto max-h-80 flex flex-col justify-between overflow-hidden">
      <h3 className="text-lg md:text-xl font-extrabold text-primary text-center">{country}</h3>

      <div className="flex flex-row md:flex-col items-center mt-0 md:mt-3 space-x-3 md:space-x-0">
        <Image
          src={flag}
          alt={`${country} flag`}
          width={80}
          height={60}
          className="w-16 h-12 sm:w-20 sm:h-16 rounded-lg shadow-md border border-gray-200 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Red_X.svg/768px-Red_X.svg.png";
          }}
        />

        <div className="w-2/3 md:w-full mt-0 md:mt-4 space-y-1 text-gray-700 text-xs md:text-sm">
          <p className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-medium text-secondary">🏛️ Capital:</span>
            <span>{capital}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium text-secondary">👥 Population:</span>
            <span>{population}</span>
          </p>
        </div>
      </div>

      <button
        onClick={toggleFacts}
        className="mt-2 text-sm text-blue-500 hover:underline focus:outline-none"
      >
        {showFacts ? "Hide Facts" : "Show Interesting Facts"}
      </button>

      {showFacts && (
        <div className="mt-2 text-xs md:text-sm text-gray-600 overflow-y-auto max-h-24">
          {loadingFact ? (
            <p className="italic text-gray-400">Fetching fun facts...</p>
          ) : fact ? (
            <p className="whitespace-pre-wrap">{fact}</p>
          ) : (
            <p className="italic text-gray-400">No fact available for this country.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CountryCard;
