export default {
    rootPath: process.env.NODE_ENV === 'development'
    ?'http://localhost:8800/api':''
    // rootPath: 'http://localhost:6969'
};