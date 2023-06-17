const months = [
    'January',
    'Febuary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const weeks = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

const giveAway = document.querySelector('h3');
const countDowns = document.querySelectorAll('.container div h1');
const deadline = document.querySelector('.container');

let tempYear = new Date().getFullYear();
let tempMonth = new Date().getMonth();
let tempDay = new Date().getDate();
let futureDate = new Date(tempYear,tempMonth,tempDay+11);

const year = futureDate.getFullYear();
const month = months[futureDate.getMonth()];
const date = futureDate.getDate();
const weekday = weeks[futureDate.getDay()];
const hours = futureDate.getHours();
const minutes = futureDate.getMinutes();
giveAway.textContent = `Give away ends on ${weekday}, ${date}  ${month} ${year} ${hours}:${minutes}am`;

// to get the deeadline date in millisecs
const futureTime = futureDate.getTime();
// console.log(futureTime)

let getRemainingTime = () =>{
    // to get the current time in millisecs
    const currentTime = new Date().getTime();
    // "t" helps us find the difference btw the date
    // we intend to end the giveaway and the current 
    // date. once  "t" < 0 the giveaway should end.
    const t= futureTime - currentTime;
    //  1000ms = 1sec
    //  60secs = 1minute 
    //  60minutes = 1hr
    //  24hr = 1day 

    const oneDay = 24 * 60 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;
    const oneMinute = 60 * 1000;
    const oneSecond = 1 * 1000;

    const day = Math.floor(t/oneDay);
    const hour = Math.floor((t%oneDay)/oneHour);
    const minute = Math.floor((t%oneHour)/ oneMinute);
    const seconds = Math.floor((t%oneMinute)/ oneSecond);

    // console.log(hour)
    // console.log(minute) 
    // console.log(seconds) 

    let format = (item) =>{
        if (item < 10){
            return `0${item}`
        }
        return item
    }

    // the code below is  the one i made myself but there is a better way of doing this.
    /* countDown[3].textContent = seconds
     countDown[2].textContent = minute
     countDown[1].textContent = hour
     countDown[0].textContent = day */

    // set values array 
    const values = [day,hour,minute,seconds];

    countDowns.forEach((countDown,index) =>{
        countDown.textContent = format(values[index]);

    });

    if (t < 0){
        clearInterval(giveAwayTimer);
        deadline.innerHTML= '<h2>This giveaway has expired.</h2>';
    }
    

}

let giveAwayTimer = setInterval(getRemainingTime, 1000);



