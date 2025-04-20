"use client";

import React, { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

interface MapProps {
  stations: {
    id: number;
    title: string;
    latitude: number;
    longitude: number;
  }[];
  currentStation: number;
  zoom?: number;
}

export const Map: React.FC<MapProps> = ({
  stations,
  currentStation,
  zoom = 13,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMap = async () => {
      const L = require("leaflet");

      if (mapRef.current && mapRef.current.children.length === 0) {
        const map = L.map(mapRef.current).setView(
          [48.4376, 12.9398],
          zoom
        ); // Pfarrkirchen coordinates and zoom level

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        // Add markers for each station
        stations.forEach((station) => {
          L.marker([station.latitude, station.longitude])
            .addTo(map)
            .bindPopup(station.title);
        });
      }
    };

    const loadLeafletStyles = async () => {
      await import("leaflet/dist/leaflet.css");
    };

    loadLeafletStyles();
    loadMap();

    return () => {
      // Dispose of the map instance when the component unmounts
      if (mapRef.current && mapRef.current.leafletElement) {
        mapRef.current.leafletElement.remove();
      }
    };
  }, [stations, currentStation, zoom]);

  return (
    <div ref={mapRef} style={{ height: "300px", width: "100%" }}></div>
  );
};
