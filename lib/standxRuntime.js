export function initStandXGame() {
  if (typeof window === "undefined" || window.__standxGameRuntimeStarted) {
    return () => {};
  }

  window.__standxGameRuntimeStarted = true;

  // ========== CANVAS SETUP ==========
  const C=document.getElementById("c"),X=C.getContext("2d");
  let W,H;
  function resize(){W=C.width=innerWidth;H=C.height=innerHeight;if(PL)PL.gy=H*.73;}
  window.addEventListener("resize",resize);
  
  // ========== HELPERS ==========
  function h2r(hex){const h=hex.replace("#","");return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
  
  // ========== SFX SYSTEM (Web Audio API) ==========
  const SFX={
    ctx:null,vol:.3,
    init(){try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}},
    resume(){if(this.ctx&&this.ctx.state==="suspended")this.ctx.resume();},
    play(type){
      if(!this.ctx)return;this.resume();
      const t=this.ctx.currentTime;
      if(type==="fanfare"){
        [523,659,784].forEach((f,i)=>{const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.connect(g);g.connect(this.ctx.destination);o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(this.vol*.4,t+i*.15);g.gain.linearRampToValueAtTime(0,t+i*.15+.4);o.start(t+i*.15);o.stop(t+i*.15+.4);});return;
      }
      const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.connect(g);g.connect(this.ctx.destination);
      switch(type){
        case"ep":o.type="sine";o.frequency.setValueAtTime(520,t);o.frequency.linearRampToValueAtTime(880,t+.1);o.frequency.linearRampToValueAtTime(1100,t+.18);g.gain.setValueAtTime(this.vol*.5,t);g.gain.linearRampToValueAtTime(0,t+.3);o.start(t);o.stop(t+.3);break;
        case"click":o.type="square";o.frequency.value=700;g.gain.setValueAtTime(this.vol*.2,t);g.gain.linearRampToValueAtTime(0,t+.04);o.start(t);o.stop(t+.04);break;
        case"type":o.type="sine";o.frequency.value=350+Math.random()*250;g.gain.setValueAtTime(this.vol*.06,t);g.gain.linearRampToValueAtTime(0,t+.025);o.start(t);o.stop(t+.025);break;
        case"whoosh":o.type="sawtooth";o.frequency.setValueAtTime(180,t);o.frequency.linearRampToValueAtTime(40,t+.5);g.gain.setValueAtTime(this.vol*.3,t);g.gain.linearRampToValueAtTime(0,t+.55);o.start(t);o.stop(t+.55);break;
        case"portal":o.type="sine";o.frequency.setValueAtTime(250,t);o.frequency.exponentialRampToValueAtTime(1400,t+.6);g.gain.setValueAtTime(this.vol*.35,t);g.gain.linearRampToValueAtTime(0,t+.8);o.start(t);o.stop(t+.8);break;
        case"land":o.type="triangle";o.frequency.value=75;g.gain.setValueAtTime(this.vol*.15,t);g.gain.linearRampToValueAtTime(0,t+.1);o.start(t);o.stop(t+.1);break;
        case"jump":o.type="sine";o.frequency.setValueAtTime(280,t);o.frequency.linearRampToValueAtTime(560,t+.12);g.gain.setValueAtTime(this.vol*.12,t);g.gain.linearRampToValueAtTime(0,t+.12);o.start(t);o.stop(t+.12);break;
        case"rank":o.type="sine";o.frequency.setValueAtTime(400,t);o.frequency.linearRampToValueAtTime(700,t+.15);o.frequency.linearRampToValueAtTime(900,t+.3);g.gain.setValueAtTime(this.vol*.4,t);g.gain.linearRampToValueAtTime(0,t+.45);o.start(t);o.stop(t+.45);break;
        case"fail":o.type="sawtooth";o.frequency.setValueAtTime(300,t);o.frequency.linearRampToValueAtTime(150,t+.3);g.gain.setValueAtTime(this.vol*.25,t);g.gain.linearRampToValueAtTime(0,t+.35);o.start(t);o.stop(t+.35);break;
        case"select":o.type="sine";o.frequency.setValueAtTime(600,t);o.frequency.linearRampToValueAtTime(800,t+.08);g.gain.setValueAtTime(this.vol*.2,t);g.gain.linearRampToValueAtTime(0,t+.12);o.start(t);o.stop(t+.12);break;
        case"dlgOpen":o.type="sine";o.frequency.setValueAtTime(200,t);o.frequency.linearRampToValueAtTime(400,t+.15);g.gain.setValueAtTime(this.vol*.15,t);g.gain.linearRampToValueAtTime(0,t+.2);o.start(t);o.stop(t+.2);break;
      }
    }
  };
  
  // ========== SCREEN SHAKE ==========
  function screenShake(cls,dur){
    const el=document.getElementById("c");el.classList.remove("shake-h","shake-v");
    void el.offsetWidth;el.classList.add(cls||"shake-h");
    setTimeout(()=>el.classList.remove(cls||"shake-h"),dur||350);
  }
  
  // ========== FLOATING EP TEXT ==========
  function floatEP(amount,x,y,color){
    const el=document.createElement("div");el.className="ep-float";
    el.textContent=(amount>0?"+":"")+amount+" EP";
    el.style.left=(x||W/2-40)+"px";el.style.top=(y||H*.65)+"px";
    el.style.color=color||"#00e832";
    document.body.appendChild(el);setTimeout(()=>el.remove(),1400);
  }
  
  // ========== EP PARTICLE BURST ==========
  function epBurst(cx,cy,count,color){
    for(let i=0;i<(count||12);i++){
      const p=document.createElement("div");
      const sz=3+Math.random()*5;const angle=Math.random()*Math.PI*2;
      const dist=30+Math.random()*40;
      p.style.cssText="position:fixed;border-radius:50%;pointer-events:none;z-index:94;width:"+sz+"px;height:"+sz+"px;background:"+(color||"#00e832")+";left:"+(cx-sz/2)+"px;top:"+(cy-sz/2)+"px;opacity:1;transition:all .6s cubic-bezier(.4,0,.2,1)";
      document.body.appendChild(p);
      requestAnimationFrame(()=>{p.style.transform="translate("+Math.cos(angle)*dist+"px,"+Math.sin(angle)*dist+"px) scale(0)";p.style.opacity="0";});
      setTimeout(()=>p.remove(),700);
    }
  }
  
  // ========== TRAIL SYSTEM ==========
  let trailTimer=0;
  function spawnTrail(){
    if(gs!=="playing"||Math.abs(PL.vx)<1)return;
    trailTimer++;if(trailTimer%3!==0)return;
    const z=ZONES[zi],[r,g,b]=h2r(z.accent);
    const el=document.createElement("div");el.className="trail";
    const sz=4+Math.random()*4;
    el.style.cssText+="width:"+sz+"px;height:"+sz+"px;background:rgba("+r+","+g+","+b+",.4);left:"+(PL.x-sz/2)+"px;top:"+(H*.75-14-Math.random()*8)+"px";
    document.body.appendChild(el);setTimeout(()=>el.remove(),400);
  }
  
  // ========== LANDING DUST ==========
  let wasAirborne=false;
  function checkLandingDust(){
    if(!PL.og&&PL.vy>0)wasAirborne=true;
    if(PL.og&&wasAirborne){
      wasAirborne=false;SFX.play("land");
      for(let i=0;i<8;i++){
        const el=document.createElement("div");el.className="dust";
        const sz=3+Math.random()*4;const dx=(Math.random()-.5)*40;const dy=-(Math.random()*12+4);
        el.style.cssText+="width:"+sz+"px;height:"+sz+"px;left:"+(PL.x-sz/2)+"px;top:"+(H*.75-4)+"px;--dx:"+dx+"px;--dy:"+dy+"px";
        document.body.appendChild(el);setTimeout(()=>el.remove(),600);
      }
    }
  }
  
  // ========== SMOOTH CAMERA ==========
  let camX=0;
  function smoothCam(){
    const target=PL.x-W*.32;
    if(target>camX)camX+=(target-camX)*.12;
    if(camX<0)camX=0;
    wx=camX;
  }
  
  // ========== COMBO SYSTEM ==========
  let comboCount=0,comboTimer=null;
  function triggerCombo(){
    comboCount++;
    const el=document.getElementById("comboBdg");
    if(comboCount>=2){el.textContent="COMBO x"+comboCount;el.classList.add("on");}
    clearTimeout(comboTimer);
    comboTimer=setTimeout(()=>{comboCount=0;el.classList.remove("on");},8000);
  }
  
  // ========== HAPTIC ==========
  function haptic(ms){try{navigator.vibrate&&navigator.vibrate(ms||30);}catch(e){}}
  
  // ========== PAUSE SYSTEM ==========
  let paused=false,prevGS="playing";
  function togglePause(){
    if(gs==="title"||gs==="end")return;
    paused=!paused;
    if(paused){prevGS=gs;gs="paused";document.getElementById("pauseOvl").classList.add("on");document.getElementById("pauseEP").textContent=ep;document.getElementById("pauseRank").textContent=rnk;SFX.play("click");}
    else{gs=prevGS;document.getElementById("pauseOvl").classList.remove("on");SFX.play("select");}
  }
  
  // ========== AUTO-SAVE ==========
  function autoSave(){
    try{localStorage.setItem("standx_save",JSON.stringify({ep,rnk,zi,wx:camX,trg,gs:gs==="paused"?prevGS:gs}));}catch(e){}
  }
  function autoLoad(){
    try{
      const d=JSON.parse(localStorage.getItem("standx_save"));
      if(d&&d.ep!==undefined){ep=d.ep;rnk=d.rnk||"NEW STANDER";zi=d.zi||0;camX=d.wx||0;wx=camX;trg=d.trg||{};
        document.getElementById("hep").textContent="EP: "+ep;
        document.getElementById("efl").style.width=(ep/3000*100)+"%";
        document.getElementById("hrnk").textContent=rnk;
        document.getElementById("hzone").textContent=ZONES[zi].name;
        return d.gs||"playing";
      }
    }catch(e){}return null;
  }
  function clearSave(){try{localStorage.removeItem("standx_save");}catch(e){}}
  
  // ========== SKIP DIALOG ==========
  function skipDlg(){
    if(gs!=="dialog"||!DQ.length)return;
    if(DTimer)clearInterval(DTimer);DT=false;DI=DQ.length;
    closeDL();if(DCB)DCB();SFX.play("click");
  }
  
  // ========== HUB SYSTEM ==========
  const HUB_DATA={
    seed:{
      icon:"&#127793;",rank:"SEED",color:"#00e832",level:"NIVEL 1",subtitle:"FUNDACAO",
      epRange:"0 — 3,000 EP",epPct:33,
      desc:"O primeiro passo no Growth Path. Como Seed, voce aprende os fundamentos da comunidade StandX e constroi sua presenca.",
      requirements:[
        "Acumular 3,000 Engage Points",
        "Participar ativamente no Discord por pelo menos 2 semanas",
        "Reagir em announcements regularmente",
        "Participar de pelo menos 3 Weekly Events",
        "Criar pelo menos 1 peca de conteudo original"
      ],
      activities:[
        {name:"Reagir em Announcements",ep:"+10-20 EP por reacao",freq:"Diario"},
        {name:"Participar de Weekly Events",ep:"+200-300 EP por evento",freq:"Semanal"},
        {name:"Criar Conteudo Original",ep:"+15-40 EP por peca",freq:"Livre"},
        {name:"Ajudar Newcomers",ep:"+25-50 EP por ajuda",freq:"Livre"},
        {name:"Shoutout da Semana",ep:"+100 EP bonus",freq:"Semanal"},
        {name:"Engajamento em Discussoes",ep:"+5-15 EP por interacao",freq:"Diario"}
      ],
      squads:[
        {name:"Content/Research",desc:"Analises, tutoriais, insights tecnicos",color:"#00e8c8"},
        {name:"Creative",desc:"Visuais, videos, identidade de marca",color:"#9945ff"},
        {name:"Tech Support",desc:"Tutoriais tecnicos, suporte a usuarios",color:"#00aaff"},
        {name:"Outreach",desc:"KOLs, parcerias, expansao da comunidade",color:"#ff9900"}
      ],
      npcs:["mira","arttifex","gaboo","dias"],
      benefits:["Acesso ao cargo @SEED no Discord","Escolha de Squad especializado","Visibilidade nas avaliacoes dos moderadores","Primeiros passos para Sprout"],
      milestones:[
        {ep:500,label:"ACTIVE MEMBER — Presenca notada"},
        {ep:1000,label:"CONSISTENT — Padrao de engajamento"},
        {ep:2000,label:"SEED CANDIDATE — Aplicacao habilitada"},
        {ep:3000,label:"@SEED — Cargo conquistado!"}
      ],
      tips:[
        "Consistencia supera intensidade. Presenca diaria conta mais que picos.",
        "Qualidade > Quantidade no conteudo. Uma analise profunda vale mais que 10 posts rasos.",
        "Ajude quem esta chegando. Os mods notam quem fortalece a comunidade.",
        "Nunca perca um Weekly Event. Sao a fonte mais densa de EP."
      ]
    },
    sprout:{
      icon:"&#127807;",rank:"SPROUT",color:"#00aaff",level:"NIVEL 2",subtitle:"CRESCIMENTO",
      epRange:"3,000 — 10,000 EP",epPct:66,
      desc:"Voce provou presenca. Agora e hora de especializar, liderar e criar impacto real na comunidade.",
      requirements:[
        "Ser @SEED ativo por pelo menos 4 semanas",
        "Acumular 10,000 Engage Points totais",
        "Ter destaque em pelo menos 3 Shoutouts semanais",
        "Liderar ou co-liderar 1 projeto no seu Squad",
        "Mentorar pelo menos 2 newcomers ate @SEED",
        "Aprovacao do time de moderacao"
      ],
      activities:[
        {name:"Liderar Projeto de Squad",ep:"+300-500 EP por projeto",freq:"Mensal"},
        {name:"Mentorar Newcomers",ep:"+100-200 EP por mentoria completa",freq:"Livre"},
        {name:"Conteudo de Alta Qualidade",ep:"+40-80 EP por peca",freq:"Semanal"},
        {name:"Coordenar Weekly Events",ep:"+150-250 EP por evento",freq:"Semanal"},
        {name:"Review de Conteudo de Peers",ep:"+30-50 EP por review",freq:"Livre"},
        {name:"Contribuicao Cross-Squad",ep:"+50-100 EP por collab",freq:"Livre"}
      ],
      squads:[
        {name:"Content Lead",desc:"Curadoria e estrategia de conteudo",color:"#00e8c8"},
        {name:"Creative Director",desc:"Direcao visual e branding",color:"#9945ff"},
        {name:"Tech Lead",desc:"Arquitetura tecnica e documentacao",color:"#00aaff"},
        {name:"Growth Lead",desc:"Parcerias estrategicas e expansao",color:"#ff9900"}
      ],
      npcs:["jovan","victor","aifilho","dan"],
      benefits:["Cargo @SPROUT com permissoes expandidas","Acesso a canais exclusivos de Squad Lead","Influencia nas decisoes da comunidade","Mentoria direta dos moderadores","Badge de Sprout no perfil"],
      milestones:[
        {ep:4000,label:"SQUAD MEMBER — Integrado ao time"},
        {ep:6000,label:"CONTRIBUTOR — Impacto mensuravel"},
        {ep:8000,label:"SQUAD LEAD — Lideranca reconhecida"},
        {ep:10000,label:"FLOWER CANDIDATE — Pronto para maestria"}
      ],
      tips:[
        "Lidere pelo exemplo. Sprouts sao a espinha dorsal da comunidade.",
        "Invista em cross-squad collabs. Impacto multidisciplinar acelera muito.",
        "Documente seus processos. O proximo Sprout vai agradecer.",
        "A qualidade do conteudo muda de nivel aqui. Profundidade tecnica e fundamental."
      ]
    },
    flower:{
      icon:"&#127804;",rank:"FLOWER",color:"#9945ff",level:"NIVEL 3",subtitle:"MAESTRIA",
      epRange:"10,000+ EP",epPct:100,
      desc:"O nivel maximo. Flowers sao os pilares da comunidade, definindo cultura, estrategia e futuro da StandX.",
      requirements:[
        "Ser @SPROUT ativo por pelo menos 8 semanas",
        "Acumular 15,000+ Engage Points totais",
        "Ter liderado pelo menos 3 projetos de impacto",
        "Ter mentorado pelo menos 5 membros ate @SPROUT",
        "Reconhecimento unanime do time de moderacao",
        "Contribuicao significativa para o crescimento da comunidade"
      ],
      activities:[
        {name:"Estrategia de Comunidade",ep:"+500-1000 EP por iniciativa",freq:"Mensal"},
        {name:"Governanca e Decisoes",ep:"+200-400 EP por participacao",freq:"Semanal"},
        {name:"Criar Programas de Mentoria",ep:"+300-600 EP por programa",freq:"Trimestral"},
        {name:"Representar StandX Externamente",ep:"+400-800 EP por evento",freq:"Livre"},
        {name:"Inovacao de Produto/Feature",ep:"+500-1000 EP por feature",freq:"Livre"},
        {name:"Conteudo de Referencia",ep:"+100-200 EP por peca",freq:"Semanal"}
      ],
      squads:[
        {name:"Community Architect",desc:"Design de sistemas de crescimento",color:"#00e8c8"},
        {name:"Brand Guardian",desc:"Identidade e voz da marca",color:"#9945ff"},
        {name:"Protocol Expert",desc:"Especializacao tecnica profunda",color:"#00aaff"},
        {name:"Ecosystem Builder",desc:"Parcerias e expansao do ecossistema",color:"#ff9900"}
      ],
      npcs:["mira","arttifex","gaboo","jovan","aifilho","victor","dias","dan"],
      benefits:["Cargo @FLOWER — nivel maximo de prestigio","Participacao em decisoes estrategicas","Acesso a roadmap e features futuras","Canal direto com o core team","Influencia direta na direcao da comunidade","Reconhecimento publico e permanente"],
      milestones:[
        {ep:12000,label:"SENIOR FLOWER — Influencia expandida"},
        {ep:15000,label:"COMMUNITY PILLAR — Referencia absoluta"},
        {ep:20000,label:"LEGENDARY — Status permanente"},
        {ep:25000,label:"FOUNDER TIER — Historia da comunidade"}
      ],
      tips:[
        "Flowers pensam em ecossistema, nao em tarefas individuais.",
        "Seu legado e medido pelas pessoas que voce elevou.",
        "Inovacao vem de entender profundamente o que a comunidade precisa.",
        "Seja a ponte entre o core team e a comunidade. Essa e a essencia do Flower."
      ]
    }
  };
  
  function openHub(){
    SFX.init();SFX.play("select");
    document.getElementById("titl").style.display="none";
    document.getElementById("hub").classList.add("on");
  }
  function closeHub(){
    SFX.play("click");
    document.getElementById("hub").classList.remove("on");
    document.getElementById("titl").style.display="";
  }
  function closeHubDetail(){
    SFX.play("click");
    document.getElementById("hubDetail").classList.remove("on");
    document.getElementById("hub").classList.add("on");
  }
  
  function openHubDetail(rank){
    SFX.init();SFX.play("select");haptic(30);
    const d=HUB_DATA[rank];if(!d)return;
    document.getElementById("hub").classList.remove("on");
    const el=document.getElementById("hubDetail");
    el.innerHTML="";
  
    // Build detail view
    let html=`<button class="hd-back" onclick="closeHubDetail()">&#8592; VOLTAR</button>`;
    html+=`<div class="hd-hero"><span class="hd-icon" style="color:${d.color}">${d.icon}</span>`;
    html+=`<div class="hd-rank" style="color:${d.color};text-shadow:0 0 30px ${d.color}55">${d.rank}</div>`;
    html+=`<div class="hd-role">${d.level} — ${d.subtitle}</div></div>`;
    html+=`<div class="hd-sections">`;
  
    // Description
    html+=`<div class="hd-section" style="border-color:${d.color}22"><div class="hd-stitle" style="color:${d.color}"><span class="ico">&#128196;</span> SOBRE</div>`;
    html+=`<div style="font-family:'Share Tech Mono',monospace;font-size:12px;color:var(--text);line-height:1.8">${d.desc}</div>`;
    html+=`<div style="text-align:center;margin-top:10px"><span class="hc-ep ${rank}-ep">${d.epRange}</span></div>`;
    html+=`<div class="hd-meter"><div class="hd-meter-fill" style="width:0%;background:${d.color}" id="hdMeter"></div></div></div>`;
  
    // Milestones
    html+=`<div class="hd-section"><div class="hd-stitle" style="color:${d.color}"><span class="ico">&#127942;</span> MILESTONES</div><ul class="hd-list">`;
    d.milestones.forEach(m=>{html+=`<li><span style="color:${d.color}">${m.ep.toLocaleString()} EP</span> — ${m.label}</li>`;});
    html+=`</ul></div>`;
  
    // Requirements
    html+=`<div class="hd-section"><div class="hd-stitle" style="color:${d.color}"><span class="ico">&#128221;</span> REQUISITOS</div><ul class="hd-list">`;
    d.requirements.forEach(r=>{html+=`<li>${r}</li>`;});
    html+=`</ul></div>`;
  
    // Activities
    html+=`<div class="hd-section"><div class="hd-stitle" style="color:${d.color}"><span class="ico">&#9889;</span> ATIVIDADES & EP</div>`;
    html+=`<div style="display:flex;flex-direction:column;gap:6px">`;
    d.activities.forEach(a=>{
      html+=`<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:rgba(255,255,255,.02);border-radius:4px;border:1px solid rgba(255,255,255,.04)">`;
      html+=`<div><div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--text)">${a.name}</div>`;
      html+=`<div style="font-family:'Share Tech Mono',monospace;font-size:9px;color:${d.color}">${a.ep}</div></div>`;
      html+=`<div style="font-family:'Share Tech Mono',monospace;font-size:8px;color:var(--dim2);letter-spacing:1px;padding:3px 8px;border:1px solid rgba(255,255,255,.06);border-radius:3px">${a.freq}</div></div>`;
    });
    html+=`</div></div>`;
  
    // Squads
    html+=`<div class="hd-section"><div class="hd-stitle" style="color:${d.color}"><span class="ico">&#128101;</span> SQUADS DISPONIVEIS</div><div class="hd-squads">`;
    d.squads.forEach(s=>{
      html+=`<div class="hd-squad" style="border-color:${s.color}33"><span style="color:${s.color};font-weight:700">${s.name}</span><br><span style="font-size:8px;opacity:.6">${s.desc}</span></div>`;
    });
    html+=`</div></div>`;
  
    // NPCs
    html+=`<div class="hd-section"><div class="hd-stitle" style="color:${d.color}"><span class="ico">&#128100;</span> PERSONAGENS CHAVE</div><div class="hd-npc-row" id="hdNpcs">`;
    d.npcs.forEach(id=>{
      const n=NPCS[id];
      html+=`<div class="hd-npc"><div class="hd-npc-port" style="border-color:${n.color}" id="hdnpc_${id}"></div><div class="hd-npc-name" style="color:${n.color}">${n.name}</div></div>`;
    });
    html+=`</div></div>`;
  
    // Benefits
    html+=`<div class="hd-section"><div class="hd-stitle" style="color:${d.color}"><span class="ico">&#11088;</span> BENEFICIOS</div><ul class="hd-list">`;
    d.benefits.forEach(b=>{html+=`<li style="color:${d.color}">${b}</li>`;});
    html+=`</ul></div>`;
  
    // Tips
    html+=`<div class="hd-section" style="background:rgba(${d.color==='#00e832'?'0,232,50':d.color==='#00aaff'?'0,170,255':'153,69,255'},.03)">`;
    html+=`<div class="hd-stitle" style="color:${d.color}"><span class="ico">&#128161;</span> DICAS</div><ul class="hd-list">`;
    d.tips.forEach(t=>{html+=`<li>${t}</li>`;});
    html+=`</ul></div>`;
  
    // Play Flow Button
    html+=`<button class="hub-tbtn" style="margin-top:10px;width:100%;font-size:14px;padding:16px;background:rgba(${d.color==='#00e832'?'0,232,50':d.color==='#00aaff'?'0,170,255':'153,69,255'},.15);border-color:${d.color};color:${d.color}" onclick="selectFlow('${rank}');document.getElementById('tbtn').click()">JOGAR FLUXO ${d.rank} &#9654;</button>`;
  
    html+=`</div>`;// close hd-sections
    el.innerHTML=html;
    el.classList.add("on");
  
    // Animate EP meter
    setTimeout(()=>{const m=document.getElementById("hdMeter");if(m)m.style.width=d.epPct+"%";},100);
  
    // Render NPC portraits
    d.npcs.forEach(id=>{
      const w=document.getElementById("hdnpc_"+id);
      if(w)w.appendChild(mkPortrait(id,44));
    });
  }
  
  // ========== CHARACTER DRAWING ==========
  function drawChar(ctx,type,sz,t){
    const s=sz/60;
    ctx.save();ctx.scale(s,s);
    switch(type){
      case"mira":dMira(ctx,t);break;
      case"arttifex":dArttifex(ctx,t);break;
      case"gaboo":dGaboo(ctx,t);break;
      case"jovan":dJovan(ctx,t);break;
      case"aifilho":dAifilho(ctx,t);break;
      case"dias":dDias(ctx,t);break;
      case"dan":dDan(ctx,t);break;
      case"victor":dVictor(ctx,t);break;
      case"sistema":dSistema(ctx,t);break;
      default:dBase(ctx,t,{});break;
    }
    ctx.restore();
  }
  
  function dBase(ctx,t,o){
    const ac=o.ac||"#00e832",lc=o.lc||"#2d8a30",ec=o.ec||"#1a7a20",bc=o.bc||"#1c1c1c",sc=o.sc||"#ffffff";
    const bob=Math.sin(t*.05)*1.5;
    ctx.save();ctx.translate(30,32+bob);
    const [r,g,b]=h2r(ac);
    const ag=ctx.createRadialGradient(0,0,0,0,0,22);
    ag.addColorStop(0,"rgba("+r+","+g+","+b+",.15)");ag.addColorStop(1,"transparent");
    ctx.fillStyle=ag;ctx.beginPath();ctx.arc(0,0,22,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=bc;ctx.strokeStyle=sc;ctx.lineWidth=1.8;
    ctx.beginPath();ctx.ellipse(0,0,13,12,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle="#eee";ctx.beginPath();ctx.ellipse(0,-1,8,7,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=ec;ctx.beginPath();ctx.ellipse(1,-1,5.5,5.5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#0a3010";ctx.beginPath();ctx.ellipse(1,-1,3.5,3.5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#fff";ctx.beginPath();ctx.ellipse(-1,-3,2,1.5,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#333";ctx.lineWidth=1.4;ctx.lineCap="round";
    ctx.beginPath();ctx.arc(0,6,4.5,.1,Math.PI-.1);ctx.stroke();
    ctx.strokeStyle="#1a1a1a";ctx.lineWidth=2.2;
    ctx.beginPath();ctx.moveTo(-.5,-12);ctx.quadraticCurveTo(1.5,-18,3,-22);ctx.stroke();
    ctx.save();ctx.translate(3,-22);ctx.rotate(-.44+Math.sin(t*.04)*.05);
    const lg=ctx.createLinearGradient(-8,0,10,0);
    lg.addColorStop(0,"#1a5a1a");lg.addColorStop(.5,lc);lg.addColorStop(1,"#1a5a1a");
    ctx.fillStyle=lg;ctx.beginPath();ctx.ellipse(5,0,11,5,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="rgba(0,0,0,.2)";ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(-4,0);ctx.lineTo(13,0);ctx.stroke();
    ctx.restore();
    ctx.fillStyle=bc;ctx.strokeStyle=sc;ctx.lineWidth=1.4;
    ctx.save();ctx.translate(-13,1);ctx.rotate(-.3);ctx.beginPath();ctx.ellipse(0,0,3.5,6,.3,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.save();ctx.translate(13,1);ctx.rotate(.3);ctx.beginPath();ctx.ellipse(0,0,3.5,6,-.3,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.save();ctx.translate(-5,12);ctx.beginPath();ctx.ellipse(0,0,5,3.5,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.save();ctx.translate(5,12);ctx.beginPath();ctx.ellipse(0,0,5,3.5,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.restore();
  }
  
  function dMira(ctx,t){
    const bob=Math.sin(t*.04)*1.2;
    ctx.save();ctx.translate(30,30+bob);
    const ag=ctx.createRadialGradient(0,0,0,0,0,28);
    ag.addColorStop(0,"rgba(0,170,255,.2)");ag.addColorStop(1,"transparent");
    ctx.fillStyle=ag;ctx.beginPath();ctx.arc(0,0,28,0,Math.PI*2);ctx.fill();
    const pp=t*.015;
    for(let i=0;i<8;i++){
      const a=(i/8)*Math.PI*2+pp;
      ctx.save();ctx.translate(Math.cos(a)*17,Math.sin(a)*17);ctx.rotate(a+Math.PI/2);
      const pg=ctx.createRadialGradient(0,0,0,0,0,9);
      pg.addColorStop(0,"rgba(255,220,255,.95)");pg.addColorStop(.5,"rgba(180,140,255,.7)");pg.addColorStop(1,"transparent");
      ctx.fillStyle=pg;ctx.beginPath();ctx.ellipse(0,0,5,9,0,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    for(let i=0;i<4;i++){
      const a=(i/4)*Math.PI*2+pp*1.5+Math.PI/4;
      ctx.save();ctx.translate(Math.cos(a)*11,Math.sin(a)*11);ctx.rotate(a+Math.PI/2);
      ctx.fillStyle="rgba(255,240,255,.75)";ctx.beginPath();ctx.ellipse(0,0,3.5,7,0,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    ctx.fillStyle="#1a1a2a";ctx.strokeStyle="#00aaff";ctx.lineWidth=2;
    ctx.beginPath();ctx.ellipse(0,1,14,14,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.strokeStyle="rgba(0,170,255,.35)";ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,1,17,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle="#ddeeff";ctx.beginPath();ctx.ellipse(0,-1,9,8,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#006699";ctx.beginPath();ctx.ellipse(1,-1,6,6,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#003355";ctx.beginPath();ctx.ellipse(1,-1,4,4,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#fff";ctx.beginPath();ctx.ellipse(-1.5,-3,2.5,2,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#448";ctx.lineWidth=1.6;ctx.lineCap="round";ctx.beginPath();ctx.arc(0,7,5,.15,Math.PI-.15);ctx.stroke();
    ctx.fillStyle="#ffe600";ctx.beginPath();ctx.arc(0,-14,4,0,Math.PI*2);ctx.fill();
    for(let i=0;i<5;i++){const a=(i/5)*Math.PI*2+t*.05;ctx.fillStyle="rgba(255,230,0,.8)";ctx.beginPath();ctx.arc(Math.cos(a)*7,Math.sin(a)*7-14,1.5,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle="#1a1a2a";ctx.strokeStyle="#00aaff";ctx.lineWidth=1.5;
    ctx.save();ctx.translate(-15,2);ctx.rotate(-.5);ctx.beginPath();ctx.ellipse(0,0,4,8,.2,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.save();ctx.translate(15,2);ctx.rotate(.5);ctx.beginPath();ctx.ellipse(0,0,4,8,-.2,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.save();ctx.translate(-5,14);ctx.beginPath();ctx.ellipse(0,0,5,3.5,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.save();ctx.translate(5,14);ctx.beginPath();ctx.ellipse(0,0,5,3.5,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.restore();
  }
  
  function dArttifex(ctx,t){
    const bob=Math.sin(t*.04);
    ctx.save();ctx.translate(30,33+bob);
    const ag=ctx.createRadialGradient(0,0,0,0,0,25);ag.addColorStop(0,"rgba(255,153,0,.2)");ag.addColorStop(1,"transparent");
    ctx.fillStyle=ag;ctx.beginPath();ctx.arc(0,0,25,0,Math.PI*2);ctx.fill();
    function lLeaf(c){c.fillStyle="#2a5a10";c.strokeStyle="#ff9900";c.lineWidth=1.2;c.beginPath();c.moveTo(0,-12);c.lineTo(-5,-5);c.lineTo(-1,-5);c.lineTo(-6,4);c.lineTo(2,4);c.lineTo(-2,-2);c.lineTo(3,-2);c.closePath();c.fill();c.stroke();}
    ctx.save();ctx.translate(-16,0);ctx.rotate(-.6);lLeaf(ctx);ctx.restore();
    ctx.save();ctx.translate(16,0);ctx.rotate(.6);ctx.scale(-1,1);lLeaf(ctx);ctx.restore();
    ctx.fillStyle="#1e1a10";ctx.strokeStyle="#ff9900";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,16,14,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.strokeStyle="rgba(255,153,0,.35)";ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,19,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle="#eeddcc";ctx.beginPath();ctx.ellipse(0,-1,9,8,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#aa5500";ctx.beginPath();ctx.ellipse(1,-1,6,6,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#663300";ctx.beginPath();ctx.ellipse(1,-1,3.5,3.5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#fff";ctx.beginPath();ctx.ellipse(-1.5,-3,2,1.5,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#554";ctx.lineWidth=1.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-5,7);ctx.lineTo(5,7);ctx.stroke();
    ctx.fillStyle="#3a6a10";ctx.strokeStyle="#ff9900";ctx.lineWidth=1;
    ctx.save();ctx.translate(0,-14);ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(-4,-3);ctx.lineTo(-1,-3);ctx.lineTo(-5,5);ctx.lineTo(1,5);ctx.lineTo(-2,0);ctx.lineTo(2,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    ctx.fillStyle="#1e1a10";ctx.strokeStyle="#ff9900";ctx.lineWidth=1.8;
    ctx.save();ctx.translate(-17,1);ctx.rotate(-.2);ctx.beginPath();ctx.ellipse(0,0,5,9,.1,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.save();ctx.translate(17,1);ctx.rotate(.2);ctx.beginPath();ctx.ellipse(0,0,5,9,-.1,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.lineWidth=1.6;
    ctx.save();ctx.translate(-6,14);ctx.beginPath();ctx.ellipse(0,0,6,4,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.save();ctx.translate(6,14);ctx.beginPath();ctx.ellipse(0,0,6,4,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.restore();
  }
  
  function dGaboo(ctx,t){
    const bob=Math.sin(t*.04+.5);
    ctx.save();ctx.translate(30,33+bob);
    const ag=ctx.createRadialGradient(0,0,0,0,0,25);ag.addColorStop(0,"rgba(255,51,102,.2)");ag.addColorStop(1,"transparent");
    ctx.fillStyle=ag;ctx.beginPath();ctx.arc(0,0,25,0,Math.PI*2);ctx.fill();
    function sLeaf(c){c.fillStyle="#1a4a15";c.strokeStyle="#ff3366";c.lineWidth=1.2;c.beginPath();c.moveTo(0,-13);c.lineTo(-7,-8);c.lineTo(-8,0);c.lineTo(-5,8);c.lineTo(0,11);c.lineTo(5,8);c.lineTo(8,0);c.lineTo(7,-8);c.closePath();c.fill();c.stroke();c.fillStyle="#ff3366";c.globalAlpha=.5;c.beginPath();c.arc(0,-1,3,0,Math.PI*2);c.fill();c.globalAlpha=1;}
    ctx.save();ctx.translate(-17,0);ctx.rotate(-.4);sLeaf(ctx);ctx.restore();
    ctx.save();ctx.translate(17,0);ctx.rotate(.4);ctx.scale(-1,1);sLeaf(ctx);ctx.restore();
    ctx.fillStyle="#1a0a10";ctx.strokeStyle="#ff3366";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,16,14,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.strokeStyle="rgba(255,51,102,.35)";ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,19,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle="#ffdddd";ctx.beginPath();ctx.ellipse(0,-1,9,8,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#aa0033";ctx.beginPath();ctx.ellipse(1,-1,6,6,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#660022";ctx.beginPath();ctx.ellipse(1,-1,3.5,3.5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#fff";ctx.beginPath();ctx.ellipse(-1.5,-3,2,1.5,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#554";ctx.lineWidth=1.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-5,7);ctx.lineTo(5,7);ctx.stroke();
    ctx.fillStyle="#2a5a15";ctx.strokeStyle="#ff3366";ctx.lineWidth=1;
    ctx.save();ctx.translate(0,-15);ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(-5,-5);ctx.lineTo(-6,1);ctx.lineTo(-4,6);ctx.lineTo(0,9);ctx.lineTo(4,6);ctx.lineTo(6,1);ctx.lineTo(5,-5);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    ctx.fillStyle="#1a0a10";ctx.strokeStyle="#ff3366";ctx.lineWidth=1.8;
    ctx.save();ctx.translate(-17,1);ctx.rotate(-.2);ctx.beginPath();ctx.ellipse(0,0,5,9,.1,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.save();ctx.translate(17,1);ctx.rotate(.2);ctx.beginPath();ctx.ellipse(0,0,5,9,-.1,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.lineWidth=1.6;
    ctx.save();ctx.translate(-6,14);ctx.beginPath();ctx.ellipse(0,0,6,4,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.save();ctx.translate(6,14);ctx.beginPath();ctx.ellipse(0,0,6,4,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.restore();
  }
  
  function dJovan(ctx,t){
    const bob=Math.sin(t*.05)*1.3;
    ctx.save();ctx.translate(30,32+bob);
    const ag=ctx.createRadialGradient(0,0,0,0,0,22);ag.addColorStop(0,"rgba(0,232,200,.12)");ag.addColorStop(1,"transparent");
    ctx.fillStyle=ag;ctx.beginPath();ctx.arc(0,0,22,0,Math.PI*2);ctx.fill();
    dBase(ctx,-t,{ac:"#00e8c8",lc:"#1a8a7a",ec:"#007766",bc:"#0a1a18",sc:"#00e8c8"});
    ctx.save();ctx.translate(18,-2);ctx.rotate(.3);
    ctx.fillStyle="#f5ead0";ctx.strokeStyle="#aa8833";ctx.lineWidth=.8;
    ctx.beginPath();ctx.moveTo(-1,-7);ctx.lineTo(7,-7);ctx.quadraticCurveTo(7,-7,7,-5);ctx.lineTo(7,7);ctx.quadraticCurveTo(7,7,5,7);ctx.lineTo(-1,7);ctx.quadraticCurveTo(-3,7,-3,5);ctx.lineTo(-3,-5);ctx.quadraticCurveTo(-3,-7,-1,-7);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle="rgba(0,0,0,.2)";ctx.lineWidth=.6;
    for(let l=0;l<4;l++){ctx.beginPath();ctx.moveTo(-1,-4+l*3);ctx.lineTo(5,-4+l*3);ctx.stroke();}
    ctx.fillStyle="#d4a030";ctx.strokeStyle="#aa7020";ctx.lineWidth=.8;
    ctx.beginPath();ctx.ellipse(2,-7,4,2,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.ellipse(2,7,4,2,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.restore();
    ctx.strokeStyle="#00e8c8";ctx.lineWidth=.9;
    ctx.beginPath();ctx.arc(-3.5,-1,3,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.arc(3.5,-1,3,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-.5,-1);ctx.lineTo(.5,-1);ctx.stroke();
    ctx.restore();
  }
  
  function dAifilho(ctx,t){
    const bob=Math.sin(t*.05)*1.3;
    ctx.save();ctx.translate(30,32+bob);
    const ag=ctx.createRadialGradient(0,0,0,0,0,22);ag.addColorStop(0,"rgba(153,69,255,.15)");ag.addColorStop(1,"transparent");
    ctx.fillStyle=ag;ctx.beginPath();ctx.arc(0,0,22,0,Math.PI*2);ctx.fill();
    dBase(ctx,-t,{ac:"#9945ff",lc:"#6620cc",ec:"#7730cc",bc:"#100a1a",sc:"#9945ff"});
    ctx.save();ctx.translate(-20,0);ctx.rotate(-.3);
    ctx.fillStyle="#d4a030";ctx.strokeStyle="#8a6010";ctx.lineWidth=.8;
    ctx.beginPath();ctx.ellipse(0,0,6,5,.2,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle="#0a0a1a";ctx.beginPath();ctx.arc(-1,1,1.5,0,Math.PI*2);ctx.fill();
    ["#ff3366","#00e832","#00aaff","#ffe600","#ff6600"].forEach((c,i)=>{const a=(i/5)*Math.PI*2-.5;ctx.fillStyle=c;ctx.beginPath();ctx.arc(Math.cos(a)*3.5,Math.sin(a)*3-.5,1.2,0,Math.PI*2);ctx.fill();});
    ctx.restore();
    ctx.save();ctx.translate(18,4);ctx.rotate(.8);
    ctx.fillStyle="#8a5010";ctx.fillRect(-1,-9,2,12);ctx.fillStyle="#ccc";ctx.fillRect(-1.5,-9,3,4);
    ctx.fillStyle="#9945ff";ctx.beginPath();ctx.ellipse(0,-11,1.5,3,0,0,Math.PI*2);ctx.fill();
    ctx.restore();
    [[-14,-10,"#ff3366"],[-18,5,"#ffe600"],[14,-14,"#00aaff"]].forEach(([sx,sy,sc])=>{
      ctx.fillStyle=sc;ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(sx+Math.sin(t*.05),sy,2,0,Math.PI*2);ctx.fill();
    });
    ctx.globalAlpha=1;
    ctx.restore();
  }
  
  function dDias(ctx,t){
    const bob=Math.sin(t*.05)*2.5;
    ctx.save();ctx.translate(30,32+bob);
    const ag=ctx.createRadialGradient(0,0,0,0,0,26);ag.addColorStop(0,"rgba(255,230,0,.22)");ag.addColorStop(1,"transparent");
    ctx.fillStyle=ag;ctx.beginPath();ctx.arc(0,0,26,0,Math.PI*2);ctx.fill();
    dBase(ctx,-t,{ac:"#ffe600",lc:"#cc9900",ec:"#aa7700",bc:"#1a1400",sc:"#ffe600"});
    ctx.save();ctx.translate(3,-22);ctx.rotate(-.44);
    ctx.fillStyle="#ffe600";
    for(let i=0;i<5;i++){ctx.save();ctx.rotate((i/5)*Math.PI*2+t*.04);ctx.beginPath();ctx.moveTo(0,-4.5);ctx.lineTo(1,-1.5);ctx.lineTo(4,-1.5);ctx.lineTo(1.5,.8);ctx.lineTo(2.5,3.5);ctx.lineTo(0,1.8);ctx.lineTo(-2.5,3.5);ctx.lineTo(-1.5,.8);ctx.lineTo(-4,-1.5);ctx.lineTo(-1,-1.5);ctx.closePath();ctx.fill();ctx.restore();}
    ctx.restore();
    ctx.fillStyle="#1a1400";ctx.strokeStyle="#ffe600";ctx.lineWidth=1.8;
    ctx.save();ctx.translate(-14,0);ctx.rotate(-1.1);ctx.beginPath();ctx.ellipse(0,0,4,9,.2,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.save();ctx.translate(14,0);ctx.rotate(1.1);ctx.beginPath();ctx.ellipse(0,0,4,9,-.2,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
    ctx.strokeStyle="#554";ctx.lineWidth=2;ctx.lineCap="round";ctx.beginPath();ctx.arc(0,6,6,.1,Math.PI-.1);ctx.stroke();
    for(let i=0;i<4;i++){const a=(i/4)*Math.PI*2+t*.06;ctx.fillStyle="#ffe600";ctx.globalAlpha=.5+.4*Math.sin(t*.08+i);ctx.beginPath();ctx.arc(Math.cos(a)*20,Math.sin(a)*20,2,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=1;
    ctx.restore();
  }
  
  function dDan(ctx,t){
    const bob=Math.sin(t*.03)*.8;
    ctx.save();ctx.translate(30,32+bob);
    const ag=ctx.createRadialGradient(0,0,0,0,0,24);ag.addColorStop(0,"rgba(255,80,0,.25)");ag.addColorStop(.6,"rgba(255,40,0,.08)");ag.addColorStop(1,"transparent");
    ctx.fillStyle=ag;ctx.beginPath();ctx.arc(0,0,24,0,Math.PI*2);ctx.fill();
    dBase(ctx,-t,{ac:"#ff6600",lc:"#cc4400",ec:"#cc3300",bc:"#180800",sc:"#ff6600"});
    const fp=t*.06;
    ctx.save();ctx.translate(3,-22);
    for(let fi=0;fi<3;fi++){
      const fw=5-fi*1.2,fh=10-fi*2;
      const fg=ctx.createLinearGradient(0,0,0,-fh);fg.addColorStop(0,fi===0?"#ff3300":"#ff6600");fg.addColorStop(1,"rgba(255,230,0,0)");
      ctx.fillStyle=fg;ctx.globalAlpha=.7+fi*.1;
      ctx.beginPath();ctx.moveTo(-fw/2,0);ctx.quadraticCurveTo(-fw,-(fh*.4),(-fw/4+Math.sin(fp+fi)*2),-fh);ctx.quadraticCurveTo(fw,-(fh*.4),fw/2,0);ctx.closePath();ctx.fill();
    }
    ctx.globalAlpha=1;ctx.restore();
    ctx.fillStyle="rgba(20,5,0,.55)";ctx.beginPath();ctx.ellipse(0,2,15,12,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="rgba(255,100,0,.85)";ctx.beginPath();ctx.ellipse(1,-1,4,3,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#fff";ctx.globalAlpha=.5;ctx.beginPath();ctx.ellipse(-1,-2,1.5,1,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    ctx.strokeStyle="#554";ctx.lineWidth=1.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-3,8);ctx.quadraticCurveTo(0,11,4,7);ctx.stroke();
    ctx.restore();
  }
  
  function dVictor(ctx,t){
    const bob=Math.sin(t*.05)*1.3;
    ctx.save();ctx.translate(30,32+bob);
    const ag=ctx.createRadialGradient(0,0,0,0,0,22);ag.addColorStop(0,"rgba(0,180,50,.12)");ag.addColorStop(1,"transparent");
    ctx.fillStyle=ag;ctx.beginPath();ctx.arc(0,0,22,0,Math.PI*2);ctx.fill();
    dBase(ctx,-t,{ac:"#00b832",lc:"#1a6a20",ec:"#0a5a15",bc:"#081408",sc:"#00a020"});
    ctx.save();ctx.translate(3,-22);ctx.rotate(-.44+Math.sin(t*.04)*.05);
    const lg=ctx.createLinearGradient(-8,0,10,0);lg.addColorStop(0,"#1a5a1a");lg.addColorStop(.5,"#1a6a20");lg.addColorStop(1,"#1a5a1a");
    ctx.fillStyle=lg;ctx.beginPath();ctx.ellipse(5,0,11,5,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="rgba(0,200,50,.8)";ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-6,2);ctx.lineTo(-2,0);ctx.lineTo(2,-3);ctx.lineTo(5,-1);ctx.lineTo(9,-4);ctx.stroke();
    ctx.fillStyle="rgba(0,200,50,.5)";
    [[-4,4],[-1,3],[2,3.5],[5,2.5]].forEach(([x,y])=>ctx.fillRect(x-.75,y,1.5,2));
    ctx.restore();
    ctx.save();ctx.translate(18,-2);ctx.rotate(.4);
    ctx.strokeStyle="#00a020";ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,-5,5,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle="#006610";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(3.5,-1.5);ctx.lineTo(7,3);ctx.stroke();
    ctx.strokeStyle="rgba(0,200,50,.6)";ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-3,-7);ctx.lineTo(-1,-6);ctx.lineTo(1,-8);ctx.lineTo(2.5,-5);ctx.stroke();
    ctx.restore();
    ctx.restore();
  }
  
  function dSistema(ctx,t){
    const bob=Math.sin(t*.03)*.5;
    ctx.save();ctx.translate(30,32+bob);
    ctx.strokeStyle="rgba(58,80,112,.3)";ctx.lineWidth=.5;
    for(let i=-20;i<=20;i+=8){ctx.beginPath();ctx.moveTo(i,-22);ctx.lineTo(i,22);ctx.stroke();ctx.beginPath();ctx.moveTo(-22,i);ctx.lineTo(22,i);ctx.stroke();}
    ctx.fillStyle="#060e1a";ctx.strokeStyle="#3a5070";ctx.lineWidth=1.5;
    ctx.beginPath();for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2-Math.PI/6;i===0?ctx.moveTo(Math.cos(a)*13,Math.sin(a)*13):ctx.lineTo(Math.cos(a)*13,Math.sin(a)*13);}ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle="#1a2a3a";ctx.beginPath();ctx.arc(0,-1,8,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#3a5070";ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,-1,8,0,Math.PI*2);ctx.stroke();
    const sc=(t*.08)%(Math.PI*2);
    ctx.strokeStyle="rgba(0,232,50,.6)";ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(0,-1);ctx.lineTo(Math.cos(sc)*7,Math.sin(sc)*7-1);ctx.stroke();
    ctx.fillStyle="#00e832";ctx.globalAlpha=.8+.2*Math.sin(t*.1);ctx.beginPath();ctx.arc(0,-1,2,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    if(Math.floor(t*.05)%2===0){ctx.fillStyle="#3a5070";for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(-3+i*3,8,1.2,0,Math.PI*2);ctx.fill();}}
    ctx.strokeStyle="#3a5070";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,-13);ctx.lineTo(0,-20);ctx.stroke();
    ctx.fillStyle="#00e832";ctx.globalAlpha=.5+.5*Math.sin(t*.15);ctx.beginPath();ctx.arc(0,-21,2,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    ctx.restore();
  }
  
  // ========== PORTRAIT SYSTEM ==========
  function mkPortrait(npcId,sz){
    const c=document.createElement("canvas");
    c.width=sz;c.height=sz;c.style.cssText="display:block;width:"+sz+"px;height:"+sz+"px";
    let f=0;
    (function anim(){const cx=c.getContext("2d");cx.clearRect(0,0,sz,sz);drawChar(cx,npcId,sz,f++);requestAnimationFrame(anim);})();
    return c;
  }
  
  function setPortrait(npcId,color,name,role){
    const w=document.getElementById("dport");if(!w)return;
    w.style.borderColor=color;w.style.boxShadow="0 0 16px "+color+"55";
    w.innerHTML="";w.appendChild(mkPortrait(npcId,60));
    document.getElementById("dname").textContent=name;document.getElementById("dname").style.color=color;
    document.getElementById("drole").textContent=role;
  }
  
  // ========== GAME DATA ==========
  const NPCS={
    sistema:{name:"SISTEMA",        role:"Interface de Ativacao",         color:"#3a5070"},
    mira:   {name:"MIRA",           role:"Voz Oficial da StandX",          color:"#00aaff"},
    arttifex:{name:"ARTTIFEX",      role:"Moderador BR - StandX",         color:"#ff9900"},
    gaboo:  {name:"GABOO",          role:"Moderador BR - StandX",         color:"#ff3366"},
    jovan:  {name:"JOVAN",          role:"Content Squad - Sprout para Flower",color:"#00e8c8"},
    aifilho:{name:"AIFILHO",        role:"Creative Squad - Sprout",       color:"#9945ff"},
    dias:   {name:"DIAS",           role:"Creative Squad - Sprout",       color:"#ffe600"},
    dan:    {name:"DAN",            role:"Creative Squad - Sprout",       color:"#ff6600"},
    victor: {name:"VICTOR DE SOUZA",role:"Content/Research Squad - Sprout",color:"#00b832"},
    stander:{name:"STANDER",        role:"Seed -- New Stander",            color:"#00e832"},
  };
  
  let ZONES=[
    {id:"void",  name:"THE VOID",         sub:"onde tudo comeca",       accent:"#00e832",sky:["#04080f","#061020","#04080f"],ground:"#080e08",gline:"#00e832",par:"orbs"},
    {id:"plaza", name:"DISCORD PLAZA",    sub:"a comunidade esta viva",  accent:"#00aaff",sky:["#040a18","#060e22","#040a18"],ground:"#060e18",gline:"#00aaff",par:"panels"},
    {id:"arena", name:"EVENT ARENA",      sub:"onde Gaboo comanda",      accent:"#ff3366",sky:["#120408","#1a0610","#120408"],ground:"#140408",gline:"#ff3366",par:"sparks"},
    {id:"studio",name:"CONTENT DISTRICT", sub:"Jovan & Aifilho esperam", accent:"#9945ff",sky:["#080412","#0e0618","#080412"],ground:"#0c0614",gline:"#9945ff",par:"papers"},
    {id:"gate",  name:"MODERATOR GATE",   sub:"Arttifex avalia tudo",    accent:"#ff9900",sky:["#100a04","#180e06","#100a04"],ground:"#120a04",gline:"#ff9900",par:"sparks"},
    {id:"hall",  name:"SEED HALL",        sub:"voce chegou",             accent:"#ffe600",sky:["#0e0e06","#141408","#0e0e06"],ground:"#101008",gline:"#ffe600",par:"stars"},
  ];
  
  let STORY={
    void_awaken:[
      {npc:"sistema",text:"[ LOG DE ATIVACAO ] Entidade: STANDER  Status: New Stander  Engage Points: 0/3000  Missao: Crescer ate FLOWER"},
      {npc:"stander",text:"Onde estou? Escuridao total. So eu e um olho tentando entender esse universo."},
      {npc:"stander",text:"Tem um sinal. Fraco, mas constante. Vem de um lugar chamado... StandX."},
      {npc:"mira",   text:"Bem-vindo. Eu sou a Mira -- Voz Oficial da StandX. Sou quem da as regras, as metas, as missoes."},
      {npc:"mira",   text:"O Growth Path tem 3 cargos: SEED, SPROUT e FLOWER. Cada um exige mais -- consistencia, qualidade e impacto real na comunidade."},
      {npc:"stander",text:"Por onde comeco?"},
      {npc:"mira",   text:"Pelo comeco. 3.000 Engage Points para aplicar ao SEED. Cada acao conta. Vamos."},
    ],
    void_choice:{text:"Como voce quer entrar no servidor?",opts:[
      {text:"Entrar com energia -- primeiro evento, primeiro post",tag:"EP",pts:80,fn:()=>{addEP(80);ntf("+80 EP -- Presenca notada desde o primeiro dia!","ep");}},
      {text:"Observar antes de agir -- ler tudo primeiro",tag:"LEARN",pts:30,fn:()=>{addEP(30);ntf("+30 EP -- Consistencia comeca com observacao.","info");}},
    ]},
    plaza_enter:[
      {npc:"mira",   text:"Discord Plaza. Canais para tudo: eventos, conteudo, anuncios, suporte. Cada um tem um proposito."},
      {npc:"dias",   text:"Ei! Sou o Dias. Ja sou Sprout. Sabe o que me trouxe ate aqui? Presenca. Todo. Dia."},
      {npc:"stander",text:"Todo dia mesmo?"},
      {npc:"dias",   text:"Todo dia. Reagia nos anuncios, participava dos eventos, ajudava quem chegava. Nao era o mais tecnico -- mas era o mais presente. Isso conta muito aqui."},
      {npc:"mira",   text:"O Dias esta certo. Reacoes em announcements, weekly events, shoutouts -- tudo gera Engage Points. Consistencia e o seu maior ativo."},
    ],
    plaza_announcement:[
      {npc:"mira",   text:"[ ANNOUNCEMENT ativo ] Uma atualizacao foi postada. Reagir a posts oficiais gera pontos. Pequena acao, habito poderoso."},
      {npc:"stander",text:"Simples assim?"},
      {npc:"mira",   text:"Simples assim. Quem faz isso todo dia chega mais rapido do que quem faz algo enorme uma vez por mes."},
    ],
    plaza_choice:{text:"O que voce faz com o announcement?",opts:[
      {text:"Reagir e comentar algo relevante",tag:"EP +120",pts:120,fn:()=>{addEP(120);ntf("+120 EP -- Engajamento real notado!","ep");}},
      {text:"So reagir, sem comentar",tag:"EP +50",pts:50,fn:()=>{addEP(50);ntf("+50 EP -- Reacao registrada.","ep");}},
      {text:"Ignorar por agora",tag:"MISS",pts:0,fn:()=>{ntf("Oportunidade perdida. Cada acao conta.","warn");}},
    ]},
    arena_enter:[
      {npc:"gaboo",  text:"Sou o Gaboo, mod BR. Aqui e a Event Arena. Weekly Events -- 200 a 300 Engage Points de uma vez."},
      {npc:"stander",text:"Duzentos pontos? Isso acelera muito."},
      {npc:"gaboo",  text:"Por isso nunca perde um evento. Mas os mods observam quem contribui de verdade. Shoutout semanal = mais 100 pontos pra quem se destacar."},
      {npc:"mira",   text:"O Gaboo coordena os eventos BR. Para o destaque, precisa trazer energia e ajudar quem esta chegando."},
      {npc:"gaboo",  text:"Voce ta pronto? O mercado nao espera."},
    ],
    studio_enter:[
      {npc:"jovan",  text:"Fala! Sou o Jovan -- Content Squad, rota Sprout para Flower. Conteudo de qualidade gera de 15 a 40 pontos por peca. Destaque da semana = mais 100."},
      {npc:"stander",text:"Como voce define qualidade?"},
      {npc:"jovan",  text:"Profundidade. Conteudo que ensina, que analisa, que da contexto. Post de hype nao vai te destacar. Uma analise de como o DUSD funciona -- essa vai."},
      {npc:"aifilho",text:"E o visual importa. Sou o Aifilho, Creative Squad. Consistencia visual e o seu diferencial. Identidade, legibilidade, clareza."},
      {npc:"victor", text:"Oi, sou o Victor de Souza -- Content/Research Squad, tambem Sprout. Vim do CEX. Achei que entender de trade era suficiente para criar conteudo tecnico. Nao e."},
      {npc:"victor", text:"A comunidade sente quando e superficial. Profundidade tecnica com voz humana -- esse e o caminho."},
    ],
    studio_choice:{text:"Com qual tipo de conteudo voce vai estrear?",opts:[
      {text:"Analise tecnica: Como o DUSD mantem delta-neutral",tag:"DEEP",pts:40,fn:()=>{addEP(40);ntf("+40 EP -- Selecionado! Victor aprovaria.","ep");}},
      {text:"Tutorial basico: Como comecar na StandX",tag:"LEARN",pts:25,fn:()=>{addEP(25);ntf("+25 EP -- Bom para newcomers. Continue desenvolvendo.","info");}},
      {text:"Post de hype generico sobre a plataforma",tag:"LOW",pts:5,fn:()=>{addEP(5);ntf("+5 EP -- Pouca profundidade.","warn");}},
    ]},
    gate_enter:[
      {npc:"arttifex",text:"Sou o Arttifex. Mod BR. Moderator Gate -- aqui avaliamos se voce esta pronto pro SEED."},
      {npc:"arttifex",text:"Nao e automatico. Olhamos atividade geral, qualidade do que postou, como tratou outros membros."},
      {npc:"stander", text:"O que voces buscam exatamente?"},
      {npc:"arttifex",text:"Genuino. Alguem que veio para contribuir, nao para farmar pontos."},
      {npc:"mira",    text:"Eu olho sempre. Todo log, toda interacao. A aplicacao do SEED e uma filtragem -- passa quem realmente construiu presenca."},
      {npc:"arttifex",text:"Voce tem Engage Points. Agora vem a parte que os pontos nao cobrem. Uma pergunta."},
    ],
    gate_choice:{text:"Arttifex pergunta: Por que voce quer o cargo de SEED?",opts:[
      {text:"Quero contribuir de verdade. Aprendi muito -- quero passar isso pra frente.",tag:"GENUINO",pts:150,fn:()=>{addEP(150);ntf("+150 EP -- Aprovado com destaque!","ep");}},
      {text:"Quero os beneficios e a progressao pro Sprout.",tag:"HONESTO",pts:80,fn:()=>{addEP(80);ntf("+80 EP -- Honesto. O Arttifex anotou.","info");}},
      {text:"Preciso do cargo para ter mais visibilidade.",tag:"RISCO",pts:20,fn:()=>{addEP(20);ntf("+20 EP -- Arttifex levantou a sobrancelha.","warn");}},
    ]},
    hall_enter:[
      {npc:"dias",   text:"EI! Voce chegou! Cara, vi tua jornada -- voce foi consistente. Merece!"},
      {npc:"mira",   text:"Aplicacao revisada. Engage Points verificados. Stander -- voce esta aprovado para o cargo @SEED."},
      {npc:"stander",text:"@SEED... E real?"},
      {npc:"mira",   text:"E real. Mas o SEED nao e o destino -- e a porta de entrada. Agora voce escolhe um Squad."},
      {npc:"dan",    text:"..."},
      {npc:"stander",text:"Quem e aquele?"},
      {npc:"dias",   text:"Dan. Creative Squad. Fala pouco -- mas quando faz algo, o padrao e outro nivel. Amplifica o trabalho de todo mundo. Esse e o nivel que voce vai perseguir."},
      {npc:"mira",   text:"Escolha um Squad. Cada um tem suas missoes. Qual e o seu caminho?"},
    ],
    hall_choice:{text:"Qual Squad voce escolhe?",opts:[
      {text:"Content/Research -- analises, tutoriais, insights",tag:"SQUAD",pts:0,fn:()=>{ntf("Content Squad. Victor e Jovan serao seus companheiros.","info");setRank("SEED -- Content Squad");}},
      {text:"Creative -- visuais, videos, identidade",tag:"SQUAD",pts:0,fn:()=>{ntf("Creative Squad. Aifilho e Dan serao sua referencia.","info");setRank("SEED -- Creative Squad");}},
      {text:"Tech Support -- tutoriais tecnicos, suporte",tag:"SQUAD",pts:0,fn:()=>{ntf("Tech Squad. Foco em conhecimento tecnico.","info");setRank("SEED -- Tech Squad");}},
      {text:"Outreach -- KOLs, parcerias, comunidade",tag:"SQUAD",pts:0,fn:()=>{ntf("Outreach Squad. Conexoes sao seu ativo.","info");setRank("SEED -- Outreach");}},
    ]},
  };
  
  let WEVENTS=[
    {z:0,x:260,id:"void_awaken",type:"dlg"},
    {z:0,x:700,id:"void_choice",type:"cho"},
    {z:0,x:1000,id:"z0z1",type:"portal",to:1},
    {z:1,x:250,id:"plaza_enter",type:"dlg"},
    {z:1,x:550,id:"plaza_announcement",type:"dlg"},
    {z:1,x:800,id:"plaza_choice",type:"cho"},
    {z:1,x:1100,id:"z1z2",type:"portal",to:2},
    {z:2,x:200,id:"arena_enter",type:"dlg"},
    {z:2,x:550,id:"arena_trade",type:"qte",qte:"trade"},
    {z:2,x:900,id:"z2z3",type:"portal",to:3},
    {z:3,x:200,id:"studio_enter",type:"dlg"},
    {z:3,x:600,id:"studio_choice",type:"cho"},
    {z:3,x:850,id:"studio_content",type:"qte",qte:"content"},
    {z:3,x:1100,id:"z3z4",type:"portal",to:4},
    {z:4,x:200,id:"gate_enter",type:"dlg"},
    {z:4,x:600,id:"gate_choice",type:"cho"},
    {z:4,x:1000,id:"z4z5",type:"portal",to:5},
    {z:5,x:200,id:"hall_enter",type:"dlg"},
    {z:5,x:600,id:"hall_choice",type:"cho"},
    {z:5,x:1000,id:"ending",type:"end"},
  ];
  
  let ZONE_NPCS={
    1:[{id:"dias",x:300}],
    2:[{id:"gaboo",x:200}],
    3:[{id:"jovan",x:240},{id:"aifilho",x:500},{id:"victor",x:720}],
    4:[{id:"arttifex",x:220}],
    5:[{id:"dias",x:220},{id:"mira",x:460},{id:"dan",x:840}],
  };
  
  let QTE_CFG={
    trade:{
      title:"QTE -- EXECUCAO DE TRADE",sub:"PRESSIONE NO TIMING CERTO",
      mentor:{npc:"jovan",text:"Suporte testado 3x. Funding rate <em>negativo</em>. Volume crescendo. Zona verde e o ideal."},
      pf:{from:38,to:56},ok:{from:28,to:68},
      res:{
        pf:{icon:"&#127919;",cls:"win",title:"TIMING PERFEITO",pts:250,lesson:"Entrou no setup exato. Consolidacao + funding negativo = mercado posicionado errado. <em>Esse e o edge que separa traders de gamblers.</em>"},
        ok:{icon:"&#9989;",cls:"ok",title:"EXECUCAO OK",pts:120,lesson:"Proximo do ideal. Timing um pouco early ou late. <em>Na pratica, mais slippage e stop menor.</em>"},
        ms:{icon:"&#9888;",cls:"lose",title:"ENTRADA FORCADA",pts:40,lesson:"Fora da zona de setup e FOMO, nao analise. <em>Jovan diria: espera a confirmacao, sempre.</em>"},
      }
    },
    content:{
      title:"QTE -- QUALIDADE DE CONTEUDO",sub:"ESCOLHA EM 6 SEGUNDOS",
      mentor:{npc:"victor",text:"Moderador quer conteudo sobre <em>DUSD yield</em>. Qual tweet voce pararia para ler? Profundidade ganha shoutout. Hype nao."},
      opts:[
        {lbl:"OPCAO A",txt:"A arquitetura delta-neutral do DUSD significa que seu capital trabalha sem exposicao direcional. Nao e yield magico -- e estrutura. Thread com os mecanismos >",q:"deep",pts:40},
        {lbl:"OPCAO B",txt:"DUSD no StandX e incrivel! Yield passivo enquanto dorme! Melhor plataforma DeFi! Nao perde essa!",q:"hype",pts:5},
        {lbl:"OPCAO C",txt:"DUSD vs USDC em perps: delta-neutral vs exposicao direta. Dados reais, analise honesta. O que os numeros dizem >",q:"deep",pts:35},
      ],
      res:{
        deep:{icon:"&#128204;",cls:"win",title:"SELECIONADO",lesson:"Profundidade tecnica e exatamente o que a equipe busca. <em>Victor de Souza aprovaria -- esse e o padrao do Content Squad.</em>"},
        hype:{icon:"&#128226;",cls:"lose",title:"NAO SELECIONADO",lesson:"Conteudo de hype nao ensina nada. A equipe seleciona o que <em>agrega valor real</em> para quem esta aprendendo sobre DeFi."},
      }
    }
  };
  // ========== FLOW SYSTEM ==========
  const SEED_ZONES=[...ZONES],SEED_EVENTS=[...WEVENTS];
  const SEED_STORY=Object.assign({},STORY),SEED_NPCS=Object.assign({},ZONE_NPCS),SEED_QTE=Object.assign({},QTE_CFG);
  
  const SPROUT_ZONES=[
    {id:"sqhq",name:"SQUAD HQ",sub:"onde voce lidera",accent:"#00aaff",sky:["#040a18","#060e22","#040a18"],ground:"#060e18",gline:"#00aaff",par:"panels"},
    {id:"mentor",name:"MENTORSHIP ARENA",sub:"eleve outros Seeds",accent:"#00e8c8",sky:["#040e12","#061218","#040e12"],ground:"#061014",gline:"#00e8c8",par:"orbs"},
    {id:"summit",name:"SPROUT SUMMIT",sub:"lideranca reconhecida",accent:"#ffe600",sky:["#0e0e06","#141408","#0e0e06"],ground:"#101008",gline:"#ffe600",par:"stars"},
  ];
  const SPROUT_STORY={
    sq_enter:[
      {npc:"mira",text:"Bem-vindo ao Squad HQ. Voce ja e @SEED. Agora comeca a parte que separa presenca de lideranca."},
      {npc:"jovan",text:"Fala! Sou o Jovan. Quando virei Sprout, percebi que nao bastava criar conteudo -- tinha que direcionar o time."},
      {npc:"stander",text:"Como funciona a lideranca de Squad?"},
      {npc:"jovan",text:"Voce identifica gaps, propoe projetos, delega tarefas. O Squad precisa de direcao, nao so de execucao."},
      {npc:"mira",text:"Sprouts acumulam entre 3.000 e 10.000 EP. A qualidade das contribuicoes pesa mais que a quantidade."},
    ],
    sq_choice:{text:"Como voce quer liderar seu Squad?",opts:[
      {text:"Criar um programa de mentoria estruturado para novos Seeds",tag:"DEEP",pts:300,fn:()=>{addEP(300);ntf("+300 EP -- Programa de mentoria aprovado!","ep");}},
      {text:"Focar em producao de conteudo de alta qualidade",tag:"EP +200",pts:200,fn:()=>{addEP(200);ntf("+200 EP -- Conteudo de referencia.","ep");}},
      {text:"Delegar tudo e focar em networking",tag:"RISCO",pts:80,fn:()=>{addEP(80);ntf("+80 EP -- Networking sem base. Arriscado.","warn");}},
    ]},
    mn_enter:[
      {npc:"victor",text:"Mentorship Arena. Aqui voce eleva outros Seeds. Eu mesmo fui mentorado pelo Jovan."},
      {npc:"stander",text:"Como sei se estou mentorando bem?"},
      {npc:"victor",text:"Quando seu mentorado comeca a contribuir sem voce pedir. Autonomia e o objetivo."},
      {npc:"aifilho",text:"E nao esquece: cada pessoa aprende diferente. Adaptar o estilo e fundamental."},
      {npc:"mira",text:"Mentoria completa gera entre 100 e 200 EP. Mas o impacto real e imensuravel."},
    ],
    mn_choice:{text:"Um novo Seed pede ajuda. Como voce responde?",opts:[
      {text:"Criar um guia personalizado e acompanhar por 2 semanas",tag:"GENUINO",pts:200,fn:()=>{addEP(200);ntf("+200 EP -- Mentoria exemplar!","ep");}},
      {text:"Indicar os canais e recursos existentes",tag:"EP +100",pts:100,fn:()=>{addEP(100);ntf("+100 EP -- Util, mas poderia ir alem.","info");}},
      {text:"Mandar um link generico do FAQ",tag:"LOW",pts:30,fn:()=>{addEP(30);ntf("+30 EP -- Pouco investimento.","warn");}},
    ]},
    sm_enter:[
      {npc:"arttifex",text:"Sprout Summit. Aqui avaliamos se voce tem perfil de lideranca para o proximo nivel."},
      {npc:"dias",text:"Ei! Cheguei aqui tambem! A jornada de Sprout e sobre consistencia E impacto."},
      {npc:"mira",text:"Seus numeros sao solidos. Agora a pergunta que define tudo."},
    ],
    sm_choice:{text:"Qual foi seu maior impacto como Sprout?",opts:[
      {text:"Mentorei 5 Seeds ate o cargo. 3 ja sao Sprouts hoje.",tag:"GENUINO",pts:400,fn:()=>{addEP(400);ntf("+400 EP -- Impacto multiplicador!","ep");setRank("FLOWER CANDIDATE");}},
      {text:"Liderei 2 projetos que aumentaram engajamento em 40%.",tag:"EP +300",pts:300,fn:()=>{addEP(300);ntf("+300 EP -- Resultados mensuraveis.","ep");setRank("SPROUT AVANCADO");}},
      {text:"Mantive presenca consistente e criei conteudo toda semana.",tag:"EP +150",pts:150,fn:()=>{addEP(150);ntf("+150 EP -- Precisa mais impacto.","info");}},
    ]},
  };
  const SPROUT_EVENTS=[
    {z:0,x:250,id:"sq_enter",type:"dlg"},{z:0,x:600,id:"sq_choice",type:"cho"},
    {z:0,x:900,id:"sp_qte",type:"qte",qte:"leadership"},{z:0,x:1200,id:"sp01",type:"portal",to:1},
    {z:1,x:200,id:"mn_enter",type:"dlg"},{z:1,x:550,id:"mn_choice",type:"cho"},{z:1,x:900,id:"sp12",type:"portal",to:2},
    {z:2,x:200,id:"sm_enter",type:"dlg"},{z:2,x:600,id:"sm_choice",type:"cho"},{z:2,x:1000,id:"ending",type:"end"},
  ];
  const SPROUT_NPCS={0:[{id:"jovan",x:300},{id:"mira",x:550}],1:[{id:"victor",x:250},{id:"aifilho",x:500}],2:[{id:"arttifex",x:220},{id:"dias",x:450}]};
  const SPROUT_QTE={leadership:{title:"QTE -- DECISAO DE LIDERANCA",sub:"PRESSIONE NO TIMING CERTO",
    mentor:{npc:"jovan",text:"O Squad precisa de direcao. <em>Timing de lideranca</em> e saber quando agir e quando delegar."},
    pf:{from:40,to:58},ok:{from:30,to:70},
    res:{pf:{icon:"&#127775;",cls:"win",title:"LIDERANCA PERFEITA",pts:350,lesson:"Decisao no momento exato. <em>Visao estrategica de Sprout.</em>"},
      ok:{icon:"&#9989;",cls:"ok",title:"BOA DECISAO",pts:180,lesson:"Proximo do ideal. <em>Com experiencia, o timing fica natural.</em>"},
      ms:{icon:"&#9888;",cls:"lose",title:"DECISAO PRECIPITADA",pts:60,lesson:"Agir sem contexto e arriscado. <em>Analise antes de decidir.</em>"}}}};
  
  const FLOWER_ZONES=[
    {id:"chamber",name:"GOVERNANCE CHAMBER",sub:"decisoes estrategicas",accent:"#9945ff",sky:["#080412","#0e0618","#080412"],ground:"#0c0614",gline:"#9945ff",par:"orbs"},
    {id:"lab",name:"INNOVATION LAB",sub:"crie o futuro",accent:"#ff9900",sky:["#100a04","#180e06","#100a04"],ground:"#120a04",gline:"#ff9900",par:"sparks"},
    {id:"garden",name:"FLOWER GARDEN",sub:"maestria alcancada",accent:"#ff3366",sky:["#120408","#1a0610","#120408"],ground:"#140408",gline:"#ff3366",par:"stars"},
  ];
  const FLOWER_STORY={
    gv_enter:[
      {npc:"mira",text:"Governance Chamber. Aqui as decisoes moldam o futuro da comunidade. Poucos chegam ate aqui."},
      {npc:"stander",text:"O que e esperado de um Flower?"},
      {npc:"mira",text:"Visao de ecossistema. Voce nao pensa em tarefas -- pensa em sistemas que impactam centenas."},
      {npc:"arttifex",text:"Flower nao e um titulo -- e uma responsabilidade."},
      {npc:"gaboo",text:"Os Flowers que conheco mudaram a cultura da comunidade inteira."},
    ],
    gv_choice:{text:"Crise: membros reclamam de falta de transparencia. O que voce faz?",opts:[
      {text:"Criar governanca aberta com votacoes e relatorios publicos",tag:"DEEP",pts:500,fn:()=>{addEP(500);ntf("+500 EP -- Governanca exemplar!","ep");}},
      {text:"Organizar um AMA com o core team",tag:"EP +300",pts:300,fn:()=>{addEP(300);ntf("+300 EP -- Comunicacao direta.","ep");}},
      {text:"Postar um comunicado e seguir em frente",tag:"LOW",pts:100,fn:()=>{addEP(100);ntf("+100 EP -- Faltou dialogo.","warn");}},
    ]},
    lb_enter:[
      {npc:"dan",text:"Innovation Lab. Aqui ideias viram realidade. Silencio e foco."},
      {npc:"stander",text:"Dan fala?"},
      {npc:"dan",text:"Falo quando importa. Inovacao nao e barulho -- e resolver problemas que ninguem viu."},
      {npc:"aifilho",text:"As melhores features nasceram aqui. Sem hype, so execucao."},
      {npc:"mira",text:"Flowers geram 500 a 1.000 EP por inovacao. O valor real e o impacto duradouro."},
    ],
    lb_choice:{text:"Qual inovacao voce propoe?",opts:[
      {text:"Sistema de reputacao on-chain para contribuicoes de longo prazo",tag:"DEEP",pts:600,fn:()=>{addEP(600);ntf("+600 EP -- Proposta aceita pelo core team!","ep");}},
      {text:"Programa de grants para criadores independentes",tag:"EP +400",pts:400,fn:()=>{addEP(400);ntf("+400 EP -- Grants program aprovado.","ep");}},
      {text:"Mais emojis e stickers no Discord",tag:"LOW",pts:50,fn:()=>{addEP(50);ntf("+50 EP -- Cosmetico. Esperava-se mais.","warn");}},
    ]},
    gd_enter:[
      {npc:"mira",text:"Flower Garden. O nivel maximo. Seu legado e permanente."},
      {npc:"dias",text:"Voce chegou. Eu ainda sou Sprout, mas ver alguem aqui me motiva demais."},
      {npc:"jovan",text:"Como Flower, voce define o padrao. Cada acao sua e referencia."},
      {npc:"victor",text:"Voce e a prova de que o Growth Path funciona."},
      {npc:"mira",text:"Uma ultima decisao. O que define seu legado?"},
    ],
    gd_choice:{text:"Qual sera seu legado como Flower?",opts:[
      {text:"Criar academia de formacao para a proxima geracao de lideres",tag:"GENUINO",pts:800,fn:()=>{addEP(800);ntf("+800 EP -- Legado permanente!","ep");setRank("LEGENDARY FLOWER");}},
      {text:"Parcerias estrategicas que expandam o ecossistema",tag:"EP +500",pts:500,fn:()=>{addEP(500);ntf("+500 EP -- Expansao do ecossistema.","ep");setRank("SENIOR FLOWER");}},
      {text:"Manter o status quo e aproveitar os beneficios",tag:"RISCO",pts:100,fn:()=>{addEP(100);ntf("+100 EP -- Flowers que nao evoluem perdem relevancia.","warn");setRank("FLOWER");}},
    ]},
  };
  const FLOWER_EVENTS=[
    {z:0,x:250,id:"gv_enter",type:"dlg"},{z:0,x:600,id:"gv_choice",type:"cho"},{z:0,x:1000,id:"fl01",type:"portal",to:1},
    {z:1,x:200,id:"lb_enter",type:"dlg"},{z:1,x:550,id:"lb_choice",type:"cho"},
    {z:1,x:900,id:"fl_qte",type:"qte",qte:"innovation"},{z:1,x:1200,id:"fl12",type:"portal",to:2},
    {z:2,x:200,id:"gd_enter",type:"dlg"},{z:2,x:600,id:"gd_choice",type:"cho"},{z:2,x:1000,id:"ending",type:"end"},
  ];
  const FLOWER_NPCS={0:[{id:"arttifex",x:250},{id:"gaboo",x:480},{id:"mira",x:700}],1:[{id:"dan",x:250},{id:"aifilho",x:500}],2:[{id:"dias",x:220},{id:"jovan",x:440},{id:"victor",x:660},{id:"mira",x:880}]};
  const FLOWER_QTE={innovation:{title:"QTE -- DECISAO DE INOVACAO",sub:"PRESSIONE NO TIMING CERTO",
    mentor:{npc:"dan",text:"Inovacao exige <em>timing perfeito</em>. Cedo demais ninguem entende. Tarde demais e irrelevante."},
    pf:{from:42,to:58},ok:{from:30,to:70},
    res:{pf:{icon:"&#128142;",cls:"win",title:"INOVACAO VISIONARIA",pts:600,lesson:"Timing perfeito. <em>Isso torna um Flower legendary.</em>"},
      ok:{icon:"&#9989;",cls:"ok",title:"BOA INOVACAO",pts:300,lesson:"Solida mas nao revolucionaria. <em>Pode se tornar referencia.</em>"},
      ms:{icon:"&#9888;",cls:"lose",title:"TIMING ERRADO",pts:80,lesson:"Ideia boa, momento errado. <em>Paciencia estrategica e uma skill.</em>"}}}};
  
  function selectFlow(flow){
    SFX.init();SFX.play("select");haptic(30);currentFlow=flow;
    const cfg={seed:{c:"#00e832",i:"&#127793;",n:"SEED"},sprout:{c:"#00aaff",i:"&#127807;",n:"SPROUT"},flower:{c:"#9945ff",i:"&#127804;",n:"FLOWER"}};
    const d=cfg[flow],el=document.getElementById("flowIndicator");
    el.innerHTML="FLUXO: "+d.n+" "+d.i;el.style.color=d.c;
  }
  function loadFlow(flow){
    currentFlow=flow;ep=0;zi=0;wx=0;camX=0;trg={};
    if(flow==="seed"){ZONES=SEED_ZONES;STORY=SEED_STORY;WEVENTS=SEED_EVENTS;ZONE_NPCS=SEED_NPCS;QTE_CFG=SEED_QTE;epMax=3000;rnk="NEW STANDER";}
    else if(flow==="sprout"){ZONES=SPROUT_ZONES;STORY=SPROUT_STORY;WEVENTS=SPROUT_EVENTS;ZONE_NPCS=SPROUT_NPCS;QTE_CFG=SPROUT_QTE;epMax=10000;rnk="SEED ATIVO";}
    else{ZONES=FLOWER_ZONES;STORY=FLOWER_STORY;WEVENTS=FLOWER_EVENTS;ZONE_NPCS=FLOWER_NPCS;QTE_CFG=FLOWER_QTE;epMax=25000;rnk="SPROUT AVANCADO";}
    document.getElementById("hep").textContent="EP: 0";document.getElementById("efl").style.width="0%";
    document.getElementById("hrnk").textContent=rnk;document.getElementById("hzone").textContent=ZONES[0].name;
  }
  
  // ========== STATE ==========
  let ep=0,rnk="NEW STANDER",zi=0,wx=0,gs="title";
  let trg={},fc=0,bps=[];
  let currentFlow="seed",epMax=3000;
  const PL={x:100,y:0,gy:0,vx:0,vy:0,og:true,dir:1,pose:"idle",at:0};
  const GR=0.52,JP=-11.5,SP=3.4;
  const KS={},TO={l:false,r:false,j:false};
  
  document.addEventListener("keydown",e=>{KS[e.key]=true;if(e.key===" ")e.preventDefault();});
  document.addEventListener("keyup",e=>{KS[e.key]=false;});
  const isMob=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||innerWidth<700;
  if(isMob)document.getElementById("mctrl").style.display="flex";
  ["mbl","mbr","mbj"].forEach((id,i)=>{
    const ds=["l","r","j"],el=document.getElementById(id);
    el.addEventListener("touchstart",e=>{e.preventDefault();TO[ds[i]]=true;},{passive:false});
    el.addEventListener("touchend",e=>{e.preventDefault();TO[ds[i]]=false;},{passive:false});
  });
  
  // ========== PARTICLES ==========
  function initP(z){
    bps=[];const zd=ZONES[z];
    for(let i=0;i<70;i++)bps.push({t:"star",x:Math.random()*3000,y:Math.random()*H*.65,a:Math.random()*.7+.1,s:Math.random()*1.5+.3,tw:Math.random()*Math.PI*2});
    if(zd.par==="orbs")for(let i=0;i<10;i++)bps.push({t:"orb",x:Math.random()*2500,y:Math.random()*H*.6,r:Math.random()*50+15,a:.04,ph:Math.random()*Math.PI*2});
    if(zd.par==="panels")for(let i=0;i<8;i++)bps.push({t:"panel",x:i*300+100,y:H*.08+Math.random()*H*.35,w:130,h:65,a:.05,bl:Math.random()>.5,blph:Math.random()*Math.PI*2});
    if(zd.par==="sparks")for(let i=0;i<20;i++)bps.push({t:"spark",x:Math.random()*2500,y:H*.1+Math.random()*H*.6,vy:-(Math.random()*.8+.2),a:Math.random()*.3+.05,s:Math.random()*3+1});
    if(zd.par==="papers")for(let i=0;i<14;i++)bps.push({t:"paper",x:Math.random()*3000,y:Math.random()*H*.75,rot:Math.random()*Math.PI*2,vrot:Math.random()*.015-.007,vy:Math.random()*.25+.08,a:.07,w:22,h:14});
    if(zd.par==="stars")for(let i=0;i<30;i++)bps.push({t:"star2",x:Math.random()*3000,y:Math.random()*H*.7,a:Math.random()*.9+.1,s:Math.random()*3+1,tw:Math.random()*Math.PI*2});
  }
  
  function drawBG(){
    const z=ZONES[zi],[r,g,b]=h2r(z.accent);
    const grd=X.createLinearGradient(0,0,0,H*.8);
    z.sky.forEach((c,i)=>grd.addColorStop(i/2,c));
    X.fillStyle=grd;X.fillRect(0,0,W,H);
    bps.forEach(p=>{
      X.save();
      if(p.t==="star"){p.tw+=.015;const sx=((p.x-wx*.08)%W+W)%W;X.globalAlpha=p.a*(.7+.3*Math.sin(p.tw));X.fillStyle="#fff";X.beginPath();X.arc(sx,p.y,p.s,0,Math.PI*2);X.fill();}
      else if(p.t==="star2"){p.tw+=.03;const sx=((p.x-wx*.08)%W+W)%W;X.globalAlpha=p.a*(.5+.5*Math.sin(p.tw));X.fillStyle=z.accent;X.shadowColor=z.accent;X.shadowBlur=5;X.beginPath();X.arc(sx,p.y,p.s,0,Math.PI*2);X.fill();}
      else if(p.t==="orb"){p.ph+=.006;const ox=((p.x-wx*.12)%W+W)%W,oy=p.y+Math.sin(p.ph)*12;const gr=X.createRadialGradient(ox,oy,0,ox,oy,p.r);gr.addColorStop(0,"rgba(0,232,50,"+p.a*2.5+")");gr.addColorStop(1,"transparent");X.fillStyle=gr;X.beginPath();X.arc(ox,oy,p.r,0,Math.PI*2);X.fill();}
      else if(p.t==="panel"){p.blph+=.025;const px=((p.x-wx*.2)%W+W)%W;X.globalAlpha=p.a;X.strokeStyle=z.accent;X.lineWidth=1;X.strokeRect(px,p.y,p.w,p.h);X.globalAlpha=p.a*.4;X.fillStyle=z.accent;for(let row=0;row<4;row++)X.fillRect(px+6,p.y+7+row*12,(p.w-12)*(.2+Math.random()*.6),3);if(p.bl){X.globalAlpha=.12+.1*Math.sin(p.blph);X.fillStyle="#00ff80";X.beginPath();X.arc(px+p.w-10,p.y+9,4,0,Math.PI*2);X.fill();}}
      else if(p.t==="spark"){p.y+=p.vy;if(p.y<0)p.y=H;const sx=((p.x-wx*.15)%W+W)%W;X.globalAlpha=p.a;X.fillStyle=z.accent;X.beginPath();X.arc(sx,p.y,p.s,0,Math.PI*2);X.fill();}
      else if(p.t==="paper"){p.rot+=p.vrot;p.y+=p.vy;if(p.y>H)p.y=0;const px=((p.x-wx*.25)%W+W)%W;X.globalAlpha=p.a;X.translate(px,p.y);X.rotate(p.rot);X.fillStyle="rgba(255,255,255,.6)";X.fillRect(-p.w/2,-p.h/2,p.w,p.h);}
      X.restore();
    });
    const gY=H*.75,[r2,g2,b2]=[r,g,b];
    X.fillStyle=z.ground;X.fillRect(0,gY,W,H-gY);
    X.shadowColor=z.gline;X.shadowBlur=14;X.strokeStyle=z.gline;X.lineWidth=2;
    X.beginPath();X.moveTo(0,gY);X.lineTo(W,gY);X.stroke();X.shadowBlur=0;
    X.strokeStyle="rgba("+r2+","+g2+","+b2+",.06)";X.lineWidth=1;
    for(let gx=(-wx*.4%80+80)%80;gx<W;gx+=80){X.beginPath();X.moveTo(gx,gY);X.lineTo(gx,H);X.stroke();}
  }
  
  function drawWorld(){
    const gY=H*.75,z=ZONES[zi],[r,g,b]=h2r(z.accent);
    // World NPCs
    (ZONE_NPCS[zi]||[]).forEach(n=>{
      const sx=n.x-wx+W*.3;
      if(sx<-60||sx>W+60)return;
      X.save();X.translate(sx,gY-24);X.scale(1.4,1.4);drawChar(X,n.id,60,fc);X.restore();
      const nd=NPCS[n.id];
      X.font="bold 9px Orbitron,monospace";X.textAlign="center";
      X.fillStyle=nd?nd.color:"#fff";X.globalAlpha=.7+.2*Math.sin(fc*.04);
      X.fillText(nd?nd.name:n.id,sx,gY-90);X.globalAlpha=1;
    });
    // Events markers
    WEVENTS.filter(e=>e.z===zi).forEach(ev=>{
      const sx=ev.x-wx+W*.3;if(sx<-80||sx>W+80)return;
      if(ev.type==="portal"){
        const ph=fc*.04;
        X.save();X.translate(sx,gY-52);X.shadowColor=z.accent;X.shadowBlur=20+8*Math.sin(ph);
        X.strokeStyle=z.accent;X.lineWidth=3;X.beginPath();X.arc(0,0,30,0,Math.PI*2);X.stroke();
        X.rotate(ph*1.4);X.strokeStyle="rgba("+r+","+g+","+b+",.35)";X.lineWidth=1.2;X.setLineDash([6,6]);X.beginPath();X.arc(0,0,20,0,Math.PI*2);X.stroke();X.setLineDash([]);X.shadowBlur=0;X.restore();
        X.font="bold 9px Orbitron,monospace";X.textAlign="center";X.fillStyle=z.accent;X.globalAlpha=.6+.3*Math.sin(ph);X.fillText("PROXIMA ZONA",sx,gY-90);X.globalAlpha=1;
      } else if(!trg[ev.id]){
        const ph=fc*.05;
        X.save();X.translate(sx,gY-14);X.globalAlpha=.5+.3*Math.sin(ph);X.shadowColor=z.accent;X.shadowBlur=12;
        X.strokeStyle=z.accent;X.lineWidth=1.8;X.beginPath();X.arc(0,0,16,0,Math.PI*2);X.stroke();
        X.font="13px serif";X.textAlign="center";X.textBaseline="middle";X.fillStyle=z.accent;X.fillText("!",0,0);X.shadowBlur=0;X.restore();
      }
    });
  }
  
  function drawPlayer(){
    X.save();X.translate(PL.x,H*.75-24);if(PL.dir===-1)X.scale(-1,1);X.scale(1.6,1.6);dBase(X,PL.at,{});X.restore();
  }
  
  // ========== PHYSICS ==========
  function update(){
    if(gs==="paused")return;
    if(gs!=="playing")return;
    fc++;PL.at++;
    const ml=KS.ArrowLeft||KS.a||KS.A||TO.l;
    const mr=KS.ArrowRight||KS.d||KS.D||TO.r;
    const mj=KS[" "]||KS.ArrowUp||KS.w||TO.j;
    if(ml){PL.vx=-SP;PL.dir=-1;PL.pose="walk";}
    else if(mr){PL.vx=SP;PL.dir=1;PL.pose="walk";}
    else{PL.vx=0;PL.pose="idle";}
    if(mj&&PL.og){PL.vy=JP;PL.og=false;PL.pose="jump";SFX.play("jump");}
    PL.vy+=GR;PL.y+=PL.vy;PL.x+=PL.vx;
    const gY=H*.75-24;
    if(PL.y>=gY){PL.y=gY;PL.vy=0;PL.og=true;if(PL.pose==="jump")PL.pose="idle";}
    if(PL.x<80)PL.x=80;
    smoothCam();
    spawnTrail();
    checkLandingDust();
    checkTrg();
    if(fc%300===0)autoSave();
  }
  
  function checkTrg(){
    WEVENTS.filter(e=>e.z===zi).forEach(ev=>{
      const sx=ev.x-wx+W*.3;
      if(Math.abs(PL.x-sx)<55&&!trg[ev.id]){trg[ev.id]=true;fireEv(ev);}
    });
  }
  
  function fireEv(ev){
    if(ev.type==="portal"){enterZone(ev.to);return;}
    if(ev.type==="end"){showEnd();return;}
    if(ev.type==="dlg"){showDlg(STORY[ev.id],()=>{gs="playing";});return;}
    if(ev.type==="cho"){showDlg(null,()=>{const d=STORY[ev.id];showCho(d.text,d.opts,()=>{gs="playing";});});}
    if(ev.type==="qte"){showDlg(null,()=>{launchQTE(ev.qte);});}
  }
  
  // ========== DIALOG ==========
  let DQ=[],DI=0,DT=false,DTimer=null,DCB=null,DF="";
  
  function showDlg(lines,cb){
    if(!lines||!lines.length){if(cb)cb();return;}
    gs="dialog";DQ=lines;DI=0;DCB=cb;
    document.getElementById("dlg").classList.add("on");
    SFX.play("dlgOpen");
    runDL();
  }
  
  function runDL(){
    if(DI>=DQ.length){closeDL();if(DCB)DCB();return;}
    const ln=DQ[DI],nd=NPCS[ln.npc]||NPCS.sistema;
    setPortrait(ln.npc,nd.color,nd.name,nd.role);
    document.getElementById("dprog").textContent=(DI+1)+"/"+DQ.length;
    PL.pose=ln.npc==="stander"?"think":"idle";
    const txt=ln.text;DF=txt;
    document.getElementById("dsp").textContent="";
    document.getElementById("dcur").style.display="inline-block";
    DT=true;let i=0;
    if(DTimer)clearInterval(DTimer);
    DTimer=setInterval(()=>{document.getElementById("dsp").textContent+=txt[i++];SFX.play("type");if(i>=txt.length){clearInterval(DTimer);DT=false;}},22);
  }
  
  function advDL(){
    if(DT){clearInterval(DTimer);DT=false;document.getElementById("dsp").textContent=DF;SFX.play("click");return;}
    DI++;SFX.play("click");runDL();
  }
  function closeDL(){document.getElementById("dlg").classList.remove("on");PL.pose="idle";}
  document.getElementById("dlg").addEventListener("click",()=>{if(gs==="dialog")advDL();});
  
  // ========== CHOICES ==========
  function showCho(title,opts,cb){
    gs="choices";closeDL();
    const el=document.getElementById("cho");
    el.innerHTML=`<div style="font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--dim2);letter-spacing:2px;margin-bottom:4px">${title}</div>`;
    opts.forEach(o=>{
      const d=document.createElement("div");d.className="ch";
      const tc=o.tag==="DEEP"||o.tag==="GENUINO"||o.tag.includes("EP")?"tep":o.tag==="LEARN"?"tlrn":"trsk";
      d.innerHTML=`<span>${o.text}</span><span class="ctag ${tc}">${o.tag}</span>`;
      d.onclick=()=>{SFX.play("select");haptic(40);if(o.fn)o.fn();el.innerHTML="";el.classList.remove("on");if(cb)cb();};
      el.appendChild(d);
    });
    SFX.play("dlgOpen");
    el.classList.add("on");
  }
  
  // ========== QTE ==========
  function launchQTE(type){
    const cfg=QTE_CFG[type];
    gs="qte";
    const qel=document.getElementById("qte");qel.style.display="flex";
    document.getElementById("qres").style.display="none";
    document.getElementById("qtit").textContent=cfg.title;
    document.getElementById("qsub").textContent=cfg.sub;
    const mel=document.getElementById("qmen");
    if(cfg.mentor){
      mel.style.display="flex";
      const nd=NPCS[cfg.mentor.npc];
      const pc=mkPortrait(cfg.mentor.npc,44);
      mel.innerHTML=`<div class="qmport" style="border-color:${nd.color}"></div><div class="qmtxt">${cfg.mentor.text}</div>`;
      mel.querySelector(".qmport").appendChild(pc);
    } else mel.style.display="none";
    if(type==="trade")launchBar(cfg);else launchContent(cfg);
  }
  
  function launchBar(cfg){
    const qcon=document.getElementById("qcon");
    qcon.innerHTML=`<div class="qbw"><div class="qtrk"><div class="qzo" style="left:${cfg.ok.from}%;width:${cfg.ok.to-cfg.ok.from}%"></div><div class="qzp" style="left:${cfg.pf.from}%;width:${cfg.pf.to-cfg.pf.from}%"></div><div class="qndl" id="qndl" style="left:0%"></div></div><div class="qlbs"><span class="qlb">CEDO</span><span class="qlb o">OK</span><span class="qlb p">PERFEITO</span><span class="qlb o">OK</span><span class="qlb">TARDE</span></div></div><div class="qkh">ESPACO / TAP</div><div class="qtap" id="qtap" onclick="barPress()">TRADE</div>`;
    let pos=0,dir=1,done=false,last=performance.now();
    function animN(now){if(done)return;const dt=(now-last)/16;last=now;pos+=dir*1.6*dt;if(pos>=100){pos=100;dir=-1;}if(pos<=0){pos=0;dir=1;}const n=document.getElementById("qndl");if(n)n.style.left=pos+"%";requestAnimationFrame(animN);}
    requestAnimationFrame(animN);
    const sh=e=>{if(e.code==="Space"||e.key===" "){barPress();window.removeEventListener("keydown",sh);}};
    window.addEventListener("keydown",sh);
    window._qbs={done:false,pos:()=>pos,cfg,sh};
  }
  
  function barPress(){
    const s=window._qbs;if(!s||s.done)return;s.done=true;
    if(s.sh)window.removeEventListener("keydown",s.sh);
    const p=s.pos(),cfg=s.cfg;
    let res;
    if(p>=cfg.pf.from&&p<=cfg.pf.to)res={...cfg.res.pf};
    else if(p>=cfg.ok.from&&p<=cfg.ok.to)res={...cfg.res.ok};
    else res={...cfg.res.ms};
    addEP(res.pts);
    showQRes(res.icon,res.cls,res.title,res.lesson,"+"+res.pts+" EP",()=>{
      document.getElementById("qte").style.display="none";gs="playing";
      if(res.cls==="win"){PL.pose="celebrate";setTimeout(()=>PL.pose="idle",2200);}
      ntf("+"+res.pts+" EP -- "+res.title,"ep");
    });
  }
  
  function launchContent(cfg){
    const qcon=document.getElementById("qcon");
    let html=`<div class="ccards">`;
    cfg.opts.forEach((o,i)=>{
      const tc=o.q==="deep"?"cdp":"csh";
      html+=`<div class="ccard" onclick="cPick(${i})"><div class="clbl">${o.lbl}</div><div class="ctxt">${o.txt}</div><div class="cdtg ${tc}" style="display:none" id="ctg${i}">${o.q==="deep"?"DEEP":"HYPE"}</div></div>`;
    });
    html+=`</div><div class="qtmr" style="margin-top:8px"><div class="qtmf" id="ctmr" style="width:100%"></div></div>`;
    qcon.innerHTML=html;
    let ti=6;window._ctd=false;
    const tid=setInterval(()=>{ti--;const e=document.getElementById("ctmr");if(e)e.style.width=(ti/6*100)+"%";if(ti<=0){clearInterval(tid);if(!window._ctd)cPick(1);}},1000);
    window._ctid=tid;window._ccfg=cfg;
  }
  
  function cPick(idx){
    if(window._ctd)return;window._ctd=true;clearInterval(window._ctid);
    const cfg=window._ccfg,o=cfg.opts[idx],res=cfg.res[o.q];
    document.querySelectorAll(".ccard").forEach((c,i)=>{c.onclick=null;if(i!==idx)c.style.opacity=".35";});
    document.querySelectorAll(".ccard")[idx].classList.add(o.q==="deep"?"pg":"pb");
    document.getElementById("ctg"+idx).style.display="inline-block";
    addEP(o.pts);
    setTimeout(()=>{
      showQRes(res.icon,res.cls,res.title,res.lesson,"+"+o.pts+" EP",()=>{
        document.getElementById("qte").style.display="none";gs="playing";
        if(res.cls==="win"){PL.pose="celebrate";setTimeout(()=>PL.pose="idle",2200);}
        ntf("+"+o.pts+" EP -- "+res.title,"ep");
      });
    },600);
  }
  
  function showQRes(icon,cls,title,lesson,pts,cb){
    document.getElementById("qcon").style.display="none";
    document.getElementById("qmen").style.display="none";
    const el=document.getElementById("qres");
    document.getElementById("qrico").innerHTML=icon;
    document.getElementById("qrtit").textContent=title;
    document.getElementById("qrtit").className="qrtit "+cls;
    document.getElementById("qrles").innerHTML=lesson;
    document.getElementById("qrpts").textContent=pts+" ganhos";
    document.getElementById("qbok").onclick=()=>{el.style.display="none";document.getElementById("qcon").style.display="";document.getElementById("qmen").style.display="";if(cb)cb();};
    el.style.display="flex";
  }
  
  // ========== ZONE TRANSITION ==========
  function enterZone(to){
    if(to>=ZONES.length){showEnd();return;}
    gs="transition";camX=0;wx=0;PL.x=100;PL.y=PL.gy;
    SFX.play("portal");screenShake("shake-v",400);haptic(80);
    let a=0;const fade=document.createElement("canvas");
    fade.style.cssText="position:fixed;inset:0;z-index:150;pointer-events:none";
    fade.width=W;fade.height=H;document.body.appendChild(fade);
    const fc2=fade.getContext("2d");
    const out=()=>{a+=.04;fc2.clearRect(0,0,W,H);fc2.fillStyle="rgba(0,0,0,"+Math.min(a,1)+")";fc2.fillRect(0,0,W,H);
      if(a<1)requestAnimationFrame(out);
      else{zi=to;initP(to);document.getElementById("hzone").textContent=ZONES[to].name;showZT(to);SFX.play("whoosh");
        setTimeout(()=>{gs="playing";autoSave();const inn=()=>{a-=.04;fc2.clearRect(0,0,W,H);fc2.fillStyle="rgba(0,0,0,"+Math.max(a,0)+")";fc2.fillRect(0,0,W,H);if(a>0)requestAnimationFrame(inn);else fade.remove();};inn();},1800);}
    };out();
  }
  
  function showZT(idx){
    const z=ZONES[idx];
    document.getElementById("zep").textContent="ZONA "+(idx+1);
    document.getElementById("znm").textContent=z.name;
    document.getElementById("zsb").textContent=z.sub;
    const el=document.getElementById("ztit");el.classList.add("on");setTimeout(()=>el.classList.remove("on"),2200);
  }
  
  // ========== EP / RANK ==========
  let prevRank="";
  function addEP(n){
    ep=Math.min(ep+n,epMax);
    document.getElementById("hep").textContent="EP: "+ep;
    const bar=document.getElementById("efl");bar.style.width=(ep/epMax*100)+"%";
    bar.classList.add("efl-shimmer");setTimeout(()=>bar.classList.remove("efl-shimmer"),3000);
    if(n>0){SFX.play("ep");screenShake("shake-h",300);haptic(50);floatEP(n,PL.x-20,H*.6);epBurst(PL.x,H*.68,n>100?18:10);triggerCombo();}
    prevRank=rnk;
    if(currentFlow==="seed"){
      if(ep<500)setRank("NEW STANDER");
      else if(ep<1000)setRank("ACTIVE MEMBER");
      else if(ep<2000)setRank("CONSISTENT");
      else if(ep<3000)setRank("SEED CANDIDATE");
    }else if(currentFlow==="sprout"){
      if(ep<6000)setRank("SQUAD MEMBER");
      else if(ep<8000)setRank("CONTRIBUTOR");
      else if(ep<10000)setRank("SQUAD LEAD");
    }else if(currentFlow==="flower"){
      if(ep<15000)setRank("SENIOR FLOWER");
      else if(ep<20000)setRank("COMMUNITY PILLAR");
      else if(ep<25000)setRank("LEGENDARY");
    }
  }
  function setRank(r){
    if(r!==rnk){SFX.play("rank");const el=document.getElementById("hrnk");el.classList.remove("rank-glow");void el.offsetWidth;el.classList.add("rank-glow");setTimeout(()=>el.classList.remove("rank-glow"),800);}
    rnk=r;document.getElementById("hrnk").textContent=r;
  }
  function ntf(msg,type){
    const n=document.createElement("div");n.className="ntf "+type;n.textContent=msg;
    document.body.appendChild(n);setTimeout(()=>{n.style.opacity="0";n.style.transform="translateX(20px)";},2400);setTimeout(()=>n.remove(),3000);
  }
  
  // ========== END SCREEN ==========
  function showEnd(){
    gs="end";clearSave();SFX.play("fanfare");haptic(200);
    const el=document.getElementById("end");el.style.display="flex";
    for(let i=0;i<60;i++){const p=document.createElement("div");const sz=3+Math.random()*8;const cols=["#00e832","#ffe600","#00b8d4","#ff9900","#fff","#9945ff"];p.style.cssText="position:absolute;border-radius:50%;width:"+sz+"px;height:"+sz+"px;background:"+cols[Math.floor(Math.random()*cols.length)]+";left:"+Math.random()*100+"%;top:"+Math.random()*40+"%;animation:pfx "+(2+Math.random()*2)+"s ease-out "+(Math.random()*2)+"s forwards;pointer-events:none";el.appendChild(p);}
    const castIds=["mira","arttifex","gaboo","jovan","aifilho","dias","dan","victor"];
    const castHtml=castIds.map(id=>{const n=NPCS[id];return`<div style="text-align:center"><div id="ep_${id}" style="width:44px;height:44px;border-radius:50%;overflow:hidden;border:1.5px solid ${n.color};background:var(--bg2);margin:0 auto 3px"></div><div style="font-family:'Share Tech Mono',monospace;font-size:8px;color:${n.color};letter-spacing:1px">${id==="victor"?"VICTOR":n.name}</div></div>`;}).join("");
    el.innerHTML+=`<style>@keyframes pfx{0%{transform:translateY(0);opacity:1}100%{transform:translateY(80vh);opacity:0}}@keyframes flt{from{transform:translateY(0)}to{transform:translateY(-10px)}}</style>
      <div style="font-family:'Share Tech Mono',monospace;font-size:9px;color:rgba(0,232,50,.5);letter-spacing:4px">EPISODIO I -- COMPLETO</div>
      <canvas id="esc" width="100" height="100" style="filter:drop-shadow(0 0 22px rgba(0,232,50,.8));animation:flt 2s ease-in-out infinite alternate"></canvas>
      <div style="font-family:Orbitron,monospace;font-size:clamp(18px,4vw,34px);font-weight:900;color:#00e832;text-shadow:0 0 30px rgba(0,232,50,.6);letter-spacing:4px">EVOLUCAO!</div>
      <div style="font-family:Orbitron,monospace;font-size:clamp(22px,5vw,42px);font-weight:900;color:#ffe600;text-shadow:0 0 20px rgba(255,230,0,.5);letter-spacing:6px">@SEED</div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:#3a5060;line-height:2;max-width:380px">ENGAGE POINTS: <span style="color:#00e832">${ep}</span>${ep>=2500?'<br><span style="color:#ffe600">&#9733; CANDIDATO DESTACADO</span>':''}<br>Personagens encontrados:</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin:4px 0">${castHtml}</div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:9px;color:rgba(255,230,0,.5);letter-spacing:3px;margin-top:4px">ATO II EM BREVE</div>
      <button onclick="location.reload()" style="font-family:Orbitron,monospace;font-size:11px;letter-spacing:2px;padding:12px 38px;background:linear-gradient(135deg,#00e832,#00b020);color:#04080f;border:none;cursor:pointer;border-radius:4px;margin-top:8px">JOGAR NOVAMENTE</button>
      <div style="font-family:'Share Tech Mono',monospace;font-size:8px;color:rgba(0,232,50,.2);margin-top:6px;letter-spacing:2px">standx.io</div>`;
    castIds.forEach(id=>{const w=document.getElementById("ep_"+id);if(w){w.appendChild(mkPortrait(id,44));}});
    const esc=document.getElementById("esc");if(esc){let ef=0;(function ea(){const ec=esc.getContext("2d");ec.clearRect(0,0,100,100);drawChar(ec,"stander",100,ef++);requestAnimationFrame(ea);})();}
  }
  
  // ========== RENDER ==========
  function render(){X.clearRect(0,0,W,H);drawBG();drawWorld();drawPlayer();requestAnimationFrame(loop);}
  function loop(){update();render();}
  
  // ========== TITLE SETUP ==========
  function setupTitle(){
    const tc=document.getElementById("tmsc");
    if(tc){let tf=0;(function ta(){const tctx=tc.getContext("2d");tctx.clearRect(0,0,80,80);drawChar(tctx,"stander",80,tf++);requestAnimationFrame(ta);})();}
    const cc=document.getElementById("tcast");
    if(cc){["mira","arttifex","gaboo","jovan","aifilho","dias","dan","victor"].forEach(id=>{
      const wrap=document.createElement("div");wrap.className="tci";
      const nd=NPCS[id];wrap.style.borderColor=nd.color;
      wrap.appendChild(mkPortrait(id,44));cc.appendChild(wrap);
    });}
  }
  
  document.getElementById("tbtn").addEventListener("click",()=>{
    SFX.init();SFX.play("select");
    document.getElementById("hubDetail").classList.remove("on");
    document.getElementById("hub").classList.remove("on");
    document.getElementById("titl").style.display="none";
    document.getElementById("hud").classList.add("on");
    document.getElementById("pauseBtn").classList.add("on");
    if(isMob)document.getElementById("mctrl").style.display="flex";
    
    // Apply selected flow
    loadFlow(currentFlow);
  
    const saved=autoLoad();
    if(saved&&saved!=="playing")gs=saved; // allow resume if saved
    else gs="playing";
    
    resize();PL.gy=H*.73;PL.y=PL.gy;initP(zi);showZT(zi);loop();
  });
  
  // Pause with Escape key
  document.addEventListener("keydown",e=>{if(e.key==="Escape")togglePause();});
  
  resize();setupTitle();

  Object.assign(window, {
    SFX,
    togglePause,
    skipDlg,
    openHub,
    openHubDetail,
    closeHub,
    closeHubDetail,
    selectFlow,
    clearSave,
    barPress,
    cPick,
  });

  return () => {};
}
