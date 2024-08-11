import json
import numpy 

names = ["devil_wears_prada", "the_chase", "industry", "bbc_space"]

complexities = []

for name in names:
    filename = f"./public/{name}/{name}.json"
    with open(filename, 'r', encoding="utf-8") as file:
        data = json.load(file)
        for element in data["captions"]:
            complexities.append(int(element["flesch_kincaid"]))

print(sorted(complexities))
print("Q2:", numpy.quantile(complexities, [0.5]) )
print("Q3:", numpy.quantile(complexities, [0.75]) )