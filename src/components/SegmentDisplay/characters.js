const segmentEnum = {
  "CMR":0,
  "TL":1,
  "TR":2,
  "UR":3,
  "LR":4,
  "BR":5,
  "BL":6,
  "LL":7,
  "UL":8,
  "CUL":9,
  "CUM":10,
  "CUR":11,
  "CLL":12,
  "CLR":13,
  "CLM":14,
  "CML":15
}

const alphaNumeric = {
  'A':['CML','CMR','LL','LR','TL','TR','UL','UR'],
  'B':['BL','BR','CLM','CMR','CUM','LR','TL','TR','UR'],
  'C':['BL','BR','LL','TL','TR','UL'],
  'D':['BL','BR','CLM','CUM','LR','TL','TR','UR'],
  'E':['BL','BR','LL','TL','TR','UL','CML'],
  'F':['LL','TL','TR','UL','CML'],
  'G':['BL','BR','LL','TL','TR','UL','CMR','LR'],
  'H':['LL','UL','CML','CMR','LR','UR'],
  'I':['BL','BR','CLM','CUM','TL','TR'],
  'J':['BL','BR','LL','LR','UR'],
  'K':['CLR','CML','CUR','LL','UL'],
  'L':['BL','BR','LL','UL'],
  'M':['CUL','CUR','LL','LR','UL','UR'],
  'N':['CLR','CUL','LL','LR','UL','UR'],
  'O':['BL','BR','LL','TL','TR','UL','LR','UR'],
  'P':['CML','CMR','LL','TL','TR','UL','UR'],
  'Q':['BL','BR','LL','TL','TR','UL','LR','UR','CLR'],
  'R':['CML','CMR','LL','TL','TR','UL','UR','CLR'],
  'S':['BL','BR','CMR','LR','TL','TR','CUL'],
  'T':['CLM','CUM','TL','TR'],
  'U':['BL','BR','LL','LR','UL','UR'],
  'V':['CLL','CUR','LL','UL'],
  'W':['CLL','CLR','LL','LR','UL','UR'],
  'X':['CLL','CLR','CUL','CUR'],
  'x':['CLL','CLR','CUL','CUR'],
  'Y':['CLM','CML','CMR','UL','UR'],
  'Z':['BL','BR','CLL','CML','CMR','CUR','TL','TR'],
  'Ä':['BL','BR','CLR','CML','LL','TL'],
  'ä':['BL','BR','CLR','CML','LL','TL'],
  'Ö':['BL','BR','CML','CMR','LL','LR','TL','TR'],
  'ö':['BL','BR','CML','CMR','LL','LR','TL','TR'],
  'a':['BL','BR','CLR','CML','LL'],
  'b':['BL','CLM','CML','LL','UL'],
  'c':['BL','CML','LL'],
  'd':['BR','CLM','CMR','LR','UR'],
  'e':['BL','CLL','CML','LL'],
  'f':['CLM','CML','CMR','CUM','TR'],
  'g':['BR','CMR','CUR','LR','UR'],
  'h':['CLM','CML','LL','UL'],
  'i':['CLM'],
  'j':['BL','CLM','CUM','LL'],
  'k':['CLM','CLR','CUM','CUR'],
  'l':['BR','CLM','CUM'],
  'm':['CLM','CML','CMR','LL','LR'],
  'n':['CLR','CML','LL'],
  'o':['BL','CLM','CML','LL'],
  'p':['CML','CUM','LL','TL','UL'],
  'q':['CLR','CML','CMR','TL','TR','UL','UR'],
  'r':['CML','LL'],
  's':['BR','CLR','CMR'],
  't':['BL','CML','LL','UL'],
  'u':['BL','CLM','LL'],
  'v':['CLL','LL'],
  'w':['CLL','CLR','LL','LR'],
  'y':['BR','CMR','CUL','LR','UR'],
  'z':['BL','CLL','CML'],
  '1':['CUR','LR','UR'],
  '2':['BL','BR','CML','CMR','LL','TL','TR','UR'],
  '3':['BL','BR','CMR','LR','TL','TR','UR'],
  '4':['CML','CMR','LR','UL','UR'],
  '5':['BL','BR','CML','CMR','LR','TL','TR','UL'],
  '6':['BL','BR','CML','CMR','LL','LR','TL','TR','UL'],
  '7':['CLL','CUR','TL','TR'],
  '8':['BL','BR','CML','CMR','LL','LR','TL','TR','UL','UR'],
  '9':['CML','CMR','LR','TL','TR','UL','UR'],
  '0':['BL','BR','CLL','CUR','LL','LR','TL','TR','UL','UR'],
  '-':['CML','CMR'],
  '.':['BL'],
  ',':['BL'],
  '?':['TL','TR','UR','CMR','CLM']
}

const special = {
  '☰':['BL','BR','CML','CMR','TL','TR'],
}

const loading = {
  0:['CLM','CUM'],
  1:['CLM','CUR'],
  2:['CLL','CUR'],
  3:['CLL','CMR'],
  4:['CML','CMR'],
  5:['CLR','CML'],
  6:['CLR','CUL'],
  7:['CLM','CUL'],
}

export const getCharacterArray = (type, character) => {
  switch(type){
    case 'basic':
      let result = alphaNumeric[character].map( item => {
        return segmentEnum[item]
      })
      return result
  }
}