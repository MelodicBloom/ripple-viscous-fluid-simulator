import{i as e,n as t,r as n,t as r}from"./index-D6ovB3ya.js";var i=r(`circle-dot`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`circle`,{cx:`12`,cy:`12`,r:`1`,key:`41hilf`}]]),a=r(`download`,[[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}],[`polyline`,{points:`7 10 12 15 17 10`,key:`2ggqvy`}],[`line`,{x1:`12`,x2:`12`,y1:`15`,y2:`3`,key:`1vk2je`}]]),o=r(`droplets`,[[`path`,{d:`M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z`,key:`1ptgy4`}],[`path`,{d:`M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97`,key:`1sl1rz`}]]),s=r(`rotate-ccw`,[[`path`,{d:`M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`,key:`1357e3`}],[`path`,{d:`M3 3v5h5`,key:`1xhq8a`}]]),c=r(`tornado`,[[`path`,{d:`M21 4H3`,key:`1hwok0`}],[`path`,{d:`M18 8H6`,key:`41n648`}],[`path`,{d:`M19 12H9`,key:`1g4lpz`}],[`path`,{d:`M16 16h-6`,key:`1j5d54`}],[`path`,{d:`M11 20H9`,key:`39obr8`}]]),l=r(`undo-2`,[[`path`,{d:`M9 14 4 9l5-5`,key:`102s5s`}],[`path`,{d:`M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11`,key:`f3b9sd`}]]),u=r(`waves`,[[`path`,{d:`M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1`,key:`knzxuh`}],[`path`,{d:`M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1`,key:`2jd2cc`}],[`path`,{d:`M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1`,key:`rd2r6e`}]]),d=e(n(),1);function f(e){var t,n,r=``;if(typeof e==`string`||typeof e==`number`)r+=e;else if(typeof e==`object`){if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(n=f(e[t]))&&(r&&(r+=` `),r+=n)}else for(n in e)e[n]&&(r&&(r+=` `),r+=n)}return r}function p(){for(var e,t,n=0,r=``,i=arguments.length;n<i;n++)(e=arguments[n])&&(t=f(e))&&(r&&(r+=` `),r+=t);return r}var m=(e,t)=>{let n=Array(e.length+t.length);for(let t=0;t<e.length;t++)n[t]=e[t];for(let r=0;r<t.length;r++)n[e.length+r]=t[r];return n},h=(e,t)=>({classGroupId:e,validator:t}),g=(e=new Map,t=null,n)=>({nextPart:e,validators:t,classGroupId:n}),_=`-`,v=[],y=`arbitrary..`,b=e=>{let t=C(e),{conflictingClassGroups:n,conflictingClassGroupModifiers:r}=e;return{getClassGroupId:e=>{if(e.startsWith(`[`)&&e.endsWith(`]`))return S(e);let n=e.split(_);return x(n,+(n[0]===``&&n.length>1),t)},getConflictingClassGroupIds:(e,t)=>{if(t){let t=r[e],i=n[e];return t?i?m(i,t):t:i||v}return n[e]||v}}},x=(e,t,n)=>{if(e.length-t===0)return n.classGroupId;let r=e[t],i=n.nextPart.get(r);if(i){let n=x(e,t+1,i);if(n)return n}let a=n.validators;if(a===null)return;let o=t===0?e.join(_):e.slice(t).join(_),s=a.length;for(let e=0;e<s;e++){let t=a[e];if(t.validator(o))return t.classGroupId}},S=e=>e.slice(1,-1).indexOf(`:`)===-1?void 0:(()=>{let t=e.slice(1,-1),n=t.indexOf(`:`),r=t.slice(0,n);return r?y+r:void 0})(),C=e=>{let{theme:t,classGroups:n}=e;return w(n,t)},w=(e,t)=>{let n=g();for(let r in e){let i=e[r];T(i,n,r,t)}return n},T=(e,t,n,r)=>{let i=e.length;for(let a=0;a<i;a++){let i=e[a];ee(i,t,n,r)}},ee=(e,t,n,r)=>{if(typeof e==`string`){te(e,t,n);return}if(typeof e==`function`){E(e,t,n,r);return}ne(e,t,n,r)},te=(e,t,n)=>{let r=e===``?t:re(t,e);r.classGroupId=n},E=(e,t,n,r)=>{if(D(e)){T(e(r),t,n,r);return}t.validators===null&&(t.validators=[]),t.validators.push(h(n,e))},ne=(e,t,n,r)=>{let i=Object.entries(e),a=i.length;for(let e=0;e<a;e++){let[a,o]=i[e];T(o,re(t,a),n,r)}},re=(e,t)=>{let n=e,r=t.split(_),i=r.length;for(let e=0;e<i;e++){let t=r[e],i=n.nextPart.get(t);i||(i=g(),n.nextPart.set(t,i)),n=i}return n},D=e=>`isThemeGetter`in e&&e.isThemeGetter===!0,O=e=>{if(e<1)return{get:()=>void 0,set:()=>{}};let t=0,n=Object.create(null),r=Object.create(null),i=(i,a)=>{n[i]=a,t++,t>e&&(t=0,r=n,n=Object.create(null))};return{get(e){let t=n[e];if(t!==void 0)return t;if((t=r[e])!==void 0)return i(e,t),t},set(e,t){e in n?n[e]=t:i(e,t)}}},k=`!`,A=`:`,ie=[],j=(e,t,n,r,i)=>({modifiers:e,hasImportantModifier:t,baseClassName:n,maybePostfixModifierPosition:r,isExternal:i}),ae=e=>{let{prefix:t,experimentalParseClassName:n}=e,r=e=>{let t=[],n=0,r=0,i=0,a,o=e.length;for(let s=0;s<o;s++){let o=e[s];if(n===0&&r===0){if(o===A){t.push(e.slice(i,s)),i=s+1;continue}if(o===`/`){a=s;continue}}o===`[`?n++:o===`]`?n--:o===`(`?r++:o===`)`&&r--}let s=t.length===0?e:e.slice(i),c=s,l=!1;s.endsWith(k)?(c=s.slice(0,-1),l=!0):s.startsWith(k)&&(c=s.slice(1),l=!0);let u=a&&a>i?a-i:void 0;return j(t,l,c,u)};if(t){let e=t+A,n=r;r=t=>t.startsWith(e)?n(t.slice(e.length)):j(ie,!1,t,void 0,!0)}if(n){let e=r;r=t=>n({className:t,parseClassName:e})}return r},oe=e=>{let t=new Map;return e.orderSensitiveModifiers.forEach((e,n)=>{t.set(e,1e6+n)}),e=>{let n=[],r=[];for(let i=0;i<e.length;i++){let a=e[i],o=a[0]===`[`,s=t.has(a);o||s?(r.length>0&&(r.sort(),n.push(...r),r=[]),n.push(a)):r.push(a)}return r.length>0&&(r.sort(),n.push(...r)),n}},se=e=>({cache:O(e.cacheSize),parseClassName:ae(e),sortModifiers:oe(e),postfixLookupClassGroupIds:ce(e),...b(e)}),ce=e=>{let t=Object.create(null),n=e.postfixLookupClassGroups;if(n)for(let e=0;e<n.length;e++)t[n[e]]=!0;return t},M=/\s+/,N=(e,t)=>{let{parseClassName:n,getClassGroupId:r,getConflictingClassGroupIds:i,sortModifiers:a,postfixLookupClassGroupIds:o}=t,s=[],c=e.trim().split(M),l=``;for(let e=c.length-1;e>=0;--e){let t=c[e],{isExternal:u,modifiers:d,hasImportantModifier:f,baseClassName:p,maybePostfixModifierPosition:m}=n(t);if(u){l=t+(l.length>0?` `+l:l);continue}let h=!!m,g;if(h){g=r(p.substring(0,m));let e=g&&o[g]?r(p):void 0;e&&e!==g&&(g=e,h=!1)}else g=r(p);if(!g){if(!h){l=t+(l.length>0?` `+l:l);continue}if(g=r(p),!g){l=t+(l.length>0?` `+l:l);continue}h=!1}let _=d.length===0?``:d.length===1?d[0]:a(d).join(`:`),v=f?_+k:_,y=v+g;if(s.indexOf(y)>-1)continue;s.push(y);let b=i(g,h);for(let e=0;e<b.length;++e){let t=b[e];s.push(v+t)}l=t+(l.length>0?` `+l:l)}return l},P=(...e)=>{let t=0,n,r,i=``;for(;t<e.length;)(n=e[t++])&&(r=le(n))&&(i&&(i+=` `),i+=r);return i},le=e=>{if(typeof e==`string`)return e;let t,n=``;for(let r=0;r<e.length;r++)e[r]&&(t=le(e[r]))&&(n&&(n+=` `),n+=t);return n},F=(e,...t)=>{let n,r,i,a,o=o=>(n=se(t.reduce((e,t)=>t(e),e())),r=n.cache.get,i=n.cache.set,a=s,s(o)),s=e=>{let t=r(e);if(t)return t;let a=N(e,n);return i(e,a),a};return a=o,(...e)=>a(P(...e))},ue=[],I=e=>{let t=t=>t[e]||ue;return t.isThemeGetter=!0,t},L=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,R=/^\((?:(\w[\w-]*):)?(.+)\)$/i,de=/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,z=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,fe=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,pe=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,me=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,he=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,B=e=>de.test(e),V=e=>!!e&&!Number.isNaN(Number(e)),H=e=>!!e&&Number.isInteger(Number(e)),ge=e=>e.endsWith(`%`)&&V(e.slice(0,-1)),U=e=>z.test(e),_e=()=>!0,ve=e=>fe.test(e)&&!pe.test(e),ye=()=>!1,be=e=>me.test(e),xe=e=>he.test(e),Se=e=>!W(e)&&!K(e),Ce=e=>e.startsWith(`@container`)&&(e[10]===`/`&&e[11]!==void 0||e[11]===`s`&&e[16]!==void 0&&e.startsWith(`-size/`,10)||e[11]===`n`&&e[18]!==void 0&&e.startsWith(`-normal/`,10)),we=e=>q(e,Be,ye),W=e=>L.test(e),G=e=>q(e,Ve,ve),Te=e=>q(e,He,V),Ee=e=>q(e,We,_e),De=e=>q(e,Ue,ye),Oe=e=>q(e,Re,ye),ke=e=>q(e,ze,xe),Ae=e=>q(e,Ge,be),K=e=>R.test(e),je=e=>J(e,Ve),Me=e=>J(e,Ue),Ne=e=>J(e,Re),Pe=e=>J(e,Be),Fe=e=>J(e,ze),Ie=e=>J(e,Ge,!0),Le=e=>J(e,We,!0),q=(e,t,n)=>{let r=L.exec(e);return r?r[1]?t(r[1]):n(r[2]):!1},J=(e,t,n=!1)=>{let r=R.exec(e);return r?r[1]?t(r[1]):n:!1},Re=e=>e===`position`||e===`percentage`,ze=e=>e===`image`||e===`url`,Be=e=>e===`length`||e===`size`||e===`bg-size`,Ve=e=>e===`length`,He=e=>e===`number`,Ue=e=>e===`family-name`,We=e=>e===`number`||e===`weight`,Ge=e=>e===`shadow`,Ke=F(()=>{let e=I(`color`),t=I(`font`),n=I(`text`),r=I(`font-weight`),i=I(`tracking`),a=I(`leading`),o=I(`breakpoint`),s=I(`container`),c=I(`spacing`),l=I(`radius`),u=I(`shadow`),d=I(`inset-shadow`),f=I(`text-shadow`),p=I(`drop-shadow`),m=I(`blur`),h=I(`perspective`),g=I(`aspect`),_=I(`ease`),v=I(`animate`),y=()=>[`auto`,`avoid`,`all`,`avoid-page`,`page`,`left`,`right`,`column`],b=()=>[`center`,`top`,`bottom`,`left`,`right`,`top-left`,`left-top`,`top-right`,`right-top`,`bottom-right`,`right-bottom`,`bottom-left`,`left-bottom`],x=()=>[...b(),K,W],S=()=>[`auto`,`hidden`,`clip`,`visible`,`scroll`],C=()=>[`auto`,`contain`,`none`],w=()=>[K,W,c],T=()=>[B,`full`,`auto`,...w()],ee=()=>[H,`none`,`subgrid`,K,W],te=()=>[`auto`,{span:[`full`,H,K,W]},H,K,W],E=()=>[H,`auto`,K,W],ne=()=>[`auto`,`min`,`max`,`fr`,K,W],re=()=>[`start`,`end`,`center`,`between`,`around`,`evenly`,`stretch`,`baseline`,`center-safe`,`end-safe`],D=()=>[`start`,`end`,`center`,`stretch`,`center-safe`,`end-safe`],O=()=>[`auto`,...w()],k=()=>[B,`auto`,`full`,`dvw`,`dvh`,`lvw`,`lvh`,`svw`,`svh`,`min`,`max`,`fit`,...w()],A=()=>[B,`screen`,`full`,`dvw`,`lvw`,`svw`,`min`,`max`,`fit`,...w()],ie=()=>[B,`screen`,`full`,`lh`,`dvh`,`lvh`,`svh`,`min`,`max`,`fit`,...w()],j=()=>[e,K,W],ae=()=>[...b(),Ne,Oe,{position:[K,W]}],oe=()=>[`no-repeat`,{repeat:[``,`x`,`y`,`space`,`round`]}],se=()=>[`auto`,`cover`,`contain`,Pe,we,{size:[K,W]}],ce=()=>[ge,je,G],M=()=>[``,`none`,`full`,l,K,W],N=()=>[``,V,je,G],P=()=>[`solid`,`dashed`,`dotted`,`double`],le=()=>[`normal`,`multiply`,`screen`,`overlay`,`darken`,`lighten`,`color-dodge`,`color-burn`,`hard-light`,`soft-light`,`difference`,`exclusion`,`hue`,`saturation`,`color`,`luminosity`],F=()=>[V,ge,Ne,Oe],ue=()=>[``,`none`,m,K,W],L=()=>[`none`,V,K,W],R=()=>[`none`,V,K,W],de=()=>[V,K,W],z=()=>[B,`full`,...w()];return{cacheSize:500,theme:{animate:[`spin`,`ping`,`pulse`,`bounce`],aspect:[`video`],blur:[U],breakpoint:[U],color:[_e],container:[U],"drop-shadow":[U],ease:[`in`,`out`,`in-out`],font:[Se],"font-weight":[`thin`,`extralight`,`light`,`normal`,`medium`,`semibold`,`bold`,`extrabold`,`black`],"inset-shadow":[U],leading:[`none`,`tight`,`snug`,`normal`,`relaxed`,`loose`],perspective:[`dramatic`,`near`,`normal`,`midrange`,`distant`,`none`],radius:[U],shadow:[U],spacing:[`px`,V],text:[U],"text-shadow":[U],tracking:[`tighter`,`tight`,`normal`,`wide`,`wider`,`widest`]},classGroups:{aspect:[{aspect:[`auto`,`square`,B,W,K,g]}],container:[`container`],"container-type":[{"@container":[``,`normal`,`size`,K,W]}],"container-named":[Ce],columns:[{columns:[V,W,K,s]}],"break-after":[{"break-after":y()}],"break-before":[{"break-before":y()}],"break-inside":[{"break-inside":[`auto`,`avoid`,`avoid-page`,`avoid-column`]}],"box-decoration":[{"box-decoration":[`slice`,`clone`]}],box:[{box:[`border`,`content`]}],display:[`block`,`inline-block`,`inline`,`flex`,`inline-flex`,`table`,`inline-table`,`table-caption`,`table-cell`,`table-column`,`table-column-group`,`table-footer-group`,`table-header-group`,`table-row-group`,`table-row`,`flow-root`,`grid`,`inline-grid`,`contents`,`list-item`,`hidden`],sr:[`sr-only`,`not-sr-only`],float:[{float:[`right`,`left`,`none`,`start`,`end`]}],clear:[{clear:[`left`,`right`,`both`,`none`,`start`,`end`]}],isolation:[`isolate`,`isolation-auto`],"object-fit":[{object:[`contain`,`cover`,`fill`,`none`,`scale-down`]}],"object-position":[{object:x()}],overflow:[{overflow:S()}],"overflow-x":[{"overflow-x":S()}],"overflow-y":[{"overflow-y":S()}],overscroll:[{overscroll:C()}],"overscroll-x":[{"overscroll-x":C()}],"overscroll-y":[{"overscroll-y":C()}],position:[`static`,`fixed`,`absolute`,`relative`,`sticky`],inset:[{inset:T()}],"inset-x":[{"inset-x":T()}],"inset-y":[{"inset-y":T()}],start:[{"inset-s":T(),start:T()}],end:[{"inset-e":T(),end:T()}],"inset-bs":[{"inset-bs":T()}],"inset-be":[{"inset-be":T()}],top:[{top:T()}],right:[{right:T()}],bottom:[{bottom:T()}],left:[{left:T()}],visibility:[`visible`,`invisible`,`collapse`],z:[{z:[H,`auto`,K,W]}],basis:[{basis:[B,`full`,`auto`,s,...w()]}],"flex-direction":[{flex:[`row`,`row-reverse`,`col`,`col-reverse`]}],"flex-wrap":[{flex:[`nowrap`,`wrap`,`wrap-reverse`]}],flex:[{flex:[V,B,`auto`,`initial`,`none`,W]}],grow:[{grow:[``,V,K,W]}],shrink:[{shrink:[``,V,K,W]}],order:[{order:[H,`first`,`last`,`none`,K,W]}],"grid-cols":[{"grid-cols":ee()}],"col-start-end":[{col:te()}],"col-start":[{"col-start":E()}],"col-end":[{"col-end":E()}],"grid-rows":[{"grid-rows":ee()}],"row-start-end":[{row:te()}],"row-start":[{"row-start":E()}],"row-end":[{"row-end":E()}],"grid-flow":[{"grid-flow":[`row`,`col`,`dense`,`row-dense`,`col-dense`]}],"auto-cols":[{"auto-cols":ne()}],"auto-rows":[{"auto-rows":ne()}],gap:[{gap:w()}],"gap-x":[{"gap-x":w()}],"gap-y":[{"gap-y":w()}],"justify-content":[{justify:[...re(),`normal`]}],"justify-items":[{"justify-items":[...D(),`normal`]}],"justify-self":[{"justify-self":[`auto`,...D()]}],"align-content":[{content:[`normal`,...re()]}],"align-items":[{items:[...D(),{baseline:[``,`last`]}]}],"align-self":[{self:[`auto`,...D(),{baseline:[``,`last`]}]}],"place-content":[{"place-content":re()}],"place-items":[{"place-items":[...D(),`baseline`]}],"place-self":[{"place-self":[`auto`,...D()]}],p:[{p:w()}],px:[{px:w()}],py:[{py:w()}],ps:[{ps:w()}],pe:[{pe:w()}],pbs:[{pbs:w()}],pbe:[{pbe:w()}],pt:[{pt:w()}],pr:[{pr:w()}],pb:[{pb:w()}],pl:[{pl:w()}],m:[{m:O()}],mx:[{mx:O()}],my:[{my:O()}],ms:[{ms:O()}],me:[{me:O()}],mbs:[{mbs:O()}],mbe:[{mbe:O()}],mt:[{mt:O()}],mr:[{mr:O()}],mb:[{mb:O()}],ml:[{ml:O()}],"space-x":[{"space-x":w()}],"space-x-reverse":[`space-x-reverse`],"space-y":[{"space-y":w()}],"space-y-reverse":[`space-y-reverse`],size:[{size:k()}],"inline-size":[{inline:[`auto`,...A()]}],"min-inline-size":[{"min-inline":[`auto`,...A()]}],"max-inline-size":[{"max-inline":[`none`,...A()]}],"block-size":[{block:[`auto`,...ie()]}],"min-block-size":[{"min-block":[`auto`,...ie()]}],"max-block-size":[{"max-block":[`none`,...ie()]}],w:[{w:[s,`screen`,...k()]}],"min-w":[{"min-w":[s,`screen`,`none`,...k()]}],"max-w":[{"max-w":[s,`screen`,`none`,`prose`,{screen:[o]},...k()]}],h:[{h:[`screen`,`lh`,...k()]}],"min-h":[{"min-h":[`screen`,`lh`,`none`,...k()]}],"max-h":[{"max-h":[`screen`,`lh`,...k()]}],"font-size":[{text:[`base`,n,je,G]}],"font-smoothing":[`antialiased`,`subpixel-antialiased`],"font-style":[`italic`,`not-italic`],"font-weight":[{font:[r,Le,Ee]}],"font-stretch":[{"font-stretch":[`ultra-condensed`,`extra-condensed`,`condensed`,`semi-condensed`,`normal`,`semi-expanded`,`expanded`,`extra-expanded`,`ultra-expanded`,ge,W]}],"font-family":[{font:[Me,De,t]}],"font-features":[{"font-features":[W]}],"fvn-normal":[`normal-nums`],"fvn-ordinal":[`ordinal`],"fvn-slashed-zero":[`slashed-zero`],"fvn-figure":[`lining-nums`,`oldstyle-nums`],"fvn-spacing":[`proportional-nums`,`tabular-nums`],"fvn-fraction":[`diagonal-fractions`,`stacked-fractions`],tracking:[{tracking:[i,K,W]}],"line-clamp":[{"line-clamp":[V,`none`,K,Te]}],leading:[{leading:[a,...w()]}],"list-image":[{"list-image":[`none`,K,W]}],"list-style-position":[{list:[`inside`,`outside`]}],"list-style-type":[{list:[`disc`,`decimal`,`none`,K,W]}],"text-alignment":[{text:[`left`,`center`,`right`,`justify`,`start`,`end`]}],"placeholder-color":[{placeholder:j()}],"text-color":[{text:j()}],"text-decoration":[`underline`,`overline`,`line-through`,`no-underline`],"text-decoration-style":[{decoration:[...P(),`wavy`]}],"text-decoration-thickness":[{decoration:[V,`from-font`,`auto`,K,G]}],"text-decoration-color":[{decoration:j()}],"underline-offset":[{"underline-offset":[V,`auto`,K,W]}],"text-transform":[`uppercase`,`lowercase`,`capitalize`,`normal-case`],"text-overflow":[`truncate`,`text-ellipsis`,`text-clip`],"text-wrap":[{text:[`wrap`,`nowrap`,`balance`,`pretty`]}],indent:[{indent:w()}],"tab-size":[{tab:[H,K,W]}],"vertical-align":[{align:[`baseline`,`top`,`middle`,`bottom`,`text-top`,`text-bottom`,`sub`,`super`,K,W]}],whitespace:[{whitespace:[`normal`,`nowrap`,`pre`,`pre-line`,`pre-wrap`,`break-spaces`]}],break:[{break:[`normal`,`words`,`all`,`keep`]}],wrap:[{wrap:[`break-word`,`anywhere`,`normal`]}],hyphens:[{hyphens:[`none`,`manual`,`auto`]}],content:[{content:[`none`,K,W]}],"bg-attachment":[{bg:[`fixed`,`local`,`scroll`]}],"bg-clip":[{"bg-clip":[`border`,`padding`,`content`,`text`]}],"bg-origin":[{"bg-origin":[`border`,`padding`,`content`]}],"bg-position":[{bg:ae()}],"bg-repeat":[{bg:oe()}],"bg-size":[{bg:se()}],"bg-image":[{bg:[`none`,{linear:[{to:[`t`,`tr`,`r`,`br`,`b`,`bl`,`l`,`tl`]},H,K,W],radial:[``,K,W],conic:[H,K,W]},Fe,ke]}],"bg-color":[{bg:j()}],"gradient-from-pos":[{from:ce()}],"gradient-via-pos":[{via:ce()}],"gradient-to-pos":[{to:ce()}],"gradient-from":[{from:j()}],"gradient-via":[{via:j()}],"gradient-to":[{to:j()}],rounded:[{rounded:M()}],"rounded-s":[{"rounded-s":M()}],"rounded-e":[{"rounded-e":M()}],"rounded-t":[{"rounded-t":M()}],"rounded-r":[{"rounded-r":M()}],"rounded-b":[{"rounded-b":M()}],"rounded-l":[{"rounded-l":M()}],"rounded-ss":[{"rounded-ss":M()}],"rounded-se":[{"rounded-se":M()}],"rounded-ee":[{"rounded-ee":M()}],"rounded-es":[{"rounded-es":M()}],"rounded-tl":[{"rounded-tl":M()}],"rounded-tr":[{"rounded-tr":M()}],"rounded-br":[{"rounded-br":M()}],"rounded-bl":[{"rounded-bl":M()}],"border-w":[{border:N()}],"border-w-x":[{"border-x":N()}],"border-w-y":[{"border-y":N()}],"border-w-s":[{"border-s":N()}],"border-w-e":[{"border-e":N()}],"border-w-bs":[{"border-bs":N()}],"border-w-be":[{"border-be":N()}],"border-w-t":[{"border-t":N()}],"border-w-r":[{"border-r":N()}],"border-w-b":[{"border-b":N()}],"border-w-l":[{"border-l":N()}],"divide-x":[{"divide-x":N()}],"divide-x-reverse":[`divide-x-reverse`],"divide-y":[{"divide-y":N()}],"divide-y-reverse":[`divide-y-reverse`],"border-style":[{border:[...P(),`hidden`,`none`]}],"divide-style":[{divide:[...P(),`hidden`,`none`]}],"border-color":[{border:j()}],"border-color-x":[{"border-x":j()}],"border-color-y":[{"border-y":j()}],"border-color-s":[{"border-s":j()}],"border-color-e":[{"border-e":j()}],"border-color-bs":[{"border-bs":j()}],"border-color-be":[{"border-be":j()}],"border-color-t":[{"border-t":j()}],"border-color-r":[{"border-r":j()}],"border-color-b":[{"border-b":j()}],"border-color-l":[{"border-l":j()}],"divide-color":[{divide:j()}],"outline-style":[{outline:[...P(),`none`,`hidden`]}],"outline-offset":[{"outline-offset":[V,K,W]}],"outline-w":[{outline:[``,V,je,G]}],"outline-color":[{outline:j()}],shadow:[{shadow:[``,`none`,u,Ie,Ae]}],"shadow-color":[{shadow:j()}],"inset-shadow":[{"inset-shadow":[`none`,d,Ie,Ae]}],"inset-shadow-color":[{"inset-shadow":j()}],"ring-w":[{ring:N()}],"ring-w-inset":[`ring-inset`],"ring-color":[{ring:j()}],"ring-offset-w":[{"ring-offset":[V,G]}],"ring-offset-color":[{"ring-offset":j()}],"inset-ring-w":[{"inset-ring":N()}],"inset-ring-color":[{"inset-ring":j()}],"text-shadow":[{"text-shadow":[`none`,f,Ie,Ae]}],"text-shadow-color":[{"text-shadow":j()}],opacity:[{opacity:[V,K,W]}],"mix-blend":[{"mix-blend":[...le(),`plus-darker`,`plus-lighter`]}],"bg-blend":[{"bg-blend":le()}],"mask-clip":[{"mask-clip":[`border`,`padding`,`content`,`fill`,`stroke`,`view`]},`mask-no-clip`],"mask-composite":[{mask:[`add`,`subtract`,`intersect`,`exclude`]}],"mask-image-linear-pos":[{"mask-linear":[V]}],"mask-image-linear-from-pos":[{"mask-linear-from":F()}],"mask-image-linear-to-pos":[{"mask-linear-to":F()}],"mask-image-linear-from-color":[{"mask-linear-from":j()}],"mask-image-linear-to-color":[{"mask-linear-to":j()}],"mask-image-t-from-pos":[{"mask-t-from":F()}],"mask-image-t-to-pos":[{"mask-t-to":F()}],"mask-image-t-from-color":[{"mask-t-from":j()}],"mask-image-t-to-color":[{"mask-t-to":j()}],"mask-image-r-from-pos":[{"mask-r-from":F()}],"mask-image-r-to-pos":[{"mask-r-to":F()}],"mask-image-r-from-color":[{"mask-r-from":j()}],"mask-image-r-to-color":[{"mask-r-to":j()}],"mask-image-b-from-pos":[{"mask-b-from":F()}],"mask-image-b-to-pos":[{"mask-b-to":F()}],"mask-image-b-from-color":[{"mask-b-from":j()}],"mask-image-b-to-color":[{"mask-b-to":j()}],"mask-image-l-from-pos":[{"mask-l-from":F()}],"mask-image-l-to-pos":[{"mask-l-to":F()}],"mask-image-l-from-color":[{"mask-l-from":j()}],"mask-image-l-to-color":[{"mask-l-to":j()}],"mask-image-x-from-pos":[{"mask-x-from":F()}],"mask-image-x-to-pos":[{"mask-x-to":F()}],"mask-image-x-from-color":[{"mask-x-from":j()}],"mask-image-x-to-color":[{"mask-x-to":j()}],"mask-image-y-from-pos":[{"mask-y-from":F()}],"mask-image-y-to-pos":[{"mask-y-to":F()}],"mask-image-y-from-color":[{"mask-y-from":j()}],"mask-image-y-to-color":[{"mask-y-to":j()}],"mask-image-radial":[{"mask-radial":[K,W]}],"mask-image-radial-from-pos":[{"mask-radial-from":F()}],"mask-image-radial-to-pos":[{"mask-radial-to":F()}],"mask-image-radial-from-color":[{"mask-radial-from":j()}],"mask-image-radial-to-color":[{"mask-radial-to":j()}],"mask-image-radial-shape":[{"mask-radial":[`circle`,`ellipse`]}],"mask-image-radial-size":[{"mask-radial":[{closest:[`side`,`corner`],farthest:[`side`,`corner`]}]}],"mask-image-radial-pos":[{"mask-radial-at":b()}],"mask-image-conic-pos":[{"mask-conic":[V]}],"mask-image-conic-from-pos":[{"mask-conic-from":F()}],"mask-image-conic-to-pos":[{"mask-conic-to":F()}],"mask-image-conic-from-color":[{"mask-conic-from":j()}],"mask-image-conic-to-color":[{"mask-conic-to":j()}],"mask-mode":[{mask:[`alpha`,`luminance`,`match`]}],"mask-origin":[{"mask-origin":[`border`,`padding`,`content`,`fill`,`stroke`,`view`]}],"mask-position":[{mask:ae()}],"mask-repeat":[{mask:oe()}],"mask-size":[{mask:se()}],"mask-type":[{"mask-type":[`alpha`,`luminance`]}],"mask-image":[{mask:[`none`,K,W]}],filter:[{filter:[``,`none`,K,W]}],blur:[{blur:ue()}],brightness:[{brightness:[V,K,W]}],contrast:[{contrast:[V,K,W]}],"drop-shadow":[{"drop-shadow":[``,`none`,p,Ie,Ae]}],"drop-shadow-color":[{"drop-shadow":j()}],grayscale:[{grayscale:[``,V,K,W]}],"hue-rotate":[{"hue-rotate":[V,K,W]}],invert:[{invert:[``,V,K,W]}],saturate:[{saturate:[V,K,W]}],sepia:[{sepia:[``,V,K,W]}],"backdrop-filter":[{"backdrop-filter":[``,`none`,K,W]}],"backdrop-blur":[{"backdrop-blur":ue()}],"backdrop-brightness":[{"backdrop-brightness":[V,K,W]}],"backdrop-contrast":[{"backdrop-contrast":[V,K,W]}],"backdrop-grayscale":[{"backdrop-grayscale":[``,V,K,W]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[V,K,W]}],"backdrop-invert":[{"backdrop-invert":[``,V,K,W]}],"backdrop-opacity":[{"backdrop-opacity":[V,K,W]}],"backdrop-saturate":[{"backdrop-saturate":[V,K,W]}],"backdrop-sepia":[{"backdrop-sepia":[``,V,K,W]}],"border-collapse":[{border:[`collapse`,`separate`]}],"border-spacing":[{"border-spacing":w()}],"border-spacing-x":[{"border-spacing-x":w()}],"border-spacing-y":[{"border-spacing-y":w()}],"table-layout":[{table:[`auto`,`fixed`]}],caption:[{caption:[`top`,`bottom`]}],transition:[{transition:[``,`all`,`colors`,`opacity`,`shadow`,`transform`,`none`,K,W]}],"transition-behavior":[{transition:[`normal`,`discrete`]}],duration:[{duration:[V,`initial`,K,W]}],ease:[{ease:[`linear`,`initial`,_,K,W]}],delay:[{delay:[V,K,W]}],animate:[{animate:[`none`,v,K,W]}],backface:[{backface:[`hidden`,`visible`]}],perspective:[{perspective:[h,K,W]}],"perspective-origin":[{"perspective-origin":x()}],rotate:[{rotate:L()}],"rotate-x":[{"rotate-x":L()}],"rotate-y":[{"rotate-y":L()}],"rotate-z":[{"rotate-z":L()}],scale:[{scale:R()}],"scale-x":[{"scale-x":R()}],"scale-y":[{"scale-y":R()}],"scale-z":[{"scale-z":R()}],"scale-3d":[`scale-3d`],skew:[{skew:de()}],"skew-x":[{"skew-x":de()}],"skew-y":[{"skew-y":de()}],transform:[{transform:[K,W,``,`none`,`gpu`,`cpu`]}],"transform-origin":[{origin:x()}],"transform-style":[{transform:[`3d`,`flat`]}],translate:[{translate:z()}],"translate-x":[{"translate-x":z()}],"translate-y":[{"translate-y":z()}],"translate-z":[{"translate-z":z()}],"translate-none":[`translate-none`],zoom:[{zoom:[H,K,W]}],accent:[{accent:j()}],appearance:[{appearance:[`none`,`auto`]}],"caret-color":[{caret:j()}],"color-scheme":[{scheme:[`normal`,`dark`,`light`,`light-dark`,`only-dark`,`only-light`]}],cursor:[{cursor:[`auto`,`default`,`pointer`,`wait`,`text`,`move`,`help`,`not-allowed`,`none`,`context-menu`,`progress`,`cell`,`crosshair`,`vertical-text`,`alias`,`copy`,`no-drop`,`grab`,`grabbing`,`all-scroll`,`col-resize`,`row-resize`,`n-resize`,`e-resize`,`s-resize`,`w-resize`,`ne-resize`,`nw-resize`,`se-resize`,`sw-resize`,`ew-resize`,`ns-resize`,`nesw-resize`,`nwse-resize`,`zoom-in`,`zoom-out`,K,W]}],"field-sizing":[{"field-sizing":[`fixed`,`content`]}],"pointer-events":[{"pointer-events":[`auto`,`none`]}],resize:[{resize:[`none`,``,`y`,`x`]}],"scroll-behavior":[{scroll:[`auto`,`smooth`]}],"scrollbar-thumb-color":[{"scrollbar-thumb":j()}],"scrollbar-track-color":[{"scrollbar-track":j()}],"scrollbar-gutter":[{"scrollbar-gutter":[`auto`,`stable`,`both`]}],"scrollbar-w":[{scrollbar:[`auto`,`thin`,`none`]}],"scroll-m":[{"scroll-m":w()}],"scroll-mx":[{"scroll-mx":w()}],"scroll-my":[{"scroll-my":w()}],"scroll-ms":[{"scroll-ms":w()}],"scroll-me":[{"scroll-me":w()}],"scroll-mbs":[{"scroll-mbs":w()}],"scroll-mbe":[{"scroll-mbe":w()}],"scroll-mt":[{"scroll-mt":w()}],"scroll-mr":[{"scroll-mr":w()}],"scroll-mb":[{"scroll-mb":w()}],"scroll-ml":[{"scroll-ml":w()}],"scroll-p":[{"scroll-p":w()}],"scroll-px":[{"scroll-px":w()}],"scroll-py":[{"scroll-py":w()}],"scroll-ps":[{"scroll-ps":w()}],"scroll-pe":[{"scroll-pe":w()}],"scroll-pbs":[{"scroll-pbs":w()}],"scroll-pbe":[{"scroll-pbe":w()}],"scroll-pt":[{"scroll-pt":w()}],"scroll-pr":[{"scroll-pr":w()}],"scroll-pb":[{"scroll-pb":w()}],"scroll-pl":[{"scroll-pl":w()}],"snap-align":[{snap:[`start`,`end`,`center`,`align-none`]}],"snap-stop":[{snap:[`normal`,`always`]}],"snap-type":[{snap:[`none`,`x`,`y`,`both`]}],"snap-strictness":[{snap:[`mandatory`,`proximity`]}],touch:[{touch:[`auto`,`none`,`manipulation`]}],"touch-x":[{"touch-pan":[`x`,`left`,`right`]}],"touch-y":[{"touch-pan":[`y`,`up`,`down`]}],"touch-pz":[`touch-pinch-zoom`],select:[{select:[`none`,`text`,`all`,`auto`]}],"will-change":[{"will-change":[`auto`,`scroll`,`contents`,`transform`,K,W]}],fill:[{fill:[`none`,...j()]}],"stroke-w":[{stroke:[V,je,G,Te]}],stroke:[{stroke:[`none`,...j()]}],"forced-color-adjust":[{"forced-color-adjust":[`auto`,`none`]}]},conflictingClassGroups:{"container-named":[`container-type`],overflow:[`overflow-x`,`overflow-y`],overscroll:[`overscroll-x`,`overscroll-y`],inset:[`inset-x`,`inset-y`,`inset-bs`,`inset-be`,`start`,`end`,`top`,`right`,`bottom`,`left`],"inset-x":[`right`,`left`],"inset-y":[`top`,`bottom`],flex:[`basis`,`grow`,`shrink`],gap:[`gap-x`,`gap-y`],p:[`px`,`py`,`ps`,`pe`,`pbs`,`pbe`,`pt`,`pr`,`pb`,`pl`],px:[`pr`,`pl`],py:[`pt`,`pb`],m:[`mx`,`my`,`ms`,`me`,`mbs`,`mbe`,`mt`,`mr`,`mb`,`ml`],mx:[`mr`,`ml`],my:[`mt`,`mb`],size:[`w`,`h`],"font-size":[`leading`],"fvn-normal":[`fvn-ordinal`,`fvn-slashed-zero`,`fvn-figure`,`fvn-spacing`,`fvn-fraction`],"fvn-ordinal":[`fvn-normal`],"fvn-slashed-zero":[`fvn-normal`],"fvn-figure":[`fvn-normal`],"fvn-spacing":[`fvn-normal`],"fvn-fraction":[`fvn-normal`],"line-clamp":[`display`,`overflow`],rounded:[`rounded-s`,`rounded-e`,`rounded-t`,`rounded-r`,`rounded-b`,`rounded-l`,`rounded-ss`,`rounded-se`,`rounded-ee`,`rounded-es`,`rounded-tl`,`rounded-tr`,`rounded-br`,`rounded-bl`],"rounded-s":[`rounded-ss`,`rounded-es`],"rounded-e":[`rounded-se`,`rounded-ee`],"rounded-t":[`rounded-tl`,`rounded-tr`],"rounded-r":[`rounded-tr`,`rounded-br`],"rounded-b":[`rounded-br`,`rounded-bl`],"rounded-l":[`rounded-tl`,`rounded-bl`],"border-spacing":[`border-spacing-x`,`border-spacing-y`],"border-w":[`border-w-x`,`border-w-y`,`border-w-s`,`border-w-e`,`border-w-bs`,`border-w-be`,`border-w-t`,`border-w-r`,`border-w-b`,`border-w-l`],"border-w-x":[`border-w-r`,`border-w-l`],"border-w-y":[`border-w-t`,`border-w-b`],"border-color":[`border-color-x`,`border-color-y`,`border-color-s`,`border-color-e`,`border-color-bs`,`border-color-be`,`border-color-t`,`border-color-r`,`border-color-b`,`border-color-l`],"border-color-x":[`border-color-r`,`border-color-l`],"border-color-y":[`border-color-t`,`border-color-b`],translate:[`translate-x`,`translate-y`,`translate-none`],"translate-none":[`translate`,`translate-x`,`translate-y`,`translate-z`],"scroll-m":[`scroll-mx`,`scroll-my`,`scroll-ms`,`scroll-me`,`scroll-mbs`,`scroll-mbe`,`scroll-mt`,`scroll-mr`,`scroll-mb`,`scroll-ml`],"scroll-mx":[`scroll-mr`,`scroll-ml`],"scroll-my":[`scroll-mt`,`scroll-mb`],"scroll-p":[`scroll-px`,`scroll-py`,`scroll-ps`,`scroll-pe`,`scroll-pbs`,`scroll-pbe`,`scroll-pt`,`scroll-pr`,`scroll-pb`,`scroll-pl`],"scroll-px":[`scroll-pr`,`scroll-pl`],"scroll-py":[`scroll-pt`,`scroll-pb`],touch:[`touch-x`,`touch-y`,`touch-pz`],"touch-x":[`touch`],"touch-y":[`touch`],"touch-pz":[`touch`]},conflictingClassGroupModifiers:{"font-size":[`leading`]},postfixLookupClassGroups:[`container-type`],orderSensitiveModifiers:[`*`,`**`,`after`,`backdrop`,`before`,`details-content`,`file`,`first-letter`,`first-line`,`marker`,`placeholder`,`selection`]}});function Y(...e){return Ke(p(e))}var qe=[{id:`abyss`,label:`Abyss`},{id:`ember`,label:`Ember`},{id:`glacier`,label:`Glacier`},{id:`ink`,label:`Ink`},{id:`bloom`,label:`Bloom`},{id:`solar`,label:`Solar`},{id:`film`,label:`Film`},{id:`oil`,label:`Oil`},{id:`chrome`,label:`Chrome`},{id:`cell`,label:`Cell`},{id:`prism`,label:`Prism`},{id:`nacre`,label:`Nacre`}],Je=[{id:`pulse`,label:`Pulse`,key:`Space`},{id:`ring`,label:`Ring`,key:`R`},{id:`swirl`,label:`Swirl`,key:`V`}],Ye=[{id:`soft`,label:`Soft`,value:.28,key:`1`},{id:`wake`,label:`Wake`,value:.62,key:`2`},{id:`gale`,label:`Gale`,value:1,key:`3`}],X={viscosity:.28,strength:.62,colorMap:`abyss`,area:.42,thickness:.22,density:.24,bubbles:.12,frequency:.62,interference:.16,lightAz:.18,lightEl:.7,lightInt:.72,lightSoft:.32,waveMode:`pulse`},Xe=[{id:`water`,label:`Water`,patch:{thickness:.22,density:.22,bubbles:.16,frequency:.62,interference:.22,viscosity:.28,colorMap:`abyss`}},{id:`oil`,label:`Oil`,patch:{thickness:.82,density:.84,bubbles:.38,frequency:.42,interference:.52,viscosity:.52,colorMap:`oil`}},{id:`soap`,label:`Soap`,patch:{thickness:.92,density:.48,bubbles:.86,frequency:.58,interference:.74,viscosity:.22,colorMap:`film`}},{id:`chrome`,label:`Chrome`,patch:{thickness:.62,density:.16,bubbles:.1,frequency:.48,interference:.36,viscosity:.4,lightSoft:.08,lightInt:.86,colorMap:`chrome`}},{id:`cell`,label:`Cell`,patch:{thickness:.56,density:.9,bubbles:.28,frequency:.36,interference:.38,viscosity:.6,colorMap:`cell`}},{id:`prism`,label:`Prism`,patch:{thickness:.72,density:.4,bubbles:.24,frequency:.74,interference:.88,viscosity:.2,colorMap:`prism`}}],Ze={abyss:0,ember:1,glacier:2,ink:3,bloom:4,solar:5,film:6,oil:7,chrome:8,cell:9,prism:10,nacre:11},Qe=12,$e=6,et=4,tt=1/60,nt={low:384,mid:640,high:960},rt={low:1,mid:2,high:3},it={low:1.5,mid:2,high:2},at=`#version 300 es
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`,ot=`
#ifdef PACKED
float decode(vec4 c) { return c.r * 2.0 - 1.0; }
vec2 encodePair(float h, float p) {
  return vec2(clamp(h * 0.5 + 0.5, 0.0, 1.0), clamp(p * 0.5 + 0.5, 0.0, 1.0));
}
#else
float decode(vec4 c) { return c.r; }
vec2 encodePair(float h, float p) { return vec2(h, p); }
#endif
`,st=`
in vec2 vUv;
uniform sampler2D uState;
uniform sampler2D uFilm;
uniform vec2 uTexel;
uniform float uDamping;
uniform float uFreq;
uniform float uDensity;
out vec4 fragColor;

${ot}

vec2 mirrorUv(vec2 uv) {
  uv = abs(uv);
  uv = 1.0 - abs(uv - 1.0);
  return clamp(uv, 0.0, 1.0);
}

float sampleH(vec2 uv) {
  return decode(texture(uState, mirrorUv(uv)));
}

void main() {
  vec4 c = texture(uState, vUv);
  float h = decode(c);
#ifdef PACKED
  float p = c.g * 2.0 - 1.0;
#else
  float p = c.g;
#endif
  vec2 t = uTexel;
  float n4 =
    sampleH(vUv + vec2(t.x, 0.0)) +
    sampleH(vUv - vec2(t.x, 0.0)) +
    sampleH(vUv + vec2(0.0, t.y)) +
    sampleH(vUv - vec2(0.0, t.y));
  float n8 =
    sampleH(vUv + vec2( t.x,  t.y)) +
    sampleH(vUv + vec2(-t.x,  t.y)) +
    sampleH(vUv + vec2( t.x, -t.y)) +
    sampleH(vUv + vec2(-t.x, -t.y));
  float avg = (n4 + 0.5 * n8) / 6.0;
  vec3 film = texture(uFilm, vUv).rgb;
  float mass = film.r * 0.55 + film.g * 0.45;
  float lap = avg - h;
  float c2 = mix(0.52, 0.92, uFreq);
  float hNew = (2.0 * h - p + lap * c2) * uDamping;
  float edge = max(max(vUv.x, 1.0 - vUv.x), max(vUv.y, 1.0 - vUv.y));
  float wall = smoothstep(0.93, 1.0, edge);
  hNew *= mix(1.0, 0.9, wall);
  hNew *= mix(1.0, 0.988, mass * uDensity);
  hNew = clamp(hNew, -2.8, 2.8);
  vec2 enc = encodePair(hNew, h);
  fragColor = vec4(enc, 0.0, 1.0);
}
`,ct=`
in vec2 vUv;
uniform sampler2D uState;
uniform vec4 uDrops[12];
uniform int uCount;
uniform int uMode;
uniform float uAspect;
out vec4 fragColor;

${ot}

void main() {
  vec4 c = texture(uState, vUv);
  float h = decode(c);
#ifdef PACKED
  float p = c.g * 2.0 - 1.0;
#else
  float p = c.g;
#endif
  float add = 0.0;
  for (int i = 0; i < 12; i++) {
    if (i >= uCount) break;
    vec2 d = vUv - uDrops[i].xy;
    d.x *= uAspect;
    float sig = max(uDrops[i].w, 0.0008);
    float r = length(d);
    float r2 = (r * r) / (sig * sig);
    float amp = uDrops[i].z;
    if (uMode == 1) {
      float ring = r / sig - 1.2;
      add += amp * 1.15 * exp(-ring * ring * 7.0);
    } else if (uMode == 2) {
      add += amp * 0.72 * exp(-r2 * 0.85);
      add += amp * 0.38 * exp(-r2) * (d.x + d.y) / max(sig, 0.001);
    } else {
      add += amp * exp(-r2);
    }
  }
  h = clamp(h + add, -2.8, 2.8);
  vec2 enc = encodePair(h, p);
  fragColor = vec4(enc, 0.0, 1.0);
}
`,lt=`
in vec2 vUv;
uniform sampler2D uFilm;
uniform sampler2D uHeight;
uniform vec2 uTexel;
uniform float uAspect;
uniform float uDensity;
uniform float uVisc;
uniform float uBubble;
uniform vec4 uVortex[6];
uniform int uVortexCount;
out vec4 fragColor;

${ot}

void main() {
  float hL = decode(texture(uHeight, vUv + vec2(uTexel.x, 0.0)));
  float hR = decode(texture(uHeight, vUv - vec2(uTexel.x, 0.0)));
  float hU = decode(texture(uHeight, vUv + vec2(0.0, uTexel.y)));
  float hD = decode(texture(uHeight, vUv - vec2(0.0, uTexel.y)));
  vec2 grad = vec2(hL - hR, hD - hU);
  grad.x *= uAspect;
  vec2 curl = vec2(-grad.y, grad.x);
  vec2 flow = grad * (0.04 + uDensity * 0.22) + curl * (0.07 + uDensity * 0.18);
  for (int i = 0; i < 6; i++) {
    if (i >= uVortexCount) break;
    vec2 d = vUv - uVortex[i].xy;
    d.x *= uAspect;
    float rad = max(uVortex[i].w, 0.02);
    float env = exp(-dot(d, d) / (rad * rad));
    vec2 tang = vec2(-d.y, d.x);
    flow += tang * uVortex[i].z * env * 2.4;
  }

  vec2 srcUv = clamp(vUv - flow * 0.28, 0.001, 0.999);
  vec4 f = texture(uFilm, srcUv);
  float pigment = f.r;
  float thick = f.g;
  float foam = f.b;

  vec4 n1 = texture(uFilm, vUv + vec2(uTexel.x, 0.0));
  vec4 n2 = texture(uFilm, vUv - vec2(uTexel.x, 0.0));
  vec4 n3 = texture(uFilm, vUv + vec2(0.0, uTexel.y));
  vec4 n4 = texture(uFilm, vUv - vec2(0.0, uTexel.y));
  float pAvg = (n1.r + n2.r + n3.r + n4.r) * 0.25;
  float tAvg = (n1.g + n2.g + n3.g + n4.g) * 0.25;
  float lap = pAvg - pigment;

  float diff = mix(0.045, 0.006, uVisc);
  pigment = mix(pigment, pAvg, diff);
  thick = mix(thick, tAvg, diff * 0.7);

  float sep = uDensity * 2.2;
  pigment += clamp(lap * (pigment - 0.4) * sep, -0.14, 0.14);

  thick *= mix(0.9994, 0.9975, 1.0 - uVisc);
  thick += pigment * 0.0035 * uDensity;
  thick = clamp(thick, 0.0, 1.0);
  pigment = clamp(pigment, 0.0, 1.0);

  float hNow = decode(texture(uHeight, vUv));
  float thrash = length(grad) * 3.4 + max(-(hL + hR + hU + hD - 4.0 * hNow), 0.0) * 2.6 + max(hNow, 0.0);
  foam += thrash * uBubble * (0.22 + pigment * 0.55) * 0.055;
  foam *= mix(0.97, 0.945, uBubble);
  foam = clamp(foam, 0.0, 1.0);

  fragColor = vec4(pigment, thick, foam, 1.0);
}
`,ut=`
in vec2 vUv;
uniform sampler2D uFilm;
uniform vec4 uDrops[12];
uniform vec4 uMatter[12];
uniform int uCount;
uniform int uMode;
uniform float uAspect;
out vec4 fragColor;

void main() {
  vec4 f = texture(uFilm, vUv);
  for (int i = 0; i < 12; i++) {
    if (i >= uCount) break;
    vec2 d = vUv - uDrops[i].xy;
    d.x *= uAspect;
    float sig = max(uDrops[i].w, 0.0008);
    float r = length(d);
    float g = exp(-dot(d, d) / (sig * sig));
    if (uMode == 1) {
      float ring = r / sig - 1.15;
      g = exp(-ring * ring * 6.5);
    } else if (uMode == 2) {
      g *= 0.85;
    }
    f.r = clamp(f.r + uMatter[i].x * g, 0.0, 1.0);
    f.g = clamp(f.g + uMatter[i].y * g, 0.0, 1.0);
    f.b = clamp(f.b + uMatter[i].z * g, 0.0, 1.0);
  }
  fragColor = vec4(f.rgb, 1.0);
}
`,dt=`
in vec2 vUv;
uniform sampler2D uState;
uniform sampler2D uFilm;
uniform vec2 uTexel;
uniform int uMap;
uniform float uTime;
uniform float uAspect;
uniform float uThickness;
uniform float uDensity;
uniform float uBubbles;
uniform float uFreq;
uniform float uInterfere;
uniform float uLightAz;
uniform float uLightEl;
uniform float uLightInt;
uniform float uLightSoft;
out vec4 fragColor;

${ot}

float sampleH(vec2 uv) {
  vec2 res = vec2(1.0 / max(uTexel.x, 1e-6), 1.0 / max(uTexel.y, 1e-6));
  vec2 p = uv * res - 0.5;
  vec2 f = fract(p);
  vec2 i = floor(p);
  vec2 u0 = (i + 0.5) * uTexel;
  float a = decode(texture(uState, u0));
  float b = decode(texture(uState, u0 + vec2(uTexel.x, 0.0)));
  float c = decode(texture(uState, u0 + vec2(0.0, uTexel.y)));
  float d = decode(texture(uState, u0 + uTexel));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec3 sampleF(vec2 uv) {
  vec2 res = vec2(1.0 / max(uTexel.x, 1e-6), 1.0 / max(uTexel.y, 1e-6));
  vec2 p = uv * res - 0.5;
  vec2 f = fract(p);
  vec2 i = floor(p);
  vec2 u0 = (i + 0.5) * uTexel;
  vec3 a = texture(uFilm, u0).rgb;
  vec3 b = texture(uFilm, u0 + vec2(uTexel.x, 0.0)).rgb;
  vec3 c = texture(uFilm, u0 + vec2(0.0, uTexel.y)).rgb;
  vec3 d = texture(uFilm, u0 + uTexel).rgb;
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec3 ramp(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  t = clamp(t, 0.0, 1.0);
  float x = t * 3.0;
  if (x < 1.0) return mix(a, b, smoothstep(0.0, 1.0, x));
  if (x < 2.0) return mix(b, c, smoothstep(0.0, 1.0, x - 1.0));
  return mix(c, d, smoothstep(0.0, 1.0, x - 2.0));
}

vec3 palette(int id, float t) {
  if (id == 1) {
    return ramp(t,
      vec3(0.28, 0.08, 0.05),
      vec3(0.62, 0.16, 0.06),
      vec3(0.98, 0.42, 0.16),
      vec3(1.0, 0.88, 0.52));
  }
  if (id == 2) {
    return ramp(t,
      vec3(0.12, 0.28, 0.4),
      vec3(0.16, 0.48, 0.62),
      vec3(0.42, 0.82, 0.92),
      vec3(0.92, 0.98, 1.0));
  }
  if (id == 3) {
    return ramp(t,
      vec3(0.18, 0.2, 0.24),
      vec3(0.32, 0.36, 0.42),
      vec3(0.58, 0.62, 0.68),
      vec3(0.92, 0.94, 0.96));
  }
  if (id == 4) {
    return ramp(t,
      vec3(0.06, 0.2, 0.14),
      vec3(0.06, 0.46, 0.28),
      vec3(0.22, 0.9, 0.52),
      vec3(0.86, 1.0, 0.76));
  }
  if (id == 5) {
    return ramp(t,
      vec3(0.08, 0.16, 0.36),
      vec3(0.08, 0.38, 0.74),
      vec3(0.16, 0.82, 0.78),
      vec3(0.98, 0.88, 0.36));
  }
  if (id == 6) {
    return ramp(t,
      vec3(0.16, 0.12, 0.32),
      vec3(0.08, 0.48, 0.78),
      vec3(0.95, 0.18, 0.62),
      vec3(0.98, 0.9, 0.42));
  }
  if (id == 7) {
    return ramp(t,
      vec3(0.08, 0.2, 0.26),
      vec3(0.06, 0.4, 0.48),
      vec3(0.82, 0.14, 0.48),
      vec3(0.98, 0.76, 0.18));
  }
  if (id == 8) {
    return ramp(t,
      vec3(0.28, 0.32, 0.38),
      vec3(0.42, 0.5, 0.58),
      vec3(0.7, 0.78, 0.86),
      vec3(0.96, 0.96, 0.94));
  }
  if (id == 9) {
    return ramp(t,
      vec3(0.08, 0.24, 0.24),
      vec3(0.08, 0.52, 0.42),
      vec3(0.86, 0.16, 0.48),
      vec3(0.98, 0.84, 0.28));
  }
  if (id == 10) {
    return ramp(t,
      vec3(0.1, 0.16, 0.32),
      vec3(0.06, 0.62, 0.92),
      vec3(0.95, 0.12, 0.58),
      vec3(0.98, 0.92, 0.2));
  }
  if (id == 11) {
    return ramp(t,
      vec3(0.32, 0.3, 0.36),
      vec3(0.52, 0.62, 0.74),
      vec3(0.88, 0.52, 0.7),
      vec3(0.98, 0.92, 0.78));
  }
  return ramp(t,
    vec3(0.06, 0.22, 0.28),
    vec3(0.08, 0.42, 0.5),
    vec3(0.22, 0.78, 0.82),
    vec3(0.9, 0.97, 0.94));
}

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

vec3 airyFilm(float d, float cosI, float freq) {
  float path = d * mix(1.4, 4.4, freq);
  float delta = 12.566371 * path * max(cosI, 0.05);
  vec3 lam = vec3(0.68, 0.53, 0.42);
  vec3 R = sin(delta / lam);
  R *= R;
  float envelope = smoothstep(0.012, 0.09, d);
  vec3 wet = vec3(0.12, 0.32, 0.38);
  return mix(wet, pow(R, vec3(0.82)), envelope);
}

void main() {
  float chroma = uInterfere * 0.018;
  vec2 offR = vec2(chroma, 0.0);
  vec2 offB = vec2(-chroma, chroma * 0.4);

  float h = sampleH(vUv);
  float hR = sampleH(vUv + offR);
  float hB = sampleH(vUv + offB);
  float hl = sampleH(vUv - vec2(uTexel.x, 0.0));
  float hr = sampleH(vUv + vec2(uTexel.x, 0.0));
  float hd = sampleH(vUv - vec2(0.0, uTexel.y));
  float hu = sampleH(vUv + vec2(0.0, uTexel.y));

  vec3 film = sampleF(vUv);
  float pigment = film.r;
  float thick = film.g;
  float foam = film.b;
  vec3 fL = sampleF(vUv - vec2(uTexel.x, 0.0));
  vec3 fR = sampleF(vUv + vec2(uTexel.x, 0.0));
  vec3 fD = sampleF(vUv - vec2(0.0, uTexel.y));
  vec3 fU = sampleF(vUv + vec2(0.0, uTexel.y));
  vec2 fGrad = vec2((fR.r + fR.g) - (fL.r + fL.g), (fU.r + fU.g) - (fD.r + fD.g));
  float vein = length(fGrad);
  float marbleAng = atan(fGrad.y, fGrad.x);

  vec3 n = normalize(vec3((hl - hr) * 4.2, 2.2, (hd - hu) * 4.2));
  float az = uLightAz * 6.283185;
  float el = mix(0.12, 1.38, uLightEl);
  vec3 light = normalize(vec3(cos(az) * cos(el), sin(el), sin(az) * cos(el)));
  vec3 view = vec3(0.0, 1.0, 0.0);
  float wrap = mix(0.0, 0.42, uLightSoft);
  float ndl = clamp((dot(n, light) + wrap) / (1.0 + wrap), 0.0, 1.0);
  vec3 halfV = normalize(light + view);
  float sharpness = mix(110.0, 16.0, uLightSoft);
  float spec = pow(clamp(dot(n, halfV), 0.0, 1.0), sharpness);
  float fres = pow(clamp(1.0 - n.y, 0.0, 1.0), 1.7);
  float ndv = max(dot(n, view), 0.04);

  float t = clamp(0.54 + h * 0.18 + ndl * 0.05, 0.28, 0.86);
  float marbleT = clamp(t + pigment * 0.22 + marbleAng * 0.04 + thick * 0.12, 0.2, 0.95);
  vec3 water = palette(uMap, t);
  vec3 marble = palette(uMap, marbleT);
  vec3 albedo = mix(water, marble, clamp(pigment * (0.4 + uDensity * 0.4), 0.0, 0.82));

  float pathH = mix(h, hR, 0.5);
  float h2 = sampleH(vUv + n.xz * (0.012 + uInterfere * 0.045));
  float beat = 0.5 + 0.5 * sin(pathH * (22.0 + uFreq * 56.0) + h2 * (16.0 + uInterfere * 36.0));
  float lap = (hl + hr + hu + hd) - 4.0 * h;
  float caustic = pow(clamp(-lap * 6.2, 0.0, 1.0), 1.2);
  caustic = mix(caustic, caustic * beat, uInterfere);
  float star = pow(caustic, 2.4) * (0.45 + 0.55 * abs(sin(pathH * 48.0 + uTime * 0.4)));

  float path = mix(0.12, 1.35, uThickness) * (0.18 + thick * 1.7 + abs(h) * 0.22 + pigment * 0.2);
  float cosI = mix(ndv, ndl, 0.58);
  vec3 filmCol = airyFilm(path, cosI, uFreq);
  float filmAmt = mix(0.03, 0.62, uThickness) * (thick * 1.05 + pigment * 0.75);

  vec3 specCol = mix(vec3(0.85, 0.93, 1.0), filmCol, 0.55);
  vec3 color = albedo * (0.78 + 0.28 * ndl);
  color += spec * specCol * mix(0.55, 1.35, 1.0 - uLightSoft);
  color += caustic * mix(albedo, specCol, 0.45) * 1.15;
  color += star * specCol * 0.55;
  color = mix(color, specCol, fres * 0.18);

  vec3 soap = color * 0.62 + filmCol * 1.15;
  color = mix(color, soap, clamp(filmAmt, 0.0, 0.55));

  vec3 veinCol = mix(vec3(0.98, 0.78, 0.28), mix(filmCol, albedo, 0.25), 0.4);
  color = mix(color, veinCol * 1.15, clamp(vein * (1.2 + uDensity * 2.4), 0.0, 0.7));

  float metal = smoothstep(0.28, 0.75, uThickness * (1.0 - uDensity * 0.45));
  vec3 env = airyFilm(0.34 + n.x * 0.5 + n.z * 0.3, ndv, 0.7);
  float band = abs(dot(normalize(n.xz + 1e-4), vec2(cos(az), sin(az))));
  float cateye = pow(1.0 - clamp(band, 0.0, 1.0), mix(2.2, 7.5, 1.0 - uLightSoft));
  vec3 chrome = mix(albedo * 0.32, env, 0.55 + fres * 0.4) + spec * vec3(0.96, 0.97, 1.0) * 1.55;
  chrome += cateye * mix(vec3(0.35, 0.82, 1.0), vec3(1.0, 0.78, 0.28), pigment) * 0.9;
  color = mix(color, chrome, metal * 0.72);

  if (uInterfere > 0.02) {
    vec3 split = vec3(
      palette(uMap, clamp(hR * 1.4 + 0.4, 0.0, 1.0)).r,
      albedo.g,
      palette(uMap, clamp(hB * 1.4 + 0.4, 0.0, 1.0)).b
    );
    color = mix(color, split, uInterfere * 0.32);
  }

  vec2 buv = vec2(vUv.x * uAspect, vUv.y) * mix(10.0, 28.0, 1.0 - uBubbles);
  vec2 gid = floor(buv);
  vec2 fuv = fract(buv);
  float dmin = 8.0;
  vec2 bOff = vec2(0.0);
  float bRad = 0.22;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 cell = gid + vec2(float(i), float(j));
      vec2 o = hash2(cell);
      float rad = 0.16 + hash(cell + 1.7) * 0.18;
      vec2 r = vec2(float(i), float(j)) + o - fuv;
      float d = length(r) / max(rad, 0.08);
      if (d < dmin) {
        dmin = d;
        bOff = r;
        bRad = rad;
      }
    }
  }
  float inside = 1.0 - smoothstep(0.82, 1.02, dmin);
  float live = inside * smoothstep(0.16, 0.52, foam) * uBubbles;
  vec3 bN = vec3(bOff / max(bRad, 0.08), sqrt(max(0.0, 1.0 - dmin * dmin)));
  bN = normalize(bN + vec3(0.0, 0.0, 0.001));
  float bNdv = max(bN.z, 0.04);
  float bSpec = pow(clamp(dot(bN, light), 0.0, 1.0), 42.0);
  float bRim = pow(1.0 - bNdv, 1.6);
  vec3 bFilm = airyFilm(0.22 + (1.0 - bNdv) * 0.7, bNdv, 0.8);
  vec3 bCol = mix(albedo, bFilm * 1.45, 0.72) + vec3(0.95, 0.97, 1.0) * bSpec * 1.8;
  bCol += bRim * mix(vec3(0.75, 0.9, 1.0), filmCol, 0.5) * 0.9;
  color = mix(color, bCol, clamp(live, 0.0, 0.88));

  float foamCap = smoothstep(0.16, 0.34, h) * (0.28 + foam);
  color = mix(color, mix(vec3(0.94, 0.97, 1.0), filmCol, 0.25), foamCap * 0.32);

  float spark = pow(hash(vUv * 480.0 + n.xz * 8.0), mix(16.0, 7.0, uBubbles));
  color += spark * spec * specCol * (0.16 + uThickness * 0.4);

  float breath = 0.97 + 0.03 * sin(uTime * 0.62);
  color *= mix(0.92, 1.28, uLightInt) * breath;
  float vig = 1.0 - 0.26 * dot(vUv - 0.5, vUv - 0.5);
  color *= vig;
  color += (hash(gl_FragCoord.xy) - 0.5) * 0.025;
  color = max(color, vec3(0.0));
  color = pow(color, vec3(0.9));
  fragColor = vec4(color, 1.0);
}
`;function ft(e,t,n){let r=e.createShader(t);if(!r)throw Error(`Unable to create shader.`);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(r)||`Shader compile failed.`;throw e.deleteShader(r),Error(t)}return r}function pt(e,t,n){let r=e.createProgram();if(!r)throw Error(`Unable to create program.`);let i=ft(e,e.VERTEX_SHADER,t),a=ft(e,e.FRAGMENT_SHADER,n);if(e.attachShader(r,i),e.attachShader(r,a),e.linkProgram(r),e.deleteShader(i),e.deleteShader(a),!e.getProgramParameter(r,e.LINK_STATUS)){let t=e.getProgramInfoLog(r)||`Program link failed.`;throw e.deleteProgram(r),Error(t)}return r}function mt(e,t){return`#version 300 es
${t?`#define PACKED 1`:``}
precision highp float;
${e}`}function ht(){let e=navigator.deviceMemory??8,t=navigator.hardwareConcurrency??8,n=typeof matchMedia==`function`&&matchMedia(`(pointer: coarse)`).matches;return e<=4||n&&t<=6?`low`:!n&&e>=8&&t>=8?`high`:`mid`}function gt(e,t,n){let r=e/Math.max(t,1),i,a;return r>=1?(i=n,a=Math.max(96,Math.round(n/r))):(a=n,i=Math.max(96,Math.round(n*r))),{w:i&-2,h:a&-2}}function Z(e,t,n){return Math.max(t,Math.min(n,e))}var _t={pulse:0,ring:1,swirl:2},vt=new Set([`Space`,`KeyC`,`KeyR`,`KeyV`,`KeyB`,`KeyW`,`KeyA`,`KeyS`,`KeyD`,`Digit1`,`Digit2`,`Digit3`,`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`BracketLeft`,`BracketRight`,`KeyQ`,`KeyE`,`KeyZ`,`KeyF`]),yt=class{gl;canvas;packed=!1;simW=0;simH=0;a;b;filmA;filmB;simProg;dropProg;filmSimProg;filmDropProg;displayProg;vao;params;drops=[];vortices=[];undoH=[];undoF=[];undoCount=0;strokeSnap=!1;tier=`mid`;slowFrames=0;pointers=new Map;raf=0;acc=0;lastT=0;running=!1;destroyed=!1;reducedMotion=!1;time=0;ro=null;onLost;onRestored;onPointerDown;onPointerMove;onPointerUp;onKeyDown;onKeyUp;onBlur;keys=new Set;lastPointer={x:.5,y:.5};edgeCool=0;onParams;listeners=[];constructor(e,t,n){this.canvas=e,this.params={...X,...t},this.onParams=n?.onParams,this.tier=ht();let r={alpha:!1,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1},i=e.getContext(`webgl2`,{...r,powerPreference:`high-performance`})??e.getContext(`webgl2`,r)??e.getContext(`webgl2`);if(!i)throw Error(`Couldn't open a graphics surface. Edge includes WebGL2 — this usually means hardware acceleration is off, the GPU is blocked, or too many WebGL tabs are open. Check edge://gpu.`);this.gl=i,this.reducedMotion=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,this.onLost=e=>{e.preventDefault(),this.running=!1,cancelAnimationFrame(this.raf)},this.onRestored=()=>{this.destroyed||(this.initGpu(),this.warmStart(),this.start())},this.onPointerDown=e=>this.handleDown(e),this.onPointerMove=e=>this.handleMove(e),this.onPointerUp=e=>this.handleUp(e),this.onKeyDown=e=>this.handleKeyDown(e),this.onKeyUp=e=>this.keys.delete(e.code),this.onBlur=()=>this.keys.clear(),this.initGpu(),this.bindInput(),this.warmStart()}setParams(e){this.params={...this.params,...e}}clear(){let e=this.gl;for(let t of[this.a,this.b])e.bindFramebuffer(e.FRAMEBUFFER,t.fbo),e.viewport(0,0,this.simW,this.simH),e.clearColor(this.packed?.5:0,this.packed?.5:0,0,1),e.clear(e.COLOR_BUFFER_BIT);for(let t of[this.filmA,this.filmB])e.bindFramebuffer(e.FRAMEBUFFER,t.fbo),e.viewport(0,0,this.simW,this.simH),e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT);e.bindFramebuffer(e.FRAMEBUFFER,null),this.drops.length=0,this.vortices.length=0,this.undoCount=0}undo(){if(this.undoCount<=0)return;--this.undoCount;let e=this.undoH[this.undoCount],t=this.undoF[this.undoCount];!e||!t||(this.copyTarget(e,this.a),this.copyTarget(e,this.b),this.copyTarget(t,this.filmA),this.copyTarget(t,this.filmB))}exportPng(){return this.render(),new Promise(e=>{this.canvas.toBlob(t=>{if(!t){e();return}let n=document.createElement(`a`);n.href=URL.createObjectURL(t),n.download=`wake-${Date.now()}.png`,n.click(),URL.revokeObjectURL(n.href),e()},`image/png`)})}snapshotUndo(){if(this.undoCount>=et){let e=this.undoH.shift(),t=this.undoF.shift();e&&this.undoH.push(e),t&&this.undoF.push(t),this.undoCount=3}let e=this.undoCount;!this.undoH[e]||!this.undoF[e]||(this.copyTarget(this.a,this.undoH[e]),this.copyTarget(this.filmA,this.undoF[e]),this.undoCount+=1)}copyTarget(e,t){let n=this.gl;n.bindFramebuffer(n.FRAMEBUFFER,e.fbo),n.bindTexture(n.TEXTURE_2D,t.tex),n.copyTexSubImage2D(n.TEXTURE_2D,0,0,0,0,0,this.simW,this.simH),n.bindFramebuffer(n.FRAMEBUFFER,null)}ageVortices(e){for(let t of this.vortices)t.life-=e*.38;this.vortices=this.vortices.filter(e=>e.life>.02)}start(){if(this.running||this.destroyed)return;this.running=!0,this.lastT=performance.now(),this.acc=0;let e=t=>{if(!this.running)return;let n=(t-this.lastT)/1e3;this.lastT=t;let r=Math.min(n,.1);this.tick(r),this.raf=requestAnimationFrame(e)};this.raf=requestAnimationFrame(e)}destroy(){this.destroyed=!0,this.running=!1,cancelAnimationFrame(this.raf),this.ro?.disconnect(),this.ro=null;for(let{type:e,fn:t,target:n}of this.listeners)n.removeEventListener(e,t);this.listeners=[];let e=this.gl;e.deleteProgram(this.simProg),e.deleteProgram(this.dropProg),e.deleteProgram(this.filmSimProg),e.deleteProgram(this.filmDropProg),e.deleteProgram(this.displayProg),this.deleteTarget(this.a),this.deleteTarget(this.b),this.deleteTarget(this.filmA),this.deleteTarget(this.filmB);for(let e of this.undoH)this.deleteTarget(e);for(let e of this.undoF)this.deleteTarget(e);this.undoH=[],this.undoF=[],e.deleteVertexArray(this.vao),e.getExtension(`WEBGL_lose_context`)?.loseContext(),window.__wake&&delete window.__wake}listen(e,t,n,r){e.addEventListener(t,n,r),this.listeners.push({type:t,fn:n,target:e})}initGpu(){let e=this.gl,t=!this.tryFloat();this.packed=t,this.simProg=pt(e,at,mt(st,t)),this.dropProg=pt(e,at,mt(ct,t)),this.filmSimProg=pt(e,at,mt(lt,t)),this.filmDropProg=pt(e,at,mt(ut,t)),this.displayProg=pt(e,at,mt(dt,t));let n=e.createVertexArray(),r=e.createBuffer();if(!n||!r)throw Error(`Unable to allocate geometry.`);e.bindVertexArray(n),e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),this.vao=n,this.resize(!0)}tryFloat(){let e=this.gl;if(!e.getExtension(`EXT_color_buffer_float`))return!1;let t=e.createTexture(),n=e.createFramebuffer();if(!t||!n)return!1;e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,4,4,0,e.RGBA,e.HALF_FLOAT,null),e.bindFramebuffer(e.FRAMEBUFFER,n),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0);let r=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(n),e.deleteTexture(t),r}makeTarget(e,t,n){let r=this.gl,i=r.createTexture(),a=r.createFramebuffer();if(!i||!a)throw Error(`Unable to allocate surface.`);if(r.bindTexture(r.TEXTURE_2D,i),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),this.packed?r.texImage2D(r.TEXTURE_2D,0,r.RGBA,e,t,0,r.RGBA,r.UNSIGNED_BYTE,null):r.texImage2D(r.TEXTURE_2D,0,r.RGBA16F,e,t,0,r.RGBA,r.HALF_FLOAT,null),r.bindFramebuffer(r.FRAMEBUFFER,a),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,i,0),r.checkFramebufferStatus(r.FRAMEBUFFER)!==r.FRAMEBUFFER_COMPLETE)throw Error(`Framebuffer incomplete.`);return n?r.clearColor(0,0,0,1):r.clearColor(this.packed?.5:0,this.packed?.5:0,0,1),r.clear(r.COLOR_BUFFER_BIT),r.bindFramebuffer(r.FRAMEBUFFER,null),{tex:i,fbo:a}}deleteTarget(e){e&&(this.gl.deleteTexture(e.tex),this.gl.deleteFramebuffer(e.fbo))}resize(e=!1){let t=this.canvas,n=it[this.tier],r=Math.min(window.devicePixelRatio||1,n),i=Math.max(1,t.clientWidth),a=Math.max(1,t.clientHeight),o=Math.max(1,Math.round(i*r)),s=Math.max(1,Math.round(a*r));(t.width!==o||t.height!==s)&&(t.width=o,t.height=s);let{w:c,h:l}=gt(i,a,nt[this.tier]);if(!(!e&&c===this.simW&&l===this.simH)){this.simW=c,this.simH=l,this.deleteTarget(this.a),this.deleteTarget(this.b),this.deleteTarget(this.filmA),this.deleteTarget(this.filmB);for(let e of this.undoH)this.deleteTarget(e);for(let e of this.undoF)this.deleteTarget(e);this.a=this.makeTarget(c,l,!1),this.b=this.makeTarget(c,l,!1),this.filmA=this.makeTarget(c,l,!0),this.filmB=this.makeTarget(c,l,!0),this.undoH=[],this.undoF=[];for(let e=0;e<et;e++)this.undoH.push(this.makeTarget(c,l,!1)),this.undoF.push(this.makeTarget(c,l,!0));this.undoCount=0}}bindInput(){let e=this.canvas;e.style.touchAction=`none`,this.listen(e,`pointerdown`,this.onPointerDown),this.listen(e,`pointermove`,this.onPointerMove),this.listen(e,`pointerup`,this.onPointerUp),this.listen(e,`pointercancel`,this.onPointerUp),this.listen(window,`keydown`,this.onKeyDown),this.listen(window,`keyup`,this.onKeyUp),this.listen(window,`blur`,this.onBlur),this.listen(document,`visibilitychange`,this.onBlur),this.listen(e,`webglcontextlost`,this.onLost),this.listen(e,`webglcontextrestored`,this.onRestored),this.listen(e,`contextmenu`,e=>e.preventDefault()),this.ro=new ResizeObserver(()=>{this.destroyed||this.resize()}),this.ro.observe(e.parentElement??e),window.__wake={clear:()=>this.clear(),drop:(e,t,n=.45)=>{this.queueStroke(e,t,n,this.dropRadius(),!0,0)},setParams:e=>this.setParams(e),trigger:(e,t=.5,n=.5)=>{let r=_t[e]??0;this.emitWave(t,n,r,1)},setKeys:e=>{this.keys.clear();for(let t of e)this.keys.add(t)},getState:()=>({waveMode:this.params.waveMode,strength:this.params.strength,lightAz:this.params.lightAz,lightEl:this.params.lightEl,keys:[...this.keys],tier:this.tier,undo:this.undoCount}),undo:()=>this.undo(),exportPng:()=>void this.exportPng()}}eventUv(e){let t=this.canvas.getBoundingClientRect();return{x:Z((e.clientX-t.left)/Math.max(t.width,1),0,1),y:Z(1-(e.clientY-t.top)/Math.max(t.height,1),0,1)}}handleDown(e){if(e.button!==0&&e.pointerType===`mouse`)return;e.preventDefault();try{this.canvas.setPointerCapture(e.pointerId)}catch{}let t=this.eventUv(e);this.lastPointer=t,this.pointers.set(e.pointerId,{...t,down:!0}),this.strokeSnap||=(this.snapshotUndo(),!0),this.queueStroke(t.x,t.y,this.dropAmp(1),this.dropRadius(),!0)}handleMove(e){let t=this.eventUv(e),n=this.pointers.get(e.pointerId),r=n?.down||e.buttons>0;if(!n){this.pointers.set(e.pointerId,{...t,down:!1}),r?this.stroke(t.x,t.y,t.x,t.y,!0):this.hover(t.x,t.y,0);return}let i=Math.hypot(t.x-n.x,t.y-n.y);this.lastPointer=t,r?this.stroke(n.x,n.y,t.x,t.y,!0):this.hover(t.x,t.y,i),this.pointers.set(e.pointerId,{...t,down:r})}handleUp(e){let t=this.pointers.get(e.pointerId);if(t&&e.type===`pointerup`){let n=this.eventUv(e);this.stroke(t.x,t.y,n.x,n.y,!0)}this.pointers.delete(e.pointerId),this.pointers.size===0&&(this.strokeSnap=!1);try{this.canvas.releasePointerCapture(e.pointerId)}catch{}}hover(e,t,n){if(n<.002)return;let r=this.dropAmp(.16+Math.min(n*6,.28));this.queueStroke(e,t,r,this.dropRadius()*.7,!1,0)}stroke(e,t,n,r,i){let a=Math.hypot(n-e,r-t),o=.016+this.dropRadius()*.55,s=Math.max(1,Math.ceil(a/o)),c=i?.5+Math.min(a*5,.65):.16,l=this.dropAmp(c),u=this.dropRadius();for(let a=1;a<=s;a++){let o=a/s;this.queueStroke(e+(n-e)*o,t+(r-t)*o,l,u,i)}}dropAmp(e){return(.09+Z(this.params.strength,0,1)*.46)*e}dropRadius(){return .01+Z(this.params.area,0,1)*.055}queueDrop(e,t,n,r){this.queueStroke(e,t,n,r,!0)}currentMode(){return _t[this.params.waveMode]??0}emitWave(e,t,n,r){this.snapshotUndo();let i=this.dropRadius()*(n===1?1.35:n===2?1.6:1);this.queueStroke(e,t,this.dropAmp(r),i,!0,n)}queueStroke(e,t,n,r,i,a){let o=Z(this.params.density,0,1),s=Z(this.params.thickness,0,1),c=Z(this.params.bubbles,0,1),l=i?o*(.5+Math.abs(n)*1.15):o*.08,u=i?s*(.42+Math.abs(n)*.9):s*.06,d=i?c*(.28+Math.abs(n)*.7):c*.05,f=a??(i?this.currentMode():0);if(f===2){d*=1.35;let i=Z(e,0,1),a=Z(t,0,1),o=(n>=0?1:-1)*(.28+Math.abs(n)*1.8),s=this.vortices.find(e=>Math.hypot(e.x-i,e.y-a)<.09);s?(s.k=s.k*.65+o*.55,s.life=Math.min(1,s.life+.4),s.rad=Math.max(s.rad,r*3.4),s.x=s.x*.7+i*.3,s.y=s.y*.7+a*.3):(this.vortices.unshift({x:i,y:a,k:o,rad:Math.max(r*3.4,.06),life:1}),this.vortices.length>$e&&(this.vortices.length=$e))}this.drops.push({x:Z(e,0,1),y:Z(t,0,1),amp:n,radius:r,pigment:l,thick:u,foam:d,mode:f})}warmStart(){for(let e of[{x:.3,y:.56,amp:.52,radius:.034,mode:0},{x:.61,y:.4,amp:.4,radius:.03,mode:2},{x:.47,y:.7,amp:.32,radius:.028,mode:1},{x:.16,y:.32,amp:.24,radius:.04,mode:0},{x:.8,y:.62,amp:.3,radius:.032,mode:2},{x:.72,y:.24,amp:.22,radius:.026,mode:0}])this.queueStroke(e.x,e.y,e.amp,e.radius,!0,e.mode);this.flushDrops();for(let e=0;e<28;e++)this.simStep(),this.filmStep()}tick(e){this.time+=this.reducedMotion?0:e,this.applyHeldKeys(e),this.flushDrops(),this.ageVortices(e),this.acc+=e;let t=0,n=rt[this.tier];for(;this.acc>=tt&&t<n;)this.simStep(),this.filmStep(),this.acc-=tt,t+=1;this.watchdog(e),this.render()}watchdog(e){if(e>.033?this.slowFrames+=1:this.slowFrames=Math.max(0,this.slowFrames-1),!(this.slowFrames<45)){if(this.slowFrames=0,this.tier===`high`)this.tier=`mid`;else if(this.tier===`mid`)this.tier=`low`;else return;this.resize(!0)}}damping(){return .9982-Z(this.params.viscosity,0,1)*.012}simStep(){let e=this.gl,t=this.simProg;e.bindFramebuffer(e.FRAMEBUFFER,this.b.fbo),e.viewport(0,0,this.simW,this.simH),e.useProgram(t),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.a.tex),e.uniform1i(e.getUniformLocation(t,`uState`),0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.filmA.tex),e.uniform1i(e.getUniformLocation(t,`uFilm`),1),e.uniform2f(e.getUniformLocation(t,`uTexel`),1/this.simW,1/this.simH),e.uniform1f(e.getUniformLocation(t,`uDamping`),this.damping()),e.uniform1f(e.getUniformLocation(t,`uFreq`),Z(this.params.frequency,0,1)),e.uniform1f(e.getUniformLocation(t,`uDensity`),Z(this.params.density,0,1)),e.bindVertexArray(this.vao),e.drawArrays(e.TRIANGLES,0,3),this.swapHeight()}filmStep(){let e=this.gl,t=this.filmSimProg;e.bindFramebuffer(e.FRAMEBUFFER,this.filmB.fbo),e.viewport(0,0,this.simW,this.simH),e.useProgram(t),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.filmA.tex),e.uniform1i(e.getUniformLocation(t,`uFilm`),0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.a.tex),e.uniform1i(e.getUniformLocation(t,`uHeight`),1),e.uniform2f(e.getUniformLocation(t,`uTexel`),1/this.simW,1/this.simH),e.uniform1f(e.getUniformLocation(t,`uAspect`),this.simW/Math.max(this.simH,1)),e.uniform1f(e.getUniformLocation(t,`uDensity`),Z(this.params.density,0,1)),e.uniform1f(e.getUniformLocation(t,`uVisc`),Z(this.params.viscosity,0,1)),e.uniform1f(e.getUniformLocation(t,`uBubble`),Z(this.params.bubbles,0,1));let n=new Float32Array(24),r=Math.min(this.vortices.length,$e);for(let e=0;e<r;e++){let t=this.vortices[e];n[e*4]=t.x,n[e*4+1]=t.y,n[e*4+2]=t.k*Math.max(t.life,0),n[e*4+3]=t.rad}e.uniform1i(e.getUniformLocation(t,`uVortexCount`),r);let i=e.getUniformLocation(t,`uVortex[0]`);i&&e.uniform4fv(i,n),e.bindVertexArray(this.vao),e.drawArrays(e.TRIANGLES,0,3),this.swapFilm()}flushDrops(){if(this.drops.length===0)return;let e=this.gl,t=this.simW/Math.max(this.simH,1);for(;this.drops.length>0;){let n=this.drops[0].mode,r=[];for(;this.drops.length>0&&this.drops[0].mode===n&&r.length<Qe;)r.push(this.drops.shift());let i=new Float32Array(48),a=new Float32Array(48);for(let e=0;e<r.length;e++){let t=r[e];i[e*4]=t.x,i[e*4+1]=t.y,i[e*4+2]=t.amp,i[e*4+3]=t.radius,a[e*4]=t.pigment,a[e*4+1]=t.thick,a[e*4+2]=t.foam}e.bindFramebuffer(e.FRAMEBUFFER,this.b.fbo),e.viewport(0,0,this.simW,this.simH),e.useProgram(this.dropProg),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.a.tex),e.uniform1i(e.getUniformLocation(this.dropProg,`uState`),0),e.uniform1i(e.getUniformLocation(this.dropProg,`uCount`),r.length),e.uniform1i(e.getUniformLocation(this.dropProg,`uMode`),n),e.uniform1f(e.getUniformLocation(this.dropProg,`uAspect`),t);let o=e.getUniformLocation(this.dropProg,`uDrops[0]`);o&&e.uniform4fv(o,i),e.bindVertexArray(this.vao),e.drawArrays(e.TRIANGLES,0,3),this.swapHeight(),e.bindFramebuffer(e.FRAMEBUFFER,this.filmB.fbo),e.viewport(0,0,this.simW,this.simH),e.useProgram(this.filmDropProg),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.filmA.tex),e.uniform1i(e.getUniformLocation(this.filmDropProg,`uFilm`),0),e.uniform1i(e.getUniformLocation(this.filmDropProg,`uCount`),r.length),e.uniform1i(e.getUniformLocation(this.filmDropProg,`uMode`),n),e.uniform1f(e.getUniformLocation(this.filmDropProg,`uAspect`),t);let s=e.getUniformLocation(this.filmDropProg,`uDrops[0]`),c=e.getUniformLocation(this.filmDropProg,`uMatter[0]`);s&&e.uniform4fv(s,i),c&&e.uniform4fv(c,a),e.bindVertexArray(this.vao),e.drawArrays(e.TRIANGLES,0,3),this.swapFilm()}}render(){let e=this.gl,t=this.displayProg,n=this.params;e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,this.canvas.width,this.canvas.height),e.useProgram(t),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.a.tex),e.uniform1i(e.getUniformLocation(t,`uState`),0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.filmA.tex),e.uniform1i(e.getUniformLocation(t,`uFilm`),1),e.uniform2f(e.getUniformLocation(t,`uTexel`),1/this.simW,1/this.simH),e.uniform1i(e.getUniformLocation(t,`uMap`),Ze[n.colorMap]??0),e.uniform1f(e.getUniformLocation(t,`uTime`),this.time),e.uniform1f(e.getUniformLocation(t,`uAspect`),this.simW/Math.max(this.simH,1)),e.uniform1f(e.getUniformLocation(t,`uThickness`),Z(n.thickness,0,1)),e.uniform1f(e.getUniformLocation(t,`uDensity`),Z(n.density,0,1)),e.uniform1f(e.getUniformLocation(t,`uBubbles`),Z(n.bubbles,0,1)),e.uniform1f(e.getUniformLocation(t,`uFreq`),Z(n.frequency,0,1)),e.uniform1f(e.getUniformLocation(t,`uInterfere`),Z(n.interference,0,1)),e.uniform1f(e.getUniformLocation(t,`uLightAz`),Z(n.lightAz,0,1)),e.uniform1f(e.getUniformLocation(t,`uLightEl`),Z(n.lightEl,0,1)),e.uniform1f(e.getUniformLocation(t,`uLightInt`),Z(n.lightInt,0,1)),e.uniform1f(e.getUniformLocation(t,`uLightSoft`),Z(n.lightSoft,0,1)),e.bindVertexArray(this.vao),e.drawArrays(e.TRIANGLES,0,3)}typingTarget(e){let t=e.target;if(!t)return!1;let n=t.tagName;return n===`INPUT`||n===`TEXTAREA`||n===`SELECT`||t.isContentEditable}handleKeyDown(e){if(e.metaKey||e.ctrlKey||e.altKey||this.typingTarget(e)||e.repeat&&(e.code===`Space`||e.code===`KeyR`||e.code===`KeyV`||e.code===`KeyB`||e.code===`KeyC`))return;vt.has(e.code)&&e.preventDefault(),this.keys.add(e.code);let t=this.lastPointer;e.code===`KeyC`?this.clear():e.code===`KeyZ`?this.undo():e.code===`KeyF`?this.exportPng():e.code===`Space`?this.emitWave(t.x,t.y,this.currentMode(),1.15):e.code===`KeyR`?this.emitWave(t.x,t.y,1,1.2):e.code===`KeyV`?this.emitWave(t.x,t.y,2,1.35):e.code===`KeyB`?this.bubbleBurst(t.x,t.y):e.code===`Digit1`?this.patchParams({strength:.28}):e.code===`Digit2`?this.patchParams({strength:.62}):e.code===`Digit3`?this.patchParams({strength:1}):e.code===`KeyQ`?this.patchParams({lightInt:Z(this.params.lightInt-.08,0,1)}):e.code===`KeyE`?this.patchParams({lightInt:Z(this.params.lightInt+.08,0,1)}):e.code===`BracketLeft`?this.patchParams({frequency:Z(this.params.frequency-.08,0,1)}):e.code===`BracketRight`&&this.patchParams({frequency:Z(this.params.frequency+.08,0,1)})}patchParams(e){this.setParams(e),this.onParams?.(e)}bubbleBurst(e,t){let n=this.dropRadius()*1.4;for(let r=0;r<5;r++){let i=r/5*Math.PI*2;this.queueStroke(e+Math.cos(i)*n*.6,t+Math.sin(i)*n*.6,this.dropAmp(.35),n*.55,!0,0)}}applyHeldKeys(e){let t=0,n=0;if(this.keys.has(`ArrowLeft`)&&(t-=.2*e),this.keys.has(`ArrowRight`)&&(t+=.2*e),this.keys.has(`ArrowDown`)&&(n-=.2*e),this.keys.has(`ArrowUp`)&&(n+=.2*e),t!==0||n!==0){let e=(this.params.lightAz+t+1)%1,r=Z(this.params.lightEl+n,0,1);this.patchParams({lightAz:e,lightEl:r})}if(this.edgeCool=Math.max(0,this.edgeCool-e),this.edgeCool===0){let e=this.dropAmp(.38),t=this.dropRadius()*.85,n=!1;this.keys.has(`KeyW`)&&(this.edgeWave(.5,.97,1,0,e,t),n=!0),this.keys.has(`KeyS`)&&(this.edgeWave(.5,.03,1,0,e,t),n=!0),this.keys.has(`KeyA`)&&(this.edgeWave(.03,.5,0,1,e,t),n=!0),this.keys.has(`KeyD`)&&(this.edgeWave(.97,.5,0,1,e,t),n=!0),n&&(this.edgeCool=.2)}}edgeWave(e,t,n,r,i,a){for(let o=-2;o<=2;o++)this.queueStroke(e+n*o*.12,t+r*o*.12,i,a,!0,0)}swapHeight(){let e=this.a;this.a=this.b,this.b=e}swapFilm(){let e=this.filmA;this.filmA=this.filmB,this.filmB=e}},Q=t(),bt=`wake.v4`,xt=[`wake.v3`,`wake.v2`,`wake.v1`],St=[`viscosity`,`strength`,`area`,`thickness`,`density`,`bubbles`,`frequency`,`interference`,`lightAz`,`lightEl`,`lightInt`,`lightSoft`];function Ct(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function wt(){try{let e=localStorage.getItem(bt)??xt.map(e=>localStorage.getItem(e)).find(e=>e!=null);if(!e)return{...X};let t=JSON.parse(e),n=qe.some(e=>e.id===t.colorMap)?t.colorMap:X.colorMap,r=Je.some(e=>e.id===t.waveMode)?t.waveMode:X.waveMode,i={...X,colorMap:n,waveMode:r};for(let e of St){let n=t[e];i[e]=Ct(typeof n==`number`?n:X[e])}return i}catch{return{...X}}}function Tt(e){try{localStorage.setItem(bt,JSON.stringify(e))}catch{}}function Et(e){for(let t of Xe){let n=t.patch,r=!0;for(let[t,i]of Object.entries(n)){let n=t;if(i!==void 0){if(n===`colorMap`||n===`waveMode`){e[n]!==i&&(r=!1);continue}Math.abs(e[n]-i)>=.03&&(r=!1)}}if(r)return t.id}return null}function Dt(){let e=(0,d.useRef)(null),t=(0,d.useRef)(null),n=(0,d.useRef)(null),r=(0,d.useRef)(!1),f=(0,d.useRef)(X.area),p=(0,d.useRef)(()=>{}),[m,h]=(0,d.useState)(X),[g,_]=(0,d.useState)(!0),[v,y]=(0,d.useState)(null),[b,x]=(0,d.useState)(`matter`);(0,d.useEffect)(()=>{let i=e.current;if(!i)return;let a=wt();h(a),f.current=a.area;let o;try{o=new yt(i,a,{onParams:e=>p.current(e)}),o.start(),t.current=o}catch(e){y(e instanceof Error?e.message:`Unable to start the surface.`);return}let s=n.current,c=window.innerWidth*.5,l=window.innerHeight*.5,u=c,d=l,m=!1,g=0,v=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,b=e=>{u=e.clientX,d=e.clientY,m=e.pointerType===`mouse`},x=()=>{m=!1},S=()=>{let e=v?1:.22;if(c+=(u-c)*e,l+=(d-l)*e,s){let e=12+f.current*36;s.style.width=`${e}px`,s.style.height=`${e}px`,s.style.transform=`translate3d(${c}px, ${l}px, 0) translate(-50%, -50%)`,s.style.opacity=m&&!r.current?`1`:`0`}g=requestAnimationFrame(S)};window.addEventListener(`pointermove`,b),document.addEventListener(`mouseleave`,x),g=requestAnimationFrame(S);let C=()=>_(!1);return i.addEventListener(`pointerdown`,C,{once:!0}),()=>{cancelAnimationFrame(g),window.removeEventListener(`pointermove`,b),document.removeEventListener(`mouseleave`,x),i.removeEventListener(`pointerdown`,C),o.destroy(),t.current=null}},[]);let S=12+m.area*36,C=(0,d.useCallback)(e=>{h(n=>{let r={...n,...e};return f.current=r.area,t.current?.setParams(r),Tt(r),r})},[]);p.current=C;let w=(0,d.useCallback)(e=>{let t=Xe.find(t=>t.id===e);t&&C(t.patch)},[C]),T=(0,d.useCallback)(()=>{t.current?.clear(),_(!0)},[]),ee=(0,d.useCallback)(()=>{t.current?.undo()},[]),te=(0,d.useCallback)(()=>{t.current?.exportPng()},[]),E=Et(m);return(0,Q.jsxs)(`main`,{className:`relative h-dvh w-full select-none overflow-hidden bg-bg text-fg`,children:[(0,Q.jsx)(`canvas`,{ref:e,className:`absolute inset-0 size-full cursor-none touch-none bg-[#1a5c66]`,"aria-label":`Fluid ripple surface`}),(0,Q.jsx)(`div`,{ref:n,"aria-hidden":`true`,className:`pointer-events-none fixed top-0 left-0 z-30 rounded-full border border-accent/70 opacity-0`,style:{width:S,height:S}}),(0,Q.jsx)(`header`,{className:`pointer-events-none absolute top-0 left-0 z-10 p-4 pt-[max(1rem,env(safe-area-inset-top))] md:p-8`,children:(0,Q.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,Q.jsx)(`span`,{className:`flex size-8 items-center justify-center rounded-sm bg-surface text-accent shadow-border`,children:(0,Q.jsx)(o,{className:`size-4`,strokeWidth:1.75,"aria-hidden":`true`})}),(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)(`h1`,{className:`font-display text-2xl leading-tight tracking-tight italic md:text-3xl`,children:`Wake`}),(0,Q.jsx)(`p`,{className:`text-xs tracking-wide text-muted`,children:`Oil and water`})]})]})}),g&&!v&&(0,Q.jsx)(`p`,{className:`pointer-events-none absolute top-1/4 left-1/2 z-10 max-w-sm -translate-x-1/2 px-6 text-center font-display text-lg tracking-tight text-fg/80 italic md:text-xl`,children:`Drag to paint · Space pulse · R ring · V swirl · Z undo · F freeze`}),v&&(0,Q.jsx)(`div`,{className:`absolute inset-0 z-20 flex items-center justify-center p-6`,children:(0,Q.jsx)(`p`,{className:`max-w-sm rounded-lg bg-surface p-4 text-sm leading-normal text-muted shadow-border`,children:v})}),(0,Q.jsx)(`aside`,{className:`absolute right-4 bottom-4 left-4 z-10 mb-[env(safe-area-inset-bottom)] md:right-auto md:bottom-6 md:left-6 md:w-80`,onPointerEnter:()=>{r.current=!0},onPointerLeave:()=>{r.current=!1},children:(0,Q.jsx)(`div`,{className:`max-h-[min(46dvh,520px)] overflow-y-auto overscroll-contain rounded-lg bg-surface/95 p-4 shadow-border backdrop-blur-sm md:max-h-[min(70dvh,640px)]`,children:(0,Q.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,Q.jsxs)(`div`,{className:`grid grid-cols-3 gap-1 rounded-sm bg-surface-2 p-1`,children:[(0,Q.jsx)(Ot,{active:b===`matter`,onClick:()=>x(`matter`),children:`Matter`}),(0,Q.jsx)(Ot,{active:b===`film`,onClick:()=>x(`film`),children:`Film`}),(0,Q.jsx)(Ot,{active:b===`light`,onClick:()=>x(`light`),children:`Light`})]}),b===`matter`&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsxs)(`fieldset`,{className:`min-w-0`,children:[(0,Q.jsx)(`legend`,{className:`mb-2 text-xs font-medium tracking-wide text-muted`,children:`Wave`}),(0,Q.jsx)(`div`,{className:`grid grid-cols-3 gap-1.5`,children:Je.map(e=>{let t=m.waveMode===e.id,n=e.id===`pulse`?u:e.id===`ring`?i:c;return(0,Q.jsxs)(`button`,{type:`button`,"aria-pressed":t,onClick:()=>C({waveMode:e.id}),className:Y(`flex h-11 items-center justify-center gap-1.5 rounded-sm text-sm font-medium tracking-wide`,`transition-[background-color,color,transform] duration-150 ease-out`,`active:scale-[0.96]`,t?`bg-accent text-accent-fg`:`bg-surface-2 text-fg hover:bg-surface-2/80`),children:[(0,Q.jsx)(n,{className:`size-4`,strokeWidth:1.75,"aria-hidden":`true`}),e.label]},e.id)})}),(0,Q.jsx)(`div`,{className:`mt-1.5 grid grid-cols-3 gap-1.5`,children:Ye.map(e=>{let t=Math.abs(m.strength-e.value)<.04;return(0,Q.jsx)(`button`,{type:`button`,"aria-pressed":t,onClick:()=>C({strength:e.value}),className:Y(`h-11 rounded-sm text-sm font-medium tracking-wide`,`transition-[background-color,color,transform] duration-150 ease-out`,`active:scale-[0.96]`,t?`bg-accent text-accent-fg`:`bg-surface-2 text-fg hover:bg-surface-2/80`),children:e.label},e.id)})})]}),(0,Q.jsxs)(`fieldset`,{className:`min-w-0`,children:[(0,Q.jsx)(`legend`,{className:`mb-2 text-xs font-medium tracking-wide text-muted`,children:`Medium`}),(0,Q.jsx)(`div`,{className:`grid grid-cols-3 gap-1.5`,children:Xe.map(e=>{let t=E===e.id;return(0,Q.jsx)(`button`,{type:`button`,"aria-pressed":t,onClick:()=>w(e.id),className:Y(`h-11 rounded-sm text-sm font-medium tracking-wide`,`transition-[background-color,color,transform] duration-150 ease-out`,`active:scale-[0.96]`,t?`bg-accent text-accent-fg`:`bg-surface-2 text-fg hover:bg-surface-2/80`),children:e.label},e.id)})})]}),(0,Q.jsxs)(`fieldset`,{className:`min-w-0`,children:[(0,Q.jsx)(`legend`,{className:`mb-2 text-xs font-medium tracking-wide text-muted`,children:`Color map`}),(0,Q.jsx)(`div`,{className:`grid grid-cols-4 gap-1.5`,children:qe.map(e=>{let t=e.id===m.colorMap;return(0,Q.jsx)(`button`,{type:`button`,"aria-pressed":t,onClick:()=>C({colorMap:e.id}),className:Y(`h-11 rounded-sm text-sm font-medium tracking-wide`,`transition-[background-color,color,transform] duration-150 ease-out`,`active:scale-[0.96]`,t?`bg-accent text-accent-fg`:`bg-surface-2 text-fg hover:bg-surface-2/80`),children:e.label},e.id)})})]}),(0,Q.jsx)($,{label:`Viscosity`,value:m.viscosity,onChange:e=>C({viscosity:e})}),(0,Q.jsx)($,{label:`Wave strength`,value:m.strength,onChange:e=>C({strength:e})}),(0,Q.jsx)($,{label:`Area of effect`,value:m.area,onChange:e=>C({area:e})})]}),b===`film`&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)($,{label:`Thickness`,value:m.thickness,onChange:e=>C({thickness:e})}),(0,Q.jsx)($,{label:`Density`,value:m.density,onChange:e=>C({density:e})}),(0,Q.jsx)($,{label:`Bubbles`,value:m.bubbles,onChange:e=>C({bubbles:e})}),(0,Q.jsx)($,{label:`Frequency`,value:m.frequency,onChange:e=>C({frequency:e})}),(0,Q.jsx)($,{label:`Interference`,value:m.interference,onChange:e=>C({interference:e})})]}),b===`light`&&(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(kt,{az:m.lightAz,el:m.lightEl,onChange:(e,t)=>C({lightAz:e,lightEl:t})}),(0,Q.jsx)($,{label:`Intensity`,value:m.lightInt,onChange:e=>C({lightInt:e})}),(0,Q.jsx)($,{label:`Quality`,value:m.lightSoft,onChange:e=>C({lightSoft:e})}),(0,Q.jsx)(`p`,{className:`text-xs leading-normal text-faint`,children:`Drag the lamp. Arrows orbit · Q/E dim · WASD edge waves`})]}),(0,Q.jsxs)(`div`,{className:`grid grid-cols-3 gap-1.5`,children:[(0,Q.jsxs)(`button`,{type:`button`,onClick:ee,className:Y(`flex h-11 items-center justify-center gap-1.5 rounded-sm`,`bg-surface-2 text-sm font-medium text-fg`,`transition-[background-color,transform] duration-150 ease-out`,`hover:bg-surface-2/80 active:scale-[0.96]`),children:[(0,Q.jsx)(l,{className:`size-4`,strokeWidth:1.75,"aria-hidden":`true`}),`Undo`]}),(0,Q.jsxs)(`button`,{type:`button`,onClick:te,className:Y(`flex h-11 items-center justify-center gap-1.5 rounded-sm`,`bg-surface-2 text-sm font-medium text-fg`,`transition-[background-color,transform] duration-150 ease-out`,`hover:bg-surface-2/80 active:scale-[0.96]`),children:[(0,Q.jsx)(a,{className:`size-4`,strokeWidth:1.75,"aria-hidden":`true`}),`Freeze`]}),(0,Q.jsxs)(`button`,{type:`button`,onClick:T,className:Y(`flex h-11 items-center justify-center gap-1.5 rounded-sm`,`bg-surface-2 text-sm font-medium text-fg`,`transition-[background-color,transform] duration-150 ease-out`,`hover:bg-surface-2/80 active:scale-[0.96]`),children:[(0,Q.jsx)(s,{className:`size-4`,strokeWidth:1.75,"aria-hidden":`true`}),`Clear`]})]})]})})})]})}function Ot({active:e,onClick:t,children:n}){return(0,Q.jsx)(`button`,{type:`button`,"aria-pressed":e,onClick:t,className:Y(`h-10 rounded-sm text-sm font-medium tracking-wide`,`transition-[background-color,color,transform] duration-150 ease-out`,`active:scale-[0.96]`,e?`bg-surface text-fg shadow-border`:`text-muted hover:text-fg`),children:n})}function kt({az:e,el:t,onChange:n}){let r=(0,d.useRef)(null),i=(e,t)=>{let i=r.current;if(!i)return;let a=i.getBoundingClientRect(),o=(e-a.left)/Math.max(a.width,1)*2-1,s=(t-a.top)/Math.max(a.height,1)*2-1,c=Math.min(1,Math.hypot(o,s));n((Math.atan2(o,-s)/(Math.PI*2)+1)%1,1-c)},a=e=>{e.preventDefault();try{e.currentTarget.setPointerCapture(e.pointerId)}catch{}i(e.clientX,e.clientY)},o=1-t,s=e*Math.PI*2,c=Math.sin(s)*o,l=-Math.cos(s)*o;return(0,Q.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,Q.jsx)(`span`,{className:`text-xs font-medium tracking-wide text-muted`,children:`Lamp`}),(0,Q.jsxs)(`div`,{ref:r,role:`slider`,"aria-label":`Light direction`,"aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":Math.round(t*100),tabIndex:0,className:`relative mx-auto size-24 touch-none rounded-full bg-surface-2 shadow-border`,onPointerDown:a,onPointerMove:e=>{e.buttons&&i(e.clientX,e.clientY)},children:[(0,Q.jsx)(`span`,{className:`pointer-events-none absolute inset-[18%] rounded-full bg-surface/70`}),(0,Q.jsx)(`span`,{className:`pointer-events-none absolute size-3 rounded-full bg-accent shadow-border`,style:{left:`${50+c*42}%`,top:`${50+l*42}%`,transform:`translate(-50%, -50%)`}})]})]})}function $({label:e,value:t,onChange:n}){let r=Math.round(t*100);return(0,Q.jsxs)(`label`,{className:`flex min-w-0 flex-col`,children:[(0,Q.jsxs)(`span`,{className:`flex items-baseline justify-between gap-3`,children:[(0,Q.jsx)(`span`,{className:`text-xs font-medium tracking-wide text-muted`,children:e}),(0,Q.jsx)(`span`,{className:`text-xs tabular-nums text-faint`,children:r})]}),(0,Q.jsx)(`input`,{className:`wake-range`,type:`range`,min:0,max:100,step:1,value:r,"aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":r,"aria-label":e,style:{"--fill":`${r}%`},onChange:e=>n(Number(e.target.value)/100)})]})}function At(){return(0,Q.jsx)(Dt,{})}export{At as component};