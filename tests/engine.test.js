'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),E=require('../dist/engine.js');
const base={face:1000,coupon:.02,yield:.02,years:10,freq:1};let checks=[];
function test(name,fn){fn();checks.push({name,status:'passed'});}
function near(x,y,tol=1e-8){assert.ok(Math.abs(x-y)<tol,`${x} != ${y}`);}
test('par pricing for 1, 2 and 4 coupons annually',()=>{for(let freq of [1,2,4])near(E.price({...base,freq}),1000);});
test('zero coupon closed-form price',()=>near(E.price({...base,coupon:0}),1000/1.02**10));
test('zero coupon duration equals maturity',()=>near(E.analyze({...base,coupon:0}).macaulay,10));
test('zero yield price equals principal plus coupons',()=>near(E.price({...base,yield:0}),1200));
test('known semiannual textbook price',()=>near(E.price({...base,coupon:.1,yield:.12,years:2,freq:2}),965.3489438730031,1e-7));
test('price decreases with yield',()=>{for(let years of [1,2,10,30]){let b={...base,years};assert.ok(E.price(b,.01)>E.price(b,.03));}});
test('cashflow weights sum to one',()=>near(E.analyze(base).rows.reduce((s,x)=>s+x.weight,0),1));
test('modified duration matches central finite differences',()=>{for(let freq of [1,2,4]){let b={...base,freq},a=E.analyze(b),h=1e-5,d=-(E.price(b,b.yield+h)-E.price(b,b.yield-h))/(2*h*a.price);near(a.modified,d,1e-5);}});
test('convexity matches central finite differences',()=>{let a=E.analyze(base),h=1e-4,cv=(E.price(base,base.yield+h)+E.price(base,base.yield-h)-2*a.price)/(h*h*a.price);near(a.convexity,cv,0.001);});
test('DV01 matches one-basis-point central difference',()=>{let a=E.analyze(base);near(a.dv01,(E.price(base,.0199)-E.price(base,.0201))/2,1e-6);});
test('convexity reduces approximation error in plus/minus 100bp scenarios',()=>{for(let bp of [-100,100]){let s=E.shock(base,bp);assert.ok(Math.abs(s.errorQuadratic)<Math.abs(s.errorLinear));}});
test('long bond positive YTM but negative one-year return',()=>{near(E.holding(base,100,1).total,-.05786108921879101);assert.ok(E.holding({...base,years:2},100,1).total>0);});
test('maturity payment has principal exactly once',()=>{let h=E.holding(base,100,10,false);near(h.terminal,1000);near(h.coupons,200);near(h.total,.2);});
test('no shock and reinvestment reproduce effective annual YTM',()=>{for(let freq of [1,2,4]){let b={...base,freq};near(E.holding(b,0,10,true).annual,(1+b.yield/freq)**freq-1);}});
test('price rises under a valid negative yield',()=>assert.ok(E.price({...base,yield:-.01})>1000));
test('invalid frequencies and horizons are rejected',()=>{assert.throws(()=>E.analyze({...base,freq:3}));assert.throws(()=>E.holding(base,100,11));assert.throws(()=>E.analyze({...base,years:1.5}));assert.throws(()=>E.analyze({...base,face:-100}));});
test('deterministic randomized bond grid satisfies pricing invariants',()=>{for(let t=1;t<=30;t++)for(let m of [1,2,4]){let b={...base,years:t,freq:m,coupon:(t%7)/100,yield:.01+(t%8)/100};assert.ok(E.price(b,b.yield-.001)>E.price(b,b.yield+.001));assert.ok(E.analyze(b).macaulay<=t+1e-9);}});
const examples=[base,{...base,years:2},{...base,coupon:0}].map(b=>({input:b,analysis:E.analyze(b),shock100:E.shock(b,100),holding1:E.holding(b,100,1)}));
fs.mkdirSync('evidence',{recursive:true});fs.writeFileSync('evidence/test-results.json',JSON.stringify({version:'v0.1',executedAt:new Date().toISOString(),passed:checks.length,checks},null,2));fs.writeFileSync('evidence/example-results.json',JSON.stringify(examples,null,2));console.log(`${checks.length} checks passed`);
