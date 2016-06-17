/**
 * 
 * This script manage the clock
 * More info at http://flipclockjs.com/
 */
$(document).ready(function () {
    var clock;
    $(document).ready(function () {
        clock = $('#clock').FlipClock(50, {
            clockFace: 'MinuteCounter',
            countdown: true,
            autoStart: true,
            callbacks: {
                start: function () {
                    $('#renderCanvas').click(function (e) {
                        clock.start();
                    });
                }
            }
        });

        $('#renderCanvas').click(function (e) {
            //clock.start();
        });
    });
});
