var app=function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function r(){return Object.create(null)}function s(t){t.forEach(n)}function o(t){return"function"==typeof t}function l(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}const a="undefined"!=typeof window;let c=a?()=>window.performance.now():()=>Date.now(),i=a?t=>requestAnimationFrame(t):t;const u=new Set;function d(t){u.forEach(e=>{e.c(t)||(u.delete(e),e.f())}),0!==u.size&&i(d)}function p(t,e){t.appendChild(e)}function f(t,e,n){t.insertBefore(e,n||null)}function m(t){t.parentNode.removeChild(t)}function g(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function h(t){return document.createElement(t)}function $(t){return document.createTextNode(t)}function y(){return $(" ")}function v(){return $("")}function _(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function b(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function x(t,e){e=""+e,t.data!==e&&(t.data=e)}const w=new Set;let j,k=0;function E(t,e,n,r,s,o,l,a=0){const c=16.666/r;let i="{\n";for(let t=0;t<=1;t+=c){const r=e+(n-e)*o(t);i+=100*t+`%{${l(r,1-r)}}\n`}const u=i+`100% {${l(n,1-n)}}\n}`,d=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(u)}_${a}`,p=t.ownerDocument;w.add(p);const f=p.__svelte_stylesheet||(p.__svelte_stylesheet=p.head.appendChild(h("style")).sheet),m=p.__svelte_rules||(p.__svelte_rules={});m[d]||(m[d]=!0,f.insertRule(`@keyframes ${d} ${u}`,f.cssRules.length));const g=t.style.animation||"";return t.style.animation=`${g?g+", ":""}${d} ${r}ms linear ${s}ms 1 both`,k+=1,d}function M(t,e){const n=(t.style.animation||"").split(", "),r=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),s=n.length-r.length;s&&(t.style.animation=r.join(", "),k-=s,k||i(()=>{k||(w.forEach(t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}}),w.clear())}))}function N(t){j=t}function P(t){(function(){if(!j)throw new Error("Function called outside component initialization");return j})().$$.on_mount.push(t)}const T=[],W=[],C=[],D=[],L=Promise.resolve();let F=!1;function R(t){C.push(t)}let A=!1;const O=new Set;function H(){if(!A){A=!0;do{for(let t=0;t<T.length;t+=1){const e=T[t];N(e),B(e.$$)}for(T.length=0;W.length;)W.pop()();for(let t=0;t<C.length;t+=1){const e=C[t];O.has(e)||(O.add(e),e())}C.length=0}while(T.length);for(;D.length;)D.pop()();F=!1,A=!1,O.clear()}}function B(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(R)}}let S;function z(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const J=new Set;let q;function I(){q={r:0,c:[],p:q}}function V(){q.r||s(q.c),q=q.p}function G(t,e){t&&t.i&&(J.delete(t),t.i(e))}function U(t,e,n,r){if(t&&t.o){if(J.has(t))return;J.add(t),q.c.push(()=>{J.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}const X={duration:0};function Y(n,r,l,a){let p=r(n,l),f=a?0:1,m=null,g=null,h=null;function $(){h&&M(n,h)}function y(t,e){const n=t.b-f;return e*=Math.abs(n),{a:f,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function v(r){const{delay:o=0,duration:l=300,easing:a=e,tick:v=t,css:_}=p||X,b={start:c()+o,b:r};r||(b.group=q,q.r+=1),m?g=b:(_&&($(),h=E(n,f,r,l,o,a,_)),r&&v(0,1),m=y(b,l),R(()=>z(n,r,"start")),function(t){let e;0===u.size&&i(d),new Promise(n=>{u.add(e={c:t,f:n})})}(t=>{if(g&&t>g.start&&(m=y(g,l),g=null,z(n,m.b,"start"),_&&($(),h=E(n,f,m.b,m.duration,0,a,p.css))),m)if(t>=m.end)v(f=m.b,1-f),z(n,m.b,"end"),g||(m.b?$():--m.group.r||s(m.group.c)),m=null;else if(t>=m.start){const e=t-m.start;f=m.a+m.d*a(e/m.duration),v(f,1-f)}return!(!m&&!g)}))}return{run(t){o(p)?(S||(S=Promise.resolve(),S.then(()=>{S=null})),S).then(()=>{p=p(),v(t)}):v(t)},end(){$(),m=g=null}}}function Z(t){t&&t.c()}function K(t,e,r){const{fragment:l,on_mount:a,on_destroy:c,after_update:i}=t.$$;l&&l.m(e,r),R(()=>{const e=a.map(n).filter(o);c?c.push(...e):s(e),t.$$.on_mount=[]}),i.forEach(R)}function Q(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function tt(t,e){-1===t.$$.dirty[0]&&(T.push(t),F||(F=!0,L.then(H)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function et(e,n,o,l,a,c,i=[-1]){const u=j;N(e);const d=n.props||{},p=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:a,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:r(),dirty:i};let f=!1;if(p.ctx=o?o(e,d,(t,n,...r)=>{const s=r.length?r[0]:n;return p.ctx&&a(p.ctx[t],p.ctx[t]=s)&&(p.bound[t]&&p.bound[t](s),f&&tt(e,t)),n}):[],p.update(),f=!0,s(p.before_update),p.fragment=!!l&&l(p.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);p.fragment&&p.fragment.l(t),t.forEach(m)}else p.fragment&&p.fragment.c();n.intro&&G(e.$$.fragment),K(e,n.target,n.anchor),H()}N(u)}class nt{$destroy(){Q(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}function rt(t,e,n){const r=t.slice();return r[3]=e[n],r}function st(t){let e,n,r,s,l,a,c=t[3]+"";return{c(){e=h("span"),n=$(c),r=y(),b(e,"class",s="picker-option "+(t[0]===t[3]?"selected":"")+" svelte-1w8kw7b"),b(e,"href",l="#"+t[3])},m(s,l,c){f(s,e,l),p(e,n),p(e,r),c&&a(),a=_(e,"click",(function(){o(t[2](t[3]))&&t[2](t[3]).apply(this,arguments)}))},p(r,o){t=r,2&o&&c!==(c=t[3]+"")&&x(n,c),3&o&&s!==(s="picker-option "+(t[0]===t[3]?"selected":"")+" svelte-1w8kw7b")&&b(e,"class",s),2&o&&l!==(l="#"+t[3])&&b(e,"href",l)},d(t){t&&m(e),a()}}}function ot(e){let n,r=e[1],s=[];for(let t=0;t<r.length;t+=1)s[t]=st(rt(e,r,t));return{c(){n=h("div");for(let t=0;t<s.length;t+=1)s[t].c();b(n,"class","picker svelte-1w8kw7b")},m(t,e){f(t,n,e);for(let t=0;t<s.length;t+=1)s[t].m(n,null)},p(t,[e]){if(7&e){let o;for(r=t[1],o=0;o<r.length;o+=1){const l=rt(t,r,o);s[o]?s[o].p(l,e):(s[o]=st(l),s[o].c(),s[o].m(n,null))}for(;o<s.length;o+=1)s[o].d(1);s.length=r.length}},i:t,o:t,d(t){t&&m(n),g(s,t)}}}function lt(t,e,n){let{pages:r=[]}=e,{activePage:s}=e;P(()=>{n(0,s=r[0])});return t.$set=t=>{"pages"in t&&n(1,r=t.pages),"activePage"in t&&n(0,s=t.activePage)},[s,r,t=>()=>n(0,s=t)]}class at extends nt{constructor(t){super(),et(this,t,lt,ot,l,{pages:1,activePage:0})}}function ct(t){const e=t-1;return e*e*e+1}function it(t,{delay:e=0,duration:n=400,easing:r=ct}){const s=getComputedStyle(t),o=+s.opacity,l=parseFloat(s.height),a=parseFloat(s.paddingTop),c=parseFloat(s.paddingBottom),i=parseFloat(s.marginTop),u=parseFloat(s.marginBottom),d=parseFloat(s.borderTopWidth),p=parseFloat(s.borderBottomWidth);return{delay:e,duration:n,easing:r,css:t=>`overflow: hidden;opacity: ${Math.min(20*t,1)*o};height: ${t*l}px;padding-top: ${t*a}px;padding-bottom: ${t*c}px;margin-top: ${t*i}px;margin-bottom: ${t*u}px;border-top-width: ${t*d}px;border-bottom-width: ${t*p}px;`}}function ut(t,e,n){const r=t.slice();return r[1]=e[n],r}function dt(t){let e,n,r,s,o,l,a,c,i,u,d,g,v,_,w,j,k,E,M,N=t[1].name+"",P=numeral(t[1].projMoney).format("$0,0")+"",T=(t[1].position?t[1].position:"")+"",W=(t[1].total?t[1].total:"")+"",C=(t[1].today?t[1].today:"")+"",D=(t[1].thru?t[1].thru:"")+"";return{c(){e=h("tr"),n=h("td"),r=$(N),s=y(),o=h("td"),l=$(P),a=y(),c=h("td"),i=$(T),u=y(),d=h("td"),g=$(W),v=y(),_=h("td"),w=$(C),j=y(),k=h("td"),E=$(D),M=y(),b(n,"class","svelte-guy1rs"),b(o,"class","svelte-guy1rs"),b(c,"class","svelte-guy1rs"),b(d,"class","svelte-guy1rs"),b(_,"class","svelte-guy1rs"),b(k,"class","svelte-guy1rs"),b(e,"class","player-row svelte-guy1rs")},m(t,m){f(t,e,m),p(e,n),p(n,r),p(e,s),p(e,o),p(o,l),p(e,a),p(e,c),p(c,i),p(e,u),p(e,d),p(d,g),p(e,v),p(e,_),p(_,w),p(e,j),p(e,k),p(k,E),p(e,M)},p(t,e){1&e&&N!==(N=t[1].name+"")&&x(r,N),1&e&&P!==(P=numeral(t[1].projMoney).format("$0,0")+"")&&x(l,P),1&e&&T!==(T=(t[1].position?t[1].position:"")+"")&&x(i,T),1&e&&W!==(W=(t[1].total?t[1].total:"")+"")&&x(g,W),1&e&&C!==(C=(t[1].today?t[1].today:"")+"")&&x(w,C),1&e&&D!==(D=(t[1].thru?t[1].thru:"")+"")&&x(E,D)},d(t){t&&m(e)}}}function pt(t){let e,n=t[1].isPlaying&&dt(t);return{c(){n&&n.c(),e=v()},m(t,r){n&&n.m(t,r),f(t,e,r)},p(t,r){t[1].isPlaying?n?n.p(t,r):(n=dt(t),n.c(),n.m(e.parentNode,e)):n&&(n.d(1),n=null)},d(t){n&&n.d(t),t&&m(e)}}}function ft(t){let e,n,r,s,o,l,a,c=t[0],i=[];for(let e=0;e<c.length;e+=1)i[e]=pt(ut(t,c,e));return{c(){e=h("div"),n=h("table"),r=h("thead"),r.innerHTML='<tr><th class="roster-header svelte-guy1rs">Golfer</th> \n                <th class="roster-header svelte-guy1rs">Proj. $</th> \n                <th class="roster-header svelte-guy1rs">Pos</th> \n                <th class="roster-header svelte-guy1rs">Total</th> \n                <th class="roster-header svelte-guy1rs">Today</th> \n                <th class="roster-header svelte-guy1rs">Thru</th></tr>',s=y(),o=h("tbody");for(let t=0;t<i.length;t+=1)i[t].c();b(n,"class","roster-table svelte-guy1rs"),b(e,"class","roster svelte-guy1rs")},m(t,l){f(t,e,l),p(e,n),p(n,r),p(n,s),p(n,o);for(let t=0;t<i.length;t+=1)i[t].m(o,null);a=!0},p(t,[e]){if(1&e){let n;for(c=t[0],n=0;n<c.length;n+=1){const r=ut(t,c,n);i[n]?i[n].p(r,e):(i[n]=pt(r),i[n].c(),i[n].m(o,null))}for(;n<i.length;n+=1)i[n].d(1);i.length=c.length}},i(t){a||(R(()=>{l||(l=Y(e,it,{},!0)),l.run(1)}),a=!0)},o(t){l||(l=Y(e,it,{},!1)),l.run(0),a=!1},d(t){t&&m(e),g(i,t),t&&l&&l.end()}}}function mt(t,e,n){let{roster:r}=e;return t.$set=t=>{"roster"in t&&n(0,r=t.roster)},[r]}class gt extends nt{constructor(t){super(),et(this,t,mt,ft,l,{roster:0})}}function ht(t){let e;const n=new gt({props:{roster:t[0].roster}});return{c(){Z(n.$$.fragment)},m(t,r){K(n,t,r),e=!0},p(t,e){const r={};1&e&&(r.roster=t[0].roster),n.$set(r)},i(t){e||(G(n.$$.fragment,t),e=!0)},o(t){U(n.$$.fragment,t),e=!1},d(t){Q(n,t)}}}function $t(t){let e,n,r,s,o,l,a,c,i,u,d,g,v,w,j,k,E,M,N,P,T,W,C,D=numeral(t[0].totalMoney).format("$0,0")+"",L=t[2]&&ht(t);return{c(){e=h("div"),n=h("div"),r=h("table"),s=h("tbody"),o=h("tr"),l=h("td"),a=$(t[1]),c=y(),i=h("td"),u=h("img"),g=y(),v=h("td"),w=$(t[3]),j=y(),k=h("div"),k.textContent=""+t[4],E=y(),M=h("td"),N=$(D),P=h("br"),T=y(),L&&L.c(),b(l,"class","standings-place-number svelte-1hpdjp4"),b(l,"width","30"),b(u,"class","player-photo svelte-1hpdjp4"),u.src!==(d=t[5])&&b(u,"src",d),b(u,"width","45"),b(u,"height","45"),b(i,"width","75"),b(k,"class","owner svelte-1hpdjp4"),b(v,"class","team-name svelte-1hpdjp4"),b(M,"class","team-earnings svelte-1hpdjp4"),b(r,"border","0"),b(r,"width","100%"),b(n,"class","header svelte-1hpdjp4"),b(e,"class","team svelte-1hpdjp4")},m(d,m,h){f(d,e,m),p(e,n),p(n,r),p(r,s),p(s,o),p(o,l),p(l,a),p(o,c),p(o,i),p(i,u),p(o,g),p(o,v),p(v,w),p(v,j),p(v,k),p(o,E),p(o,M),p(M,N),p(M,P),p(e,T),L&&L.m(e,null),W=!0,h&&C(),C=_(e,"click",t[6])},p(t,[n]){(!W||2&n)&&x(a,t[1]),(!W||1&n)&&D!==(D=numeral(t[0].totalMoney).format("$0,0")+"")&&x(N,D),t[2]?L?(L.p(t,n),4&n&&G(L,1)):(L=ht(t),L.c(),G(L,1),L.m(e,null)):L&&(I(),U(L,1,1,()=>{L=null}),V())},i(t){W||(G(L),W=!0)},o(t){U(L),W=!1},d(t){t&&m(e),L&&L.d(),C()}}}function yt(t,e,n){let{team:r}=e,{placeNumber:s}=e,o=(r.id.$t.replace("https://spreadsheets.google.com/feeds/list/1YsZn_ovmbxOE8gUlmAT7z_nUv5mg9qRdwnNAX-lIrnI/2/public/full/",""),r.gsx$team.$t),l=r.gsx$owner.$t,a="https://pga-tour-res.cloudinary.com/image/upload/c_fill,dpr_2.0,f_auto,g_face:center,h_45,q_auto,t_headshots_leaderboard_l,w_45/headshots_"+r.roster[0].id+".png",c=!1;return t.$set=t=>{"team"in t&&n(0,r=t.team),"placeNumber"in t&&n(1,s=t.placeNumber)},[r,s,c,o,l,a,function(){n(2,c=!c)}]}class vt extends nt{constructor(t){super(),et(this,t,yt,$t,l,{team:0,placeNumber:1})}}function _t(t,e,n){const r=t.slice();return r[7]=e[n],r[9]=n,r}function bt(e){let n,r,s;return{c(){n=h("img"),s=h("span"),s.textContent=" Loading current tournament",b(n,"class","sheets-icon"),n.src!==(r="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x32.png")&&b(n,"src","https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x32.png")},m(t,e){f(t,n,e),f(t,s,e)},p:t,d(t){t&&m(n),t&&m(s)}}}function xt(t){let e,n;return{c(){e=h("h1"),n=$(t[1]),b(e,"class","tourney-name svelte-1lgxfo5")},m(t,r){f(t,e,r),p(e,n)},p(t,e){2&e&&x(n,t[1])},d(t){t&&m(e)}}}function wt(e){let n,r,s;return{c(){n=h("img"),s=h("span"),s.textContent=" Loading teams and standings",b(n,"class","sheets-icon"),n.src!==(r="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x32.png")&&b(n,"src","https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x32.png")},m(t,e){f(t,n,e),f(t,s,e)},p:t,i:t,o:t,d(t){t&&m(n),t&&m(s)}}}function jt(t){let e,n,r=t[0],s=[];for(let e=0;e<r.length;e+=1)s[e]=kt(_t(t,r,e));const o=t=>U(s[t],1,1,()=>{s[t]=null});return{c(){for(let t=0;t<s.length;t+=1)s[t].c();e=v()},m(t,r){for(let e=0;e<s.length;e+=1)s[e].m(t,r);f(t,e,r),n=!0},p(t,n){if(1&n){let l;for(r=t[0],l=0;l<r.length;l+=1){const o=_t(t,r,l);s[l]?(s[l].p(o,n),G(s[l],1)):(s[l]=kt(o),s[l].c(),G(s[l],1),s[l].m(e.parentNode,e))}for(I(),l=r.length;l<s.length;l+=1)o(l);V()}},i(t){if(!n){for(let t=0;t<r.length;t+=1)G(s[t]);n=!0}},o(t){s=s.filter(Boolean);for(let t=0;t<s.length;t+=1)U(s[t]);n=!1},d(t){g(s,t),t&&m(e)}}}function kt(t){let e;const n=new vt({props:{team:t[7],placeNumber:t[9]+1}});return{c(){Z(n.$$.fragment)},m(t,r){K(n,t,r),e=!0},p(t,e){const r={};1&e&&(r.team=t[7]),n.$set(r)},i(t){e||(G(n.$$.fragment,t),e=!0)},o(t){U(n.$$.fragment,t),e=!1},d(t){Q(n,t)}}}function Et(t){let e,n,r,s,o;function l(t,e){return t[1]?xt:bt}let a=l(t),c=a(t);const i=[jt,wt],u=[];function d(t,e){return t[0]?0:1}return r=d(t),s=u[r]=i[r](t),{c(){c.c(),e=y(),n=h("div"),s.c(),b(n,"class","teams")},m(t,s){c.m(t,s),f(t,e,s),f(t,n,s),u[r].m(n,null),o=!0},p(t,[o]){a===(a=l(t))&&c?c.p(t,o):(c.d(1),c=a(t),c&&(c.c(),c.m(e.parentNode,e)));let p=r;r=d(t),r===p?u[r].p(t,o):(I(),U(u[p],1,1,()=>{u[p]=null}),V(),s=u[r],s||(s=u[r]=i[r](t),s.c()),G(s,1),s.m(n,null))},i(t){o||(G(s),o=!0)},o(t){U(s),o=!1},d(t){c.d(t),t&&m(e),t&&m(n),u[r].d()}}}function Mt(t,e,n){let r,s;P(async()=>{const t=await l(),e=await a(t),n=await i();o(n,e)});const o=(t,e)=>{t.forEach(t=>{t.processed=!0,t.roster=[],t.totalMoney=0,null!=t.gsx$roster.$t&&JSON.parse(t.gsx$roster.$t).forEach(n=>{const r=e.filter(t=>t.player_id===n.id);if(r.length>0){n.isPlaying=!0;const e=r[0];n.name=e.player_bio.first_name+" "+e.player_bio.last_name,n.positionNum=parseInt(e.current_position.replace(/\D/g,"")),n.position=e.current_position,n.projMoney=e.rankings.projected_money_event,n.today=e.today,n.thru=e.thru,n.total=e.total,n.playerId=e.player_id,t.totalMoney+=e.rankings.projected_money_event}t.roster.push(n)})});const s=t.sort((t,e)=>t.totalMoney>e.totalMoney?-1:t.totalMoney<e.totalMoney?1:0);s.forEach(t=>{const e=t.roster.sort((t,e)=>t.projMoney>e.projMoney?-1:t.projMoney<e.projMoney?1:0);t.roster=e}),n(0,r=s)},l=async()=>{const t=await fetch("https://kvdb.io/vRrcDLPTr4WWpVTJxim1H/schedule"),e=await t.json(),r=new Date,o=e.feed.entry.filter(t=>new Date(Date.parse(t.gsx$date.$t))<=r.setHours(0,0,0,0)),l=o.slice(-1)[0].gsx$tournamentid.$t;return n(1,s=o.slice(-1)[0].gsx$name.$t),l},a=async t=>{const e=await fetch('https://kvdb.io/vRrcDLPTr4WWpVTJxim1H/pgasecurityblurb?timestamp="'+Date.now()),n=await e.text();return c(n,t)},c=async(t,e)=>{console.log(t);const n=await fetch("https://statdata.pgatour.com/r/"+e+"/2020/leaderboard-v2.json"+t);return(await n.json()).leaderboard.players},i=async()=>{const t=await fetch("https://kvdb.io/vRrcDLPTr4WWpVTJxim1H/rosters"),e=await t.json();return await e.feed.entry.filter(t=>t.gsx$roster.$t)};return[r,s]}class Nt extends nt{constructor(t){super(),et(this,t,Mt,Et,l,{})}}function Pt(t,e,n){const r=t.slice();return r[1]=e[n],r}function Tt(t){let e,n,r,s,o,l,a,c=t[1].gsx$player.$t+"",i=numeral(t[1].gsx$earnings.$t).format("$0,0")+"";return{c(){e=h("tr"),n=h("td"),r=$(c),s=y(),o=h("td"),l=$(i),a=y(),b(n,"class","svelte-guy1rs"),b(o,"class","svelte-guy1rs"),b(e,"class","player-row svelte-guy1rs")},m(t,c){f(t,e,c),p(e,n),p(n,r),p(e,s),p(e,o),p(o,l),p(e,a)},p(t,e){1&e&&c!==(c=t[1].gsx$player.$t+"")&&x(r,c),1&e&&i!==(i=numeral(t[1].gsx$earnings.$t).format("$0,0")+"")&&x(l,i)},d(t){t&&m(e)}}}function Wt(t){let e,n,r,s,o,l,a,c=t[0],i=[];for(let e=0;e<c.length;e+=1)i[e]=Tt(Pt(t,c,e));return{c(){e=h("div"),n=h("table"),r=h("thead"),r.innerHTML='<tr><th class="roster-header svelte-guy1rs">Golfer</th> \n                <th class="roster-header svelte-guy1rs">Earnings</th></tr>',s=y(),o=h("tbody");for(let t=0;t<i.length;t+=1)i[t].c();b(n,"class","roster-table svelte-guy1rs"),b(e,"class","roster svelte-guy1rs")},m(t,l){f(t,e,l),p(e,n),p(n,r),p(n,s),p(n,o);for(let t=0;t<i.length;t+=1)i[t].m(o,null);a=!0},p(t,[e]){if(1&e){let n;for(c=t[0],n=0;n<c.length;n+=1){const r=Pt(t,c,n);i[n]?i[n].p(r,e):(i[n]=Tt(r),i[n].c(),i[n].m(o,null))}for(;n<i.length;n+=1)i[n].d(1);i.length=c.length}},i(t){a||(R(()=>{l||(l=Y(e,it,{},!0)),l.run(1)}),a=!0)},o(t){l||(l=Y(e,it,{},!1)),l.run(0),a=!1},d(t){t&&m(e),g(i,t),t&&l&&l.end()}}}function Ct(t,e,n){let{roster:r}=e;return t.$set=t=>{"roster"in t&&n(0,r=t.roster)},[r]}class Dt extends nt{constructor(t){super(),et(this,t,Ct,Wt,l,{roster:0})}}function Lt(t){let e;const n=new Dt({props:{roster:t[0].roster}});return{c(){Z(n.$$.fragment)},m(t,r){K(n,t,r),e=!0},p(t,e){const r={};1&e&&(r.roster=t[0].roster),n.$set(r)},i(t){e||(G(n.$$.fragment,t),e=!0)},o(t){U(n.$$.fragment,t),e=!1},d(t){Q(n,t)}}}function Ft(t){let e,n,r,s,o,l,a,c,i,u,d,g,v,w,j,k,E,M,N,P,T,W,C,D,L=numeral(t[6]).format("$0")+"",F=numeral(t[5]).format("$0,0")+"",R=t[2]&&Lt(t);return{c(){e=h("div"),n=h("div"),r=h("table"),s=h("tbody"),o=h("tr"),l=h("td"),a=$(t[1]),c=y(),i=h("td"),u=h("span"),d=$(L),v=y(),w=h("td"),j=$(t[3]),k=y(),E=h("div"),E.textContent=""+t[4],M=y(),N=h("td"),P=$(F),T=h("br"),W=y(),R&&R.c(),b(l,"class","standings-place-number svelte-g1iyri"),b(l,"width","25"),b(u,"class",g="team-total-payout "+(t[6]<0?"negative":"")+" svelte-g1iyri"),b(i,"width","45"),b(i,"align","left"),b(E,"class","owner svelte-g1iyri"),b(w,"class","team-name svelte-g1iyri"),b(N,"class","team-earnings svelte-g1iyri"),b(r,"border","0"),b(r,"width","100%"),b(n,"class","header svelte-g1iyri"),b(e,"class","team svelte-g1iyri")},m(m,g,h){f(m,e,g),p(e,n),p(n,r),p(r,s),p(s,o),p(o,l),p(l,a),p(o,c),p(o,i),p(i,u),p(u,d),p(o,v),p(o,w),p(w,j),p(w,k),p(w,E),p(o,M),p(o,N),p(N,P),p(N,T),p(e,W),R&&R.m(e,null),C=!0,h&&D(),D=_(e,"click",t[7])},p(t,[n]){(!C||2&n)&&x(a,t[1]),t[2]?R?(R.p(t,n),4&n&&G(R,1)):(R=Lt(t),R.c(),G(R,1),R.m(e,null)):R&&(I(),U(R,1,1,()=>{R=null}),V())},i(t){C||(G(R),C=!0)},o(t){U(R),C=!1},d(t){t&&m(e),R&&R.d(),D()}}}function Rt(t,e,n){let{team:r}=e,{placeNumber:s}=e,o=r.gsx$teamname.$t,l=r.gsx$owner.$t,a=r.gsx$teamtotalearnings.$t,c=r.gsx$teampayout.$t,i=!1;return t.$set=t=>{"team"in t&&n(0,r=t.team),"placeNumber"in t&&n(1,s=t.placeNumber)},[r,s,i,o,l,a,c,function(){n(2,i=!i)}]}class At extends nt{constructor(t){super(),et(this,t,Rt,Ft,l,{team:0,placeNumber:1})}}function Ot(t,e,n){const r=t.slice();return r[2]=e[n],r[4]=n,r}function Ht(e){let n,r,s;return{c(){n=h("img"),s=h("span"),s.textContent=" Loading overall standings",b(n,"class","sheets-icon"),n.src!==(r="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x32.png")&&b(n,"src","https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x32.png")},m(t,e){f(t,n,e),f(t,s,e)},p:t,i:t,o:t,d(t){t&&m(n),t&&m(s)}}}function Bt(t){let e,n,r=t[0],s=[];for(let e=0;e<r.length;e+=1)s[e]=St(Ot(t,r,e));const o=t=>U(s[t],1,1,()=>{s[t]=null});return{c(){for(let t=0;t<s.length;t+=1)s[t].c();e=v()},m(t,r){for(let e=0;e<s.length;e+=1)s[e].m(t,r);f(t,e,r),n=!0},p(t,n){if(1&n){let l;for(r=t[0],l=0;l<r.length;l+=1){const o=Ot(t,r,l);s[l]?(s[l].p(o,n),G(s[l],1)):(s[l]=St(o),s[l].c(),G(s[l],1),s[l].m(e.parentNode,e))}for(I(),l=r.length;l<s.length;l+=1)o(l);V()}},i(t){if(!n){for(let t=0;t<r.length;t+=1)G(s[t]);n=!0}},o(t){s=s.filter(Boolean);for(let t=0;t<s.length;t+=1)U(s[t]);n=!1},d(t){g(s,t),t&&m(e)}}}function St(t){let e;const n=new At({props:{team:t[2],placeNumber:t[4]+1}});return{c(){Z(n.$$.fragment)},m(t,r){K(n,t,r),e=!0},p(t,e){const r={};1&e&&(r.team=t[2]),n.$set(r)},i(t){e||(G(n.$$.fragment,t),e=!0)},o(t){U(n.$$.fragment,t),e=!1},d(t){Q(n,t)}}}function zt(t){let e,n,r,s;const o=[Bt,Ht],l=[];function a(t,e){return t[0]?0:1}return n=a(t),r=l[n]=o[n](t),{c(){e=h("div"),r.c(),b(e,"class","teams")},m(t,r){f(t,e,r),l[n].m(e,null),s=!0},p(t,[s]){let c=n;n=a(t),n===c?l[n].p(t,s):(I(),U(l[c],1,1,()=>{l[c]=null}),V(),r=l[n],r||(r=l[n]=o[n](t),r.c()),G(r,1),r.m(e,null))},i(t){s||(G(r),s=!0)},o(t){U(r),s=!1},d(t){t&&m(e),l[n].d()}}}function Jt(t,e,n){let r;P(async()=>{n(0,r=await s())});const s=async()=>{const t=await fetch("https://kvdb.io/vRrcDLPTr4WWpVTJxim1H/overall"),e=await t.json(),n=e.feed.entry.filter(t=>""!=t.gsx$teamname.$t);return n.forEach(t=>{t.roster=[],e.feed.entry.forEach(e=>{e.gsx$team.$t==t.gsx$team.$t&&t.roster.push(e)})}),n.sort((t,e)=>numeral(t.gsx$teamtotalearnings.$t).value()>numeral(e.gsx$teamtotalearnings.$t).value()?-1:numeral(t.gsx$teamtotalearnings.$t).value()<numeral(e.gsx$teamtotalearnings.$t).value()?1:0)};return[r]}class qt extends nt{constructor(t){super(),et(this,t,Jt,zt,l,{})}}function It(t){let e;const n=new qt({});return{c(){Z(n.$$.fragment)},m(t,r){K(n,t,r),e=!0},i(t){e||(G(n.$$.fragment,t),e=!0)},o(t){U(n.$$.fragment,t),e=!1},d(t){Q(n,t)}}}function Vt(t){let e;const n=new Nt({});return{c(){Z(n.$$.fragment)},m(t,r){K(n,t,r),e=!0},i(t){e||(G(n.$$.fragment,t),e=!0)},o(t){U(n.$$.fragment,t),e=!1},d(t){Q(n,t)}}}function Gt(t){let e,n,r,s,o,l,a,c,i;function u(e){t[2].call(null,e)}let d={pages:t[1]};void 0!==t[0]&&(d.activePage=t[0]);const g=new at({props:d});W.push(()=>function(t,e,n){const r=t.$$.props[e];void 0!==r&&(t.$$.bound[r]=n,n(t.$$.ctx[r]))}(g,"activePage",u));const $=[Vt,It],v=[];function _(t,e){return"Weekly"===t[0]?0:"Overall"===t[0]?1:-1}return~(a=_(t))&&(c=v[a]=$[a](t)),{c(){e=h("div"),Z(g.$$.fragment),r=y(),s=h("br"),o=h("br"),l=y(),c&&c.c(),b(e,"id","main"),b(e,"class","svelte-cv1fkz")},m(t,n){f(t,e,n),K(g,e,null),p(e,r),p(e,s),p(e,o),p(e,l),~a&&v[a].m(e,null),i=!0},p(t,[r]){const s={};var o;!n&&1&r&&(n=!0,s.activePage=t[0],o=()=>n=!1,D.push(o)),g.$set(s);let l=a;a=_(t),a!==l&&(c&&(I(),U(v[l],1,1,()=>{v[l]=null}),V()),~a?(c=v[a],c||(c=v[a]=$[a](t),c.c()),G(c,1),c.m(e,null)):c=null)},i(t){i||(G(g.$$.fragment,t),G(c),i=!0)},o(t){U(g.$$.fragment,t),U(c),i=!1},d(t){t&&m(e),Q(g),~a&&v[a].d()}}}function Ut(t,e,n){let r="Weekly";return[r,["Weekly","Overall"],function(t){r=t,n(0,r)}]}return new class extends nt{constructor(t){super(),et(this,t,Ut,Gt,l,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
