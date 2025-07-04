const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
const dice = createDice();
scene.add(dice);
camera.position.z = 5;
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);
function createDice() 
{
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const materials = [];
    for (let i = 1; i <= 6; i++) 
    {
        materials.push(createFaceMaterial(i));
    }
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.castShadow = true;
    return mesh;
}
function createFaceMaterial(number) 
{
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 512, 512);
    context.fillStyle = '#000000';
    context.font = 'Bold 300px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(number.toString(), 256, 256);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return new THREE.MeshStandardMaterial
    ({ 
        map: texture,
        roughness: 0.3,
        metalness: 0.1
    });
}
let isRolling = false;
let rollSpeed = 0;
let finalNumber = null;
let resultDisplayed = false;
const resultElement = document.getElementById('result');
const throwButton = document.getElementById('throwButton');
function startRoll() 
{
    isRolling = true;
    rollSpeed = 0.5;
    finalNumber = null;
    resultDisplayed = false;
    resultElement.style.opacity = '0';
    throwButton.disabled = true;
}
function getVisibleNumber() 
{
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.normalize();
    const faces = 
    [
        { normal: new THREE.Vector3(1, 0, 0), number: 6 },
        { normal: new THREE.Vector3(-1, 0, 0), number: 5 },
        { normal: new THREE.Vector3(0, 1, 0), number: 1 },
        { normal: new THREE.Vector3(0, -1, 0), number: 2 },
        { normal: new THREE.Vector3(0, 0, 1), number: 3 },
        { normal: new THREE.Vector3(0, 0, -1), number: 4 }
    ];
    let maxDot = -Infinity;
    let visibleNumber = 1;
    faces.forEach(face => 
    {
        const normal = face.normal.clone().applyMatrix4(dice.matrixWorld).normalize();
        const dot = normal.dot(cameraDirection);
        if (dot > maxDot) 
        {
            maxDot = dot;
            visibleNumber = face.number;
        }
    });
    return visibleNumber;
}
function animate() 
{
    requestAnimationFrame(animate);
    if (isRolling) 
    {
        dice.rotation.x += rollSpeed * (0.2 + Math.random() * 0.8);
        dice.rotation.y += rollSpeed * (0.2 + Math.random() * 0.8);
        dice.rotation.z += rollSpeed * (0.2 + Math.random() * 0.8);
        rollSpeed *= 0.97; 
        if (rollSpeed < 0.02) 
        {
            dice.rotation.x = Math.round(dice.rotation.x / (Math.PI/2)) * (Math.PI/2);
            dice.rotation.y = Math.round(dice.rotation.y / (Math.PI/2)) * (Math.PI/2);
            dice.rotation.z = Math.round(dice.rotation.z / (Math.PI/2)) * (Math.PI/2);
            isRolling = false;
            finalNumber = getVisibleNumber();
            if (!resultDisplayed) 
            {
                resultElement.textContent = finalNumber;
                resultElement.style.opacity = '1';
                throwButton.disabled = false;
                resultDisplayed = true;
            }
        }
    }
    renderer.render(scene, camera);
}
throwButton.addEventListener('click', startRoll);
window.addEventListener('resize', function() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
window.dispatchEvent(new Event('resize'));
animate();
