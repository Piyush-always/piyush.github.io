const preload = () => {
	let manager = new THREE.LoadingManager();
	manager.onLoad = function() { 
	  const environment = new Environment( typo, particle );
	}
  
	var typo = null;
	const loader = new THREE.FontLoader( manager );
	const font = loader.load('https://res.cloudinary.com/dydre7amr/raw/upload/v1612950355/font_zsd4dr.json', function ( font ) { typo = font; });
	const particle = new THREE.TextureLoader( manager ).load( 'https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png');
  }
  
  if ( document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll))
	preload ();
  else
	document.addEventListener("DOMContentLoaded", preload ); 
  
  class Environment {
	constructor( font, particle ){ 
	  this.font = font;
	  this.particle = particle;
	  this.container = document.querySelector( '#magic' );
	  this.scene = new THREE.Scene();
	  this.createCamera();
	  this.createRenderer();
	  this.setup();
	  this.bindEvents();
	}
  
	bindEvents(){
	  window.addEventListener( 'resize', this.onWindowResize.bind( this ));
	}
  
	setup(){ 
	  this.createParticles = new CreateParticles( this.scene, this.font, this.particle, this.camera, this.renderer );
	}
  
	render() {
	   this.createParticles.render()
	   this.renderer.render( this.scene, this.camera )
	}
  
	createCamera() {
	  this.camera = new THREE.PerspectiveCamera( 65, this.container.clientWidth /  this.container.clientHeight, 1, 10000 );
	  this.camera.position.set( 0,0, 100 );
	}
  
	createRenderer() {
	  this.renderer = new THREE.WebGLRenderer();
	  this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
	  this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2));
	  this.renderer.outputEncoding = THREE.sRGBEncoding;
	  this.container.appendChild( this.renderer.domElement );
	  this.renderer.setAnimationLoop(() => { this.render() })
	}
  
	onWindowResize(){
	  this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
	  this.camera.updateProjectionMatrix();
	  this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
	}
  }
  
  class CreateParticles {
	constructor( scene, font, particleImg, camera, renderer ) {
	  this.scene = scene;
	  this.font = font;
	  this.particleImg = particleImg;
	  this.camera = camera;
	  this.renderer = renderer;
	  
	  this.raycaster = new THREE.Raycaster();
	  this.mouse = new THREE.Vector2(-200, 200);
	  this.colorChange = new THREE.Color();
	  this.buttom = false;
  
	  this.data = {
		text: 'FUTURE\nIS NOW',
		amount: 1500,
		particleSize: 1,
		particleColor: 0xffffff,
		textSize: 16,
		area: 250,
		ease: .05,
	  }
  
	  this.setup();
	  this.bindEvents();
	}
  
	setup(){
	  const geometry = new THREE.PlaneGeometry( this.visibleWidthAtZDepth( 100, this.camera ), this.visibleHeightAtZDepth( 100, this.camera ));
	  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true } );
	  this.planeArea = new THREE.Mesh( geometry, material );
	  this.planeArea.visible = false;
	  this.createText();
	}
  
	bindEvents() {
	  document.addEventListener( 'mousedown', this.onMouseDown.bind( this ));
	  document.addEventListener( 'mousemove', this.onMouseMove.bind( this ));
	  document.addEventListener( 'mouseup', this.onMouseUp.bind( this ));
	}
  
	onMouseDown(){
	  this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	  this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
  