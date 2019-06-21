from flask import Flask, request, render_template, url_for
from multiprocessing import Pool, cpu_count
# from functools import reduce
from itertools import product
from json import dumps
from math import floor
from pprint import pprint

def gpa_val(x):
    try:
        numbs = int(x[-3:]) if(x[-1].isdigit()) else int(x[-4:-1])
        if(numbs >= 300 and numbs < 350):
            return 4.5
        if(numbs >= 350 and numbs < 400):
            return 4.75
        if(numbs >= 400):
            return 5
        else:
            return None
    except BaseException as e:
        print(e)
        return None

def minutes(sched):
    if('L' == sched[1]):
        return 40
    if(sched[1] in '12345'):
        return 50
    else:
        return 0

def parseSchedule(meetings):
    block = meetings[0]
    if(block not in 'ABCDEFGHI'):
        return []
    blocks = []
    for i in meetings[1:]:
        if(not i in 'ABCDEFGHI'):
            blocks.append(block+i)
        else:
            block = i
    return blocks

def safe(scheds):
    sum = []
    for i in scheds:
        # print(i)
        sum += parseSchedule(i) if i else []
    # print(sum)
    if(len(set(sum)) == len(sum)):
        return True
    return False

app = Flask(__name__)

@app.route("/privacy")
def priv():
    return render_template("PRIVACYPOLICY.html")


