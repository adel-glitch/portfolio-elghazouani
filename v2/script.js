/*
 * Script pour l'animation 3D du site v2.
 * Ce fichier crée un objet 3D animé avec Three.js afin d'illustrer
 * l'aspect moderne et technologique du portfolio.
 */

// Initialisation de la scène, de la caméra et du rendu
const canvas = document.getElementById('heroCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 35);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

// Création d'un objet 3D (torus knot) symbolisant l'innovation
const geometry = new THREE.TorusKnotGeometry(5, 1.5, 100, 16);
const material = new THREE.MeshPhongMaterial({
  color: 0x64ffda,
  emissive: 0x0a192f,
  shininess: 60,
  specular: 0x112240,
});
const knot = new THREE.Mesh(geometry, material);
scene.add(knot);

// Ajout d'éclairage
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(10, 20, 20);
scene.add(pointLight);

// Génération d'un champ d'étoiles pour la profondeur
function createStarField(numStars = 300) {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0x8892b0, size: 0.15 });
  const positions = [];
  for (let i = 0; i < numStars; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;
    positions.push(x, y, z);
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}
createStarField();

// Animation de la scène
function animate() {
  requestAnimationFrame(animate);
  knot.rotation.x += 0.01;
  knot.rotation.y += 0.013;
  renderer.render(scene, camera);
}
animate();

// Ajustement du rendu lors du redimensionnement de la fenêtre
function onWindowResize() {
  const { clientWidth, clientHeight } = canvas;
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(clientWidth, clientHeight);
}
window.addEventListener('resize', onWindowResize);