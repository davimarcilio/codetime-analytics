"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalendarOptions = exports.getStartSunday = exports.getNextSaturday = exports.getDuration = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const echarts = __importStar(require("echarts"));
const app = (0, express_1.default)();
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chart = echarts.init(null, null, {
        renderer: "svg",
        ssr: true,
        height: 250,
    });
    (0, fs_1.readFile)(path_1.default.join(__dirname, "./davimarcilio-codetime-records-12_04_2024, 21_25_05.csv"), "utf8", (error, data) => {
        if (error) {
            throw new Error(error.message);
        }
        const lines = data.split("\n").slice(1);
        const fullData = lines.map((line) => {
            const splittedData = line.split(",");
            return {
                editor: splittedData.at(0),
                platform: splittedData.at(1),
                project: splittedData.at(2),
                relative_file: splittedData.at(3),
                language: splittedData.at(4),
                event_time: splittedData.at(5) &&
                    `${(0, dayjs_1.default)(Number(splittedData.at(5))).format("YYYY-MM-DD")}T00:00:00Z`,
            };
        });
        const allDays = Array.from(new Set(fullData.filter((e) => !!e.event_time).map((e) => e.event_time)));
        const daysWithTimeInDay = allDays.map((day) => ({
            time: day,
            by: "",
            duration: fullData.filter((e) => e.event_time === day).length * 60000,
        }));
        chart.setOption(getCalendarOptions(daysWithTimeInDay, 1080));
        const svgChart = chart.renderToSVGString();
        res.send(svgChart);
    });
}));
app.listen(3000);
// async function readDataFile() {
//   readFile(
//     path.join(
//       __dirname,
//       "./davimarcilio-codetime-records-12_04_2024, 21_25_05.csv"
//     ),
//     "utf8",
//     (error, data) => {
//       if (error) {
//         throw new Error(error.message);
//       }
//       const lines = data.split("\n").slice(1);
//       const fullData = lines.map((line) => {
//         const splittedData = line.split(",");
//         return {
//           editor: splittedData.at(0),
//           platform: splittedData.at(1),
//           project: splittedData.at(2),
//           relative_file: splittedData.at(3),
//           language: splittedData.at(4),
//           event_time:
//             splittedData.at(5) &&
//             dayjs(Number(splittedData.at(5))).format("DD/MM/YYYY"),
//         };
//       });
//       const allDays = Array.from(
//         new Set(fullData.filter((e) => !!e.event_time).map((e) => e.event_time))
//       ) as String[];
//       const daysWithTimeInDay = allDays.map((day) => ({
//         date: day,
//         timeInMinutes: fullData.filter((e) => e.event_time === day).length,
//       }));
//       console.log(daysWithTimeInDay);
//     }
//   );
// }
// readDataFile();
const MS_OF_HOUR = 3600000;
const MS_OF_MINUTE = 60000;
function getDuration(ms) {
    let result = "";
    let day, hour, minute;
    if (ms > MS_OF_HOUR) {
        // 超过1小时
        if (result !== "") {
            result += " ";
        }
        hour = Math.floor(ms / MS_OF_HOUR);
        result += hour + "hr";
        if (hour > 1) {
            result += "s";
        }
        ms %= MS_OF_HOUR;
    }
    if (ms > MS_OF_MINUTE && !day) {
        if (result !== "") {
            result += " ";
        }
        // 超过1分钟
        minute = Math.floor(ms / MS_OF_MINUTE);
        result += minute + "min";
        if (minute > 1) {
            result += "s";
        }
        ms %= MS_OF_MINUTE;
    }
    if (!minute && !hour && !day) {
        if (result !== "") {
            result += " ";
        }
        const s = Math.floor(ms / 1000);
        result += s + "sec";
        if (s > 1) {
            result += "s";
        }
    }
    return result;
}
exports.getDuration = getDuration;
function getNextSaturday() {
    const currentDate = new Date();
    const day = currentDate.getDay();
    const delta = 6 - day;
    const resultDate = new Date(currentDate.getTime() + delta * 86400000);
    const date = resultDate.getDate().toString().padStart(2, "0");
    const month = (resultDate.getMonth() + 1).toString().padStart(2, "0");
    const year = resultDate.getFullYear();
    return `${year}-${month}-${date}`;
}
exports.getNextSaturday = getNextSaturday;
function getStartSunday() {
    const currentDate = new Date();
    const day = currentDate.getDay();
    const delta = 7 - day;
    const resultDate = new Date(currentDate.getTime() + delta * 86400000 - 53 * 7 * 86400000);
    const date = resultDate.getDate().toString().padStart(2, "0");
    const month = (resultDate.getMonth() + 1).toString().padStart(2, "0");
    const year = resultDate.getFullYear();
    return `${year}-${month}-${date}`;
}
exports.getStartSunday = getStartSunday;
function getCalendarOptions(data, width) {
    const min = data.reduce((p, c) => (c.duration < p ? c.duration : p), Infinity);
    const max = data.reduce((p, c) => (c.duration > p ? c.duration : p), -Infinity);
    console.log(min);
    console.log(max);
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
            range: [getStartSunday(), getNextSaturday()],
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
    console.log(options);
    return options;
}
exports.getCalendarOptions = getCalendarOptions;
//# sourceMappingURL=index.js.map