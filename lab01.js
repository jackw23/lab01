// The last played key number
let last_mouse_key_number = -1;

// Map the key with the key number
let key_mapping = {
    // White keys of the first octave
    "z":  0, "x":  2, "c":  4, "v":  5, "b":  7, "n":  9, "m": 11,
    // Black keys of the first octave
    "s":  1, "d":  3, "g":  6, "h":  8, "j": 10,
    // White keys of the second octave
    "w": 12, "e": 14, "r": 16, "t": 17, "y": 19, "u": 21, "i": 23,
    // Black keys of the second octave
    "3": 13, "4": 15, "6": 18, "7": 20, "8": 22
}

// Signal the key is down
let key_down_status = new Array(23);

function handleNoteOn(key_number) {
    // Find the pitch
    //let pitch = 60 + key_number;
    let pitch = parseInt($("#lowestPitch").val()) + key_number;

    /*
     * You need to use the slider to get the lowest pitch number above
     * rather than the hardcoded value
     */

    // Extract the amplitude value from the slider
    let amplitude = parseInt($("#amplitude").val());

    // Use the two numbers to start a MIDI note
    MIDI.noteOn(0, pitch, amplitude);
    // console.log("Base Pitch:" + pitch);


    /*
     * You need to handle the chord mode here
     */
    var chordMode = $(":radio[name=play-mode]:checked").val();
    var pitchPlus4 = pitch + 4;
    var pitchPlus3 = pitch + 3;
    var pitchPlus7 = pitch + 7;
    if (chordMode == "major"){
        if (pitchPlus4 <= 108){
            MIDI.noteOn(0, pitch+4, amplitude);
            // console.log("Pitch+4:" + pitchPlus4);

        }
        if (pitchPlus7 <= 108){
            MIDI.noteOn(0, pitch+7, amplitude);
            // console.log("Pitch+7:" + pitchPlus7);

        }
    }else if (chordMode == "minor"){
        if (pitchPlus3 <= 108){
            MIDI.noteOn(0, pitch+3, amplitude);
            // console.log("Pitch+3:" + pitchPlus3);

        }
        if (pitchPlus7 <= 108){
            MIDI.noteOn(0, pitch+7, amplitude);
            // console.log("Pitch+7:" + pitchPlus7);

        }
    }


}

function handleNoteOff(key_number) {
    // Find the pitch
    let pitch = parseInt($("#lowestPitch").val()) + key_number;
    /*
     * You need to use the slider to get the lowest pitch number above
     * rather than the hardcoded value
     */

    // Send the note off message for the pitch
    MIDI.noteOff(0, pitch); 


    /*
     * You need to handle the chord mode here
     

    var chordMode = $(":radio[name=play-mode]:checked").val();
    if (chordMode == "major"){
        MIDI.noteOff(0, pitch+4);
        MIDI.noteOff(0, pitch+7);
    }else if (chordMode == "minor"){
        MIDI.noteOff(0, pitch+3);
        MIDI.noteOff(0, pitch+7);
    }*/
    var chordMode = $(":radio[name=play-mode]:checked").val();
    var pitchPlus4 = pitch + 4;
    var pitchPlus3 = pitch + 3;
    var pitchPlus7 = pitch + 7;
    if (chordMode == "major"){
        if (pitchPlus4 <= 108){
            MIDI.noteOff(0, pitch+4);
            // console.log("stopping Pitch+4:" + pitchPlus4);

        }
        if (pitchPlus7 <= 108){
            MIDI.noteOff(0, pitch+7);
            // console.log("stopping Pitch+7:" + pitchPlus7);

        }
    }else if (chordMode == "minor"){
        if (pitchPlus3 <= 108){
            MIDI.noteOff(0, pitch+3);
            // console.log("stopping Pitch+3:" + pitchPlus3);

        }
        if (pitchPlus7 <= 108){
            MIDI.noteOff(0, pitch+7);
            // console.log("stopping Pitch+7:" + pitchPlus7);

        }
    }


}

function handlePianoMouseDown(evt) {
    // Determine which piano key has been clicked on
    // evt.target tells us which item triggered this function
    // The piano key number is extracted from the key id (0-23)
    let key_number = $(evt.target).attr("id").substring(4);
    key_number = parseInt(key_number);

    // Start the note
    handleNoteOn(key_number);

    // Select the key
    $("#key-" + key_number).focus();

    // Show a simple message in the console
    //// console.log("Piano mouse down event for key " + key_number + "!");

    // Remember the key number
    last_mouse_key_number = key_number;
}

