/*table border radius*/
const tableR = "5px";
const neowBonuses = {};
let costTblsHTML;
let nbLength;
let filterValues = [];
const filterLogoHtml = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="filter-icon" class="h-margin-r-tiny" color="currentColor" width="24"><path fill="currentColor" d="M8.94 14.11a3.89 3.89 0 0 1 3.8 3.06H22v1.66h-9.26a3.89 3.89 0 0 1-7.6 0H2v-1.66h3.15a3.89 3.89 0 0 1 3.8-3.06Zm0 1.67a2.22 2.22 0 1 0 0 4.44 2.22 2.22 0 0 0 0-4.44ZM14.5 3a3.89 3.89 0 0 1 3.8 3.06H22v1.66h-3.7a3.89 3.89 0 0 1-7.6 0H2V6.05h8.7A3.89 3.89 0 0 1 14.5 3Zm0 1.67a2.22 2.22 0 1 0 0 4.44 2.22 2.22 0 0 0 0-4.44Z"></path></svg>'

/**file declarations*/
let overall_f = "./scripts/overall_wr_info.txt";
let neow_body_f = "./scripts/neow_body.txt";
let neow_by_cost_f = "./scripts/neow-bycost-tables.txt";
let all_runs_f = "./scripts/all_runs.txt";

window.addEventListener('DOMContentLoaded', init);

function init() {
/**calls async functions with files to set up html + css for tables once files are loaded*/
//     jqueryTest();
    setOverallInfoBox(overall_f);
    setNeowBox(neow_body_f);
    setRunsBox(all_runs_f);
    setRunsFilterButton();
}

// /**
//  * JQUERY TESTS - IT WORKS!!
//  */
// function jqueryTest() {
//     $("h1").on("click", function(){
//         console.log("jquery!!");
//     });
// }

/**
 * Async func that fetches file with html of overall info table and then calls multiple
 * functions to set up consistent style and readability of table.
 * @param {File} file 
 */
async function setOverallInfoBox(file) {
    let myObject = await fetch(file);
    let myText = await myObject.text();

    let h1_arr = document.querySelectorAll("#overall-box h1");
    let dialogs = document.querySelectorAll(".wr-ratio-dialog");
    let wr_info_arr = myText.replace('[[','').replace(']]','').split('], [');
    for (let i in wr_info_arr) {
        // create arr of wr info + convert to floats
        let wr = wr_info_arr[i].split(', ');
        wr.forEach((item, index, arr) => {
            arr[index] = parseFloat(item);
        });
        // display wr percent
        let pct = Math.round(wr[0] * 100) + "%";
        h1_arr[i].innerText = pct;

        let div = h1_arr[i].parentElement;
        let img = div.querySelector("img");
        img.addEventListener('mouseover', (event) => {
            let div_rect = div.getBoundingClientRect();
            dialogs[i].style.bottom = (window.innerHeight - div_rect.top - 5) + "px";
            dialogs[i].style.left = div_rect.right + "px";
            dialogs[i].innerHTML = "<h1>" + wr[1] + " / " + wr[2] + "</h1>";
            dialogs[i].show();
        });
        img.addEventListener('mouseout', (event) => {
            dialogs[i].close();
        });
    }
}

/**
 * Async func that fetches file with html of neow bonus table body and then calls multiple
 * functions to set up consistent style and readability of table.
 * @param {File} file 
 */
async function setNeowBox(file) {
    let myObject = await fetch(file);
    let myText = await myObject.text();

    let nwTableDiv = document.getElementById("nw-body-div");
    nwTableDiv.innerHTML = myText;

    let rows = document.getElementById("nw-body").querySelectorAll("tr")

    resetRowColors(rows);
    setTableRows(rows);
    /** Body border set in style sheet. */

    createNeowBonusList(rows);
    setNeowSearch();

    setByCostTables(neow_by_cost_f);
}

