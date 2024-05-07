# [StS Stats Website](https://mhm1117.github.io/sts-stats/)
My Slay the Spire stats collected, cleaned, and nicely displayed.

## Keep in Mind
- do occasional checks for clean/clear html classes/ids/etc. and nested/clean/non-redundant css rules
- make sure runs seem up to date

## To-Do List

### Admin / Documentation
- [ ] Clean up project folders (esp. specs/scripts, rename jupityer notebook, like where html txt files from python are stored, where python stuff is stored, etc.)
- [ ] **IN PROGRESS** Improve Documentation of js file 
  - [ ] **IN PROGRESS** Add method headers to new + future functions
  - [ ] **IN PROGRESS** Add single line comments throughout code for future Mattie <3
### Features / Code / Design
- [ ] Make runs in run history clickable to bring up large dialog box of relic, card, etc. info. - need to gather info in Python first
- [ ] Start adding stuff to character pages, like detailed win rates/heart info/etc. and the making the page look clean and pretty
  - [ ] improve design of character pages
  - [ ] outline + start on basics of what character pages will consist of/content will look like
  - [ ] **Or maybe make it just open dialog box and you can expand if you want to? not sure what would look cooler/be more functional**
- [ ] Overall Info Box Display Edits
  - [x] When hovering maybe, show highest asc lvl heart kill for each chararacter
    - [x] in python code, writing alg to get runs that went for heart, then need to get highest asc lvl for each char from those
  - [ ] Add some kind of "click for more info/go to page" when hovering over character 

## Possible Fun Features/Designs
- [ ] Have some display of all wins / games ratio? Maybe in one of top corners? Or in run history section that gets changed when filtering?
- [ ] Make Overall Info + Neow Tables more minimalist and clean
  - [x] No table for overall info, just name of character on top and percent and/or ratio of wins/games below (maybe hover over percent to see dialog of wins/games, maybe diff colors for char names)
  - [x] No titles? ~~overall info~~, run history, neow, 
  - [x] Bigger rows for neow
  - [ ] **POSS DESIGN IN PROGRESS** Maybe change neow bonus + cost tables to be more interesting/colorful - in style of how neow bonus buttons look in game?
- [ ] Add sort by/filter feature for run history
  - [ ] sort by (date, asc lvl)
  - [x] filter (victory, character, heart)
  - [ ] maybe have filter affect displayed win rates/neows on right?
- [ ] Add tutorial to explain how to use site + what things mean
- [ ] Add settings section? idk what for yet but to toggle / change some things? 
- [ ] **PROB CANCELLED** Add cool transition effect for tabs in navbar

## Completed
- [x] Search function for neow's bonus box
- [x] Show dialog box w/ neow's bonus win rates by cost when hover/click bonus in list
  - [x] Dialog box of by cost table doesn't show up when search used - poss solution: save cost table
           htmls in list and access them by the rows that are in the list when resetting the rows post search
- [x] Add filter for runs w/ prismatic shard added in beginning
- [x] Style the run history of main page
- [x] Clean up style.css doc
  - [x] Nest rules (if can) as much as poss to make more readable/collapsable
- [x] Make it so clicking on a character img in overall info takes you to that character's page (got rid of tabs for now)
## Extras
### Unicode/Symbols
- ❤
- ⯅ ⯆ ⯇ black medium *X*-pointing triangle centred
- 🞁 🞃 🞀 black *X*-pointing isosceles right triangle
- ⮝ ⮟ ⮜ black *X*wards equilateral arrowhead
