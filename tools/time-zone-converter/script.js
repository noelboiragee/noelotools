const zones=[["Europe/London","London"],["Europe/Dublin","Dublin"],["Europe/Paris","Paris"],["Europe/Berlin","Berlin"],["Europe/Madrid","Madrid"],["Europe/Rome","Rome"],["Europe/Amsterdam","Amsterdam"],["Europe/Warsaw","Warsaw"],["Europe/Athens","Athens"],["Europe/Helsinki","Helsinki"],["UTC","UTC"],["America/New_York","New York"],["Asia/Dubai","Dubai"],["Asia/Tokyo","Tokyo"],["Australia/Sydney","Sydney"]];
const $=s=>document.querySelector(s);const source=$("#source-zone"),targets=$("#targets");
function populateZones(select){select.replaceChildren();zones.forEach(([zone,name])=>{const option=document.createElement("option");option.value=zone;option.textContent=name+" ("+zone+")";select.append(option);});}
populateZones(source);source.value="Europe/Paris";let targetCount=0,targetRowId=0;
function addTarget(value="Europe/London"){
 if(targetCount>=4)return;
 targetCount++;
 const rowId=++targetRowId;
 const row=document.createElement("div");row.className="zone-row";row.dataset.target="";
 const field=document.createElement("div");field.className="field";
 const label=document.createElement("label"),select=document.createElement("select");
 label.textContent="Target zone "+targetCount;select.className="target-zone";select.id="target-zone-"+rowId;label.htmlFor=select.id;
 populateZones(select);select.value=value;field.append(label,select);
 const remove=document.createElement("button");remove.type="button";remove.className="button button-ghost remove";remove.textContent="Remove";
 remove.addEventListener("click",()=>{row.remove();targetCount--;renumber();});
 row.append(field,remove);targets.append(row);$("#add-target").disabled=targetCount===4;
}
function renumber(){[...targets.children].forEach((r,i)=>r.querySelector("label").textContent="Target zone "+(i+1));$("#add-target").disabled=targetCount===4;}
function localInput(d,zone){const parts=new Intl.DateTimeFormat("en-CA",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(d);const v=Object.fromEntries(parts.map(p=>[p.type,p.value]));return v.year+"-"+v.month+"-"+v.day+"T"+v.hour+":"+v.minute;}
function wallParts(date,zone){const parts=new Intl.DateTimeFormat("en-GB",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(date);return Object.fromEntries(parts.map(p=>[p.type,p.value]));}
function parseLocal(value,zone){if(!value)return {error:"Choose a source date and time."};const match=value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);if(!match)return {error:"Enter a valid date and time."};const [,ys,ms,ds,hs,mins]=match;const y=+ys,m=+ms,d=+ds,h=+hs,min=+mins;const desired=Date.UTC(y,m-1,d,h,min);const checkDate=new Date(desired);if(checkDate.getUTCFullYear()!==y||checkDate.getUTCMonth()!==m-1||checkDate.getUTCDate()!==d||h>23||min>59)return {error:"Enter a valid calendar date and time."};const offsets=new Set();for(let delta=-48;delta<=48;delta+=6){const instant=new Date(desired+delta*3600000),p=wallParts(instant,zone),asUtc=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute);offsets.add(asUtc-instant.getTime());}const candidates=[];for(const offset of offsets){const instant=new Date(desired-offset),p=wallParts(instant,zone);if(+p.year===y&&+p.month===m&&+p.day===d&&+p.hour===h&&+p.minute===min)candidates.push(instant);}candidates.sort((a,b)=>a-b);if(!candidates.length)return {error:"This local time does not exist in the selected time zone because the clocks move forward for daylight saving time. Choose a later time."};return {date:candidates[0],ambiguous:candidates.length>1,alternate:candidates.length>1?candidates[candidates.length-1]:null};}
function format(date,zone){return new Intl.DateTimeFormat("en-GB",{timeZone:zone,dateStyle:"medium",timeStyle:"short",hourCycle:"h23"}).format(date);}
function convert(){
 try{
  const parsed=parseLocal($("#source-datetime").value,source.value);
  if(parsed.error){show(parsed.error);return;}
  const rows=[...targets.querySelectorAll("select")];
  if(!rows.length){show("Add at least one target time zone.");return;}
  const result=$("#result");result.replaceChildren();
  const heading=document.createElement("strong");heading.textContent="Equivalent local times";result.append(heading);
  rows.forEach(select=>{const item=document.createElement("div"),time=document.createElement("strong"),zone=document.createElement("span");item.className="zone-result";time.textContent=format(parsed.date,select.value);zone.textContent=select.value;item.append(time,zone);result.append(item);});
  const sourceNote=document.createElement("p");sourceNote.className="muted";sourceNote.textContent="Source: "+format(parsed.date,source.value)+" · "+source.value;result.append(sourceNote);
  if(parsed.ambiguous){const note=document.createElement("p");note.className="muted";note.textContent="This local time occurs twice because clocks move back for daylight saving time. The earlier occurrence is shown; the later occurrence is "+format(parsed.alternate,source.value)+".";result.append(note);}
  result.hidden=false;
 }catch(e){show("This browser could not format one of the selected time zones.");}
}
function show(s){$("#result").textContent=s;$("#result").hidden=false;}
$("#now").addEventListener("click",()=>{$("#source-datetime").value=localInput(new Date(),source.value);convert();});$("#convert").addEventListener("click",convert);$("#add-target").addEventListener("click",()=>addTarget());$("#swap").addEventListener("click",()=>{const first=targets.querySelector("select");if(!first)return;const parsed=parseLocal($("#source-datetime").value,source.value);if(parsed.error){show(parsed.error);return;}const old=source.value;source.value=first.value;first.value=old;$("#source-datetime").value=localInput(parsed.date,source.value);convert();});$("#source-datetime").value=localInput(new Date(),source.value);addTarget("Europe/London");