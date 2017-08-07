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
      var layout = layouts[i];
      this.load.image(layout+'-front-a', '/static/img/templates/'+layout+'_a.png');    
      this.load.image(layout+'-front-b', '/static/img/templates/'+layout+'_b.png');    
      //this.load.image(layout+'-jewel', 'assets/images/'+layout+'-jewel.png');    
    };
    this.load.image('adventure-front-b', '/static/img/templates/adventure_b.png');    
      
    
    //this.load.image('picture', 'assets/images/fantasy-illustration-goblins.jpg');
    this.load.image('picture', '/static/img/old_1/'+talia+'/'+card_id+'.png');
        
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