"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./lib/api");
const prisma_1 = require("./lib/prisma");
function updateDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
updateDatabase();
//# sourceMappingURL=cron.js.map