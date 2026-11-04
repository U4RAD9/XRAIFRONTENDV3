import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const startIcon = new L.DivIcon({
  html: '<div style="background-color: #22c55e; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const liveIcon = new L.DivIcon({
  html: '<div style="position: relative; width: 24px; height: 24px;"><div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: #00acc1; opacity: 0.5; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div><div style="position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #008ba3; border: 3px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.5);"></div></div>',
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Auto-pan the map when new live coordinates arrive
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom() < 14 ? 14 : map.getZoom());
    }
  }, [center?.[0], center?.[1]]);
  return null;
}

const BookingMapTracking = ({ bookingId, onClose }) => {
  const [trackingPoints, setTrackingPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const response = await axiosInstance.get(`${ENDPOINTS.TRACKING}?booking_id=${bookingId}`);
        if (response.data.Success) {
          const markers = response.data.Markers || [];
          setTrackingPoints(markers);
          if (markers.length > 0) {
            setLastUpdated(new Date().toLocaleTimeString());
          }
        } else {
          setError(response.data.Message || 'Failed to fetch tracking data');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchTrackingData();

    // Set up polling every 10 seconds for real-time live location
    const intervalId = setInterval(fetchTrackingData, 10000);

    return () => clearInterval(intervalId);
  }, [bookingId]);

  // Filter coordinates: smooth out duplicate stationary points and initial coarse jumps
  const cleanedPoints = [];
  for (let i = 0; i < trackingPoints.length; i++) {
    const pt = trackingPoints[i];
    if (!pt || pt.latitude == null || pt.longitude == null) continue;
    
    // Ignore invalid zero coordinates
    if (Math.abs(pt.latitude) < 0.0001 && Math.abs(pt.longitude) < 0.0001) continue;

    if (cleanedPoints.length === 0) {
      cleanedPoints.push(pt);
    } else {
      const prev = cleanedPoints[cleanedPoints.length - 1];
      const latDiff = Math.abs(pt.latitude - prev.latitude);
      const lngDiff = Math.abs(pt.longitude - prev.longitude);
      // ~0.0001 deg is approx 11-12 meters.
      // Only record a new path vertex if movement exceeds ~12 meters
      if (latDiff > 0.0001 || lngDiff > 0.0001) {
        // If there's an anomalous single jump of > 600m from point 0 to point 1, point 0 was a stale cache/cell-tower
        if (cleanedPoints.length === 1 && (latDiff > 0.005 || lngDiff > 0.005)) {
          cleanedPoints[0] = pt;
        } else {
          cleanedPoints.push(pt);
        }
      }
    }
  }

  // Positions for Polyline & markers
  const positions = cleanedPoints.length > 0 
    ? cleanedPoints.map(p => [p.latitude, p.longitude])
    : (trackingPoints.length > 0 ? [[trackingPoints[trackingPoints.length - 1].latitude, trackingPoints[trackingPoints.length - 1].longitude]] : []);
  
  // Center map on the latest current position, or default to India
  const center = positions.length > 0 ? positions[positions.length - 1] : [20.5937, 78.9629];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[9999]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl flex flex-col h-[80vh]" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-3">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Technician Live Tracking: #{bookingId}</h2>
            {trackingPoints.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live GPS Active
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors text-2xl font-bold leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow p-4 relative">
          {loading && (
            <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white bg-opacity-75">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#11A8A4]"></div>
            </div>
          )}

          {error && !loading && (
            <div className="absolute inset-0 z-[1000] flex items-center justify-center">
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded text-center">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && trackingPoints.length === 0 && (
            <div className="absolute inset-0 z-[1000] flex items-center justify-center">
              <div className="bg-gray-100 text-gray-600 px-6 py-4 rounded text-center shadow-inner">
                <p className="font-bold mb-2">No Tracking Data Available</p>
                <p className="text-sm">The technician hasn't started tracking for this booking yet.</p>
              </div>
            </div>
          )}

          {!loading && trackingPoints.length > 0 && (
            <div className="h-full w-full rounded border overflow-hidden relative">
              <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
                <MapRecenter center={center} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Draw the traveled path */}
                {positions.length > 1 && (
                  <Polyline positions={positions} color="#00acc1" weight={4} opacity={0.8} />
                )}

                {/* Start location marker (if multiple points) */}
                {positions.length > 1 && (
                  <Marker position={positions[0]} icon={startIcon}>
                    <Popup>
                      <div className="font-bold text-gray-800">Trip Started</div>
                      <div className="text-xs text-gray-500">
                        {new Date(trackingPoints[0].timestamp).toLocaleTimeString()}
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Current live location (always on the latest position) */}
                <Marker position={positions[positions.length - 1]} icon={liveIcon}>
                  <Popup>
                    <div className="font-bold text-[#008ba3]">📍 Current Live Location</div>
                    <div className="text-xs text-gray-600 font-semibold mt-0.5">
                      Updated: {new Date(trackingPoints[trackingPoints.length - 1].timestamp).toLocaleTimeString()}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>

              {/* Real-time sync badge */}
              <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-md shadow-md text-xs text-gray-700 border border-gray-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Auto-refreshing live every 10s</span>
                {lastUpdated && <span className="text-gray-400">| Last sync: {lastUpdated}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingMapTracking;
