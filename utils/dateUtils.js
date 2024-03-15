export const formattedDate = (dateString) => {
	const options = { month: 'short', day: 'numeric', year: 'numeric' };
	const date = new Date(dateString);
	return date.toLocaleDateString(undefined, options);
};
export const formatTime = (timeString) => {
	const time = new Date(`2000-01-01T${timeString}Z`);
	const options = {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
		timeZone: 'America/Los_Angeles',
	};
	return time.toLocaleTimeString('en-US', options);
};

export const formatTimeNew = (timeString) => {
	const [hours, minutes, seconds] = timeString.split(':');
	const date = new Date();
	date.setHours(hours);
	date.setMinutes(minutes);
	date.setSeconds(seconds);

	return date.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
};
