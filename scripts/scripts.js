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
        let question = Questions[difficulty][questionTracker]
        //empty out each of the divs for the next set of questin and answers
        $(".question").empty();
        $(".answerNumber").empty();
        $(".answer").empty();
        $(".timer").html("<h3>Timer: 20</h3>");
        $(".question").text(question.question);

        for (var i = 0; i < question.answers.length; i++){
            // appending the proper answer number and answer to the div
            $("#answerNumber" + i).text(i + 1);
            $("#answer" + i).text(question.answers[i].a);
            $("#row" + i).attr("data-value", question.answers[i].value)

            // this is for adding the green and red if they answer wrong 
            $("#ansNumber" + i).addClass("answer" + question.answers[i].value);
            $("#answer" + i).addClass("answerL" + question.answers[i].value);
        }

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
                $(".main").empty();
                var youLose = $("<div class='player-lost'>")
                $(".main").append(youLose);
                $(".player-lost").text('YOU LOST!');
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

        //the anser the player selected
        answer = $(this).attr('data-value');
        level = $(this).attr('data-level');

        //if the answer is true
        if(answer == 1){
            //update teh score counts for the boss round
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
            if(questionTracker == Questions[level].length && 
                BesaidCount == Questions['Besaid'].length &&
                LucaCount == Questions['Luca'].length &&
                DjoseCount == Questions['Djose'].length &&
                ThunderPlainsCount == Questions['ThunderPlains'].length &&
                GagazetCount == Questions['Gagazet'].length){
                    //remove the color classes

                    //remove the value classes

                    //boss round

                    //reset all counts
            }
            else if(questionTracker = Questions[level].length && level == 'Sin' && SinCount == Questions[level].length){
                //player victory screen
                $(".main").empty();
                var youWin = $("<div class='player-wins'>")
                $(".main").append(youWin);
                $(".player-wins").text('YOU WON!');
            }
            else if(questionTracker ==  Questions[level].length){
                //remove the color classes
                
                //remove the valuse classes

                //return the player to the difficulty screen
            }
            else {
                //remove the color classes
                
                //remove the valuse classes

                //next question

            }
        } else if (answer == 0){
            //add color classes

            //update question tracker

            //reset level count for wrong answer

            //timeout function so that the colors show answer for a bit
        }
    });
});