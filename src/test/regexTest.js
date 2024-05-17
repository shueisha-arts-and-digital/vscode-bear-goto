// @see PeekFileDefinitionProvider.regexPattern
const regexPattern = /(get|post|put|delete|resource|uri|ResourceParam|Embed)\(.*?(app|page):\/\/self\/(.*)['"]/;

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
