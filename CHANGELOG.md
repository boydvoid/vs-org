# Change Log

### [0.0.7]

`Changed`

- Syntax highlighting for `COMPLETED: DATE` is now the comment syntax (depending on your theme it's not so cluttered)
- `COMPLETED: DATE` is now appended to the end of the task that is completed

### [0.0.6]

`Changed`

- Syntax Highlighting for DONE on highlights the DONE keyword, no longer does full line
- The DONE date is now on its own line with `COMPLETED:`

`Fixed`

- Switching from DONE or TODO no longer removes other done or todos on the line

# [0.0.5]

`Changed`

- The default keybind for folding is now `tab`
- The default keybind for unfolding is now `shift+tab`
- Syntax highlighting for `#+` is now the selected themes comment color

`Fixed`

- Adding TODO, DONE or changing the level of the heading no longer get rid of special characters
- VS-Org Keybinds are only active when the file extension is .vsorg or .vso
- Fixed issue with `#` acting like a comment, `#+` is now a comment

# [0.0.4]

`Changed`

- Changed to proper version number

# [0.0.3]

`Added`

- Snippet adds an underline as a divider after #+TAGS

`Changed`

- Changed syntax highlighting for the TODO keyword. Only highlights TODO, not the rest of the line.

# [0.0.2]

`Added`

- Initial release

### Keybinds

- Typing \* , ** , or \*** will properly format to "⊖", "⊙", "⊘".
- alt+shift+upArrow will swap the BLOCK of text with the BLOCK of text above it.
- alt+shift+downArrow will swap the BLOCK of text with the BLOCK of text below it.
- shift+rightArrow will add TODO or DONE keyword
- shift+rightLeft will add DONE or TODO keyword
- Fold and Unfold code with default keybinds ctrl+shift+] or [
- alt+rightArrow will increment the level of the heading
- alt+leftArrow will decrement the level of the heading

### Commands

- Search by tags with the `VS-Org: Open By Tag` command
- Search by titles with the `VS-Org: Open By Title` command
- Change main directory with the `VS-Org: Change VS-Org Directory` command.
- Create a new file with the `VS-Org: Create new .vsorg file` command.
