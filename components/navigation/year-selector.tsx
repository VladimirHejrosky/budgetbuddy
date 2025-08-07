"use client";

import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  year: number;
  setYear: (year: number) => void;
}

const currentYear = new Date().getFullYear();

const YearSelector = ({ year, setYear }: Props) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <Button
        disabled={year <= 2025}
        variant={"outline"}
        onClick={() => setYear(year - 1)}
      >
        <ChevronLeft />
      </Button>

      <span className="text-lg font-semibold">{year}</span>

      <Button
        disabled={year >= currentYear}
        variant={"outline"}
        onClick={() => setYear(year + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default YearSelector;
