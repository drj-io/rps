 'use strict';

  var snd = new Audio("/mp3/reset.mp3"); // buffers automatically when created
  snd.play();

  var words = ['Rock','Paper','Scissors']
  var rps = ['/img/rock.png','/img/paper.jpg','/img/scissors.jpg'];

  var currentPlay = 0;


  var canvas = document.getElementById("canvas1")
  var ctx = canvas.getContext('2d');

  var canvas2 = document.getElementById("canvas2")
  var ctx2 = canvas2.getContext('2d');

  var canvas3 = document.getElementById("canvas3")
  var ctx3 = canvas3.getContext('2d');


  var localMediaStream = null;

var videoElement = document.querySelector('video');
var audioSelect = document.querySelector('select#audioSource');
var videoSelect = document.querySelector('select#videoSource');
var image = document.getElementById('image');

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function gotSources(sourceInfos) {
  for (var i = 0; i !== sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    var option = document.createElement('option');
    option.value = sourceInfo.id;
    if (sourceInfo.kind === 'audio') {
      option.text = sourceInfo.label || 'microphone ' + (audioSelect.length + 1);
      audioSelect.appendChild(option);
    } else if (sourceInfo.kind === 'video') {
      option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1);
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source: ', sourceInfo);
    }
  }
}

  function snapshot() {
    if (localMediaStream) {
      var sw = videoElement.offsetWidth, // source width
      sh = videoElement.offsetHeight, // source height
      dw = canvas.width, // destination width
      dh = canvas.height; // destination height
      ctx.drawImage(videoElement, 0, 0, dw, dh);
      // "image/webp" works in Chrome.
      // Other browsers will fall back to image/png.
      image.src = canvas.toDataURL('image/png');
      //doFindFeatures();
    }
  }


if (typeof MediaStreamTrack.getSources === 'undefined'){
  alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
} else {
  MediaStreamTrack.getSources(gotSources);
}


function successCallback(stream) {
  window.stream = stream; // make stream available to console
  videoElement.src = window.URL.createObjectURL(stream);
  videoElement.play();
  localMediaStream = stream;
}

function errorCallback(error){
  console.log('navigator.getUserMedia error: ', error);
}

function start(){
  if (!!window.stream) {
    videoElement.src = null;
    window.stream.stop();
  }
  var audioSource = audioSelect.value;
  var videoSource = videoSelect.value;
  var constraints = {
    audio: {
      optional: [{sourceId: audioSource}]
    },
    video: {
      optional: [{
       sourceId: videoSource,
    }], 

    
    }
  };
  navigator.getUserMedia(constraints, successCallback, errorCallback);

}

audioSelect.onchange = start;
videoSelect.onchange = start;

start();





/*spacebar*/


document.onkeydown = checkKey;
document.onkeyup = releaseKey;
var activeKey = false;
function releaseKey(e){
  activeKey = false;
}


var win = 0;
var lose = 0;
var tie = 0;

function renderWinLose(){
  $(".wins").html(win);
  $(".tie").html(tie);
  $(".lose").html(lose);

}

function calculateWinLose(){
  win = 0;
    lose = 0;
    tie = 0;
  $("#theirHistory span").removeClass('win')
  $("#myHistory span").removeClass('win')
  $("#theirHistory span").each(function(index){
    



    var their = $(this).text();
    var mine = $("#myHistory span:nth-child("+(index+1)+")").text();

    console.log(index + ' - ' + their + ' - '+ mine);

    if ((their == "Rock") && (mine == "Rock")) { tie ++ ;}
    else if ((their == "Paper") && (mine == "Paper")) { tie ++ ;}
    else if ((their == "Scissors") && (mine == "Scissors")) { tie ++ ;}

    else if ((their == "Rock") && (mine == "Paper")) { win ++ ; $("#myHistory span:nth-child("+(index+1)+")").addClass('win') }
    else if ((their == "Paper") && (mine == "Scissors")) { win ++ ; $("#myHistory span:nth-child("+(index+1)+")").addClass('win') }
    else if ((their == "Scissors") && (mine == "Rock")) { win ++ ; $("#myHistory span:nth-child("+(index+1)+")").addClass('win') }

    else if ((their == "Rock") && (mine == "Scissors")) { lose ++ ; $(this).addClass('win') }
    else if ((their == "Paper") && (mine == "Rock")) { lose ++ ;$(this).addClass('win') }
    else if ((their == "Scissors") && (mine == "Paper")) { lose ++ ; $(this).addClass('win') }
    else{ alert("?");}
  })
  renderWinLose();
}

