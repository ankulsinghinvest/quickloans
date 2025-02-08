document.addEventListener('DOMContentLoaded', () => {
    // Navigation handling
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // Populate loan cards
    const loanContainer = document.getElementById('loan-cards');
    loans.forEach(loan => {
        loanContainer.innerHTML += `
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-xl font-semibold mb-2">${loan.title}</h3>
                <p class="text-gray-600 mb-2">Amount: ${loan.amount}</p>
                <p class="text-gray-600 mb-2">Duration: ${loan.duration}</p>
                <p class="text-blue-600 font-semibold">Interest: ${loan.interest}</p>
                <p class="mt-4 text-gray-600">${loan.description}</p>
                <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Apply Now
                </button>
            </div>
        `;
    });

    // Populate investment cards
    const investmentContainer = document.getElementById('investment-cards');
    investments.forEach(investment => {
        investmentContainer.innerHTML += `
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-xl font-semibold mb-2">${investment.title}</h3>
                <p class="text-green-600 font-semibold mb-2">Returns: ${investment.returns}</p>
                <p class="text-gray-600 mb-2">Duration: ${investment.duration}</p>
                <p class="text-gray-600 mb-2">Minimum: ${investment.minimum}</p>
                <p class="mt-4 text-gray-600">${investment.description}</p>
                <button class="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Invest Now
                </button>
            </div>
        `;
    });

    // Show initial section
    showSection('dashboard');

    // Mobile navigation initialization
    initMobileNav();
    
    // Add animation classes to elements
    document.querySelectorAll('.card, .section-title').forEach(element => {
        element.classList.add('animate-on-scroll');
    });
    
    // Initialize animations
    animateOnScroll();
    
    // Handle mobile menu visibility on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down - hide menu
            mobileMenu.classList.remove('active');
        } else {
            // Scrolling up - show menu
            mobileMenu.classList.add('active');
        }
        lastScroll = currentScroll;
    });

    // Bottom navigation handling
    initNavigation();

    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Prevent rubber-banding on iOS
    document.body.addEventListener('touchmove', function(e) {
        if (e.target.closest('.scrollable') === null) {
            e.preventDefault();
        }
    }, { passive: false });

    // Add form submit handlers
    document.querySelector('#loginForm button').addEventListener('click', handleLogin);
    document.querySelector('#signupForm button').addEventListener('click', handleSignup);
    
    // Add sign out handler
    document.querySelector('button:contains("Sign Out")').addEventListener('click', () => {
        isUserAuthenticated = false;
        navigateToSection('home');
        updateNavigationState(
            document.querySelector('a[href="#home"]'),
            document.querySelectorAll('.bottom-nav-item'),
            document.getElementById('nav-indicator')
        );
    });

    // Add this to your existing JavaScript
    function handleResize() {
        const navIndicator = document.getElementById('nav-indicator');
        const activeItem = document.querySelector('.bottom-nav-item.active');
        if (activeItem && navIndicator) {
            updateNavigationState(activeItem, document.querySelectorAll('.bottom-nav-item'), navIndicator);
        }
    }

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Update the createRippleEffect function
    function createRippleEffect(e, item) {
        const ripple = document.createElement('span');
        ripple.className = 'nav-ripple';
        const rect = item.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size * 2}px`; // Doubled size for better effect
        
        // Calculate position relative to touch or click
        const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const y = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        ripple.style.left = `${x - rect.left - size}px`;
        ripple.style.top = `${y - rect.top - size}px`;
        
        item.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    // Add touch event listeners
    const navItems = document.querySelectorAll('.bottom-nav-item');
    navItems.forEach(item => {
        item.addEventListener('touchstart', createRippleEffect);
    });

    // Initialize loans section
    initLoansSection();

    // Add click handlers for loan buttons
    document.querySelectorAll('#instant-loans button, #personal-loans button').forEach(button => {
        button.addEventListener('click', (e) => {
            const loanType = e.target.closest('[data-loan-type]')?.dataset.loanType;
            const amount = e.target.closest('[data-loan-amount]')?.dataset.loanAmount;
            handleLoanApplication(loanType, amount);
        });
    });

    // Update the HTML onclick handlers to include loan type
    function updateManageFundsLinks() {
        const manageFundsItems = {
            'instant-loan': document.querySelector('[data-fund-type="instant-loan"]'),
            'personal-loan': document.querySelector('[data-fund-type="personal-loan"]'),
            'education-loan': document.querySelector('[data-fund-type="education-loan"]')
        };

        for (const [type, element] of Object.entries(manageFundsItems)) {
            if (element) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigateToSection('loans', type);
                });
            }
        }
    }

    // Add to your DOMContentLoaded event listener
    updateManageFundsLinks();
});

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Update active navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('text-blue-600');
        if(link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-blue-600');
        }
    });

    // Add animation to the newly shown section
    const section = document.getElementById(sectionId);
    section.classList.add('slide-in');
    
    // Remove animation class after it completes
    setTimeout(() => {
        section.classList.remove('slide-in');
    }, 300);
}

function calculateReturns() {
    const amount = parseFloat(document.getElementById('investment-amount').value);
    const duration = parseFloat(document.getElementById('investment-duration').value);
    const annualReturn = 0.12; // 12%
    
    if(amount && duration) {
        const returns = amount * annualReturn * (duration / 12);
        document.getElementById('returns-amount').textContent = returns.toFixed(2);
        document.getElementById('calculation-result').classList.remove('hidden');
    }
}

// Mobile navigation
function initMobileNav() {
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    mobileNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'nav-ripple';
            const rect = item.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            item.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
            
            // Remove active state from all items
            mobileNavItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active state to clicked item
            item.classList.add('active');
            
            // Handle navigation
            const href = item.getAttribute('href').substring(1);
            showSection(href);
        });
    });

    // Handle system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.classList.toggle('dark', e.matches);
            updateThemeButton(e.matches);
        }
    });
}

// Animation handlers
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    });
    
    elements.forEach(element => observer.observe(element));
}

// Bottom navigation handling
function initNavigation() {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    const navIndicator = document.getElementById('nav-indicator');

    navItems.forEach(item => {
        ['click', 'touchend'].forEach(eventType => {
            item.addEventListener(eventType, (e) => {
                e.preventDefault();
                if (eventType === 'touchend') {
                    // Prevent ghost click
                    e.stopPropagation();
                }
                
                const targetId = item.getAttribute('href').substring(1);
                navigateToSection(targetId);
                
                // Update active state
                navItems.forEach(navItem => {
                    navItem.classList.remove('active');
                    navItem.classList.add('text-gray-400');
                });
                item.classList.add('active');
                item.classList.remove('text-gray-400');
                
                // Update indicator
                updateNavigationIndicator();
            }, { passive: false });
        });
    });
}

function updateNavigationState(activeItem, allItems, indicator) {
    allItems.forEach(item => {
        item.classList.remove('active');
        item.classList.add('text-gray-400');
    });
    
    activeItem.classList.add('active');
    activeItem.classList.remove('text-gray-400');
    
    // Update indicator position
    const itemRect = activeItem.getBoundingClientRect();
    const parentRect = activeItem.parentElement.getBoundingClientRect();
    const newPosition = itemRect.left - parentRect.left + (itemRect.width / 2) - 3;
    
    indicator.style.transition = 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    indicator.style.left = `${newPosition}px`;
}

function navigateToSection(sectionId, loanType = null) {
    console.log('Navigating to:', sectionId, 'Loan type:', loanType);
    
    // Check if user is authenticated for protected routes
    if (['profile', 'invest', 'loans'].includes(sectionId) && !auth.currentUser) {
        showAuthPage();
        showToast('Please sign in to continue', 'error');
        return;
    }
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.add('hidden'));
    
    // Show target page
    const targetPage = document.getElementById(sectionId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        
        // Handle loan section navigation
        if (sectionId === 'loans') {
            initLoansSection();
            if (loanType) {
                setTimeout(() => {
                    const targetSection = document.getElementById(`${loanType}-section`);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        }
        
        // Update bottom navigation active state
        if (['home', 'invest', 'loans', 'profile'].includes(sectionId)) {
            updateBottomNavigation(sectionId);
        }
    }
}

function updateNavigationIndicator() {
    const navIndicator = document.getElementById('nav-indicator');
    const activeItem = document.querySelector('.bottom-nav-item.active');
    
    if (navIndicator && activeItem) {
        const parentRect = activeItem.parentElement.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        navIndicator.style.left = `${itemRect.left - parentRect.left + (itemRect.width / 2) - 3}px`;
    }
}

function initManageFundsLinks() {
    const items = document.querySelectorAll('[data-fund-type]');
    items.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const fundType = item.getAttribute('data-fund-type');
            if (fundType === 'invest') {
                navigateToSection('invest');
            } else {
                navigateToSection('loans', fundType);
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initManageFundsLinks();
    
    // Check auth state and show appropriate screen
    const currentUser = auth.currentUser;
    if (!currentUser) {
        showAuthPage();
    } else {
        navigateToSection('home');
    }
    
    // Add auth state listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            console.log('User signed in:', user);
            hideAuthPage();
            updateUserProfile(user);
            
            // Update UI elements that show user info
            const userElements = document.querySelectorAll('.user-name');
            userElements.forEach(el => {
                el.textContent = user.displayName || 'User';
            });
            
            const userImages = document.querySelectorAll('.user-image');
            userImages.forEach(img => {
                img.src = user.photoURL || 'default-profile.jpg';
            });
        } else {
            // User is signed out
            console.log('User signed out');
            showAuthPage();
        }
    });
});

// Handle browser back/forward
window.addEventListener('popstate', () => {
    const currentHash = window.location.hash.substring(1) || 'home';
    navigateToSection(currentHash);
});

// Auth page handling
function showAuthPage() {
    const authPage = document.getElementById('authPage');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    // Reset forms
    loginForm.querySelector('input[type="email"]').value = '';
    loginForm.querySelector('input[type="password"]').value = '';
    if (signupForm) {
        signupForm.querySelector('input[type="text"]').value = '';
        signupForm.querySelector('input[type="email"]').value = '';
        signupForm.querySelector('input[type="password"]').value = '';
    }
    
    // Show login form by default
    loginForm.classList.remove('hidden');
    if (signupForm) {
        signupForm.classList.add('hidden');
    }
    
    // Show auth page
    authPage.classList.remove('hidden');
    authPage.classList.add('page-enter');
    requestAnimationFrame(() => {
        authPage.classList.add('page-enter-active');
    });
}

function hideAuthPage() {
    const authPage = document.getElementById('authPage');
    authPage.classList.add('page-exit');
    setTimeout(() => {
        authPage.classList.add('hidden');
        authPage.classList.remove('page-exit', 'page-enter', 'page-enter-active');
    }, 300);
}

function toggleAuthForm(type) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (type === 'signup') {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    } else {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
}

function redirectToProfile() {
    hideAuthPage();
    // Logic to redirect to the profile page after authentication
}

// Initialize authentication state as false
let isUserAuthenticated = false;

function isAuthenticated() {
    return isUserAuthenticated;
}

async function handleLogin(e) {
    e.preventDefault();
    const emailInput = document.querySelector('#loginForm input[type="email"]');
    const passwordInput = document.querySelector('#loginForm input[type="password"]');
    const loginButton = document.querySelector('#loginForm button');
    
    if (!emailInput.value || !passwordInput.value) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    try {
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing In...';
        
        const userCredential = await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
        const user = userCredential.user;

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Update last login
            await setDoc(doc(db, 'users', user.uid), {
                ...userData,
                lastLogin: new Date().toISOString()
            });

            // Update UI with user data
            updateUIWithUserData(userData);
        }
        
        // Handle successful login
        hideAuthPage();
        navigateToSection('home');
        updateUserProfile(user);
        showToast('Successfully signed in!', 'success');
        
        // Clear form
        emailInput.value = '';
        passwordInput.value = '';
    } catch (error) {
        console.error('Login error:', error);
        showToast(getAuthErrorMessage(error.code), 'error');
    } finally {
        loginButton.disabled = false;
        loginButton.innerHTML = 'Sign In';
    }
}

async function handleSignup(e) {
    e.preventDefault();
    console.log('Starting signup process...'); // Debug log
    
    const nameInput = document.querySelector('#signupForm input[type="text"]');
    const emailInput = document.querySelector('#signupForm input[type="email"]');
    const passwordInput = document.querySelector('#signupForm input[type="password"]');
    const signupButton = document.querySelector('#signupForm button');
    
    // Log input values (remove in production)
    console.log('Name:', nameInput?.value);
    console.log('Email:', emailInput?.value);
    console.log('Password length:', passwordInput?.value?.length);
    
    if (!nameInput?.value || !emailInput?.value || !passwordInput?.value) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    try {
        signupButton.disabled = true;
        signupButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating Account...';
        
        console.log('Creating user in Firebase Auth...'); // Debug log
        const userCredential = await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
        const user = userCredential.user;
        console.log('User created:', user); // Debug log
        
        // Update profile with name
        console.log('Updating profile...'); // Debug log
        await updateProfile(user, {
            displayName: nameInput.value
        });
        
        // Store additional user data in Firestore
        const userData = {
            uid: user.uid,
            displayName: nameInput.value,
            email: user.email,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            balance: 0,
            investments: [],
            loans: [],
            transactions: []
        };
        
        console.log('Saving to Firestore...'); // Debug log
        await setDoc(doc(db, 'users', user.uid), userData);
        
        // Handle successful signup
        hideAuthPage();
        navigateToSection('home');
        updateUserProfile(user);
        showToast('Account created successfully!', 'success');
        
        // Clear form
        nameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
    } catch (error) {
        console.error('Signup error:', error);
        showToast(getAuthErrorMessage(error.code), 'error');
    } finally {
        signupButton.disabled = false;
        signupButton.innerHTML = 'Create Account';
    }
}

// Add this function for indicator initialization
function initializeIndicatorPosition(navIndicator) {
    const activeItem = document.querySelector('.bottom-nav-item.active');
    if (activeItem && navIndicator) {
        const itemRect = activeItem.getBoundingClientRect();
        const parentRect = activeItem.parentElement.getBoundingClientRect();
        navIndicator.style.transition = 'none';
        navIndicator.style.left = `${itemRect.left - parentRect.left + (itemRect.width / 2) - 3}px`;
        
        // Force reflow
        navIndicator.offsetHeight;
        
        navIndicator.style.transition = '';
    }
}

function handleSignOut() {
    signOut(auth)
        .then(() => {
            navigateToSection('home');
            updateNavigationState(
                document.querySelector('a[href="#home"]'),
                document.querySelectorAll('.bottom-nav-item'),
                document.getElementById('nav-indicator')
            );
            showToast('Signed out successfully', 'success');
        })
        .catch((error) => {
            console.error('Sign out error:', error);
            showToast('Error signing out', 'error');
        });
}

// Add these helper functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-20 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg z-50 ${
        type === 'success' ? 'bg-[#10B981]' : 'bg-red-500'
    } text-white`;
    toast.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function getAuthErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered',
        'auth/invalid-email': 'Invalid email address',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'Email or password is incorrect',
        'auth/wrong-password': 'Email or password is incorrect',
        'auth/popup-closed-by-user': 'Sign in cancelled',
        'auth/popup-blocked': 'Please allow popups for this website',
        'auth/cancelled-popup-request': 'Sign in cancelled',
        'auth/account-exists-with-different-credential': 
            'An account already exists with this email. Try signing in with a different method.',
        'auth/unauthorized-domain': 'This domain is not authorized. Please contact support.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/internal-error': 'An internal error occurred. Please try again.',
        'auth/invalid-credential': 'Invalid credentials. Please try again.',
    };
    
    return errorMessages[errorCode] || `Authentication error: ${errorCode}`;
}

