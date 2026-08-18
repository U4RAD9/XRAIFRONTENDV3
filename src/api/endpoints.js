export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  FORGET_MPIN: '/auth/forget_mpin',
  VERIFY_OTP: '/auth/verify_otp',
  UPDATE_PASSWORD: '/auth/update_password',
  
  // Booking
  DASHBOARD_STATS: '/booking/dashboard_stats',
  ALL_BOOKINGS: '/booking/all_bookings',
  TECHNICIAN_BOOKINGS: '/booking/technician_bookings',
  GET_SLOTS: '/booking/get_slots',
  GET_SERVICES: '/booking/get_services',
  GET_PRICE: '/booking/get_price',
  SAVE_BOOKING: '/booking/save',
  UPDATE_BOOKING: '/booking/update',
  LAST_BOOKING: '/booking/get_last_booking',
  BOOKING_DETAILS: '/booking/details',
  UPLOAD_FILE: '/booking/upload_file',
  UPLOAD_PRESCRIPTION: '/booking/upload_prescription',
  UPDATE_BOOKING_STATUS: '/booking/update_booking_status',
  UPDATE_PAYMENT_STATUS: '/booking/update_payment_status',
  
  // Masters
  LOCATIONS: '/locations/',
  SERVICE_GROUPS: '/service-groups/',
  SERVICES: '/services/',
  OFFER_MASTER: '/offer-master/',
  OFFER_LOCATIONS: '/offer-locations/',
  OFFER_SERVICE_GROUPS: '/offer-service-groups/',
  PRICE_RATE_MASTER: '/price-rate-master/',
  PRICE_RATE_MASTER_LOCATIONS: '/price-rate-master-locations/',
  USER_TYPES: '/user-types/',
  VISIT_TYPE_MASTER: '/visit-type-master/',
  SLOT_MASTER: '/slot-master/',
  USERS: '/users/',
  PATIENTS: '/patients/',
};
