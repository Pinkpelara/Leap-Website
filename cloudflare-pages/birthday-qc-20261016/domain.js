export const DAY = 864e5;
export const PACKAGES = Object.freeze({
  Basic: { price: 350, included: 10, extraChild: 15, gym: 60, celebration: 60, room: "Designated celebration area; no private party room", balloons: "No included balloon decoration", gift: null },
  Premium: { price: 550, included: 16, extraChild: 20, gym: 75, celebration: 45, room: "Private party room throughout your booking", balloons: "Small tabletop balloon arrangement on a stand, in one colour", gift: "Loot bag" },
  Deluxe: { price: 750, included: 22, extraChild: 25, gym: 75, celebration: 45, room: "Private party room throughout your booking", balloons: "A cheerful balloon bouquet with a cuddly stuffed animal, in one or two colours", gift: "Loot bag and surprise birthday gift" }
});
export const PACKAGE_UPDATE_MS = 1791055719078;
export const DRINK_DESCRIPTION = "A selection of ready-to-drink beverages, including assorted juice pouches or mini boxes and flavoured or plain bottled waters. Offerings vary based on current availability.";
export const OCTOBER5_PACKAGE_MS = 1791172800000;
export const OCTOBER5_PACKAGES = Object.freeze({
  Basic: {price:450,included:10,maxChildren:16,extraChild:25,gym:60,celebration:45,room:"Private party room throughout your booking",balloons:"No included balloon decoration",gift:null,tableware:"Plain white",drinkDescription:"A selection of juice, soft drinks and bottled water for children and adults. Selection varies based on availability.",newPolicy:true},
  Premium: {price:600,included:16,maxChildren:22,extraChild:25,gym:75,celebration:45,room:"Private party room throughout your booking",balloons:"Small tabletop balloon arrangement on a stand, in one colour",gift:"Surprise birthday gift",tableware:"Birthday designs selected by Leap; no custom themes",drinkDescription:"A selection of juice, soft drinks and bottled water for children and adults. Selection varies based on availability.",newPolicy:true},
  Deluxe: {price:800,included:22,maxChildren:22,extraChild:null,gym:75,celebration:60,room:"Private party room throughout your booking",balloons:"Full-height half balloon garland, in one or two colours",gift:"Loot bag and upgraded surprise birthday gift",tableware:"Birthday designs selected by Leap; no custom themes",drinkDescription:"A selection of juice, soft drinks and bottled water for children and adults. Selection varies based on availability.",newPolicy:true}
});
export const CURRENT_PRICE_MS = 1791264023000;
export const CURRENT_PRICES = Object.freeze({Basic:400,Premium:589,Deluxe:789});
export const REVISED_PRICE_MS = 1791305338063;
export const REVISED_PRICES = Object.freeze({Basic:399,Premium:589,Deluxe:849});
export function packageConfig(p) {
  const snapshot=JSON.parse(p.extras || "{}").booking?.config;
  if(snapshot) return snapshot;
  if (Number.isFinite(p.booked_at) && p.booked_at >= OCTOBER5_PACKAGE_MS) {
    const c = OCTOBER5_PACKAGES[p.package];
    if (c && p.booked_at >= REVISED_PRICE_MS) return {...c, price:REVISED_PRICES[p.package], favourDescription:'One small bag per participating child containing two or three party favours, such as stickers, erasers or mini fidget toys. Contents vary.', gift:p.package === "Deluxe" ? "Mini Party Favour Bag and upgraded surprise birthday gift" : c.gift};
    return c && p.booked_at >= CURRENT_PRICE_MS ? {...c, price:CURRENT_PRICES[p.package]} : c;
  }
  const c = PACKAGES[p.package];
  if (!c) return undefined;
  const old = !p.booked_at || p.booked_at < PACKAGE_UPDATE_MS;
  const priorGift = {Basic:"Loot bag",Premium:"Loot bag and surprise birthday gift",Deluxe:"Loot bag and upgraded surprise birthday gift"};
  return {...c, gift: !p.booked_at || p.booked_at < 1790742455000 ? priorGift[p.package] : c.gift, ...(old && p.package === "Deluxe" ? {included:20, balloons:"Half balloon garland, in one or two colours"} : {}), drinkDescription: old ? "" : DRINK_DESCRIPTION};
}
export const COLOURS = ["White", "Pink", "Blue", "Gold", "Purple", "Green"];
export const NOTES = {
  food: "Please bring food ready to serve, such as pizza, sandwiches, fruit, packaged snacks, cake or cupcakes. Ice cream, hot catered meals, buffets, heavily sauced foods and anything requiring reheating are not permitted. An adult in your group receives deliveries and serves food and cake. Our coaches lead the gym activities.",
  decor: "You are welcome to bring decorations that sit on a table or stand on their own and fit within the existing setup. Please do not attach decorations to walls or fixtures. Your family puts out and takes home any decorations you bring. We prepare a fixed setup for your package; additional tables, furniture changes and staff setup of decorations brought from home are not available.",
  space: "Parents and accompanying adults are welcome. Our celebration space has limited seating, so please keep accompanying adults to a minimum where possible. Seating may not be available for everyone. Please share this with your guests when sending invitations.",
  timing: "The hosting family may arrive up to 10 minutes early; guests arrive at the booked start time. A birthday host parent must stay throughout the party. Please allow time for packing and goodbyes before your confirmed finish time. Leap takes care of the included cleanup. The party finishes at the time shown in your booking. We do not offer additional time. If departure runs late, the existing charge is $40 + HST for each 30 minutes or part of it, to cover the delay in preparing the facility. Please plan to leave at your confirmed finish time.",
  payment: "Your booking receipt shows the deposit paid. The remaining balance, including applicable HST, additional children and confirmed extras, is payable during your party by e-transfer to info@leapgymnastics.ca."
};
export function deadline(p) {
  return JSON.parse(p.extras || "{}").booking?.detailsDeadline ?? p.start_at - 7 * DAY;
}
export function optionalDeadline(p) {
  return deadline(p);
}
export function formatDate(ms) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", dateStyle: "full", timeStyle: "short" }).format(ms);
}
export function torontoTime(date, time) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !match) throw Error("Unrecognized booking time");
  if (Number(match[1]) < 1 || Number(match[1]) > 12 || Number(match[2]) > 59 || (/* @__PURE__ */ new Date(date + "T12:00:00Z")).toISOString().slice(0, 10) !== date) throw Error("Invalid booking date or time");
  const hour = Number(match[1]) % 12 + (match[3].toUpperCase() === "PM" ? 12 : 0);
  const target = Date.parse(date + "T" + String(hour).padStart(2, "0") + ":" + match[2] + ":00Z");
  let guess = target;
  for (let i = 0; i < 3; i++) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(guess).map((p) => [p.type, p.value]));
    const rendered = Date.parse(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`);
    guess += target - rendered;
  }
  return guess;
}
export function validateDetails(p, input, now = Date.now(), legalKeys = []) {
  const errors = [];
  const d = {};
  const config = packageConfig(p);
  const str = (key, label, required = true, max = 120) => {
    const v = typeof input[key] === "string" ? input[key].trim() : "";
    if (required && !v || v.length > max) errors.push(label);
    d[key] = v;
  };
  const integer = (key, label, min, max) => {
    const v = Number(input[key]);
    if (input[key] === "" || input[key] === void 0 || !Number.isInteger(v) || v < min || v > max) errors.push(label);
    d[key] = v;
  };
  str("childName", "Please enter the birthday child’s full name.");
  integer("childAge", "Please enter the child’s age on the party date (1–18).", 1, 18);
  const maximum = config?.maxChildren ?? 24;
  integer("children", `Please enter the number of participating children (1–${maximum}), including the birthday child.`, 1, maximum);
  d.adults = JSON.parse(p.details || "null")?.adults ?? JSON.parse(p.extras || "{}").booking?.initialDetails?.adults ?? 0;
  str("ageRange", "Please enter the children’s age range.");
  str("support", "Please keep allergy and support information under 1,500 characters.", false, 1500);
  str("phone", "Please enter the parent or guardian’s phone number.", true, 40);
  if(d.phone.replace(/\D/g, "").length<7) errors.push("Please check your phone number.");
  if (!["Yes", "No", "Not sure yet"].includes(input.independent)) errors.push("Please indicate whether every child can participate without a parent or caregiver.");
  d.independent = input.independent;
  d.independentAcknowledged = input.independentAcknowledged === true;
  if (d.independent !== "Yes" && !d.independentAcknowledged) errors.push("Please confirm that you have read the participation requirements.");
  d.colours = Array.isArray(input.colours) ? input.colours.filter(Boolean) : [];
  if (p.package === "Basic") d.colours = [];
  else if (d.colours.length < 1 || d.colours.length > (p.package === "Premium" ? 1 : 2) || new Set(d.colours).size !== d.colours.length || d.colours.some((c) => !COLOURS.includes(c))) errors.push(p.package === "Premium" ? "Please choose one balloon colour." : "Please choose one or two balloon colours.");
  d.loot = Number(input.loot || 0);
  if (!Number.isInteger(d.loot) || d.loot < 0 || d.loot > (config?.newPolicy ? 22 : 24)) errors.push(`${config?.favourDescription ? "Mini Party Favour Bags" : "Loot bags"}: enter a whole number from zero to ${config?.newPolicy ? 22 : 24}`);
  if (config?.newPolicy && p.package === "Deluxe" && d.loot !== 0) errors.push(config?.favourDescription ? "Deluxe includes one Mini Party Favour Bag per participating child; additional bags are not available." : "Deluxe includes one loot bag per participating child; additional loot bags are not available.");
  d.beverages = p.package === "Premium" && input.beverages === true;
  const priorDetails = JSON.parse(p.details || "null") || JSON.parse(p.extras || "{}").booking?.initialDetails || {};
  d.extraMinutes = priorDetails.extraMinutes || 0;
  d.theme = priorDetails.theme || "";
  d.themed = !!priorDetails.themed;
  if (input.extraMinutes !== undefined && Number(input.extraMinutes) !== d.extraMinutes || input.themed !== undefined && input.themed !== d.themed || input.theme !== undefined && String(input.theme) !== d.theme) errors.push("Themes and additional time are not available. Previously recorded arrangements are kept unchanged.");
  const before = priorDetails;
  if (now > optionalDeadline(p)) {
    for (const k of ["loot", "beverages", "colours"]) {
      if (k === "colours" && !before.colours?.length) continue;
      const prior = before?.[k] ?? { loot: 0, beverages: false, colours: [] }[k];
      if (JSON.stringify(d[k]) !== JSON.stringify(prior ?? [])) errors.push("The deadline for optional extras has passed; keep the previously submitted extras");
    }
  }
  const foodChoices = ["No food", "Pizza", "Sandwiches", "Fruit or vegetables", "Packaged snacks", "Cake or cupcakes"];
  d.food = Array.isArray(input.food) ? [...new Set(input.food)] : [];
  if (!d.food.length || d.food.some(x => !foodChoices.includes(x)) || d.food.includes("No food") && d.food.length > 1) errors.push("Please select the food you plan to bring, or select “We won’t be serving food.”");
  d.delivery = input.delivery === true;
  d.foodAdult = typeof input.foodAdult === "string" ? input.foodAdult.trim() : "";
  if (d.foodAdult.length > 120 || !d.food.includes("No food") && !d.foodAdult) errors.push("Name the adult who will receive deliveries and serve food and cake.");
  d.decor = input.decor;
  if (!["Use the included setup", "Bring tabletop or freestanding decorations"].includes(d.decor)) errors.push("Choose your decoration plan.");
  d.agreements = {};
  for (const k of legalKeys) {
    d.agreements[k] = input.agreements?.[k] === true;
    if (!d.agreements[k]) errors.push("Please complete the confirmations at the end of the form.");
  }
  d.roster = Array.isArray(input.roster) ? input.roster.map((n) => String(n).trim()).filter(Boolean) : [];
  if (d.roster.length > maximum || d.roster.some((n) => n.length > 120)) errors.push(`Guest list: up to ${maximum} children`);
  if (new Set(d.roster.map((n) => n.toLocaleLowerCase())).size !== d.roster.length) errors.push("Remove duplicate guest names");
  if (!config) errors.push("Booking package unavailable");
  return { details: d, errors: [...new Set(errors)] };
}
export function waiverStatus(roster, waivers) {
  const key = (n) => n.trim().normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, " ");
  return roster.map((name) => {
    const matches = waivers.filter((w) => key(w.child_name) === key(name));
    return { name, status: matches.length === 1 ? "received" : matches.length ? "check" : "needed" };
  });
}
export function reminderSchedule(p) {
  const due = deadline(p);
  // One form reminder, plus the separately scheduled two-day consent reminder.
  const times = [{kind:"details-eight",at:due-DAY}];
  return times.filter(x => x.at >= p.booked_at && x.at < p.start_at);
}
