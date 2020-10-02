//import type auto completion file
///<reference path='babylon.d.ts' />

//get our canvas
const canvas = document.getElementById('renderCanvas');

//create a Babylon.js engine, true means anti-aliasing
const engine = new BABYLON.Engine(canvas, true);

//*************************BELOW ARE CAMERAS*******************/
//create an Arc Rotate Camera
function creatArcRotateCamera(scene) {
    const arcRotateCamera = new BABYLON.ArcRotateCamera('arcRotateCamera', Math.PI / 2, Math.PI / 2, 6, BABYLON.Vector3.Zero(), scene);

    //restrain camera distance with model
    arcRotateCamera.lowerRadiusLimit = 5;
    arcRotateCamera.upperRadiusLimit = 9;

    //limit horizonatal camera rotation
    arcRotateCamera.upperAlphaLimit = Math.PI / 2;
    arcRotateCamera.lowerAlphaLimit = Math.PI / 3;


    //limit vertial camera rotation 
    arcRotateCamera.upperBetaLimit = Math.PI / 2;
    arcRotateCamera.lowerBetaLimit = Math.PI / 3;

    //let user control the Arc Rotate Camera
    arcRotateCamera.attachControl(canvas, true);
}

//create an Universal Camera for mouse scroll camera movement
var universalCamera;

function createUniversalCamera(scene) {
    universalCamera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 5, 0), scene);
    universalCamera.setTarget(new BABYLON.Vector3(0, 8, 10));

    //Set the ellipsoid around the camera
    universalCamera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    scene.collisionsEnabled = true;
    universalCamera.checkCollisions = true;

    universalCamera.attachControl(canvas, true);

    //lock camera rotation
    // scene.registerBeforeRender(function () {
    //     camera.position.y = 100;
    //     camera.rotation.x = 90;
    // })
}
//*************************ABOVES ARE CAMERAS*******************/

//*************************BELOW ARE CAMERAS ANIMATION*******************/

