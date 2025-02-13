let acl1 = 0, acl2 = 0, acl3 = 0, acl4 = 0, aap = 0, aan = 0, lda = 0;
let tcl1 = 0, tcl2 = 0, tcl3 = 0, tcl4 = 0, tap = 0, tan = 0;
let egp = 0, egd = 0, egs = 0;
let egw = 0, egt = 0, egl = 0;
let ts = 0;
let sn = '', tn = 0, mn = 0, ac = 0, mt = ''; 
let ra = 0, da = 0, cmnts = '', rp = '', gpc = '', as = '';
let dr = 0, br = 0, drc = 0, brc = 0;
let map = 0, mtp = 0;
let ppp = 0;
let cycleTimes = [];
let cycleTimer;
let cycleStartTime;
let countdown, intermissionCountdown, teleopCountdown;

document.addEventListener("DOMContentLoaded", function() {
    const postMatchForm = document.getElementById("postMatchForm");
    if (postMatchForm) {
        postMatchForm.addEventListener("submit", function(event) {
            event.preventDefault();
            submitData();
        });
    }
});

function toggleCycleTimer() {
    const button = document.getElementById('trackCycleButton');
    button.classList.toggle('active');
    if (button.classList.contains('active')) {
        button.textContent = 'Cycle Begun';
        cycleStartTime = Date.now();
        cycleTimer = setInterval(() => {
        }, 1000);
        console.log('Cycle started');
    } else {
        button.textContent = 'Pick Up Piece';
        clearInterval(cycleTimer);
        const cycleEndTime = Date.now();
        const cycleDuration = (cycleEndTime - cycleStartTime) / 1000;
        if (cycleDuration >= 3) {
            cycleTimes.push(cycleDuration);
            console.log(`Cycle completed in ${cycleDuration} seconds`);
        } else {
            console.log(`Cycle discarded - too short: ${cycleDuration} seconds`);
        }
    }
    togglePickUpPiece();
}

function validateScouterName() {
    const scouterNameInput = document.getElementById("scouterName");
    scouterNameInput.value = scouterNameInput.value.replace(/[^a-zA-Z]/g, '');
    console.log(`Scouter name validated: ${scouterNameInput.value}`);
}

function validateNumericInput() {
    const matchNumberInput = document.getElementById("matchNumber");
    const teamNumberInput = document.getElementById("teamNumber");
    matchNumberInput.value = matchNumberInput.value.replace(/[^0-9]/g, '');
    teamNumberInput.value = teamNumberInput.value.replace(/[^0-9]/g, '');
    console.log(`Match number validated: ${matchNumberInput.value}`);
    console.log(`Team number validated: ${teamNumberInput.value}`);
}

function validateNumericTextarea(textarea) {
    textarea.value = textarea.value.replace(/[^0-9]/g, '');
    console.log(`Numeric textarea validated: ${textarea.value}`);
}

function validateNumberInput() {
    let scouterName = document.getElementById("scouterName").value;
    let matchNum = document.getElementById("matchNumber").value;
    let teamNum = document.getElementById("teamNumber").value;
    let allianceColor = document.getElementById("allianceColor").value;
    let matchType = document.getElementById("matchType").value;

    let startScoutingButton = document.getElementById("startScoutingButton");
    let summaryText = document.getElementById("selectionSummary");

    if (scouterName.length > 0 && matchNum.length > 0 && teamNum.length > 0 && allianceColor !== "" && matchType !== "") {
        startScoutingButton.style.display = "block";
        summaryText.style.display = "block";
        summaryText.textContent = `Scouter: ${scouterName}; Selected Match: ${matchNum}; Team: ${teamNum}; Alliance: ${allianceColor}; Match Type: ${matchType.charAt(0).toUpperCase() + matchType.slice(1)}`;
        console.log(`Number input validated: Scouter: ${scouterName}, Match: ${matchNum}, Team: ${teamNum}, Alliance: ${allianceColor}, Match Type: ${matchType}`);
    } else {
        startScoutingButton.style.display = "none";
        summaryText.style.display = "none";
        console.log('Number input validation failed');
    }
}

