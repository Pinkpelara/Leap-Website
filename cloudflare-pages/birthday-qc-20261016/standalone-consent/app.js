"use strict";

const AGREEMENT_VERSION = "2026-2027";
const WEB3FORMS_ACCESS_KEY = "558eb16e-8262-445d-8759-635dd9d2972d";
const SUBMISSION_ENDPOINT = "https://api.web3forms.com/submit";
const TOTAL_STEPS = 6;

const welcomeScreen = document.getElementById("welcomeScreen");
const formScreen = document.getElementById("formScreen");
const startButton = document.getElementById("startButton");
const form = document.getElementById("consentForm");
const stepCards = Array.from(document.querySelectorAll("[data-step]"));
const stepButtons = Array.from(document.querySelectorAll("[data-step-target]"));
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const submitButton = document.getElementById("submitButton");
const submitLabel = submitButton.querySelector(".submit-label");
const progressText = document.getElementById("progressText");
const formAlert = document.getElementById("formAlert");
const progress = document.querySelector(".progress");
const successScreen = document.getElementById("successScreen");
const guardianGroup = document.getElementById("guardianGroup");
const participantDob = document.getElementById("participantDob");
const guardianName = document.getElementById("guardianName");
const guardianSignature = document.getElementById("guardianSignature");
const reviewList = document.getElementById("reviewList");

let currentStep = 0;
let maxUnlockedStep = 0;
const completedSteps = new Set();

const fieldRules = {
  participantName: {
    message: "Enter the participant's full legal name.",
    validate: (value) => value.trim().length >= 2
  },
  participantDob: {
    message: "Enter a valid date of birth that is not in the future.",
    validate: (value) => {
      const date = parseDateInput(value);
      return Boolean(date && date <= startOfToday() && date.getFullYear() >= 1900);
    }
  },
  contactEmail: {
    message: "Enter a valid email address.",
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  },
  contactPhone: {
    message: "Enter a phone number with at least 7 digits.",
    validate: (value) => value.replace(/\D/g, "").length >= 7
  },
  participantSignature: {
    message: "Type the participant's full legal name to sign.",
    validate: (value) => value.trim().length >= 2
  },
  guardianName: {
    message: "Enter the parent or guardian's full legal name.",
    validate: (value) => value.trim().length >= 2
  },
  guardianSignature: {
    message: "Type the parent or guardian's full legal name to sign.",
    validate: (value) => value.trim().length >= 2
  }
};

function parseDateInput(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

function participantAge() {
  const dob = parseDateInput(participantDob.value);
  if (!dob) return null;
  const today = startOfToday();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) age -= 1;
  return age;
}

function isMinor() {
  const age = participantAge();
  return age !== null && age < 18;
}

function setSignatureDates() {
  const signedDate = formatDate(startOfToday());
  document.getElementById("participantSignedDate").value = signedDate;
  document.getElementById("guardianSignedDate").value = signedDate;
}

function updateGuardianRequirement() {
  const minor = isMinor();
  guardianGroup.hidden = !minor;
  guardianName.required = minor;
  guardianSignature.required = minor;
  if (!minor) {
    clearFieldError(guardianName);
    clearFieldError(guardianSignature);
  }
}

function showAlert(message) {
  formAlert.textContent = message;
  formAlert.hidden = false;
}

function clearAlert() {
  formAlert.textContent = "";
  formAlert.hidden = true;
}

function errorElementFor(input) {
  return document.getElementById(`${input.id}Error`);
}

function setFieldError(input, message) {
  input.setAttribute("aria-invalid", "true");
  const error = errorElementFor(input);
  if (error) {
    error.textContent = message;
    input.setAttribute("aria-describedby", error.id);
  }
}

function clearFieldError(input) {
  input.removeAttribute("aria-invalid");
  input.removeAttribute("aria-describedby");
  const error = errorElementFor(input);
  if (error) error.textContent = "";
}

