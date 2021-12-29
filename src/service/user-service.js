const UserModel = require('.././db/models/user-schema');
const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const ApiError = require('../exceptions/api-error');
const UserDto = require('../dtos/user-dto');

class UserService {
    async registration(login, password) {
        const candidate = await UserModel.findOne({ login });

        if (candidate) {
            throw ApiError.BadRequest(`User with login ${login} already exists.`);
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const user = await UserModel.create({login, password: hashPassword});
        
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
        return {...tokens, user: userDto}
    }   

    async login(login, password) {
        const user = await UserModel.findOne({login});

        if (!user) {
            throw ApiError.BadRequest('User is not found');
        }

        const arePassEquals = await bcrypt.compare(password, user.password);
    
        if (!arePassEquals) {
            throw ApiError.BadRequest('Password dismatch');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshtoken) {
        if (!refreshtoken) {
            throw ApiError.UnauthorizedError('No token is sended');
        }

        const userData = tokenService.validateRefreshToken(refreshtoken);
        const tokenFromDb = await tokenService.findToken(refreshtoken);

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError('Unauthorized');
        }
        

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
        return {...tokens, user: userDto}
    }
}

module.exports = new UserService();