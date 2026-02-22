let z = 1;
let taskbarApps = {};

function loadApps(){
  const desktop = document.getElementById("desktop");
  desktop.innerHTML = "";

  APPS.forEach(app=>{
    const icon = document.createElement("div");
    icon.className = "icon";
    icon.innerHTML = `
      <img src="${app.icon}">
      <div>${app.name}</div>
    `;
    icon.onclick = ()=> openApp(app);
    desktop.appendChild(icon);
  });
}

function openApp(app){

  const win = document.createElement("div");
  win.className = "window";
  win.style.top = "120px";
  win.style.left = "150px";
  win.style.zIndex = z++;

  win.innerHTML = `
    <div class="window-header">
      <div>${app.name}</div>
      <div class="window-controls">
        <div class="control-btn min" onclick="minimizeWindow(this)"></div>
        <div class="control-btn close" onclick="closeWindow(this)"></div>
      </div>
    </div>
    <iframe src="${app.url}"></iframe>
  `;

  makeDraggable(win);
  document.body.appendChild(win);

  addToDock(app, win);
}

function closeWindow(btn){
  const win = btn.closest(".window");
  removeFromDock(win.dataset.id);
  win.remove();
}

function minimizeWindow(btn){
  const win = btn.closest(".window");
  win.style.display = "none";
}

function addToDock(app, win){
  const id = Date.now();
  win.dataset.id = id;

  const icon = document.createElement("img");
  icon.src = app.icon;
  icon.className = "taskbar-icon";
  icon.onclick = ()=>{
    win.style.display = "flex";
    win.style.zIndex = z++;
  };

  document.getElementById("taskbar").appendChild(icon);
  taskbarApps[id] = icon;
}

function removeFromDock(id){
  if(taskbarApps[id]){
    taskbarApps[id].remove();
    delete taskbarApps[id];
  }
}

function makeDraggable(win){
  const header = win.querySelector(".window-header");
  let offsetX, offsetY, down=false;

  header.onmousedown = e=>{
    down=true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = z++;
  };

  document.onmouseup = ()=> down=false;

  document.onmousemove = e=>{
    if(!down) return;
    win.style.left = (e.clientX - offsetX)+"px";
    win.style.top = (e.clientY - offsetY)+"px";
  };
}

loadApps();
