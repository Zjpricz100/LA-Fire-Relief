import { useState, useEffect } from 'react';
import Map from './components/Map/Map';
import Banner from './components/Banner/Banner';  
import Marker from './components/Marker/Marker';
import './App.css';

function App() {
    return (
        <div className="app">
            <Banner title="My Fire Map" />  
            <Map>
            </Map>
        </div>
    );
}

export default App;