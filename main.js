const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); // Generate the BABYLON 3D engine

// Add your code here matching the playground format
const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 });
    box.position = new BABYLON.Vector3(0, 0.5, 0)
    box.material = new BABYLON.StandardMaterial("boxMaterial", scene)
    box.speed = 0.5

    const keysPressed = {};

    function handleKeyDown(event) {
        keysPressed[event.key] = true;
    };

    function handleKeyUp(event) {
        keysPressed[event.key] = false;
    };

    function waitForFrames(scene, frameCount, callback) {
        let currentFrame = 0;

        const observer = scene.onBeforeRenderObservable.add(() => {
            currentFrame++;
            if (currentFrame >= frameCount) {
                scene.onBeforeRenderObservable.remove(observer); // Para de observar
                callback(); // Executa a função após os frames
            }
        });
    }

    justJumped = false

    function updatePosition(entity) {
        if (keysPressed['w'] || keysPressed['W']) {
            entity.position.z += entity.speed / 5;
            waitForFrames(scene, 5, () => {
                entity.position.z += entity.speed / 10
            });
            waitForFrames(scene, 10, () => {
                entity.position.z += entity.speed / 20
            }); // Move para frente
            waitForFrames(scene, 20, () => {
                entity.position.z += entity.speed / 30
            }); // Move para frente
        }
        if (keysPressed['s'] || keysPressed['S']) {
            entity.position.z -= entity.speed / 5;
            waitForFrames(scene, 5, () => {
                entity.position.z -= entity.speed / 10
            });
            waitForFrames(scene, 10, () => {
                entity.position.z -= entity.speed / 20
            }); // Move para trás
            waitForFrames(scene, 20, () => {
                entity.position.z -= entity.speed / 30
            }); // Move para trás
        }
        if (keysPressed['a'] || keysPressed['A']) {
            entity.position.x -= entity.speed / 5;
            waitForFrames(scene, 5, () => {
                entity.position.x -= entity.speed / 10
            });
            waitForFrames(scene, 10, () => {
                entity.position.x -= entity.speed / 20
            }); // Move para a esquerda
            waitForFrames(scene, 20, () => {
                entity.position.x -= entity.speed / 30
            }); // Move para a esquerda
        }
        if (keysPressed['d'] || keysPressed['D']) {
            entity.position.x += entity.speed / 5;
            waitForFrames(scene, 5, () => {
                entity.position.x += entity.speed / 10
            });
            waitForFrames(scene, 10, () => {
                entity.position.x += entity.speed / 20
            }); // Move para a direita
            waitForFrames(scene, 20, () => {
                entity.position.x += entity.speed / 30
            }); // Move para a direita
        }
        if (keysPressed[' '] && justJumped === false) {
            entity.position.y += entity.speed / 5;
            //waitForFrames(scene, 5, () => {
            //    entity.rotation.x += entity.speed;
            //});
            //waitForFrames(scene, 10, () => {
            //    entity.rotation.x += entity.speed;
            //});
            waitForFrames(scene, 10, () => {
                entity.position.y -= entity.speed / 5;
                justJumped = true;
            });
            //waitForFrames(scene, 20, () => {
            //    entity.rotation.x = Math.PI / 2;
            //});
            waitForFrames(scene, 50, () => {
                justJumped = false;
            });
        }
    };

    // Adiciona os eventos
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Adicionando a GUI
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");

    // Criando um retângulo para o balão
    const scoreRectangle = new BABYLON.GUI.Rectangle();
    scoreRectangle.top = 400;
    scoreRectangle.width = "200px";
    scoreRectangle.height = "100px";
    scoreRectangle.cornerRadius = 30;
    scoreRectangle.color = "black";
    scoreRectangle.thickness = 5;
    scoreRectangle.background = "rgba(0, 0, 0, 0.5)";
    advancedTexture.addControl(scoreRectangle);

    // Criando o texto do score
    const scoreText = new BABYLON.GUI.TextBlock();
    scoreText.text = "Score: 0";
    scoreText.color = "white";
    scoreText.fontSize = 34;
    scoreText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    scoreText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    scoreRectangle.addControl(scoreText);
    let score = 0

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    let fly = createFly()

    function createFly() {
        const newFly = BABYLON.MeshBuilder.CreateBox("fly", { size: 0.25 }, scene);
        newFly.position.y = 0.5;
        newFly.position.x = getRandom(-10, 10); // Posição aleatória no eixo X
        newFly.position.z = getRandom(-10, 10); // Posição aleatória no eixo Z
        return newFly;
    }

    let flyRemoved = false;


    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 20, -10));
    camera.panningSensibility = 0;
    camera.setTarget(box.position);
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 0, 0));
    light.intensity = 0.6;
    light.direction = new BABYLON.Vector3(0, 0.5, 2);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20 });
    ground.material = new BABYLON.StandardMaterial("myMaterial", scene)
    ground.material.emissiveColor = new BABYLON.Color3(1, 0, 0)

    scene.onBeforeRenderObservable.add(() => {
        updatePosition(box)

        if (box.intersectsMesh(fly, true)) {
            box.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
            score++;
            fly.dispose();
            flyRemoved = true;

            let growthIndex = 0.1
            let speedGrowthIndex = growthIndex / 5;

            box.scaling.x += growthIndex;
            box.scaling.y += growthIndex;
            box.scaling.z += growthIndex;
            box.position.y += growthIndex / 1.99;
            box.speed += speedGrowthIndex;

            fly = createFly()
        } else {
            box.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
        }

        

        scoreText.text = "Score: " + score;

        if (score >= 3) {
            box.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
        }
        if (score >= 5) {
            box.material.emissiveColor = new BABYLON.Color3(0, 0, 1);
        }
        if (score >= 7) {
            box.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
        }
        if (score >= 9) {
            box.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
        }
    })
    return scene;
};

const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});

// Olhar pra onde anda
//
// 