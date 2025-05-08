"use client";
import { useState, useEffect, useRef } from "react";
import Map from "react-map-gl/maplibre";
import axios from 'axios';
import { MapRef } from "react-map-gl/maplibre";
import { MapLayerMouseEvent } from "react-map-gl/maplibre";
import CountryCard from "./CountryCard";
import { Feature, FeatureCollection } from "geojson"; 

const token = process.env.NEXT_PUBLIC_COUNTRY_INFO_API_TOKEN;


export default function MapComponent() {
  const mapRef = useRef<MapRef | null>(null); 
  const [allCountriesGeoJSON, setAllCountriesGeoJSON] = useState<GeoJSON.FeatureCollection | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryInfo, setCountryInfo] = useState<{
    name: string;
    capital: string;
    population: string;
    flag: string;
    error?: string;
  } | null>(null);
  const [countryFact, setCountryFact] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true); // ✅ Prevents loading issues
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [factLoading, setFactLoading] = useState(false);

  // ✅ Fetch all country boundaries
  useEffect(() => {
    const fetchAllBoundaries = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson"
        );
        const data = await response.json();

        // ✅ Ensure each country has a unique `id`
        const updatedData: FeatureCollection = {
          ...data,
          features: data.features.map((feature: Feature, index: number) => ({
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
  const fetchCountryInfo = async (iso2: string) => {
    setLoading(true);
  
    try {
      const response = await axios.get(`https://restfulcountries.com/api/v1/countries?iso2=${iso2}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      const data = response.data.data

      if (data) {
        const population = data.population;
        const formattedPopulation = population ? parseInt(population.replace(/,/g, ''), 10).toLocaleString() : "Unknown";
        const flagUrl = data.href && data.href.flag ? data.href.flag : 'https://upload.wikimedia.org/wikipedia/commons/d/de/Flag_of_the_United_States.png';

        setCountryInfo({
          name: data.name,
          capital: data.capital || "Unknown",
          population: formattedPopulation,
          flag: flagUrl,
        });
      }

    } catch (error) {
      console.error("Error fetching country info:", error);
      setCountryInfo(null);
    } finally{
      setLoading(false);
    }
  };

  const fetchCountryFunFact = async (countryName: string) => {
    try {
      setFactLoading(true);
      const res = await fetch("/api/fun-fact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: countryName }),
      });
  
      const data = await res.json();
      setCountryFact(data.fact || "No fun fact available.");
    } catch (err) {
      console.error("Error fetching fun fact:", err);
      setCountryFact("Could not fetch a fun fact at this time.");
    } finally {
      setFactLoading(false);
    }
  };
  

  // ✅ Handle country selection when clicking the map
  const handleMapClick = (e: MapLayerMouseEvent) => {
    if (!mapRef.current || !allCountriesGeoJSON) return;
  
    const map = mapRef.current.getMap();
    const features = map.queryRenderedFeatures(e.point, { layers: ["country-fills"] });
  
    if (features.length > 0) {
      const clickedFeature = features[0];
      const countryId = Number(clickedFeature.id);
      const countryName = clickedFeature.properties.admin;
      const iso2 = clickedFeature.properties.iso_a2

      console.log(clickedFeature)
  
      if (countryId) {
        if (selectedCountryId !== null) {
          map.setFeatureState({ source: "countries", id: selectedCountryId }, { selected: false });
        }
  
        setSelectedCountryId(countryId);
        setSelectedCountry(countryName);
        map.setFeatureState({ source: "countries", id: countryId }, { selected: true });
  
        if (iso2 && iso2 != "-99") {
          fetchCountryInfo(iso2);
          fetchCountryFunFact(countryName);
        } else {
          setCountryInfo({
            name: countryName || "Unknown Region",
            capital: "N/A",
            population: "N/A",
            flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/No_flag.svg/225px-No_flag.svg.png", // error icon or neutral fallback
            error: "Country data unavailable.",
          });
        }
  
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
            posX = cardWidth / 2 + 20; // Shift right if too close to the left
          } else if (posX > mapWidth - cardWidth / 2) {
            posX = mapWidth - cardWidth / 2 - 20; // Shift left if too close to the right
          }
  
          // ✅ Adjust position if near the top or bottom
          if (posY < cardHeight + 0) {
            posY = cardHeight + 55; // Move tooltip below the click if too close to the top
          } else if (posY > mapHeight - cardHeight - 30) {
            posY -= cardHeight/4 - 30; 
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
            fact={countryFact}
            loadingFact={factLoading}
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
              const map = mapRef.current?.getMap();
              if (!map) return;

              map.addSource("countries", {
                type: "geojson",
                data: allCountriesGeoJSON as GeoJSON.FeatureCollection,
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
    {loading ? (
      <p className="text-gray-500">Loading country info...</p>
    ) : countryInfo ? (
      <CountryCard
  country={countryInfo.name}
  capital={countryInfo.capital}
  population={countryInfo.population}
  flag={countryInfo.flag}
  fact={countryFact}
  loadingFact={factLoading}
  error={countryInfo.error}
/>
    ) : (
      <p className="text-red-500">Country not found 🙃</p>
    )}
  </div>
  )}
      </div>
    </div>
  );
}
