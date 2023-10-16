const toggleBtn = document.getElementById('mode');
const body = document.body;
const header = document.querySelector('header');
const daftarTugas = document.getElementById('daftarTugas');
const hapusSemuaButton = document.getElementById('hapusSemuaBtn');

toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    header.classList.toggle('dark-mode');
    daftarTugas.classList.toggle('dark-mode');
});

document.getElementById('formTugas').addEventListener('submit', function(event) {
    event.preventDefault();

    let mataPelajaran = document.getElementById('mataPelajaran').value;
    let infoTugas = document.querySelector('input[name="infoTugas"]:checked').value;
    let tenggat = document.getElementById('tenggat').value;
    easteregg(tenggat);
    let keterangan = document.getElementById('keterangan').value.trim();

    if (mataPelajaran !== '' && tenggat !== '') {
        tambahTugasKeDaftar(mataPelajaran, infoTugas, tenggat, keterangan);
        document.getElementById('formTugas').reset();
    }
        // Setelah menambahkan tugas ke daftar, panggil fungsi untuk memeriksa tombol "Kirim Semua Tugas"
        periksaTugasDiDaftar();
});

function tambahTugasKeDaftar(mataPelajaran, infoTugas, tenggat, keterangan) {
    Array.from(daftarTugas.children).forEach(li => {
        const existingMapel = li.querySelector('.mata-pelajaran').textContent;
        const existingInfoTugas = li.querySelector('.info-tugas').textContent;
        const existingTenggat = li.querySelector('.tenggat').textContent.replace('Tenggat: ', '');
        const existingKeterangan = li.querySelector('.keterangan').textContent.replace('Keterangan: ', '');

        if (
            existingMapel === mataPelajaran &&
            existingInfoTugas === infoTugas &&
            existingTenggat === tenggat &&
            existingKeterangan === keterangan
        ) {
            li.remove();
        }
    });

    let li = document.createElement('li');
    li.innerHTML = `<span class="mata-pelajaran">${mataPelajaran}</span>
                    <span class="info-tugas">${infoTugas}</span>
                    <span class="tenggat">Tenggat: ${formatTanggal(tenggat)}</span>
                    <span class="keterangan">Keterangan: ${keterangan}</span>`;

    const salinButton = document.createElement('button');
    salinButton.textContent = 'Salin';
    salinButton.classList.add('salin-btn');
    li.appendChild(salinButton);

    const hapusButton = document.createElement('button');
    hapusButton.textContent = 'Hapus';
    hapusButton.classList.add('hapus-btn');
    li.appendChild(hapusButton);

    
    const kirimButton = document.createElement('button');
    kirimButton.textContent = 'Kirim';
    kirimButton.classList.add('kirim-btn');
    li.appendChild(kirimButton);

    // Event listener untuk tombol "Kirim"
    kirimButton.addEventListener('click', function() {
        kirimDataKeWebhook(mataPelajaran, infoTugas, tenggat, keterangan);
    });

    const ulDaftarTugas = document.getElementById('daftarTugas');
    const firstLi = ulDaftarTugas.firstChild;

    if (firstLi) {
        ulDaftarTugas.insertBefore(li, firstLi);
    } else {
        ulDaftarTugas.appendChild(li);
    }

    const tugas = {
        mataPelajaran,
        infoTugas,
        tenggat,
        keterangan
    };

    const existingData = JSON.parse(localStorage.getItem('daftarTugas')) || [];
    const updatedData = existingData.filter(tugasData => {
        return (
            tugasData.mataPelajaran !== mataPelajaran ||
            tugasData.infoTugas !== infoTugas ||
            tugasData.tenggat !== tenggat ||
            tugasData.keterangan !== keterangan
        );
    });
    updatedData.push(tugas);
    localStorage.setItem('daftarTugas', JSON.stringify(updatedData));
}

