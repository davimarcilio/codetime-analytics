import { Request, Response } from "express";
import { api } from "./lib/api";
import { prisma } from "./lib/prisma";

export async function updateDatabase(req: Request, res: Response) {
  const { data: csv } = await api.post<string>("/user/records/export", null, {
    headers: {
      Cookie: `CODETIME_SESSION=${process.env.CODETIME_SESSION}`,
    },
  });

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
  return res.status(200).json({
    message: "success",
  });
}
