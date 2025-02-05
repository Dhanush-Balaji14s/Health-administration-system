const patientForm = document.getElementById("patientForm");
const patientTableBody = document.getElementById("patientTableBody");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");
const searchInput = document.getElementById("searchInput");

const patients = [];
const doctorAppointments = {};

patientForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const contact = document.getElementById("contact").value;
    const doctor = document.getElementById("doctor").value;
    const appointmentDate = document.getElementById("appointmentDate").value;

    if (!name || !appointmentDate) {
        errorMessage.textContent = "All fields are required.";
        successMessage.textContent = "";
        return;
    }

    if (doctorAppointments[doctor] && doctorAppointments[doctor][appointmentDate]) {
        errorMessage.textContent = `Doctor ${doctor} is already attending ${doctorAppointments[doctor][appointmentDate]} at this time.`;
        successMessage.textContent = "";
        return;
    }

    if (!doctorAppointments[doctor]) {
        doctorAppointments[doctor] = {};
    }
    doctorAppointments[doctor][appointmentDate] = name;

    const patient = { name, age, gender, contact, doctor, appointmentDate };
    patients.push(patient);
    addPatientToTable(patient);

    successMessage.textContent = `Appointment successfully added for ${name} with ${doctor}!`;
    setTimeout(() => {
        successMessage.textContent = "";
    }, 10000);

    errorMessage.textContent = "";
    patientForm.reset();
});

function addPatientToTable(patient) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${patient.name}</td>
        <td>${patient.age}</td>
        <td>${patient.gender}</td>
        <td>${patient.contact}</td>
        <td>${patient.doctor}</td>
        <td>${new Date(patient.appointmentDate).toLocaleString()}</td>
        <td>
            <button class="edit-btn" onclick="editPatient('${patient.name}')">Edit</button>
            <button class="delete-btn" onclick="deletePatient('${patient.name}', '${patient.doctor}', '${patient.appointmentDate}')">Delete</button>
        </td>
    `;
    patientTableBody.appendChild(row);
}

function editPatient(name) {
    const patient = patients.find(p => p.name === name);
    if (patient) {
        document.getElementById("name").value = patient.name;
        document.getElementById("age").value = patient.age;
        document.getElementById("gender").value = patient.gender;
        document.getElementById("contact").value = patient.contact;
        document.getElementById("doctor").value = patient.doctor;
        document.getElementById("appointmentDate").value = patient.appointmentDate;
        deletePatient(patient.name, patient.doctor, patient.appointmentDate);
    }
}

function deletePatient(name, doctor, appointmentDate) {
    const index = patients.findIndex(p => p.name === name);
    if (index !== -1) {
        patients.splice(index, 1);
        delete doctorAppointments[doctor][appointmentDate];
        refreshTable();
    }
}

function refreshTable() {
    patientTableBody.innerHTML = "";
    patients.forEach(addPatientToTable);
}

searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    Array.from(patientTableBody.getElementsByTagName("tr")).forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const doctor = row.cells[3].textContent.toLowerCase();
        row.style.display = name.includes(filter) || doctor.includes(filter) ? "" : "none";
    });
});
