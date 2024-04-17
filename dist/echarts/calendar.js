"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalendarOptions = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
function getCalendarOptions(propData, width) {
    const min = propData.reduce((p, c) => (c.duration < p ? c.duration : p), Infinity);
    const max = propData.reduce((p, c) => (c.duration > p ? c.duration : p), -Infinity);
    const data = propData.map((e) => (Object.assign(Object.assign({}, e), { duration: e.duration === 0 ? max * -1 : e.duration })));
    const cell = (width - 20) / 53;
    const options = {
        dataset: {
            source: data,
        },
        backgroundColor: "#18181b",
        visualMap: {
            max,
            min: max * -1,
            type: "piecewise",
            show: false,
            inRange: {
                color: ["#27272a", "#5470C633", "#5470C6ff"],
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
                (0, dayjs_1.default)().format("YYYY-MM-DD"),
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