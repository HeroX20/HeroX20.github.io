function setDefaultTheme() {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    const container = document.querySelector(".container");
    if (isDarkMode) {
        container.classList.add("dark-mode");
        container.classList.remove("light-mode");
    } else {
        container.classList.add("light-mode");
        container.classList.remove("dark-mode");
    }
}

window.addEventListener("load", setDefaultTheme);

const themeButton = document.getElementById("theme-button");
if (themeButton) {
    themeButton.addEventListener("click", toggleTheme);
}

function hitungBunga() {
    // Mengambil input dari elemen HTML
    var modalAwalInput = parseFloat(document.getElementById("modalAwal").value.replace(/\./g, '').replace(/,/g, '.'));
    var bungaInput = parseFloat(document.getElementById("bunga").value) / 100;
    var periodeInput = parseFloat(document.getElementById("periode").value);
    var jenisBunga = document.getElementById("jenisBunga").value;

    // Mengambil referensi ke tabelAnuitas
    var tabelAnuitas = document.getElementById("tabelAnuitas");

    // Menampilkan atau menyembunyikan tabel berdasarkan jenisBunga
    tabelAnuitas.style.display = jenisBunga === "anuitas" ? "table" : "none";

    if (jenisBunga === "bungaTunggal") {
        var bungaTunggal = modalAwalInput * bungaInput;
        var modalAkhirBungaTunggal = modalAwalInput * (1 + periodeInput * bungaInput);

        // Memformat hasil dengan titik ribuan
        document.getElementById("hasilBunga").innerHTML = "Bunga Tunggal: " + formatRibuan(bungaTunggal);
        document.getElementById("hasilModalAkhir").innerHTML = "Modal Akhir (Bunga Tunggal): " + formatRibuan(modalAkhirBungaTunggal);
    } else if (jenisBunga === "bungaMajemuk") {
        var bungaMajemuk = (modalAwalInput * Math.pow((1 + bungaInput), periodeInput)) - modalAwalInput;
        var modalAkhirBungaMajemuk = modalAwalInput * Math.pow((1 + bungaInput), periodeInput);

        // Memformat hasil dengan titik ribuan
        document.getElementById("hasilBunga").innerHTML = "Bunga Majemuk: " + formatRibuan(bungaMajemuk);
        document.getElementById("hasilModalAkhir").innerHTML = "Modal Akhir (Bunga Majemuk): " + formatRibuan(modalAkhirBungaMajemuk);
    } else if (jenisBunga === "anuitas") {
        var anuitas = (modalAwalInput * bungaInput * Math.pow(1 + bungaInput, periodeInput)) / (Math.pow(1 + bungaInput, periodeInput) - 1);
        var anuitasBulanPertama = (modalAwalInput * bungaInput) / (Math.pow(1 + bungaInput, periodeInput) - 1);

        // Mengosongkan tbody tabel sebelum mengisi
        var tbody = tabelAnuitas.querySelector("tbody");
        tbody.innerHTML = "";

        for (var bulan = 1; bulan <= periodeInput; bulan++) {
            var anuitasBulanN = anuitasBulanPertama * Math.pow(1 + bungaInput, bulan - 1);
            var bungaBulanN = anuitas - anuitasBulanN;

            var row = document.createElement("tr");
            var cellBulan = document.createElement("td");
            var cellAngsuranPokok = document.createElement("td");
            var cellBunga = document.createElement("td");
            var cellAnuitas = document.createElement("td");

            cellBulan.textContent = bulan;
            cellAngsuranPokok.textContent = formatRibuan(anuitasBulanN - bungaBulanN);
            cellBunga.textContent = formatRibuan(bungaBulanN);
            cellAnuitas.textContent = formatRibuan(anuitas);

            row.appendChild(cellBulan);
            row.appendChild(cellAngsuranPokok);
            row.appendChild(cellBunga);
            row.appendChild(cellAnuitas);

            tbody.appendChild(row);
        }

        // Memformat hasil dengan titik ribuan
        document.getElementById("hasilBunga").innerHTML = "Anuitas: " + formatRibuan(anuitas);
        document.getElementById("hasilModalAkhir").innerHTML = "";

        // Menambahkan hasil A1, An, dan Bn ke dalam hasil
        document.getElementById("hasilBunga").innerHTML += "<br>Anuitas Bulan Pertama (A1): " + formatRibuan(anuitasBulanPertama);
        document.getElementById("hasilBunga").innerHTML += "<br>Anuitas Bulan Terakhir (An): " + formatRibuan(anuitasBulanPertama * Math.pow(1 + bungaInput, periodeInput - 1));
        document.getElementById("hasilBunga").innerHTML += "<br>Besar Bunga Bulan Terakhir (Bn): " + formatRibuan(anuitas - (anuitasBulanPertama * Math.pow(1 + bungaInput, periodeInput - 1)));
    }
}

function formatRibuan(nilai) {
    return nilai.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function formatModalAwal(input) {
    // Fungsi ini akan memformat input modal awal dengan titik ribuan
    var value = input.value.replace(/\./g, ''); // Menghilangkan titik yang ada
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Menambahkan titik sebagai pemisah ribuan
    input.value = value;
}

function ubahLabel(select) {
    var labelBunga = document.querySelector('label[for="bunga"]');
    var labelPeriode = document.querySelector('label[for="periode"]');
    var labelModalAwal = document.querySelector('label[for="modalAwal"]');
    
    if (select.value === "anuitas") {
        labelBunga.textContent = "Periode Bunga (Bulan%)";
        labelPeriode.textContent = "Periode (Bulan)";
        labelModalAwal.textContent = "Jumlah Pinjaman";
    } else {
        labelBunga.textContent = "Bunga (%)";
        labelPeriode.textContent = "Periode (Tahun)";
        labelModalAwal.textContent = "Modal Awal";
    }
}