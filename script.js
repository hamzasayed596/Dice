const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(400, 400);
document.body.appendChild(renderer.domElement);
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
const dice = new THREE.Mesh(geometry, material);
scene.add(dice);
const numberTexture = createNumberTexture();
const materials = [
    new THREE.MeshBasicMaterial({ color: 0xffffff }), 
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    new THREE.MeshBasicMaterial({ map: numberTexture }) 
];
dice.material = materials;
camera.position.z = 5;
function createNumberTexture() 
{
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    context.fillStyle = '#000000';
    context.font = 'Bold 120px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('1', 128, 128);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}
function updateNumber(number) 
{
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    context.fillStyle = '#000000';
    context.font = 'Bold 120px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(number.toString(), 128, 128);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    materials[5].map = texture;
    materials[5].needsUpdate = true;
}
let isRolling = false;
let rollSpeed = 0;
document.getElementById('throwButton').addEventListener('click', function() 
{
    if (!isRolling) 
    {
        isRolling = true;
        rollSpeed = 0.2;
        document.getElementById('result').textContent = 'Rolling...';
    }
});
function animate() 
{
    requestAnimationFrame(animate);
    if (isRolling) 
    {
        dice.rotation.x += rollSpeed * Math.random();
        dice.rotation.y += rollSpeed * Math.random();
        dice.rotation.z += rollSpeed * Math.random();
        rollSpeed *= 0.98; 
        if (rollSpeed < 0.01) 
        {
            isRolling = false;
            const randomNumber = Math.floor(Math.random() * 6) + 1;
            updateNumber(randomNumber);
            document.getElementById('result').textContent = `Result: ${randomNumber}`;
        }
    }
    
    renderer.render(scene, camera);
}

animate();
