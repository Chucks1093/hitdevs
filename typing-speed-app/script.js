const speedMeter = document.querySelector("#speed__meter");
const speedIndicator = document.querySelector("#indicator");
const speedValue = document.querySelector("#speed__value");
const userInput = document.querySelector("textarea");
const spaceCircle = document.querySelector("#space");
const wps = document.querySelector("#wordspersecond");


const strokeWidth = 30;
const radius = (speedMeter.offsetWidth / 2) - (strokeWidth / 2);


let startTime = 0;
let endTime = 0;
let previoustypedText = 0;
let previousTotalText = 0;
let minuteCount = 0;
let scores = []; 



function setElementAttributes(element, attribute) {
    for (const key in attribute) {
        element.setAttribute(key, attribute[key])
    };
};


function setValues() {
    const circumferencePosition = 2*Math.PI*radius*0.75*0.835;
    speedMeter.style.borderWidth = `${strokeWidth}px`;
    setElementAttributes(spaceCircle, {
        "r": radius,
        "cx": speedMeter.offsetWidth / 2,
        "cy": speedMeter.offsetWidth / 2,
        "stroke-width": strokeWidth,
        "stroke-dasharray": getDashArrayValue(1),
        "stroke-dashoffset": circumferencePosition
    })
    setElementAttributes(speedIndicator, {
        "r": radius,
        "cx": speedMeter.offsetWidth/2,
        "cy": speedMeter.offsetWidth/2,
        "stroke-width": strokeWidth,
        "stroke-dasharray": getDashArrayValue(0),
        "stroke-dashoffset": circumferencePosition
    })
}


function checkUserInput() {
    const currentTime = new Date().getTime();
    if(startTime == 0) {
        startTime = currentTime;
        endTime = currentTime + 1000;
    } else if (currentTime >= endTime) {
        const totalText = userInput.value.trim().length;
        const typedText = totalText <=  previousTotalText? 0 :  totalText - previousTotalText;
        const newWords = parseFloat((typedText/4).toFixed(2));
        scores.push(Math.ceil(newWords));
        const previousWords = typedText? parseFloat((previoustypedText/4).toFixed(2)) : 0;
        previousTotalText = totalText;
        previoustypedText = typedText;
        const newspeed = newWords/10 >= 1? 1 : parseFloat((newWords / 10).toFixed(2));
        const previousSpeed= previousWords/10 >=1? 1: parseFloat((previousWords / 10).toFixed(2));
        startTime = 0;
        endTime = currentTime + 1000;
        wps.textContent = `${Math.floor(newWords)}WPS`
        animateSpeedValue(newspeed, previousSpeed, previousSpeed);
        moveIndicator(newspeed);
        minuteCount >= 60000 ? setHistoryValues(scores) : minuteCount = minuteCount + 1000;
    }
}

function setHistoryValues(allScores) {
    const highScore = document.querySelector("#high");
    const lowScore = document.querySelector("#low");
    const averageScore = document.querySelector("#average");
    let highValue = 0;
    let lowValue = allScores[0];
    let averageValue = 0;
    minuteCount = 0;
    for (let i = 0; i < allScores.length; i++) {
        highValue  = allScores[i] > highValue ? scores[i] : highValue;
        lowValue =allScores[i] < lowValue ? scores[i] : lowValue;
        averageValue += allScores[i];
    }
    highScore.innerHTML = `${highValue} <span>wpm</span>`;
    lowScore.innerHTML = `${lowValue} <span>wpm</span>`;
    averageScore.innerHTML = `${Math.ceil(averageValue/ allScores.length)} <span>wpm</span>`;
}

function animateSpeedValue(targetValue, currentValue, initialCount) {
    if (targetValue > currentValue) {
        currentValue = parseFloat((currentValue + 0.01).toFixed(2));
        speedValue.textContent = `${Math.floor(currentValue * 100)}%`;
        setTimeout(()=>animateSpeedValue(targetValue, currentValue, initialCount),700/((targetValue - initialCount)* 100))
    } else if (targetValue < currentValue) {
        currentValue = parseFloat((currentValue - 0.01).toFixed(2));
        speedValue.textContent = `${Math.floor(currentValue * 100)}%`;
        setTimeout(()=>animateSpeedValue(targetValue, currentValue, initialCount), 700/((initialCount - targetValue)* 100))
    } else if(targetValue == currentValue) {
        speedValue.textContent = `${Math.floor(currentValue * 100)}%`;
    }
};


function getDashArrayValue(percent) {
    const circumference = (2 * Math.PI *radius);
    const indicator = circumference * (0.75 * percent);
    return `${indicator} ${circumference - indicator}`
}

function moveIndicator(currentSpeed) {
    setElementAttributes(speedIndicator, {
        "stroke-dasharray": getDashArrayValue(currentSpeed)
    })
}   


document.addEventListener("DOMContentLoaded", ()=> {
    setValues();
    setHistoryValues([0]);
});
userInput.addEventListener("input", checkUserInput)








