let names = [];

function addNames() {
    const input = document.getElementById('nameInput').value;
    if (input.trim()) {
        const newNames = input.split(',').map(name => name.trim()).filter(name => name);
        names = [...names, ...newNames];
        updateNameCount();
        document.getElementById('nameInput').value = '';
    }
}

document.getElementById('excelFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const newNames = jsonData.flat().filter(name => name);
        names = [...names, ...newNames];
        updateNameCount();
    }
});

function pickRandomName() {
    if (names.length === 0) {
        alert('Please add some names first!');
        return;
    }
    
    const display = document.getElementById('nameDisplay');
    display.classList.add('animate');
    
    // Create animation effect
    let counter = 0;
    const interval = setInterval(() => {
        display.textContent = names[Math.floor(Math.random() * names.length)];
        counter++;
        
        if (counter > 20) {
            clearInterval(interval);
            const selectedName = names[Math.floor(Math.random() * names.length)];
            display.textContent = selectedName;
            setTimeout(() => display.classList.remove('animate'), 500);
        }
    }, 100);
}

function updateNameCount() {
    document.getElementById('totalNames').textContent = `Total names: ${names.length}`;
}
