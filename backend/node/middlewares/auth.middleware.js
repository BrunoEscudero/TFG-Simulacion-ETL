const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del encabezado

    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó un token.' });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Asigna los datos del usuario decodificados a req.user

        console.log('Usuario autenticado:', req.user); // Log para depuración
        next();  // Continuar al siguiente middleware o controlador
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
};

const generateToken = (user) => {
    const payload = {
        id: user.id,
        rol: user.rol,  // Incluye el rol en el token
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = authenticate;
