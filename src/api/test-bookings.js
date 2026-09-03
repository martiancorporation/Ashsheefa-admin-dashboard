import { apiConnector, handleResponse } from "./core";
import { TEST_BOOKINGS_API } from "./apis";

const { GET_ALL, GET_BY_ID, UPDATE, RESCHEDULE, DELETE } = TEST_BOOKINGS_API;

// Paginated list with filters: search, test_status, paymentStatus,
// from_date, to_date, page, limit.
const getAllBookings = async (params) => {
  let response = null;
  try {
    response = await apiConnector("GET", GET_ALL, null, null, params);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

// Counter booking — no payment gateway; it lands unpaid for Mark as Paid.
const addBookingByAdmin = async (data) => {
  let response = null;
  try {
    response = await apiConnector("POST", GET_ALL, data);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

// Bookable tests and their prices. The server prices bookings from this same
// list and refuses a name that isn't in it, so the picker has to come from here.
const getTestRates = async () => {
  let response = null;
  try {
    response = await apiConnector("GET", `${GET_ALL}/test-rates`);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const getBookingById = async (id) => {
  let response = null;
  try {
    response = await apiConnector("GET", `${GET_BY_ID}/${id}`);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

// Edit, change test status, or mark as paid.
const updateBooking = async (id, data) => {
  let response = null;
  try {
    response = await apiConnector("PUT", `${UPDATE}/${id}`, data);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

// Postpone: the new date becomes the booking's date, the old one is kept in
// reschedule_history by the backend.
const rescheduleBooking = async (id, data) => {
  let response = null;
  try {
    response = await apiConnector("PUT", `${RESCHEDULE}/${id}/reschedule`, data);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const deleteBooking = async (id) => {
  let response = null;
  try {
    response = await apiConnector("DELETE", `${DELETE}/${id}`);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

export default {
  getAllBookings,
  addBookingByAdmin,
  getTestRates,
  getBookingById,
  updateBooking,
  rescheduleBooking,
  deleteBooking,
};
