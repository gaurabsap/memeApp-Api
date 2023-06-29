const bcrypt = require('bcrypt')


class haspass{
    static hash = async(pass) => {
        const newpass = await bcrypt.hash(pass, 10);
        return newpass;
    }

    static compare = async(pass, hashpass) => {
        const isMatch = await bcrypt.compare(pass, hashpass)
        return isMatch;
    }
}

module.exports = haspass;