import { useEffect, useRef } from "react";

const Map = ({ latitude, longitude, title }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const leafletLoadedRef = useRef(false);

  useEffect(() => {
    if (!latitude || !longitude) return;

    // Cleanup function to remove any existing map
    const cleanupMap = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };

    // Dynamically load Leaflet CSS if not already loaded
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
      document.head.appendChild(leafletCSS);
    }

    // Function to initialize map
    const initializeMap = () => {
      if (!mapRef.current) return;
      
      // Clean up any existing map first
      cleanupMap();

      // Get coordinates
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates:", { lat, lng });
        return;
      }

      // Create new map instance
      mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], 15);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      L.marker([lat, lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(title)
        .openPopup();
    };

    // Load Leaflet script if not already loaded
    if (!window.L && !leafletLoadedRef.current) {
      leafletLoadedRef.current = true;
      const leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
      leafletScript.async = true;
      
      leafletScript.onload = () => {
        initializeMap();
      };
      
      document.body.appendChild(leafletScript);
    } else if (window.L) {
      // Leaflet is already loaded, initialize map
      initializeMap();
    }

    // Cleanup on component unmount
    return cleanupMap;
  }, [latitude, longitude, title]);

  return (
    <div
      ref={mapRef}
      style={{
        height: '400px',
        width: '100%',
        borderRadius: '10px',
        border: '1px solid #ccc',
      }}
    />
  );
};

export default Map; 