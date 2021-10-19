// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import PeekFileDefinitionProvider from "./PeekFileDefinitionProvider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const configParams = vscode.workspace.getConfiguration("vscode-bear-goto");
  const supportedLanguages = configParams.get("supportedLanguages") as Array<string>;
  const targetFileExtensions = configParams.get("targetFileExtensions") as Array<string>;
  const resourceAppPaths = configParams.get("resourceAppPaths") as Array<string>;
  const resourcePagePaths = configParams.get("resourcePagePaths") as Array<string>;

  const languageConfiguration: vscode.LanguageConfiguration = {
    wordPattern: /(-?\d*\.\d\w*)|([^\-\`\~\!\@\#\%\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)|((get|post|put|delete|resource)?\(?['"]([^'"]*?)['"])/g,
    onEnterRules: [
      {
        // e.g. /** | */
        beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
        afterText: /^\s*\*\/$/,
        action: { indentAction: vscode.IndentAction.IndentOutdent, appendText: ' * ' }
      },
      {
        // e.g. /** ...|
        beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
        action: { indentAction: vscode.IndentAction.None, appendText: ' * ' }
      },
      {
        // e.g.  * ...|
        beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
        action: { indentAction: vscode.IndentAction.None, appendText: '* ' }
      },
      {
        // e.g.  */|
        beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
        action: { indentAction: vscode.IndentAction.None, removeText: 1 }
      },
      {
        // e.g.  *-----*/|
        beforeText: /^(\t|(\ \ ))*\ \*[^/]*\*\/\s*$/,
        action: { indentAction: vscode.IndentAction.None, removeText: 1 }
      }
    ]
  };

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      supportedLanguages,
      new PeekFileDefinitionProvider(targetFileExtensions, resourceAppPaths, resourcePagePaths)
    ),
    vscode.languages.setLanguageConfiguration("php", languageConfiguration),
    vscode.languages.setLanguageConfiguration("twig", languageConfiguration)
  );

}

// this method is called when your extension is deactivated
export function deactivate() { }
