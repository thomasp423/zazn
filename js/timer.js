        
        var timeTravel = '';
        var intervalTimer = '';

        function begin() {
        playSound();

        // time from input
        var min = parseInt($('#min').val(), 10);
        var sec = 1;
        var time = min + sec; 

        // var min = 0;
        // var sec = 10;
        // var time = min + sec; 

        // time for output
        var mins = Math.floor((min % 3600) / 60);
        var secs = (sec % 60);
        var humanTime = '';

        // timer from input
        inputTimer = setInterval( function() {
          if (time > 0){
            --time;
          }
          else if(time == 0){
            time = -1;
            finish();
          }
        }, 1000);

        // timer for output
        function convertTime() {
            if (mins >= 0){
            timeTravel = setInterval( function() {
              --secs;
            if (secs == -1 && mins > 0){secs = 59; --mins;}  // changes the minute 
            else if (secs == 0 && mins == 0) {
            } // stops at 00:00

            humanTime = (((mins < 10) ? "0" : "") + mins + ":" + ((secs < 10) ? "0" : "") + secs);
            $('#timer').html(humanTime).fadeIn(200);
            }, 1000); 
          } else {}
        }

         // interval timer
        function interval() {
        var interval = parseInt($('#interval').val(), 10);

         if (interval >= 0){
            intervalTimer = setInterval( function() {
              --sec;
            if (sec == -1 && interval > 0){sec = 59; --interval;}  // changes the minute 
            else if (sec == 0 && min == 0) {clearInterval(intervalTimer);} // stops at 00:00

            intervalTime = (((interval < 10) ? "0" : "") + interval + ":" + ((sec < 10) ? "0" : "") + sec);
            }, 1000); 
          } else {}
      }
       
        $('#circleTimer').pietimer({
        timerSeconds: time,
        color: '#2d9de0',
        fill: false,
        showPercentage: false,
        callback: function() {
            $('#timer').pietimer('reset');
        }
        });

        interval();
        convertTime();
        $('#begin').fadeToggle(200); //fade out
        $('.selectStyle').fadeToggle(200); //fade out
        $('.circleSelect').fadeToggle(200); //fade out
        $('#circleTimer').delay(1000).fadeToggle(200); //fade in
        $('#during').delay(200).fadeToggle(200); //fade in

    } // end of begin function 

      // pause button
      function stop() {
        clearInterval(timeTravel);
        clearInterval(intervalTimer);
        $('#play').fadeToggle(1);
        $('#stop').delay(200).fadeToggle(1);

        // stops actual line
        clearInterval(timer);
        $(this).pietimer('drawTimer', 0);
      }

       // play button
          function play() {
            $('#play').fadeToggle(1);
            $('#stop').delay(200).fadeToggle(1);
            convertTime();
          }

      // reset button
      function resetTime() {
        $('#during').fadeToggle(200);
        $('#begin').delay(200).fadeToggle(200);
        $('.selectStyle').fadeToggle(200);
        $('.circleSelect').delay(200).fadeToggle(200);
        $('#timer').fadeToggle(200);
        $('#circleTimer').fadeToggle(200);

        clearInterval(timeTravel);
        clearInterval(intervalTimer);

         // stops actual line
        clearInterval(timer);
        $(this).pietimer('drawTimer', 0);

        secs = 0;
        mins = 0;
        humanTime = (((mins < 10) ? "0" : "") + mins + ":" + ((secs < 10) ? "0" : "") + secs);

        $('#timer').html(humanTime);
      }

      function finish() {
        playSound();
        clearInterval(timeTravel);
        clearInterval(intervalTimer);
        clearInterval(timer);
        $(this).pietimer('drawTimer', 0);

        $('#during').fadeOut(200);
        $('#circleContainer').fadeOut(500);
        $('#finish').insertAfter('#circleContainer').delay(1000).fadeToggle(400);

        secs = 0;
        mins = 0;
        humanTime = (((mins < 10) ? "0" : "") + mins + ":" + ((secs < 10) ? "0" : "") + secs);
        $('#timer').html(humanTime);

      }

      function again() {
        resetTime();
        $('#finish').fadeOut(200);
        $('#during').fadeToggle(0);
        $('#circleContainer').delay(200).fadeToggle(400);
      }


      function playSound(){
        var soundName = $('#sound').val();

        if (soundName == 'ding') { 
        soundName = document.getElementById('soundName');
        soundName.src = 'sounds/ding.mp3';
        }
        else if (soundName == 'bell') {
        soundName = document.getElementById('soundName');
        soundName.src = 'sounds/bell.mp3';
        } else {}
        soundName.play();
      }

// pie timer js

    $.fn.pietimer = function( method ) {
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.pietimer' );
        }
    };

    var methods = {
        init : function( options ) {
            var state = {
                timer: null,
                timerSeconds: 40,
                callback: function () {},
                timerCurrent: 0,
                showPercentage: false,
                fill: false,
                color: '#CCC'
            };

            state = $.extend(state, options);

            return this.each(function() {

                var $this = $(this);
                var data = $this.data('pietimer');
                if ( ! data ) {
                    $this.addClass('pietimer');
                    $this.css({fontSize: $this.width()});
                    $this.data('pietimer', state);
                    if (state.showPercentage) {
                        $this.find('.percent').show();
                    }
                    if (state.fill) {
                        $this.addClass('fill');
                    }
                    $this.pietimer('start');
                }
            });
        },

        stopWatch : function() {
            var data = $(this).data('pietimer');
            if ( data ) {
                var seconds = (data.timerFinish-(new Date().getTime()))/1000;
                if (seconds <= 0) {
                    clearInterval(data.timer);
                    $(this).pietimer('drawTimer', 100);
                    data.callback();
                } else {
                    var percent = 100-((seconds/(data.timerSeconds))*100);
                    $(this).pietimer('drawTimer', percent);
                }
            }
        },

        drawTimer : function (percent) {
            $this = $(this);
            var data = $this.data('pietimer');
            if (data) {
                $this.html('<div class="percent"></div><div class="slice'+(percent > 50?' gt50"':'"')+'><div class="pie"></div>'+(percent > 50?'<div class="pie fill"></div>':'')+'</div>');
                var deg = 360/100*percent;
                $this.find('.slice .pie').css({
                    '-moz-transform':'rotate('+deg+'deg)',
                    '-webkit-transform':'rotate('+deg+'deg)',
                    '-o-transform':'rotate('+deg+'deg)',
                    'transform':'rotate('+deg+'deg)'
                });
                $this.find('.percent').html(Math.round(percent)+'%');
                if (data.showPercentage) {
                    $this.find('.percent').show();
                }
                if ($this.hasClass('fill')) {
                    $this.find('.slice .pie').css({backgroundColor: data.color});
                }
                else {
                    $this.find('.slice .pie').css({borderColor: data.color});
                }
            }
        },
        
        start : function () {
            var data = $(this).data('pietimer');
            if (data) {
                data.timerFinish = new Date().getTime()+(data.timerSeconds*1000);
                $(this).pietimer('drawTimer', 0);
                data.timer = setInterval("$this.pietimer('stopWatch')", 50);
            }
        },

        reset : function () {
            var data = $(this).data('pietimer');
            if (data) {
                clearInterval(data.timer);
                $(this).pietimer('drawTimer', 0);
            }
        }

    };