// Add this function to handle loans initialization
function initLoansSection() {
    console.log('Initializing loans section'); // Debug log
    
    // Populate instant loans
    const instantLoansContainer = document.querySelector('#instant-loans');
    if (instantLoansContainer) {
        console.log('Found instant loans container'); // Debug log
        instantLoansContainer.innerHTML = ''; // Clear existing content
        instantLoans.forEach(loan => {
            instantLoansContainer.innerHTML += `
                <div class="bg-gradient-to-br ${loan.color} rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-3xl font-bold mb-1">₹${loan.amount}</h3>
                            <p class="text-sm text-white/80">Quick Approval</p>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <i class="fas fa-bolt text-white"></i>
                        </div>
                    </div>
                    <div class="space-y-3 mt-6">
                        <div class="flex justify-between text-sm">
                            <span class="text-white/80">Duration</span>
                            <span class="font-medium text-white">${loan.duration}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-white/80">Interest</span>
                            <span class="font-medium text-white">${loan.interest}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-white/80">Monthly Payment</span>
                            <span class="font-medium text-white">${loan.monthlyPayment}</span>
                        </div>
                    </div>
                    <button onclick="handleLoanApplication('instant', '${loan.amount}')" 
                            class="w-full bg-white/20 hover:bg-white/30 py-3.5 rounded-xl mt-6 font-medium 
                            transition-all active:scale-95 flex items-center justify-center gap-2">
                        <span>Apply Now</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
        });
    } else {
        console.error('Instant loans container not found'); // Debug log
    }

    // Populate personal loans
    const personalLoansContainer = document.querySelector('#personal-loans');
    if (personalLoansContainer) {
        console.log('Found personal loans container'); // Debug log
        personalLoansContainer.innerHTML = ''; // Clear existing content
        personalLoans.forEach(loan => {
            personalLoansContainer.innerHTML += `
                <div class="bg-[#1E2632]/50 backdrop-blur-lg rounded-2xl p-6 hover:bg-[#1E2632]/70 
                    transition-all duration-300 border border-white/5">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="text-xl font-bold mb-2">${loan.title}</h3>
                            <div class="px-3 py-1 bg-[#10B981]/20 text-[#10B981] rounded-full text-sm inline-block">
                                ${loan.amount}
                            </div>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-gradient-to-r ${loan.color} flex items-center justify-center">
                            <i class="fas fa-hand-holding-usd text-xl"></i>
                        </div>
                    </div>
                    <div class="space-y-3 mb-6">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-400">Duration</span>
                            <span class="text-white">${loan.duration}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-400">Interest Rate</span>
                            <span class="text-white">${loan.interest}</span>
                        </div>
                        <div class="h-px bg-white/5 my-4"></div>
                        <div class="space-y-2">
                            <p class="text-sm font-medium text-white">Requirements:</p>
                            <ul class="text-sm text-gray-400 space-y-2">
                                ${loan.requirements.map(req => `
                                    <li class="flex items-center gap-2">
                                        <div class="w-5 h-5 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                                            <i class="fas fa-check text-[#10B981] text-xs"></i>
                                        </div>
                                        ${req}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    <button onclick="handleLoanApplication('personal', '${loan.amount}')" 
                            class="w-full bg-gradient-to-r ${loan.color} py-3.5 rounded-xl font-medium 
                            transition-all active:scale-95 flex items-center justify-center gap-2">
                        <span>Apply Now</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
        });
    } else {
        console.error('Personal loans container not found'); // Debug log
    }
}

// Add loan application handling
function handleLoanApplication(loanType, amount) {
    // Show loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';

    // Simulate API call
    setTimeout(() => {
        button.disabled = false;
        button.innerHTML = originalText;
        
        // Show success message
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-[#10B981] text-white px-6 py-3 rounded-xl shadow-lg z-50';
        toast.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fas fa-check-circle"></i>
                <span>Loan application submitted successfully!</span>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }, 1500);
}

// Add this function to handle Google Sign In
async function handleGoogleSignIn(e) {
    e.preventDefault();
    const button = e.currentTarget;
    const originalContent = button.innerHTML;
    
    try {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Connecting...';
        
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Check if user exists in Firestore, if not create profile
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            // Create new user document
            const userData = {
                uid: user.uid,
                displayName: user.displayName || 'User',
                email: user.email,
                photoURL: user.photoURL,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                balance: 0,
                investments: [],
                loans: [],
                transactions: []
            };
            await setDoc(doc(db, 'users', user.uid), userData);
        } else {
            // Update last login
            await setDoc(doc(db, 'users', user.uid), {
                ...userDoc.data(),
                lastLogin: new Date().toISOString()
            }, { merge: true });
        }
        
        // Handle successful sign in
        hideAuthPage();
        navigateToSection('home');
        updateUserProfile(user);
        showToast('Successfully signed in with Google!', 'success');
        
    } catch (error) {
        console.error('Google sign in error:', error);
        if (error.code === 'auth/unauthorized-domain') {
            showToast('This domain is not authorized. Please contact support.', 'error');
        } else {
            showToast(getAuthErrorMessage(error.code), 'error');
        }
    } finally {
        button.disabled = false;
        button.innerHTML = originalContent;
    }
}

// Add this function to update bottom navigation
function updateBottomNavigation(sectionId) {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    navItems.forEach(item => {
        const itemSectionId = item.getAttribute('href').substring(1);
        if (itemSectionId === sectionId) {
            item.classList.add('active');
            item.classList.remove('text-gray-400');
            updateNavigationIndicator();
        } else {
            item.classList.remove('active');
            item.classList.add('text-gray-400');
        }
    });
}

// Add this function to update user profile
function updateUserProfile(user) {
    if (user) {
        const profileName = document.querySelector('#profile h2');
        const profileEmail = document.querySelector('#profile p');
        const profileImage = document.querySelector('#profile img');
        const headerName = document.querySelector('header h1');
        const headerImage = document.querySelector('header img');

        if (profileName && user.displayName) {
            profileName.textContent = user.displayName;
        }
        if (profileEmail && user.email) {
            profileEmail.textContent = user.email;
        }
        if (profileImage && user.photoURL) {
            profileImage.src = user.photoURL;
        }
        if (headerName && user.displayName) {
            headerName.textContent = user.displayName;
        }
        if (headerImage && user.photoURL) {
            headerImage.src = user.photoURL;
        }
    }
}

// Add this function to update UI with user data
function updateUIWithUserData(userData) {
    // Update balance
    const balanceElement = document.querySelector('.balance-amount');
    if (balanceElement) {
        balanceElement.textContent = `₹${userData.balance.toLocaleString()}`;
    }

    // Update investments if any
    if (userData.investments && userData.investments.length > 0) {
        // Update investments UI
    }

    // Update loans if any
    if (userData.loans && userData.loans.length > 0) {
        // Update loans UI
    }

    // Update transaction history if any
    if (userData.transactions && userData.transactions.length > 0) {
        // Update transaction history UI
    }
} 