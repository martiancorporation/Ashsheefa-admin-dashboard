// console.log(BASE_URL);

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

//**************** * AUTH ENDPOINTS ***************
export const authEndpoints = {
  SIGNUP_API: BASE_URL + "/v1/auth/signup",
  LOGIN_API: BASE_URL + "/v1/auth/login",
  REFRESH_TOKEN: BASE_URL + "/v1/auth/refresh-token/",
  RESEND_OTP_API: BASE_URL + "/v1/auth/resend-otp",
  FORGET_PASSWORD_API: BASE_URL + "/v1/auth/forget-password",
  UPDATE_PASSWORD: BASE_URL + "/v1/auth/update-password",
  UPDATE_ADMIN_DETAILS_API: BASE_URL + "/v1/auth/update-admin-details",
  CHANGE_EMAIL_INITIATE: BASE_URL + "/v1/auth/change-email-initiate",
  VERIFY_EMAIL: BASE_URL + "/v1/auth/verify-email",
};

//**************** * ENQUIRY ENDPOINTS ***************
export const enquiryEndpoints = {
  GET_ALL_ENQUIRY_USER_API:
    BASE_URL + "/v1/dashboard/enquiry/get_all_enquiry_data",
  GET_ALL_PATIENTS_ENQUIRY_API:
    BASE_URL + "/v1/dashboard/patients_enquiry/get_all_patients_enquiry_data",
  ADD_PATIENTS_ENQUIRY_API:
    BASE_URL + "/v1/dashboard/patients_enquiry/add_patients_enquiry",
};

//**************** * DASHBOARD ENDPOINTS ***************
export const dashboardEndpoints = {
  GET_ALL_DASHBOARD_DATA_API:
    BASE_URL + "/v1/dashboard/get_dashboard_statistics",
};

//**************** * DASHBOARD ROUTES (Authentication Required) ***************

// Dashboard Blogs Endpoints
export const dashboardBlogEndpoints = {
  GET_ALL_BLOG_DATA_API: BASE_URL + "/v1/dashboard/blogs/get-all-blogs-data",
  ADD_BLOG_API: BASE_URL + "/v1/dashboard/blogs/add-blog",
  GET_BLOG_DETAILS_API: BASE_URL + "/v1/dashboard/blogs/get-blog-details",
  GET_BLOG_DETAILS_BY_URL_API:
    BASE_URL + "/v1/dashboard/blogs/get-blog-details-by-url",
  UPDATE_BLOG_API: BASE_URL + "/v1/dashboard/blogs/update-blog",
  DELETE_BLOG_API: BASE_URL + "/v1/dashboard/blogs/delete-blog",
};

// Dashboard News Endpoints
export const dashboardNewsEndpoints = {
  GET_ALL_NEWS_DATA_API: BASE_URL + "/v1/dashboard/news/get_all_news",
  ADD_NEWS_API: BASE_URL + "/v1/dashboard/news/add_news",
  GET_NEWS_BY_ID_API: BASE_URL + "/v1/dashboard/news/get_news_by_id",
  UPDATE_NEWS_API: BASE_URL + "/v1/dashboard/news/update_news",
  DELETE_NEWS_API: BASE_URL + "/v1/dashboard/news/delete_news",
  GET_FEATURED_NEWS_API: BASE_URL + "/v1/dashboard/news/get_featured_news",
  GET_NEWS_BY_CHANNEL_API: BASE_URL + "/v1/dashboard/news/get_news_by_channel",
  GET_NEWS_STATS_API: BASE_URL + "/v1/dashboard/news/get_news_stats",
};

// Dashboard Health Checkup Endpoints
export const dashboardHealthCheckupEndpoints = {
  GET_ALL_HEALTH_CHECKUPS_API:
    BASE_URL + "/v1/dashboard/health_checkup/get_all_health_checkups",
  ADD_HEALTH_CHECKUP_API:
    BASE_URL + "/v1/dashboard/health_checkup/add_health_checkup",
  GET_HEALTH_CHECKUP_BY_ID_API:
    BASE_URL + "/v1/dashboard/health_checkup/get_health_checkup_by_id",
  UPDATE_HEALTH_CHECKUP_API:
    BASE_URL + "/v1/dashboard/health_checkup/update_health_checkup",
  DELETE_HEALTH_CHECKUP_API:
    BASE_URL + "/v1/dashboard/health_checkup/delete_health_checkup",
  GET_FEATURED_HEALTH_CHECKUPS_API:
    BASE_URL + "/v1/dashboard/health_checkup/get_featured_health_checkups",
  GET_HEALTH_CHECKUP_STATS_API:
    BASE_URL + "/v1/dashboard/health_checkup/get_health_checkup_stats",
};

// Dashboard Doctors Endpoints
export const dashboardDoctorEndpoints = {
  GET_ALL_DOCTORS_DATA_API:
    BASE_URL + "/v1/dashboard/doctors/get_all_doctors_data",
  ADD_DOCTOR_DATA_API: BASE_URL + "/v1/dashboard/doctors/add_doctor_data",
  GET_DOCTOR_BY_ID_API: BASE_URL + "/v1/dashboard/doctors",
  UPDATE_DOCTOR_DATA_API: BASE_URL + "/v1/dashboard/doctors/update_doctor_data",
  DELETE_DOCTOR_DATA_API: BASE_URL + "/v1/dashboard/doctors/delete_doctor_data",
  UPDATE_DOCTOR_AVAILABILITY_API: BASE_URL + "/v1/dashboard/doctors",
  GET_DOCTORS_BY_DEPARTMENT_API: BASE_URL + "/v1/dashboard/doctors/department",
  GET_DOCTORS_STATS_API: BASE_URL + "/v1/dashboard/doctors/stats/overview",
};

