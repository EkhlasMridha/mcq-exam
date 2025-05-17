import {
  GoogleOAuthProvider,
  type CodeResponse,
  type UseGoogleLoginOptionsAuthCodeFlow,
} from "@react-oauth/google";
import { Button } from "components/button";
import { Card } from "components/card";
import { GoogleSinginButton } from "components/google-signin-button";
import { HookForm, HookFormItem } from "components/hookform";
import { EmailIcon } from "components/icons";
import { Input } from "components/input";
import { PasswordInput } from "components/password-input/password-input";
import { APP_ENV } from "constants/app.env";
import { useNavigate } from "react-router";
import { string, z } from "zod";
import styles from "./auth.module.css";
import { oAuthSignin } from "http-services/auth-service";
import { storeJwtToken } from "utils/jwt-helpers";

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

  const onSuccessGoogleSignin = (
    codeResponse: Omit<
      CodeResponse,
      "error" | "error_description" | "error_uri"
    >
  ) => {
    oAuthSignin({ code: codeResponse?.code }).then((res) => {
      storeJwtToken(res);
    });
  };

  return (
    <Card className={`${styles.signin_container} ${styles.auth_container}`}>
      <div
        className={`${styles.inner_container} ${styles.inner_container_signin}`}
      >
        <h1 className={styles.auth_header}>SignIn</h1>
        <HookForm zodSchema={zodSchema} className="w-full" id="signin-form">
          <HookFormItem name="email" label={"Email"}>
            <Input
              variantSize="large"
              autoFocus
              placeholder="Your email address"
            />
          </HookFormItem>
          <HookFormItem name="password" label={"Password"}>
            <PasswordInput variantSize="large" placeholder="password" />
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
          <GoogleOAuthProvider clientId={APP_ENV.googleClientId}>
            <GoogleSinginButton
              className="w-full"
              googleOptions={{
                onSuccess: onSuccessGoogleSignin,
              }}
            />
          </GoogleOAuthProvider>
        </div>

        <Button
          variant="outline"
          size="large"
          className="w-full"
          type="button"
          onClick={() => navigate("/signup")}
          icon={<EmailIcon width={16} />}
          style={{ marginTop: 18 }}
        >
          Continue with email
        </Button>
      </div>
    </Card>
  );
};
