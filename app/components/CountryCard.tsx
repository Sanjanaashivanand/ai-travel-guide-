import React from "react";

interface CountryCardProps {
  country: string;
  capital: string;
  population: string;
  flag: string;
}

const CountryCard: React.FC<CountryCardProps> = ({ country, capital, population, flag }) => {
  return (
    <div className="bg-base-100 border border-primary rounded-xl shadow-xl p-5 
                    w-100 backdrop-blur-md bg-opacity-90 
                    transition-all duration-300 hover:scale-105">

      {/* ✅ Country Name */}
      <h3 className="text-lg md:text-xl font-extrabold text-primary text-center">{country}</h3>

      {/* ✅ Mobile View (Row Layout) & Desktop View (Column Layout) */}
      <div className="flex flex-row md:flex-col items-center mt-0 md:mt-3 space-x-3 md:space-x-0">
        
        {/* ✅ Flag (Smaller on Mobile) */}
        <img 
          src={flag} 
          alt={`${country} flag`} 
          className="w-20 h-14 md:w-28 md:h-20 rounded-lg shadow-md border border-gray-200 object-cover"
        />


        {/* ✅ Info Section (Takes More Space in Mobile) */}
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

    </div>
  );
};

export default CountryCard;