function startGame() {
    tn = document.getElementById("teamNumber").value;
    mn = document.getElementById("matchNumber").value;
    ac = document.getElementById("allianceColor").value === "BLUE" ? 1 : 0;
    mt = document.getElementById("matchType").value;
    sn = document.getElementById("scouterName").value;
    document.getElementById("PreGameSelections").style.display = "none";
    document.getElementById("gameSection").style.display = "block";
    document.getElementById("startGameButton").disabled = false; 
    document.getElementById("trackCycleButton").style.display = "none";
    document.getElementById("robotStatus").style.display = "none";
    document.getElementById('nextButton').style.display = "none";
    console.log('Game started');
}

function startTimer() {
    document.getElementById("agtt").textContent = "Active Game Timer";
    document.getElementById("startGameButton").disabled = true;
    document.getElementById("startGameButton").style.display = "none";

    let timeLeft = 15;
    document.getElementById("timer").textContent = timeLeft;
    updateTimeText();
    document.getElementById("gamePhase").textContent = "Autonomous Phase";
    document.getElementById("trackCycleButton").style.display = "block";
    document.getElementById("robotStatus").style.display = "block";
    document.getElementById("autoPhase").style.display = "block";
    updateScoringOptionsVisibility();
    console.log('Timer started for Autonomous Phase');

    clearInterval(countdown);
    countdown = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            updateTimeText();
            document.getElementById("gamePhase").textContent = "Intermission"; 
            document.getElementById("autoPhase").style.display = "none";
            startIntermissionTimer();
            console.log('Autonomous Phase ended, Intermission started');
        }
    }, 1000);
}

function startIntermissionTimer() {
    document.getElementById("robotStatus").style.display = "none";
    document.getElementById("trackCycleButton").style.display = "none";
    let intermissionTimeLeft = 2;
    document.getElementById("timer").textContent = intermissionTimeLeft;
    console.log('Intermission timer started');

    clearInterval(intermissionCountdown);
    intermissionCountdown = setInterval(() => {
        intermissionTimeLeft--;
        document.getElementById("timer").textContent = intermissionTimeLeft;

        if (intermissionTimeLeft <= 0) {
            clearInterval(intermissionCountdown);
            updateTimeText();
            document.getElementById("gamePhase").textContent = "Teleoperated Phase"; 
            document.getElementById("autoPhase").style.display = "none";
            document.getElementById("teleopPhase").style.display = "block";
            startTeleopTimer();
            console.log('Intermission ended, Teleoperated Phase started');
        }
    }, 1000);
}

function startTeleopTimer() {
    let timeLeft = 15;
    document.getElementById("timer").textContent = timeLeft;
    document.getElementById("trackCycleButton").style.display = "block";
    document.getElementById("robotStatus").style.display = "block";
    document.getElementById("trackCycleButton").textContent = "Pick Up Piece";
    togglePickUpPiece();
    updateScoringOptionsVisibility(); 
    console.log('Teleoperated Phase timer started');

    clearInterval(teleopCountdown);
    teleopCountdown = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;

        if (timeLeft > 20) {
            updateTimeText();
            document.getElementById("gamePhase").textContent = "Teleoperated Phase"; 
        } else {
            document.getElementById("timer").style.color = "red";
            document.getElementById("gamePhase").textContent = "END GAME"; 
            document.getElementById("gamePhase").style.fontWeight = "bold"; 
        }

        if (timeLeft <= 0) {
            clearInterval(teleopCountdown);
            document.getElementById("trackCycleButton").style.display = "none";
            document.getElementById("robotStatus").style.display = "none";
            document.getElementById("gamePhase").textContent = '';

            document.getElementById("autoPhase").style.display = "none";
            document.getElementById("teleopPhase").style.display = "none";

            document.getElementById("endGameButtons").style.display = "block"; 
            document.getElementById("timer").style.display = "none";
            document.getElementById("agtt").textContent = "Game Over";
            document.getElementById("nextButton").style.display = "block";
            console.log('Teleoperated Phase ended, Game Over');
        }
    }, 1000);
}

