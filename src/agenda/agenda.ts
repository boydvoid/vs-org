import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import * as moment from 'moment';
import * as path from 'path';
module.exports = function() {
  let config = vscode.workspace.getConfiguration('vsorg');
  let checkFolder = config.get('folderPath');
  let folder: any;
  let dateArray: any[] = [];
  let textArray: string[] = [];
  let taskPureText: any;
  let getDate: any;
  let convertedDateArray: any = [];
  let unsortedObject: any = {};
  let sortedObject: any = {};
  var test: any = '';
  let taskTextGetTodo: any = '';
  let taskTextGetDone: any = '';
  readFiles();

  function readFiles() {
    fs.readdir(setMainDir(), (err, items: any) => {
      let agendaFile = checkFolder + '\\agendas\\agenda.vsorg';
      //erase data in file
      fs.writeFileSync(agendaFile, '');

      //loop through all of the files in the directory
      for (let i = 0; i < items.length; i++) {
        //make sure its a vsorg file
        if (items[i].includes('.vsorg')) {
          //check for SCHEDULED
          let fileText = fs
            .readFileSync(setMainDir() + '\\' + items[i])
            .toString()
            .split(/[\r\n]/);

          fileText.forEach(element => {
            if (element.includes('SCHEDULED') && !element.includes('DONE')) {
              taskPureText = element.trim().match(/.*(?=.*SCHEDULED)/g);
              taskTextGetTodo = element.match(/\bTODO\b/);
              taskTextGetDone = element.match(/\bDONE\b/);
              taskPureText = taskPureText[0].replace('⊙', '');
              taskPureText = taskPureText.replace('TODO', '');
              taskPureText = taskPureText.replace('DONE', '');
              taskPureText = taskPureText.replace('⊘', '');
              taskPureText = taskPureText.replace('⊖', '');
              taskPureText = taskPureText.trim();

              if (taskTextGetTodo !== null) {
                taskPureText =
                  '<span class="filename">' +
                  items[i] +
                  ':</span> ' +
                  '<span class="todo"> ' +
                  taskTextGetTodo +
                  '</span>' +
                  '<span class="taskText">' +
                  taskPureText +
                  '</span>' +
                  '<span class="scheduled">SCHEDULED</span>';
              } else if (taskTextGetDone !== null) {
                taskPureText =
                  '<span class="filename">' +
                  items[i] +
                  ':</span> ' +
                  '<span class="done"> ' +
                  taskTextGetDone +
                  ' </span>' +
                  '<span class="taskText">' +
                  taskPureText +
                  '</span>' +
                  '<span class="scheduled">SCHEDULED</span>';
              } else {
                taskPureText =
                  '<span class="filename">' +
                  items[i] +
                  ':</span> ' +
                  '<span class="taskText">' +
                  taskPureText +
                  '</span>' +
                  '<span class="scheduled">SCHEDULED</span>';
              }
              getDate = element.match(/\[(.*)\]/);

              //get the day of the week
              let d = new Date(getDate[1]).getDay();
              let nameOfDay;
              if (d === 0) {
                nameOfDay = 'Sunday';
              } else if (d === 1) {
                nameOfDay = 'Monday';
              } else if (d === 2) {
                nameOfDay = 'Tuesday';
              } else if (d === 3) {
                nameOfDay = 'Wednesday';
              } else if (d === 4) {
                nameOfDay = 'Thursday';
              } else if (d === 5) {
                nameOfDay = 'Friday';
              } else if (d === 6) {
                nameOfDay = 'Saturday';
              }
              convertedDateArray = [];
              if (new Date(getDate[1]).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
                convertedDateArray.push({
                  date:
                    '<div class="heading' +
                    nameOfDay +
                    ' ' +
                    getDate[0] +
                    '"><h4 class="' +
                    getDate[0] +
                    '">' +
                    getDate[0] +
                    ', ' +
                    nameOfDay.toUpperCase() +
                    '</h4></div>',
                  text: '<div class="panel ' + getDate[0] + '">' + taskPureText + '</div>'
                });
              } else {
                //todays date for late items
                var today: any = new Date();
                var dd: any = today.getDate();
                var mm: any = today.getMonth() + 1;
                var yyyy: any = today.getFullYear();
                var getDayOverdue: any = today.getDay();
                var overdue: any;
                if (dd < 10) {
                  dd = '0' + dd;
                }

                if (mm < 10) {
                  mm = '0' + mm;
                }

                today = mm + '-' + dd + '-' + yyyy;
                if (getDayOverdue === 0) {
                  overdue = 'Sunday';
                } else if (getDayOverdue === 1) {
                  overdue = 'Monday';
                } else if (getDayOverdue === 2) {
                  overdue = 'Tuesday';
                } else if (getDayOverdue === 3) {
                  overdue = 'Wednesday';
                } else if (getDayOverdue === 4) {
                  overdue = 'Thursday';
                } else if (getDayOverdue === 5) {
                  overdue = 'Friday';
                } else if (getDayOverdue === 6) {
                  overdue = 'Saturday';
                }

                if (new Date(getDate[1]).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                  convertedDateArray.push({
                    date:
                      '<div class="heading' +
                      overdue +
                      ' ' +
                      '[' +
                      today +
                      ']' +
                      '"><h4 class="' +
                      '[' +
                      today +
                      ']' +
                      '">' +
                      '[' +
                      today +
                      ']' +
                      ', ' +
                      overdue.toUpperCase() +
                      '</h4></div>',
                    text:
                      '<div class="panel ' +
                      '[' +
                      today +
                      ']' +
                      '">' +
                      taskPureText +
                      '<span class="late">LATE: ' +
                      getDate[1] +
                      '</span></div>'
                  });
                }
              }

              convertedDateArray.forEach(element => {
                if (!unsortedObject[element.date]) {
                  unsortedObject[element.date] = '  ' + element.text + '\n';
                } else {
                  unsortedObject[element.date] += '  ' + element.text + '\n';
                }
              });
            }
          });
          Object.keys(unsortedObject)
            .sort(function(a: any, b: any) {
              return moment(a, 'MM-DD-YYYY').toDate() - moment(b, 'MM-DD-YYYY').toDate();
            })
            .forEach(function(key) {
              sortedObject[key] = unsortedObject[key];
            });
          console.log(sortedObject);
          //write the sorted object to the agenda file
        }
      }
      if (!fs.existsSync(checkFolder + '\\agendas')) {
        fs.mkdirSync(checkFolder + '\\agendas');
      }

      if (!fs.existsSync(agendaFile)) {
      } else {
        for (var property in sortedObject) {
          test += property + sortedObject[property] + '</br>';
        }

        let fullAgendaView = vscode.window.createWebviewPanel(
          'fullAgenda',
          'Full Agenda View',
          vscode.ViewColumn.Beside,
          {
            // Enable scripts in the webview
            enableScripts: true
          }
        );

        //reload on save
        vscode.workspace.onDidSaveTextDocument(fullAgendaView.dispose);

        // And set its HTML content
        fullAgendaView.webview.html = getWebviewContent(sortedObject);

        // Handle messages from the webview
        fullAgendaView.webview.onDidReceiveMessage(message => {
          switch (message.command) {
            case 'open':
              let fullPath = path.join(setMainDir(), message.text);
              vscode.workspace.openTextDocument(vscode.Uri.file(fullPath)).then(doc => {
                vscode.window.showTextDocument(doc, vscode.ViewColumn.One, false);
              });
              return;
          }
        });
      }
    });
  }

  function setMainDir() {
    if (checkFolder === '') {
      let homeDir = os.homedir();
      folder = homeDir + '\\VSOrgFiles';
    } else {
      folder = checkFolder;
    }
    return folder;
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
${test}
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
    event.target.innerText = "DONE"
    event.srcElement.classList.add('done');
    event.srcElement.classList.remove('todo');

  } else if(event.target.innerText === "DONE") {
    event.target.innerText = "TODO"
    event.srcElement.classList.add('todo');
    event.srcElement.classList.remove('done');

  }
});



</script>
</body>
</html>`;
  }
};
