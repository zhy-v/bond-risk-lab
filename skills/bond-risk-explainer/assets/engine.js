(function(root){
  'use strict';
  function check(b){
    if(![b.face,b.coupon,b.yield,b.years,b.freq].every(Number.isFinite)) throw Error('请输入有效数字');
    if(b.face<=0||b.face>1e9||b.coupon<0||b.coupon>1||b.yield<=-0.5||b.yield>1||![1,2,4].includes(b.freq)||!Number.isInteger(b.years)||b.years<1||b.years>50) throw Error('面值须为正；票息0–100%；收益率大于−50%且不超过100%；期限1–50整年');
  }
  function price(b,y=b.yield,years=b.years){
    if(years===0)return 0;
    if(y<=-b.freq)throw Error('收益率超出折现范围');
    let p=0,n=Math.round(years*b.freq),c=b.face*b.coupon/b.freq;
    for(let k=1;k<=n;k++)p+=(c+(k===n?b.face:0))/Math.pow(1+y/b.freq,k);
    return p;
  }
  function analyze(b){
    check(b);let p=price(b),d=0,cv=0,rows=[],n=b.years*b.freq;
    for(let k=1;k<=n;k++){
      let t=k/b.freq,cf=b.face*b.coupon/b.freq+(k===n?b.face:0),pv=cf/Math.pow(1+b.yield/b.freq,k);
      d+=t*pv;cv+=pv*k*(k+1)/(b.freq*b.freq*Math.pow(1+b.yield/b.freq,2));
      rows.push({period:k,year:t,cashflow:cf,pv,weight:pv/p});
    }
    d/=p;cv/=p;let modified=d/(1+b.yield/b.freq);
    return {price:p,macaulay:d,modified,convexity:cv,dv01:p*modified*0.0001,rows};
  }
  function shock(b,bp){
    let a=analyze(b),dy=bp/10000,p=price(b,b.yield+dy),exact=p/a.price-1,linear=-a.modified*dy,quadratic=linear+0.5*a.convexity*dy*dy;
    return {bp,newYield:b.yield+dy,price:p,exact,linear,quadratic,errorLinear:(linear-exact)*10000,errorQuadratic:(quadratic-exact)*10000};
  }
  function holding(b,bp,h,reinvest=false){
    check(b);if(!Number.isInteger(h)||h<1||h>b.years)throw Error('持有期须为1至剩余期限之间的整年');
    let p0=price(b),y=b.yield+bp/10000,c=b.face*b.coupon/b.freq,coupons=0;
    if(y<=-b.freq)throw Error('冲击后收益率超出折现范围');
    for(let k=1;k<=h*b.freq;k++)coupons+=c*(reinvest?Math.pow(1+y/b.freq,h*b.freq-k):1);
    let terminal=b.years===h?b.face:price(b,y,b.years-h),end=terminal+coupons;
    return {initial:p0,terminal,couponCash:c*h*b.freq,coupons,reinvestment:coupons-c*h*b.freq,capital:terminal-p0,total:(end-p0)/p0,annual:Math.pow(end/p0,1/h)-1};
  }
  const api={check,price,analyze,shock,holding};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.BondEngine=api;
})(typeof globalThis==='undefined'?this:globalThis);
