let names = []; // Array to store names
let usedNames = []; // Array for already-picked names
let isDarkMode = true; // Controls theme toggling
let predefinedName = ""; // Developers can inject a name here

// Function to toggle between dark and light mode
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle("dark", isDarkMode);
  document.body.classList.toggle("light", !isDarkMode);
}

// Function to add names from the input field
function addNames() {
  const input = document.getElementById("nameInput").value;
  if (input.trim()) {
    const newNames = input
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name); // Remove empty names
    names = [...names, ...newNames];
    updateStatus();
    document.getElementById("nameInput").value = "";
  }
}

// Load names from an Excel file
document.getElementById("excelFile").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const newNames = jsonData.flat()
        .filter((name) => name)
        .map((name) => name.toString().trim());
      names = [...names, ...newNames];
      updateStatus();
      showMessage("Excel file loaded successfully!");
    } catch (error) {
      showMessage("Error reading Excel file!", true);
    }
  }
});

// Pick a random name or use the predefined one with shuffle animation
function pickRandomName() {
  const display = document.getElementById("nameDisplay");

  // Shuffle animation for predefined name
  if (predefinedName) {
    let counter = 0;
    const interval = setInterval(() => {
      // Show random names briefly
      display.textContent = names[Math.floor(Math.random() * names.length)] || predefinedName;
      if (++counter > 15) {
        clearInterval(interval);
        // Show predefined name at the end
        display.textContent = `🎉 ${predefinedName}`;
        usedNames.push(predefinedName); // Add predefined name to "used"
        predefinedName = ""; // Clear the predefined name after using it
        updateStatus();
      }
    }, 100);
    return; // Exit after showing the predefined name
  }

  // Check if there are no names left to pick
  if (names.length === 0) {
    display.textContent = "🎉 All names have been picked!";
    return;
  }

  // Pick and animate a random name
  const randomIndex = Math.floor(Math.random() * names.length);
  const selectedName = names[randomIndex];
  usedNames.push(selectedName); // Add name to used list
  names.splice(randomIndex, 1); // Remove picked name from list

  let counter = 0;
  const interval = setInterval(() => {
    display.textContent = names[Math.floor(Math.random() * names.length)] || selectedName;
    if (++counter > 15) { // End animation loop
      clearInterval(interval);
      display.textContent = `🎉 ${selectedName}`;
    }
  }, 100);

  updateStatus();
}

// Clear the names arrays and reset the display
function clearNames() {
  names = [];
  usedNames = [];
  updateStatus();
  document.getElementById("nameDisplay").textContent = "Ready to pick names!";
}

// Update the status display
function updateStatus() {
  document.getElementById(
    "status"
  ).textContent = `Total names left: ${names.length}, Used names: ${usedNames.length}`;
}

// Show a message to the user
function showMessage(message, isError = false) {
  const display = document.getElementById("nameDisplay");
  display.textContent = message;
  display.style.color = isError ? "#dc3545" : "#28a745";

  if (isError) {
    display.style.animation = "shake 0.5s";
    setTimeout(() => (display.style.animation = ""), 500);
  }
}

// Developer-only: Inject a predefined name (set this in VSCode)
predefinedName = ""; // Change "Alice" to any name you want
