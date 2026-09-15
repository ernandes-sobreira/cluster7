let c7ProfileData=null;
async function c7LoadProfiles(){
  if(c7ProfileData)return c7ProfileData;
  const r=await fetch('dados/perfis_docentes_2026.json');
  c7ProfileData=r.ok?await r.json():{perfis:[]};
  return c7ProfileData;
}
function c7FindProfile(nome,ppg,ies){
  const a=(c7ProfileData&&c7ProfileData.perfis)||[];
  return a.find(p=>p.nome===nome&&p.ppg===ppg&&p.ies===ies)||null;
}
