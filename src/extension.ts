"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const GO_MODE: vscode.DocumentFilter = { language: "vso", scheme: "file" };
let characterArray: any = ["⊖ ", "⊙ ", "⊘ "];
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
      const { activeTextEditor } = vscode.window;
      if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
        const { document } = activeTextEditor;
        //get the current line
        let edit = new vscode.WorkspaceEdit();
        edit.insert(document.uri, position, "");
        let currentLine = document.lineAt(position);
        // only format if it has a *
        if (currentLine.text.indexOf("*") > -1) {
          //get the number of *

          let numOfAsterisk = currentLine.text.split("*").length - 1;
          console.log(numOfAsterisk);
          for (var i = 0; i < currentLine.text.length; i++) {
            //only format if it doesn't have the character
            // TODO clean this up
            if (!currentLine.text.includes("⊙") || !currentLine.text.includes("⊘") || !currentLine.text.includes("⊖")) {
              resolve(textEdit(setUnicodeChar(numOfAsterisk), position, document, numOfSpaces(numOfAsterisk)));
            }
          }
        }
      }
    });
  }
}

/**
 * Get the number of asterisks that are on the line and return
 * the corrisponding unicode character
 *
 * @param asterisks Get the number of asterisks
 *
 * @returns {array} the first item in the characters array
 */
function setUnicodeChar(asterisks: any) {
  let characters: any = ["⊖ ", "⊙ ", "⊘ "];
  for (let i = 0; i < asterisks; i++) {
    characters.push(characters.shift());
  }
  return characters[0];
}

// text edit function
function textEdit(char: any, position: any, document: any, spaces: any) {
  const getRange = document.lineAt(position).range;
  let removeText = vscode.TextEdit.delete(getRange);
  let insertText = vscode.TextEdit.insert(position, spaces + char);
  return [removeText, insertText];
}

// number of spaces to add function
function numOfSpaces(asterisk: number) {
  let spacesArray = [];
  for (let i = 0; i < asterisk; i++) {
    spacesArray.push(" ");
  }
  return spacesArray.join("");
}
//activate function, format on space bar press
export function activate(ctx: vscode.ExtensionContext): void {
  ctx.subscriptions.push(
    vscode.languages.registerOnTypeFormattingEditProvider(GO_MODE, new GoOnTypingFormatter(), " ")
  );
}
//---commands---------------//
// TODO Clean up functions, make them readable
// TODO alt+arrow command shift heading size (depth?)
// TODO alt+ up or down arrow move entire blocks
//shift + right
vscode.commands.registerCommand("extension.toggleStatusRight", () => {
  addKeywordRight("⊖ ");
  addKeywordRight("⊙ ");
  addKeywordRight("⊘ ");
});

/**
 * Name: addKeywordRight
 * Description: Add or remove TODO or DONE keyword when the shift+Right is pressed
 */
function addKeywordRight(char: string) {
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
    const { document } = activeTextEditor;
    //get the current line
    let position = activeTextEditor.selection.active.line;
    const getCurrentLine = document.lineAt(position);

    //get the text of the current line
    let currentLineText = getCurrentLine.text;
    let removeDate = currentLineText.substring(currentLineText.indexOf("["), currentLineText.indexOf("]"));
    let datelessText = currentLineText.replace(removeDate, "");
    //remove special characters and leading and trailing spaces
    let formattedText = datelessText.replace(/[^\w\s!?]/g, "").trim();

    let getLeadingSpace = currentLineText.substr(0, currentLineText.indexOf(char));

    let date = new Date().toLocaleString();

    console.log(removeDate);

    //make sure there is a character
    if (currentLineText.includes(char)) {
      let edit = new vscode.WorkspaceEdit();
      let removeEdit = new vscode.WorkspaceEdit();
      edit.delete(document.uri, getCurrentLine.range);

      if (currentLineText.includes("DONE")) {
        //remove the keyword
        console.log(datelessText);
        let removedKeyword = formattedText.replace(/\b(DONE|TODO)\b/gi, "").trim();
        removeEdit.delete(document.uri, getCurrentLine.range);
        removeEdit.insert(document.uri, getCurrentLine.range.start, getLeadingSpace + char + removedKeyword);
        return vscode.workspace.applyEdit(removeEdit);
      } else if (!currentLineText.includes("TODO")) {
        edit.insert(document.uri, getCurrentLine.range.start, getLeadingSpace + char + "TODO " + formattedText);
      } else if (!currentLineText.includes("DONE")) {
        let removeTodo = formattedText.replace(/\b(TODO)\b/gi, "").trim();

        edit.insert(
          document.uri,
          getCurrentLine.range.start,
          getLeadingSpace + char + "DONE " + "[" + date + "] " + removeTodo
        );
      }
      return vscode.workspace.applyEdit(edit);
    }
  }
}

