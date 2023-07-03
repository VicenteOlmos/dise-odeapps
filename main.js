async function fetchBestHours() {
    const daySelect = document.getElementById('day-select');
    const selectedDay = daySelect.value;
    const bestHoursDiv = document.getElementById('best-hours');
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    if (!selectedDay) {
        bestHoursDiv.textContent = 'Por favor selecciona un día';
        return;
    }

    const response = await fetch(`/besthours/${selectedDay}`);
    const bestHours = await response.json();

    bestHoursDiv.innerHTML = '';
    const filteredHours = bestHours[selectedDay].filter(time => time >= startTime && time <= endTime);
    if (filteredHours.length === 0) {
        bestHoursDiv.textContent = 'No hay horarios óptimos';
        return;
    }
    filteredHours.forEach(time => {
        const hour = parseInt(time.split(':')[0]);
        const clockContainer = document.createElement('div');
        clockContainer.className = 'clock-container';
        const clock = document.createElement('div');
        clock.className = 'clock';
        const hourHand = document.createElement('div');
        hourHand.className = 'hour';
        hourHand.style.transform = `rotate(${(hour % 12) / 12 * 360}deg)`;
        clock.appendChild(hourHand);
        clockContainer.appendChild(clock);
        const timeLabel = document.createElement('div');
        timeLabel.textContent = time;
        clockContainer.appendChild(timeLabel);
        bestHoursDiv.appendChild(clockContainer);
    });
}

