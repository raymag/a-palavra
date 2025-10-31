import csv, json

MAX_ENTITIES = 10000
WORDS = []

BANNED_ENDINGS = ["EMOS", "AMOS", "EI", "ÁS", "EIS", "ESTES", "ERAM", "ARAM", "IRAM", "INHAM", "ITAM", "OU"]
MAX_POINTS = 16

entities = 0

with open("data/icf.txt", "r", encoding="utf-8") as file:
    reader = csv.reader(file)
    while entities < MAX_ENTITIES:
        try:
            entity = next(reader)
            if float(entity[1]) > MAX_POINTS: 
                break
            word = entity[0].strip().upper()
            if len(word) == 5 and word.isalpha():
                for ending in BANNED_ENDINGS:
                    if word.endswith(ending):
                        next

                WORDS.append(word)
                entities += 1
        except StopIteration:
            break

with open("data/words.json", "w", encoding="utf-8") as json_file:
    json.dump(WORDS, json_file, ensure_ascii=False, indent=4)
    
print('Word list generated with', len(WORDS), 'words.')