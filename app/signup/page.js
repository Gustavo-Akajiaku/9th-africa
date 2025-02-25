"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./../globals.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const initialValues = {
  fullname: "",
  email: "",
  password: "",
  confirmPass: "",
  phoneNumber: "",
};

const validationSchema = Yup.object({
  fullname: Yup.string().required("Please enter fullname"),
  role: Yup.string().required("Please select account type"),
  email: Yup.string()
    .email("Invalid email format!")
    .required("Please enter your email address!"),
  password: Yup.string()
    .min(8, "Minium length 8 characters long!")
    .max(15, "Maximum length 15 characters long!")
    .matches(/[a-zA-Z]/, "Password can only be letters & numbers")
    .required("Enter your password please!"),
  confirmPass: Yup.string()
    .oneOf([Yup.ref("password"), null], "Password must match!")
    .required("Password must match"),
  phoneNumber: Yup.string()
    .min(10, "Invalid phone number")
    .max(15, "Invalid phone number")
    .required("Provide your whatsApp number"),
});

const page = () => {
  const router = useRouter()
  const [isSignup, setSignup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const signup = async (values, onSubmitProps) => {
    onSubmitProps.setSubmitting(false);
    onSubmitProps.resetForm();
    setSignup(true);

    try {
      const data = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/auth/signup`,
        {
          fullname: values.fullname,
          email: values.email,
          role: values.role,
          phoneNumber: values.phoneNumber,
          password: values.password,
        },
        {
          withCredentials: true,
        }
      );

      if (data.status === 200) {
        setSignup(true);
        window.alert(data.data.message);
        router.push(`/login`);
        return;
      }

      setIsSuccess(true);
      setSignup(false);
      window.alert("Authentication failed!");
      return;
    } catch (err) {
      setIsSuccess(true);
      setSignup(false);                                   
      window.alert("Authentication failed!");
      return
    }
  };

  return (
    <>
      <div className="w-full flex justify-center items-center bg-black">
        <main className="w-full mb-12 px-4 rounded-t-2xl md:px-10 text-white   md:flex md:flex-row items-center justify-between gap-12 ">
          <div className="space-y-6 mt-28 md:mt-28 lg:w-1/3">
            <h1 className="font-bold text-center text-2xl">
              Create new account
            </h1>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={signup}
            >
              {({ errors, touched, values }) => (
                <Form className="w-full flex flex-col space-y-4">
                  <div>
                    <Field name="fullname">
                      {(props) => {
                        const { field, form, meta } = props;
                        return (
                          <input
                            placeholder="fullname"
                            className={`form__input bg-neutral-900 border-neutral-900 border-2 text-white rounded-xl w-full p-4 text-md focus:outline-none focus:border-red-600 focus:bg-transparent`}
                            type="text"
                            id="fullname"
                            name="fullname"
                            {...field}
                          />
                        );
                      }}
                    </Field>
                    <ErrorMessage name="fullname">
                      {(errMsg) => (
                        <span className="text-red-600">{errMsg}</span>
                      )}
                    </ErrorMessage>
                  </div>

                  <div>
                    <Field name="email">
                      {(props) => {
                        const { field, form, meta } = props;
                        return (
                          <input
                            placeholder="Email ID"
                            className={`form__input bg-neutral-900 border-neutral-900 border-2 text-white rounded-xl w-full p-4 text-md focus:outline-none focus:border-red-600 focus:bg-transparent`}
                            type="email"
                            id="email"
                            name="email"
                            {...field}
                          />
                        );
                      }}
                    </Field>
                    <ErrorMessage name="email">
                      {(errMsg) => (
                        <span className="text-red-600">{errMsg}</span>
                      )}
                    </ErrorMessage>
                  </div>

                  <div>
                    <Field name="phoneNumber">
                      {(props) => {
                        const { field, form, meta } = props;
                        return (
                          <div className="w-full flex items-center">
                            <input
                              placeholder="Phone number"
                              className={`form__input bg-neutral-900 border-neutral-900 border-2 text-white rounded-r-xl w-full p-4 text-md focus:outline-none focus:border-red-600 focus:bg-transparent`}
                              type="number"
                              id="phoneNumber"
                              name="phoneNumber"
                              {...field}
                            />
                          </div>
                        );
                      }}
                    </Field>
                    <ErrorMessage name="phoneNumber">
                      {(errMsg) => (
                        <span className="text-red-600">{errMsg}</span>
                      )}
                    </ErrorMessage>
                  </div>

                  <div>
                    <Field name="role">
                      {(props) => {
                        const { field, form, meta } = props;
                        return (
                          <select
                            className={`form__input bg-neutral-900 border-neutral-900 border-2  rounded-xl w-full p-4 text-md focus:outline-none focus:border-red-600 focus:bg-transparent`}
                            id="role"
                            name="role"
                            {...field}
                          >
                            <option
                              className="bg-redborder-red-600 text-dark-bg"
                              value={``}
                            >
                              Select account type
                            </option>
                            <option
                              className="bg-red-600 text-black"
                              value={`vendor`}
                            >
                              Vendor
                            </option>
                            <option
                              className="bg-red-600 text-black"
                              value={`customer`}
                            >
                              customer
                            </option>
                          </select>
                        );
                      }}
                    </Field>
                    <ErrorMessage name="role">
                      {(errMsg) => (
                        <span className="text-red-600">{errMsg}</span>
                      )}
                    </ErrorMessage>
                  </div>

                  <div>
                    <Field name="password">
                      {(props) => {
                        const { field, form, meta } = props;
                        return (
                          <div className="flex items-center relative">
                            <input
                              placeholder="Password"
                              className={`form__input bg-neutral-900 border-neutral-900 border-2 text-white rounded-xl w-full p-4 text-md focus:outline-none focus:border-red-600 focus:bg-transparent`}
                              type="password"
                              id="password"
                              {...field}
                            />
                          </div>
                        );
                      }}
                    </Field>
                    <ErrorMessage name="password">
                      {(errMsg) => (
                        <span className="text-red-600">{errMsg}</span>
                      )}
                    </ErrorMessage>
                  </div>
                  <div>
                    <Field name="confirmPass">
                      {(props) => {
                        const { field, form, meta } = props;
                        return (
                          <div className="flex items-center relative">
                            <input
                              placeholder="Confirm password"
                              className={`form__input bg-neutral-900 border-neutral-900 border-2 text-white rounded-xl w-full p-4 text-md focus:outline-none focus:border-red-600 focus:bg-transparent`}
                              type="password"
                              id="confirmPass"
                              name="confirmPass"
                              {...field}
                            />
                          </div>
                        );
                      }}
                    </Field>
                    <ErrorMessage name="confirmPass">
                      {(errMsg) => (
                        <span className="text-red-600">{errMsg}</span>
                      )}
                    </ErrorMessage>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-redborder-red-600 text-md hover:bg-iso-color2 text-dark-bg "
                    disabled={Formik.isValid || Formik.isSubmitting}
                  >
                    {isSignup ? "PROCESSING..." : "SIGN UP"}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="w-full flex items-center">
              <span className="w-full border-b-2 border-red-600"></span>
              <span className="p-4 text-sm">or</span>
              <span className="w-full border-b-2 border-red-600"></span>
            </div>

            <div className="text-center text-sm">
              Already a an account?{" "}
              <a href={`/login`} className="font-semibold underline">
                Log In
              </a>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default page;
