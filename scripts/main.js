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
    setOverallInfoBox(overall_f);
    setNeowBox(neow_body_f);
    setRunsBox(all_runs_f);
}

/**
 * Async func that fetches file with html of overall info table and then calls multiple
 * functions to set up consistent style and readability of table.
 * @param {File} file 
 */
async function setOverallInfoBox(file) {
    let myObject = await fetch(file);                                                       // gets overal_wr_info.txt, waits till fetch returns value
    let myText = await myObject.text();                                                     // converts file into text, waits till myObject has value

    let h1_arr = document.querySelectorAll("#overall-box h1");                              // gets array of h1 elements that will display win %s
    let dialogs = document.querySelectorAll(".wr-ratio-dialog");                            // get dialog boxes to display win / games ratios
    let wr_info_arr = myText.replace('[[','').replace(']]','').split('], [');               // splits up wr info text from file into usuable 2d array
    for (let i in wr_info_arr) {                                                            // for wr array of each char (contains %, wins, games)
        /* creates new arr of wr info + convert to floats */                                       
        let wr = wr_info_arr[i].split(', ');                                                
        wr.forEach((item, index, arr) => {
            arr[index] = parseFloat(item);
        });
        
        let pct = Math.round(wr[0] * 100) + "%";                                            // converts decimal wr to % string
        h1_arr[i].innerText = pct;                                                          // sets h1s to hold/display the % strings

        let div = h1_arr[i].parentElement;                                                  // gets parent div of % h1s
        let img = div.querySelector("img");                                                 // gets character img\
        /* adds mouseover event to character imgs, so a dialog box of wins / games ratio hovers a bit up + to the right
           of the img when holding mouse over */
        img.addEventListener('mouseover', (event) => {
            let div_rect = div.getBoundingClientRect();                                     // gets size/relative position info of img/% parent div
            dialogs[i].style.bottom = (window.innerHeight - div_rect.top - 5) + "px";       // sets postion of dialog box to a bit up from div
            dialogs[i].style.left = div_rect.right + "px";                                  // and a bit right of div
            dialogs[i].innerHTML = "<h1>" + wr[1] + " / " + wr[2] + "<br>❤" + "</h1>";                // sets inner html to show wins/games of char
            dialogs[i].show();                                                              // shows dialog when hovering
        });
        /* adds event when mousing out of character image, hides win/games dialog box */
        img.addEventListener('mouseout', (event) => {                               
            dialogs[i].close();
        });
    }
}

/**
 * Async func that fetches file with html of neow bonus table body and then calls multiple
 * functions to set up consistent style, readabilty, and functionality of table.
 * @param {File} file 
 */
async function setNeowBox(file) {
    let myObject = await fetch(file);                                           // gets neow_body.txt, waits till fetch returns value
    let myText = await myObject.text();                                         // converts file into text, waits till myObject has value

    let nwTableDiv = document.getElementById("nw-body-div");                    // gets div that will hold body of neow bonus table
    nwTableDiv.innerHTML = myText;                                              // sets div's innnerHTML to hold table body

    let rows = document.getElementById("nw-body").querySelectorAll("tr")        // gets all rows of neow bonus table body

    /* sets row colors of neow table body to alternate colors for readability */
    resetRowColors(rows);              
    /* cleans up table rows and adds ids to them for later use */                                         
    setTableRows(rows);
    /* sets up neowBonuses dict to key to all table rows */
    createNeowBonusList(rows);
    /* sets up neow table search functionality  */
    setNeowSearch();
    /* sets up the neow bonus cost tables/dialog boxes that hover for bonuses w/ costs */
    setByCostTables(neow_by_cost_f);
}

/**
 * Async func that fetches file with html table header and table body of all runs and then 
 * makes multiple style changes and calls multiple functions to set up style, readability, 
 * and functionality of table.
 * @param {File} file 
 */
