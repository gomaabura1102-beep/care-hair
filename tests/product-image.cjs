const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
function load(file) {
 const module = {exports:{}};
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 new Function('require','module','exports',code)((name)=>name.startsWith('@/')?load(name.slice(2)+'.ts'):require(name),module,module.exports);
 return module.exports;
}
const {getOfficialProductImages}=load('lib/product-image.ts');
const {products}=load('data/products.ts');
const amazon={url:'https://m.media-amazon.com/images/I/test.jpg',itemId:'TEST',source:'amazon',obtainedVia:'amazon-associates-api'};
const rakuten={url:'https://thumbnail.image.rakuten.co.jp/test.jpg',itemId:'test:1',source:'rakuten',obtainedVia:'rakuten-ichiba-api'};
const product={amazonAffiliateUrl:'https://amzn.to/test?tag=keep',affiliateUrl:'https://hb.afl.rakuten.co.jp/ichiba/test/?pc=keep'};
test('all current products remain available; unverified legacy URLs are not used',()=>{
 assert.equal(products.length,24);
 for(const p of products){assert.ok(p.name&&p.price&&p.tags.length&&p.amazonAffiliateUrl&&p.affiliateUrl);assert.deepEqual(getOfficialProductImages(p),[]);}
});
test('each provider retains its exact image and existing matching link',()=>{
 const images=getOfficialProductImages({...product,officialImages:[amazon,rakuten]});
 assert.equal(images.length,2);assert.equal(images[0].url,amazon.url);assert.equal(images[0].href,product.amazonAffiliateUrl);assert.equal(images[1].href,product.affiliateUrl);
});
test('reject insecure URLs, false provenance, wrong hosts and absent corresponding links',()=>{
 for(const patch of [{url:'http://m.media-amazon.com/test.jpg'},{url:'https://m.media-amazon.com.evil.example/test.jpg'},{url:'https://user:pass@m.media-amazon.com/test.jpg'},{obtainedVia:'scraped'},{itemId:''},{source:'rakuten'}]) assert.deepEqual(getOfficialProductImages({...product,officialImages:[{...amazon,...patch}]}),[]);
 assert.deepEqual(getOfficialProductImages({affiliateUrl:product.affiliateUrl,officialImages:[amazon]}),[]);
});
test('diagnosis and recommendations still return existing product IDs',()=>{
 const {questions}=load('data/questions.ts');const diagnosis=load('lib/diagnosis.ts');
 const result=diagnosis.getDiagnosisResult(questions.map(()=>[0]));
 assert.ok(result.hairBody);const recommendations=diagnosis.rankProducts('shampoo',result.scores);
 assert.ok(recommendations.length);for(const p of recommendations)assert.ok(products.some(x=>x.id===p.id));
});
