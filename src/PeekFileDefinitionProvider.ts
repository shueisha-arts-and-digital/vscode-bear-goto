import * as vscode from "vscode";

export default class PeekFileDefinitionProvider implements vscode.DefinitionProvider {
  targetFileExtensions: string[] = [];
  resourceAppPaths: string[] = [];
  resourcePagePaths: string[] = [];

  constructor(targetFileExtensions: string[] = [], resourceAppPaths: string[] = [], resourcePagePaths: string[] = []) {
    this.targetFileExtensions = targetFileExtensions;
    this.resourceAppPaths = resourceAppPaths;
    this.resourcePagePaths = resourcePagePaths;
  }

  getResourceName(position: vscode.Position): String[] {
    const doc = vscode.window.activeTextEditor.document;
    const selection = doc.getWordRangeAtPosition(position);
    const selectedText = doc.getText(selection);

    let resourceParts = selectedText.match(/'(app|page):\/\/self\/(.*)'/);
    //let appOrPage = resourceParts[1].charAt(0).toUpperCase() + resourceParts[1].slice(1);
    let dashed = resourceParts[2].split("-").map((x) => { return x.charAt(0).toUpperCase() + x.slice(1) }).join("/");
    let slashed = dashed.split("/").map((x) => { return x.charAt(0).toUpperCase() + x.slice(1) }).join("/");

    let possibleFileNames = [];
    this.resourceAppPaths.forEach((resourceAppPath) => {
      this.targetFileExtensions.forEach((ext) => {
        let file = resourceAppPath + "/" + slashed;
        possibleFileNames.push(file + ext);
        possibleFileNames.push(file + '/Index' + ext);
      });
    });

    return possibleFileNames;
  }

  searchFilePath(fileName: String): Thenable<vscode.Uri[]> {
    return vscode.workspace.findFiles(`**/${fileName}`, "**/vendor"); // Returns promise
  }

  provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Location | vscode.Location[]> {
    let filePaths = [];
    const componentNames = this.getResourceName(position);
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
                new vscode.Position(0, 1) // TODO: getなら 'function onGet'に移動したい
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
