1. navigate to localhost:3000/gui/PANDA:SEQ1

Dirty state in alarm icon
-------------------------
2. click in prescale field and observe alarm icon change to 'dirty' state

Attribute info pane
-------------------
3. click on table 'i' icon, see table in middle pane and attribute info in right.
4. edit any row (or add one); see the row's alarm icon and the local state discard button in the info pane (click this button and see the table revert to it's original state).

Table row alarm icon/info pane & sub-element url route
--------------------------------
5. click on the info icon for any row (add a new one first if necessary). See the route change in the top and the info pane change to row info.
6. try adding rows above and below

Refactor table local state
--------------------------
7. See table.reducer if desired (line 67, localState.value is now an array of row objects rather than an object of column arrays)

Attribute structure
-------------------
8. attributes now have raw property containing all information received from malcolm as-is and a calculated property for anything added by malcolmJS (note, tables also have a localState property)

