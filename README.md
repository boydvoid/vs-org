# VS-ORG (WIP)

![Version](https://img.shields.io/badge/version-v0.0.8-blue.svg)
[![Install](https://img.shields.io/badge/Marketplace-Install-green.svg)](https://marketplace.visualstudio.com/items?itemName=BobbyBoyd.vs-org)</br></br>
This is a work in progress extension that will, in the end, try to emulate [Emacs Org-Mode](https://orgmode.org/) as much as possible.

> Quickly create todo lists, take notes, plan projects and organize your thoughts. Check out the full demo below.

## Features

Check out the HOW-TO for all of the available featuers:</br>
[How-To](https://github.com/robaboyd/vs-org/blob/master/howto.md)

Introducing Agenda View! Schedule your tasks with `ctrl+alt+s`, run the `VS-Org: Agenda View` command and see all of your scheduled tasks in one clean interface, organized by date. Watch the Agenda View Demo: </br>

Check out the recent changes in the [Change Log](https://github.com/robaboyd/vs-org/blob/master/CHANGELOG.md)

For upcoming features view the [Roadmap](https://github.com/robaboyd/vs-org/blob/master/roadmap.md)

FULL DEMO:  
<img src="https://github.com/robaboyd/vs-org/blob/master/Images/fullDemo.gif?raw=true" width="700" height="400" />

## Install

To install Vs-Org, open Visual Studio Code, launch VS Code quick open (Ctrl + p or Cmd + p (mac)) and paste this `ext install BobbyBoyd.vs-org`

## Requirements

Make sure you save your files with the .vsorg extension.

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
| `ctrl+alt+s`          | Schedule an item                   |

## Snippets

| Snippet   | Decription         | Output                  |
| --------- | ------------------ | ----------------------- |
| `/header` | insert page header | #+ TITLE:</br> #+ TAGS: |
|           |                    |                         |

## Known Issues and Bugs

Submit an [Issue](https://github.com/robaboyd/vs-org/issues) if there is a bug you would like to report.

## Release Notes

### [0.1.0]

`Added`

- Agenda View. Plan, and organize your taks in a easy to use interface.
- `ctrl+alt+s` keybind to schedule an item, saves the document as well
- `VS-Org: Agenda View` command
- Scheduling auto saves a file

`Changed`

- Completed Text goes on a new line
- Inserting `TODO` or `DONE`  auto saves the file

## Upcoming Features

Check out the [RoadMap](https://github.com/robaboyd/vs-org/blob/master/roadmap.md) for upcoming features.

## Authors

- Bobby Boyd - Maintainer/Creator

## License

This project is under the MIT License

---
