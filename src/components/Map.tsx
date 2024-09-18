import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

import { customMapStyle } from "@/constants/map-style";

type MapProps = {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  };
  markers: {
    title: string;
    latitude: number;
    longitude: number;
  }[];
};

export default function Map({ region, markers }: MapProps) {
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="flex-1"
      region={{
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: region.latitudeDelta || 0.01,
        longitudeDelta: region.longitudeDelta || 0.01,
      }}
      scrollEnabled={false}
      rotateEnabled={false}
      zoomEnabled={false}
      customMapStyle={customMapStyle}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
        />
      ))}
    </MapView>
  );
}
