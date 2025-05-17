import { Card } from "components/card";
import { HookForm, HookFormItem } from "components/hookform";
import { Input } from "components/input";
import styles from "./auth.module.css";
import { Button } from "components/button";
import { PasswordInput } from "components/password-input/password-input";
import { string, z } from "zod";
import { useNavigate } from "react-router";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { APP_ENV } from "constants/app.env";
import { GoogleSinginButton } from "components/google-signin-button";
import { EmailIcon } from "components/icons";

export const SignIn = () => {
  const navigate = useNavigate();
  const zodSchema = z.object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid email address"),
    password: string({
      required_error: "Password is required",
    }).nonempty("Password is required"),
  });

  console.log("ENV: ", APP_ENV.googleClientId);

  return (
    <Card className={`${styles.signin_container} ${styles.auth_container}`}>
      <div
        className={`${styles.inner_container} ${styles.inner_container_signin}`}
      >
        <h1 className={styles.auth_header}>SignIn</h1>
        <HookForm zodSchema={zodSchema} className="w-full" id="signin-form">
          <HookFormItem name="email" label={"Email"}>
            <Input variantSize="large" autoFocus />
          </HookFormItem>
          <HookFormItem name="password" label={"Password"}>
            <PasswordInput variantSize="large" />
          </HookFormItem>
        </HookForm>
        <Button
          variant="solid"
          color="primary"
          type="submit"
          form="signin-form"
          className="w-full"
          size="large"
          style={{
            marginTop: 18,
          }}
        >
          SignIn
        </Button>
        <div className="flex flex-col w-full">
          <span
            style={{
              marginBottom: 8,
              marginTop: 18,
              textAlign: "center",
            }}
          >
            Or
          </span>

          <GoogleSinginButton
            className="w-full"
            clienId={APP_ENV.googleClientId}
          />
        </div>
        <div className="w-full">
          <p className={styles.donthavetext}>Don't have an account?</p>

          <Button
            variant="outline"
            size="large"
            className="w-full"
            type="button"
            onClick={() => navigate("/signup")}
            icon={<EmailIcon width={16} />}
          >
            Continue with email
          </Button>
        </div>
      </div>
    </Card>
  );
};
