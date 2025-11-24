// Main JavaScript file for Exxo Move website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initAnimations();
    initPricingCalculator();
    initGallery();
    initTestimonials();
    initFAQ();
    initContactForms();
    initModals();
    initScrollEffects();
    
    // Analytics hooks (example)
    initAnalytics();
});

// Navigation functionality
function initNavigation() {
    const header = document.getElementById('header');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // Sticky header on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('bg-white', 'shadow-lg');
        } else {
            header.classList.remove('bg-white', 'shadow-lg');
        }
    });
    
    // Mobile menu toggle
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                
                // Scroll to target
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animation on scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Special handling for progress line
                if (entry.target.id === 'how-it-works') {
                    animateProgressLine();
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with animate-enter class
    document.querySelectorAll('.animate-enter').forEach(el => {
        observer.observe(el);
    });
}

// Animate progress line in how-it-works section
function animateProgressLine() {
    const progressLine = document.getElementById('progress-line');
    if (progressLine) {
        setTimeout(() => {
            progressLine.style.width = '100%';
        }, 500);
    }
}

// Pricing calculator functionality
function initPricingCalculator() {
    const roomsSelect = document.getElementById('rooms');
    const distanceSlider = document.getElementById('distance');
    const distanceValue = document.getElementById('distance-value');
    const checkboxes = document.querySelectorAll('#pricing-calculator input[type="checkbox"]');
    const estimatedPrice = document.getElementById('estimated-price');
    const pricingCalculatorBtn = document.getElementById('pricing-calculator-btn');
    
    // Update distance value display
    if (distanceSlider && distanceValue) {
        distanceSlider.addEventListener('input', function() {
            distanceValue.textContent = this.value + ' كم';
            calculatePrice();
        });
    }
    
    // Calculate price when any input changes
    if (roomsSelect) {
        roomsSelect.addEventListener('change', calculatePrice);
    }
    
    if (checkboxes) {
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', calculatePrice);
        });
    }
    
    // Scroll to pricing section when calculator button is clicked
    if (pricingCalculatorBtn) {
        pricingCalculatorBtn.addEventListener('click', function() {
            const pricingSection = document.getElementById('pricing');
            if (pricingSection) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = pricingSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Calculate estimated price
    function calculatePrice() {
        let basePrice = 0;
        
        // Base price based on number of rooms
        if (roomsSelect) {
            const roomCount = parseInt(roomsSelect.value);
            basePrice = 100 + (roomCount * 50);
        }
        
        // Add distance cost
        if (distanceSlider) {
            const distance = parseInt(distanceSlider.value);
            basePrice += Math.max(0, (distance - 10) * 5); // 5 SAR per km after 10km
        }
        
        // Add additional services cost
        let additionalCost = 0;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                additionalCost += parseInt(checkbox.value);
            }
        });
        
        const totalPrice = basePrice + additionalCost;
        
        // Update displayed price
        if (estimatedPrice) {
            estimatedPrice.textContent = totalPrice + ' ريال';
        }
    }
    
    // Initialize price calculation
    calculatePrice();
}

// Gallery functionality
function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const loadMoreButton = document.getElementById('load-more-gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.getElementById('close-lightbox');
    
    // Sample gallery data (in a real app, this would come from an API)
    const galleryItems = [
        { id: 1, src: 'images/gallery-1.webp', alt: 'فريق اكزو موف يقوم بتغليف العفش' },
        { id: 2, src: 'images/gallery-2.webp', alt: 'شاحنة اكزو موف لنقل العفش' },
        { id: 3, src: 'images/gallery-3.webp', alt: 'تغليف احترافي للأثاث' },
        { id: 4, src: 'images/gallery-4.webp', alt: 'نقل عفش داخل جدة' },
        { id: 5, src: 'images/gallery-5.webp', alt: 'فك وتركيب الأثاث' },
        { id: 6, src: 'images/gallery-6.webp', alt: 'تخزين عفش في مستودعات اكزو موف' }
    ];
    
    let displayedItems = 3;
    
    // Render gallery items
    function renderGallery(itemsToShow) {
        if (!galleryGrid) return;
        
        galleryGrid.innerHTML = '';
        
        const items = itemsToShow ? galleryItems.slice(0, itemsToShow) : galleryItems;
        
        items.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'relative overflow-hidden rounded-lg cursor-pointer group';
            galleryItem.innerHTML = `
                <img src="${item.src}" alt="${item.alt}" class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <svg class="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            `;
            
            galleryItem.addEventListener('click', function() {
                openLightbox(item.src, item.alt);
            });
            
            galleryGrid.appendChild(galleryItem);
        });
        
        // Show/hide load more button
        if (loadMoreButton) {
            if (itemsToShow && itemsToShow < galleryItems.length) {
                loadMoreButton.style.display = 'block';
            } else {
                loadMoreButton.style.display = 'none';
            }
        }
    }
    
    // Open lightbox
    function openLightbox(src, alt) {
        if (lightbox && lightboxImg) {
            lightboxImg.src = src;
            lightboxImg.alt = alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }
    
    // Close lightbox
    function closeLightboxFunc() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
    
    // Event listeners
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            displayedItems += 3;
            renderGallery(displayedItems);
        });
    }
    
    if (closeLightbox) {
        closeLightbox.addEventListener('click', closeLightboxFunc);
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightboxFunc();
            }
        });
    }
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightboxFunc();
        }
    });
    
    // Initial render
    renderGallery(displayedItems);
}

