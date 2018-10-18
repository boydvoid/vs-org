import * as vscode from "vscode";
import * as moment from 'moment';
import { WindowMessage } from './showMessage';
module.exports = function () {
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
    const { document } = activeTextEditor;
    //get the date format from the settings
    //
    let position: number = activeTextEditor.selection.active.line;
    let current_line: vscode.TextLine = document.lineAt(position);
    let year: string | undefined;
    let month: string | undefined;
    let workspaceEdit = new vscode.WorkspaceEdit();
    let config = vscode.workspace.getConfiguration("vsorg");
    let dateFormat = config.get("dateFormat");

    //messages
    let fullDateMessage = new WindowMessage('warning', "Full date must be entered", false, false);
    let notADateMessage = new WindowMessage('warning', "That's not a valid date. ", false, false);

    if (current_line.text.includes("SCHEDULED:")) {
      let removeScheduled = current_line.text.replace(/\b(SCHEDULED)\b(.*)/, "").trimRight();

      workspaceEdit.delete(document.uri, current_line.range);

      //delete the completed line and move all the text below up

      //inset the new text
      workspaceEdit.insert(document.uri, current_line.range.start, removeScheduled);
      return vscode.workspace.applyEdit(workspaceEdit);
    }
    vscode.window
      .showInputBox({
        prompt: "Enter in number format, the year you would like this to be scheduled",
        placeHolder: "Year ex. 2018"
      })
      .then(input => {
        year = input;
        if (year !== undefined) {
          if (year.length === 2) {
            year = "20" + year;
          }
        }
        vscode.window
          .showInputBox({
            prompt: "Enter in number format, the month you would like this to be scheduled",
            placeHolder: "Month ex. 08 => August"
          })
          .then(input => {
            month = input;
            if (month !== undefined) {
              if (month.length === 1) {
                month = "0" + month;
              }
            }
            vscode.window
              .showInputBox({
                prompt: "Enter in number format, the day you would like this to be scheduled.",
                placeHolder: "Day ex. 08 => the eigth"
              })
              .then(input => {
                let day = input;

                if (year !== undefined && day !== undefined && month !== undefined) {
                  if (day.length === 1) {
                    day = "0" + day;
                  }

                  let checkDate = year + "/" + month + "/" + day;

                  //check to make sure the day number is the correct number
                  if (daysInMonth(month, year).toString() >= day) {

                    if (!moment(checkDate).isValid()) {
                      return notADateMessage.showMessage();
                    }
                  } else {
                    return notADateMessage.showMessage();
                  }
                  //add SCHEDULED: <DATE> TO THE LINE
                  //delete line
                  workspaceEdit.delete(document.uri, current_line.range);

                  //insert based on date format
                  if (dateFormat === "MM-DD-YYYY") {

                    workspaceEdit.insert(
                      document.uri,
                      current_line.range.start,
                      current_line.text + "    SCHEDULED: [" + month + "-" + day + "-" + year + "]"
                    );

                  } else if (dateFormat === "DD-MM-YYYY") {
                    workspaceEdit.insert(
                      document.uri,
                      current_line.range.start,
                      current_line.text + "    SCHEDULED: [" + day + "-" + month + "-" + year + "]"
                    );
                  }


                  return vscode.workspace.applyEdit(workspaceEdit).then(() => {
                    vscode.commands.executeCommand("workbench.action.files.save");
                  });
                } else {
                  fullDateMessage.showMessage();
                }
              });
          });
      });
  }
  function daysInMonth(month: any, year: any) {
    return new Date(year, month, 0).getDate();
  }
};
