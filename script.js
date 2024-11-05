// Функция для перевода времени в проценты
function timeToPercent(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return ((hours * 60 + minutes) / 1440) * 100;
}

// Функция рендера графика по загруженным данным
function renderSchedule(workHours) {
    const days = document.querySelectorAll(".day");
    days.forEach(day => {
        const dayName = day.getAttribute("data-day");
        const segments = workHours[dayName] || [];
        segments.forEach(segment => {
            const startPercent = timeToPercent(segment.start);
            const endPercent = timeToPercent(segment.end);
            const durationPercent = endPercent - startPercent;

            const segmentDiv = document.createElement("div");
            segmentDiv.classList.add("segment");
            segmentDiv.style.left = `${startPercent}%`;
            segmentDiv.style.width = `${durationPercent}%`;

            day.appendChild(segmentDiv);
        });
    });
}

// Функция для загрузки JSON-файла с сервера
async function loadWorkSessions() {
    try {
        const response = await fetch("work_time_log.json");
        const data = await response.json();

        // Преобразование данных в формат, понятный renderSchedule
        const workHours = data.reduce((acc, session) => {
            const day = new Date(session.start_time).toLocaleDateString("en-US", { weekday: 'short' });
            const startTime = new Date(session.start_time).toLocaleTimeString("en-US", { hour12: false }).slice(0, 5);
            const endTime = new Date(session.end_time).toLocaleTimeString("en-US", { hour12: false }).slice(0, 5);
            
            if (!acc[day]) acc[day] = [];
            acc[day].push({ start: startTime, end: endTime });
            return acc;
        }, {});

        renderSchedule(workHours);
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
    }
}

// Запуск загрузки данных и рендеринга
loadWorkSessions();