function toggleMatchResult(result) {
    egw = 0; egt = 0; egl = 0;
    
    if (result === 'win') {
        egw = egw === 1 ? 0 : 1;
    } else if (result === 'loss') {
        egl = egl === 1 ? 0 : 1;
    } else if (result === 'tie') {
        egt = egt === 1 ? 0 : 1;
    }
    
    updateMatchResultButtons();
    console.log(`Match result toggled: ${result}`);
}

function updateMatchResultButtons() {
    document.getElementById("winButton").classList.toggle("active", egw === 1);
    document.getElementById("lossButton").classList.toggle("active", egl === 1);
    document.getElementById("tieButton").classList.toggle("active", egt === 1);
    console.log('Match result buttons updated');
}

function toggleEndGameResult(result) {
    egp = 0; egd = 0; egs = 0;

    if (result === 'parked') {
        egp = egp === 2 ? 0 : 2;
    } else if (result === 'deep') {
        egd = egd === 12 ? 0 : 12;
    } else if (result === 'shallow') {
        egs = egs === 6 ? 0 : 6;
    }

    updateEndGameResultButtons();
    console.log(`End game result toggled: ${result}`);
}

function updateEndGameResultButtons() {
    document.getElementById("parkedButton").classList.toggle("active", egp === 2);
    document.getElementById("deepButton").classList.toggle("active", egd === 12);
    document.getElementById("shallowButton").classList.toggle("active", egs === 6);
    console.log('End game result buttons updated');
}

function toggleLeftDuringAutonomous() {
    lda = lda === 3 ? 0 : 3;
    document.getElementById("leftAutonomousButton").classList.toggle("active", lda === 3);
    updateScoringOptionsVisibility();
    console.log(`Left during autonomous toggled: ${lda === 3 ? 'Yes' : 'No'}`);
}

function togglePickUpPiece() {
    const button = document.getElementById('trackCycleButton');
    if (button.classList.contains('active')) {
        ppp = 1;
    } else {
        ppp = 0;
    }
    updateScoringOptionsVisibility();
    if (ppp === 1) {
        setTimeout(() => {
            ppp = 0;
        }, 100);
    }
    console.log(`Pick up piece toggled: ${ppp === 1 ? 'Yes' : 'No'}`);
}

function updateScoringOptionsVisibility() {
    const plusButtons = document.querySelectorAll("[id*='plus']");
    plusButtons.forEach(button => {
        button.style.display = (ppp === 0) ? 'none' : 'block';
    });
    
    const autoPhaseScoringOptions = document.querySelectorAll("#autoPhase .scoring-option");
    autoPhaseScoringOptions.forEach(option => {
        option.style.display = (document.getElementById("gamePhase").textContent === "Autonomous Phase" && lda !== 3) ? 'none' : 'flex';
        document.getElementById("trackCycleButton").style.display = (lda !== 3) ? 'none' : 'block';
    });
    const autoPlusButtons = document.querySelectorAll("#autoPhase [id*='plus']");
    autoPlusButtons.forEach(button => {
        if (lda === 3 && ppp !== 1) {
            button.style.display = 'none';
        }
    });
    const teleopPhaseScoringOptions = document.querySelectorAll("#teleopPhase .scoring-option");
    teleopPhaseScoringOptions.forEach(option => {
        option.style.display = (document.getElementById("plus").textContent === "Teleoperated Phase" && (ppp !== 1)) ? 'none' : 'flex';
    });
    console.log('Scoring options visibility updated');
}

function resetEndGameResults() {
    egp = 0; egd = 0; egs = 0;
    egw = 0; egt = 0; egl = 0;
    updateMatchResultButtons();
    updateEndGameResultButtons();
    console.log('End game results reset');
}

function disableEndGameButtons() {
    document.getElementById("winButton").disabled = true;
    document.getElementById("lossButton").disabled = true;
    document.getElementById("tieButton").disabled = true;
    document.getElementById("parkedButton").disabled = true;
    document.getElementById("deepButton").disabled = true;
    document.getElementById("shallowButton").disabled = true;
    console.log('End game buttons disabled');
}

