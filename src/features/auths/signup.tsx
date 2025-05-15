import { Card } from "components/card";
import { HookForm, HookFormItem } from "components/hookform";
import styles from "./auth.module.css";
import { Input } from "components/input";
import { PasswordInput } from "components/password-input/password-input";
import { Button } from "components/button";
import { useNavigate, useNavigation } from "react-router";
import { string, z } from "zod";

export const SignUp = () => {
  const navigation = useNavigate();

  const schema = z
    .object({
      firstname: string({
        required_error: "First name is required",
      }).max(150, { message: "Max length is 150 characters" }),
      lastname: string({
        required_error: "Last name is required",
      })
        .max(150, { message: "Max length is 150 characters" })
        .min(2, { message: "Too short last name" }),
      email: string({
        required_error: "Email is required",
      }).email("Invalid email"),
      password: string({
        required_error: "Password is required",
      }).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
        message:
          "Password must contain letters and digits with a minimum length of 6",
      }),
      confirm_password: string({
        required_error: "Please enter your password again",
      }),
    })
    .refine((data) => data.password === data.confirm_password, {
      path: ["confirm_password"],
      message: "Confirm password and password must be same",
    });

  return (
    <Card className={`${styles.signup_container} ${styles.auth_container}`}>
      <div
        className={`${styles.inner_container} ${styles.inner_container_signup}`}
      >
        <h1 className={styles.auth_header}>SignUp</h1>
        <HookForm zodSchema={schema} id="signup_form">
          <div className="flex" style={{ gap: 16 }}>
            <HookFormItem name="firstname" label={"First name"}>
              <Input variantSize="large" autoFocus />
            </HookFormItem>
            <HookFormItem name="lastname" label={"Last name"}>
              <Input variantSize="large" />
            </HookFormItem>
          </div>
          <HookFormItem name="email" label={"Email"}>
            <Input variantSize="large" type="email" />
          </HookFormItem>
          <HookFormItem name="password" label={"Password"}>
            <PasswordInput variantSize="large" />
          </HookFormItem>
          <HookFormItem name="confirm_password" label={"Confirm password"}>
            <PasswordInput variantSize="large" />
          </HookFormItem>
        </HookForm>
        <div className="flex justify-end w-full" style={{ marginTop: 18 }}>
          <Button size="large" type="submit" form="signup_form">
            Signup
          </Button>
        </div>
        <div className={styles.signin_navigation}>
          <p className={styles.donthavetext}>Already have an account?</p>
          <Button
            size="large"
            variant="outline"
            color="primary"
            type="button"
            style={{ maxWidth: "max-content" }}
            onClick={() => navigation("/signin")}
          >
            SignIn
          </Button>
        </div>
      </div>
    </Card>
  );
};
