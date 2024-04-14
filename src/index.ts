import dayjs from "dayjs";
import express from "express";
import * as echarts from "echarts";
import { getCalendarOptions } from "./echarts/calendar";
import { prisma } from "./lib/prisma";
import { middleware } from "apicache";
import { updateDatabase } from "./cron";
const app = express();

app.get("/updateDatabase", updateDatabase);
app.get("/graph", middleware("24 hours"), async (req, res) => {
  const chart = echarts.init(null, null, {
    renderer: "svg",
    ssr: true,
  });

  const data = await prisma.records.findMany({
    orderBy: { event_time: "asc" },
  });

  const fullData = data.map((line) => {
    return {
      ...line,
      event_time:
        line.event_time && dayjs(Number(line.event_time)).format("YYYY-MM-DD"),
    };
  });
  const allDays = Array.from(
    new Set(fullData.filter((e) => !!e.event_time).map((e) => e.event_time))
  ) as string[];
  const daysWithTimeInDay = allDays.map((day) => ({
    time: day,
    duration: fullData.filter((e) => e.event_time === day).length * 60000,
  }));

  chart.setOption(getCalendarOptions(daysWithTimeInDay, 1080));

  chart.resize({
    width: 1080,
    height: 250,
  });

  const svgChart = chart.renderToSVGString();

  res.setHeader(
    "Cache-Control",
    `max-age=${60 * 60 * 24}, s-maxage=${
      60 * 60 * 24
    }, stale-while-revalidate=86400`
  );

  return res.type("image/svg+xml").send(svgChart);
});

app.listen(3000, async () => {
  console.log("Api listen on 3000, starting cronjobs");
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