//shift + left
vscode.commands.registerCommand("extension.toggleStatusLeft", () => {
  addKeywordLeft("⊖ ");
  addKeywordLeft("⊙ ");
  addKeywordLeft("⊘ ");
});

/**
 * Name: addKeywordLeft
 * Description: Add or remove TODO or DONE keyword when the shift+Left is pressed
 */
function addKeywordLeft(char: string) {
  const { activeTextEditor } = vscode.window;

  if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
    const { document } = activeTextEditor;

    //get the current line
    let position = activeTextEditor.selection.active.line;
    const getCurrentLine = document.lineAt(position);

    //get the text of the current line
    let currentLineText = getCurrentLine.text;

    let removeDate = currentLineText.substring(currentLineText.indexOf("["), currentLineText.indexOf("]"));
    // remove the date from the text
    let datelessText = currentLineText.replace(removeDate, "");
    //remove special characters
    let formattedText = datelessText.replace(/[^\w\s!?]/g, "").trim();

    // count how many spaces there was in front of the unicode char
    let getLeadingSpace = currentLineText.substr(0, currentLineText.indexOf(char));

    let date = new Date().toLocaleString();

    if (currentLineText.includes(char)) {
      let edit = new vscode.WorkspaceEdit();
      let removeEdit = new vscode.WorkspaceEdit();
      edit.delete(document.uri, getCurrentLine.range);
      if (currentLineText.includes("TODO")) {
        //remove the keyword
        let removedKeyword = formattedText.replace(/\b(DONE|TODO)\b/gi, "").trim();
        removeEdit.delete(document.uri, getCurrentLine.range);
        removeEdit.insert(document.uri, getCurrentLine.range.start, getLeadingSpace + char + removedKeyword);

        return vscode.workspace.applyEdit(removeEdit);
      } else if (!currentLineText.includes("DONE")) {
        edit.insert(
          document.uri,
          getCurrentLine.range.start,
          getLeadingSpace + char + "DONE " + "[" + date + "] " + formattedText
        );
      } else if (!currentLineText.includes("TODO")) {
        let removeDone = formattedText.replace(/\b(DONE)\b/gi, "").trim();
        edit.insert(document.uri, getCurrentLine.range.start, getLeadingSpace + char + "TODO" + " " + removeDone);
      }
      return vscode.workspace.applyEdit(edit);
    }
  }
}

//alt + up
vscode.commands.registerCommand("extension.moveBlockUp", () => {
  var x = moveBlock(characterArray, "up");
  if (x) {
    moveToCorrectLine(x);
  }
});

function moveToCorrectLine(move: any) {
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && activeTextEditor.document.languageId === "vso" && move) {
    console.log(move);
    activeTextEditor.selection = move;
  }
}

vscode.commands.registerCommand("extension.moveBlockDown", () => {
  moveBlock(characterArray, "down");
});

/**
 *
 * @param characterArray
 * @returns apply workspace edit
 */
