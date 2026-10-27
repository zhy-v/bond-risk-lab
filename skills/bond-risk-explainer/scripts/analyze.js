'use strict';
const fs=require('node:fs'),E=require('../assets/engine.js');
if(!process.argv[2]){console.error('Usage: node scripts/analyze.js input.json');process.exit(1);}
try{let x=JSON.parse(fs.readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,'')),a=E.analyze(x.bond),s=E.shock(x.bond,x.shockBp),h=E.holding(x.bond,x.shockBp,x.holdingYears,!!x.reinvest);console.log(JSON.stringify({input:x,analysis:a,shock:s,holding:h,scope:'Teaching scenario; regular coupon-date valuation only.'},null,2));}catch(e){console.error(e.message);process.exit(1);}
