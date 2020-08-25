// Basic Storage Function
let getStorage = (StorageName,DefaultValue) => {
  let storageValue = localStorage.getItem(StorageName);
  if (!isNaN(DefaultValue)) {
    if (!isNaN(storageValue)) {
      StorageName = DefaultValue;
    }
  }
  if (storageValue ) {
    return storageValue;
  } else {
    localStorage.setItem(StorageName, DefaultValue);
    return DefaultValue 
  }
}

// constants
let monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
let t = new Date();
let thisMonth = t.getMonth()+1;
let today = thisMonth + "/" + t.getDate() + "/" + t.getFullYear();
let currentTotal = 0; // Our running total
// Get some stored values
let MonthlyTotal = Number(getStorage("MonthlyTotal",0));
let LastMonthTotal = Number(getStorage("LastMonthTotal",0));
let CurrentMonthSaved  = Number(getStorage("CurrentMonthSaved",thisMonth));
// Entry List
let EntryList = getStorage("EntryList",JSON.stringify([]));
//console.log("EntryList",EntryList)
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

//EntryList Methods
let AddEntryList = (newEntry)=> {
  EntryList.push(newEntry);
 //console.log("saving",EntryList)
  localStorage.setItem("EntryList", JSON.stringify(EntryList));
  PopulateEntryList();
};
let PopulateEntryList = (isDelete) => {
  EntryListDiv.innerHTML = "";
  let i=0;
  EntryList.map(entry=> {
    if (isDelete) {
         EntryListDiv.innerHTML +=  '<a href="#" onclick="return deleteFromEntryList(\''+entry+'\','+i+')" >' + entry +'<ion-icon name="close-circle-outline">&nbsp;</ion-icon></a><BR><BR>';
         i++;
    } else {
        EntryListDiv.innerHTML += entry +'<BR />'; 
    }
  });
  setTimeout(() => {EntryListContainer.scrollTop = EntryListContainer.scrollHeight;},300); // Scroll the list to the bottom
};

let deleteFromEntryList = (value,entryIndex) => {
  if (!value.includes("<BR>---<BR>"))
  if (confirm("Delete " + value + "?"))  {
   // console.log("Confirm yes")
    let i=-1;
    //console.log("EntryList",EntryList);
    EntryList = EntryList.filter(x => {i++; return i != entryIndex; });
    //console.log("EntryList",EntryList);
    localStorage.setItem("EntryList", JSON.stringify(EntryList));
    PopulateEntryList();

    // Now Update the totals
    console.log("MonthlyTotal",MonthlyTotal);
    
    let EntryAmount = Number(value.split("$")[1]);  // Entry looks like "8/24/2020 - $2"
    console.log("EntryAmount",EntryAmount);
    MonthlyTotal -= EntryAmount; // add new value to monthly Total
    MonthlyTotalDiv.innerHTML = "$" + MonthlyTotal; // Update total
    localStorage.setItem("MonthlyTotal", MonthlyTotal); // save you total
    console.log("MonthlyTotal",MonthlyTotal);

  };
  return true;
}


if (CurrentMonthSaved != thisMonth) {
    // New month! Copy the monthly total to "LastMonthTotal" and start from scratch.
    console.log("new month!")
    LastMonthTotal = MonthlyTotal; // Update LastMonth's with what we had before
    MonthlyTotal = 0; // reset our monthly total

    localStorage.setItem("LastMonthTotal",LastMonthTotal); // save Last Month Updated for future functionality
    localStorage.setItem("CurrentMonthSaved",thisMonth); // save new month
    localStorage.setItem("MonthlyTotal",MonthlyTotal); // save our new monthly total

    // Add new month line
    let lastMonth = thisMonth > 1 ?  (thisMonth-1) : 12; // last month is always month -1 unless it's january (then it's Dec.)
    let newEntry =  monthNames[lastMonth] + "'s Total: $" + LastMonthTotal + "<BR>---<BR>"; // new entry inthe list
    AddEntryList(newEntry); // Add last month's total to our log

}

let LogIsBig = false;
// Expand and retract history
EntryListContainer.addEventListener("click",()=> {
  if (LogIsBig) {
    console.log("Shrink")
    PopulateEntryList();
    CalculatorBody.classList.remove("shrink");
    EntryListContainer.classList.remove("grow");  
    EntryListContainer.scrollTop = EntryListContainer.scrollHeight; 
  } else {
    console.log("Grow")
    PopulateEntryList(true);
    CalculatorBody.classList.add("shrink");
    EntryListContainer.classList.add("grow");  
    EntryListContainer.scrollTop = EntryListContainer.scrollHeight; 
  }
  LogIsBig = !LogIsBig; 
})


// Update the UI
MonthlyTotalDiv.innerHTML = "$" + MonthlyTotal; //  + ".00";
PopulateEntryList();


// Functionality of all the buttons
let calculatorbuttons = document.getElementsByClassName('Calculator-button');
for (let i=0;i< calculatorbuttons.length; i++) {
    calculatorbuttons[i].addEventListener("click",() => {
        let ButtonPressed = calculatorbuttons[i].childNodes[1].innerHTML;
        switch(ButtonPressed) {
                case "ADD":
                        if (currentTotal > 0)
                        {
                            today = t.getMonth()+1 + "/" + t.getDate() + "/" + t.getFullYear(); // update today
                            MonthlyTotal += currentTotal; // add new value to monthly Total
                            let newEntry = today + " - $" + currentTotal; // new entry inthe list
                            AddEntryList(newEntry);
                            MonthlyTotalDiv.innerHTML = "$" + MonthlyTotal; // Update total
                            localStorage.setItem("MonthlyTotal", MonthlyTotal); // save you total
                            currentTotal = 0; // Our amount to enter is now reset
                            currentTotalDiv.innerHTML = "$0"; // Update the resetted Amount to enter.
                        }
                        break;
                case "C": 
                        currentTotal = 0; // Just reset our numbers
                        currentTotalDiv.innerHTML = "$0"; // reset our UI
                        break;
                default: // Digital 0-9
                    currentTotal = currentTotal*10 + Number(ButtonPressed) ;
                    currentTotalDiv.innerHTML = "$" + currentTotal;
                        break;
            }

        }); 
}

// cache all files to make them available "offline"
if ('serviceWorker' in navigator) {
   // navigator.serviceWorker.register('sw.js');
};