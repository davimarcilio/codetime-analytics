import dayjs from "dayjs";
import { readFile } from "fs";
import path from "path";
import express from "express";
import * as echarts from "echarts";
const app = express();

app.get("/graph", async (req, res) => {
  const chart = echarts.init(null, null, {
    renderer: "svg",
    ssr: true,
    height: 250,
  });

  readFile(
    path.join(
      __dirname,
      "./davimarcilio-codetime-records-12_04_2024, 21_25_05.csv"
    ),
    "utf8",
    (error, data) => {
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
          event_time:
            splittedData.at(5) &&
            `${dayjs(Number(splittedData.at(5))).format(
              "YYYY-MM-DD"
            )}T00:00:00Z`,
        };
      });
      const allDays = Array.from(
        new Set(fullData.filter((e) => !!e.event_time).map((e) => e.event_time))
      ) as String[];
      const daysWithTimeInDay = allDays.map((day) => ({
        time: day,
        by: "",
        duration: fullData.filter((e) => e.event_time === day).length * 60000,
      }));

      chart.setOption(getCalendarOptions(daysWithTimeInDay, 1080));
      const svgChart = chart.renderToSVGString();
      res.send(svgChart);
    }
  );
});

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
export function getDuration(ms: number): string {
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

import { EChartsOption } from "echarts";

export function getNextSaturday() {
  const currentDate = new Date();
  const day = currentDate.getDay();
  const delta = 6 - day;
  const resultDate = new Date(currentDate.getTime() + delta * 86400000);
  const date = resultDate.getDate().toString().padStart(2, "0");
  const month = (resultDate.getMonth() + 1).toString().padStart(2, "0");
  const year = resultDate.getFullYear();
  return `${year}-${month}-${date}`;
}

export function getStartSunday() {
  const currentDate = new Date();
  const day = currentDate.getDay();
  const delta = 7 - day;
  const resultDate = new Date(
    currentDate.getTime() + delta * 86400000 - 53 * 7 * 86400000
  );
  const date = resultDate.getDate().toString().padStart(2, "0");
  const month = (resultDate.getMonth() + 1).toString().padStart(2, "0");
  const year = resultDate.getFullYear();
  return `${year}-${month}-${date}`;
}

export function getCalendarOptions(data: any[], width: number): EChartsOption {
  const min = data.reduce(
    (p: number, c: any) => (c.duration < p ? c.duration : p),
    Infinity
  );
  const max = data.reduce(
    (p: number, c: any) => (c.duration > p ? c.duration : p),
    -Infinity
  );
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
  } as EChartsOption;
  console.log(options);

  return options;
}

module.exports = app;
