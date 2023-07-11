const symptoms = {
    'Demam': 0.2,
    'Batuk Kering': 0.15,
    'Sesak Napas': 0.3,
    'Pilek': 0.1,
    'Sakit Tenggorokan': 0.1,
    'Kelelahan': 0.15,
    'Mual/Muntah': 0.1,
    'Diare': 0.05,
    'Nyeri otot/tubuh': 0.1,
    'Sakit Kepala': 0.1,
    'Hilang Indra Penciuman/Rasa': 0.2,
    'Ruam Kulit': 0.1,
    'Konjungtivitis': 0.1,
    'Kehilangan Nafsu Makan': 0.15,
    'Kehilangan Berat Badan': 0.2,
    'Sulit Berkonsentrasi': 0.1,
    'Sulit Tidur': 0.1,
    'Sakit Perut': 0.1,
    'Mata Merah': 0.1,
    'Bengkak pada Kaki atau Tangan': 0.1,
    'Suhu Tubuh Tinggi': 0.2,
    'Menggigil': 0.1,
    'Lemas': 0.15,
    'Sakit Telinga': 0.1,
    'Sulit Bernafas': 0.4
};

const rules = [
    { 'Sulit Bernafas': true },
    { 'Suhu Tubuh Tinggi': true },
    { 'Hilang Indra Penciuman/Rasa': true },
    { 'Batuk Kering': true, 'Sakit Tenggorokan': true },
    { 'Batuk Kering': true, 'Sakit Kepala': true, 'Kelelahan': true },
    { 'Demam': true, 'Kelelahan': true, 'Nyeri otot/tubuh': true },
    { 'Demam': true, 'Sesak Napas': true, 'Sulit Bernafas': true },
    { 'Diare': true, 'Mual/Muntah': true },
    { 'Diare': true, 'Mual/Muntah': true },
    { 'Mata Merah': true, 'Konjungtivitis': true },
    { 'Kehilangan Berat Badan': true },
    { 'Sulit Berkonsentrasi': true },
    { 'Sulit Tidur': true },
    { 'Menggigil': true },
    { 'Bengkak pada Kaki atau Tangan': true },
    { 'Ruam Kulit': true }
];

const form = document.getElementById('diagnosisForm');
const symptomsContainer = document.getElementById('symptomsContainer');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nameElement = document.getElementById('name').value;
    const ageElement = parseInt(document.getElementById('age').value);
    const genderElement = document.getElementById('gender').value;
    const checkboxes = document.querySelectorAll('input[name="symptoms"]:checked');

    const symptomBool = {};
    checkboxes.forEach(function (checkbox) {
        symptomBool[checkbox.value] = true;
    });

    let totalWeight = 0;
    for (const rule of rules) {
        const count = Object.keys(rule).reduce((acc, symptom) => {
            return acc + (symptomBool[symptom] === rule[symptom] ? 1 : 0);
        }, 0);

        if (count === Object.keys(rule).length) {
            totalWeight += Object.keys(rule).reduce((acc, symptom) => {
                return acc + (rule[symptom] ? symptoms[symptom] : 0);
            }, 0);
        }
    }

    const percentWeight = Math.round((totalWeight / Object.values(symptoms).reduce((acc, value) => acc + value, 0)) * 100 * 100) / 100;

    let diagnosis, condition, recommendation;
    if (totalWeight >= 0.8) {
        diagnosis = 'Positif COVID-19';
        condition = 'Berat';
        recommendation = 'Segera mencari bantuan medis dan mengisolasi diri untuk mencegah penularan.';
    } else if (totalWeight >= 0.5) {
        diagnosis = 'Positif COVID-19';
        condition = 'Sedang';
        recommendation = 'Segera mencari bantuan medis dan mengisolasi diri untuk mencegah penularan.';
    } else if (totalWeight > 0) {
        diagnosis = 'Negatif COVID-19';
        condition = 'Ringan';
        recommendation = 'Tetap jaga kesehatan dan lakukan tindakan pencegahan COVID-19.';
    } else {
        diagnosis = 'Negatif COVID-19';
        condition = 'Tidak ada gejala';
        recommendation = 'Tetap jaga kesehatan dan lakukan tindakan pencegahan COVID-19 jika ada kontak dengan orang yang terinfeksi.';
    }

    document.getElementById('resultName').textContent = nameElement;
    document.getElementById('resultAge').textContent = ageElement;
    document.getElementById('resultGender').textContent = genderElement;
    document.getElementById('percentWeight').textContent = percentWeight + '%';
    document.getElementById('diagnosis').textContent = diagnosis;
    document.getElementById('condition').textContent = condition;
    document.getElementById('recommendation').textContent = recommendation;

    const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    resultModal.show();
});

const symptomsPerRow = 3; // Jumlah gejala per baris
let symptomCount = 0; // Variabel untuk menghitung jumlah gejala

for (const symptom in symptoms) {
    if (symptomCount % symptomsPerRow === 0) {
        // Membuat baris baru setiap kali mencapai jumlah gejala per baris
        const row = document.createElement('div');
        row.classList.add('row');
        symptomsContainer.appendChild(row);
    }

    const row = symptomsContainer.lastElementChild;
    const checkbox = document.createElement('div');
    checkbox.classList.add('col-md-4', 'mb-3');
    checkbox.innerHTML = `
        <div class="form-check">
        <input class="form-check-input" type="checkbox" id="${symptom}" name="symptoms" value="${symptom}">
        <label class="form-check-label" for="${symptom}">${symptom}</label>
        </div>
    `;
    row.appendChild(checkbox);

    symptomCount++;
}