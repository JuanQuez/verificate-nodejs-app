const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const EmailCode = require('../models/EmailCode');

const getAll = catchError(async (req, res) => {
    const results = await User.findAll();
    return res.json(results);
});

const create = catchError(async (req, res) => {
    const { firstName, lastName, country, email, image, password, frontBaseUrl } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({
        firstName,
        lastName,
        email,
        country,
        image,
        password: hashedPassword
    })

    const code = require('crypto').randomBytes(32).toString("hex")
    const userLink = `${frontBaseUrl}/verify_email/${code}`

    await sendEmail({
        to: email,
        subject: "¡Your account has verified!",
        html: `
            <h1>¡WELCOME TO COVENANT! ${firstName}</h1>
            <b>Espero disfrutes del gran comercio de los videojuegos</b>
            <a href="${userLink}" target="_blank">${userLink}</a>
            <h3>Tank you</h3>
        `
    })

    await EmailCode.create({ code, userId: userLink });

    return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id);
    if (!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async (req, res) => {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
    const { id } = req.params;
    const result = await User.update(
        req.body,
        { where: { id }, returning: true }
    );
    if (result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const verifyCode = catchError(async (req, res) => {
    const { code } = req.params;
    const codeFound = await EmailCode.findOne({ where: { code } });
    if (!codeFound) return res.status(401).json({ message: 'Invalid Code' });
    const user = await User.update(
        { isVerified: true },
        { where: { id: codeFound.userId }, returning: true }
    );

    await codeFound.destroy();
    return res.json(user)
});


const login = catchError(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "invalid credentials" });
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "invalid credentials" });
    if (!user.isVerified) return res.status(401).json({ error: "Not has verified your email, verify please" });

    const token = jwt.sign(
        { user },
        process.env.TOKEN_SECRET,
        { expiresIn: '5m' }
    )

    return res.json({ user, token });
});

const loggedUser = catchError(async(req, res) => {
    const user = req.user;
    return res.json(user);
})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    verifyCode,
    login,
    loggedUser
}