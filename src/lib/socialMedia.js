import { Facebook, Instagram, Twitter, Linkedin, Youtube, Globe } from "lucide-react";

// Known platforms with the domains we detect them from and the icon to show.
const PLATFORMS = [
  {
    key: "facebook",
    label: "Facebook",
    icon: Facebook,
    patterns: ["facebook.com", "fb.com", "fb.me", "fb.watch"],
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: Instagram,
    patterns: ["instagram.com", "instagr.am"],
  },
  {
    key: "twitter",
    label: "Twitter / X",
    icon: Twitter,
    patterns: ["twitter.com", "x.com", "t.co"],
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    patterns: ["linkedin.com", "lnkd.in"],
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: Youtube,
    patterns: ["youtube.com", "youtu.be"],
  },
];

const WEBSITE = { key: "website", label: "Website", icon: Globe };

// Detect the platform key ("facebook", "instagram", ...) from a URL.
// Falls back to "website" for anything we don't recognize.
export function detectPlatform(url) {
  if (!url || typeof url !== "string") return WEBSITE.key;
  const lower = url.toLowerCase();
  for (const p of PLATFORMS) {
    if (p.patterns.some((pat) => lower.includes(pat))) return p.key;
  }
  return WEBSITE.key;
}

// Get platform metadata from either a platform key or a raw URL.
export function getPlatformMeta(platformOrUrl) {
  const key = PLATFORMS.some((p) => p.key === platformOrUrl)
    ? platformOrUrl
    : detectPlatform(platformOrUrl);
  return PLATFORMS.find((p) => p.key === key) || WEBSITE;
}

// Convenience: get just the icon component for a platform key or URL.
export function getSocialIcon(platformOrUrl) {
  return getPlatformMeta(platformOrUrl).icon;
}
