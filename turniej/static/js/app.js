var game;
var layouts = [
  'adventure', 'dungeon', 'highland', 'purchase', 'relic', 'treasure', 
  'spell', 'dragon1', 'dragon2', 'dragon3', 'quest_reward', 'warlock',
  'wampiry', 
  'bridge', 'city', 'denizen', 'remnant', 'harbinger', 'nether', 'path', 'tunnel', 
  'destiny_l', 'destiny_d', 'talisman', 'wanted', 'woodland', 'ifrit', 'ifrit_r'];
var layouts_names = [
  'Przygody', 'Podziemi', 'Gór', 'Ekwipunku', 'Reliktu', 'Skarbu', 
  'Zaklęcia', 'Smoka - Grillipus', 'Smoka - Cadorus', 'Smoka - Varthrax', 'Nagrody', 'Zadanie Czarownika',
  'Wampira', 
  'Mostu', 'Miasta', 'Mieszkańca', 'Pozostałości', 'Proroka', 'Nieszczęścia', 'Ścieżki', 'Tunelu',
  'Przeznaczenia (jasna)', 'Przeznaczenia (ciemna)', 'Talizmanu', 'List Gończy', 'Lasu', 'Ifrytów', 'Ifrytów (elitarnych)'];

var small_layouts = ['bridge', 'city', 'denizen', 'remnant', 'harbinger', 'nether', 'path', 'tunnel', 
  'destiny_l', 'destiny_d', 'talisman', 'wanted', 'woodland', 'ifrit', 'ifrit_r'];
var no_encounter = small_layouts.concat(['spell', 'wampiry', 'quest_reward', 'warlock']);
var no_type = ['quest_reward', 'warlock', 'denizen', 'path'];

function refreshCard() { 
  refreshLayout();
  refreshTitle();
  refreshType();
  refreshText();
  refreshEncounterNr();
  game.debug_mode = $("#debug-mode").prop('checked');
};
    
function refreshLayout() {
  var layout = layouts[parseInt($("#layer").val())];
  $("#layer").css('background-image', 'url(/static/img/templates/'+layout+'_icon.png)');
  game.card.loadTexture(layout+'-front-a');
  if (['ifrit', 'ifrit_r'].indexOf(layout) > -1) {
    $("#back").css('background-image', 'url(/static/img/templates/'+layouts[0]+'_back.png)'); 
  } else {
    $("#back").css('background-image', 'url(/static/img/templates/'+layout+'_back.png)');
  }
  
  
  game.txtEncounter.visible = (no_encounter.indexOf(layout) == -1);
  game.txtType.visible = (no_type.indexOf(layout) == -1);
 
  if (small_layouts.indexOf(layout) > -1) {
    game.card.scale.setTo(2.0);
  } else {
    game.card.scale.setTo(1.0);
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

function refreshText() {
  var new_text = $("#text").val();
  game.txtText.setText(new_text);
  if (game.txtText.height > game.text_region.height) {
  
  } else {
  
  };
  //game.CalcFontSize(game.txtText, game.text_region, game.text_font_size_max);
};

function refreshEncounterNr() {
  var nr = $("#encounter_nr").val();
  game.txtEncounter.setText(nr);
  game.CalcFontSize(game.txtEncounter, game.encounter_region, game.encounter_font_size_max);
};

window.onload = function() {
  // wypelnianie listy z szablonami
  for (i in layouts_names) {
    $('#layer').append('<option value="'+i+'" style="background-image:url(/static/img/templates/'+layouts[i]+'_icon.png);">'+layouts_names[i]+'</option>');
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


  switch (talia) {
  case 'przygody':
    $("#layer").val("0");
    break;
  case 'podziemia':
    $("#layer").val("1");
    break;
  case 'czary':
    $("#layer").val("6");
    break;
  case 'ekwipunek':
    $("#layer").val("3");
    break;
  case 'otchlan':
    $("#layer").val("0");
    break;
  case 'talismany':
    $("#layer").val("0");
    break;  
  };

};