# デバッグ実行するには
- `npm run watch`でwatchビルドします。
- vscode上で`F5` (Run > Start Debugging)すると`Extension Development Host`のvscodeウィンドウが開きます。
- `Extension Development Host`のvscodeウィンドウで、`cmd`+`option`+`i` (Help > Toggle Developer Tools) でDev Toolsが開きます。
- 普通に`console.log`やブレークポイントが使えます。

# Extensionをバージョン管理する
- 公開されるextension(vsixファイル)のバージョン番号は、package.jsonの`version`で指定します
- `npm --no-git-tag-version version minor` でminorバージョンをインクリメントしてcommit, pushしてください。
- TODO: #36

# ExtensionをPublishする
- https://marketplace.visualstudio.com/ にアカウントを作ってください。
- https://marketplace.visualstudio.com/manage/publishers/YukiAdachi でMemberに追加します。
- TODO: #22