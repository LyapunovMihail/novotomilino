import { USER_ID } from './authorization.config';
import { Schema } from 'mongoose';
export var userSchema = new Schema({
    _id: {
        type: String,
        default: USER_ID
    },
    login: String,
    password: String
});
//# sourceMappingURL=authorization.schema.js.map