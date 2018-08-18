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

    // when you click on the main start button on the home screen clear the screen and 
    // show the difficulty choices
    $(".main-startBtn").on('click', function(event){
        event.preventDefault();
        $(".main").empty();
        document.getElementById('music-player').play();
        volume();
        difficultyChoice();
    })
    
    // making sure the music volume isn't too loud
    function volume() {
        document.getElementById('music-player').volume = .05;
    }
    
    // creating the difficulty screen 
    function difficultyChoice(){
        //clear main and remove timer div
        $(".main").empty();
        $(".timer").remove();

        //create buttons for the difficulty level and assign them stuff
        for (let i = 0; i < levelNames.length; i++){
           const difficultyBtn = $("<div class='difficultyBtn' >");
           let name = levelNames[i].replace(/ /g, '');
           difficultyBtn.attr("id", name);
           $(".main").append(difficultyBtn);
           $("#" + name).append("<h2>" + levelNames[i] + "</h2><p>" + difficultyLevel[i] + "</p>");
           difficultyBtn.attr("data-level", name);
        }
    //this will hide buttons if we get enough points in a particular catagory the sequential times around
        if(BesaidCount >= Questions['Besaid'].length){
            $("#Besaid").attr("class", "hidden");
        }
        if(LucaCount >= Questions['Luca'].length){
            $("#Luca").attr("class", "hidden");
        }
        if(DjoseCount >= Questions['Djose'].length){
            $("#Djose").attr("class", "hidden");
        }
        if(ThunderPlainsCount >= Questions['ThunderPlains'].length){
            $("#ThunderPlains").attr("class", "hidden");
        }
        if(GagazetCount >= Questions['Gagazet'].length){
            $("#Gagazet").attr("class", "hidden");
        }
    }
    
    // this is what fires when you select a difficulty
    $('body').on("click", '.difficultyBtn', function(){
        levelChoice = $(this).attr("data-level");
        questionTracker=0;
        gameStart(levelChoice);
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
        if(levelChoice == 'Sin'){
            SinCount = 0;
        }
    });
    
    //make the divs and such to hold all our questions and answers
    function gameStart(difficulty){
        //clear the main div for questions and answers
        $(".main").empty();

        //append the question field and the timer
        $(".main").append("<div class='question'>");
        $("body").append("<div class='timer'>");  

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
    
    //add the right question and answers to the right divs hey hey
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
        for (var i = 0; i < question.answers.length; i++){
            // appending the proper answer number and answer to the div
            $("#answerNumber" + i).text(i + 1);
            $("#answer" + i).text(question.answers[i].a);
            $("#row" + i).attr("data-value", question.answers[i].value)

            // this is for adding the green and red if they answer wrong 
            $("#ansNumber" + i).addClass("answer" + question.answers[i].value);
            $("#answer" + i).addClass("answerL" + question.answers[i].value);
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
            else if(levelChoice == 'Gagazet'){
                GagazetCount = 0;
            }

            //if player fails to answer the final question on the boss level 
            //tell the player that they have lost
            if(questionTracker == Questions[levelChoice].length && levelChoice == 'Sin'){ 
                loseScreen(); 
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
            else if (level == 'Sin'){
                SinCount++;
            }

            //if all this is true boss round
            if(questionTracker == totalAnswers && 
                BesaidCount == Questions['Besaid'].length &&
                LucaCount == Questions['Luca'].length &&
                DjoseCount == Questions['Djose'].length &&
                ThunderPlainsCount == Questions['ThunderPlains'].length &&
                GagazetCount == Questions['Gagazet'].length){
                    //remove the color classes
                    colorClasses('off');
                    //remove the value classes
                    valueClasses();
                    //boss round
                    populate('Sin');
                    //reset all counts
                    BesaidCount, LucaCount, DjoseCount, ThunderPlainsCount, GagazetCount = 0;
            }
            //if victorious against sin show player the victory screen
            else if(questionTracker = totalAnswers && level == 'Sin' && SinCount == totalAnswers){
                //player victory screen
                $(".main").empty();
                var youWin = $("<div class='player-wins'>")
                $(".main").append(youWin);
                $(".player-wins").text('YOU WON!');
            }
            //if not on boss level but finished all questions
            else if(questionTracker ==  totalAnswers){
                //remove the color classes
                colorClasses('off');
                //remove the valuse classes
                valueClasses();
                //return the player to the difficulty screen
                difficultyChoice();
            }
            //if not boss level put up next question
            else {
                //remove the color classes
                colorClasses('off')
                //remove the valuse classes
                valueClasses();
                //next question
                populate();
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
            
            //if last boss question is failed show lose screen
            if(questionTracker == totalAnswers && level == 'Sin'){  
                loseScreen();
            }

            //timeout function so that the colors show answer for a bit
            setTimeout(function(){
                //if last question and not boss level show color classes for 2 secons before
                //moving to next question or back to difficulty screen
                if (questionTracker == totalAnswers){
                    colorClasses('off');
                    valueClasses();  
                    difficultyChoice();
                } 
                else {
                    colorClasses('off');
                    valueClasses();   
                    populate();
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
            $('#answer1').addClass("right")
            $('#answer0').addClass("wrong")
            $('#answerNumber1').addClass("right")
            $('#answerNumber0').addClass("wrong")
        } 
        else if (state == 'off'){
            $('#answer1').removeClass("right")
            $('#answer0').removeClass("wrong")
            $('#answerNumber1').removeClass("right")
            $('#answerNumber0').removeClass("wrong")
        }
    }
    
    //take away the answer value so that they dont override question to question
    function valueClasses(){
        $('.answer-choice').removeAttr('data-level');
    }
    
    //creating the lose screen for the player
    function loseScreen(){
        $(".main").empty();
        var youLose = $("<div class='player-lost'>")
        $(".main").append(youLose);
        $(".player-lost").text('YOU LOST!');
    };
});