import { Subtitle } from "../types";

export function parseSRT(srtContent: string): Subtitle[] {
  try {
    return srtContent
      .trim()
      .split(/\n\n+/)
      .filter((block) => block.trim())
      .map((block, index) => {
        // Handle different SRT formats by checking for subtitle number
        const lines = block.split("\n");
        let timeString;
        let textLines;

        // Check if the first line is a number (subtitle index)
        if (/^\d+$/.test(lines[0].trim())) {
          timeString = lines[1];
          textLines = lines.slice(2);
        } else {
          // If no subtitle number, assume first line is the time
          timeString = lines[0];
          textLines = lines.slice(1);
        }

        // Extract start and end times with a more flexible regex
        // This will handle milliseconds of any length
        const timeMatch = timeString.match(
          /(\d{2}:\d{2}:\d{2},\d+)\s*-->\s*(\d{2}:\d{2}:\d{2},\d+)/,
        );
        
        if (!timeMatch) {
          // Try alternative format with dots instead of commas
          const altTimeMatch = timeString.match(
            /(\d{2}:\d{2}:\d{2}\.\d+)\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d+)/,
          );
          
          if (!altTimeMatch) {
            console.error(`Invalid time format in block: ${block}`);
            // Instead of throwing an error, provide a default time
            return {
              id: index + 1,
              startTime: "00:00:00,000",
              endTime: "00:00:05,000",
              text: textLines.join("\n").trim() || `[Invalid time format: ${timeString}]`,
            };
          }
          
          const [, startTime, endTime] = altTimeMatch;
          // Convert dots to commas for consistency
          return {
            id: index + 1,
            startTime: startTime.replace(".", ","),
            endTime: endTime.replace(".", ","),
            text: textLines.join("\n").trim(),
          };
        }

        const [, startTime, endTime] = timeMatch;
        
        // Normalize milliseconds to 3 digits
        const normalizeTime = (time: string) => {
          const [hms, ms] = time.split(",");
          const normalizedMs = ms.length > 3 ? ms.substring(0, 3) : ms.padEnd(3, '0');
          return `${hms},${normalizedMs}`;
        };

        return {
          id: index + 1,
          startTime: normalizeTime(startTime.trim()),
          endTime: normalizeTime(endTime.trim()),
          text: textLines.join("\n").trim(),
        };
      });
  } catch (error) {
    console.error("Error parsing SRT file:", error);
    throw error;
  }
}

export function formatSRT(subtitles: Subtitle[]): string {
  return subtitles
    .map((subtitle, index) => {
      return `${index + 1}\n${subtitle.startTime} --> ${subtitle.endTime}\n${subtitle.text}`;
    })
    .join("\n\n");
}
