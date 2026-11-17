const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
async function shot(url,w,h,file,prep){const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,hasTouch:w<800,isMobile:w<800});const p=await c.newPage();await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());await p.goto(url);await p.waitForTimeout(3800);if(prep)await prep(p);await p.waitForTimeout(900);await p.screenshot({path:'src/'+file});await c.close();}
const T='http://localhost:4301/index.html?demo=c-level';
await shot(T,1440,900,'torre_d.png',async p=>{await p.mouse.move(1205,640);});
await shot(T,390,844,'torre_m1.png');
await b.close()})();
