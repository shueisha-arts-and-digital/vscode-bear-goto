# デバッグ実行するには
- VSCode上で`F5` (Run > Start Debugging)すると`Extension Development Host`のvscodeウィンドウが開きます。
- 普通に`console.log`やブレークポイントが使えます。

# Packaging
```bash
# Install vsce
npm install -g @vscode/vsce`

# 必要ならバージョンをインクリメントする
npm --no-git-tag-version version minor

# 拡張をパッケージする
vsce package
```

# Publish manually
- https://marketplace.visualstudio.com/manage/publishers/yukiadachi に *.vsix をアップロードする

# Publish automatically
- https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- https://dev.azure.com/yuki777/_usersSettings/tokens でPersonal Access Tokenを作成し、
- https://github.com/pj8/vscode-bear-goto/settings/secrets/actions でVCSE_PATにセットする
