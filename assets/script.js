document.addEventListener('DOMContentLoaded', function () {

    // ====================================================
    // 1. ข้อมูลกิจกรรม (ใช้สำหรับปฏิทินด้านล่างเท่านั้น)
    // ====================================================
    const activityData = {
        '2026-01-24': {
            shortTitle: 'สัมภาษณ์',
            title: 'สัมภาษณ์ผู้ผ่านการคัดเลือก',
            type: 'info'
        },
        '2026-03-07': {
            shortTitle: 'Workshop 1',
            title: 'Workshop Part 1: Basic Electronics',
            type: 'workshop'
        },
        '2026-03-08': {
            shortTitle: 'Workshop 2',
            title: 'Workshop Part 2: Microcontroller',
            type: 'workshop'
        },
        '2026-03-14': {
            shortTitle: 'Workshop 3',
            title: 'Workshop Part 3: IoT Sensors',
            type: 'workshop'
        },
        '2026-03-15': {
            shortTitle: 'Workshop 4',
            title: 'Workshop Part 4: System Integration',
            type: 'workshop'
        },
        '2026-03-20': {
            shortTitle: 'Dev Day 1',
            title: 'Project Development (Day 1)',
            type: 'project'
        },
        '2026-03-21': {
            shortTitle: 'Dev Day 2',
            title: 'Project Development (Day 2)',
            type: 'project'
        },
        '2026-03-22': {
            shortTitle: 'Final Day',
            title: 'Final Presentation & Closing',
            type: 'event'
        }
    };

    // ✅ เพิ่มช่วงรับสมัคร (Dec 8-27) เข้าไปใน Data อัตโนมัติ (สำหรับปฏิทิน)
    for (let d = 8; d <= 27; d++) {
        const dayStr = d.toString().padStart(2, '0');
        activityData[`2025-12-${dayStr}`] = {
            shortTitle: 'รับสมัคร',
            title: 'เปิดรับสมัคร (Registration Period)',
            type: 'register'
        };
    }

    // ====================================================
    // 2. ส่วนสร้างปฏิทิน (Calendar Generator)
    // ====================================================
    const calendarContainer = document.getElementById('calendarContainer');
    const monthSelector = document.getElementById('monthSelector');

    function generateCalendar(monthIndex, year) {
        const date = new Date(year, monthIndex, 1);
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const firstDayIndex = date.getDay();

        const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

        let html = `
            <div class="text-center mb-3">
                <h4 class="fw-bold text-white">${monthNames[monthIndex]} ${year + 543}</h4>
            </div>
            <table class="calendar-table w-100">
                <thead>
                    <tr>
                        <th>อา</th><th>จ</th><th>อ</th><th>พ</th><th>พฤ</th><th>ศ</th><th>ส</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
        `;

        // สร้างช่องว่างก่อนวันแรกของเดือน
        for (let i = 0; i < firstDayIndex; i++) {
            html += `<td></td>`;
        }

        // วนลูปสร้างวันที่
        for (let day = 1; day <= daysInMonth; day++) {
            if ((firstDayIndex + day - 1) % 7 === 0 && day !== 1) {
                html += `</tr><tr>`;
            }

            const currentMonthStr = (monthIndex + 1).toString().padStart(2, '0');
            const currentDayStr = day.toString().padStart(2, '0');
            const dateKey = `${year}-${currentMonthStr}-${currentDayStr}`;

            const activity = activityData[dateKey];

            let cellContent = `<span class="day-number">${day}</span>`;
            let cellClass = '';

            if (activity) {
                cellClass = 'event-day';
                // ถ้าเป็นช่วงรับสมัคร ให้ใส่ class เพิ่ม
                if (activity.type === 'register') {
                    cellClass += ' event-register';
                }

                // แสดงชื่อกิจกรรม
                cellContent += `
                    <div class="event-label d-none d-md-block">
                        ${activity.shortTitle}
                    </div>
                `;
            }

            html += `<td class="${cellClass}">${cellContent}</td>`;
        }

        // เติมช่องว่างท้ายตารางให้เต็มแถว
        const lastDayIndex = (firstDayIndex + daysInMonth) % 7;
        if (lastDayIndex !== 0) {
            for (let i = lastDayIndex; i < 7; i++) {
                html += `<td></td>`;
            }
        }

        html += `</tr></tbody></table>`;
        calendarContainer.innerHTML = html;
    }

    // จัดการ Dropdown เลือกเดือน
    if (monthSelector) {
        monthSelector.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === 'dec2025') generateCalendar(11, 2025);
            if (val === 'jan2026') generateCalendar(0, 2026);
            if (val === 'feb2026') generateCalendar(1, 2026);
            if (val === 'mar2026') generateCalendar(2, 2026);
        });

        // โหลดครั้งแรก (มีนาคม 2026)
        generateCalendar(2, 2026);
    }
});
