"use client";

import React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { convertISOToDisplayDate } from "@/utils/signup-utils";

interface PersonalInformationProps {
  citizenId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  placeOfOrigin: string;
  placeOfResidence: string;
  dateOfExpiration: string;
  phoneNumber: string;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const PersonalInformationComponent = ({
  citizenId,
  fullName,
  dateOfBirth,
  gender,
  placeOfOrigin,
  placeOfResidence,
  dateOfExpiration,
  phoneNumber,

  errors,
  onChange,
}: PersonalInformationProps) => {
  // Helper function to safely parse date whether it's ISO or DD/MM/YYYY
  const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;

    // If it's ISO format (contains 'T')
    if (dateStr.includes("T")) {
      return new Date(dateStr);
    }

    // If it's DD/MM/YYYY format
    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    }

    return undefined;
  };

  // Helper function to get display date (DD/MM/YYYY)
  const getDisplayDate = (dateStr: string): string => {
    if (!dateStr) return "";

    // If it's ISO format, convert to DD/MM/YYYY
    if (dateStr.includes("T")) {
      return convertISOToDisplayDate(dateStr);
    }

    // If it's already DD/MM/YYYY, return as is
    return dateStr;
  };

  return (
    <div>
      <h3 className="mb-6 text-lg font-medium text-white">
        Your information will display here, please verify the correct information.
      </h3>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-white">Citizen ID*</label>
          <Input
            value={citizenId}
            onChange={(e) => onChange("citizenId", e.target.value)}
            placeholder="Citizen ID"
            className={`h-10 w-full ${errors.citizenId ? "border-gradient-input-error" : "border-gradient-input"} text-white placeholder-gray-400`}
          />
          {errors.citizenId && <p className="mt-2 text-sm text-red-400">{errors.citizenId}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">Full name*</label>
          <Input
            value={fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="Full name"
            className={`h-10 w-full ${errors.fullName ? "border-gradient-input-error" : "border-gradient-input"} text-white placeholder-gray-400`}
          />
          {errors.fullName && <p className="mt-2 text-sm text-red-400">{errors.fullName}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Date of Birth*</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "h-10 w-full justify-start text-left font-normal",
                    !dateOfBirth && "text-muted-foreground",
                    errors.dateOfBirth ? "border-gradient-input-error" : "border-gradient-input",
                    "text-white placeholder-gray-400",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfBirth ? getDisplayDate(dateOfBirth) : <span>DD/MM/YYYY</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto border-gray-700 bg-gray-800 p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDate(dateOfBirth)}
                  onSelect={(date) => {
                    if (date) {
                      const formattedDate = format(date, "dd/MM/yyyy");
                      onChange("dateOfBirth", formattedDate);
                    }
                  }}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  captionLayout="dropdown"
                  initialFocus
                  fromYear={1700}
                  toYear={new Date().getFullYear()}
                  classNames={{
                    months: "text-white",
                    month: "space-y-4",
                    caption: "text-white flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium text-white hidden",
                    caption_dropdowns: "flex justify-center gap-2",
                    vhidden: "hidden",
                    dropdown:
                      "bg-gray-700 border border-gray-600 text-white rounded px-3 py-1 text-sm min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600",
                    dropdown_month:
                      "bg-gray-700 border border-gray-600 text-white rounded px-3 py-1 text-sm min-w-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600",
                    dropdown_year:
                      "bg-gray-700 border border-gray-600 text-white rounded px-3 py-1 text-sm min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white hover:bg-gray-700 rounded",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1 mt-4",
                    head_row: "flex",
                    head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-1",
                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 font-normal text-white hover:bg-gray-700 rounded-md transition-colors cursor-pointer flex items-center justify-center",
                    day_range_end: "day-range-end",
                    day_selected: "bg-blue-600 text-white hover:bg-blue-500",
                    day_today: "bg-gray-700 text-white font-semibold",
                    day_outside: "text-gray-500 opacity-50",
                    day_disabled: "text-gray-500 opacity-30 cursor-not-allowed hover:bg-transparent",
                    day_range_middle: "aria-selected:bg-gray-700 aria-selected:text-white",
                    day_hidden: "invisible",
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors.dateOfBirth && <p className="mt-2 text-sm text-red-400">{errors.dateOfBirth}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Gender*</label>
            <Select value={gender} onValueChange={(value) => onChange("gender", value)}>
              <SelectTrigger
                className={`h-10 w-full rounded-md border ${errors.gender ? "border-gradient-input-error" : "border-gradient-input"} px-3 py-2 text-white`}
              >
                <SelectValue placeholder="Gender" className="text-gray-400" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800">
                <SelectItem value="Male" className="text-white hover:bg-gray-700">
                  Male
                </SelectItem>
                <SelectItem value="Female" className="text-white hover:bg-gray-700">
                  Female
                </SelectItem>
                <SelectItem value="Other" className="text-white hover:bg-gray-700">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="mt-2 text-sm text-red-400">{errors.gender}</p>}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">Place of origin*</label>
          <Input
            value={placeOfOrigin}
            onChange={(e) => onChange("placeOfOrigin", e.target.value)}
            placeholder="Place of origin"
            className={`h-10 w-full ${errors.placeOfOrigin ? "border-gradient-input-error" : "border-gradient-input"} text-white placeholder-gray-400`}
          />
          {errors.placeOfOrigin && <p className="mt-2 text-sm text-red-400">{errors.placeOfOrigin}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">Place of residence*</label>
          <Input
            value={placeOfResidence}
            onChange={(e) => onChange("placeOfResidence", e.target.value)}
            placeholder="Place of residence"
            className={`h-10 w-full ${errors.placeOfResidence ? "border-gradient-input-error" : "border-gradient-input"} text-white placeholder-gray-400`}
          />
          {errors.placeOfResidence && <p className="mt-2 text-sm text-red-400">{errors.placeOfResidence}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Date of Expiration*</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "h-10 w-full justify-start text-left font-normal",
                    !dateOfExpiration && "text-muted-foreground",
                    errors.dateOfExpiration ? "border-gradient-input-error" : "border-gradient-input",
                    "text-white placeholder-gray-400",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfExpiration ? getDisplayDate(dateOfExpiration) : <span>DD/MM/YYYY</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto border-gray-700 bg-gray-800 p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDate(dateOfExpiration)}
                  onSelect={(date) => {
                    if (date) {
                      const formattedDate = format(date, "dd/MM/yyyy");
                      onChange("dateOfExpiration", formattedDate);
                    }
                  }}
                  disabled={(date) => date < new Date()}
                  captionLayout="dropdown"
                  fromYear={1700}
                  toYear={new Date().getFullYear()}
                  initialFocus
                  classNames={{
                    months: "text-white",
                    month: "space-y-4",
                    caption: "text-white flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium text-white hidden",
                    caption_dropdowns: "flex justify-center gap-2",
                    vhidden: "hidden",
                    dropdown:
                      "bg-gray-700 border border-gray-600 text-white rounded px-3 py-1 text-sm min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600",
                    dropdown_month:
                      "bg-gray-700 border border-gray-600 text-white rounded px-3 py-1 text-sm min-w-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600",
                    dropdown_year:
                      "bg-gray-700 border border-gray-600 text-white rounded px-3 py-1 text-sm min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white hover:bg-gray-700 rounded",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1 mt-4",
                    head_row: "flex",
                    head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-1",
                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 font-normal text-white hover:bg-gray-700 rounded-md transition-colors cursor-pointer flex items-center justify-center",
                    day_range_end: "day-range-end",
                    day_selected: "bg-blue-600 text-white hover:bg-blue-500",
                    day_today: "bg-gray-700 text-white font-semibold",
                    day_outside: "text-gray-500 opacity-50",
                    day_disabled: "text-gray-500 opacity-30 cursor-not-allowed hover:bg-transparent",
                    day_range_middle: "aria-selected:bg-gray-700 aria-selected:text-white",
                    day_hidden: "invisible",
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors.dateOfExpiration && <p className="mt-2 text-sm text-red-400">{errors.dateOfExpiration}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Phone number*</label>
            <Input
              value={phoneNumber}
              onChange={(e) => onChange("phoneNumber", e.target.value)}
              placeholder="Phone number"
              className={`h-10 w-full ${errors.phoneNumber ? "border-gradient-input-error" : "border-gradient-input"} text-white placeholder-gray-400`}
            />
            {errors.phoneNumber && <p className="mt-2 text-sm text-red-400">{errors.phoneNumber}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationComponent;