function moveBlock(characterArray: any, direction: any) {
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
    const { document } = activeTextEditor;
    let char: any = characterDecode(characterArray);

    let position = activeTextEditor.selection.active.line;
    const getCurrentLine = document.lineAt(position);
    let currentLineText = getCurrentLine.text;
    let lineCount = document.lineCount;
    let start = new vscode.Position(position, 0);

    let getLeadingSpace = currentLineText.search(/\S/);
    let textUpEndPos: any;
    let textDownEndPos: any;
    let textToMoveUp: any;
    let textToMoveDown: any;
    let edit = new vscode.WorkspaceEdit();

    if (currentLineText.includes(char) && document.lineAt(position - 1).text !== "") {
      for (let i = position; i <= lineCount; i++) {
        if (position !== lineCount - 1) {
          let nextLine = document.lineAt(i + 1);

          if (getLeadingSpace < nextLine.text.search(/\S/)) {
          } else if (nextLine.text.search(/\S/) <= getLeadingSpace) {
            textUpEndPos = new vscode.Position(i + 1, 0);
            if (direction === "up") {
              textToMoveUp = document.getText(new vscode.Range(start, textUpEndPos));
            } else {
              textToMoveDown = document.getText(new vscode.Range(start, textUpEndPos));
            }
            break;
          }
        } else {
          textUpEndPos = new vscode.Position(i + 1, 0);
          if (direction === "up") {
            textToMoveUp = document.getText(new vscode.Range(start, textUpEndPos));
          } else {
            textToMoveDown = document.getText(new vscode.Range(start, textUpEndPos));
          }
        }
      }

      if (direction === "up") {
        for (let i = position; i >= 0; i--) {
          if (position !== 1) {
            let previousLine = document.lineAt(i - 1);
            console.log(i);
            console.log(previousLine);
            console.log(previousLine.text.search(/\S/));

            if (getLeadingSpace < previousLine.text.search(/\S/)) {
              //console.log(document.lineAt(start.line).text)
            } else if (previousLine.text.search(/\S/) <= getLeadingSpace) {
              textDownEndPos = new vscode.Position(i - 1, 0);

              textToMoveDown = document.getText(new vscode.Range(start, textDownEndPos));
              break;
            }
          } else {
            textDownEndPos = new vscode.Position(i - 1, 0);

            textToMoveDown = document.getText(new vscode.Range(start, textDownEndPos));
          }
        }
      } else {
        for (let i = textUpEndPos.line; i <= lineCount; i++) {
          if (position !== lineCount - 1) {
            let nextLine = document.lineAt(i + 1);

            if (getLeadingSpace < nextLine.text.search(/\S/)) {
            } else if (nextLine.text.search(/\S/) <= getLeadingSpace) {
              textDownEndPos = new vscode.Position(i + 1, 0);
              textToMoveUp = document.getText(new vscode.Range(textUpEndPos, textDownEndPos));
              break;
            }
          } else {
            textDownEndPos = new vscode.Position(i + 1, 0);
            textToMoveUp = document.getText(new vscode.Range(start, textDownEndPos));
          }
        }
      }
    }

    if (direction === "up") {
      edit.replace(document.uri, new vscode.Range(start, textUpEndPos), textToMoveDown);
      edit.replace(document.uri, new vscode.Range(textDownEndPos, start), textToMoveUp);
      let s = new vscode.Selection(textDownEndPos, textDownEndPos);
      vscode.workspace.applyEdit(edit).then(undefined => {
        moveToCorrectLine(s);
      });
    } else {
      edit.replace(document.uri, new vscode.Range(start, textUpEndPos), textToMoveUp);
      edit.replace(document.uri, new vscode.Range(textUpEndPos, textDownEndPos), textToMoveDown);
      vscode.workspace.applyEdit(edit);
    }
  }
}

function characterDecode(characterArray: any) {
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
    const { document } = activeTextEditor;

    let position = activeTextEditor.selection.active.line;
    const getCurrentLine = document.lineAt(position);
    let currentLineText = getCurrentLine.text;

    for (let i = 0; i < characterArray.length; i++) {
      if (currentLineText.includes(characterArray[i])) {
        return characterArray[i];
      }
    }
  }
}
