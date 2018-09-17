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
      console.log("anything");

      const { activeTextEditor } = vscode.window;
      if (activeTextEditor) {
        let currentLine = activeTextEditor.selection.active.line;
        let line = document.lineAt(currentLine);

        const tEdit = [new vscode.TextEdit(line.range, "hi")];
        // if (activeTextEditor) {

        //   let text = line.text;
        //   if (line.text.startsWith("*")) {
        //     for (var i = 0; i < text.length; i++) {
        //       if (text[i + 2] === "*" && text[i + 3] === "*") {
        //         edit.delete(document.uri, line.range);
        //         edit.insert(document.uri, line.range.start, "    ✪ ");
        //         format = vscode.workspace.applyEdit(edit)
        //       }
        //       if (text[i + 1] === "*" && text[i + 2] === "*") {
        //         edit.delete(document.uri, line.range);
        //         edit.insert(document.uri, line.range.start, "    ✪ ");
        //       }
        //       if (text[i + 1] === "*") {
        //         edit.delete(document.uri, line.range);
        //         edit.insert(document.uri, line.range.start, "    ✪ ");
        //       }
        //     }
        //   }
        // }
        resolve(tEdit);
      }
    });
  }
}

export function activate(ctx: vscode.ExtensionContext): void {
  ctx.subscriptions.push(
    vscode.languages.registerOnTypeFormattingEditProvider(
      GO_MODE,
      new GoOnTypingFormatter(),
      "*hi"
    )
  );
}
