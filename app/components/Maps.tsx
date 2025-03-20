"use client";
import { useState, useEffect, useRef } from "react";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import CountryCard from "./CountryCard";

export default function MapComponent() {
  const mapRef = useRef<any>(null);
  const [allCountriesGeoJSON, setAllCountriesGeoJSON] = useState<any>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryInfo, setCountryInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ Prevents loading issues
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // ✅ Fetch all country boundaries
  useEffect(() => {
    const fetchAllBoundaries = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson"
        );
        const data = await response.json();

        // ✅ Ensure each country has a unique `id`
        const updatedData = {
          ...data,
          features: data.features.map((feature: any, index: number) => ({
            ...feature,
            id: index + 1, // ✅ Assign unique ID
          })),
        };

        setAllCountriesGeoJSON(updatedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading global country boundaries:", error);
        setIsLoading(false);
      }
    };

    fetchAllBoundaries();
  }, []);

  // ✅ Fetch country details (flag, capital, population)
  const fetchCountryInfo = async (countryName: string) => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
      const data = await response.json();

      if (data && data.length > 0) {
        setCountryInfo({
          name: data[0].name.common,
          capital: data[0].capital ? data[0].capital[0] : "Unknown",
          population: data[0].population.toLocaleString(),
          flag: data[0].flags.png,
        });
      }
    } catch (error) {
      console.error("Error fetching country info:", error);
      setCountryInfo(null);
    }
  };

  // ✅ Handle country selection when clicking the map
  const handleMapClick = (e: any) => {
    if (!mapRef.current || !allCountriesGeoJSON) return;
  
    const map = mapRef.current.getMap();
    const features = map.queryRenderedFeatures(e.point, { layers: ["country-fills"] });
  
    if (features.length > 0) {
      const clickedFeature = features[0];
      const countryId = clickedFeature.id;
      const countryName = clickedFeature.properties.admin;
  
      if (countryId) {
        if (selectedCountryId !== null) {
          map.setFeatureState({ source: "countries", id: selectedCountryId }, { selected: false });
        }
  
        setSelectedCountryId(countryId);
        setSelectedCountry(countryName);
        map.setFeatureState({ source: "countries", id: countryId }, { selected: true });
  
        fetchCountryInfo(countryName);
  
        // ✅ Tooltip only in Desktop View
        if (window.innerWidth >= 640) {
          const mapContainer = mapRef.current.getMap().getContainer();
          const mapWidth = mapContainer.clientWidth;
          const mapHeight = mapContainer.clientHeight;
          const cardWidth = 224; // ✅ Fixed width (w-56)
          const cardHeight = 144; // ✅ Fixed height (h-36)
  
          let posX = e.point.x;
          let posY = e.point.y;
  
          // ✅ Adjust position if near the left or right edge
          if (posX < cardWidth / 2) {
            posX = cardWidth / 2 + 15; // Shift right if too close to the left
          } else if (posX > mapWidth - cardWidth / 2) {
            posX = mapWidth - cardWidth / 2 - 15; // Shift left if too close to the right
          }
  
          // ✅ Adjust position if near the top or bottom
          if (posY < cardHeight + 20) {
            posY += cardHeight + 15; // Move tooltip below the click if too close to the top
          } else if (posY > mapHeight - cardHeight - 30) {
            console.log("Close to bottom")
            posY -= cardHeight/4; 
          } 
  
          setTooltipPosition({ x: posX, y: posY });
        }
      }
    } else {
      setSelectedCountry(null);
      setTooltipPosition(null);
    }
  };
  
  
  

  return (
    <div className="relative w-full max-w-5xl mx-auto p-4 space-y-4">
      {/* ✅ Responsive Heading */}
      <h2 className="hidden sm:block text-2xl font-bold text-center text-primary">
        {selectedCountry ? `Selected Country: ${selectedCountry}` : "Click on a country"}
      </h2>

      {/* ✅ Static Country Card for Mobile */}
      {countryInfo && (
        <div className="flex justify-center sm:hidden w-full mt-4">
          <CountryCard
            country={countryInfo.name}
            capital={countryInfo.capital}
            population={countryInfo.population}
            flag={countryInfo.flag}
          />
        </div>
      )}

      {/* ✅ Map Container with Loading Indicator */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] border border-primary rounded-lg shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-secondary font-bold animate-pulse">Loading Map...</p>
          </div>
        ) : (
          <Map
            ref={mapRef}
            mapLib={import("maplibre-gl")}
            initialViewState={{ latitude: 20, longitude: 0, zoom: 2 }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="https://demotiles.maplibre.org/style.json"
            onClick={handleMapClick}
            onLoad={() => {
              const map = mapRef.current.getMap();

              map.addSource("countries", {
                type: "geojson",
                data: allCountriesGeoJSON,
              });

              // ✅ Add the country fill layer with DaisyUI colors
              map.addLayer({
                id: "country-fills",
                type: "fill",
                source: "countries",
                paint: {
                  "fill-color": [
                    "case",
                    ["boolean", ["feature-state", "selected"], false],
                    "#570df8", // ✅ DaisyUI primary color
                    "rgba(0,0,0,0)",
                  ],
                  "fill-opacity": 0.6,
                },
              });

              // ✅ Add country borders
              map.addLayer({
                id: "country-borders",
                type: "line",
                source: "countries",
                paint: {
                  "line-color": [
                    "case",
                    ["boolean", ["feature-state", "selected"], false],
                    "#f000b8", // ✅ DaisyUI secondary color
                    "rgba(0,0,0,0)",
                  ],
                  "line-width": 2,
                },
              });
            }}
          />
        )}

{tooltipPosition && countryInfo && (
  <div
    className="hidden sm:block absolute w-64 transition-opacity duration-300"
    style={{
      left: `${tooltipPosition.x}px`,
      top: `${tooltipPosition.y}px`,
      transform: "translate(-50%, -100%)",
    }}
  >
    <CountryCard
      country={countryInfo.name}
      capital={countryInfo.capital}
      population={countryInfo.population}
      flag={countryInfo.flag}
    />
  </div>
)}
      </div>
    </div>
  );
}