function hideEndGame() {
    document.getElementById("endGameButtons").style.display = "none";
    document.getElementById("agtt").style.display = "none";
    console.log('End game hidden');
}

function goEndEndGame() {
    hideEndGame();
    document.getElementById("nextButton").style.display = "none";
    document.getElementById("endEndGame").style.display = "block";
    console.log('End end game');
}

function submitData() {
    as = document.getElementById("allianceScore").value;
    ra = document.getElementById("robotAbility").value;
    da = document.getElementById("driverSkill").value;
    rp = document.getElementById("rolePlayed").value;
    gpc = document.getElementById("gamepieceConsistency").value;
    cmnts = document.getElementById("comments").value;
    document.getElementById("qrCodeButtonSection").style.display = "block";
    console.log('Data submitted');
}

function showMatchToMaster() {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    document.getElementById("gameSection").style.display = "none";
    document.getElementById("endGameButtons").style.display = "none";
    document.getElementById("qrCodeButtonSection").style.display = "none";
    let matchToMasterSection = document.createElement("div");
    matchToMasterSection.id = "MatchToMaster";
    document.body.appendChild(matchToMasterSection);
    matchToMasterSection.innerHTML = "<h2>Scan the QR code for match data</h2>"; 
    generateQRCode();
    console.log('Match to master shown');
}

function updateAcl1(value) {
    acl1 = Math.max(0, acl1 + value);
    document.getElementById("acl1Count").textContent = acl1 / 3;
    console.log(`ACL1 updated: ${value > 0 ? 'increased' : 'decreased'} to ${acl1 / 3}`);
    if (value > 0) toggleCycleTimer();
}

function updateAcl2(value) {
    acl2 = Math.max(0, acl2 + value);
    document.getElementById("acl2Count").textContent = acl2 / 4;
    console.log(`ACL2 updated: ${value > 0 ? 'increased' : 'decreased'} to ${acl2 / 4}`);
    if (value > 0) toggleCycleTimer();
}

function updateAcl3(value) {
    acl3 = Math.max(0, acl3 + value);
    document.getElementById("acl3Count").textContent = acl3 / 6;
    console.log(`ACL3 updated: ${value > 0 ? 'increased' : 'decreased'} to ${acl3 / 6}`);
    if (value > 0) toggleCycleTimer();
}

function updateAcl4(value) {
    acl4 = Math.max(0, acl4 + value);
    document.getElementById("acl4Count").textContent = acl4 / 7;
    console.log(`ACL4 updated: ${value > 0 ? 'increased' : 'decreased'} to ${acl4 / 7}`);
    if (value > 0) toggleCycleTimer();
}

function updateAap(value) {
    aap = Math.max(0, aap + value);
    document.getElementById("aapCount").textContent = aap / 6;
    console.log(`AAP updated: ${value > 0 ? 'increased' : 'decreased'} to ${aap / 6}`);
    if (value > 0) toggleCycleTimer();
}

function updateAan(value) {
    aan = Math.max(0, aan + value);
    document.getElementById("aanCount").textContent = aan / 4;
    console.log(`AAN updated: ${value > 0 ? 'increased' : 'decreased'} to ${aan / 4}`);
    if (value > 0) toggleCycleTimer();
}

function updateTcl1(value) {
    tcl1 = Math.max(0, tcl1 + value);
    document.getElementById("tcl1Count").textContent = tcl1 / 2;
    console.log(`TCL1 updated: ${value > 0 ? 'increased' : 'decreased'} to ${tcl1 / 2}`);
    if (value > 0) toggleCycleTimer();
}

function updateTcl2(value) {
    tcl2 = Math.max(0, tcl2 + value);
    document.getElementById("tcl2Count").textContent = tcl2 / 3;
    console.log(`TCL2 updated: ${value > 0 ? 'increased' : 'decreased'} to ${tcl2 / 3}`);
    if (value > 0) toggleCycleTimer();
}

function updateTcl3(value) {
    tcl3 = Math.max(0, tcl3 + value);
    document.getElementById("tcl3Count").textContent = tcl3 / 4;
    console.log(`TCL3 updated: ${value > 0 ? 'increased' : 'decreased'} to ${tcl3 / 4}`);
    if (value > 0) toggleCycleTimer();
}

