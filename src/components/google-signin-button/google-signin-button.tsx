import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { Button } from "components/button";
import { GoogleIcon } from "components/icons";
import type { GoogleSinginButtonProps } from "./types";

export const GoogleSinginButton = ({
  name = "Signin with google",
  googleOptions,
  clienId,
  ...restProps
}: GoogleSinginButtonProps) => {
  const login = useGoogleLogin({ ...googleOptions });
  return (
    <GoogleOAuthProvider clientId={clienId}>
      <Button
        icon={<GoogleIcon />}
        variant="outline"
        color="primary"
        size="large"
        onClick={() => login()}
        {...restProps}
      >
        {name}
      </Button>
    </GoogleOAuthProvider>
  );
};