@app.route("/", methods = ['GET', 'POST'])
def home():
    if(request.method == "GET"):
        return render_template("index.html")
    if(request.method == "POST"):
        r = request.form
        rows = len(r)//3
        classes = [[],[],[]]
        cnames = [[],[],[]]
        # print(r)
        for i in range(rows):
            # print(f'Choice{i+1}')
            tri1 = r.get(f'tri1Choice{i+1}').split(' ')
            if(tri1[0]):
                # print('tri1',tri1)
                classes[0].append(tri1[0])
            tri2 = r.get(f'tri2Choice{i+1}').split(' ')
            if(tri2[0]):
                # print('tri2',tri2)
                classes[1].append(tri2[0])
            tri3 = r.get(f'tri3Choice{i+1}').split(' ')
            if(tri3[0]):
                # print('tri3',tri3)
                classes[2].append(tri3[0])
        tri1_meetings = [open(f'Schedule/Trimester1/{i}.txt', 'r').read().splitlines()[1:]  for i in classes[0]]
        tri2_meetings = [open(f'Schedule/Trimester2/{i}.txt', 'r').read().splitlines()[1:] for i in classes[1]]
        tri3_meetings = [open(f'Schedule/Trimester3/{i}.txt', 'r').read().splitlines()[1:] for i in classes[2]]
        meetings = [tri1_meetings, tri2_meetings, tri3_meetings]
        manual = [{},{},{}]
        for i in range(3):
            manual[i].update([k for k in zip(classes[i], meetings[i])])
        # print(manual)
        # print(tri1_meetings)
        print('\n'.join([repr([parseSchedule(x) for x in i]) for i in tri1_meetings]))
        # print([safe(x) for x in product(*tri1_meetings)])
        tris = [map(safe,product(*tri1_meetings)), map(safe,product(*tri2_meetings)),map(safe,product(*tri3_meetings))]
        tri1_success = any(tris[0])
        tri2_success = any(tris[1])
        tri3_success = any(tris[2])
        success = [tri1_success, tri2_success, tri3_success]
        if(success):
            tri1pos = list(filter(safe,product(*tri1_meetings)))
            tri2pos = list(filter(safe,product(*tri2_meetings)))
            tri3pos = list(filter(safe,product(*tri3_meetings)))
            pos2 = [tri1pos,tri2pos,tri3pos]
            numpos = [len(i) for i in pos2]
            numpos = f"Trimester 1: {numpos[0]} combinations<br>Trimester 2: {numpos[1]} combinations<br>Trimester 3: {numpos[2]} combinations<br>"
            pos = []
            for i in range(3):
                temp1 = []
                for j in range(len(pos2[i])):
                    temp2 = []
                    for k in range(len(classes[i])):
                        # print((classes[i][k],pos2[i][j][k]))
                        temp2.append((classes[i][k],parseSchedule(pos2[i][j][k])))
                    temp1.append(dict(temp2))
                pos.append(temp1)
        # print(success)
        schedule = []
        if(all(success)):
            for i in product(*tri1_meetings):
                if(safe(i)):
                    schedule.append(i)
                    break
            for i in product(*tri2_meetings):
                if(safe(i)):
                    schedule.append(i)
                    break
            for i in product(*tri3_meetings):
                if(safe(i)):
                    schedule.append(i)
                    break
            for i in range(len(schedule)):
                if('VS' in schedule[i]):
                    schedule[i] = list(schedule[i])
                    index = schedule[i].index('VS')
                    schedule[i].pop(index)
                    classes[i].pop(index)
            schedule = [[(parseSchedule(pattern), classname) for pattern,classname in zip(*i)] for i in zip(schedule, classes)]
            # print(schedule)
        schedule2 = [{
            'A1':'Free Time',
            'A2':'Free Time',
            'A3':'Free Time',
            'A4':'Free Time',
            'A5':'Free Time',
            'B1':'Free Time',
            'B2':'Free Time',
            'B3':'Free Time',
            'B4':'Free Time',
            'B5':'Free Time',
            'C1':'Free Time',
            'C2':'Free Time',
            'C3':'Free Time',
            'C4':'Free Time',
            'C5':'Free Time',
            'D1':'Free Time',
            'D2':'Free Time',
            'D3':'Free Time',
            'D4':'Free Time',
            'D5':'Free Time',
            'E1':'Free Time',
            'E2':'Free Time',
            'E3':'Free Time',
            'E4':'Free Time',
            'E5':'Free Time',
            'F1':'Free Time',
            'F2':'Free Time',
            'F3':'Free Time',
            'F4':'Free Time',
            'F5':'Free Time',
            'G1':'Free Time',
            'G2':'Free Time',
            'G3':'Free Time',
            'G4':'Free Time',
            'G5':'Free Time',
            'H1':'Free Time',
            'H2':'Free Time',
            'H3':'Free Time',
            'H4':'Free Time',
            'I1':'Free Time',
            'I2':'Free Time',
            'I3':'Free Time',
            'I4':'Free Time',
            'AL':'Free Time',
            'BL':'Free Time',
            'CL':'Free Time',
            'DL':'Free Time',
            'EL':'Free Time',
            'FL':'Free Time',
            'GL':'Free Time',
        },{
            'A1':'Free Time',
            'A2':'Free Time',
            'A3':'Free Time',
            'A4':'Free Time',
            'A5':'Free Time',
            'B1':'Free Time',
            'B2':'Free Time',
            'B3':'Free Time',
            'B4':'Free Time',
            'B5':'Free Time',
            'C1':'Free Time',
            'C2':'Free Time',
            'C3':'Free Time',
            'C4':'Free Time',
            'C5':'Free Time',
            'D1':'Free Time',
            'D2':'Free Time',
            'D3':'Free Time',
            'D4':'Free Time',
            'D5':'Free Time',
            'E1':'Free Time',
            'E2':'Free Time',
            'E3':'Free Time',
            'E4':'Free Time',
            'E5':'Free Time',
            'F1':'Free Time',
            'F2':'Free Time',
            'F3':'Free Time',
            'F4':'Free Time',
            'F5':'Free Time',
            'G1':'Free Time',
            'G2':'Free Time',
            'G3':'Free Time',
            'G4':'Free Time',
            'G5':'Free Time',
            'H1':'Free Time',
            'H2':'Free Time',
            'H3':'Free Time',
            'H4':'Free Time',
            'I1':'Free Time',
            'I2':'Free Time',
            'I3':'Free Time',
            'I4':'Free Time',
            'AL':'Free Time',
            'BL':'Free Time',
            'CL':'Free Time',
            'DL':'Free Time',
            'EL':'Free Time',
            'FL':'Free Time',
            'GL':'Free Time',
        },{
            'A1':'Free Time',
            'A2':'Free Time',
            'A3':'Free Time',
            'A4':'Free Time',
            'A5':'Free Time',
            'B1':'Free Time',
            'B2':'Free Time',
            'B3':'Free Time',
            'B4':'Free Time',
            'B5':'Free Time',
            'C1':'Free Time',
            'C2':'Free Time',
            'C3':'Free Time',
            'C4':'Free Time',
            'C5':'Free Time',
            'D1':'Free Time',
            'D2':'Free Time',
            'D3':'Free Time',
            'D4':'Free Time',
            'D5':'Free Time',
            'E1':'Free Time',
            'E2':'Free Time',
            'E3':'Free Time',
            'E4':'Free Time',
            'E5':'Free Time',
            'F1':'Free Time',
            'F2':'Free Time',
            'F3':'Free Time',
            'F4':'Free Time',
            'F5':'Free Time',
            'G1':'Free Time',
            'G2':'Free Time',
            'G3':'Free Time',
            'G4':'Free Time',
            'G5':'Free Time',
            'H1':'Free Time',
            'H2':'Free Time',
            'H3':'Free Time',
            'H4':'Free Time',
            'I1':'Free Time',
            'I2':'Free Time',
            'I3':'Free Time',
            'I4':'Free Time',
            'AL':'Free Time',
            'BL':'Free Time',
            'CL':'Free Time',
            'DL':'Free Time',
            'EL':'Free Time',
            'FL':'Free Time',
            'GL':'Free Time',
        }
        ]
        for i in schedule2:
            for j in i.keys():
                i[j] = ''
        tot = []
        for i in classes:
            tot+=i
        tot = [gpa_val(i) for i in tot]
        n = 0
        c = 0
        for i in tot:
            if(i):
                n += i
                c += 1
        gpa = n/c
        if(all(success)):
            for trimester in range(3):
                for i in range(len(schedule[trimester])):
                    ctuple = schedule[trimester][i]
                    for i in ctuple[0]:
                        schedule2[trimester][i] = ctuple[1]
            # pprint(schedule2)
        tris = [0,0,0]
        if(schedule):
            for i in range(3):
                for j in schedule[i]:
                    for k in j[0]:
                        tris[i] += minutes(k)
            n = f"Trimester 1: {floor(tris[0]/60)} hrs {tris[0]%60} min<br>Trimester 2: {floor(tris[1]/60)} hrs {tris[1]%60} min<br>Trimester 3: {floor(tris[2]/60)} hrs {tris[2]%60} min"
        else:
            n = "Conflicts Found"
        # print(n)
        gpa = str(round(gpa,2))
        gpa = gpa if('.' in gpa) else gpa + '.0'
        # print([success, schedule2, gpa, n, numpos, manual])
        return dumps([success, schedule2, gpa, n, numpos, manual, pos])

if __name__ == "__main__":
    app.run("0.0.0.0", debug = True)