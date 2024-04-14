"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalendarOptions = void 0;
const weekday_1 = require("../utils/weekday");
const dayjs_1 = __importDefault(require("dayjs"));
function getCalendarOptions(data, width) {
    console.log((0, weekday_1.getStartSunday)());
    console.log((0, weekday_1.getNextSaturday)());
    console.log({
        range: [
            (0, dayjs_1.default)().set("day", 6).subtract(1, "year").format("YYYY-MM-DD"),
            (0, dayjs_1.default)().set("day", 6).format("YYYY-MM-DD"),
        ],
    });
    const min = data.reduce((p, c) => (c.duration < p ? c.duration : p), Infinity);
    const max = data.reduce((p, c) => (c.duration > p ? c.duration : p), -Infinity);
    const cell = (width - 20) / 53;
    const options = {
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
            range: [
                (0, dayjs_1.default)()
                    .set("day", 6)
                    .subtract(1, "year")
                    .add(3, "week")
                    .format("YYYY-MM-DD"),
                (0, dayjs_1.default)().set("day", 6).format("YYYY-MM-DD"),
            ],
            dayLabel: { color: "#777" },
            monthLabel: { color: "#777" },
            itemStyle: {
                borderWidth: cell / 10,
                borderColor: "transparent",
                color: "#0000",
            },
            splitLine: { lineStyle: { color: "#0000" } },
            yearLabel: { show: false },
        },
        series: [
            {
                type: "heatmap",
                coordinateSystem: "calendar",
                itemStyle: { borderRadius: 4 },
            },
        ],
        darkMode: true,
    };
    return options;
}
exports.getCalendarOptions = getCalendarOptions;
//# sourceMappingURL=calendar.js.map