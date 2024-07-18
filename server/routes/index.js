const googleRouter = require('./authGoogle');

const routes = (app) => {
    app.use('/api/auth', googleRouter);
}

module.exports = routes;
