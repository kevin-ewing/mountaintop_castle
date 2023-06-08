import * as THREE from 'three';

			import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

			import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
			import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';


			import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
			import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
			import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
			import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';




			const clock = new THREE.Clock();
			const container = document.getElementById( 'container' );
			let composer;

			const renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.shadowMap.enabled = true;

			
			container.appendChild( renderer.domElement );

			const scene = new THREE.Scene();
			scene.background = new THREE.Color( 0x47a9ff );
			scene.fog = new THREE.Fog( 0x366c9c, 6, 25 );


			const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, .1, 50);
			camera.position.set(-6, .9, -3);
			

			const controls = new OrbitControls( camera, renderer.domElement );
			controls.target.set( 0, 0.5, 0 );
			controls.update();
			controls.enablePan = false;
			controls.enableDamping = true;
			controls.minDistance = 6;
			controls.maxDistance = 30;

			const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );

			const loader = new GLTFLoader();
			loader.setDRACOLoader( dracoLoader );

			var loadingDiv = document.getElementById("loadingDiv");

			loader.load( 'models/mountaintop_castle.glb', function ( gltf ) {

				const model = gltf.scene;
				model.position.set( 0, 0, 0 );
				model.scale.set( 0.5, 0.5, 0.5);
				scene.add( model );

				model.traverse( function ( object ) {

					if ( object.isMesh ){
						object.castShadow = true;
						object.receiveShadow = true;
					}


				loadingDiv.classList.add("hidden");
				} );

				animate();

			}, undefined, function ( e ) {

				console.error( e );

			} );

			const renderScene = new RenderPass( scene, camera );

			const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
			bloomPass.threshold = .1;
			bloomPass.strength = .2,
			bloomPass.radius = .03;

			const outputPass = new OutputPass( THREE.ReinhardToneMapping );

			composer = new EffectComposer( renderer );
			composer.addPass( renderScene );
			composer.addPass( bloomPass );
			composer.addPass( outputPass );


			const dirLight = new THREE.DirectionalLight( 0xffddde , 12);
			
				dirLight.position.set( -4, 3, 10);
				dirLight.castShadow = true;
				// dirLight.shadow.camera.near = 0.1;
				// dirLight.shadow.camera.far = 40;
				dirLight.shadow.mapSize.width = 1024;
				dirLight.shadow.mapSize.height = 1024;
				scene.add( dirLight );

			scene.add( new THREE.HemisphereLight( 0xffddde, 0xceecf5, .3 ));


			window.onresize = function () {

				const width = window.innerWidth;
				const height = window.innerHeight;

				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				renderer.setSize( width, height );

				bloomComposer.setSize( width, height );
				composer.setSize( width, height );

				render();

			};


			function animate() {
				requestAnimationFrame( animate );

				controls.update();
				composer.render( scene, camera );

			}

