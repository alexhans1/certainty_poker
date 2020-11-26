import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Tooltip,
} from "react-leaflet";
import { GeoCoordinate } from "../../../interfaces";

import "./styles.scss";

type HandleOnClick = (p: GeoCoordinate) => void;
export interface Marker {
  label?: string;
  position: GeoCoordinate;
}

interface Props {
  markers?: Marker[];
  handleOnClick?: HandleOnClick;
}

function LocationMarker({ handleUpdate }: { handleUpdate: HandleOnClick }) {
  const [position, setPosition] = useState<any>(null);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      handleUpdate({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default ({ markers, handleOnClick }: Props) => {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={1}
      scrollWheelZoom={true}
      className="mb-5"
    >
      <TileLayer
        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.svg"
      />
      {handleOnClick && <LocationMarker handleUpdate={handleOnClick} />}
      {markers?.length &&
        markers.map(({ position, label }) => (
          <Marker position={[position.latitude, position.longitude]}>
            {label && (
              <Tooltip direction="bottom" offset={[-15, 20]} permanent>
                {label}
              </Tooltip>
            )}
          </Marker>
        ))}
    </MapContainer>
  );
};
