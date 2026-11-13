// বাংলা: JSON Formatter টুলের সব প্রসেসিং ব্যবহারকারীর ব্রাউজারেই সম্পন্ন হয়।
const src=document.querySelector("#source"),dest=document.querySelector("#output"),out=document.querySelector("#result");
function showResult(node,message){node.textContent=message;node.dataset.kind="success";node.hidden=false;}
function showError(node,message){node.textContent=message;node.dataset.kind="error";node.hidden=false;}
function parse(){try{return {ok:true,value:JSON.parse(src.value)};}catch(err){const match=/position\s+(\d+)/i.exec(err.message);const pos=match?Number(match[1]):0;const before=src.value.slice(0,pos);const line=before.split("\n").length;const column=pos-(before.lastIndexOf("\n")+1)+1;showError(out,"Invalid JSON: "+err.message+" (line "+line+", column "+column+").");return {ok:false};}}
document.querySelector("#format").addEventListener("click",()=>{const parsed=parse();if(parsed.ok){dest.value=JSON.stringify(parsed.value,null,2);showResult(out,"Valid JSON formatted successfully.");}});
document.querySelector("#minify").addEventListener("click",()=>{const parsed=parse();if(parsed.ok){dest.value=JSON.stringify(parsed.value);showResult(out,"Valid JSON minified successfully.");}});
document.querySelector("#validate").addEventListener("click",()=>{const parsed=parse();if(parsed.ok)showResult(out,"Valid JSON. Parsed successfully.");});
document.querySelector("#copy").addEventListener("click",async()=>{if(!dest.value){showError(out,"There is no output to copy yet.");return;}try{await navigator.clipboard.writeText(dest.value);showResult(out,"Output copied.");}catch{showError(out,"Clipboard access is unavailable. Select and copy the output manually.");}});
document.querySelector("#reset").addEventListener("click",()=>{src.value="";dest.value="";out.hidden=true;});
