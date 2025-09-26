// ===== CONFIGURATION =====
const bootcampStart = new Date();

// DOM Elements
const dayTitle = document.getElementById("day-title");
const checklist = document.getElementById("checklist");
const saveStatus = document.getElementById("save-status");
const prevBtn = document.getElementById("prev-day");
const nextBtn = document.getElementById("next-day");
const exportBtn = document.getElementById("export-btn");

// ===== DAY PLANS =====
// Phase 1–4 plans (example: 90 days filled with placeholders)
const dayPlans = {};

// ===== Phase 1: Days 1–15 =====
for (let i = 1; i <= 15; i++) {
    dayPlans[i] = [
        "6:00 AM - 7:00 AM: Wake up & morning routine",
        "7:00 AM - 8:00 AM: Workout",
        "8:00 AM - 12:00 PM: College",
        "3:00 PM - 5:00 PM: LeetCode - 2 problems",
        "6:00 PM - 6:30 PM: Reflection / journaling"
    ];
}

// ===== Phase 2: Days 16–45 =====
for (let i = 16; i <= 45; i++) {
    dayPlans[i] = [
        "5:45 AM - 6:30 AM: Wake up & meditation",
        "6:30 AM - 7:30 AM: Cardio / strength",
        "8:00 AM - 12:00 PM: College",
        "3:00 PM - 6:00 PM: LeetCode - 3 problems",
        "6:30 PM - 7:00 PM: Reflection / journaling"
    ];
}

// ===== Phase 3: Days 46–75 =====
for (let i = 46; i <= 75; i++) {
    dayPlans[i] = [
        "5:30 AM - 6:15 AM: Wake up & meditation",
        "6:15 AM - 7:30 AM: Intense workout (strength + cardio)",
        "8:00 AM - 12:00 PM: College",
        "3:00 PM - 6:00 PM: LeetCode - 3 problems (medium)",
        "6:30 PM - 7:00 PM: Reflection / journaling"
    ];
}

// ===== Phase 4: Days 76–90 =====
for (let i = 76; i <= 90; i++) {
    dayPlans[i] = [
        "5:30 AM - 6:00 AM: Wake up & meditation",
        "6:00 AM - 7:30 AM: Full-body workout + cardio",
        "8:00 AM - 12:00 PM: College",
        "3:00 PM - 6:00 PM: LeetCode - 3–4 problems (medium/hard)",
        "6:30 PM - 7:00 PM: Evening reflection"
    ];
}

// ===== FUNCTIONS =====
let currentDay = 1;

// Calculate day number based on date
function getDayNumber() {
    const today = new Date();
    const diff = today - bootcampStart;
    const dayNum = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    return dayNum;
}

// Countdown to bootcamp start
function showCountdown() {
    const now = new Date();
    const diff = bootcampStart - now;

    if (diff <= 0) return false; // Bootcamp started

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    checklist.innerHTML = `<li style="text-align:center; font-size:1.5rem; list-style:none;">
    Bootcamp starts in: ${days}d ${hours}h ${minutes}m ${seconds}s
  </li>`;
    dayTitle.textContent = "Countdown to Day 1";

    setTimeout(showCountdown, 1000);
    return true;
}

// Load tasks for a specific day
function loadDayTasks(dayNumber) {
    checklist.innerHTML = "";
    const tasks = dayPlans[dayNumber] || ["No tasks defined for today."];
    dayTitle.textContent = `Day ${dayNumber} Checklist`;
    currentDay = dayNumber;

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `task-${index}`;

        const label = document.createElement("label");
        label.setAttribute("for", `task-${index}`);
        label.textContent = task;

        li.appendChild(checkbox);
        li.appendChild(label);
        checklist.appendChild(li);

        // Restore previous state
        const saved = localStorage.getItem(`day${dayNumber}-task${index}`);
        if (saved === "true") {
            checkbox.checked = true;
            label.classList.add("completed");
        }

        checkbox.addEventListener("change", () => {
            localStorage.setItem(`day${dayNumber}-task${index}`, checkbox.checked);
            if (checkbox.checked) label.classList.add("completed");
            else label.classList.remove("completed");
            saveStatus.textContent = "Progress saved ✅";
            setTimeout(() => (saveStatus.textContent = ""), 1500);
        });
    });
}

// Export day's progress as JSON
function exportDayProgress(dayNumber) {
    const tasks = dayPlans[dayNumber];
    if (!tasks) return alert("No tasks found for today.");

    const progress = tasks.map((task, index) => ({
        task,
        completed: localStorage.getItem(`day${dayNumber}-task${index}`) === "true"
    }));

    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Day${dayNumber}_progress.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Auto-export at 11:59 PM
function scheduleAutoExport(dayNumber) {
    const now = new Date();
    const exportTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23, 59, 0, 0
    );

    const msUntilExport = exportTime - now;
    if (msUntilExport > 0) {
        setTimeout(() => {
            exportDayProgress(dayNumber);
            console.log("Day progress auto-exported!");
        }, msUntilExport);
    }
}

// Schedule midnight page refresh
function scheduleMidnightRefresh() {
    const now = new Date();
    const msUntilMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
    ) - now;

    setTimeout(() => location.reload(), msUntilMidnight);
}

// Navigation buttons
prevBtn.addEventListener("click", () => {
    if (currentDay > 1) loadDayTasks(currentDay - 1);
});

nextBtn.addEventListener("click", () => {
    if (currentDay < 90) loadDayTasks(currentDay + 1);
});

// ===== INIT =====
const dayNum = getDayNumber();

if (dayNum < 1) {
    showCountdown();
} else if (dayNum <= 90) {
    loadDayTasks(dayNum);
    scheduleMidnightRefresh();
    scheduleAutoExport(dayNum);
} else {
    dayTitle.textContent = "Bootcamp Completed 🎉";
    checklist.innerHTML =
        "<li style='list-style:none; text-align:center;'>Congratulations! You finished the 90-day bootcamp.</li>";
}
