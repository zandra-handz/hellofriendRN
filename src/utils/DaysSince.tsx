export const daysSincedDateField = (date) => {
    const meetDate = new Date(date);
const today = new Date();

// Zero out hours to avoid timezone issues
meetDate.setHours(0,0,0,0);
today.setHours(0,0,0,0);

const msPerDay = 1000 * 60 * 60 * 24;
const daysAgo = Math.floor((today - meetDate) / msPerDay);

return daysAgo;
 
}

 
 // date not matching backend
// export const formatDayOfWeekAbbrevMonth = (dateString, { locale = "en-US" } = {}) => {
//   console.log(dateString);
//   if (!dateString) return "";           
//   const date = new Date(dateString);
//   if (isNaN(date)) return "";           

//   const weekday = date.toLocaleString(locale, { weekday: "long" }); 
//   const shortMonth = date.toLocaleString(locale, { month: "short" });  
//   const day = date.getDate(); // 5

//   return `${weekday}, ${shortMonth} ${day}`; 
// };

export const formatDayOfWeekAbbrevMonth = (dateString, { locale = "en-US" } = {}) => {
  if (!dateString) return "";           

  // Parse YYYY-MM-DD as local date
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed

  const weekday = date.toLocaleString(locale, { weekday: "long" }); 
  const shortMonth = date.toLocaleString(locale, { month: "short" });  

  return `${weekday}, ${shortMonth} ${day}`; 
};
