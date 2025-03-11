function truncate(text, limit = 40) {
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}
function date(date2) {
  return new Date(date2).toLocaleDateString("en", {
    dateStyle: "medium"
  });
}
export {
  date as d,
  truncate as t
};
