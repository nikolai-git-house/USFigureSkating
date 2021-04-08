export function meridian(date: Date): string {
    let hours = date.getHours();
    if (hours >= 12) {
        return "PM";
    }
    return "AM";
}

export function twelveHourHour(date: Date): number {
    let hours = date.getHours();
    if (hours > 12) {
        hours = hours - 12;
    }
    else if (hours == 0) {
        hours = 12;
    }
    return hours;
}

export function prettyTime(date: Date): string {
    return twelveHourHour(date) + ":" + fullMinutes(date);
}

export function fullMinutes(date: Date): string {
    let minutes = date.getMinutes();
    let pretty_minutes = String(minutes);
    if (minutes < 10) {
        pretty_minutes = "0" + pretty_minutes;
    }
    return pretty_minutes;
}

export function hoursMinutes(date: Date): string {
    return twelveHourHour(date) + ":" + fullMinutes(date);
}

export function DateFormat(date: Date): string {
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
}

/**
 * Format a UTC date as M/D
 */
export function UTCDateFormatNoYear(date: Date): string {
    return date.getUTCMonth() + 1 + "/" + date.getUTCDate();
}

export function TwoDigitYear(date: Date): string {
    return String(date.getFullYear()).substring(2);
}

export function DateFormatAbridgedYear(date: Date): string {
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + TwoDigitYear(date);
}

/**
 * Format a date in MM/DD/YYYY format
 */
export function FormInputDate(date: Date): string {
    const value = [];
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    value.push(String(month));
    if (month < 10) {
        value[0] = "0" + value[0];
    }
    value.push(String(day));
    if (day < 10) {
        value[1] = "0" + value[1];
    }
    value.push(year);
    return value.join('/');
}