function handlePianoMouseUp(evt) {
    // last_key_number is used because evt.target does not necessarily
    // equal to the key that has been clicked on 
    if (last_mouse_key_number < 0) return;
    
    // Stop the note
    handleNoteOff(last_mouse_key_number);

    // De-select the key
    $("#key-" + last_mouse_key_number).blur();

    // Show a simple message in the console
    //// console.log("Piano mouse up event for key " + last_mouse_key_number + "!");

    // Reset the key number
    last_mouse_key_number = -1;
}

function handlePageKeyDown(evt) {
    // Exit the function if the key is not a piano key
    // evt.key tells us the key that has been pressed
    if (!(evt.key in key_mapping)) return;
    
    // Find the key number of the key that has been pressed
    let key_number = key_mapping[evt.key];
    if (key_down_status[key_number]) return;

    // Start the note
    handleNoteOn(key_number);

    // Select the key
    $("#key-" + key_number).focus();

    // Show a simple message in the console
    //// console.log("Page key down event for key " + key_number + "!");

    // Remember the key is down
    key_down_status[key_number] = true;
}

function handlePageKeyUp(evt) {
    // Exit the function if the key is not a piano key
    // evt.key tells us the key that has been released
    if (!(evt.key in key_mapping)) return;
    
    // Find the key number of the key that has been released
    let key_number = key_mapping[evt.key];

    // Stop the note
    handleNoteOff(key_number);

    // De-select the key
    $("#key-" + key_number).blur();

    // Show a simple message in the console
    //console.log("Page key up event for key " + key_number + "!");

    // Reset the key status
    key_down_status[key_number] = false;
}


/*
 * You need to write an event handling function for the instrument
 */


$(document).ready(function() {
    MIDI.loadPlugin({
        soundfontUrl: "./midi-js/soundfont/",
        instruments: [
            "trumpet",
            "trombone",
            "tuba",
            "muted_trumpet",
            "french_horn",
            "brass_section",
            "synth_brass_1",
            "synth_brass_2",
            "soprano_sax",
            "alto_sax"
            /*
             * You can preload the instruments here if you add the instrument
             * name in the list here
             */
        ],
        onprogress: function(state, progress) {
            // console.log(state, progress);
        },
        onsuccess: function() {
            // Resuming the AudioContext when there is user interaction
            // $("body").click(function() {
            //     if (MIDI.getContext().state != "running") {
            //         MIDI.getContext().resume().then(function() {
            //             // console.log("Audio Context is resumed!");
            //         });
            //     }
            // });

            // // Hide the loading text and show the container
            // $(".loading").hide();
            // $(".container").show();

            // // At this point the MIDI system is ready
            // MIDI.setVolume(0, 127);     // Set the volume level
            // MIDI.programChange(0, 56);  // Use the General MIDI 'trumpet' number

            // // Set up the event handlers for all the buttons
            // $("button").on("mousedown", handlePianoMouseDown);
            // $(document).on("mouseup", handlePianoMouseUp);

            // // Set up key events
            // $(document).keydown(handlePageKeyDown);
            // $(document).keyup(handlePageKeyUp);


            // /*
            //  * You need to set up the event for the instrument 
            //  */
            // // console.log("form selected: " + parseInt($("inputGroupSelect01").val()));
            // var currentInstrument = parseInt($("inputGroupSelect01").val());
            // // console.log("current Insturment " + currentInstrument);
            // console.log("fuck");

            // switch(currentInstrument){
            //     case 56:
            //         MIDI.programChange(0, 56);
            //         break;
            //     case 57:
            //         MIDI.programChange(0, 57);
            //         break;
            //     case 58:
            //         MIDI.programChange(0, 58);
            //         break;
            //     case 59:
            //             MIDI.programChange(0, 59);
            //         break;
            //     case 60:
            //         MIDI.programChange(0, 60);
            //         break;
            //     case 61:
            //         MIDI.programChange(0, 61);
            //         break;
            //     case 62:
            //         MIDI.programChange(0, 62);
            //         break;
            //     case 63:
            //         MIDI.programChange(0, 63);
            //         break;
            //     case 64:
            //         MIDI.programChange(0, 64);
            //         break;
            //     case 65:
            //         MIDI.programChange(0, 65);
            //         break;

            // }


        }
    });
});
