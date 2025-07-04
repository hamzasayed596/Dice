// تهيئة المشهد
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(400, 400);
document.body.appendChild(renderer.domElement);

// إنشاء النرد
const geometry = new THREE.BoxGeometry(2, 2, 2);
const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // الجانب الأحمر
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // الجانب الأخضر
    new THREE.MeshBasicMaterial({ color: 0x0000ff }), // الجانب الأزرق
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // الجانب الأصفر
    new THREE.MeshBasicMaterial({ color: 0xff00ff }), // الجانب الأرجواني
    new THREE.MeshBasicMaterial({ color: 0x00ffff })  // الجانب السماوي
];
const dice = new THREE.Mesh(geometry, materials);
scene.add(dice);

camera.position.z = 5;

// إعداد النقاط على النرد (لتمثيل الأرقام)
const dotsGeometry = new THREE.SphereGeometry(0.15, 32, 32);
const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

// إضافة النقاط لكل وجه
function addDots() {
    // سنضيف النقاط يدويًا لكل وجه
    // يمكنك تحسين هذا الجزء ليكون أكثر دقة
    const positions = [
        // وجه 1 (نقطة واحدة في المنتصف)
        [{ x: 0, y: 0, z: 1.01 }],
        
        // وجه 2 (نقطتان قطريتان)
        [{ x: -0.7, y: -0.7, z: 1.01 }, { x: 0.7, y: 0.7, z: 1.01 }],
        
        // وجه 3 (3 نقاط)
        [{ x: -0.7, y: -0.7, z: 1.01 }, { x: 0, y: 0, z: 1.01 }, { x: 0.7, y: 0.7, z: 1.01 }],
        
        // وجه 4 (4 نقاط في الزوايا)
        [{ x: -0.7, y: -0.7, z: 1.01 }, { x: 0.7, y: -0.7, z: 1.01 }, 
         { x: -0.7, y: 0.7, z: 1.01 }, { x: 0.7, y: 0.7, z: 1.01 }],
        
        // وجه 5 (5 نقاط)
        [{ x: -0.7, y: -0.7, z: 1.01 }, { x: 0.7, y: -0.7, z: 1.01 }, 
         { x: 0, y: 0, z: 1.01 }, 
         { x: -0.7, y: 0.7, z: 1.01 }, { x: 0.7, y: 0.7, z: 1.01 }],
        
        // وجه 6 (6 نقاط)
        [{ x: -0.7, y: -0.7, z: 1.01 }, { x: 0, y: -0.7, z: 1.01 }, { x: 0.7, y: -0.7, z: 1.01 }, 
         { x: -0.7, y: 0.7, z: 1.01 }, { x: 0, y: 0.7, z: 1.01 }, { x: 0.7, y: 0.7, z: 1.01 }]
    ];

    positions.forEach((face, faceIndex) => {
        face.forEach(pos => {
            const dot = new THREE.Mesh(dotsGeometry, dotMaterial);
            dot.position.set(pos.x, pos.y, pos.z);
            
            // تدوير النقاط لتكون على الوجه الصحيح
            if (faceIndex === 0) dot.rotation.x = Math.PI / 2;
            else if (faceIndex === 1) dot.rotation.y = Math.PI / 2;
            else if (faceIndex === 2) dot.rotation.z = Math.PI / 2;
            else if (faceIndex === 3) dot.rotation.x = -Math.PI / 2;
            else if (faceIndex === 4) dot.rotation.y = -Math.PI / 2;
            
            dice.add(dot);
        });
    });
}

addDots();

// متغيرات للتحريك
let isRolling = false;
let rollSpeed = 0;

// زر الرمي
document.getElementById('throwButton').addEventListener('click', function() {
    if (!isRolling) {
        isRolling = true;
        rollSpeed = 0.2;
        document.getElementById('result').textContent = '';
    }
});

// دورة التحريك
function animate() {
    requestAnimationFrame(animate);
    
    if (isRolling) {
        // زيادة سرعة الدوران بشكل عشوائي
        dice.rotation.x += rollSpeed * Math.random();
        dice.rotation.y += rollSpeed * Math.random();
        dice.rotation.z += rollSpeed * Math.random();
        
        rollSpeed *= 0.98; // تقليل السرعة تدريجيًا
        
        if (rollSpeed < 0.01) {
            isRolling = false;
            
            // تحديد الرقم الظاهر (1-6)
            const randomNumber = Math.floor(Math.random() * 6) + 1;
            document.getElementById('result').textContent = `الرقم: ${randomNumber}`;
        }
    }
    
    renderer.render(scene, camera);
}

animate();
