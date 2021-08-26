import * as vscode from "vscode";

export default class PeekFileDefinitionProvider
  implements vscode.DefinitionProvider
{
  targetFileExtensions: string[] = [];

  constructor(targetFileExtensions: string[] = []) {
    this.targetFileExtensions = targetFileExtensions;
  }

  getResourceName(position: vscode.Position): String[] {
    // 'foo'や'bar'ではなく、'page://self/foo/bar'を取りたい
    //const newPosition = position.translate(0, - position.character)
    //const newPosition = position.translate();
    //const newPosition = position.translate(0,0);
    //const newPosition = position.translate(0, - position.character)
    //const newPosition = position.with(0, - position.character)
    //const newPosition = position.with();
    //const newPosition = position.with(0,0);
    //const newPosition = position.with(position.line, 0);
    //const newPosition = position.with(position.line, position.character);
    //const newPosition = position.with(- position.line, - position.character);
    //const fooSelection = doc.getWordRangeAtPosition(foo);
    //const fooSelectedText = doc.getText(fooSelection);
    //console.log(fooSelectedText);

    const doc = vscode.window.activeTextEditor.document;
    const selection = doc.getWordRangeAtPosition(position);
    const selectedText = doc.getText(selection);
    console.log(selectedText);

    let possibleFileNames = [],
      altName = "";

    // article => Article
    selectedText.match(/\w+/g).forEach((str) => {
      return (altName += str[0].toUpperCase() + str.substring(1));
    });

    // [article.php, article/index.php, Article.php, Article/index.php]
    this.targetFileExtensions.forEach((ext) => {
      possibleFileNames.push(selectedText + ext);
      possibleFileNames.push(selectedText + "/index" + ext);
      possibleFileNames.push(altName + ext);
      possibleFileNames.push(altName + "/index" + ext);
    });

    return possibleFileNames;
  }

  searchFilePath(fileName: String): Thenable<vscode.Uri[]> {
    return vscode.workspace.findFiles(`**/${fileName}`, "**/vendor"); // Returns promise
  }

  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Location | vscode.Location[]> {
    let filePaths = [];
    //const componentNames = this.getResourceName(position);
    //const componentNames = this.getResourceName(position.translate(0, - position.character));
    const componentNames = this.getResourceName(position.with(102, 0));
    const searchPathActions = componentNames.map(this.searchFilePath);
    const searchPromises = Promise.all(searchPathActions); // pass array of promises

    return searchPromises.then(
      (paths) => {
        filePaths = [].concat.apply([], paths);

        if (filePaths.length) {
          let allPaths = [];
          filePaths.forEach((filePath) => {
            allPaths.push(
              new vscode.Location(
                vscode.Uri.file(`${filePath.path}`),
                new vscode.Position(0, 1)
              )
            );
          });
          return allPaths;
        } else {
          return undefined;
        }
      },
      (reason) => {
        return undefined;
      }
    );
  }
}
