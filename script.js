let names = [];
let isDarkMode = true;

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle("dark", isDarkMode);
  document.body.classList.toggle("light", !isDarkMode);
}

function addNames() {
  const input = document.getElementById("nameInput").value;
  if (input.trim()) {
    const newNames = input
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name);
    names = [...names, ...newNames];
    updateStatus();
    document.getElementById("nameInput").value = "";
  }
}

document.getElementById("excelFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const newNames = jsonData
        .flat()
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

function pickRandomName() {
  if (names.length === 0) {
    showMessage("Please add some names first!", true);
    return;
  }

  const display = document.getElementById("nameDisplay");
  let counter = 0;

  const interval = setInterval(() => {
    display.textContent = names[Math.floor(Math.random() * names.length)];
    if (++counter > 15) {
      clearInterval(interval);
      display.textContent = `🎉 ${
        names[Math.floor(Math.random() * names.length)]
      }`;
    }
  }, 100);
}

function clearNames() {
  names = [];
  updateStatus();
  document.getElementById("nameDisplay").textContent = "Ready to pick names!";
}

function updateStatus() {
  document.getElementById(
    "status"
  ).textContent = `Total names: ${names.length}`;
}

function showMessage(message, isError = false) {
  const display = document.getElementById("nameDisplay");
  display.textContent = message;
  display.style.color = isError ? "#dc3545" : "#28a745";

  if (isError) {
    display.style.animation = "shake 0.5s";
    setTimeout(() => (display.style.animation = ""), 500);
  }
}
