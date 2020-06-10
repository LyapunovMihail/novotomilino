/**
 * Created by pichuser on 4/14/2019.
 */
var IS_DEVELOPMENT_MODE = (process.env && process.env.IS_DEVELOPMENT) || false;
export var SERVER_CONFIGURATIONS = {
    PORT: (process.env && process.env.PORT) || 3002,
    HOST: (process.env && process.env.HOST) || 'localhost',
    IS_DEVELOPMENT_MODE: IS_DEVELOPMENT_MODE,
    MONGODB_CONNECTION: "mongodb://localhost:27017/" + ((process.env && process.env.BASE_NAME) || 'novotomilino'),
    // MONGODB_CONNECTION:  'mongodb+srv://pichuser:RJDRGJwA6M1yPWjH@cluster0-ikucm.mongodb.net/test?retryWrites=true', //`mongodb://localhost:27017/${(process.env && process.env.BASE_NAME)}`,
    DIST_FOLDER: process.cwd(),
};
//# sourceMappingURL=configuration.js.map