import { useState } from "react";

const FALLBACK_SRC = "/assets/images/doctor/avatar.svg";

/**
 * Doctor profile picture with a guaranteed fallback.
 *
 * Stored profilePic urls can point at objects that no longer exist in Spaces
 * (older rows were orphaned by the update bug in DoctorController.UpdateDoctor).
 * A bare <img> renders those as the browser's broken-image glyph, so fall back
 * to the local avatar on both an empty url and a failed load.
 */
export default function DoctorAvatar({
  src,
  alt,
  className = "",
  fallbackClassName = "",
}) {
  // Remember which url failed rather than a bare flag, so a different doctor or
  // a freshly uploaded photo is retried without needing a reset effect.
  const [failedSrc, setFailedSrc] = useState(null);

  const showFallback = !src || failedSrc === src;

  return (
    <img
      src={showFallback ? FALLBACK_SRC : src}
      alt={alt || "Doctor"}
      className={showFallback ? fallbackClassName || className : className}
      onError={showFallback ? undefined : () => setFailedSrc(src)}
    />
  );
}
