import {spawnSync} from 'node:child_process';
const tests=['tools/build_birthday_qc_20261016.mjs','output/birthday-qc-20261016/test.mjs','output/birthday-qc-20261016/test-forms.mjs','output/birthday-qc-20261016/test-invoices.mjs','tools/test_birthday_portal_20261022.mjs','tools/test_birthday_mail_recovery_20261022.mjs','tools/test_birthday_calendar_alias_20261021.mjs','tools/test_birthday_package_restriction_20261021.mjs'];
for(const test of tests){const r=spawnSync(process.execPath,[test],{stdio:'inherit',env:{...process.env,LEAP_WORKSPACE:process.cwd()}});if(r.status!==0)process.exit(r.status||1);}
console.log('All offline suites passed. No deployment or customer messages.');