function animateUniversalCamera(scene) {
    //First step, creating an animation object; new BABYLON.Animation("nameOfAnimation", "propertyConcerns",FPS#, BABYLON.Animation.ANIMATIONTYPE_XXXX, BABYLON.Animation.ANIMATIONLOOPMODE_XXXX);
    var universalCameraAnimation = new BABYLON.Animation("universalCameraAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    
    //Second step, define a collection of keys
    // An array with all animation keys
    var keys = [];

    //At the animation key "0", the value of position is "(0, 5, 0)"
    keys.push({
        frame: 0,
        value: new BABYLON.Vector3(0, 5, 0),
        // outTangent: BABYLON.Vector3.Forward()
    });
    //At the animation key "30", the value of position is "(0, 5, 5)"
    keys.push( {
        frame: 30,
        value: new BABYLON.Vector3(0, 5, 5),
        //inTangent: BABYLON.Vector3.Backward()
    });
    //At the animation key "60", the value of position is "(0, 10, 5)"
    keys.push( {
        frame:60, 
        value: new BABYLON.Vector3(0,10,5),
    })
    //Adding the animation array to the animation object:
    universalCameraAnimation.setKeys(keys);

    //Link this animation to universalCamera:
    universalCamera.animations = [];
    universalCamera.animations.push(universalCameraAnimation);

    //launch animation; (animated object, starting frame, end frame, true, speed)
    
}
//*************************ABOVES ARE CAMERAS ANIMATION*******************/

//Create a Hemispheric Light
function createHemisphericLight(scene) {
    const hemisphericLight = new BABYLON.HemisphericLight('hemisphericLight', BABYLON.Vector3(0, 5, 0), scene);

    //adjust light intensity
    hemisphericLight.intensity = 1;
    hemisphericLight.groundColor = new BABYLON.Color3.FromHexString('#ffffff');
}

//create a HDR skybox 
function createSkybox(scene) {
    new BABYLON.HDRCubeTexture("images/noon_grass_2k.hdr", scene);
}

//load online GLTF model
function importOnlineGLTFModel(scene) {
    new BABYLON.SceneLoader.ImportMesh('', 'https://alexli016.github.io/stemCell_intro/', 'StemCel_ani.gltf', scene, (meshes) => {
        //scaling, postioning and rotating gltf model
        meshes.forEach((mesh) => {
            mesh.scaling = new BABYLON.Vector3(2, 2, 2);
            mesh.position = new BABYLON.Vector3.Zero();
            mesh.rotation = new BABYLON.Vector3(0, 0, 0);

            mesh.checkCollisions = true;
            //play animations
            scene.animationGroups[1].start(true);
            scene.animationGroups[2].start(true);


        })
    })

}

//load local GLTF model
function importLocalGLTFModel(scene) {
    new BABYLON.SceneLoader.ImportMesh('', 'models/', 'baganTemple.gltf', scene, (meshes) => {
        //scaling, postioning and rotating gltf model
        meshes.forEach((mesh) => {
            mesh.scaling = new BABYLON.Vector3(1, 1, 1);
            mesh.position = new BABYLON.Vector3.Zero();
            mesh.rotation = new BABYLON.Vector3(0, 0, 0);

            mesh.checkCollisions = true;
            //play animations
            scene.animationGroups[1].start(true);
            scene.animationGroups[2].start(true);
        })
    })

}

//scroll to move camera position, move mouse to change camera perspective. It can only be used when universal camera is enabled
function scrollToMoveCamera(scene) {
    scene.onPrePointerObservable.add(function (pointerInfo, eventState) {
        console.log('pointerInfo.type=' + pointerInfo.type);
        var event = pointerInfo.event;
        console.log('pointerInfo =' + pointerInfo);
        console.log('event =' + event);
        var delta = 0;
        // var delta = event.wheelDelta;
        // console.log('delta =' + delta);

        if (event.wheelDelta) {
            delta = event.wheelDelta;
            console.log('event.wheelDelta = ' + event.wheelDelta);
        }
        else if (event.detail) {
            delta = -event.detail;
            console.log('event.detail =' + event.detail);
        }

        // if (delta) {
        var dir = scene.activeCamera.getDirection(BABYLON.Axis.Z);
        console.log("dir: ", dir);
        console.log('Z =' + BABYLON.Axis.Z);
        //scene.activeCamera.position.z += delta/10;

        if (delta > 0)
            scene.activeCamera.position.addInPlace(dir);
        else
            scene.activeCamera.position.subtractInPlace(dir);
        // }
    }, BABYLON.PointerEventTypes.POINTERWHEEL)

    scene.onPrePointerObservable.add(function (pointerInfo, eventState) {
        var event02 = pointerInfo.event;
        var mousePositionX = event02.clientX;
        var mousePositionY = event02.clientY;
        console.log('mousePosition X =' + mousePositionX);
        console.log('mousePosition Y =' + mousePositionY);

    }, BABYLON.PointerEventTypes.POINTERMOVE)
}


//Debug: show Scene Explore and Inspector
function debug(scene) {
    //Debug: show Scene Explore and Inspector
    scene.debugLayer.show();
}

//create the main scene
function createScene() {
    //create a local scene variabe
    const scene = new BABYLON.Scene(engine);
    //scene background color
    scene.clearColor = new BABYLON.Color3.FromHexString('#000000');

    //create an Arc Rotate Camera
    // creatArcRotateCamera(scene);

    //create an iniversal camera to enable scroll to control camera movement
    createUniversalCamera(scene);

    //animate Universal Camera
    animateUniversalCamera(scene);

    //creat a HemisphericLight
    createHemisphericLight(scene);

    //create HDR Skybox
    createSkybox(scene);

    //import online glTF models
    // importOnlineGLTFModel(scene);

    //import local glTF models
    importLocalGLTFModel(scene);

    //scroll to move camera position, move mouse to change camera perspective. It can only be used when universal camera is enabled
    //scrollToMoveCamera(scene);

    //debug scene
    // debug(scene);

    //start scrollama
    startScrollama ();

    //return scene
    return scene;
}

//pass local scene to global scene
const scene = createScene();

//run the engine
engine.runRenderLoop(() => {
    scene.render();
});

// the canvas/window resize event handler
window.addEventListener('resize', function () {
    engine.resize();
});



//==========Adding scrollama.js below==================
function startScrollama () {

const scrollamaScene = scrollama();
// setup the instance, pass callback functions

scrollamaScene
    .setup({
        step: ".step",
        debug: true,
        offset: 0
    })

    .onStepEnter(response => {
        // { element, index, direction }

        function changeCameraPosition01() {

            let newIndex = response.index;
            let direction = response.direction;

            if (newIndex == 0 && direction == 'down') {
                scene.beginAnimation(universalCamera, 0, 30, true, 0.2);
            }
            else if (newIndex == 0 && direction == 'up') {

            }
            else if (newIndex == 1 && direction == "down") {
                // scene.beginAnimation(universalCamera, 30, 60, true, 0.2);
            }
            else if (newIndex == 1 && direction == "up") {

            }
            else if (newIndex == 2 && direction == "down") {

            }
            else if (newIndex == 2 && direction == "up") {

            }
        }

        changeCameraPosition01();

        console.log("Entered");
        console.log(response.index);
        console.log(response.direction);

    })

    .onStepExit(response => {
        // { element, index, direction }
        function changeCameraPosition02() {

            let newIndex = response.index;
            let direction = response.direction;

            if (newIndex == 0 && direction == "down") {
                // scene.beginAnimation(universalCamera, 0, 30, true, 0.2);
            }
            else if (newIndex == 0 && direction == "up") {
                // scene.beginAnimation(universalCamera, 0, 30, true, 0.2);

            }
            else if (newIndex == 1 && direction == "down") {

            }
            else if (newIndex == 1 && direction == "up") {

            }
            else if (newIndex == 2 && direction == "down") {

            }
            else if (newIndex == 2 && direction == "up") {

            }
        }

        changeCameraPosition02();

        console.log("Exit");
        console.log(response.index);
        console.log(response.direction);

    })

// setup resize event
window.addEventListener("resize", scrollamaScene.resize);
//==========Ending of scrollama.js==================

}

