// ==UserScript==
// @name         Coding Ninjas in Parallel Universe
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Sanchit Kumar
// @match        https://www.codingninjas.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let alertContainer; // Declare the alertContainer variable

    // CSS styles for the custom alert box
    const alertBoxStyles = `.custom-alert-container { position: fixed; top: 15px;      /* Adjust the top position as needed */ right: 350px;    /* Adjust the right position as needed */ display: flex; justify-content: flex-end; align-items: flex-start; z-index: 9999; } .custom-alert-box { background-color: #24f96b; border: 0px solid #ccc; border-radius: 4px; padding: 10px; text-align: center; max-width: 400px; font-weight: bold; } .custom-alert-box p { margin: 0; padding: 0; font-size: 13px; line-height: 1; margin-bottom: 1px; } .custom-alert-box button { background-color: #4caf50; color: #fff; border: none; border-radius: 4px; padding: 8px 16px; font-size: 14px; cursor: pointer; }`;

    // Create the custom alert box element
    function createAlertBox(message) {
        const alertBox = document.createElement("div");
        alertBox.className = "custom-alert-box";

        const alertText = document.createElement("p");
        alertText.textContent = message;

        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        closeButton.addEventListener("click", function() {
            alertContainer.style.display = "none";
        });

        alertBox.appendChild(alertText);
        //alertBox.appendChild(closeButton);

        return alertBox;
    }

    // Function to show the custom alert box
    function showAlertBox(message) {
        alertContainer = document.createElement("div"); // Assign the alertContainer variable
        alertContainer.className = "custom-alert-container";

        const overlay = document.createElement("div");
        overlay.className = "custom-alert-overlay";

        const alertBox = createAlertBox(message);

        //alertContainer.appendChild(overlay);
        alertContainer.appendChild(alertBox);

        document.body.appendChild(alertContainer);
    }

    // Inject the CSS styles to the document head
    function injectStyles() {
        const styleElement = document.createElement("style");
        styleElement.textContent = alertBoxStyles;
        document.head.appendChild(styleElement);
    }

    // Main function to calculate readability
    function readability(input) {
        function calculate(text) {
            const cleanText = text.replace(/[,;:`'"<({[|_\-.]/g, ' ').toLowerCase();
            const words = cleanText.split(/\s+/);
            const wordCount = words.length;

            const sentenceCount = text.split(/[.!\?]+/).filter(sentence => sentence.trim() !== '').length;

            const syllableCount = countSyllables(input);

            if (wordCount === 0 || sentenceCount === 0 || syllableCount === 0) {
                showAlertBox('N/A');
                return;
            }

            const averageWordsPerSentence = wordCount / sentenceCount;
            const averageSyllablesPerWord = syllableCount / wordCount;

            const gradeLevel = 0.39 * averageWordsPerSentence + 11.8 * averageSyllablesPerWord - 15.59;
            const readingEaseScore = 206.835 - 1.015 * averageWordsPerSentence - 84.6 * averageSyllablesPerWord;

            showAlertBox(`Readability = ${readingEaseScore.toFixed(2)}`);
        }

        function countSyllables(text) {
            const syllablePrefixes = ['auto', 'bi', 'di', 'dis', 'pre', 're', 'un', 'semi', 'tri'];
            const syllableSuffixes = ['ed', 'es', 'ing', 'ion', 'ious', 'ly', 'ment', 'ness', 'tion'];
            const lowercaseText = text.toLowerCase();
            let syllableCount = 0;

            lowercaseText.split(/\s+/).forEach(function(word) {
                syllablePrefixes.forEach(function(prefix) {
                    if (word.startsWith(prefix)) {
                        word = word.slice(prefix.length);
                    }
                });

                syllableSuffixes.forEach(function(suffix) {
                    if (word.endsWith(suffix)) {
                        word = word.slice(0, -suffix.length);
                    }
                });

                const vowelPattern = /[aeiouy]+/g;
                const matches = word.match(vowelPattern);
                if (matches) {
                    syllableCount += matches.length;
                }
            });
            return syllableCount;
        }

        calculate(input);
    }

    // Run the readability calculation on page load
    window.addEventListener('load', function() {
        const x = document.getElementById("reading-club-article-body");
        readability(x.innerText);
    });

    // Inject the CSS styles
    injectStyles();
})();
