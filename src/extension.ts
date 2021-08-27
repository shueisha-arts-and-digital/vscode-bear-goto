"use strict";
import * as vscode from "vscode";
import PeekFileDefinitionProvider from "./PeekFileDefinitionProvider";

export function activate(context: vscode.ExtensionContext) {
  const configParams = vscode.workspace.getConfiguration("vscode-bear-goto");
  const supportedLanguages = configParams.get("supportedLanguages") as Array<string>;
  const targetFileExtensions = configParams.get("targetFileExtensions") as Array<string>;
  const resourceAppPaths = configParams.get("resourceAppPaths") as Array<string>;
  const resourcePagePaths = configParams.get("resourcePagePaths") as Array<string>;

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      supportedLanguages,
      new PeekFileDefinitionProvider(targetFileExtensions, resourceAppPaths, resourcePagePaths)
    )
  );

  context.subscriptions.push(
    vscode.languages.setLanguageConfiguration(
      "php",
      { wordPattern: /(get|post|put|delete)?\(?['"]([^'"]*?)['"]/ })
  );
}

export function deactivate() {
}
