class Game {

  CreateRegion(rec) {
    var region = new Phaser.Rectangle(rec[0], rec[1], rec[2], rec[3]);
    return region;
  }

  TextBox(region, text, font="Windlass Extended", font_size=44, multiline=false) {
    var style = { font: font_size + "px " + font, fill: "black"}; // , wordWrap: true, wordWrapWidth: region.width
    
    if (multiline) {
      var txtText = new myText(this.game, 0, 0, text, style);
      
      txtText.addFontStyle('italic', 0);
      //txtText.addFontWeight('bold', 0);
      /*txtText.addFontSize('42px', 0);
      txtText.addFontSize('30px', 1);
      txtText.addFontSize('42px', 3);
      
      //txtText.addFontStyle('normal', 8);
      txtText.addFontWeight('normal', 8);
      txtText.addFontSize('30px', 8);
      */
      //txtText.addColor('red', 10);
      //txtText.addColor('black', 13);
      
      
      txtText.anchor.set(0.5, 0);
      
      txtText.x = Math.floor(region.x + region.width / 2);
      txtText.y = region.y;        
    
      txtText.wordWrap = true;
      txtText.wordWrapWidth =region.width;
      
    } else {
      var txtText = this.add.text(0, 0, text, style);
    
      this.game.CalcFontSize(txtText, region, font_size);
    
      txtText.anchor.set(0.5, 0.5);
      
      txtText.x = Math.floor(region.x + region.width / 2);
      txtText.y = Math.floor(region.y + region.height / 2);
  
      
    };
    //txtText.setShadow(3, 3, 'rgba(255,255,255,1.0)', 5);
    
    return txtText; 
  }

  create() {
    //this.game.debug_mode = true;
    
    this.game.CalcFontSize = function (txtText, region, maxSize) {
      if (txtText.text.length == 0) {
        return;
      };
      while ((txtText.width < region.width)&&(txtText.fontSize < maxSize)) {
        var font_size = txtText.fontSize + 1;
        txtText.fontSize = font_size;
      };

      while ((txtText.width > region.width)||(txtText.fontSize > maxSize)) {
        var font_size = txtText.fontSize - 1;
        txtText.fontSize = font_size;
      };

      /*if (txtText.height*2 <= region.height ) {
        alert('2 linie');
      }*/
    }
  
      
    //this.picture = this.add.sprite(this.pos_x+20, this.pos_y+50, 'picture');
      //this.picture.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //this.picture.scale.setTo(0.7);


    game.picture = this.add.sprite(41, 112, 'picture');
    game.picture.inputEnabled = true;
    game.picture.input.enableDrag();
    //game.picture.anchor.set(0.5);
    game.generic_picture_rec = [40, 120, 405, 350];
    game.generic_picture_rec_b = [40, 120, 405, 240];
    game.picture_region = this.CreateRegion(game.generic_picture_rec);
    var ratio = game.picture_region.width / game.picture.width;
    //game.picture.width = game.picture.width * ratio;
    //game.picture.height = game.picture.height * ratio;
    game.picture.scale.setTo(ratio);
    
    game.graphics = game.add.graphics(0, 0);
    //game.graphics.lineStyle(2, 0x0000FF, 1);
    game.graphics.beginFill(0xFFFFFF);
    //graphics.drawRect(0, 0, 32, 30);
    game.graphics.drawRect(0, 0, this.game.width, 30);
    game.graphics.drawRect(0, this.game.height-30, this.game.width, this.game.height);
    game.graphics.drawRect(0, 30, 33, this.game.height-60);
    game.graphics.drawRect(this.game.width-33, 30, this.game.width, this.game.height-60);
    game.graphics.endFill();
    
    game.card = this.add.sprite(this.game.width/2, this.game.height/2, layouts[0].name+'-front-a');
    game.card.anchor.set(0.5, 0.5);
    
    //game.card.scale.setTo(0.5);
    
    game.font_windlass = "Windlass Extended";
    game.font_caxton = "Caxton Extended";
    
    game.generic_title_rec = [76, 64, 338, 54];
    game.title_font_size_max = 40;
    game.title_region = this.CreateRegion(game.generic_title_rec);
    game.txtTitle = this.TextBox(game.title_region, '', game.font_windlass, game.title_font_size_max);
    
    game.generic_type_region = [134, 436, 215, 28];
    game.generic_type_region_b = [134, 320, 215, 28];
    game.type_font_size_max = 26;
    game.type_region = this.CreateRegion(game.generic_type_region);
    game.txtType = this.TextBox(game.type_region, '', game.font_caxton, game.type_font_size_max);
    
    game.generic_encounter_number_region = [390, 652, 40, 40];
    game.encounter_font_size_max = 32;
    game.encounter_region = this.CreateRegion(game.generic_encounter_number_region);
    game.txtEncounter = this.TextBox(game.encounter_region, '1', game.font_caxton, game.encounter_font_size_max);    
    game.txtEncounter.fill = "white";
    game.txtEncounter.fontWeight = "bold";
    
    game.generic_text_region = [45, 480, 394, 202];
    game.generic_text_region_b = [45, 370, 394, 312];
    game.text_region = this.CreateRegion(game.generic_text_region);
    game.text_font_size_max = 29;
    game.txtText = this.TextBox(game.text_region, '', game.font_caxton, game.text_font_size_max, true);    
    game.txtText.lineSpacing = -10;
    game.txtText.align = 'center';
    
    game.symbol = this.add.sprite(0, 0, 'icon-star');
    //game.txtText.addChild(game.symbol);
    game.symbol.scale.setTo(0.33);
    
    
    refreshCard();
    if (layout_to_set) {
      setLayout(layout_to_set);
      refreshLayout()
    }
    
    game.picture.x = pic_x;
    game.picture.y = pic_y;
    game.picture.scale.setTo(pic_scale);
  }

  update() {
    //game.symbol.x = game.txtText.x;
    //game.symbol.y = game.txtText.y;
    
  }
  
  render() {
    if (game.debug_mode) {
      var color = 'rgba(255,0,0,0.7)';
      game.debug.geom( game.title_region, color );
      game.debug.geom( game.type_region, color );
      game.debug.geom( game.encounter_region, color );
      game.debug.geom( game.text_region, color );
      //game.debug.geom( game.picture_region, color );
    };
  }
}