/* ==========================================
   JAVASCRIPT BEHAVIORS & LOGIC
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       1. MOBILE NAVIGATION & DRAWER TOGGLE
       ========================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu');
    const navLinks = document.getElementById('nav-links');

    if (navLinks) {
        navLinks.classList.remove('open');
    }

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('open');
        });
    }

    if (closeMenuBtn && navLinks) {
        closeMenuBtn.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    }

    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('open')) {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('open');
            }
        }
    });


    /* ==========================================
       2. SCROLL FADE-IN ANIMATION (REPEATING)
       ========================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            } else {
                entry.target.classList.remove('appear');
            }
        });
    }, observerOptions);

    function initScrollAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in-up');
        fadeElements.forEach(el => observer.observe(el));
    }

    initScrollAnimations();

    /* ==========================================
       3. PAGE INITIALIZATION & STATE RESTORATION
       ========================================== */
    const savedPage = localStorage.getItem('activePortfolioPage');
    if (savedPage) {
        switchPage(savedPage);
    } else {
        setTimeout(initScrollAnimations, 100);
    }

    renderTasks();
    setInterval(renderTasks, 60000);


    /* ==========================================
       4. TASK WIDGET & MANAGEMENT (TABLE FORMAT)
       ========================================== */
    const taskInput = document.getElementById("taskInput");
    const taskDateTime = document.getElementById("taskDateTime");
    const addTaskBtn = document.getElementById("addTaskBtn");

    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", () => {
            const taskText = taskInput.value.trim();
            const dateTimeVal = taskDateTime.value;

            if (taskText === "") {
                alert("Please enter a task description!");
                return;
            }

            function formatDateTime(dtStr) {
                const dateObj = new Date(dtStr);
                return dateObj.toLocaleString('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                });
            }

            const newTask = {
                id: Date.now(),
                text: taskText,
                rawDateTime: dateTimeVal || null,
                dateTime: dateTimeVal ? formatDateTime(dateTimeVal) : "No deadline set",
                completed: false
            };

            tasks.push(newTask);
            saveAndRenderTasks();
            taskInput.value = "";
            taskDateTime.value = "";
        });
    }


    /* ==========================================
       5. PHONE NUMBER FORMATTING INPUT
       ========================================== */
    const phoneInput = document.getElementById("phone");
    if (phoneInput) {
        phoneInput.addEventListener("input", (e) => {
            let val = e.target.value.trim();
            if (val.length > 0 && !val.startsWith('+') && /^\d/.test(val)) {
                val = '+' + val;
            }
            let cleaned = val.replace(/[^\d+]/g, '');
            
            if (cleaned.length > 1) {
                let formatted = cleaned.substring(0, 4);
                if (cleaned.length > 4) formatted += ' ' + cleaned.substring(4, 7);
                if (cleaned.length > 7) formatted += ' ' + cleaned.substring(7, 10);
                if (cleaned.length > 10) formatted += ' ' + cleaned.substring(10, 15);
                e.target.value = formatted;
            } else {
                e.target.value = cleaned;
            }
        });
    }


    /* ==========================================
       6. CONTACT FORM VALIDATION & SUBMISSION
       ========================================== */
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = phoneInput ? phoneInput.value.trim() : "";
            const message = document.getElementById("message").value.trim();

            const nameError = document.getElementById("nameError");
            const emailError = document.getElementById("emailError");
            const phoneError = document.getElementById("phoneError");
            const messageError = document.getElementById("messageError");

            if (nameError) nameError.textContent = "";
            if (emailError) emailError.textContent = "";
            if (phoneError) phoneError.textContent = "";
            if (messageError) messageError.textContent = "";

            let isValid = true;

            if (name === "") {
                if (nameError) nameError.textContent = "Name field cannot be empty.";
                isValid = false;
            }

            if (email === "") {
                if (emailError) emailError.textContent = "Email field cannot be empty.";
                isValid = false;
            } else {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email)) {
                    if (emailError) emailError.textContent = "Please enter a valid email address format.";
                    isValid = false;
                }
            }

            if (phone === "") {
                if (phoneError) phoneError.textContent = "Phone number field cannot be empty.";
                isValid = false;
            } else {
                const rawDigits = phone.replace(/\D/g, '');
                if (!phone.startsWith('+')) {
                    if (phoneError) phoneError.textContent = "Phone number must start with a country code (e.g. +234...).";
                    isValid = false;
                } else if (rawDigits.length < 11) {
                    if (phoneError) phoneError.textContent = "Please enter a complete phone number including country code.";
                    isValid = false;
                }
            }

            if (message === "") {
                if (messageError) messageError.textContent = "Message field cannot be empty.";
                isValid = false;
            }

            if (isValid) {
                if (submitBtn) {
                    submitBtn.innerHTML = `<span class="spinner"></span> Sending message...`;
                    submitBtn.disabled = true;
                }

                setTimeout(() => {
                    showPopupAlert(`Success! Thank you, ${name}. Your message has been sent.`);
                    contactForm.reset();
                    if (submitBtn) {
                        submitBtn.innerHTML = "Send Message";
                        submitBtn.disabled = false;
                    }
                }, 1000);
            }
        });
    }
});


