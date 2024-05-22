import * as vscode from 'vscode';

export default class PeekFileDefinitionProvider implements vscode.DefinitionProvider {
  targetFileExtensions: string[] = [];
  resourceAppPaths: string[] = [];
  resourcePagePaths: string[] = [];

  public static readonly regexPattern = /(get|post|put|delete|resource|uri|ResourceParam|Embed)\(.*?(app|page):\/\/self\/(.*)['"]/;

  constructor(targetFileExtensions: string[] = [], resourceAppPaths: string[] = [], resourcePagePaths: string[] = []) {
    this.targetFileExtensions = targetFileExtensions;
    this.resourceAppPaths = resourceAppPaths;
    this.resourcePagePaths = resourcePagePaths;
  }

  async provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<any[] | vscode.Location | vscode.Location[] | undefined> {
    const resourceNameAndMethods = this.getResourceNameAndMethod(document, position);
    if(resourceNameAndMethods.length === 0) {return [];}

    const searchPathActions = resourceNameAndMethods.map(async resourceNameAndMethod => {
      const files = await this.searchFilePath(resourceNameAndMethod.file);
      return files.map(file => {
        return {
          file: file,
          method: resourceNameAndMethod.method
        };
      });
    });
    const searchPromises = Promise.all(searchPathActions); // pass array of promises
    const paths = await searchPromises;

    // @ts-ignore
    const filePaths: any[] = [].concat.apply([], paths);
    if (!filePaths.length) {
      return undefined;
    }

    const allPaths: any[] = [];
    for (const filePath of filePaths) {
      const document = await vscode.workspace.openTextDocument(filePath.file.path);
      const methodRegex = new RegExp(`\\bfunction\\s+${filePath.method}\\s*\\(`);
      let found = false;
      for (let line = 0; line < document.lineCount; line++) {
          const lineText = document.lineAt(line).text;
          if (methodRegex.test(lineText)) {
              // メソッドが見つかった場合
              allPaths.push(new vscode.Location(vscode.Uri.file(filePath.file.path), new vscode.Position(line, 0)));
              found = true;
              break;
          }
      }
      if (!found) {
          // メソッドが見つからなかった場合
          allPaths.push(new vscode.Location(vscode.Uri.file(filePath.file.path), new vscode.Position(0, 0)));
      }
    }

    return allPaths;
  }

  private getResourceNameAndMethod(document: vscode.TextDocument, position: vscode.Position): any[] {
    const range = document.getWordRangeAtPosition(position, PeekFileDefinitionProvider.regexPattern);
    if (range === undefined) { return []; }

    const selectedText = document.getText(range);
    const resourceParts = selectedText.match(PeekFileDefinitionProvider.regexPattern);
    if (resourceParts === null) { return []; }
  
    const method = this.getMethodName(resourceParts[1]);
    const appOrPage = resourceParts[2];
    const filePart = this.getFilePart(resourceParts[3]);

    return this.getPossibleFileNames(appOrPage, filePart, method);
  }

  private getMethodName(httpMethod: string): string {
    return "on" + httpMethod.charAt(0).toUpperCase() + httpMethod.slice(1);
  }

  private getFilePart(resourcePath: string): string {
    const cutted = resourcePath.split(/'|"|#|\?|\{/)[0];
    const upperd = cutted.split("/").map(x => x.charAt(0).toUpperCase() + x.slice(1)).join("/");
    return upperd.split("-").map(x => x.charAt(0).toUpperCase() + x.slice(1)).join("");
  }

  private getPossibleFileNames(appOrPage: string, filePart: string, method: string): any[] {
    const possibleFileNames: any[] = [];

    // app
    if (appOrPage === 'app') {
      this.resourceAppPaths.forEach((resourceAppPath) => {
        this.targetFileExtensions.forEach((ext) => {
          const file = resourceAppPath + "/" + filePart;
          possibleFileNames.push({
            file : file + ext,
            method : method
          });
        });
      });

      return possibleFileNames;
    }

    // page
    this.resourcePagePaths.forEach((resourcePagePath) => {
      this.targetFileExtensions.forEach((ext) => {
        const file = resourcePagePath + "/" + filePart;
        possibleFileNames.push({
          file : file + ext,
          method : method
        });
        possibleFileNames.push({
          file : file + '/Index' + ext,
          method : method
        });
      });
    });

    return possibleFileNames;
  }

  private searchFilePath(fileName: String): Thenable<vscode.Uri[]> {
    return vscode.workspace.findFiles(`**/${fileName}`, "**/vendor"); // Returns promise
  }
}