function updateTcl4(value) {
    tcl4 = Math.max(0, tcl4 + value);
    document.getElementById("tcl4Count").textContent = tcl4 / 5;
    console.log(`TCL4 updated: ${value > 0 ? 'increased' : 'decreased'} to ${tcl4 / 5}`);
    if (value > 0) toggleCycleTimer();
}

function updateTap(value) {
    tap = Math.max(0, tap + value);
    document.getElementById("tapCount").textContent = tap / 6;
    console.log(`TAP updated: ${value > 0 ? 'increased' : 'decreased'} to ${tap / 6}`);
    if (value > 0) toggleCycleTimer();
}

function updateTan(value) {
    tan = Math.max(0, tan + value);
    document.getElementById("tanCount").textContent = tan / 4;
    console.log(`TAN updated: ${value > 0 ? 'increased' : 'decreased'} to ${tan / 4}`);
    if (value > 0) toggleCycleTimer();
}

function updateTimeText() {
    document.getElementById("gamePhase").style.fontWeight = "normal"; 
    document.getElementById("timer").style.color = "gold";
    console.log('Time text updated');
}

function toggleDeadRobot() {
    const drbutton = document.getElementById('deadRobotButton');
    drbutton.classList.toggle('active');
    drc++;
    if (drbutton.classList.contains('active')) {
        drbutton.textContent = 'Dead Robot (Active)';
        dr = 1;
    } else {
        drbutton.textContent = 'Dead Robot';
        dr = 0;
    }
    console.log(`Dead robot toggled: ${dr === 1 ? 'Yes' : 'No'}`);
}

function toggleBrokenRobot() {
    const brbutton = document.getElementById('brokenRobotButton');
    brc++;
    br = 1;
    brbutton.textContent = `Broken Robot (Pressed ${brc} times)`;
    console.log(`Broken robot toggled: ${brc} times`);
}

function resetRobotButtons() {
    const brbutton = document.getElementById('brokenRobotButton');
    const drbutton = document.getElementById('deadRobotButton');
    const rrbutton = document.getElementById('resetRobotButton');
    drbutton.textContent = 'Dead Robot';
    brbutton.textContent = `Broken Robot`;

    if (drbutton.classList.contains('active')) {
        drbutton.classList.toggle('active');
    } else {
        return;
    }
    
    br = 0;
    dr = 0;
    brc = 0;
    drc = 0;
    rrbutton.textContent = 'Reset Counters!';
    console.log('Robot buttons reset');
}

function missAutoPiece() {
    map++;
    console.log(`Auto piece missed - total misses: ${map}`);
    const button = document.getElementById('trackCycleButton');
    if (button.classList.contains('active')) {
        console.log('Active cycle cancelled due to miss');
        button.click(); // Only stop the cycle if one is active
    }
}

function missTeleopPiece() {
    mtp++;
    console.log(`Teleop piece missed - total misses: ${mtp}`);
    const button = document.getElementById('trackCycleButton');
    if (button.classList.contains('active')) {
        console.log('Active cycle cancelled due to miss');
        button.click(); // Only stop the cycle if one is active
    }
}

