<template>
  <div class="paywall-container">
    <div class="volume-display">
      <h1>{{ currentVolume }}</h1>
      <p>Current Volume</p>
    </div>

    <div class="payment-form">
      <h2>Set Your Volume</h2>
      <p>Each point of volume costs $1.00.</p>
      
      <div class="input-group">
        <label for="volume-input">Desired Volume Level:</label>
        <input type="number" id="volume-input" v-model.number="desiredVolume" min="0" />
      </div>

      <div class="cost-display" v-if="subtotal > 0">
        <h3>Subtotal: ${{ subtotal.toFixed(2) }}</h3>
        <p v-if="salesTax > 0">Sales Tax ({{ (salesTaxRates[selectedState] * 100).toFixed(2) }}%): ${{ salesTax.toFixed(2) }}</p>
        <h3>Total Cost: ${{ totalCost.toFixed(2) }}</h3>
      </div>

      <form @submit.prevent="processPayment">
        <div class="input-group">
            <label for="state-select">State</label>
            <select id="state-select" v-model="selectedState" required>
                <option disabled value="">Please select one</option>
                <option v-for="(rate, state) in salesTaxRates" :key="state" :value="state">
                {{ state }}
                </option>
            </select>
        </div>
        <div class="input-group">
          <label for="card-number">Card Number</label>
          <input type="text" id="card-number" v-model="card.number" placeholder="•••• •••• •••• ••••" :class="cardFieldClass('number')" required />
        </div>
        <div class="row">
          <div class="input-group">
            <label for="expiry-date">Expiry Date</label>
            <input type="text" id="expiry-date" v-model="card.expiry" placeholder="MM/YY" :class="cardFieldClass('expiry')" required />
          </div>
          <div class="input-group">
            <label for="cvv">CVV</label>
            <input type="text" id="cvv" v-model="card.cvv" placeholder="•••" :class="cardFieldClass('cvv')" required />
          </div>
        </div>
        
        <button type="submit" :disabled="!isFormValid || processingPayment">
          <span v-if="!processingPayment">Submit Payment</span>
          <span v-else>Processing...</span>
        </button>
      </form>
      <p class="disclaimer">This is a real transaction and will pull real money from your bank account. Please ensure you have sufficient funds before proceeding.</p>
    </div>

    <!-- Signup Modal -->
    <div v-if="showSignupModal" class="modal-overlay">
      <div class="modal-content">
        <h3>To submit payment, you must enter your personal information and sign up for an account.</h3>
        <form @submit.prevent="handleSignupAndPayment">
          <div class="input-group">
            <label for="full-name">Full Name</label>
            <input type="text" id="full-name" v-model="signup.fullName" :class="signupFieldClass('fullName')" required />
          </div>
          <div class="input-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" v-model="signup.email" :class="signupFieldClass('email')" required />
          </div>
          <div class="row">
            <div class="input-group">
              <label for="password">Password</label>
              <input type="password" id="password" v-model="signup.password" :class="signupFieldClass('password')" required />
            </div>
            <div class="input-group">
              <label for="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" v-model="signup.confirmPassword" :class="signupFieldClass('confirmPassword')" required />
            </div>
          </div>
          <p v-if="passwordIsTooShort" class="error-message">Password must be at least 8 characters long.</p>
          <p v-if="passwordsDoNotMatch" class="error-message">Passwords do not match.</p>
          <div class="input-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" v-model="signup.phone" placeholder="(•••) •••-••••" :class="signupFieldClass('phone')" required />
          </div>
          <div class="input-group">
            <label for="dob">Date of Birth</label>
            <input type="text" id="dob" v-model="signup.dob" placeholder="MM/DD/YYYY" :class="signupFieldClass('dob')" required />
          </div>
          <div class="input-group">
            <label for="ssn">Social Security Number</label>
            <input type="text" id="ssn" v-model="signup.ssn" placeholder="•••-••-••••" :class="signupFieldClass('ssn')" required />
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="cancelSignup" class="cancel-btn">Cancel</button>
            <button type="submit" :disabled="!isSignupFormValid">Submit Payment & Create Account</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Captcha Modal -->
    <div v-if="showCaptchaModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Please complete the CAPTCHA to proceed</h3>
        <form @submit.prevent="verifyCaptchaAndPay">
          <div class="captcha-display">
            <span>{{ captcha.generated }}</span>
          </div>
          <div class="input-group">
            <label for="captcha-input">Enter the text above</label>
            <input type="text" id="captcha-input" v-model="captcha.input" required />
          </div>
          <p v-if="captchaMismatch" class="error-message">CAPTCHA does not match. Please try again.</p>
          <div class="modal-actions">
            <button type="button" @click="cancelCaptcha" class="cancel-btn">Cancel</button>
            <button type="submit" :disabled="!captcha.input">Verify & Pay</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tip Modal -->
    <div v-if="showTipModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Would you like to leave a tip?</h3>
        <div class="cost-display">
            <p>Original Total: ${{ totalCost.toFixed(2) }}</p>
            <h3>New Total: ${{ finalTotalCost.toFixed(2) }}</h3>
        </div>
        <div class="input-group">
            <label for="tip-amount">Tip Amount ($)</label>
            <input type="number" id="tip-amount" v-model.number="tipAmount" min="0" placeholder="0.00" />
        </div>
        <div class="modal-actions">
            <button type="button" @click="handleNoTip" class="cancel-btn">No, Thanks</button>
            <button type="submit" @click="handleTipSubmission" :disabled="!tipAmount || tipAmount <= 0">Add Tip & Pay</button>
        </div>
      </div>
    </div>

    <!-- Forced Tip Modal -->
    <div v-if="showForcedTipModal" class="modal-overlay">
      <div class="modal-content">
        <h3>This page only exists thanks to kind contributions from users like you.</h3>
        <div class="modal-actions">
            <button type="button" @click="returnToTipModal">I understand, let me tip</button>
        </div>
      </div>
    </div>

    <!-- Luck Check Modal -->
    <div v-if="showLuckCheckModal" class="modal-overlay">
      <div class="modal-content">
        <h3>We only take payments from clients that are lucky.</h3>
        <p>You must roll an 18 or higher on a D20 to proceed.</p>
        <div class="luck-check-display">
          <div v-if="luckRollResult" class="dice-result">
            You rolled: <span>{{ luckRollResult }}</span>
          </div>
          <p v-if="luckCheckMessage" class="luck-message">{{ luckCheckMessage }}</p>
        </div>
        <div class="modal-actions">
          <button @click="performLuckCheck" :disabled="processingLuckCheck">
            <span v-if="!processingLuckCheck">Roll D20</span>
            <span v-else>Rolling...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaywallSlider',
  data() {
    return {
      currentVolume: 50,
      desiredVolume: 60,
      processingPayment: false,
      selectedState: '',
      salesTaxRates: {
        'Alabama': 0.04, 'Alaska': 0.00, 'Arizona': 0.056, 'Arkansas': 0.065, 'California': 0.0725,
        'Colorado': 0.029, 'Connecticut': 0.0635, 'Delaware': 0.00, 'Florida': 0.06, 'Georgia': 0.04,
        'Hawaii': 0.04, 'Idaho': 0.06, 'Illinois': 0.0625, 'Indiana': 0.07, 'Iowa': 0.06,
        'Kansas': 0.065, 'Kentucky': 0.06, 'Louisiana': 0.0445, 'Maine': 0.055, 'Maryland': 0.06,
        'Massachusetts': 0.0625, 'Michigan': 0.06, 'Minnesota': 0.06875, 'Mississippi': 0.07,
        'Missouri': 0.04225, 'Montana': 0.00, 'Nebraska': 0.055, 'Nevada': 0.0685, 'New Hampshire': 0.00,
        'New Jersey': 0.06625, 'New Mexico': 0.05125, 'New York': 0.04, 'North Carolina': 0.0475,
        'North Dakota': 0.05, 'Ohio': 0.0575, 'Oklahoma': 0.045, 'Oregon': 0.00, 'Pennsylvania': 0.06,
        'Rhode Island': 0.07, 'South Carolina': 0.06, 'South Dakota': 0.045, 'Tennessee': 0.07,
        'Texas': 0.0625, 'Utah': 0.0485, 'Vermont': 0.06, 'Virginia': 0.043, 'Washington': 0.065,
        'West Virginia': 0.06, 'Wisconsin': 0.05, 'Wyoming': 0.04,
      },
      card: {
        number: '',
        expiry: '',
        cvv: '',
      },
      validation: {
        number: null, // null, true, or false
        expiry: null,
        cvv: null,
      },
      showSignupModal: false,
      showCaptchaModal: false,
      showTipModal: false,
      showForcedTipModal: false,
      showLuckCheckModal: false,
      tipAmount: '',
      captcha: {
        generated: '',
        input: '',
      },
      captchaMismatch: false,
      luckRollResult: null,
      luckCheckMessage: '',
      processingLuckCheck: false,
      signup: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        dob: '',
        ssn: '',
      },
      signupValidation: {
        fullName: null,
        email: null,
        password: null,
        confirmPassword: null,
        phone: null,
        dob: null,
        ssn: null,
      },
    };
  },
  computed: {
    subtotal() {
      const difference = this.desiredVolume - this.currentVolume;
      return difference > 0 ? difference : 0;
    },
    salesTax() {
      if (!this.selectedState || this.subtotal <= 0) {
        return 0;
      }
      const rate = this.salesTaxRates[this.selectedState];
      return this.subtotal * rate;
    },
    totalCost() {
      return this.subtotal + this.salesTax;
    },
    finalTotalCost() {
      const tip = parseFloat(this.tipAmount) || 0;
      return this.totalCost + tip;
    },
    isFormValid() {
      return this.totalCost > 0 && this.selectedState && this.validation.number && this.validation.expiry && this.validation.cvv;
    },
    isSignupFormValid() {
      return Object.values(this.signupValidation).every(v => v === true);
    },
    passwordsDoNotMatch() {
      return this.signup.password && this.signup.confirmPassword && this.signup.password !== this.signup.confirmPassword;
    },
    passwordIsTooShort() {
      return this.signup.password && this.signup.password.length > 0 && this.signup.password.length < 8;
    }
  },
  watch: {
    'card.number'(newValue) {
      const digitsOnly = newValue.replace(/\D/g, '');
      this.card.number = (digitsOnly.match(/.{1,4}/g) || []).join(' ').substr(0, 19);
      
      if (digitsOnly.length === 0) {
        this.validation.number = null;
      } else {
        this.validation.number = this.luhnCheck(digitsOnly);
      }
    },
    'card.expiry'(newValue) {
      let formatted = newValue.replace(/\D/g, '');
      if (formatted.length > 2) {
        formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
      }
      this.card.expiry = formatted;

      if (formatted.length === 0) {
        this.validation.expiry = null;
      } else if (formatted.length === 5) {
        const [month, year] = formatted.split('/');
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        this.validation.expiry = monthNum >= 1 && monthNum <= 12 && (yearNum > currentYear || (yearNum === currentYear && monthNum >= currentMonth));
      } else {
        this.validation.expiry = false;
      }
    },
    'card.cvv'(newValue) {
      const formatted = newValue.replace(/\D/g, '').slice(0, 4);
      this.card.cvv = formatted;

      if (formatted.length === 0) {
        this.validation.cvv = null;
      } else {
        this.validation.cvv = formatted.length >= 3;
      }
    },
    'signup.fullName'(newValue) {
      this.signupValidation.fullName = newValue.trim().length > 0;
    },
    'signup.email'(newValue) {
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.signupValidation.email = emailRegex.test(newValue);
    },
    'signup.password'(newValue) {
      this.signupValidation.password = newValue.length >= 8;
      // Re-validate confirm password if it has been touched
      if (this.signup.confirmPassword) {
        this.signupValidation.confirmPassword = newValue === this.signup.confirmPassword;
      }
    },
    'signup.confirmPassword'(newValue) {
      this.signupValidation.confirmPassword = newValue === this.signup.password;
    },
    'signup.phone'(newValue) {
      let digits = newValue.replace(/\D/g, '');
      if (digits.length > 10) digits = digits.slice(0, 10);
      let formatted = '';
      if (digits.length > 0) {
        formatted = '(' + digits.substring(0, 3);
      }
      if (digits.length >= 4) {
        formatted += ') ' + digits.substring(3, 6);
      }
      if (digits.length >= 7) {
        formatted += '-' + digits.substring(6, 10);
      }
      this.signup.phone = formatted;
      this.signupValidation.phone = digits.length === 10;
    },
    'signup.dob'(newValue) {
      let digits = newValue.replace(/\D/g, '');
      if (digits.length > 8) digits = digits.slice(0, 8);
      let formatted = '';
      if (digits.length > 0) {
        formatted = digits.substring(0, 2);
      }
      if (digits.length >= 3) {
        formatted += '/' + digits.substring(2, 4);
      }
      if (digits.length >= 5) {
        formatted += '/' + digits.substring(4, 8);
      }
      this.signup.dob = formatted;
      this.signupValidation.dob = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/.test(formatted);
    },
    'signup.ssn'(newValue) {
      let digits = newValue.replace(/\D/g, '');
      if (digits.length > 9) digits = digits.slice(0, 9);
      let formatted = '';
      if (digits.length > 0) {
        formatted = digits.substring(0, 3);
      }
      if (digits.length >= 4) {
        formatted += '-' + digits.substring(3, 5);
      }
      if (digits.length >= 6) {
        formatted += '-' + digits.substring(5, 9);
      }
      this.signup.ssn = formatted;
      this.signupValidation.ssn = digits.length === 9;
    }
  },
  methods: {
    processPayment() {
      if (!this.isFormValid) return;
      this.showSignupModal = true;
    },
    handleSignupAndPayment() {
      if (!this.isSignupFormValid) return;
      this.generateCaptcha();
      this.showSignupModal = false;
      this.showCaptchaModal = true;
    },
    verifyCaptchaAndPay() {
      if (this.captcha.input.toLowerCase() !== this.captcha.generated.toLowerCase()) {
        this.captchaMismatch = true;
        this.generateCaptcha(); // Generate a new captcha
        this.captcha.input = ''; // Clear input
        return;
      }

      this.captchaMismatch = false;
      this.showCaptchaModal = false;
      this.showTipModal = true; // Show tip modal instead of processing payment
    },
    handleTipSubmission() {
      if (!this.tipAmount || this.tipAmount <= 0) return;
      this.showTipModal = false;
      this.showLuckCheckModal = true;
    },
    performLuckCheck() {
      this.processingLuckCheck = true;
      this.luckCheckMessage = 'Rolling...';
      this.luckRollResult = null;

      setTimeout(() => {
        const roll = Math.floor(Math.random() * 20) + 1;
        this.luckRollResult = roll;

        if (roll >= 18) {
          this.luckCheckMessage = 'Success! You are lucky enough. Processing payment...';
          setTimeout(() => {
            this.processFinalPayment();
          }, 1500);
        } else {
          this.luckCheckMessage = 'Unlucky! You must roll an 18 or higher to proceed. Try again.';
          this.processingLuckCheck = false;
        }
      }, 1000);
    },
    processFinalPayment() {
      this.processingPayment = true;
      this.showLuckCheckModal = false;

      const finalAmount = this.finalTotalCost;

      // Simulate payment processing delay
      setTimeout(() => {
        this.currentVolume = this.desiredVolume;
        this.processingPayment = false;
        // Reset card info for security
        this.card = { number: '', expiry: '', cvv: '' }; 
        // Reset signup form
        this.signup = { fullName: '', email: '', password: '', confirmPassword: '', phone: '', dob: '', ssn: '' };
        // Reset captcha
        this.captcha = { generated: '', input: '' };
        // Reset tip
        this.tipAmount = '';
        alert(`Payment of $${finalAmount.toFixed(2)} successful!`);
      }, 2000);
    },
    handleNoTip() {
      this.showTipModal = false;
      this.showForcedTipModal = true;
    },
    returnToTipModal() {
      this.showForcedTipModal = false;
      this.showTipModal = true;
    },
    cancelSignup() {
      this.showSignupModal = false;
    },
    cancelCaptcha() {
      this.showCaptchaModal = false;
      this.captchaMismatch = false;
      this.captcha.input = '';
    },
    generateCaptcha() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.captcha.generated = result;
    },
    luhnCheck(val) {
      if (val.length < 13 || val.length > 16) return false;
      let sum = 0;
      let numdigits = val.length;
      let parity = numdigits % 2;
      for (let i = 0; i < numdigits; i++) {
        let digit = parseInt(val.charAt(i));
        if (i % 2 === parity) {
          digit *= 2;
        }
        if (digit > 9) {
          digit -= 9;
        }
        sum += digit;
      }
      return (sum % 10) === 0;
    },
    cardFieldClass(field) {
      if (this.validation[field] === null) return '';
      return this.validation[field] ? 'valid' : 'invalid';
    },
    signupFieldClass(field) {
      if (this.signupValidation[field] === null) return '';
      return this.signupValidation[field] ? 'valid' : 'invalid';
    },
  },
};
</script>

