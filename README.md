# VS-ORG (WIP)

This is a work in progress extension that will, in the end, try to emulate [Emacs Org-Mode](https://orgmode.org/) as much as possible.

## Features

Quickly create todo lists, take notes, plan projects and organize your thoughts. Check out the full demo below.

FULL DEMO:  
<img src="https://github.com/robaboyd/vs-org/blob/master/Images/fullDemo.gif?raw=true" width="700" height="400" />

LINK TO HOW-TO:  
[How-To](https://github.com/robaboyd/vs-org/blob/master/howto.md)

## Requirements

Make sure you save your files with the .vsorg extension.

## Extension Settings

**IMPORTANT:** make sure you set `files.insertFinalNewline": true` in the settings, formatting will break if it's not set (working on a fix).

## Keybinds

| Keys                  | Decription                         |
| --------------------- | ---------------------------------- |
| `shift+rightArrow`    | add TODO or DONE Keyword           |
| `shift+leftArrow`     | add DONE or TODO keyword           |
| `shift+alt+UpArrow`   | Move Block of code Up              |
| `shift+alt+downArrow` | Move Block of code down            |
| `alt+rightArrow`      | Increment the level of the heading |
| `alt+leftArrow`       | Decrement the level of the heading |

## Snippets

| Snippet   | Decription         | Output                  |
| --------- | ------------------ | ----------------------- |
| `/header` | insert page header | #+ TITLE:</br> #+ TAGS: |
|           |                    |                         |

## Known Issues and Bugs

Submit an [Issue](https://github.com/robaboyd/vs-org/issues) if there is a bug you would like to report.

## Release Notes

### [0.0.5]

`Changed`

- The default keybind for folding is now `tab`
- The default keybind for unfolding is now `shift+tab`
- Syntax highlighting for `#+` is now the selected themes comment color

`Fixed`

- Adding TODO, DONE or changing the level of the heading no longer get rid of special characters
- VS-Org Keybinds are only active when the file extension is .vsorg or .vso
- Fixed issue with `#` acting like a comment, `#+` is now a comment

## Upcoming Features

Check out the [RoadMap](https://github.com/robaboyd/vs-org/blob/master/roadmap.md) for upcoming features.

---
