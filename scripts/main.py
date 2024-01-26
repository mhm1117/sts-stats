import pandas as pd
import json
import os
import matplotlib.pyplot as plt
from pyscript import Element
from js import addRowIds, getWinRateColumn

f = open("./scripts/overall_df.txt", "r")
overall_df = f.read()
f.close()

overall_info = Element("overall-info")
overall_info.element.innerHTML = overall_df

addRowIds()
getWinRateColumn()

def helloWorld():
    return "Hello World!"

#display(helloWorld(), target="overall-info")
