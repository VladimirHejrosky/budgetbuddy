"use client";

import { months } from "@/lib/data/months";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  month: number;
  year: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
}

const currentYear = new Date().getFullYear();

const DateSelector = ({ month, year, setMonth, setYear }: Props) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <Button
        disabled={year <= 2025 && month === 1}
        variant={"outline"}
        onClick={() => {
          if (month === 1) {
            setMonth(12);
            setYear(year - 1);
          } else {
            setMonth(month - 1);
          }
        }}
      >
        <ChevronLeft />
      </Button>

      <span className="text-lg font-semibold">
        {months.find((m) => m.value === month)?.label} {year}
      </span>

      <Button
        disabled={year >= currentYear && month >= 12}
        variant={"outline"}
        onClick={() => {
          if (month === 12) {
            setMonth(1);
            setYear(year + 1);
          } else {
            setMonth(month + 1);
          }
        }}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default DateSelector;
