// register.js - JavaScript for register.html
// Uses jQuery for dynamic behaviour (as required by the project)

// --- Doctor Data ---
var doctorData = {
    cardiology: [
        { name: "Dr. R. Perera", exp: "12 years", fee: "Rs. 2000" },
        { name: "Dr. S. Fernando", exp: "8 years", fee: "Rs. 1800" }
    ],
    dermatology: [
        { name: "Dr. A. Silva", exp: "10 years", fee: "Rs. 1500" },
        { name: "Dr. N. Jayawardena", exp: "6 years", fee: "Rs. 1200" }
    ],
    neurology: [
        { name: "Dr. M. Bandara", exp: "15 years", fee: "Rs. 2500" },
        { name: "Dr. T. Karunaratne", exp: "9 years", fee: "Rs. 2200" }
    ],
    orthopedics: [
        { name: "Dr. P. Wickramasinghe", exp: "11 years", fee: "Rs. 1800" },
        { name: "Dr. C. Rajapaksa", exp: "7 years", fee: "Rs. 1600" }
    ],
    pediatrics: [
        { name: "Dr. D. Kumari", exp: "13 years", fee: "Rs. 1500" },
        { name: "Dr. L. Senanayake", exp: "5 years", fee: "Rs. 1200" }
    ],
    general: [
        { name: "Dr. K. Dissanayake", exp: "20 years", fee: "Rs. 1000" },
        { name: "Dr. H. Navaratne", exp: "10 years", fee: "Rs. 800" }
    ]
};

var selectedDoctor = null;
var currentStep = 1;

// --- Show today's date using JS Date ---
$(document).ready(function () {
    var today = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $("#todayDisplay").text("Today is: " + today.toLocaleDateString('en-US', options));

    // Set minimum date for appointment to today
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    $("#appointmentDate").attr("min", yyyy + "-" + mm + "-" + dd);
});

// --- Step Navigation ---
function goToStep(stepNumber) {
    if (stepNumber > currentStep) {
        if (!validateStep(currentStep)) return;
    }

    // If going to step 3, populate doctors
    if (stepNumber === 3) {
        updateDoctors();
    }

    // If going to step 4, fill summary
    if (stepNumber === 4) {
        fillSummary();
    }

    // Update indicator styles
    $(".step").removeClass("active done");
    for (var i = 1; i < stepNumber; i++) {
        $("#step" + i + "Indicator").addClass("done");
    }
    $("#step" + stepNumber + "Indicator").addClass("active");

    // Show correct step
    $(".formStep").addClass("hidden");
    $("#step" + stepNumber).removeClass("hidden");

    currentStep = stepNumber;

    // Scroll to top of form
    $("html, body").animate({ scrollTop: $(".formContainer").offset().top - 30 }, 400);
}

// --- Validate Each Step ---
function validateStep(step) {
    var valid = true;

    if (step === 1) {
        valid = validateField("firstName", "firstNameError", function (v) { return v.trim().length > 0; }) && valid;
        valid = validateField("lastName", "lastNameError", function (v) { return v.trim().length > 0; }) && valid;
        valid = validateField("dob", "dobError", function (v) { return v !== ""; }) && valid;
        valid = validateField("gender", "genderError", function (v) { return v !== ""; }) && valid;
        valid = validateField("phone", "phoneError", function (v) { return /^0[0-9]{9}$/.test(v.trim()); }) && valid;
        valid = validateField("email", "emailError", function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }) && valid;
    }

    if (step === 2) {
        valid = validateField("disease", "diseaseError", function (v) { return v !== ""; }) && valid;
        valid = validateField("appointmentDate", "dateError", function (v) { return v !== ""; }) && valid;
        valid = validateField("appointmentTime", "timeError", function (v) { return v !== ""; }) && valid;
    }

    if (step === 3) {
        if (!selectedDoctor) {
            $("#doctorError").show();
            valid = false;
        } else {
            $("#doctorError").hide();
        }
    }

    return valid;
}

// --- Generic Field Validator ---
function validateField(fieldId, errorId, checkFn) {
    var value = $("#" + fieldId).val();
    if (!checkFn(value)) {
        $("#" + fieldId).addClass("inputError");
        $("#" + errorId).show();
        return false;
    } else {
        $("#" + fieldId).removeClass("inputError");
        $("#" + errorId).hide();
        return true;
    }
}