daftarTugas.addEventListener('click', function(event) {
    if (event.target.classList.contains('salin-btn')) {
        const liElement = event.target.closest('li');
        const mataPelajaran = getMapelSingkat(liElement.querySelector('.mata-pelajaran').textContent);
        const infoTugas = liElement.querySelector('.info-tugas').textContent;
        const tenggat = liElement.querySelector('.tenggat').textContent.replace('Tenggat: ', '');
        const keterangan = liElement.querySelector('.keterangan').textContent.replace('Keterangan: ', '');
        const formattedText = formatTugasText(mataPelajaran, infoTugas, tenggat, keterangan);
        salinTeks(formattedText);
    } else if (event.target.classList.contains('hapus-btn')) {
        const liElement = event.target.closest('li');
        const id = liElement.dataset.id;
        hapusTugas(id);

        liElement.remove();
    }
});

hapusSemuaButton.addEventListener('click', function() {
    const daftarTugas = document.getElementById('daftarTugas');
    while (daftarTugas.firstChild) {
        daftarTugas.removeChild(daftarTugas.firstChild);
    }
    localStorage.removeItem('daftarTugas');
        // Setelah menghapus semua tugas dari daftar, panggil fungsi untuk memeriksa tombol "Kirim Semua Tugas"
        periksaTugasDiDaftar();
});

function hapusTugas(id) {
    const existingData = JSON.parse(localStorage.getItem('daftarTugas')) || [];
    const updatedData = existingData.filter(tugas => tugas.id !== id);
    localStorage.setItem('daftarTugas', JSON.stringify(updatedData));
}

function hapusTugasTenggat() {
    const ulDaftarTugas = document.getElementById('daftarTugas');
    const lis = ulDaftarTugas.getElementsByTagName('li');
    const tanggalHariIni = new Date();

    for (let i = 0; i < lis.length; i++) {
        const li = lis[i];
        const tenggatText = li.querySelector('.tenggat').textContent;
        const tenggatTanggal = new Date(formatTanggalFromString(tenggatText));

        if (tenggatTanggal < tanggalHariIni) {
            li.remove();
        }
    }
}

function formatTanggalFromString(tanggalString) {
    const tanggalArray = tanggalString.replace('Tenggat: ', '').split('/');
    const tahun = parseInt(tanggalArray[2]);
    const bulan = parseInt(tanggalArray[1]) - 1;
    const tanggal = parseInt(tanggalArray[0]);
    return new Date(tahun, bulan, tanggal);
}

document.addEventListener('DOMContentLoaded', function() {
    hapusTugasTenggat();
});

// Event listener untuk memeriksa tugas saat dokumen dimuat
document.addEventListener('DOMContentLoaded', function() {
    periksaTugasDiDaftar();
});

function formatTugasText(mataPelajaran, infoTugas, tenggat, keterangan) {
    const mapelSingkat = getMapelSingkat(mataPelajaran);
    return `#${mapelSingkat}\n#${infoTugas}\nTenggat: ${tenggat}\nKeterangan: ${keterangan}`;
}

function getMapelSingkat(mataPelajaran) {
    const mapelSingkat = {
        "Pendidikan Agama Islam": "PAI",
        "Matematika": "MTK",
        "Ilmu Pengetahuan Alam dan Sosial": "IPAS",
        "Kejuruan": "KJR",
        "Informatika": "INF",
        "Bahasa Inggris": "BING",
        "Bahasa Indonesia": "BIN",
        "Sejarah": "SEJARAH",
        "Seni Teater": "SENI",
        "Pendidikan Pancasila dan Kewarganegaraan": "PPKN",
        "Pendidikan Jasmani Olahraga dan Keterampilan": "PJOK",
        "Lainnya":"Lainnya"
    };

    return mapelSingkat[mataPelajaran] || mataPelajaran;
}

function salinTeks(tekstosalin) {
    const tempInput = document.createElement('textarea');
    tempInput.value = tekstosalin;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}

