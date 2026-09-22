import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
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

const endIcon = new L.DivIcon({
  html: '<div style="background-color: #ef4444; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const BookingMapTracking = ({ bookingId, onClose }) => {
  const [trackingPoints, setTrackingPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const response = await axiosInstance.get(`${ENDPOINTS.TRACKING}?booking_id=${bookingId}`);
        if (response.data.Success) {
          setTrackingPoints(response.data.Markers || []);
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

    fetchTrackingData();
  }, [bookingId]);

  // Extract coordinates for Polyline
  const positions = trackingPoints.map(point => [point.latitude, point.longitude]);
  
  // Center map on the latest point, or default to a generic location
  const center = positions.length > 0 ? positions[positions.length - 1] : [20.5937, 78.9629]; // Default to India

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[9999]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl flex flex-col h-[80vh]" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Booking Tracking: #{bookingId}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors text-2xl font-bold leading-none"
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
                <p className="text-sm">The technician hasn't shared their location for this booking yet.</p>
              </div>
            </div>
          )}

          {!loading && trackingPoints.length > 0 && (
            <div className="h-full w-full rounded border overflow-hidden">
              <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Draw the path */}
                {positions.length > 1 && (
                  <Polyline positions={positions} color="#11A8A4" weight={4} opacity={0.7} />
                )}

                {/* Draw markers for start and end if we have points */}
                {positions.length > 0 && (
                  <>
                    <Marker position={positions[0]} icon={startIcon}>
                      <Popup>
                        <div className="font-bold">Start Location</div>
                        <div className="text-xs text-gray-500">
                          {new Date(trackingPoints[0].timestamp).toLocaleString()}
                        </div>
                      </Popup>
                    </Marker>

                    {positions.length > 1 && (
                      <Marker position={positions[positions.length - 1]} icon={endIcon}>
                        <Popup>
                          <div className="font-bold text-[#11A8A4]">Current / End Location</div>
                          <div className="text-xs text-gray-500">
                            {new Date(trackingPoints[trackingPoints.length - 1].timestamp).toLocaleString()}
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </>
                )}
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingMapTracking;
