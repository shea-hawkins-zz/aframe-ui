import { registerShader, utils, systems } from 'aframe';
import THREE from 'three';
var srcLoader = utils.srcLoader;
var texture = utils.texture;
var loader = new THREE.TextureLoader();

/** pure
  * Parses Strings as THREE constants
  *
  * @param {string} str - string of constant key
  * @returns {const} THREE constant
  */
function parseTHREEConstant(str) {
  return THREE[str];
};
/** pure
  * Determines options set on an asset.
  *
  * @param {obj || str} src - source of the texture
  * @param {str} attr - attribute to search for asset-specific style
  * @param {obj || undef} def - global defaults
  * @returns {obj} Options to apply to texture
  */
function getAssetData(src, attr, def) {
  try {
    var el = document.querySelector(src);
    def = def || {};
    var val = el.getAttribute(attr);
    var style = Component.objectParse(val);
    return Object.assign(def, style);
  } catch (e) {
    return def || null;
  }
}
/** impure - emits textureloaded and operates on element load
  * Takes a src and options and returns a promised texture.
  *
  * @param {obj} loader - loader for the materials
  * @param {obj || undef} opts - options to apply to texture
  * @returns {obj} Texture promise with options applied
  */
function loadTHREETexture(src, opts) {
  return new Promise((resolve, reject) => {
    // TODO Determine if path or queryselector
    if (!src) {reject()}
    // If src is a url...
    //var url = srcLoader.parseUrl(src);
    var url = src;
    if (url) {
          // TODO Reimplement video tester if nec
          loader.load(url, resolve, undefined, reject);
    }
    // If src is a queryselector to a valid element...
    else {
      try {
        var el = document.querySelector(src);
        if (el) {
          // ...and is an image
          if (el.tagName === 'IMG') {
            // ...make a new image texture.
            var texture = new THREE.Texture(el);
          } else if (el.tagName === 'VIDEO') {
            // Otherwise a new video texture.
            var texture = new THREE.VideoTexture(el);
          }
          el.onLoad = function() {
            texture.needsUpdate = true;
          }
          resolve(texture);
        }
      } catch (e) {
        reject(e);
      }
    }
  }).then((tex) => {
    opts && Object.assign(tex, opts);
    return tex;
  });
};


