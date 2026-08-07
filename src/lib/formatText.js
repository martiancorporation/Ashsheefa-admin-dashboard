// Helpers for adding a prefix/suffix to a free-text value *once*.
//
// Several fields (referring doctor, experience, fees) are free-text, so admins
// often type the title/unit themselves — "Dr. Sen", "10 years", "₹500". Code
// that blindly prepends "Dr. " or appends " years" then renders "Dr. Dr. Sen"
// or "10 years years". These strip whatever is already there before adding it
// back, so the result is correct either way.

// `\b` after the title keeps real names safe: "Drishti" is not "Dr" + "ishti".
const DOCTOR_TITLE_RE = /^\s*(dr|doctor)\b\.?\s*/i;
const YEARS_SUFFIX_RE = /\s*\b(years?|yrs?)\b\.?\s*$/i;
const RUPEE_PREFIX_RE = /^\s*(₹|rs\.?|inr)\s*/i;

/** "Dr. Sen" → "Sen" · "Dr. Dr. Sen" → "Sen" · "Drishti" → "Drishti" */
export const stripDoctorTitle = (name) => {
  if (!name) return "";
  let bare = String(name).trim();
  // Loop: a name typed as "Dr. Dr. Sen" gets fully cleaned.
  while (DOCTOR_TITLE_RE.test(bare)) bare = bare.replace(DOCTOR_TITLE_RE, "");
  return bare.trim();
};

// The house style for the title is "DR." — uppercase, one dot.
const DOCTOR_TITLE = "DR.";

/**
 * Collapse a repeated title into one and standardise its spacing/casing to
 * "DR.". A title is never *added* — if the admin didn't type one, the name is
 * left exactly as it is.
 *
 *   "Dr. Dr. Sen" → "DR. Sen"   ·   "dr.  dr Sen" → "DR. Sen"
 *   "Dr. Sen"     → "DR. Sen"   ·   "Sen"         → "Sen"
 *   "Doctor Sen"  → "DR. Sen"   ·   "Drishti Roy" → "Drishti Roy"
 *
 * Used both when saving a doctor (so stored names are clean) and at every
 * place a doctor name is rendered (so names already stored badly can't show
 * the duplicate either).
 */
export const dedupeDoctorTitle = (name) => {
  if (!name) return "";
  const text = String(name).trim().replace(/\s+/g, " ");

  if (!DOCTOR_TITLE_RE.test(text)) return text; // no title typed — leave alone

  const bare = stripDoctorTitle(text);
  return bare ? `${DOCTOR_TITLE} ${bare}` : DOCTOR_TITLE;
};

/** "10" → "10 years" · "10 years" → "10 years" · "10 yrs" → "10 yrs" */
export const withYears = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const text = String(value).trim();
  if (!text) return "";
  return YEARS_SUFFIX_RE.test(text) ? text : `${text} years`;
};

/** "500" → "₹ 500" · "₹500" → "₹ 500" · "Rs. 500" → "₹ 500" */
export const withRupee = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const bare = String(value).replace(RUPEE_PREFIX_RE, "").trim();
  return bare ? `₹ ${bare}` : "";
};
