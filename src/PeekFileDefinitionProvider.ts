import * as vscode from "vscode";
import * as child_process from 'child_process';

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

    let resourceParts = selectedText.match(/['"](app|page):\/\/self\/(.*)['"]/);
    let slashed = resourceParts[2].split("/").map((x) => { return x.charAt(0).toUpperCase() + x.slice(1) }).join("/");
    let dashed = slashed.split("-").map((x) => { return x.charAt(0).toUpperCase() + x.slice(1) }).join("");

    let possibleFileNames = [];
    this.resourceAppPaths.forEach((resourceAppPath) => {
      this.targetFileExtensions.forEach((ext) => {
        let file = resourceAppPath + "/" + dashed;
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
    const resourceNames = this.getResourceName(position);
    const searchPathActions = resourceNames.map(this.searchFilePath);
    const searchPromises = Promise.all(searchPathActions); // pass array of promises
    return searchPromises.then(
      (paths) => {
        filePaths = [].concat.apply([], paths);
        if (!filePaths.length) {
          return undefined;
        }

        let allPaths = [];
        filePaths.forEach((filePath) => {
          let command = "grep -n 'function onGet(' " + filePath.path + "|awk -F ':' '{print $1}'|tr -d '\n'||echo -n 1";
          let stdout = child_process.execSync(command).toString();
          allPaths.push(new vscode.Location(vscode.Uri.file(`${filePath.path}`), new vscode.Position(parseInt(stdout) - 1, 1)));
        });
        return allPaths;
      },
      (reason) => {
        return undefined;
      }
    );
  }
}
