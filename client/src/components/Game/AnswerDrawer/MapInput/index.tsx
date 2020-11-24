import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { GeoCoordinate } from "../../../../interfaces";

import "./styles.scss";

function LocationMarker({
  handleUpdate,
}: {
  handleUpdate: (p: GeoCoordinate) => void;
}) {
  const [position, setPosition] = useState<any>(null);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      handleUpdate({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

interface Props {
  handleSubmit: (guess: GeoCoordinate) => void;
}

export default ({ handleSubmit }: Props) => {
  const [guess, setGuess] = useState<GeoCoordinate>();

  return (
    <>
      <MapContainer center={[0, 0]} zoom={1} scrollWheelZoom={true}>
        <TileLayer
          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.svg"
        />
        <LocationMarker handleUpdate={(p) => setGuess(p)} />
      </MapContainer>
      <button
        className="btn btn-primary ml-auto"
        onClick={() => {
          guess && handleSubmit(guess);
        }}
        disabled={!guess?.latitude || !guess.longitude}
      >
        Submit
      </button>
    </>
  );
};
