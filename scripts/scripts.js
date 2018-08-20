$(document).ready(function() {
    // these variables are used for various purposes
    // including making the difficulty level screen dynamically
    // and tracking which difficulty level is selected
    const levelNames = ["Besaid", "Luca", "Djose", "Thunder Plains", "Gagazet"];
    const difficultyLevel = ["very easy", "easy", "medium", "advanced", "expert"];
    
    // these variables are used to trak 100 percent completion of a difficulty leve
    // to determin if a level should be hidden
    // and to determine if sin should be spawned 
    let BesaidCount;
    let LucaCount;
    let DjoseCount;
    let ThunderPlainsCount;
    let GagazetCount;
    let SinCount;

    // a global tracker for the currently selected level
    let levelChoice;

    // a global tracker for which question you are on given each difficulty
    let questionTracker;

    //a global timer for the questions
    let intervalId;
    let timerStart;
        
    //tracking the last song played for ease of access
    let lastSong;
    
    //this let's us control the music that is playing during each section
    function musicPlayer(track, state){
        if(state == 'on'){
            $("audio[id*='"+track+"']").get(0).play();
            volume(track);
        } 
        else if(state == 'off'){
            $("audio[id*='"+track+"']").get(0).pause();
            $("audio[id*='"+track+"']").get(0).currentTime = 0;
        }
    }

    //color control
    function mainColor(screen){
        $('.main').removeClass('choiceColor BesaidColor LucaColor DjoseColor ThunderPlainsColor GagazetColor SinColor');
        $('.main').addClass(screen+'Color');
    }

    // making sure the music volume isn't too loud
    function volume(track) {
        document.getElementById(track).volume = .05;
    };
    
    //change the background based on level
    function backdrop(location){
        $('.background').attr('src', 'images/'+location+'.png')
    }

    //start the game on click
    $(".main-startBtn").on('click', function(event){
        event.preventDefault();
        $('#player').remove();
        difficultyChoice();
        document.getElementById('video').addEventListener('ended', cutsceneEnded, false)
    })
    
    //difficulty selection screen
    function difficultyChoice(){
        //clear main and remove timer div
        $(".main").empty();
        $(".timer").remove();
        mainColor('choice')

        //this allows for replayability by only reseting boss when difficulty is called
        //as it only needs to be 0 before and every other time doesn't matter
        SinCount = 0;

        //if this isn't the fist time to the difficulty screen turn off the other music
        if(lastSong){
            musicPlayer(lastSong, 'off');
        }

        //if all this is true boss round
        if(BesaidCount == Questions['Besaid'].length &&
        LucaCount == Questions['Luca'].length &&
        DjoseCount == Questions['Djose'].length &&
        ThunderPlainsCount == Questions['ThunderPlains'].length &&
        GagazetCount == Questions['Gagazet'].length){
            
            //reset the question tracker for sin
            questionTracker=0;
            
            mainColor('Sin')
            musicPlayer('Pursuit', 'on')

            const sinText1 = $('<div class="sin-text" >')
            $('.main').append(sinText1);
            sinText1.text('Sin has been sighted!')
            const sinText2 = $('<div class="sin-text" >')
            $('.main').append(sinText2);
            sinText2.text('Engage?');
            const sinBtn = $('<button class="sin-startBtn" >');
            $('.main').append(sinBtn);
            sinBtn.text("Let's do this!");

            //cutscene
            $('body').on('click', '.sin-startBtn', function(event){
                event.preventDefault();
                musicPlayer('Pursuit', 'off')
                $('#video').addClass('cutscene');
                document.getElementById("video").play();
            })
        }

        //else must be a normal trip to the select screen
        else {
            //backdrop and music 
            musicPlayer('choiceMusic', 'on');
            backdrop('mainSplash')

            //create buttons for the difficulty level and assign them stuff
            for (let i = 0; i < levelNames.length; i++){
                const difficultyBtn = $("<div class='difficultyBtn' >");
                let name = levelNames[i].replace(/ /g, '');
                difficultyBtn.attr("id", name);
                $(".main").append(difficultyBtn);
                $("#" + name).append("<h2>" + levelNames[i] + "</h2><p>" + difficultyLevel[i] + "</p>");
                difficultyBtn.attr("data-level", name);
            };
            //this will hide buttons if we get enough points in a particular catagory the sequential times around
            if(BesaidCount == Questions['Besaid'].length){
                $("#Besaid").attr("class", "hidden");
            }
            if(LucaCount == Questions['Luca'].length){
                $("#Luca").attr("class", "hidden");
            }
            if(DjoseCount == Questions['Djose'].length){
                $("#Djose").attr("class", "hidden");
            }
            if(ThunderPlainsCount == Questions['ThunderPlains'].length){
                $("#ThunderPlains").attr("class", "hidden");
            }
            if(GagazetCount == Questions['Gagazet'].length){
                $("#Gagazet").attr("class", "hidden");
            }
        }
    };
    
    //select your difficulty
    $('body').on("click", '.difficultyBtn', function(){
        levelChoice = $(this).attr("data-level");
        lastSong = levelChoice;
        questionTracker=0;

        gameStart(levelChoice);
        mainColor(levelChoice);
        backdrop(levelChoice);
        musicPlayer('choiceMusic', 'off')
        musicPlayer(levelChoice, 'on')
        populate(levelChoice);

        // this section ensures that the boss level will only trigger if all the other levels have been beaten
        if(levelChoice == 'Besaid'){
            BesaidCount = 0;
        }
        if(levelChoice == 'Luca'){
            LucaCount = 0;
        }
        if(levelChoice == 'Djose'){
            DjoseCount = 0;
        }
        if(levelChoice == 'ThunderPlains'){
            ThunderPlainsCount = 0;
        }
        if(levelChoice == 'Gagazet'){
            GagazetCount = 0;
        }
    });
    
    //make the game screen
    function gameStart(difficulty){
        //clear the main div for questions and answers
        $(".main").empty();

        //append the question field and the timer
        $(".main").append("<div class='question'>");
        $(".main").prepend("<div class='timer'>");  

        //dynamically append the divs for the answers to the main div
        for (let i = 0; i < Questions[difficulty][questionTracker].answers.length; i++){
            
            const row = $("<row class='answer-choice'>");
            row.attr("id", "row" + i);
            row.attr("data-level", difficulty);
            
            $(".main").append(row);
            
            const answerNumber = $("<div class='answerNumber'>");
            answerNumber.attr("id", "answerNumber" + i);
            const answer = $("<div class='answer'>");
            answer.attr("id", "answer" + i);

            $("#row" + i).append(answerNumber);
            $("#row" + i).append(answer);
        }
    };
    
    //populate the game screen with information
    function populate(difficulty){
 
        //just a time saver
        let question = Questions[difficulty][questionTracker]

        //empty out each of the divs for the next set of questin and answers
        $(".question").empty();
        $(".answerNumber").empty();
        $(".answer").empty();
        $(".timer").html("<h3>Timer: 20</h3>");
        $(".question").text(question.question);

        //populate the screen witht the quesiton and answers
        for (let i = 0; i < question.answers.length; i++){
            // appending the proper answer number and answer to the div
            $("#answerNumber" + i).text(i + 1);
            $("#answer" + i).text(question.answers[i].a);
            $("#row" + i).attr("data-value", question.answers[i].value)

            // this is for adding the green and red if they answer wrong 
            $("#answerNumber" + i).addClass("answerNumber" + question.answers[i].value);
            $("#answer" + i).addClass("answer" + question.answers[i].value);
        }

        //start the answer timer
        runTimer(difficulty);
    };

    //a simple timer for each question
    function runTimer(difficulty) {
        timerStart = 20;
        clearInterval(intervalId);
        intervalId = setInterval(decrement, 1000, difficulty);
    };

    //make the timer count down and also update live on screen
    function decrement(levelChoice) {

        timerStart--;
        $(".timer").html("<h3>Timer: " + timerStart + "</h3>");
        if (timerStart == 0) {
            //if out of time stop the timer
            stop();

            //update the question tracker so that we get to the next question
            questionTracker++;

            //reset the boss count for current level to 0 for wrong question
            if(levelChoice == 'Besaid'){
                BesaidCount = 0;
            }
            if(levelChoice == 'Luca'){
                LucaCount = 0;
            }
            if(levelChoice == 'Djose'){
                DjoseCount = 0;
            }
            if(levelChoice == 'ThunderPlains'){
               ThunderPlainsCount = 0;
            }
            if(levelChoice == 'Gagazet'){
                GagazetCount = 0;
            }
            if(levelChoice == 'Sin'){
                SinCount=0;
            }

            //if player fails to answer the final question on the boss level 
            //tell the player that they have lost
            if(questionTracker == Questions[levelChoice].length && levelChoice == 'Sin'){ 
                endgameScreen('lost'); 
            }
            //if player fails last question in the set by timer
            //send player to the difficulty screen
            else if (questionTracker == Questions[levelChoice].length){
                difficultyChoice();
            }
            //if player fails by timer and it is not the last question
            //set next question
            else {
                populate(levelChoice);
            }
        }
    }; 

    //stop the timer
    function stop() {
        clearInterval(intervalId);
      }

    //on click of an answer option
    $('body').on('click', '.answer-choice', function(){
        //stop the tiemer and update the question trcker
        stop();
        questionTracker++;

        //the answer the player selected
        answer = $(this).attr('data-value');
        level = $(this).attr('data-level');

        //just to save time
        totalAnswers = Questions[level].length;

        //if the answer is true
        if(answer == 1){
            //update the score counts for the boss round
            if (level == 'Besaid'){
                BesaidCount++;
            }
            if (level == 'Luca'){
                LucaCount++;
            }
            if (level == 'Djose'){
                DjoseCount++;
            }
            if (level == 'ThunderPlains'){
                ThunderPlainsCount++;
            }
            if (level == 'Gagazet'){
                GagazetCount++;
            }
            if (level == 'Sin'){
                SinCount++;
            }

            //if victorious against sin show player the victory screen
            if(level == 'Sin' && SinCount == totalAnswers){
                //player victory screen
                endgameScreen('won');
            }
            //answer correctly on last question but lose to sin
            else if (level == 'Sin' && questionTracker == totalAnswers && SinCount !== totalAnswers){
                endgameScreen('lost');
            }
            //if not on boss level but finished all questions
            else if(questionTracker ==  totalAnswers){
                //return the player to the difficulty screen
                difficultyChoice();
            }
            //if not boss level put up next question
            else {
                //next question
                populate(level);
            }
        } 
        
        //if the answer is false
        else if (answer == 0){
            //add color classes
            colorClasses('on')
            //reset level count for wrong answer
            if (level == 'Besaid'){
                BesaidCount=0;
            }
            if (level == 'Luca'){
                LucaCount=0;
            }
            if (level == 'Djose'){
                DjoseCount=0;
            }
            if (level == 'ThunderPlains'){
                ThunderPlainsCount=0;
            }
            if (level == 'Gagazet'){
                GagazetCount=0;
            }
            if (level == 'Sin'){
                SinCount=0;
            }
            
            //if last boss question is failed show lose screen
            if(questionTracker == totalAnswers && level == 'Sin'){  
                endgameScreen('lost');
            }

            //timeout function so that the colors show answer for a bit
            setTimeout(function(){
                //if last question and not boss level show color classes for 2 secons before
                //moving to next question or back to difficulty screen
                if (questionTracker == totalAnswers && level !== 'Sin'){
                    colorClasses('off');
                    difficultyChoice();
                } 
                else if (questionTracker !== totalAnswers){
                    colorClasses('off');
                    populate(level);
                }  
            }, 2000);
        }
    });

    //for adding or taking away color classes from answers
    function colorClasses(position){
        let state = position;

        //add color to indicate the correct answer if the player guesses wrong
        //also for removeing the classes prior to new question so that the colors
        //dont remain on the worng answers
        if (state == 'on'){
            for(let i = 0; i < 4; i++){
                if($('#row'+i).attr('data-value')==1){
                    $('#row'+i).removeClass('answer-choice').addClass('right')
                }
                else if($('#row'+i).attr('data-value')==0){
                    $('#row'+i).removeClass('answer-choice').addClass('wrong')
                }
            }
        } 
        else if (state == 'off'){
            for(let i = 0; i < 4; i++){
                if($('#row'+i).attr('data-value')==1){
                    $('#row'+i).removeClass('right').addClass('answer-choice')
                }
                else if($('#row'+i).attr('data-value')==0){
                    $('#row'+i).removeClass('wrong').addClass('answer-choice')
                }
            }
        }
    }

    //when the video ends load up sin level
    function cutsceneEnded(){
        $('#video').removeClass('cutscene')

        //backdrop and music 
        musicPlayer('Sin', 'on');
        backdrop('Sin')

        //bossround boiz
        gameStart('Sin');
        mainColor('fightSin');

        //boss round
        populate('Sin');

        //reset all counts take this away when add replay button and put it there
        BesaidCount, LucaCount, DjoseCount, ThunderPlainsCount, GagazetCount = 0;
    }

    //creating the lose screen for the player
    function endgameScreen(condition){
        $(".timer").remove()
        $(".main").empty();
        musicPlayer('Sin', 'off')
        if(condition == 'lost'){
            musicPlayer('playerLost', 'on')
            backdrop('loseScreen')
            let youLose = $("<div class='player-lost'>")
            $(".main").append(youLose);
            $(".player-lost").text('YOU LOST!');
        }
        if(condition == 'won'){
            musicPlayer('playerWon', 'on')
            backdrop('loseScreen')
            // document.getElementById('victoryVid').play();
            let youWin = $("<div class='player-wins'>")
            $(".main").append(youWin);
            $(".player-wins").text('YOU WON!');
        }

    };
});
