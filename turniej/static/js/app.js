var game;
var layout_type = 'a';
var curr_layout = null;

function setLayout(name) {
  for (var i in layouts) {
    if (layouts[i].name == name) {
      $("#layer").val(i);
      break;
    }
  }
}

function refreshCard() { 
  refreshLayout();
  refreshTitle();
  refreshType();
  refreshText();
  refreshEncounterNr();
  game.debug_mode = $("#debug-mode").prop('checked');
};
    
function refreshLayout() {
  curr_layout = layouts[parseInt($("#layer").val())];
  $("#layer").css('background-image', 'url(/static/img/templates/'+curr_layout.name+'_icon.png)');
  
  if (curr_layout.long_txt) {
    game.card.loadTexture(curr_layout.name+'-front-'+layout_type);
  } else {
    game.card.loadTexture(curr_layout.name+'-front-a');
  }
  
  if (['ifrit', 'ifrit_r'].indexOf(curr_layout.name) > -1) {
    $("#back").css('background-image', 'url(/static/img/templates/adventure_back.png)'); 
  } else {
    $("#back").css('background-image', 'url(/static/img/templates/'+curr_layout.name+'_back.png)');
  }
  
  game.txtEncounter.visible = (curr_layout.en_nr);
  game.txtType.visible = (curr_layout.type_txt);
 
  if (curr_layout.dpi300) {
    game.card.scale.setTo(1.0);
  } else {
    game.card.scale.setTo(2.0);
  };
};

function refreshTitle() {
  var new_title = $("#title").val();
  game.txtTitle.setText(new_title);
  game.CalcFontSize(game.txtTitle, game.title_region, game.title_font_size_max);
};

function refreshType() {
  var new_type = $("#type").val();
  game.txtType.setText(new_type);
  game.CalcFontSize(game.txtType, game.type_region, game.type_font_size_max);
};

function assignRecToRegion(rec, region) {
  region.x = rec[0];
  region.y = rec[1];
  region.width = rec[2];
  region.height = rec[3];
}

function refreshText() {
  var new_text = $("#text").val();
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
    
    refreshLayout();
  } else if ((game.txtText.height <= game.generic_text_region[3])&&(layout_type == 'b')) {
    layout_type = 'a';
    assignRecToRegion(game.generic_picture_rec, game.picture_region);

    assignRecToRegion(game.generic_type_region, game.type_region);
    game.txtType.x = Math.floor(game.type_region.x + game.type_region.width / 2);
    game.txtType.y = Math.floor(game.type_region.y + game.type_region.height / 2);

    assignRecToRegion(game.generic_text_region, game.text_region);
    game.txtText.x = Math.floor(game.text_region.x + game.text_region.width / 2);
    game.txtText.y = game.text_region.y;
    
    refreshLayout();
  };
  //game.CalcFontSize(game.txtText, game.text_region, game.text_font_size_max);
};

function refreshEncounterNr() {
  var nr = $("#encounter_nr").val();
  game.txtEncounter.setText(nr);
  game.CalcFontSize(game.txtEncounter, game.encounter_region, game.encounter_font_size_max);
};

var img = document.getElementById("blah");
img.addEventListener('load', function() {
  //bmd.ctx.beginPath();
  //bmd.ctx.rect(0,0,128,128);
  //bmd.ctx.fillStyle = '#ff0000';
  //bmd.ctx.fill();
  
  var img = document.getElementById("blah");
  game.picture.width = img.width;
  game.picture.height = img.height;
  
  var bmd = game.add.bitmapData(img.width, img.height);
  bmd.ctx.drawImage(img, 0, 0);
  game.picture.loadTexture(bmd);
  
  game.picture.width = img.width;
  game.picture.height = img.height;
  var ratio = game.picture_region.width / img.width;
  game.picture.scale.setTo(ratio);
  
}, false);

function readImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#blah').attr('src', e.target.result);      
    };

    reader.readAsDataURL(input.files[0]);
  }
};

window.onload = function() {
  // wczytywanie czcionek
  document.fonts.load('10pt "Windlass Extended"');//.then(renderText);;
  document.fonts.load('10pt "Caxton Extended"');

  // wypelnianie listy z szablonami
  for (i in layouts) {
    $('#layer').append('<option value="'+i+'" style="background-image:url(/static/img/templates/' +
      layouts[i].name + '_icon.png);">' + layouts[i].caption + '</option>');
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

  $('#layer').on('change',function(e){
    refreshLayout();
  });

  
  $("#btn-save").click(function(){
    //var dataURL = game.canvas.toDataURL();
    //var image = game.canvas.toDataURL("image/png");
    //window.location.href = image;
    Canvas2Image.saveAsPNG(game.canvas, 490, 750, "card");
  });

  $("#debug-mode").click(function(){
    game.debug_mode = $("#debug-mode").prop('checked');
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
  });

  $("#btn-collapse").click(function(){
    game.picture.scale.x -= 0.02;
    game.picture.scale.y -= 0.02;
  });

  $("#btn-move-up").click(function(){
    game.picture.y -= 10;
  });

  $("#btn-move-down").click(function(){
    game.picture.y += 10;
  });

  $("#btn-move-left").click(function(){
    game.picture.x -= 10;
  });

  $("#btn-move-right").click(function(){
    game.picture.x += 10;
  });

  switch (talia) {
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
  };

};