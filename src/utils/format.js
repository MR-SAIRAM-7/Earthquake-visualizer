/**
 * Enhanced utility functions for formatting earthquake data
 */

/**
 * Format Unix timestamp to readable date/time with enhanced formatting.
 * Shows "x minutes/hours/days ago" for recent quakes,
 * and a formatted date for older ones.
 * @param {number} epochMs - Unix timestamp in milliseconds
 * @returns {string} Formatted date string
 */
export function formatEpoch(epochMs) {
  if (!epochMs || typeof epochMs !== "number") return "Unknown";

  const date = new Date(epochMs);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // Relative for recent quakes
  if (diffHours < 1) {
    const minutes = Math.floor(diffMs / (1000 * 60));
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    const hours = Math.floor(diffHours);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (diffDays < 7) {
    const days = Math.floor(diffDays);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  // Absolute formatted date for older quakes
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short"
  };

  return date.toLocaleDateString("en-US", options);
}

/**
 * Format magnitude with appropriate precision and descriptive text
 * @param {number} mag - Earthquake magnitude
 * @returns {object} { value, description, severity, color }
 */
export function formatMagnitude(mag) {
  if (typeof mag !== "number") {
    return { value: "N/A", description: "Unknown", severity: "unknown", color: "#6b7280" };
  }

  const value = `M ${mag.toFixed(1)}`;
  let description, severity, color;

  if (mag >= 8.0) {
    description =
      "Great — Can cause serious damage in areas several hundred miles across.";
    severity = "catastrophic";
    color = "#7f1d1d"; // red-900
  } else if (mag >= 7.0) {
    description = "Major — Can cause serious damage over larger areas.";
    severity = "severe";
    color = "#b91c1c"; // red-700
  } else if (mag >= 6.0) {
    description = "Strong — May cause severe damage in populated areas.";
    severity = "strong";
    color = "#dc2626"; // red-600
  } else if (mag >= 5.0) {
    description = "Moderate — Can cause damage to poorly constructed buildings.";
    severity = "moderate";
    color = "#facc15"; // yellow-400
  } else if (mag >= 4.0) {
    description = "Light — Noticeable shaking of indoor items, rattling noises.";
    severity = "light";
    color = "#84cc16"; // lime-500
  } else if (mag >= 3.0) {
    description = "Minor — Often felt, but rarely causes damage.";
    severity = "minor";
    color = "#22c55e"; // green-500
  } else if (mag >= 2.0) {
    description = "Very minor — Usually not felt, but recorded by seismographs.";
    severity = "very minor";
    color = "#2dd4bf"; // teal-400
  } else {
    description = "Micro — Not felt by people.";
    severity = "micro";
    color = "#3b82f6"; // blue-500
  }

  return { value, description, severity, color };
}