registerShader('phong', {
  schema: {
    color: {
      default: '#FFF'
    },
    // This and all other maps can be
    // a string to a src or a queryselector
    map: {
      default: null
    },
    lightMap: {
      default: null
    },
    emissiveMap: {
      default: null
    },
    specularMap: {
      default: null
    },
    alphaMap: {
      default: null
    },
    displacementMap: {
      default: null
    },
    displacementScale: {
      default: 1
    },
    displacementBias: {
      default: 0
    },
    envMap: {
      default: null
    },
    fog: {
      default: true
    },
    shading: {
      default: "SmoothShading",
      parse: (value) => parseTHREEConstant(value)
    },
    wireframe: {
      default: false
    },
    wireframeLinewidth: {
      default: 1
    },
    wireframeLinecap: {
      default: 'round'
    },
    wireframeLinejoin: {
      default: 'round'
    },
    vertexColors: {
      default: "NoColors",
      parse: (value) => parseTHREEConstant(value)
    },
    skinning: {
      default: false
    },
    morphTargets: {
      default: false
    },
    morphNormals: {
      default: false
    },
    // Sets defaults for all texture vars
    mapping: {
      default: "UVMapping",
      oneOf: ["CubeReflectionMapping", "CubeRefractionMapping", "SphericalReflectionMapping"],
      parse: (value) => parseTHREEConstant(value)
    },
    wrapS: {
      default: "ClampToEdgeWrapping",
      oneOf: ["ClampToEdgeWrapping", "RepeatWrapping", "MirroredRepeatWrapping"],
      parse: (value) => parseTHREEConstant(value)
    },
    wrapT: {
      default: "ClampToEdgeWrapping",
      oneOf: ["ClampToEdgeWrapping", "RepeatWrapping", "MirroredRepeatWrapping"],
      parse: (value) => parseTHREEConstant(value)
    },
    magFilter: {
      default: "LinearFilter",
      oneOf: ["LinearFilter", "NearestFilter"],
      parse: (value) => parseTHREEConstant(value)
    },
    minFilter: {
      default: "LinearMipMapLinearFilter",
      oneOf: ["LinearMipMapLinearFilter", "NearestFilter", "NearestMipMapNearestFilter",
              "NearestMipMapLinearFilter", "LinearFilter", "LinearMipMapNearestFilter"],
      parse: (value) => parseTHREEConstant(value)
    },
    format: {
      default: "RGBAFormat",
      oneOf: ["RGBAFormat", "AlphaFormat", "RGBFormat", "LuminanceFormat", "LuminanceAlphaFormat",
              "RGB_S3TC_DXT1_Format", "RGBA_S3TC_DXT1_Format", "RGBA_S3TC_DXT3_Format", "RGBA_S3TC_DXT5_Format"],
      parse: (value) => parseTHREEConstant(value)
    },
    texType: {
      default: "UnsignedByteType",
      oneOf: ["UnsignedByteType", "ByteType", "ShortType", "UnsignedShortType", "UnsignedIntType", "UnsignedShort4444Type",
              "Unsignedshort5551Type", "UnsignedShort565Type"],
      parse: (value) => parseTHREEConstant(value)
    },
    anisotropy: {
      //Max is renderer.getMaxanisotropy()
      default: 1
    },
    generateMipmaps: {
      default: true
    },
    flipY: {
      default: true
    },
    premultiplyAlpha: {
      default: false
    }
  },
  texturePromises: {},
  textureDefaults: {},
  textureSrc: {},
  maps: [
    "map",
    "lightMap",
    "aoMap",
    "emissiveMap",
    "bumpMap",
    "normalMap",
    "specularMap",
    "alphaMap",
    "displacementMap",
    "envMap"
  ],
  texOpts: [
    "image",
    "mapping",
    "wrapS",
    "wrapT",
    "magFilter",
    "minFilter",
    "format",
    "type",
    "anisotropy",
    "generateMipmaps",
    "flipY",
    "premultiplyAlpha"
  ],
  init: function (data) {
    this.material = new THREE.MeshPhongMaterial( { color: 0x0033ff, specular: 0x555555, shininess: 30 } );
    this.material.lights = true;
    // material usually calculates lights from scene. shader is inside
    // a promise and doesn't receive scene related data. Set lights true manually
    // to inform THREE that the object is lit.
    //debugging below
    loader.load('assets/crate.jpg', (tex) => {
      //  this.material.map = tex;
      //  this.material.map.needsUpdate = true;
      //  this.material.needsUpdate = true;
      // console.log("success");
      // console.log(this.material.map);
    });
    //this.updateTextures(data);
    return this.material;
  },
  update: function (data) {
    //this.material = this.updateMaterial(data);
    this.material.needsUpdate = true;
    return this.material;
  },
  updateTextureGlobals: function (data) {
    Object.keys(data).forEach((key) => {
      key = key === "texType" ? "type" : key;
      if (this.texOpts.indexOf(key) !== -1) {
        this.texOpts[key] = data[key];
      }
    });
  },
  updateMaterial: function (data) {
    this.updateTextures(data);
    Object.keys(data).forEach((key) => {
      if (this.maps.indexOf(key) === -1
              && this.material[key] !== data[key]) {
        this.material[key] = data[key];
        this.material.needsUpdate = true;
      }
    });
    return this.material;
  },
  updateTextures: function (data) {
    this.updateTextureGlobals(data);
    Object.keys(data).map((key) => {
      // Excludes data source keys that haven't changed,
      // assumed already in transit as well
      if (this.maps.indexOf(key) !== -1 && data[key] !== this.textureSrc[key]) {
        var opts = getAssetData(data[key], "texture", this.texOpts);
        var p = loadTHREETexture(data[key], opts);
        this.texturePromises[key] = p;
        p.then((tex) => {
          this.material[key] = tex;
          this.textureSrc[key] = data[key];
          this.material.needsUpdate = true;
        }).catch((e) => {
        });
      }
    });
  }
});
