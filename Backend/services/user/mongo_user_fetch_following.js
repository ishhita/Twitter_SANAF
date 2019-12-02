const UserModel = require('../../models/users');

module.exports.getFollowing = function (req, callback) {
    const  id  = req.id;
    console.log(id);
    UserModel.findById(id,
        function (err, model) {
            callback(null, model.following);
        }
    ).populate('following');
}

module.exports.getFollowers = function (req, callback) {
    const  id  = req.id;
    UserModel.findById(id, 'followedBy',
        function (err, model) {
            callback(null, model.followedBy);
        }
    ).lean();
}