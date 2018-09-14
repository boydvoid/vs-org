"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
var fs = require("fs");
var path = require("path");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand("extension.sayHello", () => {
    const { activeTextEditor } = vscode.window;
    if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
      //active text editor
      const { document } = activeTextEditor;

      //get the current line
      let setCurrentLine = activeTextEditor.selection.active.line;
      const getCurrentLine = document.lineAt(setCurrentLine);
      //get the text of the current line
      let currentLineText = getCurrentLine.text;
      //remove special characters
      let formattedText = currentLineText.replace(/[^a-zA-Z0-9]/g, "");
      //set the tag
      let tag = getTag();
      function getTag() {
        if (currentLineText.indexOf("\u233e")) {
          for (var i = 0; i < currentLineText.length; i++) {
            if (currentLineText[i] === "\u233e") {
              return "#";
            }
          }
        }
        if (currentLineText.indexOf("#") !== -1) {
          for (var i = 0; i < currentLineText.length; i++) {
            if (currentLineText[i + 3] === "#") {
              return "h4";
            }
            if (currentLineText[i + 2] === "#") {
              return "h3";
            }
            if (currentLineText[i + 1] === "#") {
              return "h2";
            }
            return "h1";
          }
        }
      }

      //turn back into markdown
      if (tag === "\u233e") {
        const edit = new vscode.WorkspaceEdit();
        edit.delete(document.uri, getCurrentLine.range);
        edit.insert(
          document.uri,
          getCurrentLine.range.start,
          "#" + formattedText
        );
        return vscode.workspace.applyEdit(edit);
      }
      //h1
      if (tag === "h1") {
        const edit = new vscode.WorkspaceEdit();
        edit.delete(document.uri, getCurrentLine.range);
        edit.insert(
          document.uri,
          getCurrentLine.range.start,
          "\u2300" + formattedText
        );
        return vscode.workspace.applyEdit(edit);
      }
      //h2
      if (tag === "h2") {
        const edit = new vscode.WorkspaceEdit();
        edit.delete(document.uri, getCurrentLine.range);
        edit.insert(
          document.uri,
          getCurrentLine.range.start,
          "\u233e" + formattedText
        );
        return vscode.workspace.applyEdit(edit);
      }
    }
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
