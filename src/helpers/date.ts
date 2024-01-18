export function isValidDateFormat(dateString: string): boolean {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateFormatRegex.test(dateString);
}

export function isValidTimeFormat(timeString: string): boolean {
    const timeFormatRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return timeFormatRegex.test(timeString);
}

export function isValidTimeRange(start: string, end: string): boolean {
    if (!isValidTimeFormat(start) || !isValidTimeFormat(end)) {
        return false;
    }

    const startDate = new Date(`1970-01-01T${start}`);
    const endDate = new Date(`1970-01-01T${end}`);

    return startDate.getTime() < endDate.getTime();
}