function checkKey(e) {
    
    e = e || window.event;

    var myPlayCount = 0;

    
    if (e.keyCode == '38') {
        // up arrow
        if (!activeKey){
          //setTimeout(snapshot, 200);
          activeKey=true;

          currentPlay ++;
          if(currentPlay < 3){
            $("#play").html(currentPlay);
            var snd = new Audio("/mp3/"+currentPlay+".mp3"); // buffers automatically when created
            snd.play();
          }
          else{

            var thisPlay = pacBrain.myMove("normal");
            var snd = new Audio("/mp3/"+currentPlay+".mp3"); // buffers automatically when created
            snd.play();
            console.log(thisPlay);
            
            $('#tupac').attr('src',rps[thisPlay]);
            
            
            $("#play").html(words[thisPlay])

            currentPlay = 0;

            $("#myHistory").append("<span>" +words[thisPlay]+"</span>");

          }
        }

    }

    if(e.keyCode == 82){
      pacBrain.theirMove(0);
      $("#theirHistory").append("<span>"+words[0] + "</span>")


    }
    if(e.keyCode == 80){
      pacBrain.theirMove(1);
      $("#theirHistory").append("<span>"+words[1] + "</span>")
    }
    if(e.keyCode == 83){
      pacBrain.theirMove(2);
      $("#theirHistory").append("<span>"+words[2] + "</span>")
    }
    
    if(e.keyCode == 27){
      currentPlay = 0 ;
      $("#play").html("reset")
      $("#tupac").attr('src', "/img/vest.jpg")

      var snd = new Audio("reset.mp3"); // buffers automatically when created
      snd.play();
    }

    calculateWinLose()
}




/* tracking find featers*/

      var doFindFeatures = function() {
        var width = 300;
        var height = 150;
        tracking.Fast.THRESHOLD = 7;
        ctx.drawImage(image, 0, 0, width, height);
        var imageData = ctx.getImageData(0, 0, width, height);
        

        var gray = tracking.Image.grayscale(imageData.data, width, height);
        var conv = tracking.Image.sobel(gray, width, height, []);
        
        
        var corners = tracking.Fast.findCorners(gray, width, height);
        

        var rowLastCorners = []
        for (var i = 0; i < corners.length; i += 2) {
          ctx.fillStyle = '#0f0';
          ctx.fillRect(corners[i], corners[i + 1], 2, 2);

          if (!rowLastCorners[corners[i+1]]) {
            rowLastCorners[corners[i+1]] = 999;
          }
          if(corners[i] < rowLastCorners[corners[i+1]]){
            rowLastCorners[corners[i+1]] = corners[i];
          }
        }
        //console.log(rowLastCorners);
       

          ctx2.fillStyle = '#f00';
          ctx2.fillRect(0,0,width,height);


        for (var i =0; i<rowLastCorners.length; i++){
          ctx.fillStyle = '#f00';
          ctx.fillRect(rowLastCorners[i], i, width-rowLastCorners[i], 1);

          ctx2.fillStyle = '#ff0';
          ctx2.fillRect(rowLastCorners[i], i, width-rowLastCorners[i], 2);
        }
        // Pixelate


        imageData = ctx2.getImageData(0,0, width, height);

        var size = 0.5;

        ctx3.mozImageSmoothingEnabled = false;
        ctx3.webkitImageSmoothingEnabled = false;
        ctx3.imageSmoothingEnabled = false;

        /// cache scaled width and height
        var w = Math.round(canvas2.width * size)
        var h = Math.round(canvas2.height * size)

        ctx3.drawImage(canvas2, 0, 0, w, h);



        // Let's look at what we have in this image.
        

        
        var yellowPartHeight = 0;
        imageData = ctx3.getImageData(0,0,w,h);
        


        var haveWeStarted = false;
        var startPosition = 0;
        var thisLineHeight = 0;

        var longThickLineSettings = {

        }


        var pixels=[]

        var index=0;
        var x,y

        // we want to detect lines that are higher than 4px.  A line is defined as something that doesn't deviate more than 10px;
        var pixelLineLengths = []
        var config = {
          acceptableLineDeviance : 20,
          

          mediumLineHeight : 3,
          bigLineHeight : 6,
          superBigLineHieght : 10

        }

        var allSmallLines = []
        var allMediumLines = []
        var allBigLines = []

        var result = {

          averageLineLength : 0,
          averageLineDeviation : 0,
          longestLineLength : 0,
          shortestLineLength : 0,
          longestMediumLine : 0,
          quantitySmallLines: 0,
          quantityMediumLines : 0,
          quantityBigLines : 0,


        }

        var inLine = false;
        var inMediumLine = false;
        var inBigLine = false

        var blockCount = 0;
        var blockHeight = 0;

         for (y = 0; y < h; y++){
           var thisPixelLineLength = 0;
           var yellowEnd = w ;



           for (x = 0;x < w; x++){
              var thisPixel = getPixelXY(imageData,x,y);
              if(
                (yellowEnd == w) && 
                ((thisPixel[0] == 255) && (thisPixel[1] == 255))
                ){ 
                
                  yellowEnd = x;
                }


           // console.log(x+"x"+y);
            //console.log(getPixelXY(imageData,x,y))

          } // end for y
          //console.log(y+" _ "+yellowEnd)
          var thisLineLength = w- yellowEnd ;

          if (thisLineLength > 0 ){
            blockCount ++;
          }
          else {
            if (blockCount > blockHeight ) { blockHeight = blockCount;}
            blockCount = 0;
          }


          allSmallLines.push(thisLineLength);

          //console.log(allSmallLines.length + " - " + allSmallLines[allSmallLines.length-1])

          // measure small lines
          if(thisLineLength > allSmallLines[allSmallLines.length - 2]){
             result.quantitySmallLines++;
             //console.log('plusplus')
          }


          //measure medium lines
        


        }  // end for x

        result.blockHeight = blockHeight;




        console.log(allSmallLines)
        var d =  allSmallLines.reduceArray();
         result.quantityMediumLines = d.reduced;
         result.heights = d.heights




         if(d.reduced.length > 4) {
           $("#guess").html("Scissors");

         }
         else {
          if(config.blockHeight > 30){
            $("#guess").html("Rock");
          }
          else {
            $("#guess").html("Paper");
          }
         }



         result.averageSmallLineLength = allSmallLines.avg();

        

        $("#debug_stuff").html("\
          <div>acceptableLineDeviance = "+ config.acceptableLineDeviance+"</div>\
          <div>Process canvas = "+ w +"x"+ h + "\
          <div>Result</br>"+JSON.stringify(result).replace(/,/gi,",<br>&nbsp;&nbsp;")+"</div> \
          <div>Config</br>"+JSON.stringify(config).replace(/,/gi,",<br>&nbsp;&nbsp;")+"</div> \
                    ");

        //ctx2.drawImage(canvas2, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
        


        // second image:

 

      };
     function getPixelXY(imgData, x, y) {
          return getPixel(imgData, y*imgData.width+x);
        }
      function getPixel(imgData, index) {
        var i = index*4
        var d = imgData.data;
        return [d[i],d[i+1],d[i+2],d[i+3]] // returns array [R,G,B,A]
      }
      Array.prototype.avg = function() {
        console.log('average')
        var av = 0;
        var cnt = 0;
        var len = this.length;
        for (var i = 0; i < len; i++) {
        var e = +this[i];
        if(!e && this[i] !== 0 && this[i] !== '0') e--;
        if (this[i] == e) {av += e; cnt++;}
        }
        return av/cnt;
        }

      Array.prototype.reduceArray = function(){

          var current = 0;
          var deviation = 20;
          

          var built = [];

          var i = 0;

          var currentBuild = [];

          var buildHeights = [];
          var height =0 ;
          
          var currentIndex = 0;
          var currentScope = 0;

          var consecutiveAnomalies = 0;
          var acceptedAnomalies = 2;

          var inLine = false;

          for(var i =0; i < this.length; i++){
            //console.log(i + ' - '+ this[i])
            if(i==0){
              currentScope = this[i];
              currentBuild.push(this[i]);

            }
            else{

                if(((this[i] - currentScope) > deviation) ||(( currentScope - this[i]) > deviation)) {


                    consecutiveAnomalies ++;
                    if(consecutiveAnomalies == acceptedAnomalies){
                      if(currentScope > 10){ buildHeights.push(height); }
                      currentScope = this[i];
                      currentBuild.push(this[i]);
                      
                      height = 0;

                    }
                }
                else{
                  consecutiveAnomalies = 0;
                  height++;

                }



            }

            




          }
console.log("height");
console.log(buildHeights);          
return { reduced: currentBuild, heights: buildHeights}

      

      }















