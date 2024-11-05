// Функция для перевода времени в проценты
function timeToPercent(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return ((hours * 60 + minutes) / 1440) * 100;
}

// Функция для подсчета длительности сессии в минутах
function calculateDuration(start, end) {
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);
    return (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
}

// Функция рендера графика по загруженным данным
function renderSchedule(workHours) {
    const days = document.querySelectorAll(".day");
    const totalTimes = document.querySelectorAll(".total-time");

    days.forEach((day, index) => {
        const dayName = day.getAttribute("data-day");
        const segments = workHours[dayName] || [];
        let totalMinutes = 0;

        segments.forEach(segment => {
            const startPercent = timeToPercent(segment.start);
            const endPercent = timeToPercent(segment.end);
            const durationPercent = endPercent - startPercent;
            totalMinutes += calculateDuration(segment.start, segment.end);

            const segmentDiv = document.createElement("div");
            segmentDiv.classList.add("segment");
            segmentDiv.style.left = `${startPercent}%`;
            segmentDiv.style.width = `${durationPercent}%`;

            day.appendChild(segmentDiv);
        });

        // Добавляем итоговое время в соответствующий блок
        const totalTimeDiv = totalTimes[index];
        totalTimeDiv.textContent = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
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
