// PeekFileDefinitionProvider.regexPatternを取得する
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../PeekFileDefinitionProvider.ts');
const fileContent = fs.readFileSync(filePath, 'utf-8');
const regexPatternLine = fileContent.split('\n').find(line => line.includes('regexPattern'));
const regexPatternMatch = regexPatternLine.match(/regexPattern\s*=\s*(\/.*\/[gimsuy]*)/);
const regexPattern = regexPatternMatch ? new RegExp(regexPatternMatch[1].slice(1, -1)) : null;

function testRegexTrue(target) {
	// Test
	let match = target.match(regexPattern);
	console.assert(match !== null, `${target} は正規表現にマッチするはずが、マッチしませんでした。`);

	// Output
	if(match !== null){
		console.log("- [x] " + target + " matched.");
	}else{
		console.log("- [ ] " + target + " should be matched.");
	}
}

function testRegexFalse(target) {
	// Test
	let match = target.match(regexPattern);
	console.assert(match === null, `${target} は正規表現にマッチしないはずが、マッチしました。`);

	// Output
	if(match === null){
		console.log("- [x] " + target + " not matched.");
	}else{
		console.log("- [ ] " + target + " should be not matched.");
	}
}

testRegexTrue("get('app://self/foo')");
testRegexTrue("get('app://self/foo/bar')");
testRegexTrue("post('app://self/foo')");
testRegexTrue("put('app://self/foo')");
testRegexTrue("delete('app://self/foo')");
testRegexTrue('resource("app://self/foo")');
testRegexTrue('uri("app://self/foo")');
testRegexTrue("#[ResourceParam(uri: 'app://self/user#ulid', param: 'userId')]");
testRegexTrue("#[Embed(rel: 'foo', src: 'app://self/foo{?ulid}')]");

testRegexFalse('resource("foo://self/foo")');
testRegexFalse('foo("app://self/foo")');
testRegexFalse('getFoo("app://self/foo")');
