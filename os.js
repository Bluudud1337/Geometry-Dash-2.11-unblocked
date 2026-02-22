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
  win.style.top = "100px";
  win.style.left = "100px";
  win.style.zIndex = z++;

  win.innerHTML = `
    <div class="window-header">
      <span>${app.name}</span>
      <div>
        <button onclick="minimizeWindow(this)">_</button>
        <button onclick="closeWindow(this)">X</button>
      </div>
    </div>
    <iframe src="${app.url}"></iframe>
  `;

  makeDraggable(win);
  document.body.appendChild(win);

  addToTaskbar(app, win);
}

function closeWindow(btn){
  const win = btn.closest(".window");
  removeFromTaskbar(win.dataset.id);
  win.remove();
}

function minimizeWindow(btn){
  const win = btn.closest(".window");
  win.style.display = "none";
}

function addToTaskbar(app, win){
  const id = Date.now();
  win.dataset.id = id;

  const icon = document.createElement("div");
  icon.className = "taskbar-icon";
  icon.innerText = app.name;
  icon.onclick = ()=> {
    win.style.display = "flex";
    win.style.zIndex = z++;
  };

  document.getElementById("taskbar-apps").appendChild(icon);
  taskbarApps[id] = icon;
}

function removeFromTaskbar(id){
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
  };

  document.onmouseup = ()=> down=false;

  document.onmousemove = e=>{
    if(!down) return;
    win.style.left = (e.clientX - offsetX)+"px";
    win.style.top = (e.clientY - offsetY)+"px";
  };
}

function refreshDesktop(){
  loadApps();
}

document.getElementById("desktop").addEventListener("contextmenu", e=>{
  e.preventDefault();
  const menu = document.getElementById("context-menu");
  menu.style.left = e.pageX+"px";
  menu.style.top = e.pageY+"px";
  menu.classList.remove("hidden");
});

document.body.onclick = ()=>{
  document.getElementById("context-menu").classList.add("hidden");
};

setInterval(()=>{
  document.getElementById("clock").innerText =
    new Date().toLocaleTimeString();
},1000);

loadApps();
