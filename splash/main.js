var type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache,
    Rectangle = PIXI.Rectangle;


//Create the renderer
var renderer = autoDetectRenderer(1024, 608);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new Container();

//Tell the `renderer` to `render` the `stage`
renderer.render(stage);

// renderer.view.style.position = "absolute";
// renderer.view.style.display = "block";
// renderer.autoResize = true;
// renderer.resize(window.innerWidth, window.innerHeight);

loader
  .add('images/world_elements.json')
  .add('images/loch_ness.json')
  .load(setup);

function setup() {
  const sea = {
    inner: {
      se: TextureCache.sea_se_inner,
      sw: TextureCache.sea_sw_inner,
      ne: TextureCache.sea_ne_inner,
      nw: TextureCache.sea_nw_inner,
    }, 
    outer: {
      se: TextureCache.sea_se_outer,
      sw: TextureCache.sea_sw_outer,
      ne: TextureCache.sea_ne_outer,
      nw: TextureCache.sea_nw_outer,
    },
    deep: {
      solid: TextureCache.sea_deep,
      n: TextureCache.sea_n_deep,
      s: TextureCache.sea_s_deep,
      e: TextureCache.sea_e_deep,
      w: TextureCache.sea_w_deep,
      in: {
        se: TextureCache.sea_se_inner_deep,
        sw: TextureCache.sea_sw_inner_deep,
        ne: TextureCache.sea_ne_inner_deep,
        nw: TextureCache.sea_nw_inner_deep,
      },
      out: {
        se: TextureCache.sea_se_outer_deep,
        sw: TextureCache.sea_sw_outer_deep,
        ne: TextureCache.sea_ne_outer_deep,
        nw: TextureCache.sea_nw_outer_deep,
      }
    },
    n: TextureCache.sea_n,
    e: TextureCache.sea_e,
    s: TextureCache.sea_s,
    w: TextureCache.sea_w,
    shallow: TextureCache.sea_shallow,
    rock: TextureCache.sea_rock
  };

  const land = {
    grass: TextureCache.land_grass,
    flowers: TextureCache.land_flowers,
    bush: TextureCache.land_bush,
    horse: {
      left: TextureCache.land_horse_left,
      right: TextureCache.land_horse_right
    },
    forest: {
      nw: TextureCache.land_forest_nw,
      ne: TextureCache.land_forest_ne,
      sw: TextureCache.land_forest_sw,
      se: TextureCache.land_forest_se,
      n: TextureCache.land_forest_n,
      e: TextureCache.land_forest_e,
      s: TextureCache.land_forest_s,
      w: TextureCache.land_forest_w,
      solid: TextureCache.land_forest,
    }
  };

  const building = {
    house: [
      TextureCache.building_house_1,
      TextureCache.building_house_2,
      TextureCache.building_house_3,
      TextureCache.building_house_4
    ],
    bridge: {
      left: TextureCache.building_bridge_left,
      middle_left: TextureCache.building_bridge_middle_left,
      middle_right: TextureCache.building_bridge_middle_right,
      right: TextureCache.building_bridge_right
    }
  }

  const lochness = [];
  for (let i = 0; typeof TextureCache[i] !== 'undefined'; i += 1) {
    lochness.push(TextureCache[i]);
  }

  const gameboard = [
    [sea.deep.solid,  sea.deep.in.se,  sea.inner.se,    sea.s,                    sea.s,           sea.s,           sea.s,           sea.s,           sea.inner.sw,    sea.deep.out.sw, sea.deep.in.sw,  sea.deep.solid,  sea.deep.in.se,  sea.deep.in.sw,  sea.deep.solid,  sea.deep.in.se,  sea.deep.in.sw,  sea.deep.solid,           [sea.deep.solid, sea.rock],  sea.deep.in.se,  sea.deep.s,      sea.deep.s,      sea.deep.s,      sea.deep.s,         sea.deep.s,      sea.deep.in.sw,           sea.deep.solid,  sea.deep.solid,    sea.deep.solid,    sea.deep.solid,     sea.deep.solid,     sea.deep.solid],
    [sea.deep.solid,  sea.deep.e,      sea.inner.ne,    sea.n,                    sea.outer.ne,    land.flowers,    sea.outer.nw,    sea.n,           sea.inner.nw,    sea.shallow,     sea.deep.out.sw, sea.deep.s,      sea.deep.out.se, sea.deep.out.sw, sea.deep.s,      sea.deep.out.se, sea.deep.out.sw, sea.deep.s,               sea.deep.s,                  sea.deep.out.se, sea.shallow,     sea.inner.se,    sea.s,           sea.s,              sea.inner.sw,    sea.deep.out.sw,          sea.deep.in.sw,  sea.deep.solid,    sea.deep.solid,    sea.deep.solid,     sea.deep.solid,     sea.deep.solid],
    [sea.deep.solid,  sea.deep.in.ne,  sea.deep.out.ne, sea.shallow,              sea.e,           land.grass,      sea.w,           sea.shallow,     sea.inner.se,    sea.s,           sea.s,           sea.s,           sea.s,           sea.inner.sw,    sea.shallow,     sea.inner.se,    sea.s,           sea.s,                    sea.s,                       sea.s,           sea.inner.sw,    sea.inner.ne,    sea.outer.ne,    land.flowers,       sea.w,           sea.shallow,              sea.deep.w,      sea.deep.solid,    sea.deep.solid,    sea.deep.solid,     sea.deep.solid,     sea.deep.solid],
    [sea.deep.solid,  sea.deep.solid,  sea.deep.in.ne,  sea.deep.out.ne,          sea.e,           land.grass,      sea.w,           sea.shallow,     sea.e,           land.grass,      sea.outer.nw,    sea.n,           sea.outer.ne,    sea.w,           sea.shallow,     sea.e,           land.grass,      sea.outer.nw,             sea.n,                       sea.outer.ne,    sea.w,           sea.shallow,     sea.e,           land.grass,         sea.w,           sea.shallow,              sea.deep.w,      sea.deep.solid,    sea.deep.solid,    sea.deep.solid,     sea.deep.solid,     sea.deep.solid],
    [sea.deep.solid,  sea.deep.solid,  sea.deep.solid,  sea.deep.e,               sea.e,           land.grass,      sea.w,           sea.shallow,     sea.e,           land.grass,      sea.w,           sea.shallow,     sea.e,           sea.w,           sea.shallow,     sea.e,           land.grass,      sea.w,                    sea.shallow,                 sea.e,           sea.w,           sea.shallow,     sea.e,           land.horse.right,   sea.w,           sea.shallow,              sea.deep.w,      sea.deep.solid,    sea.deep.solid,    sea.deep.solid,     sea.deep.solid,     sea.deep.solid],
    [sea.deep.in.se,  sea.deep.s,      sea.deep.s,      sea.deep.out.se,          sea.e,           land.flowers,    sea.w,           sea.shallow,     sea.e,           land.grass,      sea.w,           sea.shallow,     sea.e,           sea.w,           sea.shallow,     sea.e,           land.flowers,    sea.outer.nw,             sea.n,                       sea.n,           sea.inner.nw,    sea.shallow,     sea.e,           land.grass,         sea.w,           [sea.shallow, sea.rock],  sea.deep.out.sw, sea.deep.in.sw,    sea.deep.solid,    sea.deep.solid,     sea.deep.solid,     sea.deep.solid],
    [sea.deep.e,      sea.inner.se,    sea.inner.sw,    [sea.shallow, sea.rock],  sea.e,           land.grass,      sea.w,           sea.shallow,     sea.e,           land.horse.left, sea.w,           sea.shallow,     sea.e,           sea.w,           sea.shallow,     sea.e,           land.grass,      sea.w,                    sea.shallow,                 sea.inner.se,    sea.inner.sw,    sea.shallow,     sea.e,           land.flowers,       sea.w,           sea.shallow,              sea.shallow,     sea.deep.out.sw,   sea.deep.s,        sea.deep.in.sw,     sea.deep.solid,  sea.deep.solid],
    [sea.deep.e,      sea.e,           sea.outer.sw,    sea.s,                    sea.outer.se,    land.grass,      sea.w,           sea.shallow,     sea.e,           land.flowers,    sea.outer.sw,    sea.s,           sea.outer.se,    sea.w,           sea.shallow,     sea.e,           land.bush,       sea.outer.sw,             sea.s,                       sea.outer.se,    sea.w,           sea.shallow,     sea.e,           land.grass,         sea.outer.sw,    sea.inner.sw,             sea.shallow,     sea.shallow,       sea.shallow,       sea.deep.out.sw, sea.deep.in.sw,  sea.deep.solid],
    [sea.deep.e,      sea.inner.ne,    sea.n,           sea.n,                    sea.n,           sea.n,           sea.inner.nw,    sea.shallow,     sea.inner.ne,    sea.n,           sea.n,           sea.n,           sea.n,           sea.inner.nw,    sea.shallow,     sea.inner.ne,    sea.n,           sea.n,                    sea.n,                       sea.n,           sea.inner.nw,    sea.shallow,     sea.inner.ne,    sea.n,              sea.n,           sea.inner.nw,             sea.shallow,     sea.shallow,       sea.inner.se,      sea.inner.sw,    sea.deep.w,      sea.deep.solid],
    [sea.deep.e,      sea.inner.se,    sea.s,           sea.inner.sw,             sea.shallow,     sea.shallow,     sea.inner.se,    sea.s,           sea.inner.sw,    sea.shallow,     sea.deep.out.nw, sea.deep.n,      sea.deep.n,      sea.deep.n,      sea.deep.n,      sea.deep.n,      sea.deep.n,      sea.deep.n,               sea.deep.n,                  sea.deep.n,      sea.deep.out.ne, sea.shallow,     sea.inner.se,    sea.s,              sea.s,           sea.s,                    sea.s,           sea.s,             sea.s,             sea.w,           sea.deep.w,      sea.deep.solid],
    [sea.deep.e,      sea.e,           land.bush,       sea.w,                    sea.shallow,     sea.inner.se,    sea.outer.se,    sea.outer.nw,    sea.inner.nw,    sea.shallow,     sea.deep.out.sw, sea.deep.s,      sea.deep.s,      sea.deep.s,      sea.deep.s,      sea.deep.s,      sea.deep.s,      sea.deep.s,               sea.deep.s,                  sea.deep.s,      sea.deep.out.se, sea.shallow,     sea.e,           land.grass,         sea.outer.nw,    sea.n,                    sea.n,           sea.n,             sea.n,             sea.inner.nw,    sea.deep.w,      sea.deep.solid],
    [sea.deep.e,      sea.e,           land.grass,      sea.w,                    sea.inner.se,    sea.outer.se,    sea.outer.nw,    sea.inner.nw,    sea.deep.out.nw, sea.deep.out.ne, sea.inner.se,    sea.s,           sea.inner.sw,    sea.inner.se,    sea.s,           sea.inner.sw,    sea.inner.se,    sea.s,                    sea.s,                       sea.s,           sea.inner.sw,    sea.shallow,     sea.e,           land.grass,         sea.w,           sea.shallow,              sea.shallow,     sea.inner.se,      sea.s,             sea.inner.sw,    sea.deep.out.sw, sea.deep.in.sw],
    [sea.deep.e,      sea.e,           land.grass,      sea.outer.sw,             sea.outer.se,    sea.outer.nw,    sea.inner.nw,    sea.deep.out.nw, sea.deep.in.nw,  sea.deep.e,      sea.e,           land.grass,      sea.outer.nw,    sea.n,           sea.n,           sea.inner.nw,    sea.inner.ne,    sea.n,                    sea.n,                       land.grass,      sea.w,           sea.shallow,     sea.e,           land.flowers,       sea.w,           sea.shallow,              sea.shallow,     sea.e,             land.bush,         sea.w,           sea.shallow,     sea.deep.w],
    [sea.deep.e,      sea.e,           land.grass,      land.grass,               land.grass,      sea.outer.sw,    sea.inner.sw,    sea.deep.out.sw, sea.deep.in.sw,  sea.deep.e,      sea.e,           land.grass,      sea.w,           sea.deep.out.nw, sea.deep.out.ne, sea.inner.se,    sea.s,           sea.s,                    sea.s,                       land.grass,      sea.w,           sea.inner.se,    sea.outer.se,    land.grass,         sea.outer.sw,    sea.inner.sw,             sea.inner.se,    sea.outer.se,      building.house[0], sea.outer.sw,    sea.inner.sw,    sea.deep.w],
    [sea.deep.e,      sea.e,           land.grass,      sea.outer.nw,             sea.outer.ne,    land.grass,      sea.outer.sw,    sea.inner.sw,    sea.deep.out.sw, sea.deep.out.se, sea.e,           land.flowers,    sea.w,           sea.deep.w,      sea.deep.e,      sea.e,           sea.outer.nw,    sea.n,                    sea.outer.ne,                land.grass,      sea.w,           sea.inner.ne,    sea.outer.ne,    land.grass,         sea.outer.nw,    sea.inner.nw,             sea.inner.ne,    sea.outer.ne,      land.grass,        sea.outer.nw,    sea.inner.nw,    sea.deep.w],
    [sea.deep.e,      sea.e,           land.flowers,    sea.w,                    sea.inner.ne,    sea.outer.ne,    land.grass,      sea.outer.sw,    sea.inner.sw,    sea.shallow,     sea.e,           land.grass,      sea.w,           sea.deep.w,      sea.deep.e,      sea.e,           sea.w,           [sea.shallow, sea.rock],  sea.e,                       land.flowers,    sea.w,           sea.shallow,     sea.e,           land.grass,         [sea.w, building.bridge.left],           [sea.shallow, building.bridge.middle_left],              [sea.shallow, building.bridge.middle_right],     [sea.e, building.bridge.right],           land.horse.right,  sea.w,           sea.shallow,     sea.deep.w],
    [sea.deep.e,      sea.e,           land.grass,      sea.w,                    sea.shallow,     sea.inner.ne,    sea.outer.ne,    land.grass,      sea.outer.sw,    sea.inner.sw,    sea.e,           land.grass,      sea.w,           sea.deep.w,      sea.deep.e,      sea.e,           sea.outer.sw,    sea.s,                    sea.outer.se,                land.grass,      sea.w,           sea.inner.se,    sea.outer.se,    land.grass,         sea.w,           sea.shallow,              sea.inner.se,    sea.outer.se,     land.flowers,       sea.w,           sea.deep.out.nw, sea.deep.in.nw],
    [sea.deep.e,      sea.inner.ne,    sea.n,           sea.inner.nw,             sea.shallow,     sea.shallow,     sea.inner.ne,    sea.n,           sea.n,           sea.inner.nw,    sea.inner.ne,    sea.n,           sea.inner.nw,    sea.deep.w,      sea.deep.e,      sea.inner.ne,    sea.n,           sea.n,                    sea.n,                       sea.n,           sea.inner.nw,    sea.inner.ne,    sea.n,           sea.n,              sea.inner.nw,    sea.shallow,              sea.inner.ne,    sea.n,            sea.n,              sea.inner.nw,    sea.deep.w,      sea.deep.solid],
    [sea.deep.in.ne,  sea.deep.n,      sea.deep.n,      sea.deep.n,               sea.deep.n,      sea.deep.n,      sea.deep.n,      sea.deep.n,      sea.deep.n,      sea.deep.n,      sea.deep.n,      sea.deep.n,      sea.deep.n,      sea.deep.in.nw,  sea.deep.in.ne,  sea.deep.n,      sea.deep.n,      sea.deep.n,               sea.deep.n,                  sea.deep.n,      sea.deep.n,      sea.deep.n,      sea.deep.n,      sea.deep.n,         sea.deep.n,      sea.deep.n,               sea.deep.n,      sea.deep.n,       sea.deep.n,         sea.deep.n,      sea.deep.in.nw,  sea.deep.solid]
  ];

  gameboard.forEach((row, rowIndex, gameboard) => {
    const y = rowIndex * 32;
    if (row.length === 0) return;
    row.forEach((col, colIndex) => {
      const x = colIndex * 32;
      if (Array.isArray(col)) {
        col.forEach((texture) => {
          const s = new Sprite(texture);
          s.position.set(x, y);
          stage.addChild(s);
        })
        return;
      }
      const s = new Sprite(col);
      s.position.set(x, y);
      stage.addChild(s);
    })
  })

  const lochsprite = new Sprite(lochness[5]);
  lochsprite.position.set(894, 64);
  stage.addChild(lochsprite);

  renderer.render(stage);
}