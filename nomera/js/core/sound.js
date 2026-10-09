window.NM = window.NM || {};
NM.sound={
  ctx:null,
  ensure(){ if(!this.ctx){try{this.ctx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}
    if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume(); },
  muted(){return NM.save&&NM.save.data&&NM.save.data.muted;},
  tone(f,d,type='sine',v=.12,delay=0,slide=0){
    if(this.muted()||!this.ctx)return;
    try{const t=this.ctx.currentTime+delay,o=this.ctx.createOscillator(),g=this.ctx.createGain();
      o.type=type;o.frequency.setValueAtTime(f,t);
      if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(40,f+slide),t+d);
      g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);
      o.connect(g).connect(this.ctx.destination);o.start(t);o.stop(t+d+.06);}catch(e){}
  },
  tick(v=.04){this.tone(1800+Math.random()*400,.022,'square',v);},
  hit(i=0){this.tone(520+i*60,.07,'square',.09);},
  cash(){this.tone(1046,.09,'triangle',.14);this.tone(1568,.13,'triangle',.12,.07);},
  err(){this.tone(150,.22,'sawtooth',.1);},
  click(){this.tone(320,.04,'triangle',.06);},
  win(idx){const notes=[523,659,784,1046,1318];
    for(let i=0;i<Math.min(idx+2,5);i++)this.tone(notes[i],.15,'triangle',.12,i*.09);
    if(idx>=3)this.tone(1568,.35,'triangle',.11,(idx+2)*.09);}
};
document.addEventListener('pointerdown',()=>NM.sound.ensure());
