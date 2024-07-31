import * as vscode from "vscode";
import { WindowMessage } from "./showMessage";

module.exports = function () {
  const { activeTextEditor } = vscode.window;
  if (!activeTextEditor || activeTextEditor.document.languageId !== "vso") {
    return;
  }

  const { document } = activeTextEditor;
  const position: number = activeTextEditor.selection.active.line;
  const currentLine: vscode.TextLine = document.lineAt(position);
  let workspaceEdit = new vscode.WorkspaceEdit();
  const config = vscode.workspace.getConfiguration("vsorg");

  const dateFormat = config.get<string[]>("dateFormat");

  // TODO: make a calendar widget

  // Messages
  const fullDateMessage = new WindowMessage(
    "warning",
    "Full date must be entered",
    false,
    false
  );
  const notADateMessage = new WindowMessage(
    "warning",
    "That's not a valid date.",
    false,
    false
  );

  if (currentLine.text.includes("SCHEDULED:")) {
    const removeScheduled = currentLine.text
      .replace(/\b(SCHEDULED)\b(.*)/, "")
      .trimRight();

    workspaceEdit.delete(document.uri, currentLine.range);
    workspaceEdit.insert(
      document.uri,
      currentLine.range.start,
      removeScheduled
    );
    return vscode.workspace.applyEdit(workspaceEdit);
  }

  async function getInput(
    prompt: string,
    placeHolder: string
  ): Promise<string | undefined> {
    return await vscode.window.showInputBox({ prompt, placeHolder });
  }

  (async function () {
    const year = await getInput(
      "Enter in number format, the year you would like this to be scheduled",
      "Year ex. 2018"
    );

    if (!year || year.length !== 4) {
      return fullDateMessage.showMessage();
    }

    const month = await getInput(
      "Enter in number format, the month you would like this to be scheduled",
      "Month ex. 08 => August"
    );

    if (!month || month.length > 2) {
      return fullDateMessage.showMessage();
    }

    const day = await getInput(
      "Enter in number format, the day you would like this to be scheduled.",
      "Day ex. 08 => the eighth"
    );

    if (
      !day ||
      day.length > 2 ||
      daysInMonth(parseInt(month), parseInt(year)) < parseInt(day)
    ) {
      return notADateMessage.showMessage();
    }

    const formattedDate =
      dateFormat?.[0] === "MM-DD-YYYY"
        ? `${month}-${day}-${year}`
        : `${day}-${month}-${year}`;

    workspaceEdit.delete(document.uri, currentLine.range);
    workspaceEdit.insert(
      document.uri,
      currentLine.range.start,
      `${currentLine.text}    SCHEDULED: [${formattedDate}]`
    );

    await vscode.workspace.applyEdit(workspaceEdit);
    vscode.commands.executeCommand("workbench.action.files.save");
  })();

  function daysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }
};
