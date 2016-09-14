$(function() {

  var page = {

    init: function(){

    //Default settings
    var musicList = {"rain"    : {"url" : "rain.mp3","volume"           : 24,"nowplaying"  : 0, "rand" : 0},
                     //"white" : {"url" : "white-noise-01.mp3","volume" : 5, "nowplaying"  : 0, "rand" : 0},
                     "river"   : {"url" : "river-4.mp3","volume"        : 4, "nowplaying"  : 0, "rand" : 0},
                     "wind"    : {"url" : "wind-gust-02.mp3","volume"   : 28, "nowplaying" : 0, "rand" : 0},
                     "thunder" : {"url" : "thunder.mp3","volume"        : 25, "nowplaying" : 0, "rand" : 0},
                     "forest"  : {"url" : "bird.mp3","volume"           : 20, "nowplaying" : 0, "rand" : 0},
                     "chimes"  : {"url" : "chimes.mp3","volume"         : 30, "nowplaying" : 0, "rand" : 1},
                     "ocean"   : {"url" : "ocean.mp3", "volume"         : 15, "nowplaying" : 0, "rand" : 1},
                     "night"   : {"url" : "night.mp3","volume"          : 30, "nowplaying" : 0, "rand" : 1},
                   };


//TODO: Similar to sublime preferences, user preferences should overwrite default
  var user = {"rain" : {"volume" : 100, "nowplaying" : 0, "rand": 0}};


//TODO: Learn about JSON and change musicList into a json file

    var musicLength = Object.keys(musicList).length;

    //FIXME: Add a balancing whenever an object is moved

    var addCard = (function(music) {
          var value= "";
          var properMusic = music.charAt(0).toUpperCase() + music.slice(1); //Convert first letter to uppercase
          value+='<div class="card thumbnail playing" id="' + music + '">';
          value+='<h4 style="text-align:center">' + properMusic + '</h4>';
          value+='<div style="min-height:1px;float:left;width:32px;"></div><div style="float:right;width:32px;"><img class="img-responsive inline-block" src="img/dice.png" /></div>';
          value+='<img class="card-icon" src="img/' + music + '.png" />';
          //input or div for volumebar?
          value+='<div class="volumebar" data-slider-id="volumebar"';
          value+='data-slider-max="100" data-slider-value="' + musicList[music].volume + '"><div class="volume"></div></div>';
          value+='';
          value+='<audio autoplay><source src="mp3/' + musicList[music].url + '" type="audio/mpeg" /></audio>';
          value+='</div>';

          return value;
    });

    var row = 3;
    var colList = ["","",""];

    var iterate = 0;
    for (var music in musicList) {
      for (var j = 0; j < row;j++){
        if (Math.floor(iterate / (musicLength/row)) < j + 1){
          colList[j]+=addCard(music);
          break;
        }
      }
      iterate++;
    }

    for (var i = 0; i < colList.length; i++){
      $('#card-col' + i).append(colList[i]);
    }

   // Sortable cards, drag won't activate click events for children
   // BUG: Buggy, click() triggers after click.prevent is over, when it shouldn't trigger at all
   // only happens with revert: true
    $('.card-col').sortable({
          opacity: 0.5,
          connectWith: ".card-col",
          start: function(event,ui){
            //TODO: for some reason click event happens after class is removed
              ui.item.addClass("cawcaw");
              console.log(ui.item);
          },
          stop: function(event, ui) {
              ui.item.removeClass("cawcaw");
              var soundCard = ui.item;
               if (soundCard.hasClass("playing")){
                 soundCard.children('audio').get(0).play();
               }
               else {
                 soundCard.children('audio').get(0).pause();
               }
               // if this > this2 + 1, move last of this to first of that



              /*start: function(event, ui) {
                  ui.item.children().bind("click.prevent",
                      function(event) { event.preventDefault(); });
              },
              stop: function(event, ui) {
                  setTimeout(function(){ui.item.children().unbind("click.prevent");}, 10000);
              }*/
          },

    });

    var cards = {
      iconclick: function(cardSelected){

          var cardicon = cardSelected.children('.card-icon');
          var cardID = cardSelected.attr('id');
          cardicon.click(function(e) {
            if (cardSelected.hasClass('cawcaw')){
            console.log("sup");
            cardSelected.removeClass('cawcaw');
            } else {
            console.log("sup2");
            //clear the function that starts playing the music again
             clearTimeout(musicList[cardID].randDelay);
             var song = cardSelected.children('audio').get(0);
             cardSelected.toggleClass("playing");
             if (cardSelected.hasClass("playing")){
               song.play();
             }
             else {
               song.pause();
             }
           }
          });

      },

      setPlaying: function(cardSelected){
        var cardID = cardSelected.attr('id');
        cardSelected.children('audio').prop("volume", musicList[cardID].volume/100);

        if (!musicList[cardID].nowplaying){
          cardSelected.removeClass('playing');
          cardSelected.children('audio').get(0).pause();
        }
      },

    //TODO: check event propagation
    //FIXME: Set initial volume icon.
      setVolumeSlider: function(cardSelected){
        var volControl = cardSelected.children('.volumebar');
        volControl.slider().on('slide', function(ev){

              var song = cardSelected.children('audio');
              song.prop("volume",ev.value/100);
              volume = cardSelected.children('.volume');
              if(ev.value <= 5) {
                volume.css('background-position', '0 0');
              }
              else if (ev.value <= 25) {
                volume.css('background-position', '0 -25px');
              }
              else if (ev.value <= 75) {
                volume.css('background-position', '0 -50px');
              }
              else {
                volume.css('background-position', '0 -75px');
              }

            });
      },

      //TODO: Improve randomize feature
      randomizer: function (cardSelected){
        cardSelected.children('audio').on('ended', function(){
            var cardID = cardSelected.attr('id');
            if (musicList[cardID].rand){
              var randNum = Math.floor(Math.random() * 30000 + 1) + 1;

              cardSelected.children('.card-icon').trigger("click");
              musicList[cardID].randDelay = setTimeout(function(){
                cardSelected.children('.card-icon').trigger("click");
              }, randNum);
            } else {
              $(this).get(0).play();
            }
        });
      },
      init: function(){
        cardGuy = this;
        $('.card').each(function(){
          var cardSelected = $(this);
          var cardID = cardSelected.attr('id');

          cardGuy.setPlaying(cardSelected);
          cardGuy.iconclick(cardSelected);
          cardGuy.setVolumeSlider(cardSelected);
          cardGuy.randomizer(cardSelected);


        });
      }
    };

    cards.init();

    $('.sound-toggle').click(function(){
      $(this).toggleClass('muted');
        $('audio').each(function(){
          $(this).get(0).muted = $('.sound-toggle').hasClass('muted');
        });
    });
  }
};

$(document).ready(page.init);

});
