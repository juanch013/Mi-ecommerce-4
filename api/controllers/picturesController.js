const fs = require('fs');

// Nuestra API debe poder administrar las fotos de los productos del sistema (pictures). Una picture está definida por la siguiente estructura:
// {
//   "id": {
//     "type": Number,
//     "required": true
//   },
//   "url": {
//     "type": String,
//     "required": true
//   },
//   "description": {
//     "type": String,
//     "required": false
//   }
// }

//lista de productos
// [{
//   "id": 1,
//   "title": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAANPSURBVBgZBcHdT1tlAMDh3zltORT6Ob4mtWDGMpgiU8LcEooJyiaEGbNkCkaNCVfeGP4Dr7zBG42J3hiVZInTeTMvFAPBYRhmGDBjEYaAMhhtVzraUjin5+M95/V5FCklAAAA4wtjfcCHwHmgAfADh8Ci9OSXn/d9+ysAAIAipQRgfGHMD0wC115PDmjxYANloxbDBuGaCHLMZqeEK9wZIdy3vh76/hhAkVIyvjAWAG731D/XeznZT9nUsLDZKitUSY0Dw0MKmyAGWWuepczSfeGIl79789ahCgBMdted6U0191BwbRxVQQiViqjCoIqCpbFvBtk7DNASeomek+1dtuXcAPAVL+2mgE/eOXPF97erk6VCxRMcmyEKVoCyCZvpIw51HS1+gBLd5GJ9B7Nrf566vji54rsw9uKnrzVf6FR8QbKqANnIU26I5ZyPiqmylj7Gqy6itf6DFdkk7xXxF10665Lq8sP1E37gfDKS4J6RIV+t8qyvDQ/Bzr6NaVaInpSUT0yz5ZXAksSExmbeYuCZbhxLPO8H6mr8tewYGfYtg3DNKUp2mGLRI9pg0hg3yLsvULZW0OQRR08OKJRqCAXDOLaI+aWUiiLBtspIkvgDLlN3HZRgiOyWQJURmhsqhI/6KKcdTJZw7G2QEiGE4neFVyjb5USdL0a4+hw7aQ9lZ502nvB0Yx3rd7LcpwNHFZzzVuloaSOTq2Zx/gGeJct+4Yi/HhZ2E6drksyk59H/OKY7mGBk5D10Xadtbw///CK6A++PXqO6KkA2m2V5eZloNm75ukbOHqzub789fDql3p6ZJb4f4sobV/nos6+4deM629v/0daSwDrM89vsLDd/vEnRyNLfd4nibimgfjP8w7RtOb9Mr/1O+CBINBwFIHZxCMO0GB0dJZVKMTQ0xODgIKZVwdduAhCLxlQ/gGM5785t3rtTT6SLfA4A4+5PKNJjYmKC2tpaAHRdR3qwMvXIGP6AmnQ6bSpSSgAGv3glbKTNnyP/xlOv9g4oiUSSgOojl8uxsbGBpmm0trbS1NSEI5zS3qM95ubmHitSSgAA2tvbfY399eOhx5GPmxubq7UqTVFQeKCsllyfu90pus4qKFiW5WYymbyu61f/B/q4pKqmYKY6AAAAAElFTkSuQmCC",
//   "price": "$739.14",
//   "description": "Extirpation of Matter from Lower Esophagus, Via Opening",
//   "gallery": [
//     {
//       "picture-id": 1,
//       "picture-url": "http://dummyimage.com/242x100.png/cc0000/ffffff"
//     }
//   ],
//   "category": "",
//   "mostwanted": true,
//   "stock": 1
// }, {
//   "id": 2,
//   "title": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ/SURBVDjLpZNfSFNRHMe/293umptu01GJMF1WQ5dRQgVl0UthYNHDiAQhChF6bdBLrz1Erz3Ug7CewqeoF0XzZVialnaXSHOYM2Ko6Szn3P2ze+/pnDMdodZLFw7n3nPP9/P7/n6/cyyEEPzPY9u5MDU1FdN1vatYLNroDDrzoWkam/sikUjnnoBEIuGhgl6v1xtxOCqgUhFME9wfdenzeTE4OHCTfu0GSJLUzsR+v7/O5XIhvZABi26aBCYxKYjAoDBVVfdOgW4eCAQCfEGWFRSpeDoxSQFmeVy6fIWnsSeA5SiKInK5XCmyYaA5fIJHJ1vRWbGrhRRmX3QSwd2CzdU4LErmFgcwskFFbBNrCrOekD7Q2eDR2b/AxSqcb7TD6e+CJ3gSv9IhJId6H5cdlGpF+GYGCLe08ujMRaUxAb9rCe7ac1j7+gWiRUNl1UG4awKesoNtAIfQyEzM353DCPkIvMF2qIt9ECss+CYlUVS0rCLnz5YBZbFRKhoDOPUEWmp1eBqvQck8g1XUYXfXY19hermQt7WfuvcmxQGsPdsnkllmKZDsKI4eWYfn8HUqfgqrXYeWC2IlPrZhyIWO1ui4VO4Cc8C6IAhCKe/V92io+Yn94avQlnohiATKej0W4+O08oXjoej4wnYbrVsOJkZGRpDP57GRjqPBR9tJ6rA4/QQmFGyu1WF5dAbPZwMIRccW/jwHHNDd3X1mbm6uo7+/fzKTfInmth44vr9F6vU7SINrmBn6CGfbA2Rl666DZNl5Gx/2HNPv37krwGpAGn6F+XQan8Q2ZFUHa3EyFos1/RNw40K13HrogO10UxDEro7KP1Zudzz6PP+36/wbU7aHpoSFkuUAAAAASUVORK5CYII=",
//   "price": "$775.90",
//   "description": "Introduction of Other Antineoplastic into POC, Endo",
//   "gallery": [
//     {
//       "picture-id": 1,
//       "picture-url": "http://dummyimage.com/131x100.png/dddddd/000000"
//     },
//     {
//       "picture-id": 2,
//       "picture-url": "http://dummyimage.com/131x100.png/dddddd/000001"
//     }

