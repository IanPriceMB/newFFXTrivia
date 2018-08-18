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
    
    // this is what fires when you select a difficulty
    $(".difficultyBtn").on("click", function(){
        levelChoice = $(this).attr("data-level");
        // questionTracker=0;
        gameStart();
        populate();
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
    function gameStart(){
        $(".theBigOne").empty();
        $(".theBigOne").append("<div class='question'>");
        $("body").append("<div class='timer'>");  
        for (var i = 0; i < Questions[difficulty][j].answers.length; i++){
            var newRow = $("<row>");
            newRow.attr("id", "row" + i);
            newRow.attr("class", "clearfix");
            $(".theBigOne").append(newRow);
            var ansDiv = $("<div>");
            var ansLDiv = $("<div>");
            ansDiv.attr("id", "ans" + i);
            ansDiv.attr("class", "ans");
            ansLDiv.attr("id", "ansL" + i);
            ansLDiv.attr("class", "ansLo"); 
            $("#row" + i).append(ansDiv);
            $("#row" + i).append(ansLDiv);
        }
    }
});