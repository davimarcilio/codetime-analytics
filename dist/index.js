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
const dayjs_1 = __importDefault(require("dayjs"));
const express_1 = __importDefault(require("express"));
const echarts = __importStar(require("echarts"));
const calendar_1 = require("./echarts/calendar");
const node_cron_1 = require("node-cron");
const api_1 = require("./lib/api");
const prisma_1 = require("./lib/prisma");
const app = (0, express_1.default)();
app.get("/graph", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chart = echarts.init(null, null, {
        renderer: "svg",
        ssr: true,
    });
    const data = yield prisma_1.prisma.records.findMany();
    const fullData = data.map((line) => {
        return Object.assign(Object.assign({}, line), { event_time: line.event_time &&
                `${(0, dayjs_1.default)(Number(line.event_time)).format("YYYY-MM-DD")}T00:00:00Z` });
    });
    const allDays = Array.from(new Set(fullData.filter((e) => !!e.event_time).map((e) => e.event_time)));
    const daysWithTimeInDay = allDays.map((day) => ({
        time: day,
        by: "",
        duration: fullData.filter((e) => e.event_time === day).length * 60000,
    }));
    chart.setOption((0, calendar_1.getCalendarOptions)(daysWithTimeInDay, 1080));
    chart.resize({
        width: 1080,
        height: 250,
    });
    const svgChart = chart.renderToSVGString();
    return res.type("image/svg+xml").send(svgChart);
}));
app.listen(3000, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Api listen on 3000, starting cronjobs");
    (0, node_cron_1.schedule)("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        const { data: csv, request } = yield api_1.api.post("/user/records/export", null, {
            headers: {
                Cookie: `CODETIME_SESSION=${process.env.CODETIME_SESSION}`,
            },
        });
        const lines = csv.split("\n").slice(1);
        const fullData = lines
            .filter((line) => line.split(",").length === 6)
            .map((line) => {
            var _a;
            const splittedData = line.split(",");
            return {
                editor: splittedData.at(0),
                platform: splittedData.at(1),
                project: splittedData.at(2),
                relative_file: splittedData.at(3),
                language: splittedData.at(4),
                event_time: Number((_a = splittedData.at(5)) !== null && _a !== void 0 ? _a : 0),
            };
        });
        const lastRecord = yield prisma_1.prisma.records.findFirst({
            orderBy: {
                event_time: "desc",
            },
        });
        const filteredData = fullData.filter((e) => { var _a; return e.event_time > ((_a = lastRecord === null || lastRecord === void 0 ? void 0 : lastRecord.event_time) !== null && _a !== void 0 ? _a : 0); });
        yield prisma_1.prisma.records.createMany({
            data: filteredData,
        });
    }));
}));
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
module.exports = app;
//# sourceMappingURL=index.js.map