"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalendarOptions = void 0;
const duration_1 = require("../utils/duration");
const weekday_1 = require("../utils/weekday");
function getCalendarOptions(data, width) {
    const min = data.reduce((p, c) => (c.duration < p ? c.duration : p), Infinity);
    const max = data.reduce((p, c) => (c.duration > p ? c.duration : p), -Infinity);
    const cell = (width - 20) / 53;
    const options = {
        tooltip: {
            formatter: (param) => {
                return `${param.data.time} </br> <span class="font-weight-bold">
        ${(0, duration_1.getDuration)(param.data.duration)}</span>`;
            },
        },
        dataset: {
            source: data,
        },
        visualMap: {
            max,
            min,
            type: "piecewise",
            show: false,
            inRange: {
                color: ["#5470C633", "#5470C6ff"],
            },
        },
        calendar: {
            cellSize: cell,
            range: [(0, weekday_1.getStartSunday)(), (0, weekday_1.getNextSaturday)()],
            dayLabel: { color: "#777" },
            monthLabel: { color: "#777" },
            itemStyle: {
                borderWidth: cell / 10,
                borderColor: "#5470C611",
                color: "#0000",
            },
            splitLine: { lineStyle: { color: "#0000" } },
            yearLabel: { show: false },
        },
        series: [
            {
                type: "heatmap",
                coordinateSystem: "calendar",
            },
        ],
        darkMode: true,
    };
    return options;
}
exports.getCalendarOptions = getCalendarOptions;
//# sourceMappingURL=calendar.js.map