document.addEventListener('DOMContentLoaded', function() {
    const existingData = JSON.parse(localStorage.getItem('daftarTugas')) || [];

    existingData.forEach(tugas => {
        tambahTugasKeDaftar(tugas.mataPelajaran, tugas.infoTugas, tugas.tenggat, tugas.keterangan);
    });
});

function formatTanggal(tanggal) {
    const tanggalArray = tanggal.split('-');
    const tanggalFormatted = `${tanggalArray[2]}/${tanggalArray[1]}/${tanggalArray[0]}`;
    return tanggalFormatted;
}

function easteregg(tenggat, keterangan) {
    const targetTanggal = new Date('2006-05-20');
    const inputTanggal = new Date(tenggat);
    
    const keteranganTextarea = document.getElementById('keterangan');
    const kataKunci = 'kalkulator bunga';

    if (inputTanggal.getTime() === targetTanggal.getTime()) {
        window.open('https://github.com/HeroX20/love/blob/main/Love/love.html', '_blank');
    } else if (keteranganTextarea.value.toLowerCase().includes(kataKunci)) {
        window.open('kalkulator/index.html', '_blank');
    }
}


function kirimDataKeWebhook(mataPelajaran, infoTugas, tenggat, keterangan) {
    const webhookURL = 'https://discord.com/api/webhooks/1162612396892897320/1dgSVw2LRvrgcANwMtJiWqpzZadwyH7G2NeaJItBO-qNbR4mA9TzofA59EzV5qX3pvG_';

    const dataTugas = {
        content: `\`\`\`
Mata Pelajaran: ${mataPelajaran}
Info/Tugas: ${infoTugas}
Tenggat: ${tenggat}
Keterangan: ${keterangan}
\`\`\`
`,
    };
    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataTugas),
    })
    .then(response => {
        if (response.ok) {
            console.log('Data berhasil dikirim ke webhook.');
        } else {
            console.log('Gagal mengirim data ke webhook.');
        }
    })
    .catch(error => {
        console.log('Terjadi kesalahan: ' + error);
    });
}

// Event listener untuk tombol "Kirim Semua Tugas"
const kirimSemuaButton = document.getElementById('kirimSemuaBtn');
kirimSemuaButton.addEventListener('click', function() {
    // Loop melalui semua tugas dalam daftar
    const tugasList = document.querySelectorAll('#daftarTugas li');

    tugasList.forEach(tugasItem => {
        const mataPelajaran = tugasItem.querySelector('.mata-pelajaran').textContent;
        const infoTugas = tugasItem.querySelector('.info-tugas').textContent;
        const tenggat = tugasItem.querySelector('.tenggat').textContent.replace('Tenggat: ', '');
        const keterangan = tugasItem.querySelector('.keterangan').textContent.replace('Keterangan: ', '');

        // Panggil fungsi untuk mengirim tugas ke webhook
        kirimDataKeWebhook(mataPelajaran, infoTugas, tenggat, keterangan);
    });
});

// Fungsi untuk menampilkan atau menyembunyikan tombol "Kirim Semua Tugas"
// Fungsi untuk menampilkan atau menyembunyikan tombol "Kirim Semua Tugas"
function periksaTugasDiDaftar() {
    const jumlahTugas = document.querySelectorAll('#daftarTugas li').length;
    const kirimSemuaButton = document.getElementById('kirimSemuaBtn');

    if (jumlahTugas > 1) { // Ubah angka ini menjadi 2 jika Anda ingin menampilkan tombol jika ada lebih dari 2 tugas
        kirimSemuaButton.style.display = 'block';
    } else {
        kirimSemuaButton.style.display = 'none';
    }
}

// Event listener untuk memeriksa tugas saat dokumen dimuat
document.addEventListener('DOMContentLoaded', function() {
    periksaTugasDiDaftar();
});




var update = `update :\n1. bug fixed\n2. menambahkan webhook ke server discord`;
var info = `indev: \n1. tombol menu\n2. menambahkan filter rule (di menu baru)`;
console.log(update);
console.log(info);
