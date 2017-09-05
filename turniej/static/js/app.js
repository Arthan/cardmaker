var game;
var layout_type = 'a';
var curr_layout = null;

//var symbols = [{'x': 0, 'y': 0, 'type': 'star'}];

var myText = function(game, x, y, text, style){
  Phaser.Text.call(this, game, x, y, text, style);
  
  this.game.add.existing(this);
  
  this.fontStyles = [];
  this.fontWeights = [];
  this.fontSizes = [];
};

myText.prototype = Object.create(Phaser.Text.prototype);
myText.prototype.constructor = myText;

Phaser.Text.prototype.addFontStyle = function(style, position){
  this.fontStyles[position] = style;
  this.dirty = true;
  
  return this;
};

Phaser.Text.prototype.addFontSize = function(size, position){
  this.fontSizes[position] = size;
  this.dirty = true;
  
  return this;
};

Phaser.Text.prototype.addFontWeight = function(weight, position){
  this.fontWeights[position] = weight;
  this.dirty = true;
  
  return this;
};

Phaser.Text.prototype.updateLine = function (line, x, y) {
  /*if (line.substr(0, 4) == '<br>' ) {
    //this.context.textBaseline="bottom";
    y = y - 16; 
    line = '______________________';
  } else {
    //this.context.textBaseline="alphabetic"; 
  }*/
  
  if (line.indexOf('@') > -1 ) {
    //alert('go');
    //game.symbol.x = x + line.indexOf('@') * 10 - 100;
    //game.symbol.y = y - 20;
    //symbols[0].x = x;
    //symbols[0].y = y;
    //alert(symbols[0].x);
    //alert(symbols[0].y);
  }
  
  for (var i = 0; i < line.length; i++)
    {
        var letter = line[i];
      
        var components = this.fontToComponents(this.context.font);
        
        if(this.fontWeights[this._charCount]){
          components.fontWeight = this.fontWeights[this._charCount];
        }
        if(this.fontStyles[this._charCount]){
          components.fontStyle = this.fontStyles[this._charCount];
        }
        if(this.fontSizes[this._charCount]){
          components.fontSize = this.fontSizes[this._charCount];
        }
      
        this.context.font = this.componentsToFont(components);
      
        if (this.style.stroke && this.style.strokeThickness)
        {
            if (this.strokeColors[this._charCount])
            {
                this.context.strokeStyle = this.strokeColors[this._charCount];
            }

            this.updateShadow(this.style.shadowStroke);
            this.context.strokeText(letter, x, y);
        }

        if (this.style.fill)
        {
            if (this.colors[this._charCount])
            {
                this.context.fillStyle = this.colors[this._charCount];
            }

            this.updateShadow(this.style.shadowFill);
            this.context.fillText(letter, x, y);
            /*if (line.indexOf('@') > -1 ) {
              game.symbol.x = x;
              game.symbol.y = y + game.txtText.y;
            }*/
    
        }

        x += this.context.measureText(letter).width;

        this._charCount++;
    }
};


function setLayout(name) {
  for (var i in layouts) {
    if (layouts[i].name == name) {
      $("#layout").val(layouts[i].id);
      break;
    }
  }
}

function setLayoutVisible(idx, visible) {
  if (visible) {
    $('#layout option[value="'+idx+'"]').show();
  } else {
    $('#layout option[value="'+idx+'"]').hide();
  }
}

function refreshLayoutList() {
  var exp_id = parseInt($("#expansion").val());
  for (i in layouts) {
    var in_exp = true;
    if (exp_id > 0) {
      in_exp = layouts[i].expansions.indexOf(exp_id) > -1;
    }    
    setLayoutVisible(layouts[i].id, in_exp);
  }
}

function refreshCard() { 
  refreshLayout();
  refreshTitle();
  refreshType();
  refreshText();
  refreshEncounterNr();
  refreshExpSymbol();
  game.debug_mode = $("#debug-mode").prop('checked');
};

