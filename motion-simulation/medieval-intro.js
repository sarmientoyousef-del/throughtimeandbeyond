(()=>{'use strict';
if(document.body.dataset.era!=='medieval')return;
const overlay=document.createElement('section');overlay.id='medievalOnboarding';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Peter’s Medieval Era visual novel');overlay.innerHTML=`
<div class="med-vn-shell" id="medVnShell">
  <section class="med-vn-stage" id="medVnStage" data-scene="classroom" aria-label="Visual novel scene">
    <div class="vn-window"></div><div class="vn-board"><span>PROJECTILE MOTION</span><i>vₓ = v cos θ</i><i>y = vᵧt − ½gt²</i></div><div class="vn-desk"></div>
    <div class="vn-machine"><i></i><b></b><span>TIME MACHINE</span></div><div class="vn-clock"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42"/><path d="M50 50V23M50 50l19 10"/></svg></div>
    <div class="vn-space"><div class="vn-black-hole"></div><i class="star star-a"></i><i class="star star-b"></i><i class="star star-c"></i><i class="star star-d"></i><i class="star star-e"></i></div>
    <div class="vn-hills"></div><div class="vn-castle"><i></i><b></b><span></span></div>
    <div class="vn-scene-title" id="vnSceneTitle">AFTER SCHOOL · GEN SCI CLASSROOM</div>
    <img class="peter-sprite" id="peterSprite" src="assets/characters/peter-neutral.png" alt="Peter, your classmate" />
    <div class="vn-dialogue" id="vnDialogue" hidden>
      <div class="vn-dialogue-top"><span class="vn-speaker" id="vnSpeaker">Peter</span><span class="vn-counter" id="vnCounter">01 / 16</span></div>
      <p id="vnText" aria-live="polite"></p>
      <div class="vn-dialogue-bottom"><span class="vn-hint">CLICK OR PRESS ENTER TO CONTINUE</span><button class="vn-button" id="vnNext" type="button">Continue <b>›</b></button></div>
    </div>
  </section>
  <aside class="med-vn-side">
    <section class="med-card" id="medProfile"><span class="kicker">ROYAL ACADEMY · VISITOR REGISTRY</span><h1>Before we begin…</h1><p>Tell us who is stepping into the story. Your name will be used for your dialogue.</p>
      <form class="med-form" id="medProfileForm">
        <label>Your name<input name="name" id="travelerName" maxlength="40" autocomplete="given-name" placeholder="Enter your name" required></label>
        <label>Age<input name="age" type="number" min="1" max="120" step="1" inputmode="numeric" placeholder="Age" required></label>
        <label>Gender<select name="gender" required><option value="" disabled selected>Select one</option><option>Woman</option><option>Man</option><option>Non-binary</option><option>Prefer not to say</option><option>Self-describe</option></select></label>
        <label>Status / role<select name="status" required><option value="" disabled selected>Select one</option><option>Student</option><option>Teacher</option><option>Researcher</option><option>History enthusiast</option><option>Curious explorer</option><option>Other</option></select></label>
        <p class="privacy-note">These details personalize this visit only. They are not sent anywhere or saved when you leave.</p><button class="med-button" type="submit">Meet Peter →</button>
      </form>
    </section>
    <section class="med-card" id="medPeter" hidden><span class="kicker">UNEXPECTED TIMELINE ECHO</span><div class="egg-mark" aria-hidden="true">✦</div><h2>Peter, a message from the inventor!</h2><p>“Tell them this program deserves a perfect rating—10 out of 10!” The scientist is clearly proud of the time machine.</p><div class="card-actions"><button class="med-button" id="peterRate" type="button">I rate it 10/10 ✦</button><button class="med-button secondary" id="peterSkip" type="button">Continue either way</button></div></section>
    <section class="med-card" id="medGuide" hidden><span class="kicker">FIELD GUIDE · MEDIEVAL PERIOD</span><h1 id="guideTitle">Welcome, traveler.</h1><p id="travelerSummary" class="med-profile-summary"></p><div class="vn-objective"><small>YOUR FIRST OBJECTIVE</small><strong>Ring the castle bell at 55 m with a projectile.</strong></div><p>The range is your laboratory. Test how angle, launch strength, gravity, and terrain shape each result.</p><div class="med-steps"><div class="med-step"><b>1</b><div><strong>Choose a motion mode</strong><span>Projectile mode launches a shot. Linear mode runs the messenger along a measured course.</span></div></div><div class="med-step"><b>2</b><div><strong>Set your variables</strong><span>Adjust angle and launcher strength, or enter acceleration, time, and velocity for the horse trial.</span></div></div><div class="med-step"><b>3</b><div><strong>Run and compare</strong><span>Launch or ride, then check the field journal for the graph, equations, and measured outcome.</span></div></div></div><button class="med-button" id="startMedieval" type="button">Begin the simulation →</button></section>
  </aside>
  <button class="vn-skip" id="vnSkip" type="button" hidden>Skip story</button>
</div>`;
document.body.append(overlay);
const $=id=>document.getElementById(id),main=document.querySelector('body > main.shell'),shell=$('medVnShell'),stage=$('medVnStage'),sprite=$('peterSprite'),dialogue=$('vnDialogue'),next=$('vnNext'),skip=$('vnSkip'),profile=$('medProfile'),egg=$('medPeter'),guide=$('medGuide');
if(main)main.inert=true;
let userName='',travelerSummary='',lineIndex=-1,typingTimer=null,typing=false;
const lines=[
 {who:'player',text:'Peter, I can’t understand this! This sucks!'},
 {who:'peter',text:'C’mon, this is so easy! You just need the variables and figure out the correct equation.'},
 {who:'player',text:'But I’m never gonna use this in the real world! What’s the point?'},
 {who:'peter',text:'Hey, you’re gonna regret saying that. Physics plays a super important role in the real world. Rollercoasters, cars, basketballs… they all need physics to work!'},
 {who:'player',text:'Physics was only invented in the 1800s, so we never needed it if people have always existed!'},
 {who:'peter',text:'People have been applying physics across time, they just had a different name for it. It has always existed.'},
 {who:'player',text:'That’s dumb. How can you prove that?'},
 {who:'peter',text:'I made a time machine. So we can see for ourselves if people in the past really did use physics!'},
 {who:'player',text:'How?! What?!'},
 {who:'peter',text:'Hey, you promised that you were gonna try out my time machine with me. Did you know time traveling requires some formulas for projectile motion?'},
 {who:'player',text:'No…? How? Why?'},
 {who:'peter',text:'I don’t know either. But c’mon, let’s try out my time machine!'},
 {who:'player',text:'How did you even create a time machine? This is dumb! It’s not gonna work!'},
 {who:'peter',text:'We gotta try!'},
 {who:'narrator',scene:'space',text:'Peter switches on the time machine. A blinding flash erupts. The two of you are swallowed by a giant black hole and carried through a vast space-time vacuum…'},
 {who:'narrator',scene:'medieval',text:'You have been successfully transported through time, and wake up in… the medieval times? The smell is pungent, the sun is bright, and the townsmen are all staring at you strangely. They’re wearing old-fashioned clothes, and none of them look like they’re from 2026.'},
 {who:'narrator',text:'You look around to find a familiar face or building. And in the crowd, you see your friend, Peter. But Peter is wearing the same old-fashioned tunic that the other medieval people are wearing.'},
 {who:'player',text:'Peter! Thank god you’re here…'},
 {who:'peter',text:'Peter? I’m Petrus Jaycintherus Coriolanus the III.'},
 {who:'player',text:'What?! Are you joking?! What year are we in?'},
 {who:'peter',text:'I’m kidding. It’s 1638. We time traveled.'},
 {who:'player',text:'What?!'},
 {who:'peter',text:'Listen, [Player], in order for us to go back to the present time, we have to properly understand and simulate physics – the way physics has been used throughout history.'},
 {who:'inner',text:'I was then dragged into throwing stuff. I needed to hit the goal… I guess Peter was right, you DO need physics in the real world. It even existed in medieval times.'}
];
function beginStory(){profile.hidden=egg.hidden=true;guide.hidden=true;shell.classList.add('visual-novel');stage.dataset.scene='classroom';$('vnSceneTitle').textContent='AFTER SCHOOL · GEN SCI CLASSROOM';$('peterSprite').style.display='';dialogue.hidden=false;skip.hidden=false;lineIndex=-1;advanceLine();}
function showGuide(){clearInterval(typingTimer);typing=false;dialogue.hidden=true;skip.hidden=true;shell.classList.remove('visual-novel');stage.dataset.scene='medieval';$('vnSceneTitle').textContent='THE MEDIEVAL PERIOD · ROYAL ACADEMY';sprite.src='assets/characters/peter-medieval-neutral.png';sprite.alt='Peter in his Medieval outfit, listening';guide.hidden=false;$('guideTitle').textContent='Welcome, '+userName+'!';$('travelerSummary').textContent=travelerSummary;$('startMedieval').focus()}
function advanceLine(){if(typing){clearInterval(typingTimer);typing=false;const line=lines[lineIndex];$('vnText').textContent=line.text.replaceAll('[Player]',userName);next.innerHTML='Continue <b>›</b>';return}lineIndex++;if(lineIndex>=lines.length){showGuide();return}const line=lines[lineIndex];if(line.scene){stage.dataset.scene=line.scene;$('vnSceneTitle').textContent=line.scene==='space'?'THE SPACE-TIME VACUUM':'THE MEDIEVAL PERIOD · ARRIVAL'}$('vnSpeaker').textContent=line.who==='player'?userName:line.who==='inner'?userName+' · INSIDE VOICE':line.who==='peter'?'Peter':'NARRATION';$('vnText').textContent='';$('vnCounter').textContent=String(lineIndex+1).padStart(2,'0')+' / '+String(lines.length).padStart(2,'0');const medievalLook=stage.dataset.scene==='medieval';sprite.src=line.who==='peter'?(medievalLook?'assets/characters/peter-medieval-talking.png':'assets/characters/peter-talking.png'):(medievalLook?'assets/characters/peter-medieval-neutral.png':'assets/characters/peter-neutral.png');sprite.alt=line.who==='peter'?(medievalLook?'Peter is talking in his Medieval outfit':'Peter is talking'):(medievalLook?'Peter in his Medieval outfit is listening':'Peter is listening');next.innerHTML='Skip text <b>›</b>';typing=true;const displayedText=line.text.replaceAll('[Player]',userName);let char=0;typingTimer=setInterval(()=>{char++;$('vnText').textContent=displayedText.slice(0,char);if(char>=displayedText.length){clearInterval(typingTimer);typing=false;next.innerHTML='Continue <b>›</b>'}},18)}
skip.addEventListener('click',showGuide);next.addEventListener('click',advanceLine);
$('medVnStage').addEventListener('click',event=>{if(dialogue.hidden||event.target.closest('button'))return;advanceLine()});
$('medProfileForm').addEventListener('submit',event=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;const form=new FormData(event.currentTarget);userName=String(form.get('name')).trim();travelerSummary=[form.get('age')+' years',form.get('gender'),form.get('status')].join(' · ');profile.hidden=true;if(userName.toLocaleLowerCase()==='peter'){sprite.src='assets/characters/peter-talking.png';sprite.alt='Peter is speaking';egg.hidden=false;$('peterRate').focus()}else beginStory()});
$('peterRate').addEventListener('click',beginStory);$('peterSkip').addEventListener('click',beginStory);
$('startMedieval').addEventListener('click',()=>{overlay.hidden=true;overlay.setAttribute('aria-modal','false');if(main)main.inert=false;document.body.classList.add('medieval-onboarding-complete');const canvas=document.getElementById('scene');canvas?.setAttribute('tabindex','0');canvas?.focus()});
window.addEventListener('keydown',event=>{if(overlay.hidden)return;if(event.target.closest('input,select,textarea'))return;if(event.key==='Tab')return;if((event.key==='Enter'||event.key===' ')&&!dialogue.hidden&&!event.target.closest('button')){event.preventDefault();advanceLine();return}if(event.key==='Escape'&&!skip.hidden){event.preventDefault();showGuide();return}if(['w','a','s','d','y'].includes(event.key.toLowerCase())||event.key===' '){event.preventDefault();event.stopImmediatePropagation()}},true);
})();
