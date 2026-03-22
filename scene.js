/**
 * Three.js 3D Hero Scene – floating wireframe torus knot + particles
 * Requires Three.js loaded before this script.
 */
(function () {
  'use strict';

  var container = document.getElementById('hero-canvas');
  if (!container || typeof THREE === 'undefined') return;

  try {

  var scene, camera, renderer, torusKnot, particles, mouseX = 0, mouseY = 0;

  function init() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Wireframe torus knot
    var geometry = new THREE.TorusKnotGeometry(0.6, 0.2, 100, 16);
    var material = new THREE.MeshBasicMaterial({
      color: 0xeb4e2a,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // Particle field
    var particleCount = 400;
    var pGeometry = new THREE.BufferGeometry();
    var positions = new Float32Array(particleCount * 3);
    for (var i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }
    pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var pMaterial = new THREE.PointsMaterial({
      color: 0xeb4e2a,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });
    particles = new THREE.Points(pGeometry, pMaterial);
    scene.add(particles);

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    animate();
  }

  function onResize() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function animate() {
    requestAnimationFrame(animate);
    var t = Date.now() * 0.001;
    if (torusKnot) {
      torusKnot.rotation.x = t * 0.2 + mouseY * 0.3;
      torusKnot.rotation.y = t * 0.3 + mouseX * 0.3;
    }
    if (particles) {
      particles.rotation.y = t * 0.05;
    }
    renderer.render(scene, camera);
  }

  init();
  } catch (e) {
    console.warn('Three.js scene could not initialize:', e);
  }
})();
