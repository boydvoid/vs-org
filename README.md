# VS-ORG (WIP)

![Version](https://img.shields.io/badge/version-v0.0.5-blue.svg)
[![Install](https://img.shields.io/badge/Marketplace-Install-green.svg)](https://marketplace.visualstudio.com/items?itemName=BobbyBoyd.vs-org)</br></br>
This is a work in progress extension that will, in the end, try to emulate [Emacs Org-Mode](https://orgmode.org/) as much as possible.

## Features

Quickly create todo lists, take notes, plan projects and organize your thoughts. Check out the full demo below.

Check out the recent changes in the [Change Log](https://github.com/robaboyd/vs-org/blob/master/CHANGELOG.md)

For upcoming features view the [Roadmap](https://github.com/robaboyd/vs-org/blob/master/roadmap.md)

FULL DEMO:  
<img src="https://github.com/robaboyd/vs-org/blob/master/Images/fullDemo.gif?raw=true" width="700" height="400" />

LINK TO HOW-TO:  
[How-To](https://github.com/robaboyd/vs-org/blob/master/howto.md)

## Install

To install Vs-Org, open Visual Studio Code, launch VS Code quick open (Ctrl + p or Cmd + p (mac)) and paste this `ext install BobbyBoyd.vs-org`

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
| `tab`                 | Fold                               |
| `shift+tab`           | Unfold                             |

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

## Authors

- Bobby Boyd - Maintainer/Creator

## License

This project is under the MIT License

---
