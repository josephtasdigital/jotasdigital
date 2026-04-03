---
title: Number Guessing Game
description: Try to guess the number!
code: |-
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Number Guessing Game</title>
  </head>
  <body bgcolor = "#0c0e13" >
      <div id="game-container" style="text-align: center; color: #00e5ff; font-family: monospace;">
      <h3>Number Guesser</h3>
      <p>Guess a number between 1 and 100</p>
      
      <input type="number" id="guessInput" placeholder="Enter number..." style="padding: 5px; background: #111; color: #00e5ff; border: 1px solid #00e5ff;">
      
      <button id="submitBtn" style="padding: 5px 10px; background: #00e5ff; color: #000; cursor: pointer;">Guess</button>
      
      <p id="messageDisplay" style="margin-top: 15px; font-size: 1.2rem;"></p>
  </div>
  <script>
      const minNumber = 1;
  const maxNumber = 100;
  const answer = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;


  let attempts = 0;
  let running = true;



  const guessInput = document.getElementById("guessInput");
  const submitBtn = document.getElementById("submitBtn");
  const messageDisplay = document.getElementById("messageDisplay");



  submitBtn.onclick = function() {
      


      if (!running) {
          return; 
      }


      let guess = Number(guessInput.value);


      if (isNaN(guess) || guess < minNumber || guess > maxNumber) {
          messageDisplay.textContent = "Please enter a valid number between 1 and 100.";
          return; 
      }


      attempts++;



      if (guess > answer) {
          messageDisplay.textContent = `The number ${guess} is too HIGH.`;
      } 
      else if (guess < answer) {
          messageDisplay.textContent = `The number ${guess} is too LOW.`;
      } 
      else {
          messageDisplay.textContent = `CORRECT! The answer was ${answer}. It took you ${attempts} attempts.`;
          running = false; 
      }   
      guessInput.value = "";
  }
  </script>


      
  </body>
  </html>
---
