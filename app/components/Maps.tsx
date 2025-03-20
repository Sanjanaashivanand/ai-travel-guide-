"use client";
import { useState, useEffect, useRef } from "react";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapComponent() {
  const mapRef = useRef<any>(null);
  const [allCountriesGeoJSON, setAllCountriesGeoJSON] = useState<any>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);


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
  

  const handleMapClick = (e: any) => {
    if (!mapRef.current || !allCountriesGeoJSON) return;
  
    const map = mapRef.current.getMap();
    const features = map.queryRenderedFeatures(e.point, { layers: ["country-fills"] });
  
    if (features.length > 0) {
      const clickedFeature = features[0];
      const countryId = clickedFeature.id;
      const countryName = clickedFeature.properties.admin;
      const countryCenter = e.lngLat; // ✅ Get the clicked location
  
      if (countryId) {
        // ✅ Remove highlight from the previous country
        if (selectedCountryId !== null) {
          map.setFeatureState({ source: "countries", id: selectedCountryId }, { selected: false });
        }
  
        // ✅ Highlight the new country
        setSelectedCountryId(countryId);
        setSelectedCountry(countryName);
  
        map.setFeatureState({ source: "countries", id: countryId }, { selected: true });
      }
    } else {
      setSelectedCountry(null);
    }
  };
  
  

  return (
    <div className="relative w-full max-w-5xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center text-primary">
        {selectedCountry ? `Selected Country: ${selectedCountry}` : "Click on a country"}
      </h2>

      <div className="w-full h-[600px] border border-primary rounded-lg shadow-lg overflow-hidden">
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
                  "#ff0000", // ✅ Selected country color
                  "rgba(0,0,0,0)", // Default color
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
                  "#ff0000", // ✅ Red when selected
                  "rgba(0,0,0,0)" // ✅ Invisible by default
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
