// DateSelector.js
import { useState } from "react";
import { DaySelector, MonthSelector, YearSelector } from "./CustomDropdown";

const DateSelector = ({
    selectedMonth,
    setSelectedMonth,
    selectedDay,
    setSelectedDay,
    selectedYear,
    setSelectedYear,
}) => {
    const [openDropdown, setOpenDropdown] = useState(null); // Track open dropdown: 'month', 'day', 'year'

    const toggleVisibility = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    const years = Array.from({ length: 100 }, (_, i) => (1920 + i).toString());

    return (
        <div className="flex flex-row w-full my-4 items-stretch box-border relative" >
            <MonthSelector
                label="Month"
                options={months}
                onSelect={setSelectedMonth}
                selectedValue={selectedMonth}
                isOpen={openDropdown === "month"}
                toggleVisibility={() => toggleVisibility("month")}
            />
            <DaySelector
                label="Day"
                options={days}
                onSelect={setSelectedDay}
                selectedValue={selectedDay}
                isOpen={openDropdown === "day"}
                toggleVisibility={() => toggleVisibility("day")}
            />
            <YearSelector
                label="Year"
                options={years}
                onSelect={setSelectedYear}
                selectedValue={selectedYear}
                isOpen={openDropdown === "year"}
                toggleVisibility={() => toggleVisibility("year")}
            />
        </div>
    );
};

export default DateSelector;
