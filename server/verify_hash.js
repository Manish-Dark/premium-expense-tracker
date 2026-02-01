const bcrypt = require('bcryptjs');

const hash = '$2a$10$EfZeLW0wVoBuzyjWWqqVfeHvk95kSmkcUTAOtX/s.EcNbnb1XyVsC';
const candidates = ['123', 'rahul', 'rahul123', 'password', 'admin', '123456', 'user'];

(async () => {
    for (const c of candidates) {
        const match = await bcrypt.compare(c, hash);
        if (match) {
            console.log(`FOUND IT! The password is: ${c}`);
            return;
        }
    }
    console.log("None of the candidates matched.");
})();
