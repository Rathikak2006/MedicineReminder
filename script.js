const medicineName = document.getElementById("medicineName");
const medicineTime = document.getElementById("medicineTime");
const addReminder = document.getElementById("addReminder");
const reminderList = document.getElementById("reminderList");

const popup = document.getElementById("popup");
const popupMedicine = document.getElementById("popupMedicine");
const stopAlarm = document.getElementById("stopAlarm");

let reminders = [];
let ringing = false;
let alarmInterval;


// Add Reminder
addReminder.addEventListener("click", () => {

    const name = medicineName.value.trim();
    const time = medicineTime.value;

    if (name === "" || time === "") {
        alert("Please enter medicine name and time");
        return;
    }

    reminders.push({
        name: name,
        time: time,
        done: false
    });

    medicineName.value = "";
    medicineTime.value = "";

    displayReminders();
});


// Display Reminder
function displayReminders() {

    reminderList.innerHTML = "";

    reminders.forEach((reminder, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <div>
                <strong>${reminder.name}</strong><br>
                <small>${reminder.time}</small>
            </div>

            <button class="delete-btn" onclick="deleteReminder(${index})">
                Delete
            </button>
        `;

        reminderList.appendChild(li);

    });
}


// Delete Reminder
function deleteReminder(index) {

    reminders.splice(index, 1);
    displayReminders();

}


// Alarm Sound using Browser Beep
let audioContext;

function startAlarm() {

    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    function beep() {

        let oscillator = audioContext.createOscillator();
        let gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        gain.gain.value = 0.5;

        oscillator.start();

        setTimeout(() => {
            oscillator.stop();
        }, 500);
    }

    beep();

    alarmInterval = setInterval(beep, 1000);
}


// Check Time
setInterval(() => {

    const now = new Date();

    const currentTime =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0");


    reminders.forEach(reminder => {

        if (
            reminder.time === currentTime &&
            reminder.done === false &&
            ringing === false
        ) {

            ringing = true;
            reminder.done = true;

            popupMedicine.innerHTML =
                "Time to take<br><br><b>" +
                reminder.name +
                "</b>";

            popup.style.display = "flex";

            startAlarm();

        }

    });


}, 1000);


// Stop Alarm
stopAlarm.addEventListener("click", () => {

    popup.style.display = "none";

    clearInterval(alarmInterval);

    ringing = false;

});