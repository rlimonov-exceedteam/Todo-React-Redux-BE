module.exports = class UserDto {
    id;

    constructor(model) {
        this.login = model.login;
        this.id = model._id;
    }
}