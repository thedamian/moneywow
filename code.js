let t = new Date();
let today = t.getMonth()+1 + "/" + t.getDate() + "/" + t.getFullYear();
let MonthlyTotal = localStorage.getItem("MonthlyTotal") ? Number(localStorage.getItem("MonthlyTotal")) : 0;
let EntryList  = localStorage.getItem("EntryList") ? localStorage.getItem("EntryList") : "";
let currentTotal = 0;
let CurrentMonthSaved  = localStorage.getItem("CurrentMonthSaved") ? localStorage.getItem("CurrentMonthSaved") : t.getMonth()+1;

if (CurrentMonthSaved != t.getMonth()+1) {
    // New month. Do something later
    console.log("new month!")
}

let currentTotalDiv = document.getElementsByClassName("Calculator-currentOperand")[0];
let MonthlyTotalDiv = document.getElementsByClassName("Calculator-equals")[0].childNodes[1];
let EntryListContainer = document.getElementsByClassName("Calculator-expressions")[0];
let EntryListDiv = document.getElementsByClassName("Calculator-expressionsOverflow")[0];
EntryListDiv.innerHTML = EntryList;
EntryListContainer.scrollTop = EntryListContainer.scrollHeight; // Scroll the list to the bottom

console.log("Today",today);

let calculatorbuttons = document.getElementsByClassName('Calculator-button');
for (let i=0;i< calculatorbuttons.length; i++) {
    calculatorbuttons[i].addEventListener("click",() => {
        let ButtonPressed = calculatorbuttons[i].childNodes[1].innerHTML;
        switch(ButtonPressed) {
                case "ADD":
                        if (currentTotal > 0)
                        {
                            MonthlyTotal += currentTotal;
                            let newEntry = today + " - $" + currentTotal + ".00<BR>";
                            EntryListDiv.innerHTML += newEntry
                            EntryList += newEntry
                            localStorage.setItem("EntryList", EntryList);
                            EntryListContainer.scrollTop = EntryListContainer.scrollHeight; // Scroll the list to the bottoms
                            MonthlyTotalDiv.innerHTML = "$" + MonthlyTotal + ".00";
                            localStorage.setItem("MonthlyTotal", MonthlyTotal);
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


    