import requests
from bs4 import BeautifulSoup
import re
import json

def convert_number_format(value):
    # Remove any text before the first digit
    value = re.sub(r'^[^\d]+', '', value)

    # Remove "Euro" if present
    value = re.sub(r'\s*Euro', '', value)

    # Remove any spaces within the number (e.g., "123 456,78" -> "123456,78")
    value = re.sub(r'\s+', '', value)

    # Replace thousands separator (.) with an empty string and decimal separator (,) with a dot
    value = value.replace('.', '').replace(',', '.')

    return float(value)

donations = []

for x in range(2009, 2026):
    print(x)

    r = requests.get(f'https://www.bundestag.de/parlament/praesidium/parteienfinanzierung/fundstellen50000/{x}/')

    print(r)

    soup = BeautifulSoup(r.content, 'html.parser')
    donation_rows = soup.find('tbody').findChildren("tr" , recursive=False)

    for i in donation_rows:
        head = i.findChildren("td" , recursive=False)
        for j in head:
            for sup in j.find_all('sup'):
                sup.decompose()
        if len(head) == 5:
            dono = {}
            head[0] = head[0].get_text(strip=True)
            if "höfer" in head[0].lower():
                head[0] = "Team Todenhöfer"
            if "grünen" in head[0].lower():
                head[0] = "Bündnis 90 / Die Grünen"
            if "volt"in head[0].lower():
                head[0] = "Volt"
            if head[0] == "dieBasis":
                head[0] = "Die Basis"
            if "Bündnis Sahra Wagenknecht" in head[0]:
                head[0] = "BSW"
            
            dono["Partei"] = head[0]
            
            dono["Spende"] = convert_number_format(head[1].get_text(strip=True))
            
            lines = [line.strip() for line in head[2].stripped_strings]
            dono["Spender"] = lines[0]
            for j in lines:
                if re.match(r'^\d{5}', j):
                    dono["Ort"] = j
            dono["Jahr"] = x
            donations.append(dono)
        
#print(donations)
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(donations, f, ensure_ascii=False, indent=4)