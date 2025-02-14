import React, { useState, useRef, useEffect } from "react";

import VericalButton from "./VerticalButton";
import { FaSatellite, FaMapMarked } from 'react-icons/fa';
import { useLoadScript, GoogleMap, DrawingManager } from "@react-google-maps/api";
// import ReactangleCard from "./card/rectangle";
import PolyLineItem from "./PolylineItem";
import { useSelector, useDispatch } from "react-redux";

import { setIsActiveModal } from '../features/app/appSlice';
import { setActivePolyLine, setPolyLineForm } from '../features/city/citySlice';

const libraries = ['drawing',];


function Map({ isPolyLineCreate, localty }) {

  const [p,setP] = useState(null);


  const polylines = useSelector(state => state.city.polylines);
  const activeEl = useSelector(state => state.app.activeEl);

  const [map, setMap] = useState(null);
  const [drawerManager, setDrawerManager] = useState();
  const polyLinesRef = useRef([]);
  const dispatch = useDispatch();

  const changeMapStyle = (type) => {
    map.setOptions({
      mapTypeId: type,
    });
  }

  useEffect(() => {
    polyLinesRef.current = [];
    if (drawerManager) {
      drawerManager.setOptions({
        drawingMode: isPolyLineCreate ? window.google.maps.drawing.OverlayType.POLYLINE : window.google.maps.drawing.OverlayType.CONTROL
      })
    }


  }, [activeEl, isPolyLineCreate, localty]);

 
 const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBUVRGCl79p01aB2YhioP6s3bURSLV0qDE",
    libraries: libraries
  })

  const clearAllMarkers = () => {
    console.log('clear all markers')
    dispatch(setActivePolyLine(null));
    polyLinesRef.current.map(({ polyline, color }) => {
      polyline.setOptions({
        strokeWeight: 3,
        strokeColor: color
      })
    })
  }

  const pushPolylines = (polyline) => {
    polyLinesRef.current.push(polyline);
  }

  const onClick = (event) => {
    console.log("lat", event.latLng.lat(), "lng", event.latLng.lng());
    dispatch(setIsActiveModal(false))
    clearAllMarkers();
  }


  const onLoadDrawerManager = drawingManager => {
    setDrawerManager(drawingManager)
  }


  const polyLineForm = useSelector(state => state.city.polyLineForm);

  const onPolyLineComplete = polyline => {
    const paths = polyline.getPath().getArray();

    let positionGroup = {
      positions: paths.map(path => ({
        lat: path.lat(),
        lng: path.lng()
      }))
    }

    setP(polyline);   
    dispatch(setPolyLineForm({
      ...polyLineForm,
      positionGroup: [...polyLineForm.positionGroup, positionGroup]
    }))
  }

  function deleteRemove() {
    p.setMap(null);
    setP(null);
    dispatch(setPolyLineForm({
      ...polyLineForm,
      positionGroup: [...polyLineForm.positionGroup.slice(0,-1)]
    }))
  }


  const renderMap = () => {
    const onLoadMap = (mapInstanse) => {
      // console.log(localty.lat,localty.lng);
      // mapInstanse.setCenter({ lat: localty.lat, lng: localty.lng });
      setMap(mapInstanse);
    }

    const onUnmountMap = (mapInstanse) => {
    
      setMap(null);

    }
    return <>
     <div className="mb-3" style={{
        position: 'absolute',
        top: 20,
        right: 135,
        zIndex: 100
      }}>
        {p != null ? <div className="col-4"><button type="button" onClick={deleteRemove} className="btn btn-danger">Очистить последний элемент</button></div> : ''}       
      </div>
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 100
      }}>
        <div className="sidebar__body-row">
          <VericalButton onClick={() => changeMapStyle('satellite')}
            icon={<FaSatellite size={30} />}
            title={'Спутник'}></VericalButton>
          <VericalButton onClick={() => changeMapStyle('roadmap')}
            icon={<FaMapMarked size={30} />}
            title={'Карта'}></VericalButton>
        </div>
      </div>
      <GoogleMap
        options={{
          mapTypeId: 'roadmap',
          // styles: exampleMapStyles,
          disableDefaultUI: true,
        }}
        center={{lat: localty.lat,lng: localty.lng}}
        mapContainerClassName="App-map"
        onCenterChangedEnd={() => {
          if (map) {
            const c = map.getCenter().toJSON();
            map.setCenter(c);
          }
        }}
        zoom={13}
        onClick={onClick}
        onLoad={onLoadMap}
        onUnmount={onUnmountMap}
      >
        {polylines.map(poly => (
          <div key={poly.id}>
            <PolyLineItem poly={poly} pushPolylines={pushPolylines} clearAllMarkers={clearAllMarkers}></PolyLineItem>
          </div>
        ))}
        <DrawingManager
          options={{
            drawingMode: window.google.maps.drawing.OverlayType.CONTROL,
            drawingControl: true,
            polylineOptions: {
              strokeColor: "#009900",
              strokeOpacity: 2,
              clickable:true,
              strokeWeight: 2
            },
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [
                window.google.maps.drawing.OverlayType.POLYLINE,
              ],
            },
          }}
          
          onLoad={onLoadDrawerManager}
          onPolylineComplete={onPolyLineComplete}
        />
      </GoogleMap>
    </>
  }

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>
  }
  return (
    <div className="App">
      {isLoaded ? (
        renderMap()
      ) : ""}
    </div>
  );
}

export default Map