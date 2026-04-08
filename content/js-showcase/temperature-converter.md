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

          /* 2. Responsive Form Container - TIGHTENED PADDING */
          form {
              text-align: center;
              width: 95%; 
              max-width: 340px; 
              background-color: #12151c;
              border-radius: 14px;
              padding: 10px; /* Reduced from 15px to save vertical space */
              box-sizing: border-box;
              box-shadow: 5px 5px 15px rgb(96,102,117);
          } 

          /* TIGHTENED MARGINS & FONTS */
          h2 {
              margin-top: 0;
              margin-bottom: 5px; /* Reduced */
              font-size: 1.15em; /* Scaled down slightly */
              color: rgb(28, 229, 213);
              text-shadow: 0 0 5px rgb(14, 116, 107), 0 0 10px #0ff;
          }

          .texts {
              color: white;
              font-size: 0.85em;
              margin: 4px 0; /* Reduced margins */
              text-shadow: 0 0 5px rgb(96,102,117);
          }

          .radio-group {
              display: flex;
              flex-direction: column;
              gap: 4px; /* Tighter spacing between radio options */
              margin-bottom: 5px;
          }

          label {
              font-size: 0.85em;
              font-weight: bold;
              color: rgb(28, 229, 213);
              cursor: pointer;
          }

          /* 3. The Flexbox Layout for Side-by-Side Inputs */
          .input-group {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 8px; 
              margin-bottom: 10px; /* Reduced from 15px */
              margin-top: 4px;
          }

          .input-box {
              width: 42%;
              text-align: center;
              font-size: 1em; /* Scaled down from 1.1em */
              padding: 4px; /* Reduced padding */
              border: 2px solid rgb(96,102,117);
              border-radius: 4px;
              background-color: rgb(96,102,117);
              color: rgb(28, 229, 213);
              font-weight: bold;
              box-sizing: border-box;
              text-shadow: 0 0 5px rgb(14, 116, 107);
          }

          #resultbox {
              background-color: #0c0e13; 
              border-color: rgb(28, 229, 213); 
          }

          .arrow {
              font-size: 1em;
              color: rgb(28, 229, 213);
          }

          /* BUTTON PULLED UP */
          button {
              background-color: rgb(96,102,117);
              color: white;
              font-size: 1em;
              font-weight: bold;
              border: none;
              padding: 6px 20px;
              border-radius: 5px;
              cursor: pointer;
              transition: 0.3s; 
              margin-top: 2px; /* Hugs the input boxes closer */
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
          
          <div class="radio-group">
              <div>
                  <input type="radio" id="fahToCel" name="unit" checked>
                  <label for="fahToCel">Fahrenheit ➡️ Celsius</label>
              </div>
              <div>
                  <input type="radio" id="CelToFah" name="unit">
                  <label for="CelToFah">Celsius ➡️ Fahrenheit</label>
              </div>
          </div>
          
          <p class="texts">Enter Value:</p>
          
          <div class="input-group">
              <input type="number" id="textbox" class="input-box" value="0">
              <span class="arrow">➡️</span>
              <input type="text" id="resultbox" class="input-box" readonly placeholder="Result">
          </div>
          
          <button type="button" id="convertBtn" onclick="convert()">Convert</button>
      </form>

      <script>
          const convFahToCel = document.getElementById("fahToCel");
          const convCelToFah = document.getElementById("CelToFah");
          const convTextbox = document.getElementById("textbox");
          const resultBox = document.getElementById("resultbox"); 
          let temp;

          function convert() {
              if(convCelToFah.checked){
                  temp = Number(convTextbox.value);
                  temp = temp * 9 / 5 + 32;
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
