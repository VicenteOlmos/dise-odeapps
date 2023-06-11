async function fetchBestHours() {
    const daySelect = document.getElementById('day-select');
    const selectedDay = daySelect.value;
    const bestHoursDiv = document.getElementById('best-hours');

    if (!selectedDay) {
        bestHoursDiv.textContent = 'Por favor selecciona un día';
        return;
    }

    const response = await fetch(`/besthours/${selectedDay}`);
    const bestHours = await response.json();

    bestHoursDiv.textContent = `Las mejores horas para el ${selectedDay} son: ${bestHours[selectedDay].join(', ')}`;
    
}
