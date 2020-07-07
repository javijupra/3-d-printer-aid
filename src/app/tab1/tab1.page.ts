import { Component } from '@angular/core';

import * as THREE from '../../../node_modules/three/build/three.module.js';
import {OrbitControls} from '../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {STLLoader} from '../../../node_modules/three/examples/jsm/loaders/STLLoader.js';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor() {}

  ngOnInit() {

    var container, stats;

			var camera, cameraTarget, scene, renderer;

			init();
			animate();

			function init() {

        container = document.getElementsByClassName("stlviewer");
		// // container = document.createElement( 'div' );
        // document.body.appendChild( document.getElementsByClassName("stlviewer") );
        // container.appendChild( renderer.domElement );

				camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
				camera.position.set( 20, 0.15, 20 );

				cameraTarget = new THREE.Vector3( 0, - 0.25, 0 );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x72645b );
				scene.fog = new THREE.Fog( 0x72645b, 2, 15 );


				// Ground

				var plane = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 40, 40 ),
					new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
				);
				plane.rotation.x = - Math.PI / 2;
				plane.position.y = - 0.5;
				scene.add( plane );

				plane.receiveShadow = true;


				// ASCII file

				var loader = new STLLoader();
				loader.load( '../../assets/Monkey.stl', function ( geometry ) {

					var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
					var mesh = new THREE.Mesh( geometry, material );

					console.log("hoalalal");
					
					// Compute the middle
					var middle = new THREE.Vector3();
					geometry.computeBoundingBox();
					geometry.boundingBox.getCenter(middle);

					// // Center it
					// mesh.position.x = -1 * middle.x;
					// mesh.position.y = -1 * middle.y;
					// mesh.position.z = -1 * middle.z;

					mesh.position.set( 0, 0, 0 );
					mesh.rotation.set( - Math.PI / 2, 0, 0);
					mesh.scale.set( 0.2, 0.2, 0.2 );

					mesh.castShadow = true;
					mesh.receiveShadow = true;

					scene.add( mesh );

					// var material = new THREE.MeshPhongMaterial({ color: 0xff5533, specular: 100, shininess: 100 });
					// var mesh = new THREE.Mesh(geometry, material);
					// scene.add(mesh);

					// // Compute the middle
					// var middle = new THREE.Vector3();
					// geometry.computeBoundingBox();
					// geometry.boundingBox.getCenter(middle);

					// // Center it
					// mesh.position.x = -1 * middle.x;
					// mesh.position.y = -1 * middle.y;
					// mesh.position.z = -1 * middle.z;

					// Pull the camera away as needed
					
					var largestDimension = Math.max(geometry.boundingBox.max.x,
						geometry.boundingBox.max.y, geometry.boundingBox.max.z)
					camera.position.z = largestDimension * 1.5;

				} );


				// // Binary files

				// var material = new THREE.MeshPhongMaterial( { color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );

				// loader.load( './models/stl/binary/pr2_head_pan.stl', function ( geometry ) {

				// 	var mesh = new THREE.Mesh( geometry, material );

				// 	mesh.position.set( 0, - 0.37, - 0.6 );
				// 	mesh.rotation.set( - Math.PI / 2, 0, 0 );
				// 	mesh.scale.set( 2, 2, 2 );

				// 	mesh.castShadow = true;
				// 	mesh.receiveShadow = true;

				// 	scene.add( mesh );

				// } );

				// loader.load( './models/stl/binary/pr2_head_tilt.stl', function ( geometry ) {

				// 	var mesh = new THREE.Mesh( geometry, material );

				// 	mesh.position.set( 0.136, - 0.37, - 0.6 );
				// 	mesh.rotation.set( - Math.PI / 2, 0.3, 0 );
				// 	mesh.scale.set( 2, 2, 2 );

				// 	mesh.castShadow = true;
				// 	mesh.receiveShadow = true;

				// 	scene.add( mesh );

				// } );

				// // Colored binary STL
				// loader.load( './models/stl/binary/colored.stl', function ( geometry ) {

				// 	var meshMaterial = material;
				// 	if ( geometry.hasColors ) {

				// 		meshMaterial = new THREE.MeshPhongMaterial( { opacity: geometry.alpha, vertexColors: true } );

				// 	}

				// 	var mesh = new THREE.Mesh( geometry, meshMaterial );

				// 	mesh.position.set( 0.5, 0.2, 0 );
				// 	mesh.rotation.set( - Math.PI / 2, Math.PI / 2, 0 );
				// 	mesh.scale.set( 0.3, 0.3, 0.3 );

				// 	mesh.castShadow = true;
				// 	mesh.receiveShadow = true;

				// 	scene.add( mesh );

				// } );


				// Lights

				scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );

				addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
				addShadowedLight( 0.5, 1, - 1, 0xffaa00, 1 );
				// renderer

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				// renderer.setSize( 200, 200 );
				renderer.outputEncoding = THREE.sRGBEncoding;

				renderer.shadowMap.enabled = true;

				// stats

				// stats = new Stats();
				// container.appendChild( stats.dom );

				//

        window.addEventListener( 'resize', onWindowResize, false );
        
        document.getElementById("stlviewer").appendChild( renderer.domElement );

			}

			function addShadowedLight( x, y, z, color, intensity ) {

				var directionalLight = new THREE.DirectionalLight( color, intensity );
				directionalLight.position.set( x, y, z );
				scene.add( directionalLight );

				directionalLight.castShadow = true;

				var d = 1;
				directionalLight.shadow.camera.left = - d;
				directionalLight.shadow.camera.right = d;
				directionalLight.shadow.camera.top = d;
				directionalLight.shadow.camera.bottom = - d;

				directionalLight.shadow.camera.near = 1;
				directionalLight.shadow.camera.far = 4;

				directionalLight.shadow.bias = - 0.002;

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );

				render();
				// stats.update();

			}

			function render() {

				var timer = Date.now() * 0.0005;

				camera.position.x = Math.cos( timer ) * 3;
				camera.position.z = Math.sin( timer ) * 3;

				camera.lookAt( cameraTarget );

				renderer.render( scene, camera );

			}
  }
}
