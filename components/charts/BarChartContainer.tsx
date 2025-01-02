"use client";

import { getAppointmentsPerMonth } from "@/lib/actions/appointment.actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import SimpleBarChart from "./SimpleBarChart";
import { getLastSevenYears } from "@/lib/utils";
import { useEffect, useState } from "react";

const BarChartContainer = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState({});

  useEffect(() => {
    const getYearlyEvaluation = async () => {
      try {
        const response = await getAppointmentsPerMonth(year);

        console.log({ Response: response });
        setData(response);
      } catch (error) {
        console.error("Error fetching yearly data", error);
      }
    };

    getYearlyEvaluation();
  }, [year]);

  const lastSevenYears = getLastSevenYears(currentYear);

  return (
    <div className="h-96 w-full rounded-2xl bg-cover py-6 px-4 shadow-lg shadow-neutral-800">
      <div className="flex-between">
        <h2 className="text-lg text-gray-400 font-semibold">
          Yearly Evaluation
        </h2>
        <Select
          onValueChange={(value) => setYear(Number(value))}
          defaultValue={currentYear.toString()}
        >
          <SelectTrigger className="max-w-20 border-none">
            <SelectValue placeholder={currentYear} />
          </SelectTrigger>

          <SelectContent className="shad-select-content">
            {lastSevenYears.map((year) => (
              <SelectItem
                key={year}
                value={year.toString()}
                className="shad-select-trigger"
              >
                <div className="flex cursor-pointer items-center gap-2">
                  <p>{year}</p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <SimpleBarChart data={data} />
    </div>
  );
};

export default BarChartContainer;