// Dashboard International Patient APIs (Always Authenticated)
export const INTERNATIONAL_PATIENT_API = {
  GET_ALL_INTERNATIONAL_PATIENTS:
    BASE_URL +
    "/v1/dashboard/international_patient/get_all_international_patients",
  ADD_INTERNATIONAL_PATIENT:
    BASE_URL + "/v1/dashboard/international_patient/add_international_patient",
  GET_INTERNATIONAL_PATIENT_BY_ID:
    BASE_URL +
    "/v1/dashboard/international_patient/get_international_patient_by_id",
  UPDATE_INTERNATIONAL_PATIENT:
    BASE_URL +
    "/v1/dashboard/international_patient/update_international_patient",
  DELETE_INTERNATIONAL_PATIENT:
    BASE_URL +
    "/v1/dashboard/international_patient/delete_international_patient",
  GET_INTERNATIONAL_PATIENT_STATS:
    BASE_URL +
    "/v1/dashboard/international_patient/get_international_patient_stats",
  GET_PATIENTS_BY_SPECIALITY:
    BASE_URL + "/v1/dashboard/international_patient/get_patients_by_speciality",
};

// Dashboard Patients Enquiry APIs (Always Authenticated)
export const PATIENTS_ENQUIRY_API = {
  GET_ALL_PATIENTS_ENQUIRY_API:
    BASE_URL + "/v1/dashboard/patients_enquiry/get_all_patients_enquiry_data",
  ADD_PATIENTS_ENQUIRY_API:
    BASE_URL + "/v1/dashboard/patients_enquiry/add_patients_enquiry",
  GET_PATIENTS_ENQUIRY_STATS:
    BASE_URL + "/v1/dashboard/patients_enquiry/get_patients_enquiry_stats",
};

// Dashboard Appointments APIs (Always Authenticated)
export const APPOINTMENTS_API = {
  GET_ALL_APPOINTMENTS:
    BASE_URL + "/v1/dashboard/patient_appointment/get_all_patients_data",
  ADD_APPOINTMENT:
    BASE_URL + "/v1/dashboard/patient_appointment/add_patients_data",
  GET_APPOINTMENT_BY_ID:
    BASE_URL + "/v1/dashboard/patient_appointment/get_patient_data",
  UPDATE_APPOINTMENT:
    BASE_URL + "/v1/dashboard/patient_appointment/update_patients_data",
  DELETE_APPOINTMENT:
    BASE_URL + "/v1/dashboard/patient_appointment/delete_patients_data",
};

// Dashboard Patients APIs (Always Authenticated)
export const PATIENTS_API = {
  GET_ALL_PATIENTS: BASE_URL + "/v1/dashboard/patients/get_all_patients_data",
  ADD_PATIENT: BASE_URL + "/v1/dashboard/patients/add_patients_data",
  GET_PATIENT_BY_ID: BASE_URL + "/v1/dashboard/patients/get_patient_data",
  GET_PATIENT_DATA_BY_ID:
    BASE_URL + "/v1/dashboard/patients/get_patients_data_by_id",
  UPDATE_PATIENT: BASE_URL + "/v1/dashboard/patients/update_patients_data",
  DELETE_PATIENT: BASE_URL + "/v1/dashboard/patients/delete_patient_data",
  UPLOAD_LAB_REPORT: BASE_URL + "/v1/dashboard/patients/upload_lab_report",
  GET_LAB_REPORTS: BASE_URL + "/v1/dashboard/patients/get_lab_reports",
  DELETE_LAB_REPORT: BASE_URL + "/v1/dashboard/patients/delete_lab_report",
  UPLOAD_PRESCRIPTION: BASE_URL + "/v1/dashboard/patients/upload_prescription",
  GET_PRESCRIPTIONS: BASE_URL + "/v1/dashboard/patients/get_prescriptions",
  DELETE_PRESCRIPTION: BASE_URL + "/v1/dashboard/patients/delete_prescription",
  GET_PATIENT_DOCUMENTS:
    BASE_URL + "/v1/dashboard/patients/get_patient_documents",
};

// Dashboard Departments APIs (Always Authenticated)
export const dashboardDepartmentEndpoints = {
  GET_ALL_DEPARTMENTS_API:
    BASE_URL + "/v1/dashboard/departments/get-all-departments",
  ADD_DEPARTMENT_API: BASE_URL + "/v1/dashboard/departments/add-department",
  GET_DEPARTMENT_BY_ID_API:
    BASE_URL + "/v1/dashboard/departments/get-department",
  UPDATE_DEPARTMENT_API:
    BASE_URL + "/v1/dashboard/departments/update-department",
  DELETE_DEPARTMENT_API:
    BASE_URL + "/v1/dashboard/departments/delete-department",
};
