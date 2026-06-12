// Quản lý UI bổ sung
class UIManager {
    constructor() {
        this.setupKeyboardControls();
    }

    setupKeyboardControls() {
        const keys = {};
        
        window.addEventListener('keydown', (e) => {
            keys[e.key
