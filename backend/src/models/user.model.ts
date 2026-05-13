import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";


interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  refreshToken?: string | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  fullName: {
    type: String,
    minlength: 2,
    maxlength: 50,
    required: [true, "Full name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false
  },
  refreshToken: {
    type: String,
    select: false,
    default: null
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;