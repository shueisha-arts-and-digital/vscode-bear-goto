function testUrl(expect, target) {
	let regex = /\(?['"](app|page):\/\/self\/(.*)['"]/;
	let match = target.match(regex);

	if (expect) {
		console.assert(match !== null, `${target} は正規表現にマッチすると期待されましたが、マッチしませんでした`);
	} else {
		console.assert(match === null, `${target} は正規表現にマッチしないと期待されましたが、マッチしました`);
	}
}

testUrl(true, "get('app://self/foo')");
testUrl(true, "get('app://self/foo')");
testUrl(true, 'uri("app://self/foo")');
testUrl(true, 'resource("app://self/foo")');
