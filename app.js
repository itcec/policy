

class PolicyAgreementForm {
  constructor() {
    this.formElement = document.getElementById("policyForm");
    this.submitBtn = document.getElementById("submitBtn");
    
    // Initialize Bootstrap modals
    const submissionModalElement = document.getElementById("submissionModal");
    const errorModalElement = document.getElementById("errorModal");
    
    if (submissionModalElement) {
      this.submissionModal = new bootstrap.Modal(submissionModalElement);
    }
    
    if (errorModalElement) {
      this.errorModal = new bootstrap.Modal(errorModalElement);
    }

    this.appsScriptUrl = ""; // Will be set from config
    this.initializeEventListeners();
    this.loadSavedData();
  }

  /**
   * Initialize all event listeners
   */
  initializeEventListeners() {
    // Form submission
    this.formElement.addEventListener("submit", (e) => this.handleFormSubmit(e));

    // Final agreement checkbox - save to local storage
    const finalCheckbox = document.getElementById("check9");
    if (finalCheckbox) {
      finalCheckbox.addEventListener("change", () => this.saveFormDataLocally());
    }

    // Form input change events for auto-save
    const inputs = this.formElement.querySelectorAll(".form-control, .form-select");
    inputs.forEach((input) => {
      input.addEventListener("change", () => this.saveFormDataLocally());
    });

    // Form reset
    const resetBtn = this.formElement.querySelector('button[type="reset"]');
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        setTimeout(() => {
          this.saveFormDataLocally();
        }, 100);
      });
    }
  }

  /**
   * Update styling for a single section based on checkbox state (removed - no longer needed)
   */
  updateSectionStyling(checkbox) {
    // No longer needed - only final checkbox exists
  }

  /**
   * Update styling for all sections (removed - no longer needed)
   */
  updateAllSectionStyling() {
    // No longer needed - only final checkbox exists
  }

  /**
   * Validate form before submission
   */
  validateForm() {
    let isValid = true;

    // Check if final agreement checkbox is checked
    const finalCheckbox = document.getElementById("check9");
    if (!finalCheckbox || !finalCheckbox.checked) {
      this.showError(
        "Incomplete Agreement",
        "Please read and check the Agreement & Acknowledgement section before submitting."
      );
      return false;
    }

    // Validate form fields using Bootstrap validation
    if (!this.formElement.checkValidity()) {
      isValid = false;
      this.formElement.classList.add("was-validated");
    }

    return isValid;
  }

  /**
   * Handle form submission
   */
  async handleFormSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    // Disable submit button to prevent multiple submissions
    this.submitBtn.disabled = true;
    const originalText = this.submitBtn.innerHTML;
    this.submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...';

    try {
      // Collect form data
      const formData = this.collectFormData();

      // Generate reference ID BEFORE sending
      const referenceId = this.generateReferenceId();
      formData.referenceId = referenceId;

      // Send to Google Sheets via Apps Script
      const submitSuccess = await this.submitToGoogleSheets(formData);

      // Only show success if actually submitted to Google Sheets
      if (submitSuccess) {
        // Show success modal with all details
        this.showSuccess(referenceId, formData);

        // Clear local storage
        localStorage.removeItem("policyFormData");

        // Reset form
        this.formElement.reset();
        this.formElement.classList.remove("was-validated");
      } else {
        // Show error if submission failed
        this.showError(
          "Submission Failed",
          "Your agreement could not be submitted. Please check your internet connection and try again."
        );
      }

    } catch (error) {
      console.error("Submission error:", error);
      this.showError(
        "Submission Failed",
        error instanceof Error ? error.message : "An error occurred while submitting the form. Please try again."
      );
    } finally {
      // Re-enable submit button
      this.submitBtn.disabled = false;
      this.submitBtn.innerHTML = originalText;
    }
  }

  /**
   * Collect form data from the form
   */
  collectFormData() {
    const finalCheckbox = document.getElementById("check9");

    return {
      timestamp: new Date().toISOString(),
      studentName: document.getElementById("studentName").value,
      year: document.getElementById("year").value,
      studentId: document.getElementById("studentId").value,
      section: document.getElementById("section").value,
      email: document.getElementById("email").value,
      agreed: finalCheckbox ? finalCheckbox.checked : false,
    };
  }

  /**
   * Submit data to Google Sheets via Apps Script
   */
  async submitToGoogleSheets(data) {
    // Add device information to data
    data.device = this.getDeviceInfo();

    // If Apps Script URL is not configured, store locally only
    if (!this.appsScriptUrl || this.appsScriptUrl.trim() === "") {
      console.warn("Google Sheets URL not configured. Data stored locally only.");
      return false;
    }

    try {
      const response = await fetch(this.appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // In no-cors mode, we can't check the response content
      // But if fetch completes without error, assume success
      console.log("Data submitted to Google Sheets successfully");
      return true;

    } catch (error) {
      console.error("Submission error:", error);
      return false;
    }
  }

  /**
   * Get device information from user agent
   * Returns device type and model/OS information
   */
  getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let deviceType = "Computer";
    let deviceModel = "Unknown";

    // Detect device type
    if (/android/i.test(userAgent)) {
      deviceType = "Phone";
      deviceModel = this.getAndroidVersion(userAgent);
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      deviceType = /ipad/i.test(userAgent) ? "Tablet" : "Phone";
      deviceModel = this.getIOSVersion(userAgent);
    } else if (/windows/i.test(userAgent)) {
      deviceType = "Computer";
      deviceModel = "Windows " + this.getWindowsVersion(userAgent);
    } else if (/macintosh|mac os x/i.test(userAgent)) {
      deviceType = "Computer";
      deviceModel = "macOS " + this.getMacOSVersion(userAgent);
    } else if (/linux/i.test(userAgent)) {
      deviceType = "Computer";
      deviceModel = "Linux";
    }

    // Add browser info
    const browser = this.getBrowserInfo(userAgent);
    deviceModel = deviceModel + " - " + browser;

    return {
      type: deviceType,
      model: deviceModel
    };
  }

  /**
   * Extract Android version from user agent
   */
  getAndroidVersion(userAgent) {
    const match = userAgent.match(/Android (\d+(\.\d+)*)/);
    return match ? "Android " + match[1] : "Android";
  }

  /**
   * Extract iOS version from user agent
   */
  getIOSVersion(userAgent) {
    const match = userAgent.match(/OS (\d+_\d+)/);
    const version = match ? match[1].replace(/_/g, ".") : "";
    return "iOS " + version;
  }

  /**
   * Extract Windows version from user agent
   */
  getWindowsVersion(userAgent) {
    if (/windows nt 10.0/i.test(userAgent)) return "10/11";
    if (/windows nt 6.3/i.test(userAgent)) return "8.1";
    if (/windows nt 6.2/i.test(userAgent)) return "8";
    return "NT";
  }

  /**
   * Extract macOS version from user agent
   */
  getMacOSVersion(userAgent) {
    const match = userAgent.match(/Mac OS X (\d+_\d+)/);
    return match ? match[1].replace(/_/g, ".") : "";
  }

  /**
   * Get browser information
   */
  getBrowserInfo(userAgent) {
    if (/chrome/i.test(userAgent) && !/chromium|edg/i.test(userAgent)) return "Chrome";
    if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return "Safari";
    if (/firefox/i.test(userAgent)) return "Firefox";
    if (/edg/i.test(userAgent)) return "Edge";
    if (/trident/i.test(userAgent)) return "Internet Explorer";
    return "Other Browser";
  }

  /**
   * Save form data to local storage
   */
  saveFormDataLocally() {
    const formData = this.collectFormData();
    localStorage.setItem("policyFormData", JSON.stringify(formData));
    console.log("Form data auto-saved to local storage");
  }

  /**
   * Load previously saved form data from local storage
   */
  loadSavedData() {
    const savedData = localStorage.getItem("policyFormData");
    
    if (savedData) {
      try {
        const data = JSON.parse(savedData);

        // Populate form fields
        document.getElementById("studentName").value = data.studentName || "";
        document.getElementById("year").value = data.year || "";
        document.getElementById("studentId").value = data.studentId || "";
        document.getElementById("section").value = data.section || "";
        document.getElementById("email").value = data.email || "";

        // Restore final agreement checkbox state
        const finalCheckbox = document.getElementById("check9");
        if (finalCheckbox) {
          finalCheckbox.checked = data.agreed || false;
        }

        console.log("Previously saved form data loaded");
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }

  /**
   * Generate a unique reference ID for the submission
   */
  generateReferenceId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CEC-PA-${timestamp}-${random}`;
  }

  /**
   * Show success modal
   */
  showSuccess(referenceId, formData) {
    // Update reference ID
    const referenceIdElement = document.getElementById("referenceId");
    if (referenceIdElement) {
      referenceIdElement.textContent = referenceId;
    }

    // Update submission details
    const studentNameElement = document.getElementById("submissionStudentName");
    if (studentNameElement && formData.studentName) {
      studentNameElement.textContent = formData.studentName;
    }

    const studentIdElement = document.getElementById("submissionStudentId");
    if (studentIdElement && formData.studentId) {
      studentIdElement.textContent = formData.studentId;
    }

    const sectionElement = document.getElementById("submissionSection");
    if (sectionElement && formData.section) {
      sectionElement.textContent = formData.section;
    }

    const emailElement = document.getElementById("submissionEmail");
    if (emailElement && formData.email) {
      emailElement.textContent = formData.email;
    }

    const timestampElement = document.getElementById("submissionTimestamp");
    if (timestampElement) {
      const now = new Date();
      const timestamp = now.toLocaleString();
      timestampElement.textContent = timestamp;
    }

    this.submissionModal.show();
  }

  /**
   * Show error modal
   */
  showError(title, message) {
    const errorTitleElement = document.querySelector("#errorModalLabel");
    const errorMessageElement = document.getElementById("errorMessage");

    if (errorTitleElement) {
      errorTitleElement.textContent = `${title}`;
    }

    if (errorMessageElement) {
      errorMessageElement.textContent = message;
    }

    this.errorModal.show();
  }

  /**
   * Set the Google Apps Script URL (call this to configure the backend)
   */
  setAppsScriptUrl(url) {
    this.appsScriptUrl = url;
  }

  /**
   * Get current form data (useful for debugging)
   */
  getFormData() {
    return this.collectFormData();
  }

  /**
   * Clear all form data and local storage
   */
  clearAllData() {
    this.formElement.reset();
    localStorage.removeItem("policyFormData");
    this.formElement.classList.remove("was-validated");
  }

  /**
   * Get current form data (useful for debugging)
   */
  getFormData() {
    return this.collectFormData();
  }

  /**
   * Clear all form data and local storage
   */
  clearAllData() {
    this.formElement.reset();
    localStorage.removeItem("policyFormData");
    this.formElement.classList.remove("was-validated");
  }
}

// Initialize the form when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const form = new PolicyAgreementForm();

  // Configuration: Set your Google Apps Script URL here
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbycF-w8E_ehhITfpRxdvxT4ZJLX-lWwSoVK4hdS-oeg0aHs-RxGzbhzwkyqN5WQczIS/exec";
  form.setAppsScriptUrl(APPS_SCRIPT_URL);

  // Make form instance available globally
  window.policyForm = form;

  // Handle navbar link clicks - conditional navigation
  document.querySelectorAll('a[href*="#section"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const isClickFromForm = e.target.closest('.policy-form') !== null;
      const currentPage = window.location.pathname;
      const isOnIndexPage = currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/');
      const isOnFAQPage = currentPage.includes('faqs.html');

      // If on FAQ page, navigate to index.html with anchor
      if (isOnFAQPage) {
        window.location.href = 'index.html' + href;
        return;
      }

      // If on index page and click is from within form, don't navigate
      if (isOnIndexPage && isClickFromForm) {
        e.preventDefault();
        return;
      }

      // If on index page and click is outside form, scroll to section
      if (isOnIndexPage && !isClickFromForm) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.formal-header').offsetHeight || 100;
          const offset = targetElement.offsetTop - headerHeight - 50;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }
    });
  });

  console.log("Policy Agreement Form Initialized");
  console.log("Access form via window.policyForm");
});
