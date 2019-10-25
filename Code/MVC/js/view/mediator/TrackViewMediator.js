import ViewMediator from "./ViewMediator.js";

export default class TrackViewMediator extends ViewMediator {
    constructor(track, mediatorFactory) {
        super(track, mediatorFactory);
        this.model.addObserver("PointAdded", (e) => this.onPointAdded(e));
        this.model.addObserver("PointRemoved", (e) => this.onPointRemoved(e));
    }

    makeObject3D() {        
        const TrackDepth = 1;
        const TrackHeight = 0.25;

        const container = new THREE.Object3D();

        if (this.model.points.length < 2){
            return container;
        }

        const material = new THREE.MeshPhongMaterial({ color : this.model.properties.color });

        // Loop through the points array and create a box between every two following points
        for (let i = 0; i < this.model.points.length-1; i++) {

            // Calculate a Vector3 between the two points
            const trackWidth = new THREE.Vector3().copy(this.model.points[i+1]).sub(this.model.points[i]);
            // Create the mesh with the calculated width from the Vector3
            const track = new THREE.Mesh(
                new THREE.BoxGeometry(trackWidth, TrackHeight, TrackDepth),
                material
            )

            // Position the center of the object to first point + half of the distance between the points (for x and z)
            track.position.x = this.model.points[i].x + trackWidth.x/2;
            track.position.z = this.model.points[i].z + trackWidth.z/2;
            // Align mesh to calculated Vector3
            track.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), trackWidth.clone().normalize());
            container.add(track);
        }

        container.position.y += TrackHeight/2;

        return container;
    }

    onPointAdded(e){
        //this.addChild(e.point);
        this.
    }

    onPointRemoved(e){
        this.removeChild(e.point);
    }
}