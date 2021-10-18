# デバッグ実行するには
- `npm run watch`でwatchビルドします。
- vscode上で`F5` (Run > Start Debugging)すると`Extension Development Host`のvscodeウィンドウが開きます。
- `Extension Development Host`のvscodeウィンドウで、`cmd`+`option`+`i` (Help > Toggle Developer Tools) でDev Toolsが開きます。
- 普通に`console.log`やブレークポイントが使えます。

# Extensionのバージョン管理とPublishについて
- 公開されるextension(vsixファイル)のバージョン番号は、package.jsonの`version`で指定します
- `npm --no-git-tag-version version minor` でminorバージョンをインクリメントしてcommit, pushしてください。
  - TODO: https://github.com/pj8/vscode-bear-goto/issues/36
- https://github.com/pj8/vscode-bear-goto/releases からpublishするとmarketplaceにもpublishされます。
  - https://github.com/pj8/vscode-bear-goto/blob/main/.github/workflows/publish.yml
  - TODO: https://github.com/pj8/vscode-bear-goto/issues/38