// Testimonials functionality
function initTestimonials() {
    const testimonialsContainer = document.getElementById('testimonials-container');
    
    if (!testimonialsContainer) return;
    
    // Sample testimonials data
    const testimonials = [
        {
            name: 'أحمد السيد',
            location: 'جدة',
            rating: 5,
            text: 'خدمة سريعة ومحترفة — وصلت الأثاث بلا خدش! فريق العمل كان متعاوناً جداً وأنهى العمل في الوقت المحدد.'
        },
        {
            name: 'فاطمة العتيبي',
            location: 'جدة',
            rating: 5,
            text: 'تجربة رائعة مع اكزو موف. التغليف كان ممتازاً والأسعار معقولة. أنصح بالتعامل معهم لنقل العفش.'
        },
        {
            name: 'محمد الغامدي',
            location: 'جدة',
            rating: 4,
            text: 'خدمة جيدة وسريعة. فريق العمل محترف والأسعار مناسبة. شكراً اكزو موف على الخدمة المميزة.'
        }
    ];
    
    // Render testimonials
    testimonials.forEach(testimonial => {
        const testimonialElement = document.createElement('div');
        testimonialElement.className = 'bg-white rounded-xl shadow-md p-6';
        
        // Generate star rating
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= testimonial.rating) {
                stars += '<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>';
            } else {
                stars += '<svg class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>';
            }
        }
        
        testimonialElement.innerHTML = `
            <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary font-bold ml-3">
                    ${testimonial.name.charAt(0)}
                </div>
                <div>
                    <h4 class="font-bold text-dark">${testimonial.name}</h4>
                    <p class="text-gray-600 text-sm">${testimonial.location}</p>
                </div>
            </div>
            <div class="flex mb-3">
                ${stars}
            </div>
            <p class="text-gray-600">${testimonial.text}</p>
        `;
        
        testimonialsContainer.appendChild(testimonialElement);
    });
}

// FAQ functionality
function initFAQ() {
    const faqContainer = document.getElementById('faq-container');
    
    if (!faqContainer) return;
    
    // Sample FAQ data
    const faqs = [
        {
            question: 'كم تستغرق عملية نقل العفش؟',
            answer: 'تعتمد مدة النقل على حجم العفش والمسافة. بشكل عام، تستغرق عملية نقل شقة 3 غرف من 4 إلى 6 ساعات.'
        },
        {
            question: 'هل توفرون خدمة التغليف؟',
            answer: 'نعم، نوفر خدمة تغليف احترافية بمواد عالية الجودة لحماية أثاثك أثناء النقل.'
        },
        {
            question: 'ما هي مناطق الخدمة التي تغطونها؟',
            answer: 'نغطي جميع أحياء جدة، كما نقدم خدمة النقل بين المدن السعودية.'
        },
        {
            question: 'هل أسعاركم تشمل الضريبة؟',
            answer: 'نعم، جميع الأسعار المعلنة تشمل ضريبة القيمة المضافة.'
        },
        {
            question: 'كيف يمكنني حجز موعد للنقل؟',
            answer: 'يمكنك حجز موعد عبر الاتصال بنا على الرقم الموجود في الموقع أو عبر نموذج الاتصال.'
        }
    ];
    
    // Render FAQs
    faqs.forEach((faq, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'border border-gray-200 rounded-lg';
        
        const faqId = `faq-${index}`;
        
        faqItem.innerHTML = `
            <button class="w-full text-right p-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-lg" aria-expanded="false" aria-controls="${faqId}-answer">
                <span class="font-medium text-dark">${faq.question}</span>
                <svg class="w-5 h-5 text-gray-500 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div id="${faqId}-answer" class="hidden px-4 pb-4 text-gray-600">
                ${faq.answer}
            </div>
        `;
        
        const button = faqItem.querySelector('button');
        const answer = faqItem.querySelector(`#${faqId}-answer`);
        
        button.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle answer visibility
            if (isExpanded) {
                answer.classList.add('hidden');
                this.querySelector('svg').style.transform = 'rotate(0deg)';
            } else {
                answer.classList.remove('hidden');
                this.querySelector('svg').style.transform = 'rotate(180deg)';
            }
        });
        
        // Keyboard accessibility
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        faqContainer.appendChild(faqItem);
    });
}

