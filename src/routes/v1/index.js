const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const convRoute = require('./conversation.route');
const groupRoute = require('./group.route');
const waitlistRoute = require('./waitlist.route');
const noteRoute = require('./note.route');
const docsRoute = require('./docs.route');
const transactionRoute = require('./transaction.route');
const utilRoute = require('./utils.route');

const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/conv',
    route: convRoute,
  },
  {
    path: '/group',
    route: groupRoute,
  },
  {
    path: '/waitlist',
    route: waitlistRoute,
  },
  {
    path: '/note',
    route: noteRoute,
  },
  {
    path: '/transaction',
    route: transactionRoute,
  },
  {
    path: '/util',
    route: utilRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
