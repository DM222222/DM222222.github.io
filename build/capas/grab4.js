const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
const c=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:true});const p=await c.newPage();await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
await p.goto('http://localhost:4301/index.html?demo=c-level');await p.waitForTimeout(3500);
await p.getByText('Financeiro',{exact:true}).last().click();await p.waitForTimeout(2600);
await p.screenshot({path:'src/torre_m1.png'});await c.close();await b.close()})();
