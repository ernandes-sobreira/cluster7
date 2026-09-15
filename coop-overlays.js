async function loadData(){
 if(c7Base&&c7Profiles&&c7Extra)return;
 const ts=Date.now();
 const urls=[
  'dados/enriquecimento_cluster7_2026.json',
  'dados/enriquecimento_ufpe_ufs_2026.json',
  'dados/enriquecimento_uff_2026.json',
  'dados/enriquecimento_ufam_2026.json',
  'dados/enriquecimento_unioeste_2026.json',
  'dados/enriquecimento_ufcg_2026.json'
 ];
 const req=[
  fetch('dados/docentes_base_2026.json?ts='+ts,{cache:'no-store'}),
  fetch('dados/perfis_docentes_2026.json?ts='+ts,{cache:'no-store'}),
  ...urls.map(u=>fetch(u+'?ts='+ts,{cache:'no-store'}))
 ];
 const res=await Promise.all(req);
 if(!res[0].ok)throw Error('banco');
 c7Base=await res[0].json();
 c7Profiles=res[1].ok?await res[1].json():{perfis:[]};
 const overlays=[];
 for(let i=2;i<res.length;i++)if(res[i].ok)overlays.push(await res[i].json());
 c7Extra={programas_replace:[],perfis:[]};
 overlays.forEach(o=>{
  c7Extra.programas_replace.push(...(o.programas_replace||[]));
  c7Extra.perfis.push(...(o.perfis||[]));
 });
 c7Extra.programas_replace.forEach(rep=>{
  const i=(c7Base.programas||[]).findIndex(p=>p.ppg===rep.ppg&&p.ies===rep.ies);
  if(i>=0)c7Base.programas[i]={...c7Base.programas[i],...rep};else c7Base.programas.push(rep);
 });
 buildPeople();
}
