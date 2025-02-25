import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// Define the user schema
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      maxlength: 30,
    },
    role: {
      type: String,
      enum: {
        values: ["customer", "vendor"],
      },
      default: "customer",
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    phoneNumber: {
      type: Number,
      unique: true,
      validate: {
        validator: Number.isInteger,
        message: (props) => `${props.value} must be an integer!`,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose Middleware for Password Hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(8);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// FILTER ALL ACTIVE USER ACCOUNT
// userSchema.pre(/^find/, function (next) {
//   this.find({ status: { $ne: "Inactive" } });
//   next();
// });

// Method to verify password
userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Method to generate JWT
userSchema.methods.generateToken = function () {
   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
     expiresIn: '1d', // Token expires in 1 day
   });
};

// Export the User model
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