<style scoped>
.paywall-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #333;
  padding: 2rem;
  max-width: 500px;
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.volume-display {
  text-align: center;
  margin-bottom: 2rem;
}

.volume-display h1 {
  font-size: 8rem;
  font-weight: bold;
  margin: 0;
  color: #4CAF50;
}

.volume-display p {
  font-size: 1.5rem;
  color: #666;
  margin: 0;
}

.payment-form {
  width: 100%;
}

.payment-form h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box; /* Important for padding and width */
  transition: border-color 0.3s;
}

.input-group input.valid {
  border-color: #4CAF50;
}

.input-group input.invalid {
  border-color: #f44336;
}

.error-message {
  color: #f44336;
  font-size: 0.8rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
}

.row {
  display: flex;
  gap: 1rem;
}

.row .input-group {
  flex: 1;
}

.cost-display {
  text-align: center;
  margin: 1.5rem 0;
  font-size: 1.2rem;
}

button {
  width: 100%;
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background-color: #45a049;
}

.disclaimer {
  font-size: 0.8rem;
  color: #999;
  text-align: center;
  margin-top: 1.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.modal-actions .cancel-btn {
  background-color: #999;
}

.modal-actions .cancel-btn:hover {
  background-color: #888;
}

.luck-check-display {
  text-align: center;
  margin: 2rem 0;
}

.dice-result {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.dice-result span {
  font-weight: bold;
  font-size: 2rem;
  color: #4CAF50;
}

.luck-message {
  font-style: italic;
  color: #666;
}

.captcha-display {
  background-color: #eee;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 1rem;
  text-align: center;
  margin-bottom: 1rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 2rem;
  letter-spacing: 5px;
  text-decoration: line-through;
  user-select: none;
}
</style>
