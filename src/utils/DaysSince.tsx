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