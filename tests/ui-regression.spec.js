const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SKIP_DIRS = new Set(['node_modules','.git','playwright-report','test-results']);
function findHtml(dir=process.cwd(),prefix=''){
  const out=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(SKIP_DIRS.has(entry.name)) continue;
    const full=path.join(dir,entry.name),rel=path.posix.join(prefix,entry.name);
    if(entry.isDirectory()) out.push(...findHtml(full,rel));
    else if(entry.isFile()&&entry.name.endsWith('.html')) out.push(rel);
  }
  return out.sort();
}
const pages=findHtml();
const viewports=[{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}];

async function assertNoOverflow(page,label){
  const size=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,bodyScrollWidth:document.body?.scrollWidth||0}));
  expect(size.scrollWidth,`${label}: horizontal overflow ${size.scrollWidth}px > ${size.clientWidth}px (body ${size.bodyScrollWidth}px)`).toBeLessThanOrEqual(size.clientWidth+2);
}
async function assertLocalLinks(page,label){
  const hrefs=await page.locator('a[href]').evaluateAll(nodes=>[...new Set(nodes.map(a=>a.getAttribute('href')).filter(Boolean))]);
  for(const href of hrefs){
    if(/^(#|mailto:|tel:|javascript:)/i.test(href)) continue;
    const target=new URL(href,page.url());
    if(target.origin!==new URL(page.url()).origin) continue;
    target.hash='';
    const response=await page.request.get(target.toString(),{failOnStatusCode:false});
    expect(response.status(),`${label}: broken local link ${href}`).toBeLessThan(400);
  }
}
async function assertPageShell(page,file){
  if(file.endsWith('-lab.html')){await expect(page.locator('.lab-main')).toBeVisible();return}
  if(file==='labs.html'){await expect(page.locator('.labs-wrap')).toBeVisible();return}
  if(file==='unified/index.html'){await expect(page.locator('#app')).toBeVisible();return}
  if(file==='unified/start-here.html'){await expect(page.locator('.wrap')).toBeVisible();return}
  await expect(page.locator('.app')).toBeVisible();
}
async function assertDriveBackedContent(page,file){
  const expected={
    'index.html':'155 original questions',
    'identity.html':'SELF-SERVICE PASSWORD RESET (SSPR)',
    'storage.html':'IDENTITY-BASED ACCESS FOR AZURE FILES',
    'compute.html':'ENCRYPTION AT HOST',
    'networking.html':'AZURE BASTION',
    'monitoring.html':'NETWORK WATCHER',
    'quiz.html':'155 QUESTIONS'
  }[file];
  if(expected) await expect(page.locator('body')).toContainText(expected,{ignoreCase:true});
  if(file==='identity.html') await expect(page.locator('.objective-block')).toHaveCount(3);
  if(file==='storage.html') await expect(page.locator('.objective-block')).toHaveCount(3);
  if(file==='compute.html') await expect(page.locator('.objective-block')).toHaveCount(4);
  if(file==='networking.html') await expect(page.locator('.objective-block')).toHaveCount(3);
  if(file==='monitoring.html') await expect(page.locator('.objective-block')).toHaveCount(2);
  if(file==='quiz.html') await expect(page.locator('.quiz-opt')).toHaveCount(4);
  if(file==='blueprint.html') expect(await page.locator('input[type="checkbox"]').count()).toBeGreaterThanOrEqual(80);
}
async function exercisePage(page,file){
  if(file.endsWith('-lab.html')){
    const next=page.locator('#nextStep');if(await next.count()){await next.click();await page.waitForTimeout(120)}
    const run=page.locator('button').filter({hasText:/(?:run|apply|simulate|trigger)/i}).first();
    if(await run.count()){await run.click();await page.waitForTimeout(1300)}
  }
  if(file==='labs.html'){
    const storage=page.locator('.filter[data-domain="storage"]');if(await storage.count()) await storage.click();
  }
  if(file==='flashcards.html'){const card=page.locator('.flashcard');if(await card.count())await card.click()}
  if(file==='quiz.html'){const option=page.locator('.quiz-opt').first();if(await option.count())await option.click()}
  if(file==='blueprint.html'){const checkbox=page.locator('input[type="checkbox"]').first();if(await checkbox.count())await checkbox.check()}
}
for(const viewport of viewports){
  test.describe(`${viewport.name} regression`,()=>{
    for(const file of pages){
      test(`${file} renders cleanly`,async({page})=>{
        await page.setViewportSize({width:viewport.width,height:viewport.height});
        const issues=[],origin='http://127.0.0.1:4173';
        page.on('pageerror',err=>issues.push(`pageerror: ${err.message}`));
        page.on('console',msg=>{if(msg.type()==='error')issues.push(`console.error: ${msg.text()}`)});
        page.on('response',response=>{try{const url=new URL(response.url());if(url.origin===origin&&response.status()>=400)issues.push(`HTTP ${response.status()}: ${url.pathname}`)}catch(_){}});
        const response=await page.goto(`/${file}`,{waitUntil:'networkidle'});
        expect(response,`${file}: no navigation response`).not.toBeNull();
        expect(response.status(),`${file}: page did not load`).toBeLessThan(400);
        await assertPageShell(page,file);
        const textLength=await page.locator('body').innerText().then(t=>t.trim().length);
        expect(textLength,`${file}: rendered body unexpectedly empty`).toBeGreaterThan(80);
        await assertDriveBackedContent(page,file);
        await assertNoOverflow(page,`${viewport.name}/${file}`);
        await assertLocalLinks(page,`${viewport.name}/${file}`);
        await exercisePage(page,file);
        await page.waitForTimeout(120);
        await assertNoOverflow(page,`${viewport.name}/${file} after interaction`);
        expect(issues,`${viewport.name}/${file}: browser errors\n${issues.join('\n')}`).toEqual([]);
      });
    }
  });
}
