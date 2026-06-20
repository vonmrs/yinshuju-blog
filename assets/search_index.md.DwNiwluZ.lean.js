import{af as l,_ as o,o as d,c as u,a0 as p}from"./chunks/framework.CURQ2--Y.js";(function(){if(typeof window>"u")return;let n=null;async function i(){try{n=await l(()=>import("./chunks/pagefind.BsvAa7Tt.js"),[])}catch(e){console.error("Pagefind 加载失败:",e)}}async function c(e){const t=document.getElementById("search-results");if(t){if(!e||!n){t.innerHTML='<p class="search-hint">输入关键词后自动搜索</p>';return}t.innerHTML='<p class="search-hint">搜索中...</p>';try{const a=await n.search(e);if(a.results.length===0){t.innerHTML=`<div class="search-empty">
          <p>没有找到「${e}」相关内容</p>
          <p class="search-tip">试试不同的关键词</p>
        </div>`;return}const s=await Promise.all(a.results.slice(0,20).map(r=>r.data()));t.innerHTML=`
        <div class="search-meta">找到 ${s.length} 个结果</div>
        ${s.map(r=>`
          <a href="${r.url}" class="search-result-item">
            <div class="result-title">${r.meta.title}</div>
            <div class="result-excerpt">${r.excerpt||""}</div>
          </a>
        `).join("")}
      `}catch{t.innerHTML='<p class="search-hint">搜索出错了，请重试</p>'}}}document.addEventListener("DOMContentLoaded",async()=>{await i();const e=document.getElementById("search-input");if(!e)return;const a=new URLSearchParams(window.location.search).get("q");a&&(e.value=a,await c(a));let s;e.addEventListener("input",()=>{clearTimeout(s),s=setTimeout(()=>c(e.value.trim()),300)})})})();const f=JSON.parse('{"title":"搜索","description":"","frontmatter":{"title":"搜索"},"headers":[],"relativePath":"search/index.md","filePath":"search/index.md"}'),h={name:"search/index.md"};function m(n,i,c,e,t,a){return d(),u("div",null,[...i[0]||(i[0]=[p("",3)])])}const v=o(h,[["render",m]]);export{f as __pageData,v as default};
