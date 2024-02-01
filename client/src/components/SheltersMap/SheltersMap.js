import React, { useState, useEffect, useRef } from 'react';
import Map, { NavigationControl, ScaleControl, GeolocateControl, Popup, Source, Layer } from 'react-map-gl';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import HeartMarker from '../../assets/icons/SafeHavenTO_icon-marker.png'
import './SheltersMap.scss';

export default function SheltersMap(props) {
  const [apiKey, setApiKey] = useState('');   // piece of state to store maps API key
  const [locations, setLocations] = useState([]); // Raw locations as an array
  const [refreshKey, setRefreshKey] = useState(0); // Forces a re-render of the map
  const [selectedPlace, setSelectedPlace] = useState(null); // Sets the selected place upon marker click
  const [geoJsonLocations, setGeoJsonLocations] = useState({ // GeoJSON representation for Mapbox
    type: 'FeatureCollection',
    features: [],
  });
  const [viewState, setViewState] = useState({ // Initial view state
    longitude: -79.384293,
    latitude: 43.653908,
    zoom: 12.1,
  });

  const mapRef = useRef(); // Reference to the map instance

  useEffect(() => { // Fetch and set maps key from server
    axios.get('http://localhost:8080/api/maps-key').then(response => {
      setApiKey(response.data.key);
    });
  }, []);

  useEffect(() => { // Fetch geocode for each location
    const fetchGeocode = async () => {
      if (!apiKey) return;
      const newLocations = await Promise.all(
        props.records.map(async (location) => {
          const fullAddress = `${location.LOCATION_ADDRESS} ${location.LOCATION_CITY} ${location.LOCATION_PROVINCE} ${location.LOCATION_POSTAL_CODE}`;
          const encodedAddress = encodeURIComponent(fullAddress); // encode address for URL
          try {
            const response = await axios.get(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${apiKey}`
            );
            const coordinates = response.data.features[0].geometry.coordinates;
            return { ...location, coordinates };
          } catch (error) {
            // console.error('Error fetching geocode:', error);
            return null;
          }
        })
      );
      // updating the locations state with the new array, and only include locations with valid geocoded data --this removes any locations where geocoding failed
      setLocations(newLocations.filter(loc => loc != null));
    };

    fetchGeocode();
  }, [apiKey, props.records]);

  useEffect(() => { // useEffect to update geoJsonLocations  --this will update the map markers when the filterType changes
    const features = locations // Convert locations to GeoJSON format
        .filter(location => { // Filter by capacity type
            if (props.filterType === 'All') return true;
            return location.CAPACITY_TYPE === (props.filterType === 'Beds' ? 'Bed Based Capacity' : 'Room Based Capacity');
        })
        .map(location => ({
            type: 'Feature',
            properties: { ...location }, // Copy all properties
            name: location.CAPACITY_TYPE,
            geometry: { // Add the coordinates
                type: 'Point',
                coordinates: location.coordinates,
            },
        }));

    setGeoJsonLocations({ // Update the GeoJSON representation
        type: 'FeatureCollection',
        features,
    });

}, [locations, props.filterType]);

const handleMapLoad = () => { // Load the HeartMarker icon and attach event listeners
  const map = mapRef.current.getMap(); // Get the map instance

  map.loadImage(HeartMarker, (error, image) => {  // Load the HeartMarker icon as soon as the map loads
    if (error) throw error;
    map.addImage('heart-marker', image); // Add the image with the ID 'heart-marker'

    map.on('click', 'location-markers', (e) => {  // Attach a click event listener to the "location-markers" layer
      if (e.features.length > 0) {
        const feature = e.features[0];
        setSelectedPlace(feature); // Store the entire feature
        setViewState({ // Update the view state to center on the clicked marker
          ...viewState,
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
          zoom: 12.8,
        });
      }
    });

    map.on('mouseenter', 'location-markers', () => { // Change cursor to pointer when over marker
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'location-markers', () => { // Change cursor back to default when not over marker
      map.getCanvas().style.cursor = '';
    });
  });
};

  const handleMapClick = (e) => { // Handle map click event
    const map = mapRef.current.getMap();
    const features = map.queryRenderedFeatures(e.point, { layers: ['location-markers'] }); // Query the map for features at the clicked point

    if (features.length > 0) { // If a feature is clicked, store the entire feature and update the view state
      const feature = features[0];
      setSelectedPlace(feature);
      setViewState({
        ...viewState,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom: 13,
        transitionDuration: 1000,
      });
      setRefreshKey(prevKey => prevKey + 1); // Force re-render by toggling the refresh key
    } else {
      setSelectedPlace(null); // Hide the popup if no feature is clicked
    }
  };

// console.log('selectedPlace= ', selectedPlace);
  return (
    <>
      {apiKey && (
        <Map
          key={refreshKey} // This forces the map to re-render, which is necessary to update the markers
          ref={mapRef}
          {...viewState} // updates view state on marker click
          onMove={evt => setViewState(evt.viewState)} // updates view state on marker click
          mapboxAccessToken={apiKey}
          style={{ width: '50%', minHeight: 'max-content' }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          onClick={handleMapClick}
          onLoad={handleMapLoad}
        >
        <NavigationControl position='bottom-right'/>
        <ScaleControl />
        <GeolocateControl positionOptions={{ enableHighAccuracy: true }} trackUserLocation={true} />

        <Source id="locations" type="geojson" data={geoJsonLocations}>
          <Layer // Add the location markers
            id="location-markers"
            type="symbol"
            className='location-marker'
            layout={{
              'icon-image': 'heart-marker',
              'icon-size': 0.15,
              'icon-allow-overlap': true,
              'icon-ignore-placement': props.filterType === 'All' ? false : true,
            }}
          />
        </Source>

        {selectedPlace && (
          <Popup
          // className='popup'
            latitude={selectedPlace.geometry.coordinates[1]}
            longitude={selectedPlace.geometry.coordinates[0]}
            draggable={false}
            // anchor='top'
            closeButton={true}
            onClose={() => setSelectedPlace(null)}
            offset={30}
          >
            <div className='popup__div'>
              <div className='popup__div-top'>
                <h2>
                  {selectedPlace.properties.LOCATION_NAME || 'LOCATION NAME'}
                </h2>
              </div>
              <br />
              <br />
              <div className='popup__div-bottom'>
                <h3>Address:</h3>
                <h4>{selectedPlace.properties.LOCATION_ADDRESS}</h4>
                {selectedPlace.properties.CAPACITY_TYPE === 'Bed Based Capacity' ?
                  (<h3 className="shelterInfo__div-h3">Available Beds:{selectedPlace.properties.UNOCCUPIED_BEDS}</h3>)
                  :
                  (<h3 className="shelterInfo__div-h3">Available Rooms:{selectedPlace.properties.UNOCCUPIED_ROOMS}</h3>)
                }
                <button className="popup__btn-Directions"
                // onClick={handleClickDirections}
                >
                  <h3>Directions</h3>
                </button>
              </div>
            </div>
          </Popup>
          //<SearchBox accessToken={apiKey} />
        )}
        </Map>
      )}
    </>
  );
}