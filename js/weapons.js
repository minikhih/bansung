export class Weapon {
    constructor(type) {
        this.type = type;
        this.setupWeapon();
    }

    setupWeapon() {
        const weapons = {
            shotgun: {
                name: 'Súng Săn',
                icon: '🔫',
                damage: 80,
                fireRate: 1000, // ms
                ammo: 8,
                maxAmmo: 8,
                reloadTime: 2000,
                bulletCount: 8, // Bắn nhiều đạn
                spread: 0.3,
                range: 20,
                bulletSpeed: 50,
                model: this.createShotgunModel()
            },
            rifle: {
                name: 'Súng Trường',
                icon: '🎯',
                damage: 45,
                fireRate: 150,
                ammo: 30,
                maxAmmo: 30,
                reloadTime: 2500,
                bulletCount: 1,
                spread: 0.05,
                range: 50,
                bulletSpeed: 80,
                model: this.createRifleModel()
            },
            sniper: {
                name: 'Súng Bắn Tỉa',
                icon: '🔭',
                damage: 150,
                fireRate: 1500,
                ammo: 5,
                maxAmmo: 5,
                reloadTime: 3000,
                bulletCount: 1,
                spread: 0.01,
                range: 100,
                bulletSpeed: 120,
                model: this.createSniperModel()
            },
            laser: {
                name: 'Súng Laser',
                icon: '⚡',
                damage: 60,
                fireRate: 100,
                ammo: 100,
                maxAmmo: 100,
                reloadTime: 4000,
                bulletCount: 1,
                spread: 0.02,
                range: 40,
                bulletSpeed: 100,
                model: this.createLaserModel()
            },
            rocket: {
                name: 'Súng Rocket',
                icon: '🚀',
                damage: 200,
                fireRate: 2000,
                ammo: 3,
                maxAmmo: 3,
                reloadTime: 4000,
                bulletCount: 1,
                spread: 0.1,
                range: 60,
                bulletSpeed: 30,
                model: this.createRocketModel()
            }
        };

        const config = weapons[this.type];
        Object.assign(this, config);
    }

    createShotgunModel() {
        const group = new THREE.Group();
        
        // Thân súng
        const bodyGeo = new THREE.BoxGeometry(0.3, 0.3, 1.5);
        const bodyMat = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        group.add(body);
        
        // Nòng súng
        const barrelGeo = new THREE.CylinderGeometry(0.05, 0.08, 1);
        const barrelMat = new THREE.MeshPhongMaterial({ color: 0x444444 });
        const barrel = new THREE.Mesh(barrelGeo, barrelMat);
        barrel.position.z = 1;
        barrel.rotation.x = Math.PI / 2;
        group.add(barrel);
        
        // Báng súng
        const stockGeo = new THREE.BoxGeometry(0.2, 0.25, 0.8);
        const stockMat = new THREE.MeshPhongMaterial({ color: 0x654321 });
        const stock = new THREE.Mesh(stockGeo, stockMat);
        stock.position.z = -1;
        group.add(stock);
        
        return group;
    }

    createRifleModel() {
        const group = new THREE.Group();
        
        // Thân súng hiện đại
        const bodyGeo = new THREE.BoxGeometry(0.25, 0.35, 2);
        const bodyMat = new THREE.MeshPhongMaterial({ color: 0x2a2a2a });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        group.add(body);
        
        // Ống ngắm
        const scopeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.3);
        const scopeMat = new THREE.MeshPhongMaterial({ color: 0x111111 });
        const scope = new THREE.Mesh(scopeGeo, scopeMat);
        scope.position.y = 0.25;
        group.add(scope);
        
        return group;
    }

    createSniperModel() {
        const group = new THREE.Group();
        
        // Thân súng dài
        const bodyGeo = new THREE.BoxGeometry(0.3, 0.3, 2.5);
        const bodyMat = new THREE.MeshPhongMaterial({ color: 0x1a4a1a });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        group.add(body);
        
        // Ống ngắm lớn
        const scopeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5);
        const scopeMat = new THREE.MeshPhongMaterial({ color: 0x000000 });
        const scope = new THREE.Mesh(scopeGeo, scopeMat);
        scope.position.y = 0.3;
        group.add(scope);
        
        return group;
    }

    createLaserModel() {
        const group = new THREE.Group();
        
        // Thiết kế tương lai
        const bodyGeo = new THREE.BoxGeometry(0.3, 0.4, 1.8);
        const bodyMat = new THREE.MeshPhongMaterial({ 
            color: 0x00ffff,
            emissive: 0x004444
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        group.add(body);
        
        // Hiệu ứng phát sáng
        const glowGeo = new THREE.SphereGeometry(0.2);
        const glowMat = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff,
            transparent: true,
            opacity: 0.5
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.z = 1;
        group.add(glow);
        
        return group;
    }

    createRocketModel() {
        const group = new THREE.Group();
        
        // Ống phóng
        const tubeGeo = new THREE.CylinderGeometry(0.15, 0.2, 2);
        const tubeMat = new THREE.MeshPhongMaterial({ color: 0x444444 });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        tube.rotation.x = Math.PI / 2;
        group.add(tube);
        
        // Đầu đạn
        const warheadGeo = new THREE.ConeGeometry(0.15, 0.5);
        const warheadMat = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const warhead = new THREE.Mesh(warheadGeo, warheadMat);
        warhead.position.z = 1.25;
        warhead.rotation.x = -Math.PI / 2;
        group.add(warhead);
        
        return group;
    }
}