async function setRunsBox(file) {
    let myObject = await fetch(file);                                       // gets all_runs.txt, waits till fetch returns value
    let myText = await myObject.text();                                     // converts file into text, waits till myObject has value
    let tableStrings = myText.split(",");                                   // splits text into two html strings, for table head + body
    
    /* set runs table head html */
    let runsHeadDiv = document.getElementById("runs-tbl-head-div");
    runsHeadDiv.innerHTML = tableStrings[0];
    runsHeadDiv.querySelector("tr").cells[4].innerText = "❤";              // changes heart column title to heart emoji
    runsHeadDiv.querySelector("th").innerHTML = "Date";                     // changes first column title to "Date"
    /* set runs table body html */
    let runsTableDiv = document.getElementById("runs-table-div");
    runsTableDiv.innerHTML = tableStrings[1];
     
    let rows = document.querySelectorAll("#runs tr");                       // gets all run rows
    
    // add total/inital number of rows to filter button display
    let filterBtn = document.getElementById("filter-btn");
    filterBtn.innerHTML = filterLogoHtml + 'Filter (' + rows.length + ')';

    // fill filterValues array with tuple of filter values (character, heart, win) for each row
    setRunFilterValues(rows);
    // set colors/emojis/more info column of rows
    setRunsRows(rows);
    // sets up everything for filter button + filter menu
    setRunsFiltering();
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
 * Takes NodeList of run rows and creates and stores a tuple of the filter values for each run/row 
 * and adds nuemrical run id based on initial index.
 * filter values are: character, if went for heart, and if win or loss
 * @param {NodeList} rows 
 */
function setRunFilterValues(rows) {

    let i = 0;
    /* loops through each row and creates tuple of filter values, creates row id based on index, 
       adds tuple to filter array in order to match row id*/
    for (let row of rows) {
        /* example of filterArray = ['defect', 'yesH', 'Y'] */
        let filterArray = [(row.cells[1].innerText.split(' ')[0]).toLowerCase(), 
                            row.cells[4].innerText == "Yes" ? "yesH" : "noH", 
                            row.cells[5].innerText == "Y" ? "win" : "loss"]
        row.id = "" + i;                                                            // sets row id
        i++;                                                                        // increments index for row ids
        filterValues.push(filterArray);                                             // adds row's filter tuple to filterValues
    }
}

function setRunsFiltering() {

    setFilterDropdown();
    enableFiltering();
}

/**
 * Sets up display functionality of dropdown portions of runs filter menu.
 */
function setFilterDropdown() {
    /* SETS UP FUNCTIONALITY OF DROPDOWN SECTIONS OF FILTER MENU */
    let dropdownItems = document.querySelectorAll(".dropdown-item");    // gets all the filter menu sections that will have a dropdown menu
    /* set up event listener for the arrows and display of dropdown items */
    for (let item of dropdownItems) {                                   // loops through each filter menu section
        let head = item.querySelector(".dropdown-exp-head");            // gets title of filter section
        let list = item.querySelector(".dropdown-exp-list");            // gets first list item in that section

        if (head == null) continue;                                     // if no title (ie. is button section, skip

        let expand = "closed";                                          // stores value of whether menu section is "open" or "closed"
        /* adds onclick event to filter dropdown section title that changes arrow + display of section options */
        head.addEventListener("click", (event) => {
            /* if menu is closed, open/display dropdown section, change arrow to down facing, set to "open" */
            if (expand == "closed") {       
                head.querySelector(".exp-arrow").innerText = "🞃";
                list.style.display = "block";
                expand = "open";
            }
            /* if menu is open, close/undisplay dropdown section, change arrow to face left, set to "closed" */
            else if (expand == "open") {
                head.querySelector(".exp-arrow").innerText = "🞀";
                list.style.display = "none";
                expand = "closed";
            }
        });
    }
}

/**
 * Sets up actual filtering functionality of runs filter section, submit, and clear all button.
 */
function enableFiltering() {
    /* SETS UP FILTERING + SUBMIT BUTTON FUNCTIONALITY */
    let form = document.querySelector(".dropdown-content");                         // gets filter form element
    form.querySelector('[type="submit"]').addEventListener("click", addFilters);    // add form submission on submit click, triggers addFilters()

    /* function triggered by filter form submission*/
    function addFilters(event) {
        event.preventDefault();
        const formData = new FormData(form);                                        // stores filter form data

        let allRows = document.querySelectorAll("#runs tr");                        // stores NodeList of all run rows
        /* array of dicts for each filter category and whether each value is selected for filter 
           reset to all zeros with each form submission */
        let filters = [{"ironclad": 0, "silent": 0, "defect": 0, "watcher": 0},     
                       {"yesH": 0, "noH": 0},
                       {"win": 0, "loss": 0}];
        /* dict where keys are filter categories and values are whether theres a filter for it (pos if yes, 0 if not) 
           reset to all zeros with each form submission */
        let fCategories = {"char": 0, "heart": 0, "win": 0};                    

        let x = 0;                                                      // sets index of which category loop is on
        for (let c in fCategories) {                                    // for each filter category
            let i = 0;                                                  // sets counter of whether there is a filter for that cat
            for (let f of formData.getAll(c)) {                         // for each filter value in that category
                filters[x][f] = 1;                                      // marks filter as selected in filters array
                i++;                                                    // adds to filter counter
            }
            fCategories[c] = i;                                         // sets i to show whether there is filter 
            x++;                                                        // increment category index
        }  

        let numRows = allRows.length;                                   // stores # of rows to display on filter btn
        allRows.forEach(row => {                                        // for each run
            x = 0;                                                      // sets index of filter category
            for (let c of Object.values(fCategories)) {                 // for each filter category
                if (c) {                                                // if category has a filter selected
                    if (filters[x][filterValues[row.id][x]]) {          // and if the current row has value of one of filters selected in category
                        row.style.display = "table-row";                // display run/row
                    } else {                                            // if not selected
                        row.style.display = "none";                     // hide run/row
                        numRows--;                                      // subtract from # of rows
                        break;                                          // break loop to skip to next run
                    }
                }
                else {                                                  // if no filter selected for category
                    row.style.display = "table-row";                    // run/row gets displayed
                }
                x++;                                                    // increment category index
            }
        });

        let filterBtn = document.getElementById("filter-btn");                  // get filter button
        filterBtn.innerHTML = filterLogoHtml + 'Filter (' + numRows + ')';      // sets filter button to txt w/ new row total
    }
}