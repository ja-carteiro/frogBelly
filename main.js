const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); // Generate the BABYLON 3D engine

// Add your code here matching the playground format
const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    //    BABYLON.SceneLoader.ImportMesh("Sapo_verde", "./", "sapo.glb", scene, function (meshes) {
    //        const sapo = meshes[0]; // Seleciona o primeiro mesh importado do modelo
    //    
    //        // Configurações que estavam no box
    //        sapo.position = new BABYLON.Vector3(0, 1, 0);
    //        sapo.scaling = new BABYLON.Vector3(1, 1, 1); // Ajuste a escala, se necessário
    //    
    //        // Cria um material, como fazia para o box
    //        const material = new BABYLON.StandardMaterial("sapoMaterial", scene);
    //        material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Cor de exemplo
    //        sapo.material = material;
    //    
    //        // Aqui você pode transferir toda a lógica do jogo para o mesh importado
    //        function moveBox(event) {
    //            switch (event.key) {
    //                case 'w': // Move para frente (para cima no eixo Y)
    //                    sapo.position.z += 0.5;
    //                    break;
    //                case 's': // Move para trás (para baixo no eixo Y)
    //                    sapo.position.z -= 0.5;
    //                    break;
    //                case 'a': // Move para a esquerda (no eixo X)
    //                    sapo.position.x -= 0.5;
    //                    break;
    //                case 'd': // Move para a direita (no eixo X)
    //                    sapo.position.x += 0.5;
    //                    break;
    //            }
    //        }
    //    
    //        window.addEventListener('keydown', moveBox);
    //        
    //        scene.onBeforeRenderObservable.add(() => {
    //            if (sapo.intersectsMesh(fly, true)) {
    //                sapo.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
    //                score++;
    //                fly.dispose();
    //                flyRemoved = true;
    //    
    //                let growthIndex = 0.1
    //    
    //                sapo.scaling.x += growthIndex;
    //                sapo.scaling.y += growthIndex;
    //                sapo.scaling.z += growthIndex;
    //                sapo.position.y += growthIndex / 2;
    //    
    //                fly = createFly()
    //            } else {
    //                sapo.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
    //            }
    //
    //            if (true) {
    //                sapo.rotation.y += 1;
    //            }
    //    
    //            camera.setTarget(sapo.position);
    //    
    //            scoreText.text = "Score: " + score;
    //        })
    //    });

    BABYLON.SceneLoader.ImportMeshAsync("", "./", "sapo.glb", scene).then((result) => {
        const sapo = scene.getMeshByName("Sapo_verde");
        sapo.rotationQuaternion = null;
        sapo.position.y = 1;
        sapo.rotation.x = BABYLON.Tools.ToRadians(180);

        // Aqui você pode transferir toda a lógica do jogo para o mesh importado
        function moveBox(event) {
            switch (event.key) {
                case 'w': // Move para frente (para cima no eixo Y)
                    sapo.rotation.y = BABYLON.Tools.ToRadians(0);
                    sapo.position.z += 0.5;
                    break;
                case 's': // Move para trás (para baixo no eixo Y)
                    sapo.rotation.y = BABYLON.Tools.ToRadians(180);
                    sapo.position.z -= 0.5;
                    break;
                case 'a': // Move para a esquerda (no eixo X)
                    sapo.rotation.y = BABYLON.Tools.ToRadians(90);
                    sapo.position.x -= 0.5;
                    break;
                case 'd': // Move para a direita (no eixo X)
                    sapo.rotation.y = BABYLON.Tools.ToRadians(270);
                    sapo.position.x += 0.5;
                    break;
            }
        }

        window.addEventListener('keydown', moveBox);

        scene.onBeforeRenderObservable.add(() => {
            if (sapo.intersectsMesh(fly, false)) {
                sapo.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
                score++;
                fly.dispose();
                flyRemoved = true;
    
                let growthIndex = 1
        
                sapo.scaling.x += growthIndex;
                sapo.scaling.y += growthIndex;
                sapo.scaling.z += growthIndex;
                sapo.position.y += growthIndex / 2;
        
                fly = createFly()
            } else {
                sapo.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
            }
        
            camera.setTarget(sapo.position);
        
            scoreText.text = "Score: " + score;
        })
    });

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


    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 0, 0));
    light.intensity = 0.6;
    light.direction = new BABYLON.Vector3(1, 0, 1);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20 });
    ground.material = new BABYLON.StandardMaterial("myMaterial", scene)
    ground.material.emissiveColor = new BABYLON.Color3(1, 0, 0)

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