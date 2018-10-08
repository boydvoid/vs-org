import * as vscode from "vscode";
const opn = require('opn');


export class WindowMessage {

  //attributes
  type: string;
  message: string;
  haveButton: boolean;
  buttonText: string;
  haveUrl: boolean;
  urlText: string;
  /**
   * 
   * @param theType the type of message needs to be Information, Warning, or Error
   * @param theMessage the message
   * @param showButton true or false to show a button
   * @param theButtonText the button text
   * @param useUrl the url to open in browser
   */
  constructor(theType: string, theMessage: string, showButton: boolean, theButtonText: string, useUrl: boolean, textForUrl: string) {
    this.type = theType;
    this.message = theMessage;
    this.haveButton = showButton;
    this.buttonText = theButtonText;
    this.haveUrl = useUrl;
    this.urlText = textForUrl;
  }

  showMessage() {

    //information type
    if (this.type === "information") {

      //open in browswer
      if (this.haveUrl === true && this.haveButton === true) {

        vscode.window.showInformationMessage(this.message, ...[this.buttonText]).then(selection => {

          opn(this.urlText);
        })
      } else {
        vscode.window.showErrorMessage(this.message)
      }
    } else if (this.type === "warning") {
      //open in browswer
      if (this.haveUrl === true && this.haveButton === true) {

        vscode.window.showWarningMessage(this.message, ...[this.buttonText]).then(selection => {

          opn(this.urlText);
        })
      } else {
        vscode.window.showErrorMessage(this.message)
      }
    } else if (this.type === "error") {
      //open in browswer
      if (this.haveUrl === true && this.haveButton === true) {

        vscode.window.showErrorMessage(this.message, ...[this.buttonText]).then(selection => {

          opn(this.urlText);
        })
      } else {
        vscode.window.showErrorMessage(this.message)
      }
    }

  }
}
