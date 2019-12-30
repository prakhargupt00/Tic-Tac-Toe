let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

let players = ['X', 'O'];

let human = players[1] ; 
let ai = players[0] ; 
let currentPlayer = human ;
let w,h ; 

function setup() {
  let cnv = createCanvas(400, 400);
  cnv.position(550, 150); 
  w = width / 3;
  h = height / 3;
  currentPlayer = floor(random(players.length));
  bestMove() ; 
}

function checkWinner(){
  let winner = null ; 
  
  for(let i=0;i<3;i++){
    //Horizontal 
    if(board[i][0]==board[i][1] && board[i][1]==board[i][2] && board[i][0]!=''){
        winner = board[i][0] ; 
        break ; 
    }
    
    //Vertical
    if(board[0][i]==board[1][i] && board[1][i]==board[2][i]&& board[0][i]!=''){
      winner = board[0][i] ; 
      break ;
    }
    
  }
  
  //Left Diagonal 
  if(board[0][0] == board[1][1] && board[1][1]== board[2][2] && board[0][0]!='')
    winner = board[1][1] ; 
  
  //Right Diagonal 
  if(board[2][0] == board [1][1] && board[1][1]==board[0][2] && board[1][1]!='')
    winner = board[2][0] ; 
  
  let emptySlots = 0;
  
  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if(board[i][j] == ''){
           emptySlots++ ; 
           }
      }

  }
  
  if(winner == null && emptySlots == 0){
    return 'tie' ; 
  }else
    return winner ; 
  
}


function mousePressed(){
  if(currentPlayer == human){
    
    //Human make turn 
    
    let j = floor(mouseX/w) ; 
    let i = floor(mouseY/h);
    
    //If valid turn 
    if(board[i][j] == ''){
      board[i][j] = human ; 
      currentPlayer = ai ; 
      bestMove() ; 
    }
  }

}

function bestMove(){
  //AI performs the best move ;
  let bestScore = -Infinity;
  let move ; 
  
  for(let i =0;i<3;i++){
    for(let j=0;j<3;j++){
      if(board[i][j] == ''){
        board[i][j] = ai;
        let score = minimax(board,0,false) ; 
        board[i][j] = '';
        if(score>bestScore){
          bestScore = score ;
          move = {i,j} ; 
        }
      }
    }
  }
  
  board[move.i][move.j] = ai;
  currentPlayer = human;
}


let scores = {
  X: 10,
  O: -10,
  tie: 0
};

function minimax(board, depth ,isMaximising){
  let result = checkWinner() ; 
  if(result !== null){
    let score = scores[result];
    return score ; 
  }
  
  if(isMaximising){
    let bestScore = -Infinity;
    
    for(let i =0;i<3;i++){
      for(let j=0;j<3;j++){
        if(board[i][j] == ''){
          board[i][j] = ai;
          let score = minimax(board, depth + 1, false);
          board[i][j] = '';
          bestScore = max(score, bestScore);
        }
      }
    }
    
    return bestScore ; 
  }else{
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = human;
          let score = minimax(board, depth + 1, true);
          board[i][j] = '';
          bestScore = min(score, bestScore);
        }
      }
    }
    return bestScore;
  
  }
}


function draw() {
  background(255);
  strokeWeight(4);
  stroke(51) ;
  //make the board 
  line(w, 0, w, height);
  line(2 * w, 0, 2 * w, height);
  line(0, h, width, h);
  line(0, h * 2, width, h * 2);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let x = w * j + w / 2;
      let y = h * i + h / 2;
      let spot = board[i][j];

      textSize(32);
      
      if (spot == human) {
        noFill();
        stroke('green') ; 
        ellipse(x, y, w / 2);
      } else if (spot == ai) {
        stroke('red');
        let xr = w / 4;
        line(x - xr, y - xr, x + xr, y + xr);
        line(x + xr, y - xr, x - xr, y + xr);
      }
      // text(spot, x, y);
    }
  }
  
   
  let result = checkWinner() ; 
  if (result != null) {
    noLoop();
    let resultP = createP('');
    resultP.style('font-size', '32pt');
    if (result == 'tie') {
      resultP.html('Tie!');
    } else {
      if(result == 'X')
        resultP.html(`AI wins!`);
      else
        resultP.html(`Congrats!! You won!`);
    }
  }
}