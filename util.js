function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.textContent = '计算中...';
    document.body.appendChild(loading);

}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        document.body.removeChild(loading);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
    }
}

export {showLoading, hideLoading};