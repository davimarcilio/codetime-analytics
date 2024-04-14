import { EChartsOption } from "echarts";
import { getDuration } from "../utils/duration";
import { getNextSaturday, getStartSunday } from "../utils/weekday";
import dayjs from "dayjs";

export function getCalendarOptions(data: any[], width: number): EChartsOption {
  console.log(getStartSunday());
  console.log(getNextSaturday());
  console.log({
    range: [
      dayjs().set("day", 6).subtract(1, "year").format("YYYY-MM-DD"),
      dayjs().set("day", 6).format("YYYY-MM-DD"),
    ],
  });

  const min = data.reduce(
    (p: number, c: any) => (c.duration < p ? c.duration : p),
    Infinity
  );
  const max = data.reduce(
    (p: number, c: any) => (c.duration > p ? c.duration : p),
    -Infinity
  );

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
        dayjs()
          .set("day", 6)
          .subtract(1, "year")
          .add(3, "week")
          .format("YYYY-MM-DD"),
        dayjs().set("day", 6).format("YYYY-MM-DD"),
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
  } as EChartsOption;

  return options;
}
