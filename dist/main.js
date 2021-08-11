import './style.css'
import * as Simplex from 'simplex-noise';
import * as THREE from 'three';
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { Vector3 } from 'three';


const noise = new Simplex();
const scence = new THREE.Scene();
const blobScale = 3;
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
let starsGeometry = new THREE.BufferGeometry();
const positions = [];
const velocity =[];
for (let i = 0; i < 50; i++) {
  const particleStar = randomPointSphere(150);//RANDOM POINT

  particleStar.velocity = THREE.MathUtils.randInt(50, 200);
  velocity.push(particleStar.velocity);
  positions.push((particleStar.x)) ;
  positions.push((particleStar.y)) ;
  positions.push((particleStar.z)) ;
  //animation
  
  starsGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  starsGeometry.setAttribute( 'velocity', new THREE.Float32BufferAttribute( velocity, 1 ) );
  console.log(starsGeometry.getAttribute('position'));
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
  // console.log(dy);
  return new THREE.Vector3(dx, dy, dz);
}
    /*    Fixed Stars   */
    function createStars(texture, size, total) {
        const newpoint = [];
        let pointGeometry = new THREE.BufferGeometry();
        let pointMaterial = new THREE.PointsMaterial({
            size: size,
            map: texture,
            blending: THREE.AdditiveBlending,                      
        });

        for (let i = 0; i < total; i++) {
            let radius = THREE.MathUtils.randInt(149, 70); 
            let particles = randomPointSphere(radius);
            newpoint.push(particles.getComponent(0));
            newpoint.push(particles.getComponent(1));
            newpoint.push(particles.getComponent(2));
        }
        pointGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        // console.log( new THREE.Points(pointGeometry, pointMaterial));
        return new THREE.Points(pointGeometry, pointMaterial);
    }
    scence.add(createStars(texture1, 15, 20));   
    
    scence.add(createStars(texture2, 5, 5));
    scence.add(createStars(texture4, 7, 5));
    

function animate() {

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


