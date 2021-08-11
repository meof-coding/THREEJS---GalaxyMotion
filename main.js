import './style.css'
import * as THREE from 'three';
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
// import {SimplexNoise} from "./simplex-noise.js"



const scence = new THREE.Scene();
const blobScale = 3;
// const noise = new SimplexNoise();
const cameraSpeed = 0;
let container = document.getElementById("canvas_container");
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(0, 0, 230);
const directionalLight = new THREE.DirectionalLight("#fff", 2);
directionalLight.position.set(0, 50, -20);
scence.add(directionalLight);

let ambientLight = new THREE.AmbientLight("#ffffff", 1);
ambientLight.position.set(0, 20, 20);
scence.add(ambientLight);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

//OrbitControl
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 4;
controls.maxDistance = 350;
controls.minDistance = 150;
controls.enablePan = false;

const loader = new THREE.TextureLoader();
const textureSphereBg = loader.load('https://i.ibb.co/4gHcRZD/bg3-je3ddz.jpg');
const texturenucleus = loader.load('https://i.ibb.co/hcN2qXk/star-nc8wkw.jpg');
const textureStar = loader.load("https://i.ibb.co/ZKsdYSz/p1-g3zb2a.png");
const texture1 = loader.load("https://i.ibb.co/F8by6wW/p2-b3gnym.png");
const texture2 = loader.load("https://i.ibb.co/yYS2yx5/p3-ttfn70.png");
const texture4 = loader.load("https://i.ibb.co/yWfKkHh/p4-avirap.png");

/*  Nucleus  */
texturenucleus.anisotropy = 16;
let icosahedronGeometry = new THREE.IcosahedronGeometry(30, 10);
let lambertMaterial = new THREE.MeshPhongMaterial({ map: texturenucleus });
const nucleus = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
scence.add(nucleus);

/*    Sphere  Background   */
textureSphereBg.anisotropy = 16;
let geometrySphereBg = new THREE.SphereBufferGeometry(150, 40, 40);
let materialSphereBg = new THREE.MeshBasicMaterial({
  side: THREE.BackSide,
  map: textureSphereBg,
});
const sphereBg = new THREE.Mesh(geometrySphereBg, materialSphereBg);
scence.add(sphereBg);

/*    Moving Stars   */
const points = [];
let starsGeometry = new THREE.BufferGeometry().setFromPoints(points)

for (let i = 0; i < 50; i++) {
  const particleStar = randomPointSphere(150);//RANDOM POINT

  particleStar.velocity = THREE.MathUtils.randInt(50, 200);

  particleStar.startX = particleStar.x;
  particleStar.startY = particleStar.y;
  particleStar.startZ = particleStar.z;

  points.push(particleStar);
}
let starsMaterial = new THREE.PointsMaterial({
  size: 5,
  color: "#ffffff",
  transparent: true,
  opacity: 0.8,
  map: textureStar,
  blending: THREE.AdditiveBlending,
});
starsMaterial.depthWrite = false;
const stars = new THREE.Points(starsGeometry, starsMaterial);
scence.add(stars);

function randomPointSphere(radius) {
  let theta = 2 * Math.PI * Math.random();
  let phi = Math.acos(2 * Math.random() - 1);
  let dx = 0 + (radius * Math.sin(phi) * Math.cos(theta));
  let dy = 0 + (radius * Math.sin(phi) * Math.sin(theta));
  let dz = 0 + (radius * Math.cos(phi));
  return new THREE.Vector3(dx, dy, dz);
}

    /*    Fixed Stars   */
    function createStars(texture, size, total) {
        const newpoint = [];
        let pointGeometry = new THREE.BufferGeometry().setFromPoints( newpoint );
        let pointMaterial = new THREE.PointsMaterial({
            size: size,
            map: texture,
            blending: THREE.AdditiveBlending,                      
        });

        for (let i = 0; i < total; i++) {
            let radius = THREE.MathUtils.randInt(149, 70); 
            let particles = randomPointSphere(radius);
            newpoint.push(particles);
        }
        return new THREE.Points(pointGeometry, pointMaterial);
    }
    scence.add(createStars(texture1, 15, 20));   
    scence.add(createStars(texture2, 5, 5));
    scence.add(createStars(texture4, 7, 5));

function animate() {
  //Stars  Animation
  const positionAttribute = stars.geometry.getAttribute('position');
  const vertex = new THREE.Vector3();
  for(let i =0; i<positionAttribute.count;i++){
    vertex.fromBufferAttribute(positionAttribute,i);
    vertex.x += (0 - vertex.x) / vertex.velocity;
    vertex.y += (0 - vertex.y) / vertex.velocity;
    vertex.z += (0 - vertex.z) / vertex.velocity;
    positionAttribute.setXYZ( i, vertex.x, vertex.y, vertex.z );
    vertex.velocity -= 0.3;

        if (vertex.x <= 5 && vertex.x >= -5 && vertex.z <= 5 && vertex.z >= -5) {
            vertex.x = vertex.startX;
            vertex.y = vertex.startY;
            vertex.z = vertex.startZ;
            vertex.velocity = THREE.MathUtils.randInt(50, 300);
        }
    };
  
     //Nucleus Animation
      const positionAtt = nucleus.geometry.getAttribute('position');
      // const vertex = new THREE.Vector3();
      for(let i =0; i<positionAttribute.count;i++){
        vertex.fromBufferAttribute(positionAttribute,i);
        let time = Date.now();
        vertex.normalize();
        var noise = new SimplexNoise();
        let distance = nucleus.geometry.parameters.radius + noise.noise3D(
            vertex.x + time * 0.0005,
            vertex.y + time * 0.0003,
            vertex.z + time * 0.0008
        ) * blobScale;
        vertex.multiplyScalar(distance);
    }
    nucleus.geometry.verticesNeedUpdate = true;
    nucleus.geometry.normalsNeedUpdate = true;
    nucleus.geometry.computeVertexNormals();
    nucleus.geometry.computeFaceNormals();
    nucleus.rotation.y += 0.002;


    //Sphere Beckground Animation
    sphereBg.rotation.x += 0.002;
    sphereBg.rotation.y += 0.002;
    sphereBg.rotation.z += 0.002;


    controls.update();
    stars.geometry.verticesNeedUpdate = true;

  requestAnimationFrame(animate);
  renderer.render(scence, camera);
}
animate()

/*     Resize     */
window.addEventListener("resize", () => {
 clearTimeout(timeout_Debounce);
     const timeout_Debounce = setTimeout(onWindowResize, 80);
});
function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

