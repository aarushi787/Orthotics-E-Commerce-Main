#!/usr/bin/env node
const { spawnSync } = require('child_process');

function die(msg) {
  console.error(msg);
  process.exit(1);
}

const secretFromEnv = process.env.SENDGRID_API_KEY;
const secretFromArg = process.argv[2];
const secret = secretFromEnv || secretFromArg;

if (!secret) {
  die('No SENDGRID_API_KEY provided. Set environment variable SENDGRID_API_KEY or pass it as the first argument.');
}

const project = process.env.FIREBASE_PROJECT || 'prod';

console.log('Setting secret SENDGRID_API_KEY in Firebase project:', project);

const args = ['functions:secrets:set', 'SENDGRID_API_KEY', '--project', project, '--data', secret];

const res = spawnSync('firebase', args, { stdio: 'inherit' });

if (res.error) {
  die('Failed to run firebase CLI: ' + res.error.message);
}

process.exit(res.status ?? 0);
