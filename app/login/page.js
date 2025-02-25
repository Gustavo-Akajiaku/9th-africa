"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./../globals.css";
import axios from "axios";
import { useEffect, useState } from "react";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format!")
    .required("Please enter your email address!"),
  password: Yup.string()
    .min(8, "Minium length 8 characters long!")
    .max(15, "Maximum length 15 characters long!")
    .required("Enter your password please!"),
});

const page = () => {
  const [isLogin, setLogin] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const login = async (values, onSubmitProps) => {
    onSubmitProps.setSubmitting(false);
    onSubmitProps.resetForm();
    setLogin(true);
    setIsSuccess(true);

    try {
      const data = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/auth/login`,
        {
          email: values.email,
          password: values.password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(data);

      if (data.status === 200 && data.data.vendor.role === "vendor") {
        setIsSuccess(true);
        window.alert(data.data.message)
        return;
      }

      if (data.status === 200 && data.data.customer.role === "customer") {
        setIsSuccess(true);
        window.alert(data.data.message);
        return;
      }

      if (data.status !== 200) {
        window.alert('Authentication failed');
        setIsSuccess(false);
        return;
      }
    } catch (err) {
      setIsSuccess(false);
      setLogin(false);
      window.alert("Authentication failed.");
      return;
    }
  };

  return (
    <>
      <div className="w-full flex justify-center items-center bg-black">
        <main className="w-full h-screen px-4 text-white rounded-t-2xl md:px-10 space-y-8 md:my-8 md:py-12 md:flex md:flex-row items-center justify-between gap-12 ">
          <div className="space-y-6 md:w-1/3">
            <h1 className="font-bold w-full text-center text-2xl">
              Log in to an account
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={login}
            >
              <Form className="w-full flex flex-col space-y-4">
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
                    {(errMsg) => <span className="text-red-600">{errMsg}</span>}
                  </ErrorMessage>
                </div>

                <div>
                  <Field name="password">
                    {(props) => {
                      const { field, form, meta } = props;
                      return (
                        <input
                          placeholder="Password"
                          className={`form__input bg-neutral-900 border-neutral-900 border-2 text-white rounded-xl w-full p-4 text-md focus:outline-none focus:border-red-600 focus:bg-transparent`}
                          type="password"
                          id="password"
                          {...field}
                        />
                      );
                    }}
                  </Field>
                  <ErrorMessage name="password">
                    {(errMsg) => <span className="text-red-600">{errMsg}</span>}
                  </ErrorMessage>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-reborder-red-600 text-md hover:bg-iso-color2 text-dark-bg"
                  disabled={Formik.isValid || Formik.isSubmitting}
                >
                  {isLogin ? "PROCESSING..." : "LOG IN"}
                </button>
              </Form>
            </Formik>

            <div className="w-full flex items-center">
              <span className="w-full border-b-2 border-red-600"></span>
              <span className="p-4 text-sm">or</span>
              <span className="w-full border-b-2 border-red-600"></span>
            </div>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <a href={`/signup`} className="font-semibold underline">
                Sign up
              </a>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default page;
