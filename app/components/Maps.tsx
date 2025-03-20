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


  useEffect(() => {
    const fetchAllBoundaries = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson"
        );
        const data = await response.json();
  
        // ✅ Ensure every country has a unique `id`
        const updatedData = {
          ...data,
          features: data.features.map((feature: any, index: number) => ({
            ...feature,
            id: index + 1, // ✅ Assign unique ID starting from 1
          })),
        };
  
        setAllCountriesGeoJSON(updatedData);
      } catch (error) {
        console.error("Error loading global country boundaries:", error);
      }
    };
  
    fetchAllBoundaries();
  }, []);

  const fetchCountryInfo = async (countryName: string) => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
      const data = await response.json();

      console.log("COUNTRY DATA", data)
  
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
  

  const handleMapClick = (e: any) => {
    if (!mapRef.current || !allCountriesGeoJSON) return;
  
    const map = mapRef.current.getMap();
    const features = map.queryRenderedFeatures(e.point, { layers: ["country-fills"] });
  
    if (features.length > 0) {
      const clickedFeature = features[0];
      const countryId = clickedFeature.id;
      const countryName = clickedFeature.properties.admin;
      const countryCenter = e.lngLat; 
  
      if (countryId) {
        if (selectedCountryId !== null) {
          map.setFeatureState({ source: "countries", id: selectedCountryId }, { selected: false });
        }
  
        setSelectedCountryId(countryId);
        setSelectedCountry(countryName);
  
        map.setFeatureState({ source: "countries", id: countryId }, { selected: true });

        fetchCountryInfo(countryName);
      }
    } else {
      setSelectedCountry(null);
    }
  };
  
  

  return (
    <div className="relative w-full max-w-5xl mx-auto p-4 space-y-4">
      {/* ✅ Responsive Heading */}
      <h2 className="hidden sm:block text-2xl font-bold text-center text-primary">
        {selectedCountry ? `Selected Country: ${selectedCountry}` : "Click on a country"}
      </h2>

      {/* ✅ Responsive Country Card */}
      {countryInfo && (
        <div className="flex justify-center w-full mt-4">
          <CountryCard
            country={countryInfo.name}
            capital={countryInfo.capital}
            population={countryInfo.population}
            flag={countryInfo.flag}
          />
        </div>
      )}

      {/* ✅ Responsive Map - Adjusts Height Based on Device */}
      <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] border border-primary rounded-lg shadow-lg overflow-hidden">
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

            // ✅ Add the country fill layer with dynamic color based on `feature-state`
            map.addLayer({
              id: "country-fills",
              type: "fill",
              source: "countries",
              paint: {
                "fill-color": [
                  "case",
                  ["boolean", ["feature-state", "selected"], false],
                  "#ff0000",
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
                  "#ff0000",
                  "rgba(0,0,0,0)",
                ],
                "line-width": 2,
              },
            });
          }}
        />
      </div>
    </div>
  );
}
