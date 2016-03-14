import THREE from 'three';
import {registerComponent} from 'aframe';

/**
*validate() helper will take src and determine if it parses
*to html or if it is a valide queryselector.
**/

export default Component = registerComponent('html', {
  schema: {
    src: { default: '' }
  },
  init: function () {
    //Create plane here

  },
  tic: function(oldData) {
    var data = this.data;
    var css3dObject;
    var src = data.src;
    this.el.object3D.add(THREE.CSS3DObject(this.data.el.src));
    //Update plane coordinates here
  }
});