// Clear error on input
$(document).on("input change", "input, select, textarea", function () {
    $(this).removeClass("inputError");
    var errorId = $(this).attr("id") + "Error";
    $("#" + errorId).hide();
});

// --- Update Doctor List Based on Disease ---
function updateDoctors() {
    var specialty = $("#disease").val();
    var doctors = doctorData[specialty] || [];
    var listHtml = "";

    if (doctors.length === 0) {
        listHtml = "<p style='color:#888; text-align:center;'>Please go back and select a condition first.</p>";
    } else {
        doctors.forEach(function (doc, index) {
            var initials = doc.name.replace("Dr. ", "").split(" ").map(function (n) { return n[0]; }).join("").substring(0, 2);
            listHtml += '<div class="doctorCard" onclick="selectDoctor(this, \'' + doc.name + '\')" data-doctor="' + doc.name + '">' +
                '<div class="doctorAvatar">' + initials + '</div>' +
                '<div class="doctorInfo">' +
                '<h4>' + doc.name + '</h4>' +
                '<p>Experience: ' + doc.exp + '</p>' +
                '</div>' +
                '<span class="doctorBadge">' + doc.fee + '</span>' +
                '</div>';
        });
    }

    $("#doctorList").html(listHtml);
    selectedDoctor = null;
}

// --- Select a Doctor ---
function selectDoctor(card, doctorName) {
    $(".doctorCard").removeClass("selected");
    $(card).addClass("selected");
    selectedDoctor = doctorName;
    $("#doctorError").hide();
}

// --- Fill Summary ---
function fillSummary() {
    var name = $("#firstName").val() + " " + $("#lastName").val();
    var phone = $("#phone").val();
    var email = $("#email").val();
    var disease = $("#disease option:selected").text();
    var date = $("#appointmentDate").val();
    var time = $("#appointmentTime option:selected").text();
    var doctor = selectedDoctor || "Not selected";

    var html =
        '<div class="summaryRow"><span class="summaryLabel">Name</span><span class="summaryValue">' + name + '</span></div>' +
        '<div class="summaryRow"><span class="summaryLabel">Phone</span><span class="summaryValue">' + phone + '</span></div>' +
        '<div class="summaryRow"><span class="summaryLabel">Email</span><span class="summaryValue">' + email + '</span></div>' +
        '<div class="summaryRow"><span class="summaryLabel">Condition</span><span class="summaryValue">' + disease + '</span></div>' +
        '<div class="summaryRow"><span class="summaryLabel">Doctor</span><span class="summaryValue">' + doctor + '</span></div>' +
        '<div class="summaryRow"><span class="summaryLabel">Date</span><span class="summaryValue">' + date + '</span></div>' +
        '<div class="summaryRow"><span class="summaryLabel">Time</span><span class="summaryValue">' + time + '</span></div>';

    $("#summaryBox").html(html);
}

// --- Submit Form ---
function submitForm() {
    if (!$("#agreeTerms").is(":checked")) {
        $("#termsError").show();
        return;
    }
    $("#termsError").hide();

    // Show success
    var name = $("#firstName").val() + " " + $("#lastName").val();
    var date = $("#appointmentDate").val();
    var time = $("#appointmentTime option:selected").text();
    var doctor = selectedDoctor;

    $("#successMessage").text(
        "Hello " + name + ", your appointment with " + doctor + " is confirmed for " + date + " at " + time + "."
    );

    // Update indicators
    $(".step").addClass("done").removeClass("active");

    $(".formStep").addClass("hidden");
    $("#stepSuccess").removeClass("hidden");

    $("html, body").animate({ scrollTop: $(".formContainer").offset().top - 30 }, 400);
}

// --- Reset Form ---
function resetForm() {
    // Clear all inputs
    $("input[type='text'], input[type='email'], input[type='tel'], input[type='date'], select, textarea").val("");
    $("input[type='checkbox']").prop("checked", false);
    $(".errorMsg").hide();
    $(".inputError").removeClass("inputError");
    selectedDoctor = null;
    currentStep = 1;

    // Reset indicators
    $(".step").removeClass("active done");
    $("#step1Indicator").addClass("active");

    $(".formStep").addClass("hidden");
    $("#step1").removeClass("hidden");

    $("html, body").animate({ scrollTop: $(".formContainer").offset().top - 30 }, 400);
}