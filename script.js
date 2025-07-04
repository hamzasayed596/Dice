const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(400, 400);
document.body.insertBefore(renderer.domElement, document.getElementById('container').nextSibling);
const dice = createDice();
scene.add(dice);
camera.position.z = 5;
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);
let isRolling = false;
let rollSpeed = 0;
let finalNumber = null;
function createDice() 
{
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const materials = [];
    for (let i = 1; i <= 6; i++) 
    {
        materials.push(createFaceMaterial(i));
    }
    const mesh = new THREE.Mesh(geometry, materials);
    return mesh;
}
function createFaceMaterial(number) 
{
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 256, 256);
    context.fillStyle = '#000000';
    context.font = 'Bold 120px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(number.toString(), 128, 128);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return new THREE.MeshBasicMaterial({ map: texture });
}
document.getElementById('throwButton').addEventListener('click', function() 
{
    if (!isRolling) 
    {
        startRoll();
    }
});
function startRoll() 
{
    isRolling = true;
    rollSpeed = 0.5;
    finalNumber = null;
    document.getElementById('result').textContent = 'Rolling...';
    document.getElementById('throwButton').disabled = true;
}
function endRoll() 
{
    isRolling = false;
    document.getElementById('result').textContent = `You rolled: ${finalNumber}`;
    document.getElementById('throwButton').disabled = false;
}
function getTopFaceNumber() 
{
    const up = new THREE.Vector3(0, 1, 0);
    const matrix = new THREE.Matrix4().extractRotation(dice.matrixWorld);
    up.applyMatrix4(matrix);
    const faceNormals = 
    [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1)
    ];
    let maxDot = -Infinity;
    let topFaceIndex = 2;
    faceNormals.forEach((normal, index) => 
    {
        const dot = up.dot(normal);
        if (dot > maxDot) 
        {
            maxDot = dot;
            topFaceIndex = index;
        }
    });
    const faceNumberMapping = [6, 5, 1, 2, 3, 4];
    return faceNumberMapping[topFaceIndex];
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
            finalNumber = getTopFaceNumber();
            endRoll();
        }
    }
    renderer.render(scene, camera);
}
window.addEventListener('resize', function() 
{
    const container = document.getElementById('container');
    const width = Math.min(400, window.innerWidth - 40);
    const height = width;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
window.dispatchEvent(new Event('resize'));
animate();
