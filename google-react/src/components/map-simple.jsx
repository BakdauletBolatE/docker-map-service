import { GoogleMap,useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect, useState } from 'react';
import { FaSatellite, FaMapMarked } from 'react-icons/fa';
import VericalButton from "./VerticalButton";

const exampleMapStyles = [
    {
        featureType: "administrative",
        elementType: "labels",
        stylers: [
            {
                visibility: "off"
            },
        ],
    },
    {
        featureType: "landscape",
        elementType: "labels",
        stylers: [
            {
                visibility: "off"
            },
        ],
    },
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
            {
                visibility: "off"
            },
        ],
    },
    {
        featureType: "transit",
        elementType: "labels",
        stylers: [
            {
                visibility: "off"
            },
        ],
    },
    {
        featureType: "water",
        elementType: "labels",
        stylers: [
            {
                visibility: "off"
            },
        ],
    },
];

const containerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100%',
    zIndex: 0
}

function MapContainer(props) {

    useEffect(() => {
        if (map) {
            map.setZoom(12);
            setTimeout(() => {
                map.panTo(props.mapCenter);
                map.setZoom(14);
            }, 1000)
        }
    }, [props.mapCenter])

    const [map, setMap] = useState(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBUVRGCl79p01aB2YhioP6s3bURSLV0qDE"
      })

    // const { isLoaded, loadError } = useLoadScript({
    //     googleMapsApiKey: "AIzaSyBUVRGCl79p01aB2YhioP6s3bURSLV0qDE"
    // })

    const changeMapStyle = (styleId) => {
        map.setOptions({
            mapTypeId: styleId,
        })
    }

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        map.panTo(props.mapCenter);
        setMap(map);
      }, []);


      const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
      }, []);

    const renderMap = () => {

        return <GoogleMap
            options={{
                mapTypeId: 'satellite',
                styles: exampleMapStyles,
                disableDefaultUI: true,
            }}
            mapContainerStyle={containerStyle}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
        </GoogleMap>
    }

    // if (loadError) {
    //     return <div>Map cannot be loaded right now, sorry.</div>
    // }

    return (
        <div>
            <div className="toggleMapStyle">
                <div className="v-mr">
                    <VericalButton onClick={() => changeMapStyle('satellite')}
                        icon={<FaSatellite size={30} />}
                        title={'Спутник'}></VericalButton>
                </div>
                <VericalButton onClick={() => changeMapStyle('roadmap')}
                    icon={<FaMapMarked size={30} />}
                    title={'Карта'}></VericalButton>
            </div>
            {isLoaded ? (
                renderMap()
            ) : <></>}
        </div>
    );
}

export default React.memo(MapContainer)

