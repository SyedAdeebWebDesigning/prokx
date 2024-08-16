"use client";

interface RedirectToSignInProps {
  userId: string | undefined;
}

const RedirectToSignIn = ({ userId }: RedirectToSignInProps) => {
  if (!userId || userId === undefined) {
    window.location.href = `/sign-in`;
  }

  return <></>;
};

export default RedirectToSignIn;
