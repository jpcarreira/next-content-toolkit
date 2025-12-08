// src/utils/date.ts
function formatDate(date, options = {
  year: "numeric",
  month: "long",
  day: "numeric"
}) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", options);
}
function formatDateShort(date) {
  return formatDate(date, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function getRelativeTime(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = /* @__PURE__ */ new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1e3 * 60 * 60 * 24));
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

export { formatDate, formatDateShort, getRelativeTime };
//# sourceMappingURL=date.mjs.map
//# sourceMappingURL=date.mjs.map