class Preload {
  constructor() {
    this.asset = null;
    this.ready = false;
  }

  preload() {
    this.load.image('loading_bg', '/static/img/loading/loading_bg.jpg');
  }
  
  create() {
    var loading_bg = this.add.sprite(0, 0, 'loading_bg');
    loading_bg.scale.setTo(2.0);
    
    this.asset = this.add.sprite(this.game.width/2, this.game.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    
    for (var i in layouts) {
      var layout = layouts[i].name;
      var layout_url = '/static/img/layouts/Talisman/'+layout+'/';
      this.load.image(layout+'-front-a', layout_url + 'front.png');    
      if (layouts[i].long_txt) {
        this.load.image(layout+'-front-b', layout_url + 'front_b.png');
      }
      //this.load.image(layout+'-jewel', 'assets/images/'+layout+'-jewel.png');    
    };
    //this.load.image('adventure-front-b', '/static/img/templates/adventure_b.png');    
    //this.load.image('icon-star', '/static/img/text-icons/ending-star.png');    
  
    
    //this.load.image('picture', 'assets/images/fantasy-illustration-goblins.jpg');
    //this.load.image('picture', '/static/img/old_1/'+talia+'/'+card_id+'.png');
    if (picture == '') {
      this.load.image('picture', '/static/img/dot.png');
    } else {
      this.load.image('picture', '/static/cards/'+picture);    
    }
    
    this.load.image('exp_sym', '/static/img/exp_symbols/exp_sym.png');
    this.load.image('exp_sym_dungeon', '/static/img/exp_symbols/exp_sym_dungeon.png');
    
    var exp_icons = [
      'anchor',
      'sunrise',
    ];
    for (var i in exp_icons) {
      var id = parseInt(i) + 1;
      this.load.image('exp_icon_'+id, '/static/img/exp_symbols/game-icons/'+exp_icons[i]+'.png');
    }

    this.load.start();
    
  }
  
  update() {
    if(this.ready) {
      this.game.state.start('game');
    }
  }
  
  onLoadComplete() {
    this.ready = true;
  };

}