# Change Log

## [0.1.3] 10-18-18

`Added`

- Added the `DD-MM-YYYY` date format [Issue #73](https://github.com/robaboyd/vs-org/issues/73)
  - The setting can be changed under the VS-Org config in the Extension preferences
  - The already scheduled TODOs will update to the new format when the setting is changed

## [0.1.2] 10-12-18

`Fixed`

- Agenda view now shows on mac [Issue #65](https://github.com/robaboyd/vs-org/issues/65)

## [0.1.1] 10-10-18

`Changed`

-Syntax Highlighting update. The text on the line is now the same color as the heading

## [0.1.0] 10-8-18

`Added`

- Agenda View. Plan, and organize your taks in a easy to use interface.
- `ctrl+alt+s` keybind to schedule an item, saves the document as well
- `VS-Org: Agenda View` command
- Scheduling auto saves a file

`Changed`

- Completed Text goes on a new line
- Inserting `TODO` or `DONE` auto saves the file

## [0.0.8] 9-30-18

`Changed`

- The new .vsorg file now has focus when it's created

`Fixed`

- Vs-Org will now properly format the \* when the are typed (`editor.formatOnType` needed to be true, the extension sets this for .vsorg files automatically)
- Users no longer need to set `editor.inserFileNewline` to true, the extension does this by default

## [0.0.7] 9-28-18

`Changed`

- Syntax highlighting for `COMPLETED: DATE` is now the comment syntax (depending on your theme it's not so cluttered)
- `COMPLETED: DATE` is now appended to the end of the task that is completed

## [0.0.6] 9-27-18

`Changed`

- Syntax Highlighting for DONE on highlights the DONE keyword, no longer does full line
- The DONE date is now on its own line with `COMPLETED:`

`Fixed`

- Switching from DONE or TODO no longer removes other done or todos on the line

## [0.0.5] 9-27-18

`Changed`

- The default keybind for folding is now `tab`
- The default keybind for unfolding is now `shift+tab`
- Syntax highlighting for `#+` is now the selected themes comment color

`Fixed`

- Adding TODO, DONE or changing the level of the heading no longer get rid of special characters
- VS-Org Keybinds are only active when the file extension is .vsorg or .vso
- Fixed issue with `#` acting like a comment, `#+` is now a comment

## [0.0.4] 9-26-18

`Changed`

- Changed to proper version number

## [0.0.3] 9-25-18

`Added`

- Snippet adds an underline as a divider after #+TAGS

`Changed`

- Changed syntax highlighting for the TODO keyword. Only highlights TODO, not the rest of the line.

## [0.0.2] 9-25-18

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
