import React from 'react';
import { useEffect } from 'react';
import L from 'leaflet';
import './Marker.css';

function Marker({map, position, message}) {
    useEffect(() => {
        if (!map) return;

        const marker = L.marker(position)
            .addTo(map);

            
        // Cleanup. Remove the marker when the component unmounts.
        return () => {
            map.removeLayer(marker);
        };
    }, [map, position, message]);

    return null;
}

export default Marker;