function validateField(id) {
  const input = document.getElementById(id);
  const rule = fieldRules[id];
  const valid = rule.validate(input.value || "");
  if (valid) clearFieldError(input);
  else setFieldError(input, rule.message);
  return valid;
}

function focusInvalid(element) {
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY - 130;
  window.scrollTo({ top: Math.max(0, top), behavior: preferredScrollBehavior() });
  window.setTimeout(() => element.focus({ preventScroll: true }), 180);
}

function preferredScrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function validateCheckbox(id, message) {
  const input = document.getElementById(id);
  if (input.checked) {
    input.removeAttribute("aria-invalid");
    return true;
  }
  input.setAttribute("aria-invalid", "true");
  showAlert(message);
  focusInvalid(input);
  return false;
}

function validateStep(step, options = {}) {
  const announce = options.announce !== false;
  clearAlert();
  let valid = true;
  let firstInvalid = null;

  const checkFields = (ids) => {
    ids.forEach((id) => {
      const input = document.getElementById(id);
      if (!validateField(id)) {
        valid = false;
        if (!firstInvalid) firstInvalid = input;
      }
    });
  };

  if (step === 0) {
    checkFields(["participantName", "participantDob", "contactEmail", "contactPhone"]);
  } else if (step === 1) {
    valid = validateCheckbox("ack12", "Please confirm that paragraphs 1 and 2 have been read and accepted.");
  } else if (step === 2) {
    valid = validateCheckbox("ack34", "Please confirm that paragraphs 3 and 4 have been read and accepted.");
  } else if (step === 3) {
    valid = validateCheckbox("ack57", "Please confirm that paragraphs 5 to 7 have been read and accepted.");
  } else if (step === 4) {
    checkFields(["participantSignature"]);
    if (isMinor()) checkFields(["guardianName", "guardianSignature"]);
    const consent = document.getElementById("electronicConsent");
    if (!consent.checked) {
      valid = false;
      consent.setAttribute("aria-invalid", "true");
      if (!firstInvalid) firstInvalid = consent;
    } else {
      consent.removeAttribute("aria-invalid");
    }
  } else if (step === 5) {
    const finalConfirmation = document.getElementById("finalConfirmation");
    if (!finalConfirmation.checked) {
      valid = false;
      finalConfirmation.setAttribute("aria-invalid", "true");
      firstInvalid = finalConfirmation;
    } else {
      finalConfirmation.removeAttribute("aria-invalid");
    }
  }

  if (!valid && announce && !formAlert.textContent) {
    showAlert(step === 4
      ? "Please complete the required signature fields and confirm the electronic-signature statement."
      : step === 5
        ? "Please confirm that the signed agreement is ready to submit."
        : "Please complete all required fields before continuing.");
  }

  if (!valid && announce && firstInvalid) focusInvalid(firstInvalid);
  return valid;
}

function updateProgress() {
  stepButtons.forEach((button, index) => {
    const active = index === currentStep;
    button.toggleAttribute("aria-current", active);
    if (active) button.setAttribute("aria-current", "step");
    button.disabled = index > maxUnlockedStep;
    button.dataset.complete = completedSteps.has(index) ? "true" : "false";
  });

  progressText.textContent = `Section ${currentStep + 1} of ${TOTAL_STEPS}`;
  backButton.textContent = currentStep === 0 ? "← Start" : "← Back";
  nextButton.hidden = currentStep === TOTAL_STEPS - 1;
  submitButton.hidden = currentStep !== TOTAL_STEPS - 1;

  const activeButton = stepButtons[currentStep];
  if (activeButton) {
    const targetLeft = activeButton.offsetLeft - (progress.clientWidth - activeButton.offsetWidth) / 2;
    progress.scrollTo({ left: Math.max(0, targetLeft), behavior: preferredScrollBehavior() });
  }
}