function resetAll() {
    // Reset all variables
    acl1 = acl2 = acl3 = acl4 = aap = aan = lda = 0;
    tcl1 = tcl2 = tcl3 = tcl4 = tap = tan = 0;
    egp = egd = egs = egw = egt = egl = 0;
    ts = 0;
    sn = ''; tn = mn = ac = 0; mt = '';
    ra = da = cmnts = rp = gpc = as = '';
    dr = br = drc = brc = 0;
    map = mtp = 0;
    ppp = 0;
    cycleTimes = [];

    // Clear all intervals
    clearInterval(cycleTimer);
    clearInterval(countdown);
    clearInterval(intermissionCountdown);
    clearInterval(teleopCountdown);

    // Reset pre-match form
    document.getElementById("scouterName").value = '';
    document.getElementById("matchNumber").value = '';
    document.getElementById("teamNumber").value = '';
    document.getElementById("allianceColor").value = '';
    document.getElementById("matchType").value = '';
    document.getElementById("startScoutingButton").style.display = "none";
    document.getElementById("selectionSummary").style.display = "none";
    document.getElementById("selectionSummary").textContent = '';

    // Reset post-match form
    document.getElementById("driverSkill").value = '';
    document.getElementById("robotAbility").value = '';
    document.getElementById("gamepieceConsistency").value = '';
    document.getElementById("rolePlayed").value = '';
    document.getElementById("comments").value = '';
    document.getElementById("allianceScore").value = '';

    // Reset background color
    document.body.style.backgroundColor = "black";
    document.body.style.color = "gold";

    // Reset main sections visibility
    document.getElementById("PreGameSelections").style.display = "block";
    document.getElementById("gameSection").style.display = "none";
    document.getElementById("endGameButtons").style.display = "none";
    document.getElementById("qrCodeButtonSection").style.display = "none";
    if (document.getElementById("MatchToMaster")) {
        document.getElementById("MatchToMaster").remove();
    }

    // Reset game phase elements
    document.getElementById("timer").textContent = '15';
    document.getElementById("timer").style.color = "gold";
    document.getElementById("gamePhase").textContent = 'Pre Game';
    document.getElementById("gamePhase").style.fontWeight = "normal";
    document.getElementById("startGameButton").disabled = false;
    document.getElementById("startGameButton").style.display = "block";

    // Reset robot status buttons
    document.getElementById("deadRobotButton").textContent = 'Dead Robot';
    document.getElementById("brokenRobotButton").textContent = 'Broken Robot';
    document.getElementById("resetRobotButton").textContent = 'Reset Counters!';
    if (document.getElementById("deadRobotButton").classList.contains('active')) {
        document.getElementById("deadRobotButton").classList.remove('active');
    }

    // Reset cycle timer button
    document.getElementById("trackCycleButton").textContent = 'Pick Up Piece';
    if (document.getElementById("trackCycleButton").classList.contains('active')) {
        document.getElementById("trackCycleButton").classList.remove('active');
    }

    // Reset left during autonomous button
    if (document.getElementById("leftAutonomousButton").classList.contains('active')) {
        document.getElementById("leftAutonomousButton").classList.remove('active');
    }

    // Reset section visibility
    document.getElementById("trackCycleButton").style.display = "none";
    document.getElementById("robotStatus").style.display = "none";
    document.getElementById("autoPhase").style.display = "none";
    document.getElementById("teleopPhase").style.display = "none";
    document.getElementById("endEndGame").style.display = "none";
    document.getElementById("nextButton").style.display = "none";

    // Reset all counters display
    document.querySelectorAll("[id*='Count']").forEach(count => count.textContent = '0');

    // Reset end game buttons
    document.querySelectorAll("#endGameButtons button").forEach(button => {
        if (button.classList.contains('active')) {
            button.classList.remove('active');
        }
    });

    console.log('All data and UI elements reset');
}

function generateQRCode() {
    let dataString = 
    `${acl1},${acl2},${acl3},${acl4},${aap},${aan},${lda},` +
    `${tcl1},${tcl2},${tcl3},${tcl4},${tap},${tan},` +
    `${egp},${egd},${egs},${egw},${egl},${egt},` +
    `${mn},${tn},${ac},${mt},${sn},`+
    `${ra},${da},${gpc},${rp},${cmnts},${as},` +
    `${dr},${br},${drc},${brc},` +
    `${map},${mtp},` +
    `${cycleTimes}`;
    let matchToMasterSection = document.getElementById("MatchToMaster");
    matchToMasterSection.innerHTML = ""; 

    let qrCode = new QRCode(matchToMasterSection, {
        text: dataString,
        width: 300,
        height: 300
    });

    let restartButton = document.createElement("button");
    restartButton.textContent = "Scout another match";
    restartButton.style.marginTop = "20px";
    restartButton.onclick = function() {
        resetAll(); // Call the reset function instead of reloading the page
    };

    matchToMasterSection.appendChild(restartButton);
    console.log('QR code generated');
}