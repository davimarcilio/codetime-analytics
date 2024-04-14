import dayjs from "dayjs";
import express from "express";
import * as echarts from "echarts";
import { getCalendarOptions } from "./echarts/calendar";
import { schedule } from "node-cron";
import { api } from "./lib/api";
import { prisma } from "./lib/prisma";
const app = express();

app.get("/graph", async (req, res) => {
  const chart = echarts.init(null, null, {
    renderer: "svg",
    ssr: true,
  });

  const data = await prisma.records.findMany();

  const fullData = data.map((line) => {
    return {
      ...line,
      event_time:
        line.event_time &&
        `${dayjs(Number(line.event_time)).format("YYYY-MM-DD")}T00:00:00Z`,
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

  chart.resize({
    width: 1080,
    height: 250,
  });

  const svgChart = chart.renderToSVGString();

  return res.type("image/svg+xml").send(svgChart);
});

app.listen(3000, async () => {
  console.log("Api listen on 3000, starting cronjobs");

  schedule("0 0 * * *", async () => {
    const { data: csv, request } = await api.post<string>(
      "/user/records/export",
      null,
      {
        headers: {
          Cookie: `CODETIME_SESSION=${process.env.CODETIME_SESSION}`,
        },
      }
    );

    const lines = csv.split("\n").slice(1);

    const fullData = lines
      .filter((line) => line.split(",").length === 6)
      .map((line) => {
        const splittedData = line.split(",");
        return {
          editor: splittedData.at(0),
          platform: splittedData.at(1),
          project: splittedData.at(2),
          relative_file: splittedData.at(3),
          language: splittedData.at(4),
          event_time: Number(splittedData.at(5) ?? 0),
        };
      });

    const lastRecord = await prisma.records.findFirst({
      orderBy: {
        event_time: "desc",
      },
    });

    const filteredData = fullData.filter(
      (e) => e.event_time > (lastRecord?.event_time ?? 0)
    );

    await prisma.records.createMany({
      data: filteredData,
    });
  });
});

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