function showStep(step, options = {}) {
  currentStep = Math.max(0, Math.min(TOTAL_STEPS - 1, step));
  stepCards.forEach((card, index) => {
    card.hidden = index !== currentStep;
  });
  clearAlert();
  updateGuardianRequirement();
  if (currentStep === TOTAL_STEPS - 1) populateReview();
  updateProgress();

  const activeCard = stepCards[currentStep];
  const formTop = formScreen.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: Math.max(0, formTop), behavior: "auto" });
  if (options.focus !== false) {
    const heading = activeCard.querySelector("h2");
    window.setTimeout(() => heading?.focus({ preventScroll: true }), 180);
  }
}

function startForm() {
  welcomeScreen.hidden = true;
  formScreen.hidden = false;
  window.scrollTo({ top: 0, behavior: "auto" });
  showStep(0);
}

function returnToWelcome() {
  formScreen.hidden = true;
  welcomeScreen.hidden = false;
  window.scrollTo({ top: 0, behavior: preferredScrollBehavior() });
  window.setTimeout(() => startButton.focus({ preventScroll: true }), 180);
}

function addReviewRow(label, value) {
  const row = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");
  term.textContent = label;
  description.textContent = value || "Not provided";
  row.append(term, description);
  reviewList.append(row);
}

function populateReview() {
  reviewList.replaceChildren();
  const age = participantAge();
  addReviewRow("Participant", valueOf("participantName"));
  addReviewRow("Date of birth", formatInputDate(participantDob.value));
  addReviewRow("Age at signing", age === null ? "Not available" : String(age));
  addReviewRow("Program or class", valueOf("programClass") || "Not specified");
  addReviewRow("Contact email", valueOf("contactEmail"));
  addReviewRow("Contact phone", valueOf("contactPhone"));
  addReviewRow("Participant signature", valueOf("participantSignature"));
  if (isMinor()) addReviewRow("Parent or guardian", valueOf("guardianName"));
  addReviewRow("Date signed", valueOf("participantSignedDate"));
}

function valueOf(id) {
  return document.getElementById(id).value.trim();
}

function formatInputDate(value) {
  const date = parseDateInput(value);
  return date ? formatDate(date) : value;
}

function generateReference() {
  const values = new Uint32Array(2);
  window.crypto.getRandomValues(values);
  const token = Array.from(values, (value) => value.toString(36).toUpperCase()).join("").slice(0, 10);
  return `LGW-${token}`;
}

function buildSubmission(reference, submittedAt) {
  const age = participantAge();
  const participantName = valueOf("participantName");
  const guardianRequired = isMinor();
  const guardian = guardianRequired ? valueOf("guardianName") : "Not required - participant is 18 or older";
  const summary = [
    `Reference: ${reference}`,
    `Agreement version: ${AGREEMENT_VERSION}`,
    `Participant: ${participantName}`,
    `Date of birth: ${participantDob.value}`,
    `Age at signing: ${age}`,
    `Program or class: ${valueOf("programClass") || "Not specified"}`,
    `Contact email: ${valueOf("contactEmail")}`,
    `Contact phone: ${valueOf("contactPhone")}`,
    `Participant signature: ${valueOf("participantSignature")}`,
    `Parent or guardian: ${guardian}`,
    `Parent or guardian signature: ${guardianRequired ? valueOf("guardianSignature") : "Not required"}`,
    `Signed date: ${valueOf("participantSignedDate")}`,
    "Paragraphs 1 and 2 acknowledged: Yes",
    "Paragraphs 3 and 4 acknowledged: Yes",
    "Paragraphs 5 to 7 acknowledged: Yes",
    "Electronic signature consent: Confirmed",
    `Submitted: ${submittedAt.toISOString()}`,
    `Source: ${window.location.origin + window.location.pathname}`
  ].join("\n");

  return {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: `Signed Participant Consent - ${participantName} - ${AGREEMENT_VERSION}`,
    from_name: "Leap Gymnastics Participant Consent Form",
    email: valueOf("contactEmail"),
    replyto: valueOf("contactEmail"),
    message: summary,
    "Reference": reference,
    "Agreement Version": AGREEMENT_VERSION,
    "Participant Name": participantName,
    "Participant Date of Birth": participantDob.value,
    "Participant Age at Signing": String(age),
    "Program or Class": valueOf("programClass") || "Not specified",
    "Contact Email": valueOf("contactEmail"),
    "Contact Phone": valueOf("contactPhone"),
    "Participant Signature": valueOf("participantSignature"),
    "Parent or Guardian Name": guardian,
    "Parent or Guardian Signature": guardianRequired ? valueOf("guardianSignature") : "Not required",
    "Signature Date": valueOf("participantSignedDate"),
    "Acknowledged Paragraphs 1 and 2": "Yes",
    "Acknowledged Paragraphs 3 and 4": "Yes",
    "Acknowledged Paragraphs 5 to 7": "Yes",
    "Electronic Signature Consent": "Confirmed",
    "Submitted At": submittedAt.toISOString(),
    "Source URL": window.location.origin + window.location.pathname,
    botcheck: valueOf("botcheck")
  };
}