function getLayout(id) {
  for (var i in layouts) {
    if (layouts[i].id == id) {
      return layouts[i];
    }
  }
}
    
function refreshLayout() {
  curr_layout = getLayout(parseInt($("#layout").val()));
  layout_url = '/static/img/layouts/Talisman/'+curr_layout.name+'/';
  game.scale.setGameSize(curr_layout.w, curr_layout.h);
  game.card.x = game.width/2;
  game.card.y = game.height/2;
  
  $('#back').css('border-radius', curr_layout.radius+'px');
  $('#game canvas').css('border-radius', curr_layout.radius+'px');
  
  game.graphics.visible = (curr_layout.h > curr_layout.w);
  
  $("#back").css({'width': curr_layout.w+'px', 'height': curr_layout.h+'px'})
  
  $("#layout").css('background-image', 'url(' + layout_url + 'back_24.png)');
  
  if (curr_layout.long_txt) {
    game.card.loadTexture(curr_layout.name+'-front-'+layout_type);
  } else {
    game.card.loadTexture(curr_layout.name+'-front-a');
  }
  
  if (['ifrit', 'ifrit_r'].indexOf(curr_layout.name) > -1) {
    $("#back").css('background-image', 'url(/static/img/layouts/Talisman/adventure/back.png)'); 
  } else {
    $("#back").css('background-image', 'url(' + layout_url + 'back.png)');
  }
  
  game.no_enc_nr.visible = curr_layout.name == 'adventure' && $("#encounter_nr").val() == '';
  game.txtEncounter.visible = (curr_layout.en_nr);
  game.txtType.visible = (curr_layout.type_txt);
 
  if (curr_layout.dpi300) {
    game.card.scale.setTo(1.0);
  } else {
    game.card.scale.setTo(2.0);
  };
  refreshExpSymbol();
};

function capitalize(txt) {
  var parts = txt.split(' ');
  $.each(parts, function (key, value) {
      parts[key] = value.charAt(0).toUpperCase() + value.slice(1);
  });  
  return parts.join(' ');
}

function refreshTitle() {
  var new_title = $("#title").val();
  new_title = capitalize(new_title);
  $("#title").val(new_title);
  game.txtTitle.setText(new_title);
  game.CalcFontSize(game.txtTitle, game.title_region, game.title_font_size_max);
};

function refreshType() {
  var new_type = $("#type").val();
  new_type = capitalize(new_type);
  $("#type").val(new_type);
  game.txtType.setText(new_type);
  game.CalcFontSize(game.txtType, game.type_region, game.type_font_size_max);
};

function refreshExpSymbol() {
  var exp_sym = $("#exp-symbol").val();
  if ((exp_sym == "0")||(curr_layout.exp_sym == false)) {
    game.exp_sym.visible = false;
    game.exp_icon.visible = false;    
  } else {
    if (curr_layout.exp_sym_bg == null) {
      game.exp_sym.visible = false;
    } else {
      game.exp_sym.loadTexture('exp_sym_'+curr_layout.exp_sym_bg);
      game.exp_sym.visible = true;
    }
    
    
    game.exp_icon.visible = true;    
    game.exp_icon.loadTexture('exp_icon_'+exp_sym);
    var ratio = game.exp_icon.width / game.exp_icon.height;
    game.exp_icon.width = 30;
    game.exp_icon.height = 30 / ratio;
  }
};