//   ],
//   "category": "",
//   "mostwanted": true,
//   "stock": 2
// }, {
//   "id": 3,
//   "title": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIpSURBVDjLpZNdaFJhGMcX9EExPVNn3Xcd3Ui3urnJbK4guiioiyjKPFm2QRSINZl2RDuprTZNaTLQ06ajizVhDILW+tpmYxXW6mKNXTSKGS2Xm+foP18vBjLRoosfLzzv//nxPC+8NQBq/oeyRfpAvYXVStMeXR2cWgoWtWT1hEJu+yuBXiG92nNYkg8cl8JfoPuoBEwrhXalOK/bL7NWFXRrqSSrEYNR1YJRi8DoJLC3yXGlUYqTCupnVQGjrIVLU4/RrmN4F7Ph85gfj90GXNDshaOByvdfO7SjqiCzMIVfk31YnuKwnBjE0qswUvMJuNQU3obo7RUFDpUol5qMIDUTQ3p2sEAU36ajSCU4uJrqhIor7NGFt9mVYv514CLWpoPIvH9U5PdMGM/vnoKjSb4m1wR2lhXIW7nibp2q3eCffMK4z1gCP/YB5uZ9IBmZ2rerRCA7OLCFnG/OMPCdbUAu/hHCracQrCMQLEMQbnDI9Y4g2HEEJEOyVGPv1pIJyEV2dBzpoQkIwWfgncPgLRyynWEIbBRZsw+CNwrhXmhDsiEgIxb3vd2HOdqNjDOGdWsY39vv4IvJidXrfqx3sJg7bUOmJ1LMkp5NghVXAMl2LxZNbnw1schc9mDF6MAizWBJb0fyEosfN/2bBS/uGxOkED9nz0/oHeDNkbKQ0eP6LoFkCz2zJW8w/9AgCrXQHq7NNEyC5ehvPv/yQQvtXRgwiCr+xn/hD7c3w4UciyonAAAAAElFTkSuQmCC",
//   "price": "$420.32",
//   "description": "Supplement Rectum with Nonaut Sub, Via Opening",
//   "gallery": [
//     {
//       "picture-id": 1,
//       "picture-url": "http://dummyimage.com/232x100.png/cc0000/ffffff"
//     }
//   ],
//   "category": "",
//   "mostwanted": true,
//   "stock": 3
// }, {
//   "id": 4,
//   "title": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAG2SURBVDjLY/j//z8DJZgsTUdmCkodmSV7eO8EkQayNN8+WPry3YOV/3d2ib0nVbMsUPPrT8/3/n9+Nun/1hbxP6Rolr99sOTtZ6DmD7cLwZrXVUt5kKb5xb7/P17U/b+4xu4/UHMRUYEI1KwK1PwOpvnSOgeQ5vlExQJQs8atA8UfPr+EaL662QWk+diSPDlWnAZsWjufedOaORyHZ0lrgzR/ebkfrPnWbm+Q5odAzYJY0wFQI+OmtXN5N62ZVbJpzYzrB2bIfX5zaxJY86NjYSDN34CaVbEmpN4lK5hWrJonBtS8ddOaeT82rZn9b8vSmn87u6X+393n///gdKP/QM3OOFNi95Jlks0Ll6+bOG/l//OXzv7/8+ny/09PD/zfPD/vHtTmVJxJuXfxErbW+UuyG6Yu+T9t15X/rQt2/k/t2vK/ctKa/0Utk7YuyFeXxpsX6qcvXdswe/3/tpXH/neuv/a/cu7J/9E9V//7Fi57n1w+QY1gZsppnfMvqWb6/8iSyf8Dcyb8907r+R+QO2tbbNHEIKJz46bF5SybFhVZbVqY17BpfqbEpnmpfJvmJfESYwAA/ZPGvT+K5AYAAAAASUVORK5CYII=",
//   "price": "$753.29",
//   "description": "Reposition Left Internal Mammary Artery, Perc Endo Approach",
//   "gallery": [
//     {
//       "picture-id": 1,
//       "picture-url": "http://dummyimage.com/172x100.png/cc0000/ffffff"
//     }
//   ],
//   "category": "",
//   "mostwanted": false,
//   "stock": 4
// }, {
//   "id": 5,
//   "title": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADPSURBVDjL3VIxCsJAEJyTaCmIYCFWfsMuviNPsAzkB/7E3gdob2+V1kKwsUmOmLu9c+8wASVocalcWGY5dmdmlxPWWoTEAIERNUWWZa0VIkJd16iqClJKn2VZ+iyKwmOe58L1itAVWgdpmtpfqs37q6dnB0mS2C+qxKonxtUnQT8OtvvbYTEdxl0NRBbaGChGpcBIeGjgfJHH3Wa59gRueDZut4ExFmTcIKcWjG4Q0JHhOvKk88kofrvB9a46lRRPKybQ2nii3m8Q/JX/gOAJ1Om5dnjvy8QAAAAASUVORK5CYII=",
//   "price": "$455.33",
//   "description": "Division of Right Shoulder Muscle, Perc Endo Approach",
//   "gallery": [
//     {
//       "picture-id": 1,
//       "picture-url": "http://dummyimage.com/132x100.png/cc0000/ffffff"
//     },
//     {
//       "picture-id": 2,
//       "picture-url": "http://dummyimage.com/139x100.png/5fa2dd/ffffff"
//     }
//   ],
//   "category": "",
//   "mostwanted": true,
//   "stock": 5
// }, {
//   "id": 6,
//   "title": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKVSURBVDjLfVNLSFRRGP7umTs+xubpTJQO4bRxoUGRZS1CCCa0oghatkpo4aZN0LJttIhx1UZs0aZ0UxaKgSFC0KZxhnxRaGqjiU7eUZur93n6z5lR0Kxz+e93H+f/vu//zzkK5xz/G+l0+rlt23csy1IJQSjDNE2BL5V/EWSz2SAl9IRCoduVlT4YlATXhZxNOeFwCMPDQ1APS85kMu0iORqN1tfU1OD7/BKEuutyuNwlIg6HyAzDgDo9PW04jlNBISft2hSoadpBy1hf14jIRfJKh/ymiuR4/AQKhQ2pzsXFhUsuQ7yQJiLhIN4OvEFT8xmpLv5JB4JVJD/sSdM0BYpC99JNooitzU08uXdOKo6nP0G4PX7tZsmBsCpUxcRwpBaMMSgUrBziWRBwx0WD8xGJBEPeaQQv94AJB9QTImDweDz7gpVRjsUBtLREcDLZhWOBLJzVdMmBVV4ehSnwqOqeukRRAuGFQAZR308EG5MoLgwhGCAHc68R2vZCFSyiIaIEoZg46pP1l4aC5Q0bTZFlBE9dh6NPoioax46TQ92lJiQ3xkoErFyniNmvf++LhmgAljZPAnlyVERFIA/s6Ciu7JQIvF4VjztPy+WxLBu6bpArF9VWDuGtQXirXbj2JJhbAJgf3DIx0zeHd7k4VOrk09HRD227G4Uw4vf7E7XWFHyY4HUdtxRuvofibGFiUIfXKMJDJaqtD7CyOIJ9Z6G7u/s+kdw433rxcrzQi/qWNpj5Z1DVICZGdAxOxqCxGO0DG9s2xH6Y2TsLqVQqRkuWam+/iiN+P5heAcWzBE9lDFPDv35/GV/tetQ79uJgf/YIyPo6xef+/ldnRSmNVWto/rGAoqabudm1zru93/oOO3h/ANOqi32og/qlAAAAAElFTkSuQmCC",
//   "price": "$345.13",
//   "description": "Excision of Right Tunica Vaginalis, Percutaneous Approach",
//   "gallery": [
//     {
//       "picture-id": 1,
//       "picture-url": "http://dummyimage.com/107x100.png/5fa2dd/ffffff"
//     },
//     {
//       "picture-id": 2,
//       "picture-url": "http://dummyimage.com/185x100.png/cc0000/ffffff"
//     }
//   ],
//   "category": "",
//   "mostwanted": true,
//   "stock": 6
// }, {
//   "id": 7,
//   "title": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKOSURBVDjLhZNPTBNBFMa/3e0/ty1tiZUChkZAESnGA54k4WRATQxJL2piYpR4UBNvnrwZPXjwiiHRBCVBUMJJ0UrlYtJEjI2JBCkEbLGhWGxh2+5u6W7XmY1LCkJ8ybcz+2bm9968mWE0TUM4HLaS9jzRxXK5fJS0h4lIt/yNtAukfUIU7u3tVbHDmMnJyWNk0rDX6z3u8/lgt9vB8zwoeGNjA7lcDolEAul0+iPxXQgGg8lthFAoNBWPx2k4bS8rlUpaNBrVRkZGBim4Uiz5tNXU1OB/Vl9fDxLkzE6/iTh10urqKmw2G6xWK8xms+4TRRGZTAbJZBJNTU0UgD0BJpMJ2WwWsizr/4qiQBAEFItFfYz6dgOwxl44jtMzcDgc8Hg8cLvdejEtFgtYlkVZVdFQnLInXnVPz/cHrm0BjAxoRFIsXSqZTGX4aL+0MI62didf13Ovw9kcePjlwZGebVswFlDRbPRFf4Gu/DQc3nm4Wk6jEJ+A2dlS7W4ojk3cbuzbAlRGNwBGBryyBFf7OajiDGz7D0JWf6K26wSvFLL9OoDKiG4AKzMT1SqUsj/Acmtg2AIsVWuALCK/UuRMdAI9KnITkUqlIEnSVoUt8jICmMK+WlJEJUMKtk6q5oRW2sT3F3PyzJxwnWZwJRKJjLa2ttr9fr9+DxiGgbj4Frz0Hgc6OqFthsCoOcy8FiRTbkXgyHhsUbh5eXhpjKFpDg0NHSKgu0RBcmQuenxt2jgaO7uxudZP7oELsx/y0udI6pZfll7a7By6BhM5/TFRQKUNDAw4SS2az/rePKvrPBVQ1iOYffc7/zX668bVp/PP/3mNOwGGfXp08r6j2tMnZgpSLJa+c+lxbHS3eX8A58zTPyvL4X4AAAAASUVORK5CYII=",
//   "price": "$444.50",
//   "description": "Excision of Right Pulmonary Artery, Open Approach",
//   "gallery": [
//     {
//       "picture-id": 1,
//       "picture-url": "http://dummyimage.com/194x100.png/dddddd/000000"
//     },
//     {
//       "picture-id": 2,
//       "picture-url": "http://dummyimage.com/220x100.png/ff4444/ffffff"
//     },
//     {
//       "picture-id": 3,
//       "picture-url": "http://dummyimage.com/241x100.png/dddddd/000000"
//     }
//   ],
//   "category": "",
//   "mostwanted": true,
//   "stock": 7
// }, {
//   "id": 8,
//   "title": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGdSURBVDjLlZNLSwJhFIa1Rb8iIWhRQUlluuoftDEtC5TKSgINily1CmoT0kJBqwlSaBGBLVxItGgZQQQVFe3bKN7wOjqO2tucwRGvqAMPMzDf+8w5ZzgyADLhGhJQCWi6MCwwQBkJWVWg4jguVSqVKuVyGe0Q3sPtdruaJZJAQ+FcLgeWZWuk02kkk0lEIhFREg6H4fF4GiR0yUlABwqFAorFongnstksUqkUotGoKMjn86CPMAwjSloEFJYgAQUymQxisVhLS9WZyBsEQhu1A/RMfUutxONxsZJQKNRZ0Ey9hCqheSQSid4F9RJqh2ZCor4EBM/z4lxIQvQtoCp2HtexfW+CObAM062uu4BCElSBJWjEzc8Vrr8Y6L3zvQsoTKz6F+H7PAPz7oLRp8eodmSjp7/geDqG2b8Me9CK8zcnXK8O7AWsmDtUF9UHUw/1gr+2O8BzsPm3YLvbhPPlBI7nI6xc6jC9P/Gr3B0flHZhVpgyKwQ6LpPFtwaTdwmGCy0MpwsVWsD6ZVKQpNs6z9iV35PWsY/q6iso+w9crJoc0rRwaAAAAABJRU5ErkJggg==",
//   "price": "$331.68",
//   "description": "Reposition Left Radius with Int Fix, Perc Endo Approach",
//   "gallery": [
//     {
//       "picture-id": 1,
//       "picture-url": "http://dummyimage.com/231x100.png/dddddd/000000"
//     },
//     {
//       "picture-id": 2,
//       "picture-url": "http://dummyimage.com/159x100.png/5fa2dd/ffffff"
//     },
//     {
//       "picture-id": 3,
//       "picture-url": "http://dummyimage.com/105x100.png/dddddd/000000"
//     }
//   ],
//   "category": "",
//   "mostwanted": false,
//   "stock": 8
// }, {
//   "id": 9,
//   "title": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALvSURBVDjLjZNvLNRxHMd/Tft50AOPqs1aTapJzp/8yYWaLM5k+a/F1F3FxXAidnIc53adc7j5uxo6OqX8PxcdZY7uWhJRD1pqrXWPCveb8ATvfq4yitaD95Pvvq/X5/t9f/clABCbpSv5CEnHWsNjWGvSncit9m0Jq3kMoybdcbEny3lRm33UqM11I/9LoE5xIGnQpJOxMN6UiNfNKdCXh6Kv4Jipr9CT/KdAk+ZI9mQ6m4bkQZh4wKOThomWDEy2Z2O4Ogo9BUyTJo9JbirQZDiRvXwXargsGJMP06GvCINW5IXHYm/oKqMw1iJAvyISLXxP6l66B7lB0JvlQmqzXSm9IgSTrZnQV0agX+qLt28mzOkW+aJPHgmDKgtdhSGo47pSVRddzBKCLoikC6L05WGYbOPTR42EVnIKL0deYHp6GrOzs5h6/w5NmT5oEwbjya0kNFwPgCyCQRWesSeJvjwPg74y/Nc9o2nYD+Njo5iZmTHDv5Oq8sGVehfUXvNDZ3EsKi57I9v3kIGgm2VpC5nLuqpoqIUnVj59nFqbvD7cBk/kq88jusYOJWwm+CcOLtNh/Swwj8nqyPUcUpTKVxYWFtYmJjceQ4LSDexaZ+S0R+LBiAIZD8/idMlu8AL3h/71jDKZbI6iKLMgiYY7XlWhdbTCDN4fKUNZfwaUhiJwVf5wl1guM0TbrDYIxGLxnMlkMgsu0fddhUu0qZD2JkH8KB5CNRsFmgTU6ESIveONg3nEEpH8lO3I6TwXE6UM7o+ShyzdHWzAqiTm9mE0vyiD6rkcSn0R6p7dpCWJqNYVIF7Fgm2uxTxDsC+NoOEvvO54CAauIbmbA44iDkajEaHVNghU7IFf6S54yawQV38cVYNCcBr9YSfagfDaADjx7L8T9OSBQIXvZy+hu+Ekz4sKvhr0lcvlfpBIJJBKpaB7QXFxMRzyt69cUPrBNsdyxV3gMEHD3w5cshkgtvqmf8ZGQMzvvWGBnXzCZv36D8sKlHMs9WAJAAAAAElFTkSuQmCC",
//   "price": "$950.79",
//   "description": "Dilate L Renal Art w 4+ Intralum Dev, Perc Endo",
//   "gallery": [
//     {
//       "picture-id": 1,
//       "picture-url": "http://dummyimage.com/176x100.png/cc0000/ffffff"
//     },
//     {
//       "picture-id": 2,
//       "picture-url": "http://dummyimage.com/211x100.png/dddddd/000000"
//     },
//     {
//       "picture-id": 3,
//       "picture-url": "http://dummyimage.com/135x100.png/dddddd/000000"
//     }
//   ],
//   "category": "",
//   "mostwanted": true,
//   "stock": 9
// }, {
//   "id": 10,
//   "title": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHrSURBVDjLjZOxaxNhGIcTtRkUJ/8AB9FBHBT8U3ToLAouxkUQLEIVnRxcKiithIjBBsSgRLgMGlNjvSOh4XJ4XLhwIRwpd+a4L1xMjEMfhy+aS6W2w2/4Pngefry8bwJI7EoSOAykaHdOTt+JvTL/UY+SNAYXML1POO4OnS5YLTCtMYb5FcO8j26cR7MX0OyFeYE2OkQjuESrBWEI4wmMxjAcgRiAH4Bu7GBaUDcFm5YzL9gcnaHdAUUBVQXPk4JoCCKSklDI+AG8Lv2YF5QbJepbEgiFBIYjGMTgQEAQQj+A/BtmAk2k0JoTKhtQrYJtQxTJhH/gEPpT2O9DLh8TbHQu0zRkZSHAdiQsdsF+AF4fPB9e5GKCiv6ZwluoVOTUe9sSjlf2+xJ2t8GyYTUTE+i2J4EQnA7UahKIV/Z8KS8W4eG6zlJGnQm+OB+wTDl5MeCvLF65aUC2AFfyadL5s9wpnJ4JitYpsrW7vKyqFNTvKLUh7rRy14V3H2EpMyG9tsj1anKvTUwCR2gExylZy1jfwO1BuQy3159xtXh0/1WGBO+7F6lqv3B70NDhwast0qVzB7sFxTmGYj3HNOWkH61G3MovHvyYFP0EiuZgt+Hx05/cyC7/D/5XkLNSrKg3ufcErq2t7AcDid88lUyCVhHVfwAAAABJRU5ErkJggg==",
//   "price": "$304.81",
//   "description": "Drainage of Left Posterior Tibial Artery, Open Approach",
//   "gallery": [
//     {
//       "picture-id": 1,
//       "picture-url": "http://dummyimage.com/236x100.png/5fa2dd/ffffff"
//     }
//   ],
//   "category": "",
//   "mostwanted": true,
//   "stock": 10
// }]

