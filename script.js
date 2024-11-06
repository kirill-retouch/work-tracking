// Загрузка данных из JSON файла
async function loadWorkSessions() {
    try {
        const response = await fetch('work_time_log.json');
        const workSessions = await response.json();
        displayWorkSessions(workSessions);
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
    }
}

// Массив с названиями дней недели
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Функция для добавления сегментов в таблицу
function addSegment(dayElement, startHour, endHour) {
    const segment = document.createElement('div');
    segment.classList.add('segment');
    segment.style.left = `${(startHour / 24) * 100}%`;
    segment.style.width = `${((endHour - startHour) / 24) * 100}%`;
    dayElement.appendChild(segment);
}

// Функция для отображения рабочего времени
function displayWorkSessions(workSessions) {
    workSessions.forEach(session => {
        const start = new Date(session.start_time);
        const end = new Date(session.end_time);

        // Если рабочая сессия пересекает полночь
        if (start.getDate() !== end.getDate()) {
            // Сегмент до конца первого дня
            addSegment(
                document.querySelector(`.day[data-day="${days[start.getDay()]}"]`),
                start.getHours() + start.getMinutes() / 60,
                24
            );

            // Сегмент с начала следующего дня
            addSegment(
                document.querySelector(`.day[data-day="${days[end.getDay()]}"]`),
                0,
                end.getHours() + end.getMinutes() / 60
            );
        } else {
            // Если сессия в пределах одного дня
            addSegment(
                document.querySelector(`.day[data-day="${days[start.getDay()]}"]`),
                start.getHours() + start.getMinutes() / 60,
                end.getHours() + end.getMinutes() / 60
            );
        }

        // Обновление суммарного рабочего времени
        updateTotalTime(session.start_time, session.end_time);
    });
}

// Функция для обновления суммарного времени для каждого дня
function updateTotalTime(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationInMinutes = (end - start) / (1000 * 60);
    let totalElement;

    // Если сессия длится через полночь
    if (start.getDate() !== end.getDate()) {
        const minutesBeforeMidnight = (new Date(start.getFullYear(), start.getMonth(), start.getDate(), 23, 59, 59, 999) - start) / (1000 * 60);
        totalElement = document.querySelector(`.total-time[data-day="${days[start.getDay()]}"]`);
        addMinutesToTotal(totalElement, minutesBeforeMidnight);

        const minutesAfterMidnight = durationInMinutes - minutesBeforeMidnight;
        totalElement = document.querySelector(`.total-time[data-day="${days[end.getDay()]}"]`);
        addMinutesToTotal(totalElement, minutesAfterMidnight);
    } else {
        totalElement = document.querySelector(`.total-time[data-day="${days[start.getDay()]}"]`);
        addMinutesToTotal(totalElement, durationInMinutes);
    }
}

// Функция для добавления минут к суммарному времени и отображения в формате "Часы Минуты"
function addMinutesToTotal(element, minutesToAdd) {
    const currentTotal = element.innerText ? element.innerText.split(" ") : ["0h", "0m"];
    const currentHours = parseInt(currentTotal[0].replace("h", ""));
    const currentMinutes = parseInt(currentTotal[1].replace("m", ""));
    
    // Округляем минуты до целого значения
    const newTotalMinutes = Math.round(currentMinutes + minutesToAdd);
    const updatedHours = currentHours + Math.floor(newTotalMinutes / 60);
    const updatedMinutes = newTotalMinutes % 60;
    
    element.innerText = `${updatedHours}h ${updatedMinutes}m`;
}


// Загрузка и отображение данных при загрузке страницы
document.addEventListener("DOMContentLoaded", loadWorkSessions);
