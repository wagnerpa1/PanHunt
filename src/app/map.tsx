"use client";

import React, { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

interface MapProps {
  stations: { id: number; title: string }[];
  currentStation: number;
}

export const Map: React.FC<MapProps> = ({ stations, currentStation }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMap = async () => {
      const L = require("leaflet");
      require("leaflet/dist/leaflet.css");

      if (mapRef.current && mapRef.current.children.length === 0) {
        const map = L.map(mapRef.current).setView([48.4376, 12.9398], 13); // Pfarrkirchen coordinates and zoom level

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        // Add markers for each station
        stations.forEach((station) => {
          // Replace with actual coordinates for each station
          const stationCoordinates = getCoordinatesForStation(station.id);
          if (stationCoordinates) {
            L.marker([stationCoordinates.latitude, stationCoordinates.longitude])
              .addTo(map)
              .bindPopup(station.title);
          }
        });
      }
    };

    loadMap();

    return () => {
      // Dispose of the map instance when the component unmounts
      if (mapRef.current && mapRef.current.leafletElement) {
        mapRef.current.leafletElement.remove();
      }
    };
  }, [stations, currentStation]);

  // Temporary function to provide coordinates for each station
  const getCoordinatesForStation = (stationId: number) => {
    switch (stationId) {
      case 1:
        return { latitude: 48.4424, longitude: 12.9422 }; // Gartlberg Church
      case 2:
        return { latitude: 48.4348, longitude: 12.9349 }; // Old Racetrack Area
      case 3:
        return { latitude: 48.4349, longitude: 12.9384 }; // Altstadt / City Wall
      case 4:
        return { latitude: 48.4334, longitude: 12.9404 }; // Wimmer-Ross Fountain
      case 5:
        return { latitude: 48.4358, longitude: 12.9394 }; // City Parish Church
      case 6:
        return { latitude: 48.4354, longitude: 12.9381 }; // New + Old Town Hall
      case 7:
        return { latitude: 48.4369, longitude: 12.9370 }; // Heilig-Geist-Spital
      default:
        return null;
    }
  };

  return (
    <div ref={mapRef} style={{ height: "400px", width: "100%" }}></div>
  );
};