function assignRecToRegion(rec, region) {
  region.x = rec[0];
  region.y = rec[1];
  region.width = rec[2];
  region.height = rec[3];
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function refreshText() {
  var new_text = $("#text").val();  
  new_text = replaceAll(new_text, '<pz>', '<b><i>Pancerz</i></b>');
  new_text = replaceAll(new_text, '<pa>', '<b><i>Pancerza</i></b>');
  new_text = replaceAll(new_text, '<bń>', '<b><i>Broń</i></b>');
  new_text = replaceAll(new_text, '<bi>', '<b><i>Broni</i></b>');
  new_text = replaceAll(new_text, '<dg>', '<b><i>Drobiazg</i></b>');
  new_text = replaceAll(new_text, '<py>', '<b><i>Przeklęty</i></b>');
  
  
  game.txtText.fontStyles = [];
  game.txtText.fontWeights = [];
  game.txtText.fontSizes = [];
  game.txtText.colors = [];

  var markers = ['i', 'b'];

  var i = 0;
  var in_tag = false;
  var pos1 = 0;
  var pos2 = 0;  
  while (i < new_text.length) {
    var chr = new_text[i];
    if (chr == '<') {
      in_tag = true;
      pos1 = i;
    };
    if ((chr == '>')&&(in_tag)) {
      pos2 = i+1;
      in_tag = false;
      var tag = new_text.slice(pos1, pos2);
      new_text = new_text.slice(0, pos1) + new_text.slice(pos2, new_text.length);
      //alert(new_text);
      tag = tag.slice(1, tag.length-1);
      var params = tag.split(' ');
      tag = params.shift();
      //alert('tag:'+ tag);
      //alert('params:' + params);
      if(tag == 'b') {
        game.txtText.addFontWeight('bold', pos1);
      } else if(tag == '/b') {
        game.txtText.addFontWeight('normal', pos1);
      } else if(tag == 'i') {
        game.txtText.addFontStyle('italic', pos1);
      } else if(tag == '/i') {
        game.txtText.addFontStyle('normal', pos1);
      } else if(tag == 'colour') {
        game.txtText.addColor(params[0], pos1);
      } else if(tag == '/colour') {
        game.txtText.addColor('black', pos1);
      }
      i -= pos2 - pos1;
    };
    
    //alert(chr);
    i++;
  }
  
  game.txtText.setText(new_text);
  if ((game.txtText.height > game.generic_text_region[3])&&(layout_type == 'a')) {
    layout_type = 'b';
    assignRecToRegion(game.generic_picture_rec_b, game.picture_region);  

    assignRecToRegion(game.generic_type_region_b, game.type_region);
    game.txtType.x = Math.floor(game.type_region.x + game.type_region.width / 2);
    game.txtType.y = Math.floor(game.type_region.y + game.type_region.height / 2);

    assignRecToRegion(game.generic_text_region_b, game.text_region);
    game.txtText.x = Math.floor(game.text_region.x + game.text_region.width / 2);
    game.txtText.y = game.text_region.y;
    
    //game.exp_sym.x = 40;
    game.exp_sym.y = 280;
    //game.exp_icon.x = 59;
    game.exp_icon.y = 336;
    
  } else if ((game.txtText.height <= game.generic_text_region[3])&&(layout_type == 'b')) {
    layout_type = 'a';
    assignRecToRegion(game.generic_picture_rec, game.picture_region);

    assignRecToRegion(game.generic_type_region, game.type_region);
    game.txtType.x = Math.floor(game.type_region.x + game.type_region.width / 2);
    game.txtType.y = Math.floor(game.type_region.y + game.type_region.height / 2);

    assignRecToRegion(game.generic_text_region, game.text_region);
    game.txtText.x = Math.floor(game.text_region.x + game.text_region.width / 2);
    game.txtText.y = game.text_region.y;
    
    //game.exp_sym.x = 40;
    game.exp_sym.y = 394;
    //game.exp_icon.x = 59;
    game.exp_icon.y = 450;
    
  };
  refreshLayout();
  //game.CalcFontSize(game.txtText, game.text_region, game.text_font_size_max);
};

function refreshEncounterNr() {
  var nr = $("#encounter_nr").val();
  game.txtEncounter.setText(nr);
  game.no_enc_nr.visible = curr_layout.name == 'adventure' && nr == '';
  game.CalcFontSize(game.txtEncounter, game.encounter_region, game.encounter_font_size_max);
};


var blackWhite = function(r, g, b, a) {
  var avg = 0.3  * r + 0.59 * g + 0.11 * b;
  return [avg, avg, avg, a];
}

var sepia = function(r, g, b, a) {
  var avg = 0.3  * r + 0.59 * g + 0.11 * b;
  return [avg + 100, avg + 50, avg + 0, a]; // 100, 50, 0
}

function showPicture(img, effect=null, resize=true) {
  //bmd.ctx.beginPath();
  //bmd.ctx.rect(0,0,128,128);
  //bmd.ctx.fillStyle = '#ff0000';
  //bmd.ctx.fill();
  
  //game.picture.width = img.width;
  //game.picture.height = img.height;
  var bmd = game.add.bitmapData(img.width, img.height);
  bmd.ctx.drawImage(img, 0, 0);
  
  var img_data = bmd.ctx.getImageData(0, 0, img.width, img.height);
  var newpx = img_data.data;
  var res = [];
  var len = newpx.length;
  
  for (var i = 0; i < len; i += 4) {
   res = [newpx[i], newpx[i+1], newpx[i+2], newpx[i+3]];
   if (!!effect) {
     res = effect(res[0], res[1], res[2], res[3]);
   }
   //res[0] = 255;
   //res[1] = 255;
   //res[2] = 255;
   //res[3] = 255;
   
   newpx[i]   = res[0]; // r
   newpx[i+1] = res[1]; // g
   newpx[i+2] = res[2]; // b
   newpx[i+3] = res[3]; // a
  }
  bmd.ctx.putImageData(img_data, 0, 0);
  
  game.picture.loadTexture(bmd);
  
  //game.picture.width = img.width;
  //game.picture.height = img.height;
  //var ratio = game.picture_region.width / img.width;
  //game.picture.scale.setTo(ratio);
}

var img = document.getElementById("blah");
img.addEventListener('load', function() {
  showPicture(img, pic_effect);
}, false);

var img_symbol = document.getElementById("exp-image");
img_symbol.addEventListener('load', function() {
  
  //game.picture.width = img.width;
  //game.picture.height = img.height;
  
  var bmd = game.add.bitmapData(img_symbol.width, img_symbol.height);
  bmd.ctx.drawImage(img_symbol, 0, 0);
  /*
  var img_data = bmd.ctx.getImageData(0, 0, img_symbol.width, img_symbol.height);
  var newpx = img_data.data;
  var res = [];
  var len = newpx.length;
  
  for (var i = 0; i < len; i += 4) {
   res = [newpx[i], newpx[i+1], newpx[i+2], newpx[i+3]];
   //res = sepia(res[0], res[1], res[2], res[3]);
   //res[0] = 255;
   //res[1] = 255;
   //res[2] = 255;
   //res[3] = 255;
   
   newpx[i]   = res[0]; // r
   newpx[i+1] = res[1]; // g
   newpx[i+2] = res[2]; // b
   newpx[i+3] = res[3]; // a
  }
  bmd.ctx.putImageData(img_data, 0, 0);
  */
  game.exp_icon.loadTexture(bmd);
  var ratio = game.exp_icon.width / game.exp_icon.height;
  game.exp_icon.width = 30;
  game.exp_icon.height = 30 / ratio;
  
  //game.exp_icon.width = img.width;
  //game.exp_icon.height = img.height;
  //var ratio = game.exp_icon.width / img.width;
  //game.picture.scale.setTo(ratio);
}, false);

function readImage(input, output) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#'+output).attr('src', e.target.result);      
    };

    reader.readAsDataURL(input.files[0]);
  }
};

