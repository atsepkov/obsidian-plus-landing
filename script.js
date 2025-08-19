    // === Dark mode: auto + toggle + persisted ===
    (function() {
      const root = document.documentElement;
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.dataset.theme = saved || (prefersDark ? 'dark' : 'light');
      const t = document.getElementById('themeToggle');
      if (t) t.addEventListener('click', (e) => { e.preventDefault(); toggleTheme(); });
      function toggleTheme(){ root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('theme', root.dataset.theme); }
      window.addEventListener('keydown', (ev) => { if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'd') { toggleTheme(); ev.preventDefault(); } });
    })();
    
    // === Elements ===
    const includePadEl = document.getElementById('includePad');
    const containerEl = document.getElementById('viewContainer');
    const scenarioTabs = document.querySelectorAll('.scenario-tab');
    const scenarioDescEl = document.getElementById('scenarioDesc');
    const overlay = {
      token: function(stream) {
        if (stream.sol()) {
          stream.eatSpace();
          const ch = stream.peek();
          if (ch === '+' || ch === '-' || ch === '*') {
            stream.next();
            return ch === '+' ? 'bullet-plus' : (ch === '*' ? 'bullet-star' : 'bullet-dash');
          }
        }
        const m = stream.match(/#[A-Za-z0-9_-]+/);
        if (m) return 'tag tag-' + m[0].slice(1).toLowerCase();
        stream.next();
        return null;
      }
    };
const cm = initEditor('noteInput', 'editorWrap');
cm.on('change', ()=>requestAnimationFrame(render));
cm.on('viewportChange', ()=>{ styleEditorTags(cm); styleBulletLines(cm); styleHeadings(cm); updateEditorWidgets(cm); });

let dashState = { Todos:true, Payments:false, Music:true, Monitoring:false };

    // === Notes ===
    const SCENARIOS = {
      dashboard: {
      'Daily Note':
`# 2015-08-17
Dump anything that comes to mind into your daily notes, all information will self-organize into a database:
- 15 Boardwalk: guest-reported issues
	- [ ] #todo check leak under fridge
		- guest says they saw a small puddle
	- [ ] #todo restock coffee and paper towels

- [ ] #todo 5 Bow St: replace smoke detectors
	- had false alarm recently
	- they're ~8 years old now, time to update

Personal assistant directly in your notebook that pulls the context from your notes:
- I need to estimate construction costs for a 2000 sqft house in 02465 zip
	- [x] #chatgpt can you ballpark this? ✅ 2025-08-17✓✓
	    + Construction costs for a 2000 sqft house in zip code 02465 (Newton, MA) can range **$400,000–$800,000+** depending on finishes and labor.
	        + Low-end: Basic finishes, modular/prefab (~$200/sqft)
	        + Mid-range: Custom build with standard materials (~$300–$400/sqft)
	        + High-end: Luxury finishes, complex design (~$400+/sqft)
	    + Factors impacting cost:
	        + Land/prep (steep lots or rocky soil increase expenses)
	        + Local permitting fees and labor rates (Boston area is ~20% above national avg)
	        + Material choices (e.g., hardwood vs. laminate)
	    + Verify with local contractors for precise bids.

Send out rental applications directly from your notebook:
- [x] #application bcollins@gmail.com ✅ 2025-08-17
  + email: bcollins@gmail.com
  + google doc: https://docs.google.com/document/d/1TfG2Fg0Hl2u3q4p5r6s7t8u9v0a1b2c3/edit
  + [ ] #waiting bcollins@gmail.com application

Document music that helps you focus:
- #music Midnight Flow Music — Night Bass
	- https://www.youtube.com/watch?v=AVmyklX6LEA
	- calm, focus
	- ![[music_screenshot1.png]]`,

      'Transaction Log':
`# tx-2015-08-17
Transaction logs are auto-populated from external APIs + IoT devices. They're like a "Daily Note" but for your systems. This is how you keep track of payments, check-ins, and other transactions.

The data coming from the outside world is color-coded to avoid confusion with your personal notes:
- your notes are white
+ responses from outside APIs (or people) are blue
* errors are red

+ #check-in 15 Boardwalk: Matt Smith ⏳ 2025-08-17 
	+ contact info: 617-123-4567
	+ check-out: [[2025-08-19]]
+ #payment Jordan Perkins: $2000 (Gmail sync)
+ #payment Maryann Cooper: $1385 (Plaid sync)
	-  said she will Zelle the rest by Monday
		- [ ] #todo ping about remaining payment
+ #iot 5 Bow St: abnormal moisture levels under kitchen sink
        - [ ] #todo check kitchen sink for leaks
+ #iot 16 Pearl St: abnormally high electric usage (60kWh/day)
        - probably AC
* #iot 5 Bow St: lightbulb offline (rear hallway)
+ #iot 22 Oak Ridge: basement humidity 80%
        - [ ] #todo inspect dehumidifier
+ #iot 10 Market St: front door left ajar
        - [ ] #todo call tenant`,

      'Project Note':

`# 41 Main St Rehab
This page is dedicated to a specific project, it's not part of the daily notes. The content can be in whatever format you want, only tags you assign meaning to get interpreted.

- 41 Main St Rehab:
  - [x] #todo apply for sprinkler permits ✅ 2025-08-10
  - [ ] #todo run electrical
  - [x] #pay $3500 (Mario - plumbing) ✅ 2025-08-17
  - [ ] #urgent extend building permit`,

      'Music Library':
  `- #music Hypermind Music — Limitless Productivity Playlist
        - https://www.youtube.com/watch?v=4MFOBeUCPkw
        - coding, focus, chill
        - ![[music_screenshot2.png]]
  - #music Night at Work | Instrumental Chill Music Mix
        - https://www.youtube.com/watch?v=n9Y2Eb4BaSg
        - optimistic, calm, focus
        - ~8min: Audial - Silhouette
        - ![[music_screenshot3.png]]
  - #music Deadline Mode • Focus Beats to Crush Your To-Do List | Chillstep Mix
        - https://www.youtube.com/watch?v=lwXCyKI845E
        - relaxing, focus, ambient
        - ![[music_screenshot4.png]]`
      }
    };
    let currentScenario = 'dashboard';
    let NOTES = JSON.parse(JSON.stringify(SCENARIOS[currentScenario]));
    let currentNote = 'Daily Note';
    const noteTabs = document.querySelectorAll('.note-tab[data-note]');
    const SCENARIO_DESCS = {
      dashboard: `Jordan manages several rentals. He spends a lot of time on the go, with his phone. He's a big proponent of GTD, but struggled to implement it in an electronic form. No tool was flexible enough, and most fell apart if the system wasn't followed religiously. With Obsidian+, the effort of organizing data is offloaded from the user to the system. Now Jordan uses his daily note as his <strong style="color:var(--accent);">inbox</strong> basket. His properties are his <strong style="color:var(--accent);">projects</strong>, marking something with a tag flags it important, everything else becomes <strong style="color:var(--accent);">reference</strong>. Jordan can quickly see who paid the rent and if there is a water leak. Problems surface to the top before they become emergencies.`,
      handoff: `Alice and Bob are coworkers sharing linked notebooks. They routinely coordinate on tasks by sending them to each other. Try playing around with the notebooks below. You can add a message before sending a response, or cancel a task to see how the other notebook responds (to cancel a task, click it twice).`
    };
    scenarioDescEl.innerHTML = SCENARIO_DESCS.dashboard;
    scenarioTabs.forEach(tab=>{
      tab.addEventListener('click', ()=>{
        const name = tab.dataset.scenario;
        document.querySelectorAll('.scenario').forEach(s=>{
          s.style.display = s.classList.contains('scenario-'+name) ? 'grid' : 'none';
        });
        scenarioTabs.forEach(t=>t.classList.toggle('active', t===tab));
        scenarioDescEl.innerHTML = SCENARIO_DESCS[name];
        if(name==='handoff' && typeof initHandoff === 'function') initHandoff();
      });
    });

    function parseTree(text){
      const root = [];
      const stack = [{ indent:-1, children:root }];
      const lines = (text||'').split(/\r?\n/);
      lines.forEach((line, idx)=>{
        if(!line.trim()) return;
        const indent = line.match(/^\s*/)[0].length;
        const clean = line.trim();
        const bulletChar = /^[-+*]/.test(clean) ? clean.charAt(0) : '';
        const statusChar = (clean.match(/^[-+*]\s*\[( |x|-)\]/i)||[])[1] || ' ';
        const status = statusChar === 'x' ? 'done' : statusChar === '-' ? 'cancelled' : 'open';
        const tags = Array.from(clean.matchAll(/#([A-Za-z0-9_-]+)/g)).map(m=>m[1].toLowerCase());
        const due = (clean.match(/(?:\ud83d\udcc5|✅|❌|⏳)\s*(202[4-9]-[01]\d-[0-3]\d)/)||[])[1]
          || (clean.match(/\[\[(202[4-9]-[01]\d-[0-3]\d)\]\]/)||[])[1]
          || (clean.match(/\b(202[4-9]-[01]\d-[0-3]\d)\b/)||[])[1]
          || '';
        const url = (clean.match(/https?:\/\/\S+/)||[])[0] || '';
        const textContent = clean
          .replace(/^[-+*]\s*\[(?:x|\s|-)\]\s*/i,'')
          .replace(/^[-+*]\s*/,'')
          .replace(/#[A-Za-z0-9_-]+/g,'')
          .replace(/(?:\ud83d\udcc5|✅|❌|⏳)\s*[0-9\/\-]+/g,'')
          .replace(/\[\[202[4-9]-[01]\d-[0-3]\d\]\]/g,'')
          .replace(url,'')
          .replace(/\s{2,}/g,' ').trim();
        const node = { bullet:bulletChar, text:textContent, tags, due, url, status, line:idx, children:[] };
        while(stack.length && indent <= stack[stack.length-1].indent) stack.pop();
        stack[stack.length-1].children.push(node);
        stack.push({ indent, children: node.children });
      });
      return root;
    }

    function collectFromNote(name, text){
      const out = [];
      function walk(nodes, ctx){
        nodes.forEach(n=>{
          const nextCtx = n.text.includes(':') ? n.text.split(':')[0].trim() : ctx;
          const children = n.children;
          let title = n.text;
          if(ctx && n.tags.some(t=>t==='todo' || t==='urgent')){
            title = `${ctx}: ${title}`;
          }
          if(n.tags.length){
            out.push({
              title,
              tags:n.tags,
              due:n.due,
              url:n.url,
              status:n.status,
              line:n.line,
              bullet:n.bullet,
              view:n.tags.includes('music') ? 'music' : (n.tags.includes('iot') ? 'monitoring' : (n.tags.some(t=>t==='payment' || t==='pay') ? 'payment' : 'task')),
              source:name,
              children
            });
          }
          if(n.children.length) walk(n.children, nextCtx);
        });
      }
      walk(parseTree(text), '');
      return out;
    }

    function currentItems(){
      const items = Object.keys(NOTES).flatMap(n=>collectFromNote(n, n===currentNote ? cm.getValue() : NOTES[n]));
      return items;
    }

    const TAG_COLORS = {
      todo:   { bg:'#4b5563', fg:'#ffffff' },
      waiting:{ bg:'#6b7280', fg:'#ffffff' },
      urgent: { bg:'#ef4444', fg:'#ffffff' },
      music:  { bg:'#6366f1', fg:'#ffffff' },
      payment:{ bg:'#10b981', fg:'#ffffff' },
      pay:    { bg:'#10b981', fg:'#ffffff' },
      'check-in':{ bg:'#0ea5e9', fg:'#ffffff' },
      iot:    { bg:'#0ea5e9', fg:'#ffffff' },
      chatgpt:{ bg:'#8b5cf6', fg:'#ffffff' },
      alice:  { bg:'#ec4899', fg:'#ffffff' },
      bob:    { bg:'#f59e0b', fg:'#ffffff' },
      application:{ bg:'green', fg:'#ffffff' }
    };

    const TAG_STYLE_EL = document.createElement('style');
    TAG_STYLE_EL.textContent = Object.entries(TAG_COLORS)
      .map(([k,{bg,fg}])=>`.cm-s-default .cm-tag-${k}, .cm-tag-${k}{background:${bg};color:${fg} !important;}`)
      .join('');
    document.head.appendChild(TAG_STYLE_EL);

    function tagStyles(str){
      return TAG_COLORS[str.toLowerCase()] || { bg:'#94a3b8', fg:'#ffffff' };
    }

    function badge(tag){
      const clean = tag.replace('#','').toLowerCase();
      const {bg,fg} = tagStyles(clean);
      return `<span class="badge" style="background:${bg};color:${fg};">${tag}</span>`;
    }

    function setBadge(wrap, count){
      const el = wrap.querySelector('.count-badge');
      if(!el) return;
      el.textContent = count;
      el.dataset.count = count;
    }

    function updateBadgeVisibility(wrap){
      const el = wrap.querySelector('.count-badge');
      if(!el) return;
      const count = Number(el.dataset.count || 0);
      if(count > 0 && wrap.classList.contains('collapsed')) el.style.display = 'inline-block';
      else el.style.display = 'none';
    }

    function tableHTML(title, items){
      if(!items.length) return '';
      return `<div class="card table-wrap"><div class="dash-header"><span class="dash-title">${title}</span><span class="count-total"></span><span class="count-badge"></span><span class="arrow">›</span></div><div class="dash-body"><table><tbody>${
        items.map(i=>`<tr class="item ${bulletClass(i.bullet)}${i.status==='done'?' done':''}${i.status==='cancelled'?' cancelled':''}" data-note="${i.source}"><td>${renderMainLine(i)}</td></tr>${i.children.length?`<tr class="details"><td><ul>${i.children.map(renderChildLine).join('')}</ul></td></tr>`:''}`).join('')
      }</tbody></table></div></div>`;
    }

    function styleEditorTags(inst){
      const tags = inst.getWrapperElement().querySelectorAll('.cm-tag');
      tags.forEach(el=>{
        const clean = el.textContent.replace('#','').toLowerCase();
        el.classList.add('cm-tag-' + clean);
      });
    }

    function styleBulletLines(inst){
      inst.eachLine(line=>{
        inst.removeLineClass(line, 'text', 'cm-bullet-plus');
        inst.removeLineClass(line, 'text', 'cm-bullet-star');
        inst.removeLineClass(line, 'text', 'cm-bullet-dash');
        const text = line.text.trimStart();
        if (text.startsWith('+')) inst.addLineClass(line, 'text', 'cm-bullet-plus');
        else if (text.startsWith('*')) inst.addLineClass(line, 'text', 'cm-bullet-star');
        else if (text.startsWith('-')) inst.addLineClass(line, 'text', 'cm-bullet-dash');
      });
    }

    function styleEditorBullets(){
      const bullets = cm.getWrapperElement().querySelectorAll('.cm-formatting-list');
      bullets.forEach(el=>{
        const ch = el.textContent.trim().charAt(0);
        if(ch === '+') el.style.color = '#3b82f6';
        else if(ch === '*') el.style.color = '#ef4444';
        else el.style.color = 'var(--text-normal)';
      });
    }

    function styleHeadings(inst){
      inst.eachLine(line=>{
        inst.removeLineClass(line, 'text', 'cm-h1');
        inst.removeLineClass(line, 'text', 'cm-h2');
        const text = line.text.trimStart();
        if(text.startsWith('# ')) inst.addLineClass(line, 'text', 'cm-h1');
        else if(text.startsWith('## ')) inst.addLineClass(line, 'text', 'cm-h2');
      });
    }

    function updateEditorWidgets(inst){
      inst._widgets = inst._widgets || [];
      inst._widgets.forEach(w=>w.clear());
      inst._widgets = [];
      inst.eachLine((line)=>{
        const m = line.text.match(/!\[\[(.+?)\]\]/);
        if(m){
          const img = document.createElement('img');
          img.src = m[1];
          img.style.maxWidth = '100%';
          img.style.borderRadius = 'var(--radius-md)';
          inst._widgets.push(inst.addLineWidget(inst.getLineNumber(line), img, {below:true}));
        }
      });
    }
    function matchHeights(inst, wrapId){
      const editorWrap = document.getElementById(wrapId);
      if(editorWrap){
        const h = editorWrap.clientHeight || 400;
        inst.setSize(null, h);
        inst.refresh();
      }
    }
    function initEditor(textareaId, wrapId){
      const inst = CodeMirror.fromTextArea(document.getElementById(textareaId), {
        lineNumbers:false,
        lineWrapping:true,
        mode:null
      });
      inst.addOverlay(overlay);
      const refresh = ()=>{ styleEditorTags(inst); styleBulletLines(inst); styleHeadings(inst); updateEditorWidgets(inst); matchHeights(inst, wrapId); };
      inst.on('change', refresh);
      inst.on('viewportChange', refresh);
      refresh();
      return inst;
    }

    function render(){
      if(!containerEl) return;
      const items = currentItems();
      const todos = items.filter(i=>i.view === 'task' && i.tags.some(t=>t==='todo' || t==='urgent'));
      const payments = items.filter(i=>i.view === 'payment');
      const music = items.filter(i=>i.view === 'music');
      const monitoring = items.filter(i=>i.view === 'monitoring');
      containerEl.innerHTML = tableHTML('Todos', todos) + tableHTML('Payments', payments) + tableHTML('Music', music) + tableHTML('Monitoring', monitoring);
      const todoAlerts = todos.filter(i=>i.tags.includes('urgent')).length;
      const monitoringErrors = monitoring.filter(i=>i.bullet==='*').length;
      const totals = {Todos:todos.length, Payments:payments.length, Music:music.length, Monitoring:monitoring.length};
      const wraps = containerEl.querySelectorAll('.table-wrap');
      wraps.forEach(wrap=>{
        const header = wrap.querySelector('.dash-header');
        const title = header.querySelector('.dash-title').textContent.trim();
        const totalEl = header.querySelector('.count-total');
        if(totalEl) totalEl.textContent = totals[title]||0;
        header.addEventListener('click',()=>{
          wrap.classList.toggle('collapsed');
          dashState[title] = wrap.classList.contains('collapsed');
          updateBadgeVisibility(wrap);
        });
        if(dashState[title]) wrap.classList.add('collapsed');
        if(title==='Todos') setBadge(wrap, todoAlerts);
        if(title==='Monitoring') setBadge(wrap, monitoringErrors);
        updateBadgeVisibility(wrap);
      });
      containerEl.querySelectorAll('tr.item').forEach(row=>{
        row.addEventListener('click',()=>{
          const next = row.nextElementSibling;
          if(next) next.classList.toggle('show');
        });
      });
      containerEl.querySelectorAll('.note-link').forEach(a=>{
        a.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); loadNote(a.dataset.note); });
      });
      containerEl.querySelectorAll('.chk').forEach(cb=>{
        cb.addEventListener('click',e=>{
          e.stopPropagation();
          const note = cb.dataset.note;
          const line = Number(cb.dataset.line);
          const state = cb.dataset.state;
          const next = state==='open'?'done':(state==='done'?'cancelled':'open');
          updateLineState(note, line, next);
          render();
        });
      });
      styleEditorTags(cm);
      styleBulletLines(cm);
      styleHeadings(cm);
      updateEditorWidgets(cm);
      matchHeights(cm, 'editorWrap');
    }

    if(includePadEl) includePadEl.addEventListener('input', render);

    function loadNote(name){
      currentNote = name;
      noteTabs.forEach(b=>b.classList.toggle('active', b.dataset.note===name));
      cm.setValue(NOTES[name]||'');
      requestAnimationFrame(render);
    }

    noteTabs.forEach(btn=>btn.addEventListener('click',()=>loadNote(btn.dataset.note)));

    // scenarioSelect removed in favor of tabs

    function updateLineState(note, line, state){
      const apply = (lines)=>{
        if(line < lines.length){
          lines[line] = setLineState(lines[line], state);
        }
      };
      if(note===currentNote){
        const lineText = cm.getLine(line);
        const newLine = setLineState(lineText, state);
        cm.replaceRange(newLine, {line, ch:0}, {line, ch:lineText.length});
      }else{
        const lines = (NOTES[note]||'').split(/\r?\n/);
        apply(lines);
        NOTES[note] = lines.join('\n');
      }
    }

    function setLineState(text, state){
      const now = new Date().toISOString().slice(0,10);
      let newText = text.replace(/\[( |x|-)\]/, state==='done'?'[x]':state==='cancelled'?'[-]':'[ ]');
      newText = newText.replace(/\s*(✅|❌)\s*202[4-9]-[01]\d-[0-3]\d/, '');
      if(state==='done') newText = newText.trimEnd()+` ✅ ${now}`;
      else if(state==='cancelled') newText = newText.trimEnd()+` ❌ ${now}`;
      return newText;
    }

    function bulletClass(ch){
      return ch === '+' ? 'plus' : (ch === '*' ? 'star' : 'dash');
    }

    function renderMainLine(i){
      const bullet = i.view === 'task' ? '' : `<span class="dash-bullet ${bulletClass(i.bullet)}"></span>`;
      const checkbox = i.view === 'task' ? `<span class="chk" data-note="${i.source}" data-line="${i.line}" data-state="${i.status}"></span> ` : '';
      const tags = i.tags.map(t=>badge('#'+t)).join(' ');
      const statusIcon = i.status==='done' ? '✅' : (i.status==='cancelled' ? '❌' : '');
      const due = i.due?` <span class="due">${statusIcon} ${i.due}</span>`:'';
      const link = `<a href="#" class="note-link" data-note="${i.source}">${i.source}</a>`;
      const url = i.url?` <a href="${i.url}" target="_blank">${i.url}</a>`:'';
      return `${bullet}${checkbox}${tags} ${i.title}${due} ${link}${url}`;
    }

    function renderChildLine(c){
      if(/^!\[\[(.+?)\]\]/.test(c.text)){
        const img = RegExp.$1;
        return `<li><img src="${img}" alt="${img}" style="max-width:100%;"></li>`;
      }
      const bullet = `<span class="dash-bullet ${bulletClass(c.bullet)}"></span>`;
      const tags = c.tags.map(t=>badge('#'+t)).join(' ');
      const due = c.due?` <span class="due">${c.due}</span>`:'';
      const url = c.url?` <a href="${c.url}" target="_blank">${c.url}</a>`:'';
      return `<li class="${bulletClass(c.bullet)}${c.status==='done'?' done':''}${c.status==='cancelled'?' cancelled':''}">${bullet}${tags} ${c.text}${due}${url}</li>`;
    }

    // === Alice ↔ Bob scenario ===
    function initHandoff(){
      if(initHandoff.ready) return;
      initHandoff.ready = true;
      const cmAliceDaily = initEditor('aliceDaily', 'aliceDailyWrap');
      const cmAliceLog = initEditor('aliceLog', 'aliceLogWrap');
      const cmBobDaily = initEditor('bobDaily', 'bobDailyWrap');
      const cmBobLog = initEditor('bobLog', 'bobLogWrap');
      cmAliceDaily.setValue(`# Alice Daily Note\nFire the trigger below and watch Bob's transaction log.\n- [ ] #Bob prepare Q3 report\n  - gather metrics from CRM`);
      cmAliceLog.setValue(`# Alice Transaction Log`);
      cmBobDaily.setValue(`# Bob Daily Note\n- [ ] #Alice verify vendor invoices`);
      cmBobLog.setValue(`# Bob Transaction Log\nAppend your response under the task to send it back.`);
      requestAnimationFrame(()=>{
        [cmAliceDaily, cmAliceLog, cmBobDaily, cmBobLog].forEach(cm=>{
          styleEditorTags(cm); styleBulletLines(cm); styleHeadings(cm); updateEditorWidgets(cm);
          matchHeights(cm, cm.getTextArea().parentElement.id);
        });
      });

      let aliceLogCount = 0;
      let bobLogCount = 0;

      function updateBadge(person){
        const badge = document.getElementById(person==='Alice'? 'aliceLogBadge' : 'bobLogBadge');
        const count = person==='Alice'? aliceLogCount : bobLogCount;
        badge.textContent = count;
        badge.style.display = count>0 ? 'inline-block' : 'none';
      }

      function appendToLog(cmLog, lines, person){
        const arr = cmLog.getValue().split(/\r?\n/);
        if(arr.length && arr[arr.length-1].trim()!=='') arr.push('');
        arr.push(...lines);
        cmLog.setValue(arr.join('\n'));
        requestAnimationFrame(()=>{
          styleEditorTags(cmLog); styleBulletLines(cmLog); styleHeadings(cmLog); updateEditorWidgets(cmLog);
          matchHeights(cmLog, cmLog.getTextArea().parentElement.id);
          updateMiniDash(person);
        });
      }

      function collectChildLines(cm, startIdx){
        const lines = cm.getValue().split(/\r?\n/);
        const baseIndent = (lines[startIdx].match(/^\s*/) || ['',''])[0].length;
        const out = [];
        for(let i=startIdx+1;i<lines.length;i++){
          const l = lines[i];
          const ind = (l.match(/^\s*/) || ['',''])[0].length;
          if(l.trim()==='') continue;
          if(ind <= baseIndent) break;
          const rel = ind - baseIndent;
          const trimmed = l.trim();
          const bullet = /^[-+*]/.test(trimmed) ? trimmed.charAt(0) : '';
          const text = trimmed.replace(/^[-+*]\s*/, '');
          out.push({ indent: rel, bullet, text });
        }
        return out;
      }

      function makeSender(fromCM, toLogCM, fromName, toName){
        return function(lineText, idx){
          const re = new RegExp(`^([-+*])\\s*\\[(x|-| )\\]\\s*#${toName}\\b:?\\s*(.+)`, 'i');
          const m = lineText.match(re);
          if(m && m[2] !== ' '){
            const task = m[3].trim();
            const context = collectChildLines(fromCM, idx).filter(o=>o.bullet !== '+').map(o=>' '.repeat(o.indent) + '+ ' + o.text);
            let replaced = lineText.replace(`#${toName}`, `#waiting ${toName}:`);
            replaced = setLineState(replaced,'open');
            fromCM.replaceRange(replaced,{line:idx,ch:0},{line:idx,ch:lineText.length});
            appendToLog(toLogCM, [`+ [ ] #todo from ${fromName}: ${task}`, ...context], toName);
            if(toName==='Bob') { bobLogCount++; updateBadge('Bob'); }
            else { aliceLogCount++; updateBadge('Alice'); }
          }
        };
      }

      function makeCompleter(fromLogCM, toDailyCM, originName, recipientName){
        return function(lineText, idx){
          const re = new RegExp(`^\\+\\s*\\[(x|-)\\]\\s*#todo\\s+from\\s+${originName}:\\s*(.+?)(?:\\s*(?:✅|❌)\\s*202[4-9]-[01]\\d-[0-3]\\d)?$`, 'i');
          const m = lineText.match(re);
          if(m && m[1] !== ' '){
            const task = m[2].trim();
            const state = m[1] === 'x' ? 'done' : 'cancelled';
            const context = collectChildLines(fromLogCM, idx)
              .filter(o=>o.bullet !== '+')
              .map(o=>' '.repeat(o.indent) + (state==='done'?'+':'*') + ' ' + o.text);
            const newLine = setLineState(lineText, state);
            fromLogCM.replaceRange(newLine,{line:idx,ch:0},{line:idx,ch:lineText.length});
            const targetLines = toDailyCM.getValue().split(/\r?\n/);
            for(let j=0;j<targetLines.length;j++){
              if(targetLines[j].includes(`#waiting ${recipientName}:`) && targetLines[j].includes(task)){
                const parentIndent = (targetLines[j].match(/^\s*/) || ['',''])[0];
                targetLines[j] = setLineState(targetLines[j], state);
                let insertAt = j + 1;
                const childIndent = parentIndent + '  ';
                while(insertAt < targetLines.length && targetLines[insertAt].startsWith(childIndent)){
                  const rel = targetLines[insertAt].slice(childIndent.length);
                  const m = rel.match(/^\s*([+*])/);
                  if(m) targetLines.splice(insertAt,1);
                  else insertAt++;
                }
                const prefixed = context.map(l=>parentIndent + l);
                targetLines.splice(insertAt,0,...prefixed);
                break;
              }
            }
            toDailyCM.setValue(targetLines.join('\n'));
            requestAnimationFrame(()=>{
              styleEditorTags(fromLogCM); styleBulletLines(fromLogCM); styleHeadings(fromLogCM); updateEditorWidgets(fromLogCM);
              matchHeights(fromLogCM, fromLogCM.getTextArea().parentElement.id);
              styleEditorTags(toDailyCM); styleBulletLines(toDailyCM); styleHeadings(toDailyCM); updateEditorWidgets(toDailyCM);
              matchHeights(toDailyCM, toDailyCM.getTextArea().parentElement.id);
              updateMiniDash(originName);
              updateMiniDash(recipientName);
            });
          }
        };
      }

      function setupCheckbox(inst, cb){
        function refresh(){
          if(inst._chkWidgets){ inst._chkWidgets.forEach(w=>w.remove()); }
          if(inst._chkMarks){ inst._chkMarks.forEach(m=>m.clear()); }
          inst._chkWidgets = [];
          inst._chkMarks = [];
          inst.eachLine(line=>{
            const text = line.text;
            const idx = text.indexOf('[');
            if(idx>=0 && /\[( |x|-)\]/.test(text.slice(idx,idx+3))){
              const lineNo = inst.getLineNumber(line);
              const box = document.createElement('input');
              box.type = 'checkbox';
              box.className = 'cm-hover-checkbox';
              const state = text[idx+1];
              box.checked = state==='x';
              box.indeterminate = state==='-';
              box.addEventListener('mousedown', e=>{
                e.preventDefault();
                const lineText = inst.getLine(lineNo);
                const curIdx = lineText.indexOf('[');
                const curState = lineText[curIdx+1];
                const next = curState===' ' ? 'x' : (curState==='x' ? '-' : ' ');
                const newLine = lineText.slice(0,curIdx+1)+next+lineText.slice(curIdx+2);
                inst.replaceRange(newLine, {line:lineNo, ch:0}, {line:lineNo, ch:lineText.length});
                if(cb) cb(newLine, lineNo);
                requestAnimationFrame(refresh);
              });
              inst.addWidget({line:lineNo, ch:idx}, box);
              inst._chkWidgets.push(box);
              const mark = inst.markText({line:lineNo, ch:0}, {line:lineNo, ch:idx}, {className:'cm-chk-prefix'});
              inst._chkMarks.push(mark);
            }
          });
        }
        inst.on('change',(cm,change)=>{
          if(change.origin==='+input' && cb){
            const line = cm.getLine(change.from.line);
            cb(line, change.from.line);
          }
          requestAnimationFrame(refresh);
        });
        inst.on('viewportChange', refresh);
        refresh();
      }

      const sendFromAlice = makeSender(cmAliceDaily, cmBobLog, 'Alice', 'Bob');
      const sendFromBob = makeSender(cmBobDaily, cmAliceLog, 'Bob', 'Alice');
      const completeFromBob = makeCompleter(cmBobLog, cmAliceDaily, 'Alice', 'Bob');
      const completeFromAlice = makeCompleter(cmAliceLog, cmBobDaily, 'Bob', 'Alice');
      setupCheckbox(cmAliceDaily, sendFromAlice);
      setupCheckbox(cmBobDaily, sendFromBob);
      setupCheckbox(cmAliceLog, completeFromAlice);
      setupCheckbox(cmBobLog, completeFromBob);

      function addEnterKey(cm){
        cm.addKeyMap({
          Enter: function(inst){
            const pos = inst.getCursor();
            const line = inst.getLine(pos.line);
            const baseIndent = line.match(/^(\s*)/)[1];
            const trimmed = line.slice(baseIndent.length);
            if(!trimmed.startsWith('+') && !trimmed.startsWith('-')){
              inst.replaceRange('\n', pos, pos, '+input');
              return;
            }
            let indent = baseIndent;
            if(trimmed.startsWith('+')) indent += '  ';
            const prefix = indent + '- ';
            inst.replaceRange('\n'+prefix, {line:pos.line, ch:line.length}, {line:pos.line, ch:line.length}, '+input');
            inst.setCursor({line:pos.line+1, ch:prefix.length});
          }
        });
      }
      addEnterKey(cmAliceDaily);
      addEnterKey(cmBobDaily);
      addEnterKey(cmAliceLog);
      addEnterKey(cmBobLog);

      function updateMiniDash(person){
        const daily = person==='Alice'? cmAliceDaily : cmBobDaily;
        const log = person==='Alice'? cmAliceLog : cmBobLog;
        const dash = document.getElementById(person==='Alice'? 'aliceDash':'bobDash');
        const body = dash.querySelector('.dash-body');
        const items = [
          ...collectFromNote('Daily Note', daily.getValue()),
          ...collectFromNote('Transaction Log', log.getValue())
        ].filter(i=>i.tags.some(t=>t==='todo'||t==='waiting'));
        body.innerHTML = `<table><tbody>${items.map(i=>`<tr class="item ${bulletClass(i.bullet)}${i.status==='done'?' done':''}${i.status==='cancelled'?' cancelled':''}" data-note="${i.source}"><td>${renderMainLine(i)}</td></tr>${i.children.length?`<tr class="details"><td><ul>${i.children.map(renderChildLine).join('')}</ul></td></tr>`:''}`).join('')}</tbody></table>`;
        const totalEl = dash.querySelector('.count-total');
        if(totalEl) totalEl.textContent = items.length;
        const urgentCount = items.filter(i=>i.tags.includes('urgent')).length;
        const badgeEl = dash.querySelector('.count-badge');
        if(badgeEl){
          badgeEl.textContent = urgentCount;
          badgeEl.dataset.count = urgentCount;
          badgeEl.style.display = urgentCount>0 && dash.classList.contains('collapsed') ? 'inline-block':'none';
        }
        body.querySelectorAll('.chk').forEach(cb=>{
          cb.addEventListener('click',e=>{
            e.stopPropagation();
            const note = cb.dataset.note;
            const line = Number(cb.dataset.line);
            const state = cb.dataset.state;
            const next = state==='open'?'done':(state==='done'?'cancelled':'open');
            const cmTarget = person==='Alice'
              ? (note.includes('Log')? cmAliceLog : cmAliceDaily)
              : (note.includes('Log')? cmBobLog : cmBobDaily);
            const lineText = cmTarget.getLine(line);
            const newLine = setLineState(lineText, next);
            cmTarget.replaceRange(newLine,{line, ch:0},{line, ch:lineText.length});
            requestAnimationFrame(()=>{
              styleEditorTags(cmTarget); styleBulletLines(cmTarget); styleHeadings(cmTarget); updateEditorWidgets(cmTarget);
              matchHeights(cmTarget, cmTarget.getTextArea().parentElement.id);
              updateMiniDash(person);
            });
          });
        });
      }

      cmAliceDaily.on('change', ()=>updateMiniDash('Alice'));
      cmAliceLog.on('change', ()=>updateMiniDash('Alice'));
      cmBobDaily.on('change', ()=>updateMiniDash('Bob'));
      cmBobLog.on('change', ()=>updateMiniDash('Bob'));

      updateMiniDash('Alice');
      updateMiniDash('Bob');

      function setupTabs(panelId, person){
        const panel = document.getElementById(panelId);
        const tabs = panel.querySelectorAll('.note-tab');
        tabs.forEach(btn=>{
          btn.addEventListener('click',()=>{
            tabs.forEach(b=>b.classList.toggle('active', b===btn));
            const wraps = panel.querySelectorAll('[id$="Wrap"]');
            wraps.forEach(w=>w.style.display='none');
            document.getElementById(btn.dataset.wrap).style.display='block';
            if(btn.dataset.wrap.endsWith('LogWrap')){
              if(person==='Alice'){ aliceLogCount=0; updateBadge('Alice'); }
              else { bobLogCount=0; updateBadge('Bob'); }
            }
            updateEditorWidgets(cmAliceDaily); updateEditorWidgets(cmAliceLog); updateEditorWidgets(cmBobDaily); updateEditorWidgets(cmBobLog);
            matchHeights(cmAliceDaily,'aliceDailyWrap');
            matchHeights(cmAliceLog,'aliceLogWrap');
            matchHeights(cmBobDaily,'bobDailyWrap');
            matchHeights(cmBobLog,'bobLogWrap');
          });
        });
      }
      setupTabs('alicePanel','Alice');
      setupTabs('bobPanel','Bob');
      ['aliceDash','bobDash'].forEach(id=>{
        const wrap = document.getElementById(id);
        if(!wrap) return;
        const header = wrap.querySelector('.dash-header');
        header.addEventListener('click',()=>{
          wrap.classList.toggle('collapsed');
          updateMiniDash(id==='aliceDash'?'Alice':'Bob');
        });
      });
    }

    // Footer year + theme how-to
    const yearEl = document.getElementById('year'); if(yearEl) yearEl.textContent = new Date().getFullYear();
    const themeBtn = document.getElementById('copyThemeBtn'); if(themeBtn) themeBtn.addEventListener('click', (e)=>{ e.preventDefault(); alert(`To inherit your Obsidian theme:\n\n1) Open .obsidian/themes/<YourTheme>.css\n2) Copy the CSS variable block (e.g. :root { --background-primary: ... })\n3) Paste into this file's :root and :root[data-theme="dark"] sections.\n4) Save and refresh.`); });
    
    // Initial render
    loadNote(currentNote);
