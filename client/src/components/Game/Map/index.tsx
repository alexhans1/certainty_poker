import React, { ReactNode, useState } from "react";
import { latLngBounds } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Tooltip,
  FeatureGroup,
  useMap,
} from "react-leaflet";
import { equals } from "ramda";
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

  return position && <Marker position={position} />;
}

function MarkerContainer({
  children,
  markers,
}: {
  children: ReactNode;
  markers: Marker[];
}) {
  const map = useMap();
  const bounds = latLngBounds([]);
  markers?.forEach((data) => {
    bounds.extend([data.position.latitude, data.position.longitude]);
  });
  bounds.isValid() &&
    map.flyToBounds(bounds, {
      padding: [10, 10],
      maxZoom: markers.length > 1 ? 15 : 5,
    });

  return <FeatureGroup>{children}</FeatureGroup>;
}

export default React.memo(
  ({ markers = [], handleOnClick }: Props) => {
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
        {markers.length && (
          <MarkerContainer markers={markers}>
            {markers.map(({ position, label }) => (
              <Marker
                position={[position.latitude, position.longitude]}
                key={position.latitude}
              >
                {label && (
                  <Tooltip direction="bottom" offset={[-15, 20]} permanent>
                    {label}
                  </Tooltip>
                )}
              </Marker>
            ))}
          </MarkerContainer>
        )}
      </MapContainer>
    );
  },
  (prevProps, nextProps) => equals(prevProps.markers, nextProps.markers)
);
