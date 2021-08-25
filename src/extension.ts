"use strict";
import * as vscode from "vscode";
import PeekFileDefinitionProvider from "./PeekFileDefinitionProvider";

// @see https://github.com/bmewburn/vscode-intelephense/blob/5eb386f531fa8f9ed8ddc1d29b8b150a2949c00d/src/extension.ts#L42
const languageConfiguration: vscode.LanguageConfiguration = {
  wordPattern:
    /(-?\d*\.\d\w*)|([^\-\`\~\!\@\#\%\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
};

export function activate(context: vscode.ExtensionContext) {
  const configParams = vscode.workspace.getConfiguration("bear-peek");
  const supportedLanguages = configParams.get(
    "supportedLanguages"
  ) as Array<string>;
  const targetFileExtensions = configParams.get(
    "targetFileExtensions"
  ) as Array<string>;

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      supportedLanguages,
      new PeekFileDefinitionProvider(targetFileExtensions)
    )
  );

  /* Provides way to get selected text even if there is dash
   * ( must have fot retrieving component name )
   */
  context.subscriptions.push(
    vscode.languages.setLanguageConfiguration("php", languageConfiguration)
  );
}

// this method is called when your extension is deactivated
export function deactivate() {
}
