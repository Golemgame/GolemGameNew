showDifficulLevel = function () {
    $('div#difficultyLevel').show()
    $("#diff_Easy").addClass("bounceInLeft animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
        function () {
            $(this).removeClass("bounceInLeft animated")
        }),
 $("#diff_Medium").addClass("bounceInRight animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
        function () {
            $(this).removeClass("bounceInRight animated")
        }),
 $("#diff_Hard").addClass("bounceInLeft animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
        function () {
            $(this).removeClass("bounceInLeft animated")
        });
}
$(document).ready(function () {
    $('#playBtn').click(function () {
        $(this).addClass("bounceOutRight animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
            function () {
                $(this).removeClass("bounceOutRight animated")
                $('#diffScreenHeader').show().addClass("bounceInDown animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
                    function () {
                        $(this).removeClass("bounceInDown animated")
                    });
                showDifficulLevel();

                $('div#MainMenuContainer').hide();
            });
        $('#leaderboardBtn').addClass("bounceOutLeft animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
            function () {
                $(this).removeClass("bounceOutLeft animated")
            })
        $('#learnBtn').addClass("bounceOutRight animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
            function () {
                $(this).removeClass("bounceOutRight animated")
            })
    });
    $('#lbBackButton').click(function () {
        $("div#diffScreenHeader").hide();
        $("div#MainMenuContainer").show();
        $("#playBtn").addClass("bounceInLeft animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
             function () {
                 $(this).removeClass("bounceInLeft animated")
             });
        $("#leaderboardBtn").addClass("bounceInRight animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
            function () {
                $(this).removeClass("bounceInRight animated")
            });
        $("#learnBtn").addClass("bounceInLeft animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
            function () {
                $(this).removeClass("bounceInLeft animated")
            });
        $('div#difficultyLevel').hide();
    })
    $("#leaderboardBtn").on("click", function () {
        $('div#pageMain').hide();
        $('div#pageLeaderboard').show();
    });

    $('#endRaceButtonMainMenu').click(function () {
        $('div#pageMain').show();
        $('div#pageLeaderboard').hide();
    })
    $('#pageLeaderboard').contents().find('#lbBackButton').click(function () {
        $('div#pageMain').show();
        $('div#pageLeaderboard').hide();
    })

    $('div#endRaceButtonReplay').click(function () {
        $('div#pageLeaderboard').hide();
        $('div#pageMain').show()
        $('#diffScreenHeader').show().addClass("bounceInDown animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
            function () {
                $(this).removeClass("bounceInDown animated")
            });
        showDifficulLevel();
        $('div#MainMenuContainer').hide();
    })
});
