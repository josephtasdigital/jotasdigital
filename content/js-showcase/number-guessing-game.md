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

      <style>
          body {
              background-color: #0c0e13;
          }


          #game-container {
              text-align: center;
              font-family: monospace;
              color: rgb(28, 229, 213);
              text-shadow: 0 0 5px rgb(28, 229, 213), 0 0 10px #0ff, 0 0 20px rgb(0, 139, 137), 0 0 30px rgb(0, 130, 182);
          }



          .neon-btn {
              background-image: linear-gradient(to right, #314755 0%, rgb(28, 229, 213) 51%, #314755 100%);
              margin: 10px;
              padding: 10px 15px;
              text-align: center;
              text-transform: uppercase;
              transition: 0.5s;
              background-size: 200% auto;
              color: white;
              box-shadow: 0 0 20px rgb(0, 130, 182);
              border-radius: 10px;
              border: none;
              cursor: pointer;
              text-decoration: none;
          }



          .neon-btn:hover {
              background-position: right center; /* Shifts the gradient to the right */
              color: #fff;
              text-decoration: none;
          }


          #guessInput {
              padding: 5px;
              background: #111;
              color: rgb(28, 229, 213);
              border: 1px solid rgb(28, 229, 213);
          }
      </style>
  </head>
  <body>

      <div id="game-container">
          <h3>Number Guesser</h3>
          <p>Guess a number between 1 and 100</p>

          <input type="number" id="guessInput" placeholder="Enter number...">

          <button id="submitBtn" class="neon-btn">Guess</button>

          <p id="messageDisplay" style="margin-top: 15px; font-size: 1rem;"></p>
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


  //josephtasdigital 2026
      </script>

  </body>
  </html>
---
