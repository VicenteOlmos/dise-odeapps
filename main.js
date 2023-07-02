window.onload = function() {
    const images = document.querySelectorAll('#image-slider img');
    let index = 0;
  
    setInterval(() => {
      images[index].classList.remove('active');
      index = (index + 1) % images.length;
      images[index].classList.add('active');
    }, 3000); // Cambia la imagen cada 3 segundos (ajusta el valor según tus necesidades)


    async function fetchBestHours() {
        const daySelect = document.getElementById('day-select');
        const selectedDay = daySelect.value;
        const bestHoursDiv = document.getElementById('best-hours');

        if (!selectedDay) {
            bestHoursDiv.textContent = '';
            return;
        }

        const response = await fetch(`/besthours/${selectedDay}`);
        const bestHours = await response.json();

        bestHoursDiv.textContent = `Las mejores horas para el ${selectedDay} son: ${bestHours[selectedDay].join(', ')}`;
    }

    document.getElementById('current-aforo-button').addEventListener('click', async function fetchCurrentAforo() {
        const response = await fetch('/get_aforo');
        const aforoData = await response.json();

        const currentAforoDiv = document.getElementById('current-aforo');
        currentAforoDiv.textContent = `El aforo actual es: ${aforoData[aforoData.length - 1].aforo}`;
    });

    document.getElementById('submit-comment').addEventListener('click', async () => {
        const comment = document.getElementById('comment-box').value;

        if (!comment.trim()) {
            alert('Por favor, escribe un comentario.');
            return;
        }

        const response = await fetch('/submit_comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment }),
        });

        if (response.ok) {
            document.getElementById('comment-box').value = '';
            alert('Comentario enviado con éxito.');
        } else {
            alert('Hubo un error al enviar tu comentario. Por favor, intenta de nuevo.');
        }
    });

    // Asigna la función fetchBestHours al evento click del botón "Mostrar Mejores Horas"
    document.getElementById('show-best-hours-button').addEventListener('click', fetchBestHours);
};

    
