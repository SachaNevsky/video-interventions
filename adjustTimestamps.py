from datetime import datetime, timedelta
import json
import re


def write_json_file(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)


def parse_time(timeStr):
    time_parts = re.split(r"[:.]", str(timeStr))
    hours = int(time_parts[0])
    minutes = int(time_parts[1])
    seconds = int(time_parts[2])
    milliseconds = int(time_parts[3])
    return timedelta(hours=hours, minutes=minutes, seconds=seconds, milliseconds=milliseconds)


name = "industry"
filename = f"./public/{name}/{name}.json"
time = timedelta(minutes=0, seconds=2, milliseconds=400)
with open(filename, 'r', encoding="utf-8") as file:
    data = json.load(file)

captions_with_fk = []
for element in data["captions"]:
    print(element["start"], time)
    caption = {
        "start": str(parse_time(element["start"]) + time),
        "end": str(parse_time(element["end"]) + time),
        "text": element["text"],
        "flesch_kincaid": element["flesch_kincaid"],
        "duration": (parse_time(element["end"]) - parse_time(element["start"])).total_seconds(),
        "ttsDuration": element["ttsDuration"]
    }
    print(caption["start"])
    captions_with_fk.append(caption)


data["captions"] = captions_with_fk
write_json_file(data, filename.replace(".json", "_FK.json"))
