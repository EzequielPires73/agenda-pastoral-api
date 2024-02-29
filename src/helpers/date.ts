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

export function formattedDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é base 0, então adicionamos 1 e ajustamos o formato
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
}