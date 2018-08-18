/**
 * Created by suresh on 8/17/18.
 */


module.exports = function (app) {
    const user = require('../controllers/UserController');

    app.route('/users').get(user.list_all_users);
    app.route('/user').post(user.register_user);
    app.route('/user/:id').get(user.get_user);
    app.route('/user/:id').post(user.update_user);
    app.route('/user/:id').delete(user.delete_user);

}


