import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

export default function WorldMap({ onSelect }) {
  // custom marker style
  const regionIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  const regions = [
    { id: "US", position: [38, -77] },     // Virginia
    { id: "EU", position: [50, 10] },      // Frankfurt
    { id: "Asia", position: [1, 103] },    // Singapore
  ];

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {regions.map((r) => (
        <Marker
          key={r.id}
          position={r.position}
          icon={regionIcon}
          eventHandlers={{
            click: () => onSelect(r.id),
          }}
        >
          <Popup>{r.id} region</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

