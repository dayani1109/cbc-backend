import axios from "axios";
import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import OTP from "../models/otpModel.js";
import getDesignEmail from "../lib/emailDesigner.js"


dotenv.config();
//transporter email geniyann hadanva
const transporter = nodemailer.createTransport({//me okkoma default eva meva wenas karann ona na
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
    },
});

export function createUser(req, res) {

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    const user = new User(
        {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword
        }
    )

    user.save().then(
        () => {
            res.json({
                message: "User created successfully"
            })
        }
    ).catch(
        () => {

            res.json({
                message: "Fail to create user"
            })
        }
    )
}

export function loginUser(req, res) {

    User.findOne(//me email ekt gelapena 1kenek innvd kiyala check karanava findone ekem
        {
            email: req.body.email
        }
    ).then(
        (user) => {//e email ekt user kenek hamba unad kiyala balann ona
            if (user == null) {
                res.status(404).json(
                    {
                        message: "User not found"
                    }
                )

            } else {
                if (user.isBlock) {
                    res.status(403).json({
                        message: "Your account has been blocked. Please contact admin.",
                    });
                    return;
                }
                const isPasswordMatching = bcrypt.compareSync(req.body.password, user.password)

                if (isPasswordMatching) {

                    const token = jwt.sign(
                        {
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            role: user.role,
                            isEmailVerified: user.isEmailVerified,
                            image: user.image,
                        },
                        process.env.JWT_SECRET
                    )

                    res.json(
                        {
                            message: "Login successful",
                            token: token,
                            user: {
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role,
                                isEmailVerified: user.isEmailVerified,

                            }
                        }
                    )
                } else {
                    res.status(500).json(
                        {
                            message: "Invalid password"
                        }
                    )
                }

            }
        }
    )
}

export function isAdmin(req) {

    //only admin user can ->
    if (req.user == null) {
        // res.status(401).json({
        //     message:"please login and try again"
        // });
        return false; //pahala code tika run vena eka methanin ehat navathinva
    }

    if (req.user.role != "admin") {
        // res.status(403).json({
        //     message:"you are not authorized to create a product"
        // });
        return false;
    }

    return true;

}

export function isCustomer(req) {
    if (req.user == null) {
        return false;
    }
    if (req.user.role != "user") {
        return false;
    }

    return true;
}

export function getUser(req, res) {
    if (req.user == null) {
        res.status(404).json(
            {
                message: "Unauthorized"
            }
        )
        return
    } else {
        res.json(
            req.user
        )
    }
}

export async function googleLogin(req, res) {

    const token = req.body.token;

    if (token == null) {
        res.status(400).json({
            message: "Token is required",
        });
        return;
    }

    try {
        const googleResponse = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const googleUser = googleResponse.data

        const user = await User.findOne({
            email: googleUser.email
        })

        if (user == null) {//user kenek nathnm eyat aluthem account ekk hadann ona

            const newUser = new User({
                email: googleUser.email,
                firstName: googleUser.given_name,
                lastName: googleUser.family_name,
                password: "abc",
                isEmailVerified: googleUser.email_verified,
                image: googleUser.picture,
            });

            let savedUser = await newUser.save();

            const jwtToken = jwt.sign(
                {
                    email: savedUser.email,
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
                    role: savedUser.role,
                    isEmailVerified: savedUser.isEmailVerified,
                    image: savedUser.image,
                },
                process.env.JWT_SECRET
            );
            res.json({
                message: "Login successful",
                token: jwtToken,
                user: {
                    email: savedUser.email,
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
                    role: savedUser.role,
                    isEmailVerified: savedUser.isEmailVerified,
                    image: savedUser.image,
                },
            });
            return;

        } else {//login the user

            if (user.isBlock) {
                res.status(403).json({
                    message: "Your account has been blocked. Please contact admin.",
                });
                return;
            }

            const jwtToken = jwt.sign(
                {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    image: user.image,
                },
                process.env.JWT_SECRET
            )
            res.json({
                message: "Login successful",
                token: jwtToken,
                user: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    image: user.image,
                },
            });
            return;

        }

    } catch (err) {
        res.status(500).json(
            {
                message: "Failed to login with google"
            }
        )
        return
    }


}

export async function getAllUsers(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Forbidden",
        });
        return;
    }
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({
            message: "Failed to get users",
        });
    }
}

export async function blockOrUnblockUser(req, res) {
    console.log(req.user);
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Forbidden",
        });
        return;
    }

    if (req.user.email === req.params.email) {
        res.status(400).json({
            message: "You cannot block yourself",
        });
        return;
    }

    try {
        await User.updateOne(
            {
                email: req.params.email,
            },
            {
                isBlock: req.body.isBlock,
            }
        );

        res.json({
            message: "User block status updated successfully",
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to block/unblock user",
        });
    }
}

//usert email ekt code ekk yavan vidiy froget password valadi

export async function sendOTP(req, res) {
    const email = req.params.email;//request eke parameter vala dala evan email ek gannva
    if (email == null) {// email ekk nathnm
        res.status(400).json({
            message: "Email is required",
        });
        return;
    }

    // 100000 - 999999 number 6k random valu ekk me range ek atahra
    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
        const user = await User.findOne({ email: email });

        const firstName = user ? user.firstName : "there";

        if (user == null) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }

        await OTP.deleteMany({//email ekem thiyena okkoma OTP tika delete karanva
            email: email,
        });

        const newOTP = new OTP({// new OTP 
            email: email,
            otp: otp.toString(),
        });
        await newOTP.save();// new OTP ek save kara gannva



        await transporter.sendMail({//send karana mail ek
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP – Crystal Beauty Clear",
            html: getDesignEmail({ otp, userName: firstName }),

        });

        res.json({
            message: "OTP sent to your email",
        });

        console.log("SEND OTP API HIT:", req.params.email);
    } catch (err) {
        console.error("SEND OTP ERROR FULL:", err);
        res.status(500).json({
            message: "Failed to send OTP",
        });
    }

}
//email ek verified karagann function ek
export async function changePasswordViaOTP(req, res) {
    const email = req.body.email;//mail ek
    const otp = req.body.otp;//otp ek
    const newPassword = req.body.newPassword;// new password ek
    try {
        const otpRecord = await OTP.findOne({//me email eke me otp ek thiyena ekk hoyagannva vena otp ahuvenne na
            email: email,
            otp: otp.toString().trim(),
        });

        if (otpRecord == null) {//OTP ekk nathnm message ekk yavanva invalid kiyla
            res.status(400).json({
                message: "Invalid OTP",
            });
            return;
        }

        await OTP.deleteMany({//me email ekt adala okkom otp tika delete karanva
            email: email,
        });

        const hashedPassword = bcrypt.hashSync(newPassword, 10);//newpassword ek hash karanva

        await User.updateOne(//ita passe userge email and password update kara gannva
            {
                email: email,
            },
            {
                password: hashedPassword,
            }
        );
        res.json({
            message: "Password changed successfully",
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to change password",
        });
    }
}

export async function updateUserData(req, res) {
    if (req.user == null) {//check user null
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }

    try {

        await User.updateOne({//update karana kenage mail ek aragen e mail ekt anuwa update karanva
            email: req.user.email
        }, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            image: req.body.image
        })
        res.json({
            message: "User data updated successfully",
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to update user data",
        });
    }
}

export async function updatePassword(req, res) {
    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);//hash password ek hadagannva
        await User.updateOne({
            email: req.user.email
        }, {
            password: hashedPassword
        })
        res.json({
            message: "Password updated successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to update password",
        });
    }
}

