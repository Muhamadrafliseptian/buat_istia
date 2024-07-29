'use client';

import React, { useRef, useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

// Define TypeScript types for the location objects
interface LatLng {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  onDistanceChange: (distance: number) => void;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

const rafli: LatLng = {
  lng: 106.69634326150316,
  lat: -6.202816524618473,
};

const istia: LatLng = {
  lat: -6.4284559362011615,
  lng: 108.28326103466544,
};

function MapComponent({ onDistanceChange }: MapComponentProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selected, setSelected] = useState<LatLng | null>(null);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(rafli);
    bounds.extend(istia);
    map.fitBounds(bounds);
  };

  useEffect(() => {
    if (rafli && istia) {
      const distance = computeDistance(rafli, istia);
      onDistanceChange(distance);
    }
  }, [onDistanceChange]);

  const computeDistance = (loc1: LatLng, loc2: LatLng) => {
    const latLng1 = new window.google.maps.LatLng(loc1.lat, loc1.lng);
    const latLng2 = new window.google.maps.LatLng(loc2.lat, loc2.lng);
    return window.google.maps.geometry.spherical.computeDistanceBetween(latLng1, latLng2);
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={rafli}
      zoom={10}
      onLoad={onLoad}
    >
      <Marker
        position={rafli}
        onClick={() => setSelected(rafli)}
      />
      <Marker position={istia} onClick={() => setSelected(istia)} />

      {selected && (
        <InfoWindow position={selected} onCloseClick={() => setSelected(null)}>
          <div>
            <h4>{selected === rafli ? "lokasi ple" : "lokasi inisial i"}</h4>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default function Home() {
  const [distance, setDistance] = useState<number | null>(null);

  return (
    <div>
      <p>Istia Project chuyyyyyyy</p>
      <p>Jarak: {distance ? `${(distance / 1000).toFixed(2)} km` : "Menghitung..."}</p>
      <p>Kemungkinan ketemu: 2029 hiks</p>
      <LoadScript
        googleMapsApiKey="AIzaSyAYBzqp2zGPtI0xnr8N8nN_OjsxxzBB9nw"
        libraries={['geometry']} // Load the geometry library
      >
        <MapComponent onDistanceChange={setDistance} />
      </LoadScript>
    </div>
  );
}
