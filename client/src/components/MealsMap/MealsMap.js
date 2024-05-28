import './MealsMap.scss';
import React, { useState, useEffect, useRef, useContext } from 'react';
import Map, {
  NavigationControl,
  ScaleControl,
  GeolocateControl,
  Popup,
  Source,
  Layer,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ApiKeyContext } from '../../contexts/ApiKeyContext';
import mealList from '../../data/TDIN_MealList.json';
import MealMarker from '../../assets/icons/SafeHavenTO_icon-meal.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import { Drawer, Button, Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import {
  faMapMarkerAlt,
  faCity,
  faPeopleGroup,
  faGlobe,
  faPhone,
  faDog,
  faWheelchair
} from '@fortawesome/free-solid-svg-icons';


export default function MealsMap() {
  const apiKey = useContext(ApiKeyContext); // API Key
  const [allDropIns, setAllDropIns] = useState([]); // Raw locations as an array
  const [selectedPlace, setSelectedPlace] = useState(null); // Sets the selected place upon marker click
  const [drawerVisible, setDrawerVisible] = useState(false); // Manage the drawer visibility
  const [activeKey, setActiveKey] = useState(null);
  const [geoJsonLocations, setGeoJsonLocations] = useState({
    // GeoJSON representation for Mapbox
    type: 'FeatureCollection',
    features: allDropIns.map((dropIn) => ({
      type: 'Feature',
      properties: dropIn,
      geometry: {
        type: 'Point',
        coordinates: [dropIn.longitude, dropIn.latitude],
      },
    })),
  });

  const [viewState, setViewState] = useState({
    longitude: -79.384293,
    latitude: 43.653908,
    zoom: 11,
  });
  const DEFAULT_VIEW_STATE = {
    longitude: -79.409527,
    latitude: 43.678122,
    zoom: 12,
  };

  const mapRef = useRef(); // Reference to the map instance

  useEffect(() => {
    setViewState(DEFAULT_VIEW_STATE); // Reset the view state to the default
    setSelectedPlace(null); // to deselect any currently selected marker on the map
  }, []);

  useEffect(() => {
    // Load and store all drop-in locations in the state
    const allDropIns = [];
    Object.values(mealList.regions).forEach((region) => {
      if (region.drop_in_centers && Array.isArray(region.drop_in_centers)) {
        allDropIns.push(...region.drop_in_centers);
      }
    });
    setAllDropIns(allDropIns);
  }, []);

  useEffect(() => {
    // useEffect to update geoJsonLocations  --this will update the map markers when the filterType changes
    const features = allDropIns // Convert locations to GeoJSON format
      .map((dropIn) => ({
        type: 'Feature',
        properties: { ...dropIn }, // Copy all properties
        name: dropIn.name,
        geometry: {
          // Add the coordinates
          type: 'Point',
          coordinates: [dropIn.longitude, dropIn.latitude],
        },
      }));

    setGeoJsonLocations({
      // Update the GeoJSON representation
      type: 'FeatureCollection',
      features,
    });
  }, [allDropIns]);

  const handleMapLoad = () => {
    const map = mapRef.current.getMap();

    map.loadImage(MealMarker, (error, image) => {
      if (error) throw error;
      map.addImage('meal-marker', image);
    });

    let popup = null;

    map.on('mouseenter', 'drop-in-markers', (e) => {
      map.getCanvas().style.cursor = 'pointer';
      const thisLocation = e.features[0].properties; // this is what triggers the hover card
      setSelectedPlace(thisLocation);
    });

    map.on('mouseleave', 'drop-in-markers', () => {
      map.getCanvas().style.cursor = '';
    });

    // Adding click event listener for markers
    map.on('click', 'drop-in-markers', (e) => {
      if (e.features.length > 0) {
        const thisLocation = e.features[0].properties;
        setSelectedPlace(thisLocation);
        setDrawerVisible(true); // Open the drawer when a marker is clicked

        map.easeTo({
          center: e.features[0].geometry.coordinates,
          duration: 1000, // Smooth transition duration in milliseconds
        });
      }
    });
  };

  const handleMapClick = (e) => {
    // Handle map click event
    // const map = mapRef.current.getMap();
    // const features = map.queryRenderedFeatures(e.point, {
    //   layers: ['drop-in-markers'],
    // }); // Query the map for features at the clicked point
    // if (features.length > 0) {
    //   // If a feature is clicked, store the entire feature and update the view state via force re-render
    //   const feature = features[0];
    //   setSelectedPlace(feature.properties);
    //   map.easeTo({
    //     center: feature.geometry.coordinates,
    //     duration: 1000 // Smooth transition duration in milliseconds
    //   });
    // } else {
    //   setSelectedPlace(null); // Hide the popup if no feature is clicked
    // }
  };

  const handleShowDrawer = () => {
    setDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedPlace(null);
  };

  const todayTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <>
      <section className='mealsMap-section' id='meals' aria-label='Map showing weekly meal drop-ins Toronto'>
        {apiKey && (
          <Map
            ref={mapRef}
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)} // updates view state on marker click
            mapboxAccessToken={apiKey}
            style={{ width: '100%', height: '100%' }}
            mapStyle='mapbox://styles/mapbox/streets-v9'
            // onClick={handleMapClick}
            onLoad={handleMapLoad}
            cooperativeGestures // requires CMD + scroll to zoom --helps prevent accidental zooming
          >
            <NavigationControl position='bottom-right' />
            <ScaleControl />
            <GeolocateControl
              positionOptions={{ enableHighAccuracy: true }}
              trackUserLocation={true}
              position='bottom-right'
            />
            <Source id='meals' type='geojson' data={geoJsonLocations}>
              <Layer
                id='drop-in-markers'
                className='drop-in-marker'
                type='symbol'
                layout={{
                  'icon-image': 'meal-marker',
                  'icon-size': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    12,
                    0.07,
                    14,
                    0.05,
                  ],
                  'icon-allow-overlap': true,
                }}
              />
            </Source>
            {selectedPlace && (
              <Popup
                latitude={selectedPlace.latitude}
                longitude={selectedPlace.longitude}
                closeButton={true}
                onClose={() => setSelectedPlace(null)}
                onClick={() => {
                  setDrawerVisible(true);
                }}
                anchor='bottom'
                offset={[0, -20]}
              >
                <div className='popup__div'>
                  <div className='popup__div-left'>
                    <h4 className='popup__div-header'>
                      {selectedPlace.name || 'LOCATION NAME'}
                    </h4>
                    <br />
                  </div>
                  <br />
                  <div className='popup__div-right'>
                    <p className='popup__div-subheader-2'>Address:</p>
                    <p className='popup__div-text'>
                      {selectedPlace.address}
                      <br />
                      {selectedPlace.city}
                    </p>
                  </div>
                </div>
                <div className='popup__button-container'>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      selectedPlace.address +
                        ', ' +
                        selectedPlace.city +
                        ', ' +
                        selectedPlace.postal_code
                    )}&travelmode=walking`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='btn--Directions-anchor'
                  >
                    <button className='popup__button-directions'>
                      <span>
                        <FontAwesomeIcon icon={faRoute} size='lg' />
                      </span>
                      <p className='popup__button-directions-text'>
                        {' '}
                        Get Directions
                      </p>
                    </button>
                  </a>
                  <Button
                    onClick={handleShowDrawer}
                    className='popup__button-view-details'
                  >
                    <p className='popup__button-directions-text'>
                      View Details
                    </p>
                  </Button>
                </div>
              </Popup>
            )}
          </Map>
        )}
        <Drawer
          className='drawer'
          title={selectedPlace ? selectedPlace.name : 'Details'}
          placement='right'
          closable={true}
          onClose={handleCloseDrawer}
          open={drawerVisible}
          width={600}
          closeIcon={false}
        >
          {selectedPlace && (
            <aside className='drawer__upper-text-container'>
              <p className='drawer__upper-text-left'>
              <FontAwesomeIcon className='drawer-icon' icon={faMapMarkerAlt} />{' '}
                <span className='drawer__upper-text-right'>
                  {selectedPlace.address}, {selectedPlace.city}, {selectedPlace.province}, {selectedPlace.postal_code}
                </span>{' '}
              </p>
              <p className='drawer__upper-text-left'>
              <FontAwesomeIcon className='drawer-icon' icon={faPhone} />{' '}
                <span className='drawer__upper-text-right'>
                <a href="tel:{selectedPlace.phone}" className="MealsMap-phone-link"> {selectedPlace.phone} </a>
                </span>
              </p>
              <p className='drawer__upper-text-left'>
              <FontAwesomeIcon className='drawer-icon' icon={faGlobe} />{' '}
                <a
                  className='MealsMap-site-link'
                  target='_blank'
                  href={selectedPlace.website}
                >
                <span className='drawer__upper-text-right MealsMap-site-link'>
                  {selectedPlace.website}
                </span>
                </a>
              </p>
              <p className='drawer__upper-text-left'>
              <FontAwesomeIcon className='drawer-icon' icon={faPeopleGroup} />{' '}
                <span className='drawer__upper-text-right'>
                  {selectedPlace.population}
                </span>
              </p>
              <p className='drawer__upper-text-left'>
              <FontAwesomeIcon className='drawer-icon' icon={faDog} />{' '}
                <span className='drawer__upper-text-right'>
                  Service Dog Allowed:{' '}
                  {selectedPlace.service_dog_allowed ? 'Yes' : 'No'}
                </span>
              </p>
              <p className='drawer__upper-text-left'>
              <FontAwesomeIcon className='drawer-icon' icon={faWheelchair} />{' '}
                <span className='drawer__upper-text-right'>
                  Wheelchair Accessible:{' '}
                  {selectedPlace.wheelchair_accessible ? 'Yes' : 'No'}
                </span>
              </p>
              <br />
              {/* {console.log('SELECTEDPLACE======', selectedPlace)}
              {console.log('SELECTEDPLACE.schedule======', selectedPlace.schedule)} */}
              {console.log('Type of schedule:', typeof selectedPlace.schedule)}
              {console.log('Content of schedule:', selectedPlace.schedule)}

              <Collapse
                accordion
                ghost
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                className='custom-collapse'
                activeKey={activeKey}
                onChange={(key) => setActiveKey(key)}
                size='small'

              >
                <Collapse.Panel
                  header={`Meal Schedule`}
                  key='1'
                  size='Large'
                  >
                  <div className='mealsMap__C1--DropIn-Schedule'>
                    {selectedPlace &&
                      selectedPlace.schedule &&
                      Object.entries(JSON.parse(selectedPlace.schedule)).map(
                        ([day, details]) => (
                          <>
                            <div
                              className='mealsMap__C1--Weekday-Div'
                              key={day}
                            >
                              {day && (
                                <p className='mealsMap__C1--Day'>{day}</p>
                              )}
                              <div className='mealsMap__C1--Meal-Info-Container'>
                                {details.breakfast && (
                                  <p className='mealsMap__C1--Meal-Text'>
                                    Breakfast: {details.breakfast}
                                  </p>
                                )}
                                {details.lunch && (
                                  <p className='mealsMap__C1--Meal-Text'>
                                    Lunch: {details.lunch}
                                  </p>
                                )}
                                {details.dinner && (
                                  <p className='mealsMap__C1--Meal-Text'>
                                    Dinner: {details.dinner}
                                  </p>
                                )}
                                {details.snack && (
                                  <p className='mealsMap__C1--Meal-Text'>
                                    Snack: {details.snack}
                                  </p>
                                )}
                              </div>
                            </div>
                            <hr className='weekday-seperator' />
                          </>
                        )
                      )}
                  </div>
                </Collapse.Panel>
                <Collapse.Panel header={`Hours of Operation`} key='2'>
                  <div>
                    {selectedPlace &&
                      selectedPlace.schedule &&
                      Object.entries(JSON.parse(selectedPlace.schedule)).map(
                        ([day, details]) => (
                          <div className='mealsMap__C2--Weekday-Div' key={day}>
                            <span className='mealsMap__C2--Day'>{day}</span>
                            <span className='mealsMap__C2--Hours'>
                              {details.hours}
                            </span>
                          </div>
                        )
                      )}
                  </div>
                </Collapse.Panel>
              </Collapse>
            </aside>
          )}
        </Drawer>
      </section>
    </>
  );
}