async function submitAgreement(event) {
  event.preventDefault();
  clearAlert();

  for (let step = 0; step < TOTAL_STEPS; step += 1) {
    if (!validateStep(step, { announce: false })) {
      maxUnlockedStep = Math.max(maxUnlockedStep, step);
      showStep(step, { focus: false });
      validateStep(step, { announce: true });
      return;
    }
  }

  if (valueOf("botcheck")) return;

  const reference = generateReference();
  const submittedAt = new Date();
  const payload = buildSubmission(reference, submittedAt);
  let partyPayload = null;
  if (birthdayPartyId) {
    if (!birthdayContext) { showAlert("We could not verify the party link. Please reopen the guest link shared by your host."); return; }
    if (isMinor() && (!valueOf("guardianName").trim() || !valueOf("guardianSignature").trim())) { showAlert("Each participating child's parent or legal guardian must complete and sign the waiver."); return; }
    partyPayload = Object.fromEntries(["participantName", "participantDob", "contactEmail", "contactPhone", "participantSignature", "guardianName", "guardianSignature"].map(key => [key, valueOf(key)]));
    for (const key of ["ack12", "ack34", "ack57", "electronicConsent", "finalConfirmation"]) partyPayload[key] = document.getElementById(key).checked;
    partyPayload.agreementVersion = AGREEMENT_VERSION;
    partyPayload.submissionId = birthdaySubmissionId;
  }

  submitButton.disabled = true;
  submitButton.classList.add("is-loading");
  submitLabel.textContent = "Submitting securely...";

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(partyPayload ? BIRTHDAY_API + "/api/waivers?party=" + encodeURIComponent(birthdayPartyId) : SUBMISSION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(partyPayload ? { Authorization: "Bearer " + birthdayGuestToken } : {})
      },
      body: JSON.stringify(partyPayload || payload),
      signal: controller.signal
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success !== true) {
      throw new Error(result.message || result?.body?.message || "Submission was not accepted.");
    }

    document.getElementById("successParticipant").textContent = valueOf("participantName");
    document.getElementById("successReference").textContent = result.reference || reference;
    document.getElementById("successDate").textContent = `${formatDate(submittedAt)} at ${submittedAt.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })}`;
    form.hidden = true;
    progress.hidden = true;
    clearAlert();
    successScreen.hidden = false;
    window.scrollTo({ top: 0, behavior: preferredScrollBehavior() });
    window.setTimeout(() => document.getElementById("successTitle").focus({ preventScroll: true }), 180);
  } catch (error) {
    const message = error?.name === "AbortError"
      ? "The submission timed out. Check your connection and try again. Your form has not been cleared."
      : "We could not confirm delivery. Please try again. Your form has not been cleared.";
    showAlert(message);
    focusInvalid(formAlert);
  } finally {
    window.clearTimeout(timeout);
    submitButton.disabled = false;
    submitButton.classList.remove("is-loading");
    submitLabel.textContent = "Sign & submit agreement";
  }
}

startButton.addEventListener("click", startForm);

