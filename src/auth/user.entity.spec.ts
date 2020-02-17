import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User Entity', () => {
    let user;

    beforeEach(() => {
        user = new User();
        user.salt = "testSalt";
        user.password = "ahmed";
        bcrypt.hash = jest.fn();
    });
    describe('validaePassword', () => {
        it('return true the password is valid', async () => {
            bcrypt.hash.mockReturnValue('ahmed');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('ahmed');
            expect(bcrypt.hash).toHaveBeenCalledWith('ahmed', 'testSalt');
            expect(result).toEqual(true);

        });

        it('return false the password is invalid', async () => {
            bcrypt.hash.mockReturnValue('wrongPassword');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('ahmed');
            expect(bcrypt.hash).toHaveBeenCalledWith('ahmed', 'testSalt');
            expect(result).toEqual(false);
        });
    })
});