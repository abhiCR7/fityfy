/**
 * Created by hari on 10/09/16.
 */


var registerGoogleUser = function (accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //     return done(err, user);
    // });
    console.log(accessToken, refreshToken, profile);
    done();
};
module.exports = {
    registerGoogleUser :  registerGoogleUser
}