const getPictures = (req, res, next) => {
	try {
    const { producto } = req.query; 

		if (!producto) {
			return res.status(400).json({ error: 'Id is required', message: '' });
		}
    console.log(typeof(producto))

		// si id no es un numero
		if (isNaN(producto)) {
			return res
				.status(400)
				.json({ error: 'Id must be a number', message: '' });
		}

		const dbproducts = fs.readFileSync(
			__dirname + '/../data/products.json',
			'utf-8'
		);
		const products = JSON.parse(dbproducts);
		const product = products.find((product) => product.id === parseInt(producto));

		if (!product) {
			return res.status(404).json({ error: 'Product not found', message: '' });
		}

		res.status(200).json(product.gallery);
	} catch (error) {
		next(error);
	}
};

const getPicture = (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
			return res
				.status(400)
				.json({ error: 'Id must be a number', message: '' });
		}

    const dbproducts = fs.readFileSync(
      __dirname + '/../data/products.json',
      'utf-8'
    );
    const products = JSON.parse(dbproducts);
    
    const gallery = products.map((product) => product.gallery);
    const flattenGallery = gallery.flat(1);
    // Se quitan duplicados
    const uniqueGallery = [...new Set(flattenGallery)];
    const picture = uniqueGallery.find((picture) => picture['picture-id'] === parseInt(id));

    if (!picture) {
      return res.status(404).json({ error: 'Picture not found', message: '' });
    }

    res.status(200).json(picture);
  } catch (error) {
    next(error);
  }
};



module.exports = { getPictures, getPicture };
