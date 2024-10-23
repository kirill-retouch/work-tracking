const workHours = {
    Mon: [{ start: "01:00", end: "02:30" }, { start: "12:15", end: "14:45" }],
    Tue: [],
    Wed: [{ start: "09:00", end: "15:30" }],
    Thu: [{ start: "16:00", end: "17:30" }],
    Fri: [],
    Sat: [{ start: "08:00", end: "12:00" }],
    Sun: [{ start: "03:15", end: "04:45" }, { start: "06:30", end: "09:00" }]
};

function timeToPercent(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return ((hours * 60 + minutes) / 1440) * 100;
}

function renderSchedule() {
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

renderSchedule();
