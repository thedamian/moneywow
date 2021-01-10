// Basic Storage Function
let getStorage = (StorageName, DefaultValue) => {
    let storageValue = localStorage.getItem(StorageName);
    if (!isNaN(DefaultValue) && isNaN(storageValue)) {
        // If we expected a number but we got something else
        localStorage.setItem(StorageName, DefaultValue); // then overwrite what we have in storage
        return DefaultValue;
    }
    if (storageValue) { // we got something back.
        return storageValue;
    } else {
        localStorage.setItem(StorageName, DefaultValue);
        return DefaultValue
    }
}

// constants
let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let t = new Date();
let thisMonth = t.getMonth() + 1;
let today = thisMonth + "/" + t.getDate() + "/" + t.getFullYear();
let currentTotal = 0; // Our running total
// Get some stored values
let MonthlyTotal = 0; 
let LastMonthTotal = Number(getStorage("LastMonthTotal", 0));
let CurrentMonthSaved = Number(getStorage("CurrentMonthSaved", thisMonth));
// Entry List
let EntryList = getStorage("EntryList", JSON.stringify([]));

try {
    EntryList = JSON.parse(EntryList);
} catch (exp) {
    // some old versions have text here instead of an array.
    EntryList = [];
}

// get DOM References
let currentTotalDiv = document.getElementsByClassName("CurrentTotal")[0];
let MonthlyTotalDiv = document.getElementsByClassName("MonthlyTotal")[0].childNodes[1];
let CalculatorBody = document.getElementsByClassName("Calculator-body")[0];
let EntryListContainer = document.getElementsByClassName("EntryListContainer")[0];
let EntryListDiv = document.getElementsByClassName("EntryList")[0];
let TotalHeader = document.getElementsByClassName("TotalHeader")[0];
let AskDetails = document.getElementById("AskDetails");
let DescriptionDiv = document.getElementById("description");
let DownloadButton = document.getElementById("download");

//EntryList Methods
let AddEntryList = (newEntry) => {
    EntryList.push(newEntry);
    //console.log("saving",EntryList)
    localStorage.setItem("EntryList", JSON.stringify(EntryList));
    PopulateEntryList();
};
let PopulateEntryList = (isDelete) => {
    MonthlyTotal = 0; // Reset MonthlyTotals
    let today = new Date();
    EntryListDiv.innerHTML = ""; 
    let i = 0;
    let ProcessedMonth = -1;
    let LastMonthsTotal =0;
    EntryList.map(entry => {
        if (!entry.isTotal) { // Ignore old totals. We don't do that any more.

            let EntryDate = new Date(entry.date);

            
            if (ProcessedMonth != EntryDate.getMonth()) {
                if (ProcessedMonth != -1 ) // If it's not the first
                {
                    EntryListDiv.innerHTML += ` ${monthNames[ProcessedMonth]}'s Total: $${Number(LastMonthsTotal).toFixed(2)}<BR /><BR />`;
                    LastMonthsTotal = 0;
                }  
                ProcessedMonth = EntryDate.getMonth();
            }
            LastMonthsTotal += Number(entry.amount);

            // Get Monthly Total
            if (EntryDate.getMonth() == today.getMonth()){
                MonthlyTotal += Number(entry.amount);
            }

            if (isDelete) {
                EntryListDiv.innerHTML += `<div onclick="return deleteFromEntryList('${entry.date} - ${entry.description ? entry.description.replace("'","")+' - ': ''} $${entry.amount}','${i}')"><span>${entry.description ? entry.description+'<BR />': ''} ${EntryDate.getMonth()+1}/${EntryDate.getDate()} - $${entry.amount} ✖️</div><BR />`;
            } else {
                EntryListDiv.innerHTML += `${EntryDate.getMonth()+1}/${EntryDate.getDate()} - ${entry.description ? entry.description+' - ': ''} $${entry.amount}<BR />`;
            }


        }
        i++;

    });
    MonthlyTotal = currencyFormat(Number(MonthlyTotal)); // add new value to monthly Total
    MonthlyTotalDiv.innerHTML = "$" + MonthlyTotal; // Update total
    setTimeout(() => { EntryListContainer.scrollTop = EntryListContainer.scrollHeight; }, 300); // Scroll the list to the bottom
};

