import { EChartsOption } from "echarts";
import dayjs from "dayjs";

export function getCalendarOptions(
  propData: any[],
  width: number
): EChartsOption {
  const min = propData.reduce(
    (p: number, c: any) => (c.duration < p ? c.duration : p),
    Infinity
  );
  const max = propData.reduce(
    (p: number, c: any) => (c.duration > p ? c.duration : p),
    -Infinity
  );

  const data = propData.map((e) => ({
    ...e,
    duration: e.duration === 0 ? max * -1 : e.duration,
  }));

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
