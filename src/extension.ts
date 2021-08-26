"use strict";
import * as vscode from "vscode";
import PeekFileDefinitionProvider from "./PeekFileDefinitionProvider";

// 'foo'や'bar'ではなく、'page://self/foo/bar'を取りたい
const languageConfiguration: vscode.LanguageConfiguration = {
  // TODO:効いていないっぽい
  //wordPattern: /['"]([^['"]*)['"]/
  //wordPattern: /'([^']*)'/
  //wordPattern: /'(app):\/\/(self)(.*)'/
  wordPattern: /'page:\/\/self\/(.*)'/
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

  context.subscriptions.push(
    vscode.languages.setLanguageConfiguration("php", languageConfiguration)
  );

}

export function deactivate() {
}
