export const formattedDate = (dateString) => {
	const options = { month: 'short', day: 'numeric', year: 'numeric' };
	const date = new Date(dateString);
	return date.toLocaleDateString(undefined, options);
};

export const formatTime = (timeString) => {
	const time = new Date(`2000-01-01T${timeString}`);
	const hours = time.getHours();
	const minutes = time.getMinutes();
	const period = hours >= 12 ? 'pm' : 'am';
	const formattedHours = hours % 12 || 12;
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
	return `${formattedHours}:${formattedMinutes} ${period}`;
};
