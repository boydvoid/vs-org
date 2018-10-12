import * as vscode from "vscode";
import * as fs from "fs";
import * as os from "os";
import * as moment from "moment";
import * as path from "path";
import { WindowMessage } from "../showMessage";
module.exports = function () {
  vscode.commands.executeCommand("workbench.action.files.save").then(() => {
    let config = vscode.workspace.getConfiguration("vsorg");
    let folderPath = config.get("folderPath");
    let folder: any;
    let taskText: any;
    let taskTextGetTodo: any = "";
    let getDateFromTaskText: any;
    let convertedDateArray: any = [];
    let unsortedObject: any = {};
    let sortedObject: any = {};
    var itemInSortedObject: any = "";


    //call the function
    readFiles();

    function readFiles() {
      //read the directory
      fs.readdir(setMainDir(), (err, items: any) => {

        //loop through all of the files in the directory
        for (let i = 0; i < items.length; i++) {
          //make sure its a vsorg file
          if (items[i].includes(".vsorg")) {
            //read the file and puth the text in an array
            let fileText
            if (os.platform() === "darwin") {
              fileText = fs
                .readFileSync(setMainDir() + "\\" + items[i])
                .toString()
                .split(/\r?\n/);
            } else {

              fileText = fs
                .readFileSync(setMainDir() + "\\" + items[i])
                .toString()
                .split(/\r?\n/);
            }

            fileText.forEach(element => {
              // for each element check for scheduled and not done
              if (element.includes("SCHEDULED") && !element.includes("DONE")) {
                //get everything before scheduled
                taskText = element.trim().match(/.*(?=.*SCHEDULED)/g);
                //get todo
                taskTextGetTodo = element.match(/\bTODO\b/);
                //remove keywords and unicode chars
                taskText = taskText[0].replace("⊙", "");
                taskText = taskText.replace("TODO", "");
                taskText = taskText.replace("DONE", "");
                taskText = taskText.replace("⊘", "");
                taskText = taskText.replace("⊖", "");
                taskText = taskText.trim();
                //get the date
                getDateFromTaskText = element.match(/\[(.*)\]/);
                //if there is a TODO
                if (taskTextGetTodo !== null) {
                  taskText =
                    '<span class="filename">' +
                    items[i] +
                    ":</span> " +
                    '<span class="todo" data-filename="' +
                    items[i] +
                    '" data-text= "' +
                    taskText +
                    '" ' +
                    '" data-date= "' +
                    getDateFromTaskText[0] +
                    '"> ' +
                    taskTextGetTodo +
                    "</span>" +
                    '<span class="taskText">' +
                    taskText +
                    "</span>" +
                    '<span class="scheduled">SCHEDULED</span>';
                } else {
                  taskText =
                    '<span class="filename">' +
                    items[i] +
                    ":</span> " +
                    '<span class="taskText">' +
                    taskText +
                    "</span>" +
                    '<span class="scheduled">SCHEDULED</span>';
                }

                //get the day of the week for items scheduled in the future
                let d = new Date(getDateFromTaskText[1]).getDay();
                let nameOfDay;
                if (d === 0) {
                  nameOfDay = "Sunday";
                } else if (d === 1) {
                  nameOfDay = "Monday";
                } else if (d === 2) {
                  nameOfDay = "Tuesday";
                } else if (d === 3) {
                  nameOfDay = "Wednesday";
                } else if (d === 4) {
                  nameOfDay = "Thursday";
                } else if (d === 5) {
                  nameOfDay = "Friday";
                } else if (d === 6) {
                  nameOfDay = "Saturday";
                }

                convertedDateArray = [];
                if (new Date(getDateFromTaskText[1]).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {

                  if (nameOfDay !== undefined) {
                    convertedDateArray.push({
                      date:
                        '<div class="heading' +
                        nameOfDay +
                        " " +
                        getDateFromTaskText[0] +
                        '"><h4 class="' +
                        getDateFromTaskText[0] +
                        '">' +
                        getDateFromTaskText[0] +
                        ", " +
                        nameOfDay.toUpperCase() +
                        "</h4></div>",
                      text: '<div class="panel ' + getDateFromTaskText[0] + '">' + taskText + "</div>"
                    });
                  }
                } else {
                  //todays date for incomplete items in the past
                  var today: any = new Date();
                  var dd: any = today.getDate();
                  var mm: any = today.getMonth() + 1;
                  var yyyy: any = today.getFullYear();
                  var getDayOverdue: any = today.getDay();
                  var overdue: any;
                  if (dd < 10) {
                    dd = "0" + dd;
                  }

                  if (mm < 10) {
                    mm = "0" + mm;
                  }

                  today = mm + "-" + dd + "-" + yyyy;

                  if (getDayOverdue === 0) {
                    overdue = "Sunday";
                  } else if (getDayOverdue === 1) {
                    overdue = "Monday";
                  } else if (getDayOverdue === 2) {
                    overdue = "Tuesday";
                  } else if (getDayOverdue === 3) {
                    overdue = "Wednesday";
                  } else if (getDayOverdue === 4) {
                    overdue = "Thursday";
                  } else if (getDayOverdue === 5) {
                    overdue = "Friday";
                  } else if (getDayOverdue === 6) {
                    overdue = "Saturday";
                  }
                  //if date is a day in the past
                  if (new Date(getDateFromTaskText[1]).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {

                    convertedDateArray.push({
                      date:
                        '<div class="heading' +
                        overdue +
                        " " +
                        "[" +
                        today +
                        "]" +
                        '"><h4 class="' +
                        "[" +
                        today +
                        "]" +
                        '">' +
                        "[" +
                        today +
                        "]" +
                        ", " +
                        overdue.toUpperCase() +
                        "</h4></div>",
                      text:
                        '<div class="panel ' +
                        "[" +
                        today +
                        "]" +
                        '">' +
                        taskText +
                        '<span class="late">LATE: ' +
                        getDateFromTaskText[1] +
                        "</span></div>"
                    });
                  }
                }
                //converted array to object with date as keys
                convertedDateArray.forEach((element: any) => {
                  if (!unsortedObject[element.date]) {
                    unsortedObject[element.date] = "  " + element.text;
                  } else {
                    unsortedObject[element.date] += "  " + element.text;
                  }
                });
              }
            });
            //sort the object by date
            Object.keys(unsortedObject).forEach(function (key) {
              sortedObject[key] = unsortedObject[key];
            });
          }
        }

        Object.keys(sortedObject)
          .sort(function (a: any, b: any) {
            let first: any = moment(a.match(/\[(.*)\]/), "MM-DD-YYYY").toDate();
            let second: any = moment(b.match(/\[(.*)\]/), "MM-DD-YYYY").toDate();
            return first - second;
          })
          .forEach(function (property) {
            itemInSortedObject += property + sortedObject[property] + "</br>";
          });

        createWebview();
      });
    }

    /**
     * Get the Main Directory
     */
    function setMainDir() {
      if (folderPath === "") {
        let homeDir = os.homedir();
        if (os.platform() === "darwin") {
          folder = homeDir + "//VSOrgFiles";
        } else {

          folder = homeDir + "\\VSOrgFiles";
        }
      } else {
        folder = folderPath;
      }
      return folder;
    }

    function createWebview() {

      let reload = false;
      let fullAgendaView = vscode.window.createWebviewPanel(
        "fullAgenda",
        "Full Agenda View",
        vscode.ViewColumn.Beside,
        {
          // Enable scripts in the webview
          enableScripts: true
        }
      );

      // Set The HTML content
      fullAgendaView.webview.html = getWebviewContent(sortedObject);

      //reload on save
      vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
        reload = true;
        fullAgendaView.dispose();
      });

      fullAgendaView.onDidDispose(() => {
        if (reload === true) {
          reload = false;
          vscode.commands.executeCommand("extension.viewAgenda");
        }
      });

      // Handle messages from the webview
      fullAgendaView.webview.onDidReceiveMessage(message => {
        switch (message.command) {
          case "open":
            let fullPath = path.join(setMainDir(), message.text);
            vscode.workspace.openTextDocument(vscode.Uri.file(fullPath)).then(doc => {
              vscode.window.showTextDocument(doc, vscode.ViewColumn.One, false);
            });
            return;

          case "changeTodo":
            let textArray = message.text.split(",");
            let fileName = path.join(setMainDir(), textArray[1]);
            let text = textArray[2];
            let contents = fs.readFileSync(fileName, "utf-8");
            let x = contents.split(/\r?\n/);

            for (let i = 0; i < x.length; i++) {
              if (x[i].indexOf(text) > -1 && x[i].indexOf(textArray[3]) > -1) {
                let removeSchedule: any = x[i].match(/\bSCHEDULED\b(.*)/g);
                x[i] = x[i].replace(removeSchedule[0], "");
                x[i] = x[i].replace(
                  "TODO " + text,
                  "DONE " +
                  text +
                  "    SCHEDULED: " +
                  textArray[3] +
                  "\n   COMPLETED:" +
                  "[" +
                  new Date().toLocaleString() +
                  "]"
                );
                contents = x.join("\r\n");
                fs.writeFileSync(fileName, contents, "utf-8");
                return;
              }
            }

          case "changeDone":
            let textArrayD = message.text.split(",");
            let fileNameD = path.join(setMainDir(), textArrayD[1]);
            let textD = textArrayD[2];
            let contentsD = fs.readFileSync(fileNameD, "utf-8");
            let y = contentsD.split(/\r?\n/);

            for (let i = 0; i < y.length; i++) {
              if (y[i].indexOf(textD) > -1 && y[i].indexOf(textArrayD[3]) > -1) {
                let removeSchedule: any = y[i].match(/\bSCHEDULED\b(.*)/g);
                y[i] = y[i].replace(removeSchedule[0], "");
                y[i] = y[i].replace("DONE " + textD, "TODO " + textD + "    SCHEDULED: " + textArrayD[3]);
                y.splice(i + 1, 1);
                contentsD = y.join("\r\n");
                fs.writeFileSync(fileNameD, contentsD, "utf-8");
                return;
              }
            }
        }
      });
      errorMessage4.showMessage();
    }

    function getWebviewContent(task: keyof typeof sortedObject) {
      return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cat Coding</title>
            <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,700|Roboto:400,700" rel="stylesheet">
        </head>
        <style>
        body{
          font-family: 'Roboto', sans-serif;
        }
        .headingSunday {
          background-color: #2f6999;
          color: #ffffff;
          cursor: pointer;
          padding: 1px;
          padding-left: 10px;
          border: none;
          text-align: left;
          outline: none;
          
        }
        .headingMonday {
          background-color: #2f996e;
          cursor: pointer;
          padding: 1px;
          padding-left: 10px;
          border: none;
          text-align: left;
          outline: none;
          color: #ffffff;
        }
        .headingTuesday {
          background-color: #802f99;

          cursor: pointer;
          padding: 1px;
          padding-left: 10px;
          border: none;
          text-align: left;
          outline: none;
          color: #ffffff;
        }
        .headingWednesday {
          background-color: #992f2f;
          cursor: pointer;
          padding: 1px;
          padding-left: 10px;
          border: none;
          text-align: left;
          outline: none;
          color: #ffffff;
        }
        .headingThursday {
          background-color: #992f67;
        
          cursor: pointer;
          padding: 1px;
          padding-left: 10px;
          border: none;
          text-align: left;
          outline: none;
          color: #ffffff;
        }
        .headingFriday {
          background-color: #44992f;
          color: #ffffff;
          cursor: pointer;
          padding: 1px;
          padding-left: 10px;
          border: none;
          text-align: left;
          outline: none;

        }
        .headingSaturday {
          background-color: #3c2e96;
          color: #ffffff;
          cursor: pointer;
          padding: 1px;
          padding-left: 10px;
          border: none;
          text-align: left;
          outline: none;
        }

        .active, .accordion:hover {
            background-color: #ccc; 
        }

        .panel {
          padding-right: 10px;
          padding-bottom: 10px;    
          padding-bottom: 10px;
          background-color: white;
          overflow: hidden;
          color: #000000;
          border-bottom: 1px solid black;
          box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
          display: none;
        }

        .todo{ 
          color: #d12323;
          padding-left: 10px;
          font-weight: 700;
          float: left;
          padding-top: 13px;
          padding-bottom: -10px;
          height: 67%;
          transition: all .5s ease;
          cursor: pointer;
        }



        .done{
        color: #4286f4;
        padding-left: 10px;
        font-weight: 700;
        float: left;
        padding-top: 13px;
        padding-bottom: -10px;
        height: 67%;
        transition: all .5s ease;
        cursor: pointer;
        }

        .filename{
          font-size: 15px;
          font-weight: 700;
          float: left;
          margin-left: 10px;
          margin-top: 10px;
          cursor: pointer;
        }

        .filename:hover{
          color: #095fea;
        }
        .scheduled{
          background-color: #76E6E6;
          padding-left: 10px;
          padding-right: 10px;
          padding-top: 5px;
          color: #5d5d5d;
          font-weight: 700;
          border-radius: 27px;
          font-size: 9px;
          /* margin-left: auto; */
          height: 15px;
          float: right;
          margin-left: 10px;
          margin-top: 10px;
          box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        }

        .textDiv{
          width: 100%;
          margin: 0;
          height: 40px;
        }

        .taskText{
          font-size: 15px;
          float: left;
          margin-left: 10px;
          margin-top: 10px;
          width: 50%;
          font-family: 'Roboto Mono', sans-serif;
          font-weight: 400;
        }
        .late{
          background-color: #DF9930;

          padding-left: 10px;
          padding-right: 10px;
          padding-top: 5px;
          color: #ffffff;
          font-weight: 700;
          border-radius: 27px;
          font-size: 9px;
          /* margin-left: auto; */
          height: 15px;
          float: right;
          margin-left: 10px;
          margin-top: 10px;
          box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        }
        </style>
        <body>

        <h1>Agenda View</h1>
        <div id="display-agenda">
        ${itemInSortedObject}
        </div>
          

        <script>
        const vscode = acquireVsCodeApi();
        document.addEventListener('click', function(event) {
          
          let class0 = event.srcElement.classList[0];
          let class1 = event.srcElement.classList[1];
          let panels = document.getElementsByClassName('panel');

          //show or hide panels
          if (!event.srcElement.classList.contains('panel')) {
            for (let i = 0; i < panels.length; i++) {
              if (panels[i].classList.contains(class0) || panels[i].classList.contains(class1)) {
                if (panels[i].style.display === 'block') {
                  panels[i].style.display = 'none';
                } else {
                  panels[i].style.display = 'block';
                }
              }
            }
          }
          //send filename to open file 
          if (event.srcElement.classList.contains('filename')) {
            //send message to open text file
            vscode.postMessage({
              command: 'open',
              text: event.target.innerText.replace(':', "")
            });
          }
          //change TODO to DONE and vice versa
          if(event.target.innerText === "TODO"){
            event.target.innerText = "DONE";
            event.srcElement.classList.add('done');
            event.srcElement.classList.remove('todo');

            vscode.postMessage({
              command: 'changeTodo',
              text: event.target.innerText + "," + event.target.dataset.filename + "," + event.target.dataset.text + "," + event.target.dataset.date
            })
          } else if(event.target.innerText === "DONE") {
            event.target.innerText = "TODO";
            event.srcElement.classList.add('todo');
            event.srcElement.classList.remove('done');
            vscode.postMessage({
              command: 'changeDone',
              text: event.target.innerText + "," + event.target.dataset.filename + "," + event.target.dataset.text + "," + event.target.dataset.date
            })
          }
        });



</script>
</body>
</html>`;
    }
  });
};
