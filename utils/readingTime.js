// filters/readingTime.js

export default function readingTimeFilter(content) {
	// Average reading speed in words per minute
	const wordsPerMinute = 200;

	// Count the number of words in the content
	const wordCount = content.split(/\s+/).length;

	// Calculate the reading time in minutes
	const minutes = Math.ceil(wordCount / wordsPerMinute);

	return `${minutes} min read`;
}
