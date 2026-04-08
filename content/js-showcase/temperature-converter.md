---
title: Temperature Converter
description: This tool briefly converts Celsius to Fahrenheit or Fahrenheit to Celsius. Try it!
code: |-
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Temperature Converter</title>
      
      <style>
          /* 1. Iframe Reset & Flexbox Centering */
          html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: hidden; 
              background-color: #0c0e13;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: white;
              display: flex;
              justify-content: center;
              align-items: center;
          }

          /* 2. Responsive Form Container */
          form {
              text-align: center;
              width: 95%; 
              max-width: 340px; 
              background-color: #12151c;
              border-radius: 14px;
              padding: 15px 10px; 
              box-sizing: border-box;
              box-shadow: 5px 5px 15px rgb(96,102,117);
          } 

          h2 {
              margin-top: 0;
              margin-bottom: 10px;
              font-size: 1.25em; 
              color: rgb(28, 229, 213);
              text-shadow: 0 0 5px rgb(14, 116, 107), 0 0 10px #0ff;
          }

          .texts {
              color: white;
              font-size: 0.9em;
              margin: 8px 0;
              text-shadow: 0 0 5px rgb(96,102,117);
          }

          label {
              font-size: 0.9em;
              font-weight: bold;
              color: rgb(28, 229, 213);
              cursor: pointer;
          }

          /* 3. The New Flexbox Layout for Side-by-Side Inputs */
          .input-group {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 8px; /* Space between the boxes */
              margin-bottom: 15px;
          }

          /* Shared styling for both input boxes */
          .input-box {
              width: 42%;
              text-align: center;
              font-size: 1.1em;
              padding: 6px;
              border: 2px solid rgb(96,102,117);
              border-radius: 4px;
              background-color: rgb(96,102,117);
              color: rgb(28, 229, 213);
              font-weight: bold;
              box-sizing: border-box;
              text-shadow: 0 0 5px rgb(14, 116, 107);
          }

          /* Unique styling for the Read-Only result box */
          #resultbox {
              background-color: #0c0e13; /* Darker to look locked */
              border-color: rgb(28, 229, 213); /* Cyan border to draw the eye */
          }

          .arrow {
              font-size: 1.2em;
              color: rgb(28, 229, 213);
          }

          button {
              background-color: rgb(96,102,117);
              color: white;
              font-size: 1.1em;
              font-weight: bold;
              border: none;
              padding: 8px 20px;
              border-radius: 5px;
              cursor: pointer;
              transition: 0.3s; 
          }

          button:hover {
              background-color: rgb(28, 229, 213);
              color: #0c0e13;
          }
      </style>
  </head>
  <body>

      <form>
          <h2>Temperature Converter</h2>
          
          <p class="texts">Select a conversion:</p>
          
          <div style="margin-bottom: 5px;">
              <input type="radio" id="fahToCel" name="unit" checked>
              <label for="fahToCel">Fahrenheit ➡️ Celsius</label>
          </div>
          <div>
              <input type="radio" id="CelToFah" name="unit">
              <label for="CelToFah">Celsius ➡️ Fahrenheit</label>
          </div>
          
          <p class="texts" style="margin-top: 15px;">Enter Value:</p>
          
          <div class="input-group">
              <input type="number" id="textbox" class="input-box" value="0">
              
              <span class="arrow">➡️</span>
              
              <input type="text" id="resultbox" class="input-box" readonly placeholder="Result">
          </div>
          
          <button type="button" id="convertBtn" onclick="convert()">Convert</button>
      </form>

      <script>
          // JS Logic Pipeline
          const convFahToCel = document.getElementById("fahToCel");
          const convCelToFah = document.getElementById("CelToFah");
          const convTextbox = document.getElementById("textbox");
          const resultBox = document.getElementById("resultbox"); // Hooked up to the new box
          let temp;

          function convert() {
              if(convCelToFah.checked){
                  temp = Number(convTextbox.value);
                  temp = temp * 9 / 5 + 32;
                  // Injecting the answer into the read-only box's value property
                  resultBox.value = temp.toFixed(1) + "°F"; 
              }
              else if(convFahToCel.checked){
                  temp = Number(convTextbox.value);
                  temp = (temp - 32) * (5/9);
                  resultBox.value = temp.toFixed(1) + "°C"; 
              }
              else {
                  resultBox.value = "Error";
              }
          }
      </script>
      
  </body>
  </html>
---
