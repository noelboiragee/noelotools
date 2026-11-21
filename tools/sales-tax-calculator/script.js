const $=s=>document.querySelector(s);
let rows=0,rowId=0,euRateVersion=null;
const MAX_EU_RATE_AGE_DAYS=180;
function validIsoDate(value){if(typeof value!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const date=new Date(value+"T00:00:00Z");if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==value)return false;const age=(Date.now()-date.getTime())/86400000;return age>=0&&age<=MAX_EU_RATE_AGE_DAYS;}
const currency=()=>$("#currency").value;
const parseDecimal=v=>{const n=String(v).trim().replace(/,/g,".");return /^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(n)?Number(n):NaN;};
const countries={
DE:{name:"Germany",currency:"EUR",tax:"VAT",rate:19,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
FR:{name:"France",currency:"EUR",tax:"VAT",rate:20,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
IT:{name:"Italy",currency:"EUR",tax:"VAT",rate:22,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
ES:{name:"Spain",currency:"EUR",tax:"VAT",rate:21,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
NL:{name:"Netherlands",currency:"EUR",tax:"VAT",rate:21,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
BE:{name:"Belgium",currency:"EUR",tax:"VAT",rate:21,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
IE:{name:"Ireland",currency:"EUR",tax:"VAT",rate:23,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
PT:{name:"Portugal",currency:"EUR",tax:"VAT",rate:23,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
AT:{name:"Austria",currency:"EUR",tax:"VAT",rate:20,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
GB:{name:"United Kingdom",currency:"GBP",tax:"VAT",rate:20,source:"https://www.gov.uk/vat-rates"},
CH:{name:"Switzerland",currency:"CHF",tax:"VAT",rate:8.1,source:"https://www.estv.admin.ch/estv/en/home/value-added-tax.html"},
NO:{name:"Norway",currency:"NOK",tax:"VAT",rate:25,source:"https://www.skatteetaten.no/en/rates/value-added-tax/"},
SE:{name:"Sweden",currency:"SEK",tax:"VAT",rate:25,source:"https://www.skatteverket.se/"},
DK:{name:"Denmark",currency:"DKK",tax:"VAT",rate:25,source:"https://skat.dk/"},
BR:{name:"Brazil",currency:"BRL",tax:"ICMS / PIS / COFINS / ISS",rate:null,source:"https://www.gov.br/receitafederal/pt-br",note:"Brazil has multiple federal, state and municipal consumption taxes. There is no single nationwide rate; enter the applicable rate for the transaction."},
AR:{name:"Argentina",currency:"ARS",tax:"IVA",rate:21,source:"https://www.arca.gob.ar/iva/"},
CO:{name:"Colombia",currency:"COP",tax:"IVA",rate:19,source:"https://www.dian.gov.co/"},
CL:{name:"Chile",currency:"CLP",tax:"IVA",rate:19,source:"https://www.sii.cl/"},
PE:{name:"Peru",currency:"PEN",tax:"IGV",rate:18,source:"https://www.sunat.gob.pe/"},
EC:{name:"Ecuador",currency:"USD",tax:"IVA",rate:15,source:"https://www.sri.gob.ec/"},
UY:{name:"Uruguay",currency:"UYU",tax:"IVA",rate:22,source:"https://www.gub.uy/direccion-general-impositiva/"},
US:{name:"United States",currency:"USD",tax:"State and local sales tax",rate:null,source:"https://www.taxadmin.org/current-tax-rates",note:"The United States has no single nationwide sales-tax rate. Enter the applicable combined state and local rate."},
CA:{name:"Canada",currency:"CAD",tax:"GST / HST / PST",rate:null,source:"https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses.html",note:"The total rate depends on the province or territory and may combine federal GST with HST or provincial tax. Enter the applicable combined rate."},
MX:{name:"Mexico",currency:"MXN",tax:"IVA",rate:16,source:"https://www.sat.gob.mx/"},
JP:{name:"Japan",currency:"JPY",tax:"Consumption tax",rate:10,source:"https://www.nta.go.jp/english/taxes/consumption_tax/index.htm"},
KR:{name:"South Korea",currency:"KRW",tax:"VAT",rate:10,source:"https://www.nts.go.kr/english/main.do"},
IN:{name:"India",currency:"INR",tax:"GST",rate:18,source:"https://cbic-gst.gov.in/",note:"India has multiple GST slabs. 18% is a common rate, not universal; confirm the applicable product or service rate."},
CN:{name:"China",currency:"CNY",tax:"VAT",rate:13,source:"https://www.chinatax.gov.cn/eng/",note:"China applies different VAT rates, including 13%, 9% and 6%, depending on goods or services. Confirm the applicable category rate."},
AU:{name:"Australia",currency:"AUD",tax:"GST",rate:10,source:"https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst"},
NZ:{name:"New Zealand",currency:"NZD",tax:"GST",rate:15,source:"https://www.ird.govt.nz/gst"}
};
const locales={EUR:"en-IE",GBP:"en-GB",CHF:"de-CH",NOK:"nb-NO",SEK:"sv-SE",DKK:"da-DK",BRL:"pt-BR",ARS:"es-AR",COP:"es-CO",CLP:"es-CL",PEN:"es-PE",USD:"en-US",UYU:"es-UY",JPY:"ja-JP",KRW:"ko-KR",INR:"en-IN",CNY:"zh-CN",AUD:"en-AU",NZD:"en-NZ",CAD:"en-CA",MXN:"es-MX"};
function money(n){return new Intl.NumberFormat(locales[currency()]||"en",{style:"currency",currency:currency()}).format(n);}
function updateCurrencyLabels(){document.querySelectorAll("[data-amount-label]").forEach(x=>x.textContent="Amount ("+currency()+")");}
function updateCountry(){
 const c=countries[$("#country").value]; if(!c)return;
 $("#currency").value=c.currency;
 $("#country-tax-info").replaceChildren();
 const note=c.note||(c.rate===null?"Enter the applicable local tax rate.":(["DE","FR","IT","ES","NL","BE","IE","PT","AT"].includes($("#country").value)&&euRateVersion?"Standard "+c.tax+" rate verified against dataset dated "+euRateVersion+": "+c.rate+"%. Reduced rates or exemptions may apply.":"Built-in "+c.tax+" reference rate (not live-verified): "+c.rate+"%. Confirm the current rate with the official tax authority."));
 $("#country-tax-info").append(document.createTextNode(note+" "));
 const a=document.createElement("a");a.href=c.source;a.target="_blank";a.rel="noopener noreferrer";a.textContent="Official tax authority / rate information";$("#country-tax-info").append(a);
 document.querySelectorAll(".rate-input").forEach(i=>{i.value=c.rate===null?"":String(c.rate);i.placeholder=c.rate===null?"Enter applicable local rate":"";});
 document.querySelectorAll("[data-tax-label]").forEach(x=>x.textContent=c.tax+" rate (%)");
 updateCurrencyLabels();
}
const EU_VAT_DATA_URL="https://cdn.jsdelivr.net/gh/vatnode/eu-vat-rates-data@main/data/eu-vat-rates-data.json";
async function refreshEuRates(){
 const status=$("#rate-status"),codes=["DE","FR","IT","ES","NL","BE","IE","PT","AT"];
 try{
  const response=await fetch(EU_VAT_DATA_URL,{cache:"no-store",headers:{Accept:"application/json"}});
  if(!response.ok)throw new Error("Rate source unavailable");
  const payload=await response.json();
  if(!payload||payload.source!=="European Commission TEDB"||!validIsoDate(payload.version)||!payload.rates||typeof payload.rates!=="object"||Array.isArray(payload.rates))throw new Error("The source date is invalid, missing, or outdated.");
  const verified={};
  for(const code of codes){const entry=payload.rates[code];if(!entry||entry.eu_member!==true||entry.currency!=="EUR"||typeof entry.standard!=="number"||!Number.isFinite(entry.standard)||entry.standard<=0||entry.standard>100)throw new Error("The source returned incomplete or invalid EU VAT rates.");verified[code]=entry.standard;}
  codes.forEach(code=>{countries[code].rate=verified[code];});
  euRateVersion=payload.version;updateCountry();
  status.textContent="EU VAT rates verified from the European Commission TEDB dataset dated "+euRateVersion+".";
 }catch(error){
  euRateVersion=null;updateCountry();
  status.textContent="Live EU VAT data is unavailable, invalid, or older than "+MAX_EU_RATE_AGE_DAYS+" days. Built-in rates are shown as unverified reference values; confirm with the official tax authority.";
 }
}
function addLine(){
 if(rows>=30)return;
 rows++;
 const currentRowId=++rowId;
 const c=countries[$("#country").value],rate=c?.rate,el=document.createElement("div");
 el.className="tax-line";el.dataset.line="";
 const makeField=(className,labelText,inputClass,attrs={})=>{
  const field=document.createElement("div"),label=document.createElement("label"),input=document.createElement("input");
  field.className=className;input.className=inputClass;
  const id="tax-"+inputClass+"-"+currentRowId;label.htmlFor=id;label.textContent=labelText;input.id=id;
  Object.entries(attrs).forEach(([key,value])=>{if(key==="textContent")return;input.setAttribute(key,String(value));});
  field.append(label,input);return {field,input,label};
 };
 const description=makeField("field line-name","Description","desc",{maxlength:80,placeholder:"Item "+rows});
 const amount=makeField("field","Amount ("+currency()+")","amount",{type:"text",inputmode:"decimal",placeholder:"100.00"});
 amount.label.dataset.amountLabel="";
 const tax=makeField("field",(c?.tax||"Tax")+" rate (%)","rate-input",{type:"text",inputmode:"decimal",placeholder:rate===null||rate===undefined?"Enter applicable local rate":""});
 tax.label.dataset.taxLabel="";if(rate!==null&&rate!==undefined)tax.input.value=String(rate);
 const basisField=document.createElement("div"),basisLabel=document.createElement("label"),basis=document.createElement("select");
 basisField.className="field";basisLabel.textContent="Amount type";basis.id="tax-basis-"+currentRowId;basisLabel.htmlFor=basis.id;basis.className="basis";
 [["net","Net"],["gross","Gross"]].forEach(([value,text])=>{const option=document.createElement("option");option.value=value;option.textContent=text;basis.append(option);});
 basisField.append(basisLabel,basis);
 const remove=document.createElement("button");remove.type="button";remove.className="button button-ghost remove";remove.textContent="Remove";
 remove.addEventListener("click",()=>{el.remove();rows--;});
 el.append(description.field,amount.field,tax.field,basisField,remove);$("#items").append(el);updateCurrencyLabels();
}
function calc(){const data=[];for(const [i,r] of [...document.querySelectorAll("[data-line]")].entries()){const amount=parseDecimal(r.querySelector(".amount").value),rate=parseDecimal(r.querySelector(".rate-input").value),basis=r.querySelector(".basis").value;if(!Number.isFinite(amount)||amount<0||!Number.isFinite(rate)||rate<0||rate>100){show("Check each amount (zero or more) and tax rate (0–100%).");return;}const net=basis==="net"?amount:amount/(1+rate/100),gross=basis==="gross"?amount:amount*(1+rate/100),tax=gross-net;if(![net,tax,gross].every(Number.isFinite)){show("The calculation is outside the supported numeric range.");return;}data.push({name:r.querySelector(".desc").value.trim()||"Line "+(i+1),rate,net,tax,gross});}if(!data.length){show("Add at least one line item.");return;}const sum=k=>data.reduce((a,b)=>a+b[k],0);if(["net","tax","gross"].some(k=>!Number.isFinite(sum(k)))){show("The total is outside the supported numeric range.");return;}const result=$("#result");result.replaceChildren();const summary=document.createElement("div");summary.className="tax-summary";[["Net total","net"],["Tax total","tax"],["Gross total","gross"]].forEach(([title,key])=>{const item=document.createElement("div"),name=document.createElement("span"),value=document.createElement("strong");name.textContent=title;value.textContent=money(sum(key));item.append(name,value);summary.append(item);});const heading=document.createElement("h3");heading.textContent="Line item breakdown";const list=document.createElement("ul");data.forEach(d=>{const item=document.createElement("li");item.textContent=d.name+" · "+d.rate+"%: net "+money(d.net)+", tax "+money(d.tax)+", gross "+money(d.gross);list.append(item);});result.append(summary,heading,list);result.hidden=false;}
function show(s){$("#result").textContent=s;$("#result").hidden=false;}
$("#add-line").addEventListener("click",addLine);$("#calculate").addEventListener("click",calc);
$("#reset").addEventListener("click",()=>{rows=0;$("#items").replaceChildren();$("#result").hidden=true;$("#country").value="DE";updateCountry();addLine();});
$("#currency").addEventListener("change",updateCurrencyLabels);
$("#country").addEventListener("change",updateCountry);
addLine();updateCountry();refreshEuRates();
