const $=s=>document.querySelector(s);let count=0;const fmt=n=>new Intl.NumberFormat("en-IE",{style:"currency",currency:"EUR",maximumFractionDigits:4}).format(n);
function parseDecimal(value){const normalized=String(value).trim().replace(/,/g,".");return /^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(normalized)?Number(normalized):NaN;}
function add(){
 if(count>=5)return;
 count++;
 const row=document.createElement("div");row.className="product-row";row.dataset.row="";
 const makeField=(labelText,className,attrs={})=>{const field=document.createElement("div"),label=document.createElement("label"),input=document.createElement("input");field.className="field";input.className=className;const id=className+"-"+count;label.htmlFor=id;label.textContent=labelText;input.id=id;Object.entries(attrs).forEach(([key,value])=>input.setAttribute(key,String(value)));field.append(label,input);return {field,input};};
 const name=makeField("Product name","p-name",{maxlength:50,placeholder:"Product "+count});
 const price=makeField("Price (€)","p-price",{type:"text",inputmode:"decimal",min:"0.0001",step:"0.01",placeholder:"2.99"});
 const quantity=makeField("Quantity","p-qty",{type:"text",inputmode:"decimal",min:"0.0001",step:"any",placeholder:"500"});
 const unitField=document.createElement("div"),unitLabel=document.createElement("label"),unit=document.createElement("select");unitField.className="field";unit.className="p-unit";unit.id="p-unit-"+count;unitLabel.htmlFor=unit.id;unitLabel.textContent="Unit";
 [["g","g"],["kg","kg"],["ml","ml"],["l","l"],["piece","piece"]].forEach(([value,text])=>{const option=document.createElement("option");option.value=value;option.textContent=text;unit.append(option);});unitField.append(unitLabel,unit);
 const remove=document.createElement("button");remove.className="button button-ghost remove";remove.type="button";remove.setAttribute("aria-label","Remove product");remove.textContent="Remove";remove.addEventListener("click",()=>{row.remove();count--;$("#add-product").disabled=count===5;});
 row.append(name.field,price.field,quantity.field,unitField,remove);$("#products").append(row);$("#add-product").disabled=count===5;
}
function compare(){
 const basis=$("#basis").value,rows=[...document.querySelectorAll("[data-row]")];
 if(rows.length<2){show("Add at least two products.");return;}
 const values=[];
 for(const [i,row] of rows.entries()){
  const price=parseDecimal(row.querySelector(".p-price").value),qty=parseDecimal(row.querySelector(".p-qty").value),unit=row.querySelector(".p-unit").value,name=row.querySelector(".p-name").value.trim()||"Product "+(i+1);
  if(!Number.isFinite(price)||price<=0||!Number.isFinite(qty)||qty<=0){show("Enter a price and quantity greater than zero for every product.");return;}
  let dimension,base;
  if(unit==="g"||unit==="kg"){dimension="mass";base=unit==="g"?qty/1000:qty;}
  else if(unit==="ml"||unit==="l"){dimension="volume";base=unit==="ml"?qty/1000:qty;}
  else{dimension="piece";base=qty;}
  const expected=basis==="piece"?"piece":basis==="volumeL"?"volume":"mass";
  if(dimension!==expected){show("All products must use units matching the selected comparison basis.");return;}
  const divisor=basis==="mass100"?base*10:base;
  if(!Number.isFinite(base)||!Number.isFinite(divisor)||divisor<=0){show("The quantity is outside the supported numeric range.");return;}
  values.push({name,unitPrice:price/divisor,row});
 }
 if(values.some(value=>!Number.isFinite(value.unitPrice))){show("The unit price is outside the supported numeric range.");return;}
 const minimum=Math.min(...values.map(value=>value.unitPrice));values.forEach(value=>value.row.classList.toggle("winner",value.unitPrice===minimum));
 const result=$("#result");result.replaceChildren();
 const heading=document.createElement("strong");heading.textContent="Lowest unit price: "+values.filter(value=>value.unitPrice===minimum).map(value=>value.name).join(", ");
 const list=document.createElement("ol");
 values.sort((a,b)=>a.unitPrice-b.unitPrice).forEach(value=>{const item=document.createElement("li"),unitLabel=basis==="mass100"?"100 g":basis==="masskg"?"kg":basis==="volumeL"?"litre":"piece";item.textContent=value.name+": "+fmt(value.unitPrice)+" per "+unitLabel;list.append(item);});
 result.append(heading,list);result.hidden=false;
}
function show(msg){$("#result").textContent=msg;$("#result").hidden=false;document.querySelectorAll(".product-row").forEach(r=>r.classList.remove("winner"));}
$("#add-product").addEventListener("click",add);$("#compare").addEventListener("click",compare);$("#reset").addEventListener("click",()=>{count=0;$("#products").replaceChildren();$("#result").hidden=true;add();add();$("#add-product").disabled=false;});add();add();