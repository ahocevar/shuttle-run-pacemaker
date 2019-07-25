(function() {
  var stageOptions = [[7.5, 9, 10.5, 12, 13.5, 15], [7.5, 8.5, 9.5, 10.5, 11.5, 12.5]];
  var minPerStage = 3;
  var i = -1;

  var stages = stageOptions[0];
  for (var s = 0, ss = stageOptions.length; s < ss; ++s) {
    $('#stages').append('<li><a href="#">' + stageOptions[s].join(' &ndash; ') + ' km/h</a></li>');
  }
  $('#dropdownMenu1').html($('#stages li a').html() + ' <span class="caret"></span>');
  $('#stages li a').click(function(){
    var selText = $(this).text();
    $('#dropdownMenu1').html(selText + ' <span class="caret"></span>');
    stages = stageOptions[$('#stages li a').index($(this))];
    firstStage();
  });

  var distRemaining = 0;
  var secPer20m;
  function firstStage() {
    i = -1;
    nextStage();
  }
  function nextStage() {
    ++i;
    if (i >= stages.length) {
      $('#stage').html('Done!');
      $('#start').addClass('btn-success').removeClass('btn-danger').removeClass('btn-success');
      $('#start').html('<span class="glyphicon glyphicon-refresh"></span> Reload');
    } else {
      secPer20m = 20 / (stages[i] / 3.6);
      distRemaining = Math.ceil(60 / secPer20m * minPerStage) * 20;
      $('#start').addClass('btn-success').removeClass('btn-danger').removeClass('btn-default');
      $('#start').html('<span class="glyphicon glyphicon-play"></span> Start');
      $('#stage').html('Stage ' + (i + 1) + ' &mdash; ' + stages[i] + ' km/h');
      $('#dist').html(distRemaining + ' m');
    }
  }

  nextStage();

  var interval;
  var sound = new buzz.sound("beep", {
    formats: [ "ogg", "m4a"]
  });

  $('#start').click(function() {
    if ($('#start').html().indexOf('Start') > -1) {
      sound.play();
      $('#start').addClass('btn-danger').removeClass('btn-success').removeClass('btn-default');
      $('#start').html('<span class="blink glyphicon glyphicon-stop"></span> Stop');
      interval = window.setInterval(function() {
        distRemaining -= 20;
        $('#dist').html(distRemaining + ' m');
        sound.play();
        if (distRemaining <= 0) {
          window.clearInterval(interval);
          window.setTimeout(sound.play.bind(sound), 1000);
          nextStage();
        }
      }, secPer20m * 1000);
    } else if ($('#start').html().indexOf('Stop') > -1) {
      window.clearInterval(interval);
      nextStage();
    } else {
      firstStage();
    }
  });
})();
