var col3_click;
col3_click = true;

var col2_click;
col2_click = true;

var col1_click;
col1_click = true;
function body_onload() {

    // Make sure someone is signed in.
    // Init the UI.
    var modal = document.getElementById('signInModal');
    gCurrentEmployeeID = sessionStorageGet("CurrentEmployeeID", null);
    if (gCurrentEmployeeID === null) {
        modal.style.display = "block";
        signIn();
    }
    
    btnAddNew.onclick = btnAddNew_onclick;
    btnRefresh.onclick = btnRefresh_onclick;
    employee_1.onclick = col1_onclick;
    date_2.onclick = col2_onclick;
    hours_3.onclick = col3_onclick;
    //description_4.onclick = col4.onclick;
    txtDescContains.value = sessionStorageGet("txtDescContains", "");
    txtDateFrom.value     = sessionStorageGet("txtDateFrom", "");
    txtDateThrough.value  = sessionStorageGet("txtDateThrough", "");
    chkShowCurrEmp.value  = sessionStorageGet("chkShowCurrEmp", false);

    getEntries();
    displayEntries();
}

function col1_onclick() {
    divEntriesList.innerHTML = "";
    if (col1_click === true) {
        gEntries.sort(function(a,b){
            var x = a.EmployeeID.toLowerCase();
            var y = b.EmployeeID.toLowerCase();
            if (x < y) return -1;
            if (x > y) return 1;
            return 0;
            
        });
        col1_click = false;
    }
    else {
        gEntries.sort(function(a,b){
            console.log(a.EmployeeID);
            var x = a.EmployeeID.toLowerCase();
            var y = b.EmployeeID.toLowerCase();
            if (x < y) return 1;
            if (x > y) return -1;
            return 0;
            
        });
        col1_click = true;
    }
    displayEntries();

}
function col2_onclick() {
    divEntriesList.innerHTML = "";

    if (col2_click === true) {
        gEntries.sort(function(a,b){
            var date1 = a.DateWorked.split('-');
            var date2 = b.DateWorked.split('-');
            var mydate1 = new Date(date1[0], date1[1], date1[2]);
            var mydate2 = new Date(date2[0], date2[1], date2[2]);
            return mydate1.getTime() - mydate2.getTime()
        });
        col2_click = false;
    }
    else {
        gEntries.sort(function(a,b){
            var date1 = a.DateWorked.split('-');
            var date2 = b.DateWorked.split('-');
            var mydate1 = new Date(date1[0], date1[1], date1[2]);
            var mydate2 = new Date(date2[0], date2[1], date2[2]);
            return mydate2.getTime() - mydate1.getTime()
        });
        col2_click = true;
    }

    displayEntries();
    /*
    col1.innerHTML = entry.EmployeeID;
            col2.innerHTML = entry.DateWorked;
            col3.innerHTML = entry.HoursWorked;
            col4.innerHTML = entry.Description;
    */
}
function col3_onclick() {
    
    divEntriesList.innerHTML = "";
    if (col3_click === true) {
        gEntries.sort(function(a,b){return a.HoursWorked - b.HoursWorked});
        col3_click = false;
    }
    else {
        gEntries.sort(function(a,b){return b.HoursWorked - a.HoursWorked});
        col3_click = true;
    }
    displayEntries();
}
function btnAddNew_onclick() {
 
    var modal = document.getElementById('editModal');
    modal.style.display = "block"; //Convert data array to a single string
    localStorage.setItem("dMode", "add"); //Store the string into local storage
    edit();
}

function btnRefresh_onclick() {
	divEntriesList.innerHTML = "";
	displayEntries()

    // Save the search critera state.

	sessionStorageSet("txtDescContains", txtDescContains.value);
	sessionStorageSet("txtDateFrom"    , txtDateFrom.value);
	sessionStorageSet("txtDateThrough" , txtDateThrough.value);
	sessionStorageSet("chkShowCurrEmp" , chkShowCurrEmp.value);
}

function row_ondblclick() {
    var modal = document.getElementById('editModal');
    modal.style.display = "block";
    localStorage.setItem("dMode", "edit");
    localStorage.setItem("index", this.Index);
    edit();
}

function displayEntries() {
    var totalHoursWorked = 0;

    for (var i = 0; i < gEntries.length; i++) {
        var entry = gEntries[i];
        if (descriptionContains(entry) && dateBetween(entry) && isCurrentEmployee(entry)) {

            var row = document.createElement("div");
            var col1 = document.createElement("div");
            var col2 = document.createElement("div");
            var col3 = document.createElement("div");
            var col4 = document.createElement("div");

            row.className = "divEntriesRow";
            row.Index = i;

            col1.className = "divEntriesCol1";
            col2.className = "divEntriesCol2";
            col3.className = "divEntriesCol3";
            col4.className = "divEntriesCol4";

            col1.innerHTML = entry.EmployeeID;
            col2.innerHTML = entry.DateWorked;
            col3.innerHTML = entry.HoursWorked;
            col4.innerHTML = entry.Description;

            row.ondblclick = row_ondblclick;

            row.appendChild(col1);
            row.appendChild(col2);
            row.appendChild(col3);
            row.appendChild(col4);

            divEntriesList.appendChild(row);

            totalHoursWorked += parseFloat(entry.HoursWorked);
        }
    }

    lblTotalHoursWorked.innerHTML = "Total Hours Worked: " + totalHoursWorked.toFixed(2).toString();
}

function descriptionContains(entry) {
    if (txtDescContains.value === "") {
        return true;
    }

    var searchFor = txtDescContains.value.toLowerCase();

    if (entry.Description.toLowerCase().includes(searchFor) === true) {
        return true;
    }
    
    return false;
}

function isCurrentEmployee(entry) {

    if (chkShowCurrEmp.checked === true) {
        if (entry.EmployeeID === gCurrentEmployeeID) {
            return true;
        }
        return false;
    }
    return true;
}


function dateBetween(entry) {

	if (validDate(txtDateFrom.value)) {
	    if (new Date(txtDateFrom.value) > new Date(entry.DateWorked)) {
			return false;
		}
	}

	if (validDate(txtDateThrough.value)) {
	    if (new Date(txtDateThrough.value) < new Date(entry.DateWorked)) {
			return false;
		}
	}

	return true;
}
