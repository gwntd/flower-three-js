import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.querySelector("#experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const textureLoader = new THREE.TextureLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const textureMap = {
  Flower: {
    day: "/textures/room/day/flower_base_color.webp",
  },
  Pot: {
    day: "/textures/room/day/pot_base_color.webp",
  },
};

const loadedTexture = {
  day: {},
};

Object.entries(textureMap).forEach(([key, paths]) => {
  const dayTexture = textureLoader.load(paths.day);
  loadedTexture.day[key] = dayTexture;
  dayTexture.flipX = false;
  dayTexture.colorSpace = THREE.SRGBColorSpace;
});

loader.load("/models/flower_export.glb", (glb) => {

  glb.scene.rotation.set(0, 0, 0);
  glb.scene.position.set(0, 0, 0);

  glb.scene.traverse(child => {

    if (child.isMesh) {
      Object.keys(textureMap).forEach(key => {
        if (child.name.includes(key)) {}
      });
    }

  })

  scene.add(glb.scene);
});

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(1000, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 1, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// for highlight the object because i can't see it in a dark space
renderer.setClearColor(0xffffff, 1);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function animate() { }

const render = () => {
  controls.update();

    // scene.rotation.x += 0.01; 
    scene.rotation.y += 0.01; 
    scene.rotation.z += 0.01;  
 
  renderer.render(scene, camera);

  window.requestAnimationFrame(render);
};

render();