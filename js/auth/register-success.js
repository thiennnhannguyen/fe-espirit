document.addEventListener('DOMContentLoaded', function() {

    const exploreBtn = document.getElementById('exploreBtn');

    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            window.location.href = '../../index.html';
        });
    }

});