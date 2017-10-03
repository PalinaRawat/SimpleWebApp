var gMode;
var gIndex;
var gEntry;

function edit(){

    // Make sure someone is signed in.

    gCurrentEmployeeID = sessionStorageGet("CurrentEmployeeID", null);
    var modal = document.getElementById('editModal');
    var modal1 = document.getElementById('signInModal');
    var span = document.getElementsByClassName("close")[0];

   	if (gCurrentEmployeeID === null) {
        modal.style.display = "none";    
        modal1.style.display = "block";
        return;
    }

    // Make sure we have the information we need.

    gMode = localStorage.getItem("dMode", null);

    if (gMode !== "add" && gMode !== "edit") {
    	modal.style.display = "none";
        return;
    }

    getEntries();

    if (gMode === "edit") {
        gIndex = localStorage.getItem("index", -1);
        if (tryParse(gIndex, 0) === false) {
        	console.log("2");
            modal.style.display = "none";
            return;
        }

        gIndex = parseInt(gIndex);
        if (gIndex < 0 || gIndex > gEntries.length - 1) {
        	console.log("4");
            modal.style.display = "none";
            return;
        }
    }

    // Init the UI.

	btnSave.onclick = btnSave_onclick;
	btnDelete.onclick = btnDelete_onclick;
	span.onclick = function() {
    	modal.style.display = "none";
	}
	window.onclick = function(event) {
   		if (event.target == modal) {
        	modal.style.display = "none";
    	}
	}


	if (gMode === "edit") {
	    gEntry = gEntries[gIndex];
	    txtEmployeeID.value  = gEntry.EmployeeID;
	    console.log(txtEmployeeID.value);
	    txtHoursWorked.value = gEntry.HoursWorked;
	    txtDateWorked.value  = gEntry.DateWorked;
        chkBillable.checked  = gEntry.Billable;
	    txtDescription.value = gEntry.Description;
	    btnDelete.disabled = false;
    }
	else {
		console.log("here7");
	    txtEmployeeID.value = gCurrentEmployeeID
	    var date = new Date();
	    txtDateWorked.valueAsDate = date;
	    btnDelete.disabled = true;
	}
}

function btnSave_onclick() {

    // Check to make sure all the inputs are valid
    var modal = document.getElementById('editModal');
    var alertModal = document.getElementById('alertModal');
    var span = document.getElementById("alert_close");
    span.onclick = function() {
    	alertModal.style.display = "none";
	}
	window.onclick = function(event) {
    	if (event.target == alertModal) {
        	alertModal.style.display = "none";
 	   }
	}

    if (txtEmployeeID.value === "") {
        alertModal.style.display = "block";
        txtEmployeeID.focus();
        return;
    }

    if (!validHoursWorked(txtHoursWorked.value)) {
        alertModal.style.display = "block";
        document.getElementById('alert').value = "Hours Worked must be a valid number greater than zero and less than 4.00, and only in fifteen-minute intervals.";
        txtHoursWorked.focus();
        return;
    }

    if (!validDate(txtDateWorked.value)) {
		alertModal.style.display = "block";
		document.getElementById('alert').value = "Date Worked is required.";
		txtDateWorked.focus();
		return;
	}

	if (txtDescription.value.length < 20) {
		alertModal.style.display = "block";
		document.getElementById('alert').value = "Description is required and must be at least 20 characters long.";
		txtDescription.focus();
		return;
	}

    // Create a new entry object using the inputs from the user and either add it to the list,
    // or replace the exsiting entry in the list.

	var entry = {
	    EmployeeID: txtEmployeeID.value,
	    DateWorked: txtDateWorked.value,
	    HoursWorked: txtHoursWorked.value,
	    Billable: chkBillable.checked,
	    Description: txtDescription.value
	}
	if (gMode === "add") {
	    gEntries.push(entry);
	}
	else {
	    gEntries[gIndex] = entry;
	}

	saveEntries();
	modal.style.display = "none";
	location.href = "Main.html";

}

	function btnDelete_onclick() {
		var modal = document.getElementById('deleteModal');
		modal.style.display = "block";
		btn_yes.onclick = btnYes_onclick;
		btn_no.onclick = btnNo_onclick;

		function btnYes_onclick() {
			gEntries.splice(gIndex, 1);
	    	saveEntries();
	    	location.href = "Main.html";

		}
		function btnNo_onclick() {
			modal.style.display = "none";
		}
		var span = document.getElementById("delete_close");
	    span.onclick = function() {
	    	modal.style.display = "none";
		}
		window.onclick = function(event) {
	    	if (event.target == modal) {
	        	modal.style.display = "none";
	 	   }
		}
	    /*if (confirm("Are you sure you want to delete this entry?") === false) {
	        return;
	    }*/
	    /*
	    gEntries.splice(gIndex, 1);
	    saveEntries();
	    location.href = "Main.html";*/
	}
	
	function validHoursWorked(hrs) {
	var floatHrs = parseFloat(hrs);
	if (floatHrs <= 0 || hrs > 4.00) {
		return false;
	}
	if (floatHrs * 4 === parseInt(floatHrs * 4)) {
		return true;
	}
	return false;
}



/* var span = document.getElementsByClassName("close")[0];
    var modal = document.getElementById('signInModal');
    span.onclick = function() {
        console.log("heuu");
        modal.style.display = "none";
    }*/