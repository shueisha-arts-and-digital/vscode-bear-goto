const regex = /\(?['"](app|page):\/\/self\/(.*)['"]/;

function testRegexTrue(target) {
	// Test
	let match = target.match(regex);
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
	let match = target.match(regex);
	console.assert(match === null, `${target} は正規表現にマッチしないはずが、マッチしました。`);

	// Output
	if(match === null){
		console.log("- [x] " + target + " not matched.");
	}else{
		console.log("- [ ] " + target + " should be not matched.");
	}
}

testRegexTrue("get('app://self/foo')");
testRegexTrue("get('app://self/foo')");
testRegexTrue('uri("app://self/foo")');
testRegexTrue('resource("app://self/foo")');
testRegexFalse('resource("foo://self/foo")');
