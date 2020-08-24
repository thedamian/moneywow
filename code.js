let t = new Date();
let today = t.getMonth()+1 + "/" + t.getDate() + "/" + t.getFullYear();
let MonthlyTotal = localStorage.getItem("MonthlyTotal") ? Number(localStorage.getItem("MonthlyTotal")) : 0;
let LastMonthTotal = localStorage.getItem("MonthlyTotal") ? Number(localStorage.getItem("MonthlyTotal")) : 0;
let EntryList  = localStorage.getItem("EntryList") ? localStorage.getItem("EntryList") : "";
let currentTotal = 0;
let CurrentMonthSaved  = localStorage.getItem("CurrentMonthSaved") ? localStorage.getItem("CurrentMonthSaved") : t.getMonth()+1;

if (CurrentMonthSaved != t.getMonth()+1) {
    // New month! Copy the monthly total to "LastMonthTotal" and start from scratch.
    console.log("new month!")
    LastMonthTotal = MonthlyTotal;
    MonthlyTotal = 0;
}


let currentTotalDiv = document.getElementsByClassName("CurrentTotal")[0];
let MonthlyTotalDiv = document.getElementsByClassName("MonthlyTotal")[0].childNodes[1];
MonthlyTotalDiv.innerHTML = "$" + MonthlyTotal + ".00";
let EntryListContainer = document.getElementsByClassName("EntryListContainer")[0];
let EntryListDiv = document.getElementsByClassName("EntryList")[0];
EntryListDiv.innerHTML = EntryList;
EntryListContainer.scrollTop = EntryListContainer.scrollHeight; // Scroll the list to the bottom

let calculatorbuttons = document.getElementsByClassName('Calculator-button');
for (let i=0;i< calculatorbuttons.length; i++) {
    calculatorbuttons[i].addEventListener("click",() => {
        let ButtonPressed = calculatorbuttons[i].childNodes[1].innerHTML;
        switch(ButtonPressed) {
                case "ADD":
                        if (currentTotal > 0)
                        {
                            // update today 
                            today = t.getMonth()+1 + "/" + t.getDate() + "/" + t.getFullYear();
                            MonthlyTotal += currentTotal; // add new value to monthly Total
                            let newEntry = today + " - $" + currentTotal + ".00<BR>"; // new entry inthe list
                            EntryListDiv.innerHTML += newEntry
                            EntryList += newEntry
                            localStorage.setItem("EntryList", EntryList); // Save entryList for next reload
                            EntryListContainer.scrollTop = EntryListContainer.scrollHeight; // Scroll the list to the bottoms
                            MonthlyTotalDiv.innerHTML = "$" + MonthlyTotal + ".00";
                            localStorage.setItem("MonthlyTotal", MonthlyTotal); // save you total
                            currentTotal = 0;
                            currentTotalDiv.innerHTML = "$0.00";
                        }
                        break;
                case "C": 
                        currentTotal = 0;
                        currentTotalDiv.innerHTML = "$0.00";
                        break;
                default: // Digital 0-9
                    currentTotal = currentTotal*10 + Number(ButtonPressed) ;
                    currentTotalDiv.innerHTML = "$" + currentTotal;
                        break;
            }

        }); 
}


    