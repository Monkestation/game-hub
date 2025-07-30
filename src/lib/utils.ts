import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ByondGameState } from "@/types/server";
import stationPrefixes from "@/strings/station_prefixes.json";
import stationNames from "@/strings/station_names.json";
import stationSuffixes from "@/strings/station_suffixes.json";
import greekLetters from "@/strings/greek_letters.json";
import phoneticAlphabet from "@/strings/phonetic_alphabet.json";

export function fakeDelay(time: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, time));
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function imageLookup(key?: string | string[]): string {
  return `/images/keys/${Array.isArray(key) ? getRandomElement(key) : key || "unknown"}.png`;
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0m";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

export function formatGameState(state: ByondGameState | undefined): string {
  if (state === undefined) return "Unknown";

  switch (state) {
    case ByondGameState.GAME_STATE_STARTUP:
      return "Starting up";
    case ByondGameState.GAME_STATE_PREGAME:
      return "Pregame lobby";
    case ByondGameState.GAME_STATE_SETTING_UP:
      return "Setting up round";
    case ByondGameState.GAME_STATE_PLAYING:
      return "Round in progress";
    case ByondGameState.GAME_STATE_FINISHED:
      return "Round ended";
    default:
      return "Unknown";
  }
}

export function getStatusColor(status?: 'alive' | 'degraded' | 'down' | 'Ongoing' | 'Completed' | string): string {
  switch (status) {
    case 'alive':
    case 'Completed':
    return 'bg-green-500';
    case 'Ongoing':
    case 'degraded':
      return 'bg-yellow-500';
    case 'down':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

export function getStatusText(status?: 'alive' | 'degraded' | 'down'): string {
  switch (status) {
    case 'alive':
      return 'Online';
    case 'degraded':
      return 'Degraded';
    case 'down':
      return 'Offline';
    default:
      return 'Unknown';
  }
}

export const formatDate = (date: Date | null) => {
  return date?.toLocaleString();
};

export function formatRoundDuration(
  start_datetime: Date,
  end_datetime?: Date | null
): string | null {
  if (!end_datetime) return null
  const startTime = start_datetime.getTime();
  const endTime = end_datetime ? end_datetime.getTime() : Date.now();
  const durationMs = endTime - startTime;

  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function calculateTotalPages(totalItems: number, limitPerPage: number): number {
  if (limitPerPage <= 0) {
    return 1;
  }
  return Math.ceil(totalItems / limitPerPage);
}


// Everything below and the strings in @/strings is ported from
// https://github.com/Monkestation/Monkestation2.0/blob/93e30df4ca2f60cff2cf560a06b1f76444f969a8/code/__HELPERS/names.dm
// https://github.com/Monkestation/Monkestation2.0/blob/93e30df4ca2f60cff2cf560a06b1f76444f969a8/code/__HELPERS/text.dm

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function intToWords(number: number, carriedString = "", capitalize = false): string {
  const tens = [
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  const ones = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];

  number = Math.round(number);
  if (number <= 0 || number > 999) return "";

  const output: string[] = [];
  if (number >= 100) {
    output.push(`${ones[Math.floor(number / 100) - 1]} hundred`);
    number %= 100;
    if (number) output.push("and");
  }
  
  //if number is more than 19, divide it

  if (number > 19) {
    let tempNum = tens[Math.floor(number / 10) - 1];
    if (number % 10) {
      tempNum += "-" + ones[(number % 10) - 1];
    }
    output.push(tempNum);
  } else if (number > 0) {
    output.push(ones[number - 1]);
  }

  if (carriedString) output.push(carriedString);
  return capitalize
    ? output.join(" ").replace(/^./, (c) => c.toUpperCase())
    : output.join(" ");
}

export function convertIntegerToWords(number: number, capitalize: boolean = false): string {
  if (!Number.isInteger(number) || Math.abs(number) > 999999999) {
    return number.toString();
  }

  if (number === 0) {
    return capitalize ? "Zero" : "zero";
  }

  const output: string[] = [];
  const negative = number < 0;
  number = Math.abs(number);

  const millions = intToWords(Math.floor((number / 1000000) % 1000), "million", capitalize);
  if (millions) output.push(millions);

  const thousands = intToWords(Math.floor((number / 1000) % 1000), "thousand", capitalize);
  if (thousands) output.push(thousands);

  if (output.length && number % 1000 < 100 && number % 1000 !== 0) {
    output.push("and");
  }

  output.push(intToWords(number % 1000, "", capitalize));
  
  let numberInWords = output.filter(Boolean).join(" ");
  if (negative) {
    numberInWords = capitalize ? "Negative " + numberInWords : "negative " + numberInWords;
  }

  return capitalize ? numberInWords.charAt(0).toUpperCase() + numberInWords.slice(1) : numberInWords;
}

export function generateStationName(): string {
  const random = Math.random() < 0.1 ? 999999999 : Math.floor(Math.random() * 5) + 1;
  let newStationName = "";

  // Rare: Pre-Prefix
  if (Math.random() < 0.1) {
    newStationName += getRandomElement(stationPrefixes) + " ";
  }

  // Prefix
  newStationName += getRandomElement(stationNames) + " ";

  // Suffix
  newStationName += getRandomElement(stationSuffixes) + " ";

  // ID Number
  switch (random) {
    case 1:
      newStationName += Math.floor(Math.random() * 99 + 1);
      break;
    case 2:
      newStationName += getRandomElement(greekLetters);
      break;
    case 3:
      newStationName += `\u2160${Math.floor(Math.random() * 9 + 1)}`; // Roman numeral
      break;
    case 4:
      newStationName += getRandomElement(phoneticAlphabet);
      break;
    case 5:
      newStationName += convertIntegerToWords(Math.floor(Math.random() * 100), true);
      break;
    case 13:
      newStationName += getRandomElement(["13", "XIII", "Thirteen"]);
      break;
    case 999999999:
      newStationName += convertIntegerToWords(
        Math.floor(Math.random() * (999999999 - 111111111) + 111111111),
        true
      );
      break;
  }

  return newStationName;
}