/* BARBEARIA MORAES — poste de barbeiro 3D (Three.js sob demanda)
   Listras vermelho/branco/azul em cilindro de vidro com tampas cromadas.
   A rotação acompanha o tempo e acelera com o scroll. */
(function () {
  'use strict';
  function stripes() {
    var c = document.createElement('canvas'); c.width = 256; c.height = 512;
    var x = c.getContext('2d');
    x.fillStyle = '#f2ece0'; x.fillRect(0, 0, 256, 512);
    var colors = ['#c8102e', '#f2ece0', '#1f3a93', '#f2ece0'];
    x.save(); x.translate(128, 256); x.rotate(-0.62); x.translate(-400, -400);
    for (var i = 0; i < 40; i++) { x.fillStyle = colors[i % 4]; x.fillRect(0, i * 24, 800, 24); }
    x.restore();
    return c;
  }
  async function mount(el, opts) {
    opts = opts || {};
    try { var t = document.createElement('canvas'); if (!(t.getContext('webgl2') || t.getContext('webgl'))) return null; } catch (e) { return null; }
    var THREE, RoomEnvironment;
    try {
      THREE = await import('three');
      RoomEnvironment = (await import('three/addons/environments/RoomEnvironment.js')).RoomEnvironment;
    } catch (e) { return null; }
    var reduce = !!opts.reduceMotion;
    var r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    r.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.setClearColor(0, 0);
    el.appendChild(r.domElement);
    var scene = new THREE.Scene();
    var pm = new THREE.PMREMGenerator(r);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    var cam = new THREE.PerspectiveCamera(28, 1, 0.1, 50); cam.position.set(0, 0, 12.5);
    var key = new THREE.DirectionalLight('#fff3e0', 2); key.position.set(3, 3, 5); scene.add(key);
    var rim = new THREE.DirectionalLight('#c8102e', 2.5); rim.position.set(-4, 1, -3); scene.add(rim);

    var g = new THREE.Group(); scene.add(g);
    var tex = new THREE.CanvasTexture(stripes()); tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1, 2.2);
    var core = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 3.4, 64, 1, true), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45 }));
    var glass = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3.5, 64, 1, true), new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: 0.18, roughness: 0.05, metalness: 0, clearcoat: 1, side: THREE.DoubleSide }));
    var chrome = new THREE.MeshStandardMaterial({ color: '#d9dde2', metalness: 1, roughness: 0.18 });
    var capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.28, 64), chrome); capTop.position.y = 1.88;
    var dome = new THREE.Mesh(new THREE.SphereGeometry(0.5, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), chrome); dome.position.y = 2.02;
    var capBot = capTop.clone(); capBot.position.y = -1.88;
    var knob = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16), chrome); knob.position.y = -2.15;
    g.add(core, glass, capTop, dome, capBot, knob);
    g.rotation.z = 0.08;

    var state = { boost: 0, py: 0 };
    var clock = new THREE.Clock(), running = false;
    function size() { var w = el.clientWidth, h = el.clientHeight; if (!w || !h) return; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); draw(0); }
    function draw(dt) {
      if (!reduce) tex.offset.y -= dt * (0.18 + state.boost);
      state.boost *= Math.pow(0.05, dt || 0);
      g.rotation.y += reduce ? 0 : dt * 0.3;
      g.position.y = state.py;
      r.render(scene, cam);
    }
    function loop() { draw(Math.min(clock.getDelta(), 0.05)); }
    var io = new IntersectionObserver(function (e) {
      var v = e[0].isIntersecting && !reduce;
      if (v !== running) { running = v; clock.getDelta(); r.setAnimationLoop(v ? loop : null); }
    });
    io.observe(el);
    new ResizeObserver(size).observe(el);
    size();
    requestAnimationFrame(function () { el.classList.add('is-ready'); });
    return {
      kick: function (v) { state.boost = Math.min(2.5, state.boost + v); },
      setScroll: function (p) { state.py = p * 0.8; if (reduce) draw(0); },
    };
  }
  window.BarberPole = { mount: mount };
})();
