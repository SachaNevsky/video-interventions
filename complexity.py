from datetime import datetime
import json
import math

def write_json_file(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

def parse_time(timeStr):
    return datetime.strptime(timeStr, "%H:%M:%S.%f")

def calculateWPM(text: str, duration: float):
    wordCount = len(text.split())
    wpm = int(wordCount / duration * 60)
    print(f"\nWord count: {wordCount} - Duration: {duration}")
    print(f"WPM: {wpm} - Mult: {1 + math.log(max(wpm-60, 1), 10)}")
    return wpm


name = "devil_wears_prada"
filename = f"./public/{name}/{name}.json"
with open(filename, 'r', encoding="utf-8") as file:
    data = json.load(file)

captions_with_fk = []
for element in data["captions"]:
    duration = 0
    if("duration" in element):
        duration = element["duration"]
    else:
        duration = (parse_time(element["end"]) - parse_time(element["start"])).total_seconds()

    wpm = calculateWPM(element["text"], duration)
    new_FK = round((int(element["flesch_kincaid"]) + 1) * (1 + math.log(max(wpm-60, 1), 100)))
    print(element["flesch_kincaid"], new_FK)

    caption = {
        "start": element["start"],
        "end": element["end"],
        "text": element["text"],
        "flesch_kincaid": str(new_FK),
        "duration": duration,
        "ttsDuration": element["ttsDuration"]
    }
    
    captions_with_fk.append(caption)

data["captions"] = captions_with_fk
write_json_file(data, filename.replace(".json", "_complexity.json"))
