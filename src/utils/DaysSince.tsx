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

 
 
export const formatDayOfWeekAbbrevMonth = (dateString, { locale = "en-US" } = {}) => {
  if (!dateString) return "";           
  const date = new Date(dateString);
  if (isNaN(date)) return "";           

  const weekday = date.toLocaleString(locale, { weekday: "long" }); 
  const shortMonth = date.toLocaleString(locale, { month: "short" });  
  const day = date.getDate(); // 5

  return `${weekday}, ${shortMonth} ${day}`; 
};
