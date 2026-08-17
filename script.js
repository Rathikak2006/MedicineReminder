// ==========================================
// MEDICINE REMINDER APP
// ==========================================


// Check login

if (
    localStorage.getItem("loggedIn") !== "true"
) {

    window.location.href = "login.html";

}


// ==========================================
// GET USER INFORMATION
// ==========================================

const userName =
    localStorage.getItem("userName");


const welcomeUser =
    document.getElementById("welcomeUser");


if (welcomeUser && userName) {

    welcomeUser.textContent =
        "Welcome, " + userName + "!";

}


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const medicineName =
    document.getElementById("medicineName");


const medicineTime =
    document.getElementById("medicineTime");


const addReminder =
    document.getElementById("addReminder");


const reminderList =
    document.getElementById("reminderList");


const popup =
    document.getElementById("popup");


const popupMedicine =
    document.getElementById("popupMedicine");


const stopAlarm =
    document.getElementById("stopAlarm");


const alarmSound =
    document.getElementById("alarmSound");


const logoutButton =
    document.getElementById("logoutButton");


// ==========================================
// USER-SPECIFIC STORAGE KEY
// ==========================================

const currentUserEmail =
    getCurrentUserEmail();


function getCurrentUserEmail() {

    const account =
        JSON.parse(
            localStorage.getItem("userAccount")
        );


    if (account && account.email) {

        return account.email;

    }


    return "guest";

}


// ==========================================
// LOAD REMINDERS
// ==========================================

let reminders =
    JSON.parse(
        localStorage.getItem(
            "reminders_" + currentUserEmail
        )
    ) || [];


// ==========================================
// SAVE REMINDERS
// ==========================================

function saveReminders() {

    localStorage.setItem(

        "reminders_" + currentUserEmail,

        JSON.stringify(reminders)

    );

}


// ==========================================
// DISPLAY REMINDERS
// ==========================================

function displayReminders() {

    reminderList.innerHTML = "";


    if (reminders.length === 0) {

        const emptyMessage =
            document.createElement("li");

        emptyMessage.textContent =
            "No reminders added yet.";

        emptyMessage.style.color = "#777";

        emptyMessage.style.padding = "15px";

        reminderList.appendChild(
            emptyMessage
        );

        return;

    }


    reminders.forEach(
        function(reminder, index) {


            const listItem =
                document.createElement("li");


            listItem.className =
                "reminder-item";


            const reminderInfo =
                document.createElement("div");


            reminderInfo.className =
                "reminder-info";


            const medicine =
                document.createElement("span");


            medicine.className =
                "medicine-name";


            medicine.textContent =
                "💊 " + reminder.name;


            const time =
                document.createElement("span");


            time.className =
                "medicine-time";


            time.textContent =
                "⏰ " + formatTime(
                    reminder.time
                );


            reminderInfo.appendChild(
                medicine
            );


            reminderInfo.appendChild(
                time
            );


            const deleteButton =
                document.createElement("button");


            deleteButton.className =
                "delete-button";


            deleteButton.textContent =
                "Delete";


            deleteButton.addEventListener(
                "click",
                function() {

                    deleteReminder(index);

                }
            );


            listItem.appendChild(
                reminderInfo
            );


            listItem.appendChild(
                deleteButton
            );


            reminderList.appendChild(
                listItem
            );

        }
    );

}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(time) {

    const parts =
        time.split(":");


    let hours =
        parseInt(parts[0]);


    const minutes =
        parts[1];


    let ampm =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12;


    if (hours === 0) {

        hours = 12;

    }


    return (
        hours +
        ":" +
        minutes +
        " " +
        ampm
    );

}


// ==========================================
// ADD REMINDER
// ==========================================

addReminder.addEventListener(
    "click",
    function() {

        const name =
            medicineName.value.trim();


        const time =
            medicineTime.value;


        if (!name) {

            alert(
                "Please enter the medicine name."
            );

            return;

        }


        if (!time) {

            alert(
                "Please select a reminder time."
            );

            return;

        }


        const newReminder = {

            name: name,

            time: time,

            triggered: false

        };


        reminders.push(
            newReminder
        );


        saveReminders();


        displayReminders();


        medicineName.value = "";

        medicineTime.value = "";

    }
);


// ==========================================
// DELETE REMINDER
// ==========================================

function deleteReminder(index) {

    reminders.splice(
        index,
        1
    );


    saveReminders();


    displayReminders();

}


// ==========================================
// CHECK REMINDER TIME
// ==========================================

function checkReminders() {

    const now =
        new Date();


    const currentHours =
        String(
            now.getHours()
        ).padStart(2, "0");


    const currentMinutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    const currentTime =
        currentHours +
        ":" +
        currentMinutes;


    let changed = false;


    reminders.forEach(
        function(reminder) {


            /*
                Trigger only once per minute.
            */

            if (
                reminder.time === currentTime &&
                reminder.triggered !== currentTime
            ) {


                showReminder(
                    reminder.name
                );


                reminder.triggered =
                    currentTime;


                changed = true;

            }

        }
    );


    /*
        Reset triggered value
        when minute changes.
    */

    reminders.forEach(
        function(reminder) {

            if (
                reminder.triggered &&
                reminder.triggered !== currentTime
            ) {

                reminder.triggered = false;

                changed = true;

            }

        }
    );


    if (changed) {

        saveReminders();

    }

}


// ==========================================
// SHOW REMINDER POPUP
// ==========================================

function showReminder(name) {

    popupMedicine.textContent =
        "Time to take your " +
        name +
        ".";


    popup.style.display =
        "flex";


    /*
        Try to play alarm
    */

    alarmSound.currentTime = 0;


    alarmSound.play().catch(
        function(error) {

            console.log(
                "Browser blocked automatic audio:",
                error
            );

        }
    );

}


// ==========================================
// STOP ALARM
// ==========================================

stopAlarm.addEventListener(
    "click",
    function() {

        popup.style.display =
            "none";


        alarmSound.pause();


        alarmSound.currentTime =
            0;

    }
);


// ==========================================
// LOGOUT
// ==========================================

logoutButton.addEventListener(
    "click",
    function() {

        localStorage.removeItem(
            "loggedIn"
        );


        localStorage.removeItem(
            "userName"
        );


        window.location.href =
            "login.html";

    }
);


// ==========================================
// DISPLAY REMINDERS
// ==========================================

displayReminders();


// ==========================================
// CHECK EVERY SECOND
// ==========================================

setInterval(
    checkReminders,
    1000
);
    