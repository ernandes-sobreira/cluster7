const frame=document.getElementById('clusterApp');
let c7Base=null,c7Profiles=null,c7Extra=null,c7People=[],c7Matches=[],c7Team=[];
const STOP=new Set('a o as os um uma uns umas de da do das dos em no na nos nas por para com sem e ou que se sua seu minhas meus nossa nosso isso este esta esse essa como mais muito entre sobre preciso precisa queremos quero tenho temos projeto pesquisa trabalho estudo ação acao alguém alguem professor professora docente parceria cooperação cooperacao'.split(/\s+/));
const RELATED={
 clima:['climatologia','climatico','climatica','temperatura','calor','mudancas globais','atmosferica'],
 agua:['aquatica','aquatico','hidrologia','qualidade da agua','reuso','recursos hidricos','ecossistemas aquaticos'],
 peixes:['ictio','recursos pesqueiros','ecologia de peixes','genetica de peixes'],
 biodiversidade:['ecologia','conservacao','restauracao','paisagem'],
 conservacao:['biodiversidade','ecologia','restauracao','areas protegidas'],
 poluicao:['poluentes','qualidade do ar','atmosferica','quimica ambiental','contaminantes'],
 saude:['riscos a saude','saude ambiental','epidemiologia'],
 urbano:['urbana','planejamento regional','climatologia urbana','sustentabilidade urbana'],
 estatistica:['quantitativa','modelagem','simulacoes','bioestatistica'],
 modelagem:['quantitativa','simulacoes','redes neurais','estatistica'],
 restauracao:['conservacao','ecologia da paisagem','botanica'],
 educacao:['educacao ambiental','ensino'],
 residuos:['economia circular','quimica ambiental','sustentabilidade urbana'],
 turismo:['ecoturismo','areas protegidas','turismo de base comunitaria'],
 justica:['justica climatica'],
 amazonia:['amazonia','recursos naturais'],
 pantanal:['pantanal','areas umidas','recursos hidricos']
};
function norm(s){return (s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function esc(s){return (s||'').toString().replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function initials(n){return (n||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()}
function tokens(s){return [...new Set(norm(s).replace(/[^a-z0-9\s-]/g,' ').split(/\s+/).filter(x=>x.length>2&&!STOP.has(x)))]}
function expand(ts){const out=new Set(ts);ts.forEach(t=>(RELATED[t]||[]).forEach(x=>out.add(norm(x))));return [...out]}
function pkey(nome,ppg,ies){return norm([nome,ppg,ies].join('|'))}
function legacyParts(s){
 const t=(s||'').toString(),out={bio:'',competencias:'',email:'',contato_tipo:''};
 if(!t)return out;
 if(!/Minibio:/i.test(t)){out.competencias=t;return out}
 const b=t.match(/Minibio:\s*(.*?)(?=\s*\|\s*Competências:|\s*\|\s*Contato|$)/i);
 const c=t.match(/Competências:\s*(.*?)(?=\s*\|\s*Contato|$)/i);
 const e=t.match(/Contato\s+(público|do programa):\s*([^|]+?)(?=\s*\||$)/i);
 out.bio=b?b[1].trim():'';out.competencias=c?c[1].trim():'';
 if(e){out.email=e[2].trim();out.contato_tipo=norm(e[1]).includes('programa')?'programa':'publico'}
 return out;
}
function bioAuto(p){
 if(p.bio)return p.bio;
 const a=p.area||p.linha;
 return a?'Atua em '+a.replace(/;\s*/g,', ').replace(/[.]$/,'')+'.':'Perfil científico em enriquecimento; nome e vínculo já foram validados no programa.';
}
function addStyles(d){
 if(d.getElementById('c7CoopStyles'))return;
 const st=d.createElement('style');st.id='c7CoopStyles';st.textContent=`
 .c7hero{background:linear-gradient(135deg,#0D1B2A,#17324a 68%,#0b594d);border-radius:20px;padding:25px;color:#fff;margin-bottom:17px;position:relative;overflow:hidden}.c7hero:after{content:'🤝';position:absolute;right:24px;top:0;font-size:96px;opacity:.07}.c7kick{font:700 10px 'Space Mono',monospace;letter-spacing:2px;color:#00C896}.c7hero h2{font-size:27px;margin:7px 0}.c7hero p{color:#c8d2da;font-size:12px;line-height:1.65;max-width:820px}.c7metrics{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}.c7metric{background:#ffffff12;border:1px solid #ffffff20;padding:8px 12px;border-radius:10px}.c7metric b{font:700 18px 'Space Mono',monospace;color:#00C896}.c7metric span{font-size:9px;color:#c8d2da;margin-left:5px}
 .c7builder{background:#fff;border:1px solid #e7edf1;border-radius:16px;padding:18px;box-shadow:0 5px 22px rgba(0,0,0,.05);margin-bottom:17px}.c7builder h3{font-size:16px;color:#0D1B2A;margin-bottom:4px}.c7sub{font-size:9px;color:#64748b;margin-bottom:12px;line-height:1.5}.c7modes{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}.c7mode{border:2px solid #E2E8F0;background:#fff;border-radius:11px;padding:11px;text-align:left;font:700 10px Sora,sans-serif;cursor:pointer}.c7mode span{display:block;font-size:8px;font-weight:400;color:#64748b;margin-top:4px;line-height:1.4}.c7mode.on{background:#0D1B2A;color:#fff;border-color:#0D1B2A}.c7mode.on span{color:#bdc8d0}.c7form{display:grid;grid-template-columns:1fr 1fr;gap:9px}.c7field.full{grid-column:1/-1}.c7field label{display:block;font-size:8px;text-transform:uppercase;font-weight:800;letter-spacing:.5px;color:#64748b;margin-bottom:5px}.c7field input,.c7field textarea,.c7field select{width:100%;box-sizing:border-box;padding:10px 11px;border:2px solid #E2E8F0;border-radius:10px;background:#fff;font:11px Sora,sans-serif;outline:none;color:#1E293B}.c7field textarea{min-height:76px;resize:vertical;line-height:1.5}.c7field input:focus,.c7field textarea:focus,.c7field select:focus{border-color:#00C896}.c7find{margin-top:11px;border:0;border-radius:10px;padding:11px 16px;background:linear-gradient(135deg,#00C896,#00A87A);color:#fff;font:700 12px Sora,sans-serif;cursor:pointer}
 .c7match{display:none;margin-bottom:18px}.c7match.show{display:block}.c7summary{background:linear-gradient(135deg,#eafaf5,#f3effb);border:1px solid #dbeae5;border-radius:14px;padding:14px;margin-bottom:10px}.c7summary h3{font-size:15px;color:#0D1B2A;margin-bottom:4px}.c7summary p{font-size:10px;color:#64748b;line-height:1.5}.c7matchgrid,.c7grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:11px}.c7card{background:#fff;border:1px solid #e7edf1;border-radius:15px;padding:15px;box-shadow:0 3px 16px rgba(0,0,0,.05);position:relative}.c7score{position:absolute;right:11px;top:11px;background:#0D1B2A;color:#00C896;border-radius:9px;padding:5px 7px;font:700 10px 'Space Mono',monospace}.c7top{display:flex;gap:10px;align-items:center;padding-right:55px}.c7av{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#00C896,#7B5EA7);color:#fff;display:grid;place-items:center;font-size:11px;font-weight:800;flex:0 0 44px}.c7name{font-size:12px;font-weight:800;color:#0D1B2A;line-height:1.35}.c7inst{font-size:9px;color:#7B5EA7;font-weight:700;margin-top:2px}.c7status{position:absolute;right:11px;top:11px;background:#eafaf5;color:#08765c;border-radius:99px;padding:3px 6px;font-size:7px;font-weight:800;text-transform:uppercase}.c7bio{font-size:10px;color:#475569;line-height:1.6;margin:11px 0 8px}.c7skills{font-size:9px;color:#64748b;background:#F4F6F9;border-radius:8px;padding:7px 8px;line-height:1.5;margin-top:6px}.c7contact{margin-top:10px;padding-top:9px;border-top:1px solid #edf1f3}.c7contact b{font-size:8px;text-transform:uppercase;letter-spacing:.5px;color:#94A3B8}.c7mail{font-size:10px;font-weight:700;color:#0D1B2A;margin-top:4px;word-break:break-all}.c7no{font-size:9px;color:#94A3B8;font-style:italic;margin-top:4px}.c7actions{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:10px}.c7btn{border:1px solid #d6e1e6;background:#fff;border-radius:8px;padding:6px 9px;font:700 9px Sora,sans-serif;cursor:pointer;color:#0D1B2A}.c7btn.primary{background:#0D1B2A;color:#fff;border-color:#0D1B2A}.c7btn.on{background:#eafaf5;color:#08765c;border-color:#00C896}.c7source{font-size:8px;color:#08765c;text-decoration:none;font-weight:800}.c7why{font-size:9px;color:#64748b;line-height:1.5;margin-top:8px;padding-top:8px;border-top:1px solid #edf1f3}.c7why b{color:#08765c}
 .c7tools{display:grid;grid-template-columns:1.4fr .8fr .7fr;gap:9px;margin:14px 0}.c7tools input,.c7tools select{width:100%;box-sizing:border-box;padding:10px 11px;border:2px solid #E2E8F0;background:#fff;border-radius:10px;font:11px Sora,sans-serif;outline:none}.c7chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.c7chip{border:1px solid #E2E8F0;background:#fff;border-radius:99px;padding:6px 9px;font:700 8px Sora,sans-serif;cursor:pointer;color:#475569}.c7chip b{color:#7B5EA7}.c7chip.on{background:#0D1B2A;color:#fff;border-color:#0D1B2A}.c7chip.on b{color:#00C896}.c7head{display:flex;justify-content:space-between;align-items:end;gap:10px;margin:17px 0 10px}.c7head h3{font-size:17px;color:#0D1B2A}.c7count{font-size:9px;color:#94A3B8}.c7team{display:none;background:#0D1B2A;color:#fff;border-radius:14px;padding:14px;margin-top:11px}.c7team.show{display:block}.c7team h4{font-size:13px;margin-bottom:7px}.c7teamchips{display:flex;gap:5px;flex-wrap:wrap}.c7teamchip{background:#ffffff12;border:1px solid #ffffff20;border-radius:99px;padding:5px 8px;font-size:8px}.c7teambtns{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.c7teambtns button{border:0;border-radius:8px;padding:8px 10px;font:700 9px Sora,sans-serif;cursor:pointer}.c7teambtns .go{background:#00C896;color:#063c30}
 @media(max-width:760px){.c7modes,.c7form,.c7tools{grid-template-columns:1fr}.c7field.full{grid-column:auto}.c7matchgrid,.c7grid{grid-template-columns:1fr}.c7hero h2{font-size:22px}}
 `;d.head.appendChild(st)
}
async function loadData(){
 if(c7Base&&c7Profiles&&c7Extra)return;
 const ts=Date.now();
 const [a,b,c]=await Promise.all([
  fetch('dados/docentes_base_2026.json?ts='+ts,{cache:'no-store'}),
  fetch('dados/perfis_docentes_2026.json?ts='+ts,{cache:'no-store'}),
  fetch('dados/enriquecimento_cluster7_2026.json?ts='+ts,{cache:'no-store'})
 ]);
 if(!a.ok)throw Error('banco');
 c7Base=await a.json();
 c7Profiles=b.ok?await b.json():{perfis:[]};
 c7Extra=c.ok?await c.json():{programas_replace:[],perfis:[]};
 (c7Extra.programas_replace||[]).forEach(rep=>{
  const i=(c7Base.programas||[]).findIndex(p=>p.ppg===rep.ppg&&p.ies===rep.ies);
  if(i>=0)c7Base.programas[i]={...c7Base.programas[i],...rep};else c7Base.programas.push(rep);
 });
 buildPeople();
}
function buildPeople(){
 const allProfiles=[...(c7Profiles?.perfis||[]),...(c7Extra?.perfis||[])];
 const prof=new Map(allProfiles.map(x=>[pkey(x.nome,x.ppg,x.ies),x]));
 c7People=[];
 (c7Base.programas||[]).forEach(pg=>(pg.docentes||[]).forEach(x=>{
   const p=prof.get(pkey(x[0],pg.ppg,pg.ies))||{},legacy=legacyParts(x[2]||'');
   c7People.push({name:x[0]||'',status:x[1]||'docente',area:p.competencias||legacy.competencias||'',linha:x[3]||'',ppg:pg.ppg,ies:pg.ies,fonte:p.fonte_url||pg.fonte_url||'',bio:p.bio||legacy.bio||'',contact:p.email||legacy.email||'',contactType:p.contato_tipo||legacy.contato_tipo||''});
 }));
}
