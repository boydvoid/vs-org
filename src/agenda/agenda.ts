import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';

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
            if (element.includes('SCHEDULED')) {
              taskPureText = element.trim().match(/.*(?=.*SCHEDULED)/g);
              taskTextGetTodo = element.match(/\bTODO\b/);
              taskTextGetDone = element.match(/\bDONE\b/);
              taskPureText = taskPureText[0].replace('⊙', '');
              taskPureText = taskPureText.replace('TODO', '');
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
                  ' </span>' +
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
                    '"><h4>' +
                    getDate[0] +
                    ', ' +
                    nameOfDay.toUpperCase() +
                    '</h4></div>',
                  text: '<div class="panel"><p>' + taskPureText + '</p></div>'
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
                      '"><h4>' +
                      '[' +
                      today +
                      ']' +
                      ', ' +
                      overdue.toUpperCase() +
                      '</h4></div>',
                    text:
                      '<div class="panel"><p>' +
                      taskPureText +
                      '<span class="late">LATE: ' +
                      getDate[1] +
                      '</span></p></div>'
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
            .sort()
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

        // And set its HTML content
        fullAgendaView.webview.html = getWebviewContent(sortedObject);

        // fs.appendFileSync(agendaFile, "#+Upcoming Tasks\n\n" + test, "utf-8");
        // vscode.workspace.openTextDocument(vscode.Uri.file(checkFolder + "\\agendas\\agenda.vsorg")).then(doc => {
        //   vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside, false).then(() => {
        //     vscode.commands.executeCommand("editor.foldAll");
        //   });

        // });
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
    
</head>
<style>
.headingSunday {
  background-color: #2f6999;
  /* color: #444; */
  cursor: pointer;
  padding: 5px;
  /* width: 100%; */
  border: none;
  text-align: left;
  outline: none;
  /* font-size: 15px; */
  transition: 0.4s;
}
.headingMonday {
  background-color: #2f996e;
  /* color: #444; */
  cursor: pointer;
  padding: 5px;
  /* width: 100%; */
  border: none;
  text-align: left;
  outline: none;
  /* font-size: 15px; */
  transition: 0.4s;
}
.headingTuesday {
  background-color: #802f99;
  /* color: #444; */
  cursor: pointer;
  padding: 5px;
  /* width: 100%; */
  border: none;
  text-align: left;
  outline: none;
  /* font-size: 15px; */
  transition: 0.4s;
}
.headingWednesday {
  background-color: #992f2f;
  /* color: #444; */
  cursor: pointer;
  padding: 5px;
  /* width: 100%; */
  border: none;
  text-align: left;
  outline: none;
  /* font-size: 15px; */
  transition: 0.4s;
}
.headingThursday {
  background-color: #992f67;
  /* color: #444; */
  cursor: pointer;
  padding: 5px;
  /* width: 100%; */
  border: none;
  text-align: left;
  outline: none;
  /* font-size: 15px; */
  transition: 0.4s;
}
.headingFriday {
  background-color: #44992f;
  /* color: #444; */
  cursor: pointer;
  padding: 5px;
  /* width: 100%; */
  border: none;
  text-align: left;
  outline: none;
  /* font-size: 15px; */
  transition: 0.4s;
}
.headingSaturday {
  background-color: #3c2e96;
  /* color: #444; */
  cursor: pointer;
  padding: 5px;
  /* width: 100%; */
  border: none;
  text-align: left;
  outline: none;
  /* font-size: 15px; */
  transition: 0.4s;
}

.active, .accordion:hover {
    background-color: #ccc; 
}

.panel {
    padding: 0 18px;
    display: flex;
    background-color: white;
    overflow: hidden;
    color: #000000;
}

.todo{ 

  background-color: #d12323;
  padding-left: 10px;
  padding-right: 10px;
  color: white;
 
  font-size: 9px;
}

.done{
  color: #4286f4;
  font-weight: 700;
}

.filename{
  font-size: 15px;
  font-weight: 700;
}
.scheduled{
  background-color: blue;
  padding-left: 10px;
  padding-right: 10px;
  color: white;
  border-radius: 27px;
  font-size: 9px;
  margin-left: auto;
}

p{
  width: 100%;
  display: flex;
}

.taskText{
font-size:15px;
}
.late{
  background-color: red;
  padding-left: 10px;
  padding-right: 10px;
  color: white;
  border-radius: 27px;
  font-size: 9px;
  margin-left: auto; 
}
</style>
<body>

<h1>Upcoming Tasks</h1>
<div id="display-agenda">
${test}
</div>
  

<script>
var acc = document.getElementsByClassName("accordion");


for ( var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        for(var j = 0; )
        var panel = this.nextElementSibling;

    

    });
    
}
</script>
</body>
</html>`;
  }
};
