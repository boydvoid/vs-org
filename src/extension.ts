"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { format } from "path";

const GO_MODE: vscode.DocumentFilter = { language: "vso", scheme: "file" };
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
class GoOnTypingFormatter implements vscode.OnTypeFormattingEditProvider {
  public provideOnTypeFormattingEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    ch: string,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): Thenable<vscode.TextEdit[]> {
    return new Promise((resolve, reject) => {
      let currentLine = document.lineAt(position);
      if (currentLine.text.indexOf("*") > -1) {
        for (var i = 0; i < currentLine.text.length; i++) {
          if (!currentLine.text.includes("⊖")) {
            if (currentLine.text === "* ") {
              const getRange = document.lineAt(position).range;
              let removeText = vscode.TextEdit.delete(getRange);
              let insertText = vscode.TextEdit.insert(position, "⊖");
              resolve([removeText, insertText]);
            }
          }
          if (!currentLine.text.includes("⊙")) {
            if (currentLine.text === "** ") {
              const getRange = document.lineAt(position).range;
              let removeText = vscode.TextEdit.delete(getRange);
              let insertText = vscode.TextEdit.insert(position, " ⊙");
              resolve([removeText, insertText]);
            }
          }

          //check to see if its already been formatted
          if (!currentLine.text.includes("✪")) {
            if (currentLine.text.includes("*** ")) {
              const getRange = document.lineAt(position).range;
              let removeText = vscode.TextEdit.delete(getRange);
              let insertText = vscode.TextEdit.insert(position, "   ✪");
              resolve([removeText, insertText]);
            }
          }
        }
      }
    });
  }
}

export function activate(ctx: vscode.ExtensionContext): void {
  ctx.subscriptions.push(
    vscode.languages.registerOnTypeFormattingEditProvider(
      GO_MODE,
      new GoOnTypingFormatter(),
      " "
    )
  );

  //commands
  vscode.commands.registerCommand("extension.addTodo", () => {
    
    addKeyword("⊖", "TODO");
    addKeyword(" ⊙", "TODO");
    addKeyword("   ✪", "TODO");
    addKeyword("⊖", "DONE");
    addKeyword(" ⊙", "DONE");
    addKeyword("   ✪", "DONE");
    
    });
    
    // add TODO and DONE keywords
    
    function addKeyword(char: string, keyword: string) {
      const { activeTextEditor } = vscode.window;
      if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
        const { document } = activeTextEditor;
        //active text editor
    //get the current line
    let position = activeTextEditor.selection.active.line;
    const getCurrentLine = document.lineAt(position);
    //get the text of the current line
    let currentLineText = getCurrentLine.text;
    //remove leading spaces
    let trimmedText = currentLineText.trim();
    //remove special characters
    let formattedText = trimmedText.replace(/[^\w\s!?]/g, "");
     let removedKeyword = formattedText.replace(/\b(DONE|TODO)\b/gi, "");
    if (currentLineText.includes(char)) {
      let edit = new vscode.WorkspaceEdit();
      let removeEdit = new vscode.WorkspaceEdit();
      edit.delete(document.uri, getCurrentLine.range);
          
      edit.insert(
        document.uri,
        getCurrentLine.range.start,
        char + " " + keyword + " " + formattedText
      );
      //remove the keyword 
      removeEdit.delete(document.uri, getCurrentLine.range);
          
      removeEdit.insert(
        document.uri,
        getCurrentLine.range.start,
        char + removedKeyword
      );
      //check to see if keyword exists if not return it
      if (keyword === "TODO" && !currentLineText.includes("TODO")) {
        return vscode.workspace.applyEdit(edit);
      } else if (keyword === "DONE" && !currentLineText.includes("DONE")) {
        return vscode.workspace.applyEdit(edit);
      } else {
       
        return vscode.workspace.applyEdit(removeEdit);
      }
    }
  }
  
}
