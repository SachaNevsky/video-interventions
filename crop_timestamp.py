import re
from datetime import timedelta


def subtract_time_from_vtt(file_path, output_path, time_to_subtract):
    def parse_time_stamp(timestamp):
        time_parts = re.split(r"[:.]", timestamp)
        hours = int(time_parts[0])
        minutes = int(time_parts[1])
        seconds = int(time_parts[2])
        milliseconds = int(time_parts[3])
        return timedelta(hours=hours, minutes=minutes, seconds=seconds, milliseconds=milliseconds)

    def format_time_stamp(td):
        total_seconds = int(td.total_seconds())
        milliseconds = int(td.microseconds / 1000)
        hours, remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

    with open(file_path, "r", encoding="utf-8") as file:
        lines = file.readlines()

    with open(output_path, "w", encoding="utf-8") as file:
        for line in lines:
            match = re.match(
                r"(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})", line)
            if match:
                start_time = parse_time_stamp(match.group(1))
                end_time = parse_time_stamp(match.group(2))
                new_start_time = start_time + time_to_subtract
                new_end_time = end_time + time_to_subtract
                # Ensure times are not negative
                if new_start_time < timedelta(0):
                    new_start_time = timedelta(0)
                if new_end_time < timedelta(0):
                    new_end_time = timedelta(0)
                new_line = f"{format_time_stamp(
                    new_start_time)} --> {format_time_stamp(new_end_time)}\n"
                file.write(new_line)
            else:
                file.write(line)


# Usage
name = "industry"
input_file = f"./public/{name}/{name}.vtt"
output_file = f"./public/{name}/{name}_cropped.vtt"
time_to_subtract = timedelta(minutes=0, seconds=2, microseconds=5)

subtract_time_from_vtt(input_file, output_file, time_to_subtract)
