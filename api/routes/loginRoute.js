/**
 * Created by suresh on 8/13/18.
 */


module.exports = function (app) {
    var auth = require('../controllers/authController');

    app.route('/login').post(auth.login);
    app.route('/users').get(auth.list_all_users);
    app.route('/user').post(auth.register_user);

}