nextButton.addEventListener("click", () => {
  if (!validateStep(currentStep)) return;
  completedSteps.add(currentStep);
  maxUnlockedStep = Math.max(maxUnlockedStep, currentStep + 1);
  showStep(currentStep + 1);
});

backButton.addEventListener("click", () => {
  if (currentStep === 0) returnToWelcome();
  else showStep(currentStep - 1);
});

stepButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = Number(button.dataset.stepTarget);
    if (!button.disabled && target <= maxUnlockedStep) showStep(target);
  });
});

participantDob.addEventListener("input", updateGuardianRequirement);
participantDob.addEventListener("change", updateGuardianRequirement);

Object.keys(fieldRules).forEach((id) => {
  const input = document.getElementById(id);
  input.addEventListener("input", () => {
    if (input.hasAttribute("aria-invalid")) validateField(id);
  });
  input.addEventListener("blur", () => {
    if (input.required && input.value) validateField(id);
  });
});

["ack12", "ack34", "ack57", "electronicConsent", "finalConfirmation"].forEach((id) => {
  document.getElementById(id).addEventListener("change", (event) => {
    if (event.target.checked) {
      event.target.removeAttribute("aria-invalid");
      clearAlert();
    }
  });
});

form.addEventListener("submit", submitAgreement);
document.getElementById("printButton").addEventListener("click", () => window.print());

document.getElementById("currentYear").textContent = String(new Date().getFullYear());
participantDob.max = `${startOfToday().getFullYear()}-${String(startOfToday().getMonth() + 1).padStart(2, "0")}-${String(startOfToday().getDate()).padStart(2, "0")}`;
setSignatureDates();
updateGuardianRequirement();
updateProgress();


// A guest capability identifies the party but cannot read the host's private details.
const BIRTHDAY_API = "https://leap-birthday-party-form.pages.dev";
const birthdayPartyId = new URLSearchParams(location.search).get("party");
const birthdayFragment = new URLSearchParams(location.hash.slice(1));
let savedGuestToken=""; try { savedGuestToken=sessionStorage.getItem("leap-guest:" + birthdayPartyId)||""; } catch {}
const birthdayGuestToken = birthdayFragment.get("guest") || savedGuestToken;
let birthdayContext = null;
const birthdaySubmissionId = crypto.randomUUID();
if (birthdayFragment.has("guest")) {
  try { sessionStorage.setItem("leap-guest:" + birthdayPartyId, birthdayGuestToken); } catch {}
  // Keep the guest capability in the address so a copied link remains usable.
}
if (birthdayPartyId) {
  startButton.disabled = true;
  fetch(BIRTHDAY_API + "/api/guest?party=" + encodeURIComponent(birthdayPartyId), { headers: { Authorization: "Bearer " + birthdayGuestToken } })
    .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Party link not available"); return data; })
    .then(data => {
      birthdayContext = data;
      document.getElementById("programClass").value = data.title;
      document.getElementById("programClass").readOnly = true;
      const note = document.createElement("p"); note.textContent = data.title; startButton.before(note);
      startButton.disabled = false;
      const shareUrl = location.origin + location.pathname + location.search + '#guest=' + encodeURIComponent(birthdayGuestToken);
      const share = document.createElement('button');
      share.type = 'button'; share.textContent = 'Copy guest waiver link';
      startButton.after(share);
      const feedback = document.createElement('p'); feedback.setAttribute('role','status'); share.after(feedback);
      share.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(shareUrl); feedback.textContent = 'Link copied. You can send it to the other families attending this party.'; }
        catch { const field=document.createElement('input');field.readOnly=true;field.value=shareUrl;field.setAttribute('aria-label','Guest waiver link');feedback.replaceChildren(field);field.select(); }
      });
    })
    .catch(() => {
      const note = document.createElement("p"); note.textContent = "This link is incomplete or is no longer available. Please ask your party host to send the full guest waiver link from their booking email. If you still need help, email info@leapgymnastics.ca."; startButton.before(note);
    });
}
