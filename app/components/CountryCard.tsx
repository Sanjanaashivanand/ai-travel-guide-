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
    <div className="w-full bg-red-100 border border-red-400 text-red-800 p-4 rounded-lg shadow-lg text-center space-y-2">
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
        className={`mt-3 px-4 py-2 rounded-full border border-primary text-primary text-sm font-medium transition-all duration-200 ease-in-out
          hover:bg-primary hover:text-base-100 shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50`}
      >
        {showFacts ? "Hide Facts" : "Show Interesting Facts"}
      </button>

      {showFacts && fact && (
        <div className="mt-3 px-4 py-3 bg-base-200 rounded-md border border-primary/30 shadow-inner max-h-[300px] overflow-y-auto text-sm text-gray-700 space-y-2">
          <h4 className="font-semibold text-primary text-center">
            {fact.split('\n')[0]}
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {fact
              .split('\n')
              .slice(1)
              .filter(line => line.trim() !== '')
              .map((line, index) => (
                <li key={index}>{line.replace(/^\* /, '')}</li>
              ))}
          </ul>
        </div>
      )}


    </div>
  );
};

export default CountryCard;
