const mjml = require('mjml');
const { resolve } = require('path');
const { readFileSync } = require('fs');
const { compile } = require('handlebars');

/**
 * Require all templates and compile them
 */

const welcomeWaitlist = readFileSync(resolve(__dirname, '../templates/added-to-waitlist.mjml')).toString();

const welcomeWaitlistTemplate = compile(mjml(welcomeWaitlist).html);

module.exports = {
  welcomeWaitlistTemplate,
};
