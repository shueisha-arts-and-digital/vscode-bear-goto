import * as vscode from 'vscode';
import * as parsePath from 'parse-path';

export default class PeekFileDefinitionProvider implements vscode.DefinitionProvider {
  targetFileExtensions: string[] = [];
  resourceAppPaths: string[] = [];
  resourcePagePaths: string[] = [];

  constructor(targetFileExtensions: string[] = [], resourceAppPaths: string[] = [], resourcePagePaths: string[] = []) {
    this.targetFileExtensions = targetFileExtensions;
    this.resourceAppPaths = resourceAppPaths;
    this.resourcePagePaths = resourcePagePaths;
  }

  getResourceName(document: vscode.TextDocument, position: vscode.Position): String[] {
    const range = document.getWordRangeAtPosition(position, /((get|post|put|delete|resource)?\(?['"]([^'"]*?)['"])/);
    const selectedText = document.getText(range);
    const resourceParts = selectedText.match(/(get|post|put|delete|resource)?\(?['"](app|page):\/\/self\/(.*)['"]/);
    if (resourceParts === null) { return []; }
    const appOrPage = resourceParts[2];
    const replaced = parsePath(resourceParts[3]).pathname.replace('{', '');
    const slashed = replaced.split("/").map(x => x.charAt(0).toUpperCase() + x.slice(1)).join("/");
    const dashed = slashed.split("-").map(x => x.charAt(0).toUpperCase() + x.slice(1)).join("");

    let file = '';
    const possibleFileNames: String[] = [];
    if (appOrPage === 'app') {
      this.resourceAppPaths.forEach((resourceAppPath) => {
        this.targetFileExtensions.forEach((ext) => {
          file = resourceAppPath + "/" + dashed;
          possibleFileNames.push(file + ext);
        });
      });
    } else {
      this.resourcePagePaths.forEach((resourcePagePath) => {
        this.targetFileExtensions.forEach((ext) => {
          file = resourcePagePath + "/" + dashed;
          possibleFileNames.push(file + ext);
          possibleFileNames.push(file + '/Index' + ext);
        });
      });
    }

    return possibleFileNames;
  }

  searchFilePath(fileName: String): Thenable<vscode.Uri[]> {
    return vscode.workspace.findFiles(`**/${fileName}`, "**/vendor"); // Returns promise
  }

  async provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<any[] | vscode.Location | vscode.Location[] | undefined> {
    const resourceNames = this.getResourceName(document, position);
    const searchPathActions = resourceNames.map(this.searchFilePath);
    const searchPromises = Promise.all(searchPathActions); // pass array of promises
    const paths = await searchPromises;

    // @ts-ignore
    const filePaths: any[] = [].concat.apply([], paths);
    if (!filePaths.length) {
      return undefined;
    }

    const allPaths: any[] = [];
    filePaths.forEach((filePath) => {
      allPaths.push(new vscode.Location(vscode.Uri.file(filePath.path), new vscode.Position(0, 0)));
    });

    return allPaths;
  }
}