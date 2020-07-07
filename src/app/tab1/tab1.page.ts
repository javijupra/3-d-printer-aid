import { Component, HostListener, Directive, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import * as THREE from '../../../node_modules/three/build/three.module.js';
import {OrbitControls} from '../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {STLLoader} from '../../../node_modules/three/examples/jsm/loaders/STLLoader.js';

var scene;
var camera;
var threeRenderer;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

// @Directive({
// 	selector: '[stlviewer]'
// })

export class Tab1Page {
	
	// Grab handle on div to render into
	// @ViewChild('stlviewer') stlviewer: ElementRef;

	// Set up three.js resources
	// threeRenderer: any;
	// camera: any;
	// scene: any;
	loader: any;

	constructor(private renderer: Renderer2, private el: ElementRef) {

		threeRenderer = new THREE.WebGLRenderer( { antialias: true } );
		camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
		scene = new THREE.Scene();
		this.loader = new STLLoader();
	}

	ngOnInit() {

		camera.position.set( 20, 0.15, 20 );

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

		// Lights
		scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
		this.addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
		this.addShadowedLight( 0.5, 1, - 1, 0xffaa00, 1 );

		// Renderer
		threeRenderer.setPixelRatio( window.devicePixelRatio );
		threeRenderer.setSize( window.innerWidth, window.innerHeight );
		threeRenderer.outputEncoding = THREE.sRGBEncoding;

		threeRenderer.shadowMap.enabled = true;

		window.addEventListener( 'resize', this.onWindowResize, false );

	}

	ngAfterViewInit() {
	// ASCII file

	this.loader.load( '../../assets/Monkey.stl', function ( geometry ) {

		var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
		var mesh = new THREE.Mesh( geometry, material );
		
		// Compute the middle
		var middle = new THREE.Vector3();
		geometry.computeBoundingBox();
		geometry.boundingBox.getCenter(middle);

		mesh.position.set( 0, 0, 0 );
		mesh.rotation.set( - Math.PI / 2, 0, 0);
		mesh.scale.set( 0.2, 0.2, 0.2 );

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		scene.add( mesh );

		// Pull the camera away as needed
		
		var largestDimension = Math.max(geometry.boundingBox.max.x,
			geometry.boundingBox.max.y, geometry.boundingBox.max.z)
			camera.position.z = largestDimension * 1.5;

	});

		// this.renderer.appendChild(this.el.nativeElement, threeRenderer.domElement);
		document.getElementById("stlviewer").appendChild(threeRenderer.domElement);
		
		this.render();
	}

	render() {

		window.requestAnimationFrame(() => this.render());

		var timer = Date.now() * 0.0005;
		var cameraTarget = new THREE.Vector3( 0, - 0.25, 0 );

		camera.position.x = Math.cos( timer ) * 3;
		camera.position.z = Math.sin( timer ) * 3;

		camera.lookAt( cameraTarget );

		threeRenderer.render( scene, camera );

	}

	addShadowedLight( x, y, z, color, intensity ) {

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

	onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		threeRenderer.setSize( window.innerWidth, window.innerHeight );

	}
	
}
