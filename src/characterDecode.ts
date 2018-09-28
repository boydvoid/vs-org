module.exports = function(array: string[] = ["⊖ ", "⊙ ", "⊘ "]) {
  const { activeTextEditor } = vscode.window;
  if (activeTextEditor && activeTextEditor.document.languageId === "vso") {
    const { document } = activeTextEditor;

    let position = activeTextEditor.selection.active.line;
    const getCurrentLine = document.lineAt(position);
    let currentLineText = getCurrentLine.text;

    for (let i = 0; i < array.length; i++) {
      if (currentLineText.includes(array[i])) {
        return array[i];
      }
    }
  }
};
