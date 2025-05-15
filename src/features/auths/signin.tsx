import { Card } from "components/card";
import { HookForm, HookFormItem } from "components/hookform";
import { Input } from "components/input";
import styles from "./signin.module.css";
import { Button } from "components/button";
import { PasswordInput } from "components/password-input/password-input";
import { string, z } from "zod";

export const SignIn = () => {
  const zodSchema = z.object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid email address"),
    password: string({
      required_error: "Password is required",
    }),
  });

  return (
    <Card className={styles.signin_container}>
      <div className={styles.inner_container}>
        <h1 className={styles.signin_header}>SignIn</h1>
        <HookForm
          zodSchema={zodSchema}
          style={{ width: "100%" }}
          id="signin-form"
        >
          <HookFormItem name="email" label={"Email"}>
            <Input variantSize="large" />
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
      </div>
    </Card>
  );
};
