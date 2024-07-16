const googleRouter = require('./authGoogle');

const routes = (app) => {
    app.use('/api/comment', googleRouter);
}

module.exports = routes;
