    function cleanAndTokenize(text) {
        return text
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, "")  // quitar todo menos letras y números
        .split("");  // por letra
    }
    
    function calculateFrequencies(tokens) {
        const frequencies = {};
        tokens.forEach(char => {
        frequencies[char] = (frequencies[char] || 0) + 1;
        });
    
        const total = tokens.length;
        const percentages = {};
        for (let char in frequencies) {
        percentages[char] = frequencies[char] / total;
        }
    
        return { frequencies, percentages };
    }
    
    function calculateEntropy(percentages) {
        let entropy = 0;
        for (let char in percentages) {
        const p = percentages[char];
        entropy -= p * Math.log2(p);
        }
        return entropy;
    }
    
    function displayResults(frequencies, percentages, entropy) {
        const entropyDiv = document.getElementById("entropyDisplay");
        entropyDiv.innerHTML = `
        <div class="text-cyber font-bold">🧠 Entropía Total: ${entropy.toFixed(4)} bits</div>
        <div class="text-accent2">🔣 Caracteres únicos: ${Object.keys(frequencies).length}</div>
        <div class="mt-2">
            <div class="text-sm">📊 Detalle por letra:</div>
            ${Object.entries(percentages)
            .map(([char, percent]) => `<div class="text-sm text-gray-300">${char}: ${(percent * 100).toFixed(2)}% (${frequencies[char]} veces)</div>`)
            .join("")}
        </div>
        `;
    
        renderCharts(frequencies, percentages);
    }
    
    function renderCharts(frequencies, percentages) {
        const labels = Object.keys(frequencies);
        const data = Object.values(percentages);
    
        if (window.barChart) window.barChart.destroy();
        if (window.pieChart) window.pieChart.destroy();
    
        window.barChart = new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels,
            datasets: [{
            label: "Frecuencia",
            data,
            backgroundColor: "#00f0ff"
            }]
        }
        });
    
        window.pieChart = new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels,
            datasets: [{
            label: "Porcentaje",
            data,
            backgroundColor: labels.map((_, i) => `hsl(${i * 30}, 100%, 60%)`)
            }]
        }
        });
    }
    
    async function extractTextFromPDF(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
    
        for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map(item => item.str).join(" ");
        }
    
        return fullText;
    }
    
    async function analyzeText() {
        let text = document.getElementById("textInput").value;
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];
    
        if (!text && file) {
        if (file.type === "application/pdf") {
            text = await extractTextFromPDF(file);
        } else if (file.type === "text/plain") {
            text = await file.text();
        }
        }
    
        if (!text) {
        alert("Por favor, ingresa texto o selecciona un archivo válido.");
        return;
        }
    
        const tokens = cleanAndTokenize(text);
        const { frequencies, percentages } = calculateFrequencies(tokens);
        const entropy = calculateEntropy(percentages);
    
        displayResults(frequencies, percentages, entropy);
    }
    
    document.getElementById("fileInput").addEventListener("change", function () {
        const fileName = this.files.length > 0 ? this.files[0].name : "Ningún archivo seleccionado";
        document.getElementById("fileName").textContent = fileName;
    });
    ``
    