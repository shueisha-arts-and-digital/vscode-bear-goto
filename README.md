# vscode-bear-peek

## Features
- go to definition

----

## Development

### Clone, Install npm packages
```
git clone git@github.com:yuki777/vscode-bear-peek.git
cd vscode-bear-peek.git 
npm install
```

### Install vsce(VS Code Extension Manager)
- Install [vsce](https://github.com/microsoft/vscode-vsce)
```
npm install -g vsce
```

### Login vsce
- [Invite member](https://dev.azure.com/yuki777/vscode-bear-jump)
```
vsce login yuki777
```

### Other commands
```
# Build and package
vsce package

# Uninstall extension
code-insiders --uninstall-extension yuki777.vscode-bear-peek

# Install extension
code-insiders --install-extension vscode-bear-peek-0.0.1.vsix

# Increment version, clean out, build, uninstall
npm --no-git-tag-version version patch \
&& rm -fr out vscode-bear-peek-*.vsix \
&& vsce package \
&& code-insiders --uninstall-extension yuki777.vscode-bear-peek
```