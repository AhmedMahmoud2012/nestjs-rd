import { Test } from "@nestjs/testing"
import { UserRepository } from "./user.repository"
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
const mockCredentialDto = { username: 'ahmed', password: 'ahmedKesha!123' };
describe('User Repository', () => {
    let userRepository;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UserRepository]
        }).compile();
        userRepository = module.get<UserRepository>(UserRepository);
    });

    describe('Signup', () => {
        let save;
        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockResolvedValue({ save })
        });

        it('successfully signs up the user', () => {
            save.mockResolvedValue(undefined);
            expect(userRepository.signUp(mockCredentialDto)).resolves.not.toThrow();
        });

        it('Throws a conflict exception as username already exists', () => {
            save.mockRejectedValue({ code: '23505' });
            expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(ConflictException);
        });

        it('Throws 500 error', () => {
            save.mockRejectedValue({ code: '23503455' });
            expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('validateUserPassword', () => {
        let user;

        beforeEach(() => {
            userRepository.findOne = jest.fn();
            user = new User();
            user.username = 'ahmed';
            user.validatePassword = jest.fn();
        });
        it('returns the username as validation is successful', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);
            const result = await userRepository.validateUserPassword(mockCredentialDto);
            expect(result).toEqual('ahmed')
        })

        it('returns null user not found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            const result = await userRepository.validateUserPassword(mockCredentialDto);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toBeNull();
        })

        it('returns null password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(false);
            const result = await userRepository.validateUserPassword(mockCredentialDto);
            expect(user.validatePassword).toHaveBeenCalled();
            expect(result).toBeNull();
        })
    });

    describe('hashPassword', () => {
        it.skip('calls bcrypt.hash to generate a hash', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('testhash');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await userRepository.hashPassword('testPassword', 'testSalt');
            //expect(result).rejects.toThrow();
            expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
            expect(result).toEqual('testhash')
        })
    });
})