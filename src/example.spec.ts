class FriendsList {
    friends = [];

    addFriend(name) {
        this.friends.push(name);
        this.announceFriendship(name);
    }

    announceFriendship(name) {
        global.console.log(`${name} is now a friend!`)
    }

    removeFriend(name) {
        const idx = this.friends.indexOf(name);
        if (idx === -1) {
            throw new Error('not found');
        }
        this.friends.splice(idx, 1);
    }
}

// tests

describe('Friends List', () => {
    let friendsList;

    beforeEach(() => {
        friendsList = new FriendsList();
    });
    it('initializes friends list', () => {
        expect(friendsList.friends.length).toEqual(0);
    });

    it('adds a friend to the list', () => {
        friendsList.addFriend('ahmed');
        expect(friendsList.friends.length).toEqual(1);
    });

    it('announce Friendship', () => {
        // Mock
        friendsList.announceFriendship = jest.fn();
        friendsList.addFriend('ahmed');
        expect(friendsList.announceFriendship).toHaveBeenCalledWith('ahmed');
    });

    describe('removeFriend', () => {
        it('remove a friend from the list', () => {
            friendsList.addFriend('ahmed');
            expect(friendsList.friends[0]).toEqual('ahmed');
            friendsList.removeFriend('ahmed')
            expect(friendsList.friends[0]).toBeUndefined();
        });
        it('throw an error as friend doesnt exist', () => {
            expect(() => friendsList.removeFriend('ahmed')).toThrow(new Error('not found'));
        })
    })

});