var pacBrain = (function (exports) {
  //push moves into the array as they are made 0=rock 1=paper 2=scissors
  var myLastMove = -1;
  var allTheirMoves = [];

  exports.myMove = function (mode) {
    if (typeof mode == "undefined") mode = "normal";
    if (allTheirMoves.length <= 0 && mode == "bro") {
      myLastMove = Math.floor(Math.random() * (2 - 0)) + 0; //pure random chaos
      return myLastMove;
    } else if (allTheirMoves.length <= 0 && mode == "normal") {
      myLastMove = Math.floor(Math.random() * (3 - 1)) + 1; //pure random chaos
      return myLastMove;

    } else if (allTheirMoves.length <= 0 || mode == "chaos") {
      myLastMove = Math.floor(Math.random() * (3 - 0)) + 0; //pure random chaos
      return myLastMove;
    } else {

      if (allTheirMoves.length >= 2 && theirLastMove() == theirLastMove(2)) {
        return beat(beat(theirLastMove()));
      }
      if (lastResult()) {
        if (mode == "normal")
          return beat(theirLastMove());
        else
          return beat(myLastMove);
      } else {
        if (mode == "normal")
          return beat(myLastMove);
        else
          return beat(theirLastMove());
      }
    }
  };

  exports.theirMove = function (move) {
    allTheirMoves.push(move);
  };

  function lastResult() {
    if (myLastMove == beat(theirLastMove())) return true;
    else return false;
  }

  function theirLastMove(a) {
    if (typeof a == 'undefined') a = 1;
    if (allTheirMoves.length < a) return 0;
    return allTheirMoves[allTheirMoves.length - a];
  }

  function beat(m) {
    m++;
    if (m > 2) m = 0;
    return m;
  }

  return exports;
})(pacBrain || {});


















