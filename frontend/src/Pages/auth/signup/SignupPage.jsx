import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdDriveFileRenameOutline } from "react-icons/md";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        userName: "",
        fullName: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length === 0) {
            console.log("Form Data:", formData);
            setFormData({
                userName: "",
                firstName: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            console.log(formData);
            axios
                .post("http://localhost:5005/api/auth/signup", formData)
                .then(() => {
                    console.log("form submitted successfully");
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setErrors({ general: error.response.data.message });
                    }
                    console.log(
                        `Error while submitting the form: ${error.message}`
                    );
                });
        } else {
            setErrors(validationErrors);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isError = false;

    const validateForm = (data) => {
        const errors = {};
        if (!data.firstName) errors.firstName = "First name is required";
        if (!data.userName) errors.userName = "Username is required";
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
            errors.email = "Valid email is required";
        if (!data.password) errors.password = "Password is required";
        if (!data.confirmPassword)
            errors.confirmPassword = "Password is required";
        return errors;
    };

    return (
        <div className="max-w-screen-xl mx-auto flex h-screen px-10">
            <div className="flex-1 hidden lg:flex items-center  justify-center">
                <XSvg className="w-[20rem] h-[18rem] md:w-[25rem] md:h-[23rem] lg:w-[30rem] lg:h-[28rem] fill-white" />{" "}
            </div>
            <div className="flex-1 flex flex-col justify-center items-center font-[geologica]">
                <XSvg className="w-[3rem] h-[2.5rem] sm:w-[4rem] sm:h-[3rem] md:w-[5rem] md:h-[4rem] lg:hidden fill-white" />{" "}
                <span className="text-[3.8rem] text-[#e7eae9] font-extrabold my-6">
                    Happening now
                </span>
                <form
                    className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
                    onSubmit={handleSubmit}
                >
                    <h1 className="text-4xl font-extrabold text-[#e7eae9]">
                        Join today.
                    </h1>
                    <label className="input input-bordered rounded flex items-center gap-2">
                        <MdOutlineMail />
                        <input
                            type="email"
                            className="grow"
                            placeholder="Email"
                            name="email"
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>
                    {errors.email && (
                        <p className="text-red-500 text-sm mb-1">
                            {errors.email}
                        </p>
                    )}
                    <div className="flex gap-4 flex-wrap">
                        <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                            <FaUser />
                            <input
                                type="text"
                                className="grow bg-black"
                                placeholder="Username"
                                name="userName"
                                onChange={handleInputChange}
                                value={formData.userName}
                            />
                        </label>
                        {errors.userName && (
                            <p className="text-red-500 text-sm mb-1 md:flex md:items-center sm:flex sm:items-center">
                                {errors.userName}
                            </p>
                        )}
                        <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                            <MdDriveFileRenameOutline />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Full Name"
                                name="fullName"
                                onChange={handleInputChange}
                                value={formData.fullName}
                            />
                        </label>
                        {errors.fullName && (
                            <p className="text-red-500 text-sm mb-1">
                                {errors.fullName}
                            </p>
                        )}
                    </div>
                    <label className="input input-bordered rounded flex items-center gap-2">
                        <RiLockPasswordLine />
                        <input
                            type="password"
                            className="grow"
                            placeholder="Password"
                            name="password"
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                    {errors.password && (
                        <p className="text-red-500 text-sm mb-1">
                            {errors.password}
                        </p>
                    )}
                    <label className="input input-bordered rounded flex items-center gap-2">
                        <RiLockPasswordLine />
                        <input
                            type="password"
                            className="grow"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            onChange={handleInputChange}
                            value={formData.confirmPassword}
                        />
                    </label>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mb-1">
                            {errors.confirmPassword}
                        </p>
                    )}
                    <button className="btn rounded-full btn-primary text-white">
                        Sign up
                    </button>
                    {isError && (
                        <p className="text-red-500">Something went wrong</p>
                    )}
                </form>
                <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
                    <p className="text-white text-lg">
                        Already have an account?
                    </p>
                    <Link to="/login">
                        <button className="btn rounded-full btn-primary text-white btn-outline w-full">
                            Sign in
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default SignUpPage;
