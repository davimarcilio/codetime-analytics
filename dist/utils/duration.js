"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDuration = void 0;
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
//# sourceMappingURL=duration.js.map