/* ==========================================
   7. GLOBAL HELPER FUNCTIONS
   ========================================== */

function switchPage(pageId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => sec.classList.remove('active-page'));

    const targetSection = document.getElementById(pageId);
    if (targetSection) targetSection.classList.add('active-page');

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('data-target') === pageId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    localStorage.setItem('activePortfolioPage', pageId);
    
    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
        navLinks.classList.remove('open');
    }

    window.scrollTo(0, 0);

    setTimeout(() => {
        if (targetSection) {
            const fadeElements = targetSection.querySelectorAll('.fade-in-up');
            fadeElements.forEach(el => {
                if (el.getBoundingClientRect().top < window.innerHeight) {
                    el.classList.add('appear');
                }
            });
        }
    }, 50);
}


/* ==========================================
   8. TASK MANAGEMENT UTILITIES (TABLE RENDERING & DONE BADGE)
   ========================================== */
let tasks = JSON.parse(localStorage.getItem('academicTasks')) || [];

function renderTasks() {
    const taskList = document.getElementById("taskList");
    if (!taskList) return;

    taskList.innerHTML = "";
    if (tasks.length === 0) {
        taskList.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #64748b; padding: 1.5rem; background: transparent;">No academic tasks added yet.</td></tr>`;
        return;
    }

    const now = new Date();

    tasks.forEach(task => {
        const tr = document.createElement("tr");
        tr.className = `task-row ${task.completed ? "completed" : ""}`;
        
        let badgeHTML = "";
        if (task.completed) {
            badgeHTML = `<span class="done-badge">✅ DONE</span>`;
        } else if (task.rawDateTime) {
            const dueDate = new Date(task.rawDateTime);
            if (now > dueDate) {
                badgeHTML = `<span class="overdue-badge">⚠️ OVERDUE</span>`;
            } else if (dueDate - now <= 24 * 60 * 60 * 1000) {
                badgeHTML = `<span class="due-badge">🔔 DUE SOON</span>`;
            }
        }

        tr.innerHTML = `
            <td style="text-align: center;">
                <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleTask(${task.id})" style="width: 1.2rem; height: 1.2rem; cursor: pointer; accent-color: #334155;">
            </td>
            <td class="task-text-cell">${task.text}</td>
            <td class="task-meta-cell">📅 ${task.dateTime} ${badgeHTML}</td>
            <td style="text-align: center;">
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;
        taskList.appendChild(tr);
    });
}

function saveAndRenderTasks() {
    localStorage.setItem('academicTasks', JSON.stringify(tasks));
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    saveAndRenderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRenderTasks();
}


/* ==========================================
   9. POPUP NOTIFICATION ALERTS
   ========================================== */
function showPopupAlert(message) {
    const popup = document.getElementById("popupAlert");
    const popupText = document.getElementById("popupAlertText");
    if (!popup || !popupText) return;
    
    popupText.textContent = message;
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 3500);
}
