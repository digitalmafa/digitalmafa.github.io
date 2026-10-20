    const firebaseConfig = {
      apiKey: "AIzaSyDERtju4FYjQMq1WOCAa6bHQfWM--OQ6Ps",
      authDomain: "digitalmafa-82068.firebaseapp.com",
      projectId: "digitalmafa-82068",
      storageBucket: "digitalmafa-82068.firebasestorage.app",
      messagingSenderId: "168720557180",
      appId: "1:168720557180:web:4f18a84d0e5be0c187d5f9"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    const $ = id => document.getElementById(id);

    const authPanel = $("authPanel");
    const accountPanel = $("accountPanel");
    const authForm = $("authForm");
    const nameField = $("nameField");
    const nameInput = $("name");
    const emailInput = $("email");
    const passwordInput = $("password");
    const passwordField = $("passwordField");
    const forgotRow = $("forgotRow");
    const forgotBtn = $("forgotBtn");
    const submitBtn = $("submitBtn");
    const loginTab = $("loginTab");
    const signupTab = $("signupTab");
    const tabs = $("tabs");
    const googleArea = $("googleArea");
    const googleBtn = $("googleBtn");
    const logoutBtn = $("logoutBtn");
    const message = $("message");

    let mode = "login";
    let busy = false;

    function showMessage(text, type = "") {
      message.textContent = text;
      message.className = type;
    }

    function setBusy(value) {
      busy = value;

      [
        submitBtn, googleBtn, logoutBtn, forgotBtn,
        loginTab, signupTab
      ].forEach(button => {
        button.disabled = value;
      });

      updateButtonText();
    }

    function updateButtonText() {
      if (busy) {
        submitBtn.textContent = "Please wait...";
      } else if (mode === "login") {
        submitBtn.textContent = "Sign In";
      } else if (mode === "signup") {
        submitBtn.textContent = "Create Account";
      } else {
        submitBtn.textContent = "Send Reset Email";
      }
    }

    function setMode(nextMode) {
      mode = nextMode;

      const signup = mode === "signup";
      const reset = mode === "reset";

      tabs.hidden = reset;
      nameField.hidden = !signup;
      nameInput.required = signup;

      passwordField.hidden = reset;
      passwordInput.required = !reset;
      forgotRow.hidden = signup || reset;
      googleArea.hidden = reset;

      loginTab.classList.toggle("active", mode === "login");
      signupTab.classList.toggle("active", signup);

      $("subtitle").textContent = reset
        ? "Reset your password using your email."
        : signup
          ? "Create your DigitalMAFA account."
          : "Welcome back! Sign in to your account.";

      showMessage("");
      updateButtonText();
    }

    loginTab.addEventListener("click", () => setMode("login"));
    signupTab.addEventListener("click", () => setMode("signup"));

    forgotBtn.addEventListener("click", () => setMode("reset"));

    authForm.addEventListener("submit", async event => {
      event.preventDefault();

      if (busy) return;

      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const name = nameInput.value.trim();

      if (!email) {
        showMessage("Please enter your email address.", "error");
        return;
      }

      if (mode === "signup" && !name) {
        showMessage("Please enter your full name.", "error");
        return;
      }

      try {
        setBusy(true);
        showMessage("");

        if (mode === "reset") {
          await sendPasswordResetEmail(auth, email);

          showMessage(
            "If an account exists for this email, a password reset email will be sent. Check your inbox and spam folder.",
            "success"
          );
          return;
        }

        if (mode === "signup") {
          const result = await createUserWithEmailAndPassword(
            auth, email, password
          );

          await updateProfile(result.user, {
            displayName: name
          });

          showMessage("Account created successfully!", "success");
        } else {
          await signInWithEmailAndPassword(auth, email, password);
          showMessage("Signed in successfully!", "success");
        }
      } catch (error) {
        showMessage(friendlyError(error.code), "error");
      } finally {
        setBusy(false);
      }
    });

    googleBtn.addEventListener("click", async () => {
      if (busy) return;

      try {
        setBusy(true);
        showMessage("");

        await signInWithPopup(auth, googleProvider);
        showMessage("Google sign-in successful!", "success");
      } catch (error) {
        showMessage(friendlyError(error.code), "error");
      } finally {
        setBusy(false);
      }
    });

    logoutBtn.addEventListener("click", async () => {
      if (busy) return;

      try {
        setBusy(true);
        await signOut(auth);
        showMessage("You have signed out.", "success");
      } catch (error) {
        showMessage(friendlyError(error.code), "error");
      } finally {
        setBusy(false);
      }
    });

    onAuthStateChanged(auth, user => {
      authPanel.hidden = !!user;
      accountPanel.hidden = !user;

      if (user) {
        $("userName").textContent =
          "Name: " + (user.displayName || "Not provided");
        $("userEmail").textContent =
          "Email: " + (user.email || "Not provided");
      }
    });

    function friendlyError(code) {
      const errors = {
        "auth/email-already-in-use":
          "This email already has an account. Please sign in.",
        "auth/invalid-email":
          "Please enter a valid email address.",
        "auth/weak-password":
          "Use a stronger password with at least 6 characters.",
        "auth/invalid-credential":
          "Email or password is incorrect.",
        "auth/popup-closed-by-user":
          "The Google sign-in window was closed.",
        "auth/popup-blocked":
          "Your browser blocked the popup. Allow popups and try again.",
        "auth/unauthorized-domain":
          "Add your website domain in Firebase Authentication settings.",
        "auth/operation-not-allowed":
          "Enable this sign-in method in Firebase Console.",
        "auth/network-request-failed":
          "Network error. Check your internet connection.",
        "auth/too-many-requests":
          "Too many attempts. Wait a while and try again."
      };

      return errors[code] || "Something went wrong. Please try again.";
    }