// Contact forms functionality
function initContactForms() {
    const contactForm = document.getElementById('contact-form');
    const modalForm = document.getElementById('modal-form');
    
    // Validate and submit contact form
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                submitForm(this, 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
            }
        });
    }
    
    // Validate and submit modal form
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                submitForm(this, 'تم إرسال طلبك بنجاح! سنتواصل معك خلال 24 ساعة.');
                closeModal();
            }
        });
    }
    
    // Service order buttons
    document.querySelectorAll('.service-order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            openModal(service);
        });
    });
    
    // Request quote button
    const requestQuoteBtn = document.getElementById('request-quote');
    if (requestQuoteBtn) {
        requestQuoteBtn.addEventListener('click', function() {
            openModal('طلب عرض سعر');
        });
    }
}

// Form validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500');
            
            // Remove error class when user starts typing
            input.addEventListener('input', function() {
                this.classList.remove('border-red-500');
            });
        } else {
            input.classList.remove('border-red-500');
        }
    });
    
    return isValid;
}

// Form submission
function submitForm(form, successMessage) {
    // In a real application, you would send the form data to a server
    // For this example, we'll just show a success message
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Log form data (in a real app, send to backend)
    console.log('Form submitted:', data);
    
    // Push to dataLayer for analytics (if available)
    if (window.dataLayer) {
        window.dataLayer.push({
            'event': 'form_submit',
            'form_type': form.id,
            'form_data': data
        });
    }
    
    // Show success message
    showToast(successMessage);
    
    // Reset form
    form.reset();
}

// Modal functionality
function initModals() {
    const contactModal = document.getElementById('contact-modal');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal');
    
    // Open modal function
    window.openModal = function(service = '') {
        if (contactModal && modalContent) {
            contactModal.classList.remove('hidden');
            
            // Set service if provided
            if (service && document.getElementById('modal-service')) {
                document.getElementById('modal-service').value = service;
            }
            
            // Focus trap
            trapFocus(modalContent);
            
            // Animate modal
            setTimeout(() => {
                modalContent.classList.remove('scale-95');
                modalContent.classList.add('scale-100');
            }, 10);
        }
    };
    
    // Close modal function
    window.closeModal = function() {
        if (contactModal && modalContent) {
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
            
            setTimeout(() => {
                contactModal.classList.add('hidden');
            }, 300);
        }
    };
    
    // Close modal events
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (contactModal) {
        contactModal.addEventListener('click', function(e) {
            if (e.target === contactModal) {
                closeModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && contactModal && !contactModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Focus trap for modals
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        firstElement.focus();
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.remove('translate-y-16');
        
        setTimeout(() => {
            toast.classList.add('translate-y-16');
        }, 3000);
    }
}

// Scroll effects
function initScrollEffects() {
    // Add shadow to header on scroll
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 10) {
            header.classList.add('shadow-md');
        } else {
            header.classList.remove('shadow-md');
        }
    });
}

// Analytics hooks
function initAnalytics() {
    // Track CTA clicks
    document.querySelectorAll('a[href*="wa.me"], a[href*="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            if (window.dataLayer) {
                window.dataLayer.push({
                    'event': 'cta_click',
                    'cta_type': this.href.includes('wa.me') ? 'whatsapp' : 'phone',
                    'cta_location': this.closest('section') ? this.closest('section').id : 'unknown'
                });
            }
        });
    });
    
    // Track form interactions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            if (window.dataLayer) {
                window.dataLayer.push({
                    'event': 'form_submit',
                    'form_id': this.id,
                    'form_type': this.id.includes('contact') ? 'contact' : 'service_request'
                });
            }
        });
    });
}

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}