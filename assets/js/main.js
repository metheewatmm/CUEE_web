document.addEventListener('DOMContentLoaded', function () {

    // ====================================================
    // 1. Navbar Toggle (Responsive)
    // ====================================================
    const navbar = document.querySelector(".navbar");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    // ตรวจสอบว่ามีปุ่ม Toggler เดิมอยู่ไหม (Bootstrap มีให้อยู่แล้ว)
    // ถ้าใช้ Bootstrap Standard ไม่ต้องสร้างปุ่มใหม่ แค่รอ Event
    // แต่ถ้าอยาก Custom เองตามโค้ดคุณ:
    if (navbar && navbarCollapse) {
        // โค้ดส่วนนี้ Bootstrap จัดการให้แล้วผ่าน data-bs-toggle="collapse"
        // แต่ถ้าจะ Custom เพิ่มเติมใส่ตรงนี้ได้
    }

    // ====================================================
    // 2. ข้อมูลกิจกรรม (Data Source)
    // ====================================================
    // ปรับ key ให้เป็นวันที่แบบ YYYY-MM-DD เพื่อให้ mapping กับปฏิทินได้ง่าย
    const activityData = {
        '2026-01-24': {
            id: 'interview',
            title: 'สัมภาษณ์ผู้ผ่านการคัดเลือก',
            shortTitle: 'สัมภาษณ์',
            details: 'กิจกรรมสัมภาษณ์สำหรับน้องๆ ที่ผ่านการคัดเลือกในรอบแรก',
            location: 'Online/Onsite TBC',
            image: ['assets/img/cuee_info.jpg'], // ใช้รูปจริงหรือ Placeholder
            type: 'info' // ใช้กำหนดสีได้ (info, workshop, project)
        },
        '2026-03-07': {
            id: '5',
            title: 'Workshop Part 1',
            shortTitle: 'Workshop 1',
            details: 'เริ่มเรียนเนื้อหา Workshop ส่วนที่ 1: Basic Electronics',
            location: 'Lab, EE Building',
            image: ['assets/img/cuee_manu.jpg'],
            type: 'workshop'
        },
        '2026-03-08': {
            id: '6',
            title: 'Workshop Part 2',
            shortTitle: 'Workshop 2',
            details: 'เรียนเนื้อหา Workshop ส่วนที่ 2: Microcontroller',
            location: 'Lab, EE Building',
            image: ['assets/img/cuee_manu.jpg'],
            type: 'workshop'
        },
        '2026-03-14': {
            id: '7',
            title: 'Workshop Part 3',
            shortTitle: 'Workshop 3',
            details: 'เรียนเนื้อหา Workshop ส่วนที่ 3: IoT Sensors',
            location: 'Lab, EE Building',
            image: ['assets/img/cuee_manu.jpg'],
            type: 'workshop'
        },
        '2026-03-15': {
            id: '8',
            title: 'Workshop Part 4',
            shortTitle: 'Workshop 4',
            details: 'สรุปและฝึกปฏิบัติ Workshop ส่วนที่ 4: System Integration',
            location: 'Lab, EE Building',
            image: ['assets/img/cuee_manu.jpg'],
            type: 'workshop'
        },
        '2026-03-20': {
            id: '9',
            title: 'Project Development (Day 1)',
            shortTitle: 'Dev Day 1',
            details: 'เริ่มทำ Project พร้อมรับคำปรึกษาจากพี่เลี้ยง',
            location: 'Innovation Space',
            image: ['assets/img/cuee_ev.jpg'],
            type: 'project'
        },
        '2026-03-21': {
            id: '10',
            title: 'Project Development (Day 2)',
            shortTitle: 'Dev Day 2',
            details: 'พัฒนา Project ต่อเนื่องและเตรียมนำเสนอผลงาน',
            location: 'Innovation Space',
            image: ['assets/img/cuee_ev.jpg'],
            type: 'project'
        },
        '2026-03-22': {
            id: '11',
            title: 'Final Presentation & Closing',
            shortTitle: 'Final & Closing',
            details: 'นำเสนอผลงาน Project ต่อคณะกรรมการและพิธีปิดแคมป์',
            location: 'Main Auditorium',
            image: ['assets/img/cuee_register.jpg'],
            type: 'event'
        }
    };

    // ====================================================
    // 3. จัดการ Table List ด้านบน (Expedition Log)
    // ====================================================
    const scheduleBody = document.getElementById('scheduleBody');
    const dayDetailCard = document.getElementById('dayDetailCard');
    const tableRows = scheduleBody ? scheduleBody.getElementsByTagName('tr') : [];
    let activeRow = null;
    let hideTimeout;

    // Helper: สร้าง Carousel HTML
    function createCarouselHtml(images, id) {
        if (!images || images.length === 0) return '';

        const carouselId = `carousel-${id}`;
        let indicators = '';
        let items = '';

        images.forEach((img, idx) => {
            const activeClass = idx === 0 ? 'active' : '';
            indicators += `<button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${idx}" class="${activeClass}"></button>`;
            items += `<div class="carousel-item ${activeClass}"><img src="${img}" class="d-block w-100 rounded" style="height:200px; object-fit:cover;"></div>`;
        });

        // ถ้ามีรูปเดียว ไม่ต้องโชว์ปุ่มเลื่อน
        const controls = images.length > 1 ? `
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button>
            <div class="carousel-indicators">${indicators}</div>
        ` : '';

        return `<div id="${carouselId}" class="carousel slide mb-3" data-bs-ride="carousel"><div class="carousel-inner">${items}</div>${controls}</div>`;
    }

    // Function: Show Detail Card
    function showDetail(dateKey, rowElement) {
        const data = activityData[dateKey];
        if (!data) return;

        // Highlight Row
        if (activeRow) activeRow.classList.remove('is-active');
        rowElement.classList.add('is-active');
        activeRow = rowElement;

        // Create Content
        const content = `
            <h5 class="fw-bold" style="color: var(--maya-brown-red);">${data.title}</h5>
            ${createCarouselHtml(data.image, data.id)}
            <p>${data.details}</p>
            <small class="text-muted"><i class="bi bi-geo-alt-fill"></i> ${data.location}</small>
        `;

        // Inject & Show
        const cardBody = dayDetailCard.querySelector('.card-body');
        cardBody.innerHTML = content;
        dayDetailCard.style.display = 'block';

        // Trigger Reflow for animation
        void dayDetailCard.offsetWidth;
        dayDetailCard.classList.add('is-visible');

        // Init Carousel
        const carouselEl = document.getElementById(`carousel-${data.id}`);
        if (carouselEl && window.bootstrap) {
            new bootstrap.Carousel(carouselEl);
        }
    }

    // Function: Hide Detail
    function hideDetail() {
        dayDetailCard.classList.remove('is-visible');
        if (activeRow) {
            activeRow.classList.remove('is-active');
            activeRow = null;
        }
        setTimeout(() => {
            if (!dayDetailCard.classList.contains('is-visible')) {
                dayDetailCard.style.display = 'none';
            }
        }, 400);
    }

    // Bind Events to Table Rows
    // (Mapping row index -> dateKey ต้องทำ manual หรือใส่ data-date ที่ tr)
    // เพื่อความง่าย ผมจะสมมติว่าคุณไปแก้ HTML ให้ใส่ data-date="2026-01-24" ใน <tr> แล้ว
    // ถ้ายังไม่ได้แก้ ให้ใช้ Logic เดิม mapping ID เอา

    // ✅ แนะนำ: ไปเพิ่ม data-date="YYYY-MM-DD" ในไฟล์ HTML ตรง <tr> จะชัวร์สุด
    // ตัวอย่าง: <tr data-date="2026-03-07">...</tr>

    Array.from(tableRows).forEach(row => {
        row.addEventListener('click', (e) => {
            e.stopPropagation();
            // ลองหา data-date ก่อน ถ้าไม่มีให้ใช้ data-day map เอา (Fallback)
            let dateKey = row.getAttribute('data-date');

            // Logic map data-day เก่า -> dateKey (เฉพาะกิจ)
            if (!dateKey) {
                const dayId = row.getAttribute('data-day');
                // Map manual (ไม่แนะนำในระยะยาว)
                if (dayId === 'interview') dateKey = '2026-01-24';
                if (dayId === '5') dateKey = '2026-03-07';
                if (dayId === '6') dateKey = '2026-03-08';
                if (dayId === '7') dateKey = '2026-03-14';
                if (dayId === '8') dateKey = '2026-03-15';
                if (dayId === '9') dateKey = '2026-03-20';
                if (dayId === '10') dateKey = '2026-03-21';
                if (dayId === '11') dateKey = '2026-03-22';
            }

            if (activeRow === row) {
                hideDetail();
            } else {
                showDetail(dateKey, row);
            }
        });
    });

    // Close when click outside
    document.addEventListener('click', (e) => {
        if (!dayDetailCard.contains(e.target) && (!activeRow || !activeRow.contains(e.target))) {
            hideDetail();
        }
    });


    // ====================================================
    // 4. Smart Calendar Generator
    // ====================================================
    const calendarContainer = document.getElementById('calendarContainer');
    const monthSelector = document.getElementById('monthSelector');

    function generateCalendar(monthIndex, year) {
        // monthIndex: 0=Jan, 1=Feb, ...
        const date = new Date(year, monthIndex, 1);
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const firstDayIndex = date.getDay(); // 0=Sun

        // Month Names in Thai
        const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

        let html = `
            <div class="text-center mb-3">
                <h4 class="fw-bold" style="color:var(--maya-cream)">${monthNames[monthIndex]} ${year + 543}</h4>
            </div>
            <table class="calendar-table">
                <thead>
                    <tr>
                        <th>อา</th><th>จ</th><th>อ</th><th>พ</th><th>พฤ</th><th>ศ</th><th>ส</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
        `;

        // Empty cells for days before start of month
        for (let i = 0; i < firstDayIndex; i++) {
            html += `<td class="empty"></td>`;
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            // Check newline (Saturday)
            if ((firstDayIndex + day - 1) % 7 === 0 && day !== 1) {
                html += `</tr><tr>`;
            }

            // Create Date Key
            const currentMonthStr = (monthIndex + 1).toString().padStart(2, '0');
            const currentDayStr = day.toString().padStart(2, '0');
            const dateKey = `${year}-${currentMonthStr}-${currentDayStr}`;

            // Check Activity
            const activity = activityData[dateKey];
            let cellContent = `<span class="day-number">${day}</span>`;
            let cellClass = '';

            if (activity) {
                cellClass = 'event-day';
                // ✅ เพิ่มชื่อกิจกรรมลงไปในช่องวัน
                cellContent += `
                    <div class="event-label">
                        ${activity.shortTitle}
                    </div>
                `;
            }

            html += `<td class="${cellClass}" onclick="alert('${activity ? activity.title : 'ไม่มีกิจกรรม'}')">${cellContent}</td>`;
        }

        // Fill remaining cells
        const lastDayIndex = (firstDayIndex + daysInMonth) % 7;
        if (lastDayIndex !== 0) {
            for (let i = lastDayIndex; i < 7; i++) {
                html += `<td class="empty"></td>`;
            }
        }

        html += `</tr></tbody></table>`;
        calendarContainer.innerHTML = html;
    }

    // Handle Selector Change
    if (monthSelector) {
        monthSelector.addEventListener('change', (e) => {
            const val = e.target.value; // ex: "mar2026"
            // Simple mapping logic
            if (val === 'dec2025') generateCalendar(11, 2025);
            if (val === 'jan2026') generateCalendar(0, 2026);
            if (val === 'feb2026') generateCalendar(1, 2026);
            if (val === 'mar2026') generateCalendar(2, 2026);
        });

        // Initial Render (Mar 2026)
        generateCalendar(2, 2026);
        monthSelector.value = "mar2026";
    }

});

