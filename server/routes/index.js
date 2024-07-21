const googleRouter = require('./authGoogle');
const authRouter = require('./auth');

const routes = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/auth', googleRouter);

}

module.exports = routes;
