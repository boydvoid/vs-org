import * as vscode from "vscode";

module.exports = function() {
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
    const { document } = activeTextEditor;
    //get the date format from the settings
    let config = vscode.workspace.getConfiguration("vsorg");
    let dateFormat = config.get("dateFormat");

    //
    let position: number = activeTextEditor.selection.active.line;
    let current_line: vscode.TextLine = document.lineAt(position);
    let year: string | undefined;
    let day;
    let month: string | undefined;
    let workspaceEdit = new vscode.WorkspaceEdit();
    if (current_line.text.includes("DONE")) {
      vscode.window.showErrorMessage("Cant schedule a DONE item.");
    } else {
      if (current_line.text.includes("SCHEDULED:")) {
        let removeScheduled = current_line.text.replace(/\b(SCHEDULED)\b(.*)/, "").trim();

        workspaceEdit.delete(document.uri, current_line.range);

        //delete the completed line and move all the text below up

        //inset the new text
        workspaceEdit.insert(document.uri, current_line.range.start, removeScheduled);
        return vscode.workspace.applyEdit(workspaceEdit);
      }
      vscode.window
        .showInputBox({
          prompt: 'In "yyyy" format enter in the year you would like this to be scheduled',
          placeHolder: "Year ex. 2018"
        })
        .then(input => {
          year = input;

          vscode.window
            .showInputBox({
              prompt: 'In "mm" format enter in the month you would like this to be scheduled',
              placeHolder: "Month ex. 08 => August"
            })
            .then(input => {
              month = input;

              vscode.window
                .showInputBox({
                  prompt: 'In "dd" format enter in the day you would like this to be scheduled',
                  placeHolder: "Day ex. 08 => the eigth"
                })
                .then(input => {
                  day = input;

                  //add SCHEDULED: <DATE> TO THE LINE
                  if (year !== undefined && day !== undefined && month !== undefined) {
                    //delete line
                    workspaceEdit.delete(document.uri, current_line.range);

                    //insert based on date format
                    if (dateFormat === "YYYY-MM-DD") {
                      workspaceEdit.insert(
                        document.uri,
                        current_line.range.start,
                        current_line.text + "    SCHEDULED: <" + year + "-" + month + "-" + day + ">"
                      );
                    } else if (dateFormat === "MM-DD-YYYY") {
                      workspaceEdit.insert(
                        document.uri,
                        current_line.range.start,
                        current_line.text + "    SCHEDULED: <" + month + "-" + day + "-" + year + ">"
                      );
                    } else {
                      workspaceEdit.insert(
                        document.uri,
                        current_line.range.start,
                        current_line.text + "    SCHEDULED: <" + day + "-" + month + "-" + year + ">"
                      );
                    }
                    return vscode.workspace.applyEdit(workspaceEdit);
                  } else {
                    vscode.window.showWarningMessage("Full Date must be entered");
                  }
                });
            });
        });
    }
  }
};
