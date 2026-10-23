// Migration: synthetic reservation ID. Restore the authorized private override before deployment.
// October 25 reservation: Deluxe requires at least one week's notice.
// This changes available choices only; it never changes a confirmed package
// or writes booking/email records.
const restrictedParty = '00000000-0000-4000-8000-000000000025';
export function restrictPackageChoices(party) {
 if(party.id !== restrictedParty || !party.packageChoiceNeeded) return party;
 return {...party, unavailablePackages:['Deluxe'], packageAvailabilityNote:'Deluxe requires at least one week’s notice and is no longer available for your party date. Please choose Basic or Premium.'};
}
export function isRestrictedParty(id) { return id === restrictedParty; }
