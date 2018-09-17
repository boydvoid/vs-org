"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

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
              let insertText = vscode.TextEdit.insert(position, "⊖ ");
              resolve([removeText, insertText]);
            }
          }
          if (!currentLine.text.includes("⊙")) {
            if (currentLine.text === "** ") {
              const getRange = document.lineAt(position).range;
              let removeText = vscode.TextEdit.delete(getRange);
              let insertText = vscode.TextEdit.insert(position, "  ⊙ ");
              resolve([removeText, insertText]);
            }
          }

          //check to see if its already been formatted
          if (!currentLine.text.includes("✪")) {
            if (currentLine.text.includes("*** ")) {
              const getRange = document.lineAt(position).range;
              let removeText = vscode.TextEdit.delete(getRange);
              let insertText = vscode.TextEdit.insert(position, "    ✪ ");
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
}