async function setRunsBox(file) {
    let myObject = await fetch(file);
    let myText = await myObject.text();
    let tableStrings = myText.split(",");
    
    // set runs table head html
    let runsHeadDiv = document.getElementById("runs-tbl-head-div");
    runsHeadDiv.innerHTML = tableStrings[0];
    // set runs table body html
    let runsTableDiv = document.getElementById("runs-table-div");
    runsTableDiv.innerHTML = tableStrings[1];

    // add column titles to dates + heart
    let rows = document.querySelectorAll("#runs tr");
    runsHeadDiv.querySelector("tr").cells[4].innerText = "❤";
    runsHeadDiv.querySelector("th").innerHTML = "Date";

    // add total/inital number of rows to filter button display
    let filterBtn = document.getElementById("filter-btn");
    filterBtn.innerHTML = filterLogoHtml + 'Filter (' + rows.length + ')';

    // fill filterValues array with tuple of filter values (character, heart, win) for each row
    setRunFilterValues(rows);
    // set colors/emojis/more info column of rows
    setRunsRows(rows);
}

function setRunsRows(rows) {
    let lc = rows[0].cells.length - 1;

    for (let row of rows) {
        if (row.cells[lc].innerText == "N") {
            row.style.backgroundColor = "rgba(255, 0, 0, 0.075)";
            row.cells[1].innerHTML = "<p>" + row.cells[1].innerText + " &#128557;</p>"
        } else {
            row.style.backgroundColor = "rgba(120, 120, 120, 0.075)";
            row.cells[1].innerHTML = "<p>" + row.cells[1].innerText + " &#127881;</p>"
        }
        row.cells[lc].innerHTML = "<div class='run-btn'>&#x0095;&#x0095;&#x0095;</div>"
    }
}

function createNeowBonusList(rows) {

    for (let row of rows) {
        neowBonuses[row.querySelector("th").innerText] = row.outerHTML;
    }
    nbLength = Object.keys(neowBonuses).length;
}

function addCostTable(rowID, tblHTML) {
    let testRow = document.getElementById(rowID);
    let modal = document.getElementById("nw-cost-modal");
    let mousePos = {x: undefined, y: undefined};
    let test = document.getElementById("test");

    let timeout = null;
    testRow.addEventListener('mouseover', (event) => {
        timeout = setTimeout(test, 500, event);

        function test(event) {
            mousePos = {x: event.clientX, y: event.clientY};
            modal.style.top = (mousePos.y - 150) + "px";
            modal.style.left = mousePos.x + "px";
            modal.innerHTML = tblHTML;
            setTableRows(modal.querySelector("tbody").querySelectorAll("tr"));
            modal.show()
        }
    });

    testRow.addEventListener('mouseout', (event) => {
        clearTimeout(timeout);
        modal.close();
    });
}

async function setByCostTables(file) {
    let myObject = await fetch(file);
    let myText = await myObject.text();

    costTblsHTML = JSON.parse(myText);

    for (let t in costTblsHTML) {
        addCostTable(t.replaceAll("-T", ""), costTblsHTML[t]);
    }
}

/**
 * Function that takes a NodeList of table rows and cleans the index names, adds ids,
 * and alternates the background color. *Should NOT include head row of table*
 * @param {NodeList} rows 
 */
function setTableRows(rows, search = false) {
    let l = rows[0].cells.length;
    rows.forEach((row) => {
      if (!search) {
        let head = row.querySelector("th");
        head.innerText = head.innerText.replaceAll("_", " ");
        row.id = head.innerHTML.toLowerCase().replaceAll(" ", "-");

        let c = row.cells[l-1];
        c.innerText = Math.round(c.innerText * 100) + "%";
      }
    });
}

function resetRowColors (rows) {
    let i = 0;
    for (let row of rows) {
        if (i%2 == 0) {
            row.style.backgroundColor = "rgba(100,100,100, 0.15)";
            row.style.color = "rgb(115,115,115)";
        } else {
            row.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
            row.style.color = "black";
        }
        i++;
    }
}

/**
 * Takes head row of cells and sets border radius of farthest left and right table head
 * cells for rounded look.
 * @param {NodeList} cells 
 */
