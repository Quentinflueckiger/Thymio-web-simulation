export default class ProximitySensor {
    constructor(offSet) {
        this.offSet = offSet;
        this.position = new THREE.Vector3(0,0,0);
    }

    setPosition(pos){
        this.position = pos + this.offSet;
    }
}