import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

function Map({ children }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map
        mapInstanceRef.current = L.map(mapRef.current).setView([34.0522, -118.2437], 10);

        // Add base layer
        L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png', {
            minZoom: 0,
            maxZoom: 20,
            attribution: '&copy; <a href="https://www.stadiamaps.com/">Stadia Maps</a>...'
        }).addTo(mapInstanceRef.current);

        // Cleanup
        return () => {
            mapInstanceRef.current?.remove();
        };
    }, []);

    // Provide map instance to children
    const childrenWithProps = React.Children.map(children, child => {
        return React.cloneElement(child, { map: mapInstanceRef.current });
    });

    return (
        <div ref={mapRef} className="map-container">
            {mapInstanceRef.current && childrenWithProps}
        </div>
    );
}

export default Map;