function setHeadBorder(cells) {
    cells[0].style.borderTopLeftRadius = tableR;
    cells[3].style.borderTopRightRadius = tableR;
}

/**
 * Takes the bottom row of a table and sets border radius of farthest left and right
 * cells for rounded look.
 * @param {NodeList} cells 
 */
function setBodyBorder(cells) {
    cells[0].style.borderBottomLeftRadius = tableR;
    cells[3].style.borderBottomRightRadius = tableR;
}

function setNeowSearch () {

    let neowBody = document.querySelector("#nw-body > tbody");
    let search = document.getElementById("nw-search-input");

    search.addEventListener("input", (event) => {

        let displayRows = "";
        for (let nb in neowBonuses) {
            if (nb.includes((search.value).toUpperCase())) {
                displayRows += neowBonuses[nb];
            }
        }
        neowBody.innerHTML = displayRows;
        let rows = neowBody.querySelectorAll("tr");
        resetRowColors(rows);
        resetCostTables(rows);
    });
}

function resetCostTables(rows) {
    for (let row of rows) {
        let tblHTML = costTblsHTML[row.id + "-T"];
        if (!(tblHTML == undefined))
            addCostTable(row.id, tblHTML);
    }

}

/**
 * Sets up functionality of runs filter dropdown menu, submit filter buttons, and filtering.
 */
function setRunsFilterButton(test) {

    // gets all the filter menu sections that will have a dropdown menu
    let dropdownItems = document.querySelectorAll(".dropdown-item");
    // set up event listener for the arrows and display of dropdown items
    for (let item of dropdownItems) {                               // loops through each filter menu section
        let head = item.querySelector(".dropdown-exp-head");        // gets title of filter section
        let list = item.querySelector(".dropdown-exp-list");        // gets first list item in that section

        if (head == null)                                           // if no title (ie. is button section, skip)
            continue;

        let exp = "closed";                                         // 
        head.addEventListener("click", (event) => {

            if (exp == "closed") {
                head.querySelector(".exp-arrow").innerText = "🞃";
                list.style.display = "block";
                exp = "open";
            }
            else if (exp == "open") {
                head.querySelector(".exp-arrow").innerText = "🞀";
                list.style.display = "none";
                exp = "closed";
            }
        });
    }

    let form = document.querySelector(".dropdown-content");
    form.querySelector('[type="submit"]').addEventListener("click", addFilters);

    function addFilters(event) {
        event.preventDefault();
        const formData = new FormData(form);

        let allRows = document.querySelectorAll("#runs tr");

        let filters = [{"ironclad": 0, "silent": 0, "defect": 0, "watcher": 0},
                       {"yesH": 0, "noH": 0},
                       {"win": 0, "loss": 0}];
        let fCategories = {"char": 0, "heart": 0, "win": 0};

        let x = 0;
        for (let c in fCategories) {
            let i = 0;
            for (let f of formData.getAll(c)) {
                filters[x][f] = 1;
                i++;
            }
            fCategories[c] = i;
            x++;
        }
        let numRows = allRows.length;
        allRows.forEach(row => {
            x = 0;
            for (let c of Object.values(fCategories)) {
                if (c) {
                    if (filters[x][filterValues[row.id][x]]) {
                        row.style.display = "table-row";
                    } else {
                        row.style.display = "none";
                        numRows--;
                        break;
                    }
                }
                else {
                    row.style.display = "table-row";
                }
                x++;
            }
        });
        let filterBtn = document.getElementById("filter-btn");
        filterBtn.innerHTML = filterLogoHtml + 'Filter (' + numRows + ')';
    }
}

function setRunFilterValues(rows) {

    // example filterArray = ['defect', 'yesH', 'Y']
    let i = 0;
    for (let row of rows) {
        let filterArray = [(row.cells[1].innerText.split(' ')[0]).toLowerCase(), row.cells[4].innerText == "Yes" ? "yesH" : "noH", row.cells[5].innerText == "Y" ? "win" : "loss"]
        row.id = "" + i;
        i++;
        filterValues.push(filterArray);
    }
}