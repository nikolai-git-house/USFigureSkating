export function YearOptions() {
    let result = [];
    let now = new Date().getFullYear();
    for (let i = 0; i < 11; i++) {
        result.push({
            label: now + i,
            value: now + i
        });
    }

    result.unshift({
        label: "Year",
        value: null
    });
    return result;
}

export const MonthOptions = [
    {
        label: "Month",
        value: null
    },
    {
        label: "01",
        value: 1
    },
    {
        label: "02",
        value: 2
    },
    {
        label: "03",
        value: 3
    },
    {
        label: "04",
        value: 4
    },
    {
        label: "05",
        value: 5
    },
    {
        label: "06",
        value: 6
    },
    {
        label: "07",
        value: 7
    },
    {
        label: "08",
        value: 8
    },
    {
        label: "09",
        value: 9
    },
    {
        label: "10",
        value: 10
    },
    {
        label: "11",
        value: 11
    },
    {
        label: "12",
        value: 12
    }
];