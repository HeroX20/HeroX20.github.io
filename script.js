// JavaScript
document.addEventListener('DOMContentLoaded', function () {
    var showButtons = document.querySelectorAll('.show-details');
    var detailsRows = document.querySelectorAll('.details');

    // Sembunyikan semua baris details saat pertama kali halaman dimuat
    detailsRows.forEach(function (row) {
        row.style.display = 'none';
    });

    showButtons.forEach(function (button, index) {
        button.addEventListener('click', function () {
            var target = button.getAttribute('data-target');

            detailsRows.forEach(function (row) {
                var content = row.getAttribute('data-content');
                if (content === target) {
                    if (row.style.display === 'table-row') {
                        row.style.display = 'none';
                    } else {
                        row.style.display = 'table-row';
                    }
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
});
