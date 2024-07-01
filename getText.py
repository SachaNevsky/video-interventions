from datetime import timedelta
import json


def write_json_file(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)


name = "devil_wears_prada"
filename = f"./public/{name}/{name}.json"
time = timedelta(minutes=0, seconds=2, milliseconds=400)
with open(filename, 'r', encoding="utf-8") as file:
    data = json.load(file)

text = ""
for element in data["captions"]:
    text += f"{element["text"]}\n"

with open(f"./public/{name}/{name}_text.txt", "w") as f:
    f.write(text)
