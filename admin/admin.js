(() => {
  const cfg = window.NOELOTOOLS_ADMIN_CONFIG || {};
  const configured = cfg.supabaseUrl && !cfg.supabaseUrl.startsWith("YOUR_") && cfg.supabaseAnonKey && !cfg.supabaseAnonKey.startsWith("YOUR_");
  const $ = (id) => document.getElementById(id);
  let db = null, currentUser = null;
  const viewNames = {overview:"Overview",tools:"Tools",posts:"Blog posts",pages:"Pages",publishing:"Publishing",activity:"Audit log",settings:"Settings"};
  function message(text){const el=$("app-message");el.textContent=text;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2800)}
  function showLogin(text=""){ $("login-screen").hidden=false;$("admin-app").hidden=true;$("login-message").textContent=text; }
  function showApp(){ $("login-screen").hidden=true;$("admin-app").hidden=false;$("user-email").textContent=currentUser?.email||""; }
  async function isAdmin(user){
    const {data,error}=await db.from("admin_users").select("role,active").eq("user_id",user.id).maybeSingle();
    if(error) throw error;
    return !!data && data.active===true && ["owner","admin"].includes(data.role);
  }
  async function loadOverview(){
    const checks=[["Tools","tools","stat-tools"],["Blog posts","blog_posts","stat-posts"],["Pages","site_pages","stat-pages"]];
    const lines=[];
    for(const [label,table,target] of checks){
      const {count,error}=await db.from(table).select("*",{count:"exact",head:true});
      $(target).textContent=error?"—":String(count??0);
      lines.push([label,error?"Could not read":String(count??0)+" records",!error]);
    }
    $("system-status").innerHTML=lines.map(x=>'<div class="status-row"><span>'+x[0]+'</span><strong class="'+(x[2]?"good":"bad")+'">'+x[1]+'</strong></div>').join("");
  }
  async function loadTools(){
    const {data,error}=await db.from("tools").select("slug,name,category,url,status").order("name");
    if(error){$("tools-body").innerHTML='<tr><td colspan="4">Unable to load tools. Check database setup.</td></tr>';return}
    $("tools-body").innerHTML=(data||[]).map(t=>'<tr><td>'+esc(t.name)+'</td><td>'+esc(t.category||"—")+'</td><td><a href="'+esc(t.url||"#")+'" target="_blank" rel="noopener">'+esc(t.slug)+'</a></td><td><span class="pill">'+esc(t.status||"draft")+'</span></td></tr>').join("")||'<tr><td colspan="4">No tools found. Run the SQL seed script.</td></tr>';
  }
  async function loadSimple(table,target,fields){
    const {data,error}=await db.from(table).select(fields).order("updated_at",{ascending:false}).limit(30);
    $(target).textContent=error?"Unable to load records.":(data?.length?data.map(x=>x.title||x.name||x.slug||"Untitled").join(" · "):"No records yet.");
  }
  async function loadActivity(){
    const {data,error}=await db.from("audit_logs").select("action,entity_type,created_at").order("created_at",{ascending:false}).limit(30);
    $("activity-list").textContent=error?"Unable to load audit log.":(data?.length?data.map(x=>x.action+" — "+x.entity_type+" — "+new Date(x.created_at).toLocaleString()).join("\n"):"No activity recorded yet.");
    $("activity-list").style.whiteSpace="pre-line";
  }
  function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  async function activate(user){
    currentUser=user;
    try{if(!await isAdmin(user)){await db.auth.signOut();showLogin("This account is not authorised as an administrator.");return}}
    catch(e){showLogin("Admin access check failed: "+e.message);return}
    showApp();await loadOverview();
  }
  if(!configured || !window.supabase){showLogin("Setup required: add your Supabase URL and anon key in admin/config.js.");$("connection-settings").textContent="Supabase is not configured.";return}
  db=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
  $("login-form").addEventListener("submit",async e=>{e.preventDefault();$("login-message").textContent="Signing in…";const {data,error}=await db.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});if(error){$("login-message").textContent=error.message;return}await activate(data.user)});
  $("logout").addEventListener("click",async()=>{await db.auth.signOut();currentUser=null;showLogin()});
  $("main-nav").addEventListener("click",async e=>{const b=e.target.closest("[data-view]");if(!b)return;document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x===b));Object.keys(viewNames).forEach(k=>$("view-"+k).hidden=k!==b.dataset.view);$("view-title").textContent=viewNames[b.dataset.view];if(b.dataset.view==="tools")await loadTools();if(b.dataset.view==="posts")await loadSimple("blog_posts","posts-list","title,updated_at");if(b.dataset.view==="pages")await loadSimple("site_pages","pages-list","title,updated_at");if(b.dataset.view==="activity")await loadActivity();});
  $("refresh-tools").addEventListener("click",loadTools);
  $("connection-settings").innerHTML='<div class="status-row"><span>Supabase URL</span><strong class="good">Configured</strong></div><div class="status-row"><span>Browser key</span><strong class="good">Configured</strong></div><div class="status-row"><span>GitHub token</span><strong class="bad">Server-side only</strong></div>';
  db.auth.getSession().then(({data})=>{if(data.session)activate(data.session.user)}).catch(()=>showLogin("Could not restore session."));
  db.auth.onAuthStateChange((_event,session)=>{if(session&&!currentUser)activate(session.user)});
})();