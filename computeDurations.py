from datetime import datetime
import json


def write_json_file(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)


def parse_time(timeStr):
    return datetime.strptime(timeStr, "%H:%M:%S.%f")


name = "the_chase"
filename = f"./public/{name}/{name}.json"
with open(filename, 'r', encoding="utf-8") as file:
    data = json.load(file)

captions_with_fk = []
for element in data["captions"]:
    caption = {
        "start": element["start"],
        # Fixed typo from element["start"] to element["end"]
        "end": element["end"],
        "text": element["text"],
        "flesch_kincaid": element["flesch_kincaid"],
        "duration": (parse_time(element["end"]) - parse_time(element["start"])).total_seconds(),
        "ttsDuration": element["ttsDuration"]
    }
    captions_with_fk.append(caption)

data["captions"] = captions_with_fk
write_json_file(data, filename.replace(".json", "_FK.json"))
