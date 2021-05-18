import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const userSchema = Schema({});

const User = model('User', userSchema);

export default User;
