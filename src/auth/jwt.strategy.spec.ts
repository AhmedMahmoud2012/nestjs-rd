import { JwtStrategy } from "./jwt.strategy";
import { Test } from "@nestjs/testing";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";
import { UnauthorizedException } from "@nestjs/common";


const mockUserRepositoy = () => ({
    findOne: jest.fn(),
});
describe('JWT Strategy', () => {

    let jwtStrategy: JwtStrategy;
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [JwtStrategy, { provide: UserRepository, useFactory: mockUserRepositoy }]
        }).compile();

        jwtStrategy = module.get(JwtStrategy);
        userRepository = module.get(UserRepository);
    });

    describe('validate', () => {
        it('validate and returns the user by jwt', async () => {
            const user = new User();
            user.username = 'TestUser';
            userRepository.findOne.mockResolvedValue(user);
            const result = await jwtStrategy.validate({ username: 'TestUser' });
            expect(userRepository.findOne).toHaveBeenCalledWith({ username: 'TestUser' });
            expect(result).toEqual(user);
        });

        it('Throw Error If invalid jwt', async () => {
            userRepository.findOne.mockResolvedValue(null);
            expect(jwtStrategy.validate({ username: 'TestUser' })).rejects.toThrow(UnauthorizedException)
        });
    })
});