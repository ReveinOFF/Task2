import React from "react";

const GoogleAuth = (props: any) => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <button
      {...props}
      onClick={handleGoogleLogin}
      className="bg-gray-700 py-5 px-10 rounded-[10px] mt-5"
    >
      Sign in with google
    </button>
  );
};

export default GoogleAuth;
