import GeometricalMesh from './GeometricalMesh.js';

export default class Playground extends GeometricalMesh{
    constructor(name, properties){
        super(name, properties);
        this.className = 'Playground';
        this.meshes = [];
    }

    addMesh(mesh){
        mesh.parent = this;
        this.meshes.push(mesh);
        this.emit('Mesh added', {mesh});
    }

    removeMesh(mesh){
        const index = this.meshes.indexOf(mesh);

        if (index !== -1){
            this.meshes.splice(index, 1);
            this.emit('Mesh removed', {mesh});
        }
    }
}