let currencyFormat = num => {
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

let deleteFromEntryList = (value, entryIndex) => {
        if (confirm("Delete " + value + "?")) {
            // console.log("Confirm yes")
            let i = -1;
            //console.log("EntryList",EntryList);
            EntryList = EntryList.filter(x => { i++; return i != entryIndex; });
            //console.log("EntryList",EntryList);
            localStorage.setItem("EntryList", JSON.stringify(EntryList));
            PopulateEntryList();

            let EntryAmount = Number(value.split("$")[1]);  // Entry looks like "8/24/2020 - $2"
            MonthlyTotal = Number(Number(MonthlyTotal) - Number(EntryAmount)); // add new value to monthly Total
            MonthlyTotalDiv.innerHTML = "$" + currencyFormat(MonthlyTotal); // Update total
        };
    return true;
}

let LogIsBig = false;
// click inside
document.addEventListener('click',e => {
  const isOutside = !e.target.closest('.EntryList');
  console.log(`You Clicked ${isOutside ? 'Outside':'Inside'}`);
        if (isOutside) {
            console.log("Shurnk")
            PopulateEntryList();
            CalculatorBody.classList.remove("shrink");
            EntryListContainer.classList.remove("grow");
            EntryListContainer.scrollTop = EntryListContainer.scrollHeight;
            LogIsBig = true;
        } else {
            if (!LogIsBig) {
                console.log("Grow")
                PopulateEntryList(true);
                CalculatorBody.classList.add("shrink");
                EntryListContainer.classList.add("grow");
                EntryListContainer.scrollTop = EntryListContainer.scrollHeight;
                LogIsBig = false;
            }
        }
});



// Expand and retract history
EntryListContainer.addEventListener("click", () => {
    if (LogIsBig) {
        
    } else {
        console.log("Grow")
        PopulateEntryList(true);
        CalculatorBody.classList.add("shrink");
        EntryListContainer.classList.add("grow");
        EntryListContainer.scrollTop = EntryListContainer.scrollHeight;
    }
    LogIsBig = !LogIsBig;
});

// Update the UI
MonthlyTotalDiv.innerHTML = "$" + MonthlyTotal; //  + ".00";
PopulateEntryList();


// Functionality of all the buttons
let calculatorbuttons = document.getElementsByClassName('Calculator-button');
for (let i = 0; i < calculatorbuttons.length; i++) {
    calculatorbuttons[i].addEventListener("click", () => {
        let ButtonPressed = calculatorbuttons[i].childNodes[1].innerHTML;
        switch (ButtonPressed) {
            case "ADD":
                if (currentTotal > 0) {
                    // Cool! Now ask for a description
                    AskDetails.style.display='Flex';
                    DescriptionDiv.focus();
                }
                break;
            case "C":
                currentTotal = 0; // Just reset our numbers
                currentTotalDiv.innerHTML = "$0"; // reset our UI
                break;
            default: // Digital 0-9
                currentTotal = (currentTotal * 10 + 0.01 * Number(ButtonPressed)).toFixed(2);
                currentTotalDiv.innerHTML = `$${currentTotal}`;
                break;
        }

    });
}

let CancelAdd = CancelAdd => {
    DescriptionDiv.value = "";
    AskDetails.style.display='none';
    return false;
}

DescriptionDiv.addEventListener("keyup", e => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        AddEntryDescription();
    }
});

let AddEntryDescription = () =>  {
    let Description = DescriptionDiv.value.trim();
    console.log("description", Description);
    if (Description.trim() == '') {
        Description = null;
    }
    today = t.getMonth() + 1 + "/" + t.getDate() + "/" + t.getFullYear(); // update today
    MonthlyTotal = (Number(MonthlyTotal ) + Number(currentTotal)).toFixed(2);; // add new value to monthly Total
    console.log(MonthlyTotal);
    let newEntry = {
        date: today,
        description: Description,
        amount: currentTotal,
        isTotal: false
    }; // new entry in the list
    AddEntryList(newEntry);
    MonthlyTotalDiv.innerHTML = "$" + MonthlyTotal; // Update total
    currentTotal = 0; // Our amount to enter is now reset
    currentTotalDiv.innerHTML = "$0"; // Update the resetted Amount to enter.
    DescriptionDiv.value = "";
    AskDetails.style.display='none';
    return false;
};

let downloadEntries = (EntryList) => {
    let filteredEntries = EntryList.filter(entry => !entry.isTotal)
    let columnDelimiter = ",";
    let lineDelimiter = "\n";
    
    let keys = ["date", "description", "amount"]
    let csvHeaders = "data:text/csv;charset=utf-8," + keys.join(columnDelimiter) + lineDelimiter;
    
    let csvContent = filteredEntries.reduce((acc, entry) => {
        ctr = 0;
        keys.forEach(function (key) {
            if (ctr > 0) acc += columnDelimiter;
    
            acc += entry[key] || "";
            ctr++;
        });
        return acc += lineDelimiter;
    }, csvHeaders)
    
    let encodedCSV = encodeURI(csvContent);
    today = t.getMonth() + 1 + "/" + t.getDate() + "/" + t.getFullYear(); // update today
    let filename = `MoneyWoW-${today}.csv`;

    const fileToShare = new File( [csvContent], filename, {type: "text/csv" });


    // if (navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
    //     navigator.share({
    //       files: [fileToSharefileToShare],
    //       title: `MoneyWOW for ${today}`,
    //       text: `Backup of Money WOW for ${today}`,
    //     })
    //     .then(() => console.log('Share was successful.'))
    //     .catch((error) => console.log('Sharing failed', error));
    //   } else {
        console.log(`Your system doesn't support sharing files. BUT you can download the file!`);
        link = document.createElement("a");
        link.setAttribute("href", encodedCSV);
        link.setAttribute("download", filename);
        link.click();
    //  }

}

DownloadButton.addEventListener('click', () => {
    downloadEntries(EntryList)
})



// cache all files to make them available "offline"
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
};