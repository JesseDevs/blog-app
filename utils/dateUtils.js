export const formattedDate = (dateString) => {
	const options = { month: 'short', day: 'numeric', year: 'numeric' };
	const date = new Date(dateString);
	return date.toLocaleDateString(undefined, options);
};

export const formatTime = (timeString) => {
	const time = new Date(`2000-01-01T${timeString}Z`);
	const localTime = new Date(
		time.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
	);
	const hours = localTime.getHours();
	const minutes = localTime.getMinutes();
	const period = hours >= 12 ? 'pm' : 'am';
	const formattedHours = hours % 12 || 12;
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
	return `${formattedHours}:${formattedMinutes} ${period}`;
};
