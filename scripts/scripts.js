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

    // a global tracker for which question you are on given each difficulty
    let questionTracker;

    // a global tracker for the currently selected level
    let levelChoice;

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
        $(".main").empty();
        // $(".timer").empty();
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
            const newRow = $("<row>");
            newRow.attr("id", "row" + i);
            $(".main").append(newRow);
            
            const answerNumber = $("<div class='answerNumber'>");
            answerNumber.attr("id", "answerNumber" + i);
            const answer = $("<div class='answer'>");
            answer.attr("id", "answer" + i);

            $("#row" + i).append(answerNumber);
            $("#row" + i).append(answer);
        }
    };
    //add the right answers to the right divs hey hey
    function populate(difficulty){
        console.log(difficulty)
        let question = Questions[difficulty][questionTracker]
        console.log(question)
        //empty out each of the divs for the next set of questin and answers
        $(".question").empty();
        $(".answerNumber").empty();
        $(".answer").empty();
        $(".timer").empty();
        $(".question").text(question.question);
        // run();

        for (var i = 0; i < question.answers.length; i++){
            // appending the proper answer number and answer to the div
            $("#answerNumber" + i).text(i + 1);
            $("#answer" + i).text(question.answers[i].a);
            $("#answer" + i).attr("data-value", question.answers[i].value)

            // this is for adding the green and red if they answer wrong 
            $("#ansNumber" + i).addClass("answer" + question.answers[i].value);
            $("#answer" + i).addClass("answerL" + question.answers[i].value);
        }
    };
});