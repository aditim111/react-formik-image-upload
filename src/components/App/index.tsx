import React from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";

import FormField from "../FormField";
import FormSelect, { FormSelectItem } from "../FormSelect";

import "./App.css";

interface FormValues {
  name: string;
  position: string;
  email: string;
  password: string;
  passwordConfirm: string;
  image: string;
}

const initialValues: FormValues = {
  name: "",
  position: "",
  email: "",
  password: "",
  passwordConfirm: "",
  image: "",
};

const positionItems: FormSelectItem[] = [
  {
    label: "Front End",
    value: "front_end",
  },
  {
    label: "Back End",
    value: "back_end",
  },
  {
    label: "Dev Ops",
    value: "dev_ops",
  },
  {
    label: "QA",
    value: "qa",
  },
];
const emailAddresses = ["test@gmail.com", "test2@gmail.com", "test3@gmail.com"];
const lowercaseRegex = /(?=.*[a-z])/;
const uppercaseRegex = /(?=.*[A-Z])/;
const numericRegex = /(?=.*[0-9])/;
const FILE_SIZE = 2000000;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .required("Required"),
  email: Yup.string()
    .lowercase()
    .email("Must be a valid Email.")
    .notOneOf(emailAddresses, "Email already taken!")
    .required("Required"),
  password: Yup.string()
    .matches(lowercaseRegex, "one lowercase required!")
    .matches(uppercaseRegex, "one uppercase required!")
    .matches(numericRegex, "one number required!")
    .min(8, "Minimum 8 characters required!")
    .required("Required!"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password")], "Password must be the same!")
    .required("Required!"),
  position: Yup.string().required("Required"),
  image: Yup.mixed()
    .test(
      "FILE_SIZE",
      "Uploaded file is too big.",
      (value) => !value || (value && value.size <= FILE_SIZE)
    )
    .test(
      "FILE_FORMAT",
      "Uploaded file has unsupported format.",
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
    ),
});

const App: React.FC = () => {
  const handleSubmit = (values: FormValues): void => {
    alert(JSON.stringify(values));
    console.log(JSON.stringify(values));
  };
  const selectImage = (setFieldValue: any) => (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    if (e.currentTarget.files !== null) {
      setFieldValue("image", e.currentTarget.files[0]);
      if (e.currentTarget.files[0]) {
        console.log(URL.createObjectURL(e.currentTarget.files[0]));
      }
    }
  };

  return (
    <div className="App">
      <h1>SIGN UP</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={SignupSchema}
      >
        {({ dirty, isValid, setFieldValue, touched }) => {
          return (
            <Form>
              <FormField name="name" label="Name" required />
              <FormField name="email" label="Email" required />
              <FormField
                name="password"
                label="Password"
                required
                type="password"
              />
              <FormField
                name="passwordConfirm"
                label="Confirm Password"
                required
                type="password"
              />
              <FormSelect
                name="position"
                items={positionItems}
                label="Position"
                required
              />

              <Field
                name="image"
                type="file"
                accept="image/*"
                value={undefined}
                onChange={selectImage(setFieldValue)}
              />
              <ErrorMessage name="image" />

              <Button
                variant="contained"
                color="primary"
                disabled={!dirty || !isValid}
                type="submit"
              >
                Submit
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default App;
