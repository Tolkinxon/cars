import pkg from 'jsonwebtoken';
const  { sign, verify } = pkg;


export const tokenService = {
    createAccessToken: (payload) => sign(payload,  process.env.ACCESS_TOKEN_KEY, {expiresIn: '30s'}),
    verifyAccessToken: (token) => verify(token, process.env.ACCESS_TOKEN_KEY),
    createRefreshToken: (payload) => sign(payload, process.env.REFRESH_TOKEN_KEY, {expiresIn: '30d'}),
    verifyRefreshToken: (token) => verify(token, process.env.REFRESH_TOKEN_KEY)
}