window.onload = function() {
  //$("#params").tabs();
  //$(":checkbox").checkboxradio();
  
  // wczytywanie czcionek
  document.fonts.load('10pt "Windlass Extended"');//.then(renderText);;
  document.fonts.load('10pt "Caxton Extended"');

   
  // wypelnianie listy dodatków
   $('#expansion').append('<option value="0">Wszystkie</option>');
  for (i in dodatki) {
    $('#expansion').append('<option value="'+dodatki[i].id+'" >' + dodatki[i].caption + '</option>');
  }  

  // wypelnianie listy z szablonami
  for (i in layouts) {
    $('#layout').append('<option value="'+layouts[i].id+'" style="background-image:url(/static/img/layouts/Talisman/' + 
      layouts[i].name + '/back_24.png);">' + layouts[i].caption + '</option>');
  }  

  game = new Phaser.Game(490, 750, Phaser.CANVAS, 'game', window.devicePixelRatio);
  game.state.add('boot', Boot);
  game.state.add('preload', Preload);
  game.state.add('game', Game);
  game.state.start('boot');
  
  $('#title').on('input',function(e){
    refreshTitle();
  });

  $('#type').on('input',function(e){
    refreshType();
  });

  $('#text').on('input',function(e){
    refreshText();
  });

  $('#encounter_nr').on('input',function(e){
    refreshEncounterNr();
  });

  $('#layout').on('change',function(e){
    refreshLayout();
  });

  $('#expansion').on('change',function(e){
    refreshLayoutList();
  });

  $('#exp-symbol').on('change',function(e){
    refreshExpSymbol();
  });
  
  $("#btn-save").click(function(){
    //var dataURL = game.canvas.toDataURL();
    //var image = game.canvas.toDataURL("image/png");
    //window.location.href = image;
    Canvas2Image.saveAsPNG(game.canvas, curr_layout.w, curr_layout.h, "card");
  });

  $("#btn-post").click(function(){
    var new_title = $("#title").val();
    if (new_title == '') {
      alert('Pole "Tytuł" nie może być puste!');
      return false;
    }
  });

  $("#debug-mode").click(function(){
    game.debug_mode = $("#debug-mode").prop('checked');
  });

  $("#eff-sepia").click(function(){
    var checked = $("#eff-sepia").prop('checked');
    if (checked) {
      pic_effect = sepia;
    } else {
      pic_effect = null;
    }
    $("#eff-b-w")[0].checked = false;
    $("#eff-b-w").checkboxradio("refresh");
    showPicture(img, pic_effect, false);
  });

  $("#eff-b-w").click(function(){
    var checked = $("#eff-b-w").prop('checked');
    if (checked) {
      pic_effect = blackWhite;
    } else {
      pic_effect = null;
    }
    $("#eff-sepia")[0].checked = false;
    $("#eff-sepia").checkboxradio("refresh");
    showPicture(img, pic_effect, false);
  });
  
  $("#btn-front").click(function(){
    $(".flip-container").removeClass('flip');
  });

  $("#btn-back").click(function(){
    $(".flip-container").addClass('flip');
  });

  $("#btn-expand").click(function(){
    game.picture.scale.x += 0.02;
    game.picture.scale.y += 0.02;
    $("#pic_scale_x").val(game.picture.scale.x);
    $("#pic_scale_y").val(game.picture.scale.y);
  });

  $("#btn-collapse").click(function(){
    game.picture.scale.x -= 0.02;
    game.picture.scale.y -= 0.02;
    $("#pic_scale_x").val(game.picture.scale.x);
    $("#pic_scale_y").val(game.picture.scale.y);
  });

  $("#btn-move-up").click(function(){
    game.picture.y -= 10;
    $("#pic_y").val(game.picture.y);
  });

  $("#btn-move-down").click(function(){
    game.picture.y += 10;
    $("#pic_y").val(game.picture.y);
  });

  $("#btn-move-left").click(function(){
    game.picture.x -= 10;
    $("#pic_x").val(game.picture.x);
  });

  $("#btn-move-right").click(function(){
    game.picture.x += 10;
    $("#pic_x").val(game.picture.x);
  });

  /*switch (talia) {
  case 'przygody':
    setLayout('adventure');
    break;
  case 'podziemia':
    setLayout('dungeon');
    break;
  case 'czary':
    setLayout('spell');
    break;
  case 'ekwipunek':
    setLayout('purchase');
    break;
  case 'otchlan':
    setLayout('adventure');
    break;
  case 'talismany':
    setLayout('talisman');
    break;  
  };*/

};