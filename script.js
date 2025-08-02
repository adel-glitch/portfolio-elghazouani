/*
 * Script de gestion des animations 3D et autres interactions.
 * La scène 3D utilise Three.js pour afficher un panneau solaire stylisé qui tourne
 * lentement en arrière‑plan de la section d’accueil. L’objectif est de donner
 * un rendu moderne et technologique sans encombrer l’interface.
 */

// Lorsque le DOM est entièrement chargé, initialiser la scène 3D
document.addEventListener('DOMContentLoaded', () => {
  init3DScene();
});

function init3DScene() {
  const container = document.getElementById('canvas-container');
  // Crée le renderer et l’ajoute au conteneur
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Crée une scène et une caméra
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 6);

  // Ajoute une lumière ambiante douce
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);
  // Lumière directionnelle simulant le soleil
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  // Création du panneau solaire stylisé
  // Dimensions du panneau (largeur, hauteur, profondeur minime)
  const panelWidth = 3;
  const panelHeight = 1.8;
  const panelDepth = 0.08;

  const panelGeometry = new THREE.BoxGeometry(panelWidth, panelHeight, panelDepth);
  // Matériaux pour chaque face: top (bleu) + côtés (gris foncé)
  const materials = [
    new THREE.MeshStandardMaterial({ color: 0x455a64 }), // droite
    new THREE.MeshStandardMaterial({ color: 0x455a64 }), // gauche
    new THREE.MeshStandardMaterial({ color: 0x455a64 }), // dessus
    new THREE.MeshStandardMaterial({ color: 0x455a64 }), // dessous
    new THREE.MeshStandardMaterial({ color: 0x42a5f5 }), // avant (surface bleue du panneau)
    new THREE.MeshStandardMaterial({ color: 0x42a5f5 })  // arrière
  ];
  const panelMesh = new THREE.Mesh(panelGeometry, materials);
  scene.add(panelMesh);

  // Incline légèrement le panneau pour un meilleur angle de vue
  panelMesh.rotation.x = Math.PI / 8;
  panelMesh.rotation.y = -Math.PI / 6;

  // Animation de rotation lente
  function animate() {
    requestAnimationFrame(animate);
    panelMesh.rotation.y += 0.003;
    panelMesh.rotation.x += 0.001;
    renderer.render(scene, camera);
  }
  animate();

  // Gestion du redimensionnement de la fenêtre
  window.addEventListener('resize', () => {
    const { clientWidth, clientHeight } = container;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight);
  });
}