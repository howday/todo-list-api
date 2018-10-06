/**
 *Collections of helper method
 */

module.exports = {

    getResetCode: function () {
        return Math.floor(100000 + Math.random() * 900000);
    },

    validateResetCode: function (code) {
        let timeInMillis = Math.abs((Date.now() - code.generated_date.getTime()) / 1000);
        return timeInMillis < 1800 && code.status === 'ACTIVE';

    }
};
