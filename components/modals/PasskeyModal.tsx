"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";

import { PasskeyInitStateType, REDUCER_ACTION_TYPE } from "@/types";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, MouseEvent, useReducer, useState } from "react";

import { sendOtp, signIn, signInAdmin } from "@/lib/actions/user.actions";
import { Button } from "../ui/button";

const PasskeyModal = () => {
  const router = useRouter();
  const [isGlobal, setIsGlobal] = useState(false);
  const [responseData, setResponseData] = useState({
    userId: "",
    phrase: "",
    secret: "",
  });

  // INITIALIZING THE REDUCER FUNCTION
  const initialState = {
    open: true,
    isLoading: false,
    form: { email: "", passkey: "" },
    phase: { email: true, passkey: false },
    error: { animate: false, message: "" },
  };

  function reducer(state: PasskeyInitStateType, action: REDUCER_ACTION_TYPE) {
    switch (action.type) {
      case "SET_OPEN":
        return { ...state, open: !state.open };
      case "SET_ISLOADING":
        return { ...state, isLoading: !state.isLoading };
      case "SET_FORM_DATA":
        return { ...state, form: { ...state.form, ...action.payload } };
      case "SET_PHASE":
        return { ...state, phase: { ...state.phase, ...action.payload } };
      case "SET_ERROR":
        return {
          ...state,
          error: { ...state.error, ...action.payload },
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const closeModal = () => {
    dispatch({ type: "SET_OPEN", payload: false });
    router.replace("/sign-in");
  };

  const errorMessage = (message?: string, animate?: boolean) => {
    let timeoutId;

    dispatch({
      type: "SET_ERROR",
      payload: { message: message || "", animate: animate || false },
    });

    timeoutId = setTimeout(
      () =>
        dispatch({
          type: "SET_ERROR",
          payload: { message: "", animate: false },
        }),
      5000
    );

    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = async (
    e: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      dispatch({
        type: "SET_ISLOADING",
        payload: true,
      });

      if (state.phase.email) {
        const response = await sendOtp(state.form.email);

        if (response?.success === false) {
          errorMessage(response.message);
        } else {
          setResponseData(response?.data);

          dispatch({
            type: "SET_PHASE",
            payload: { email: false, passkey: true },
          });

          dispatch({
            type: "SET_ERROR",
            payload: { message: "", animate: false },
          });
        }
      }

      if (state.phase.passkey) {
        // Jump the authorization steps and log user in if they know the global passkey
        if (isGlobal) {
          const response = await signIn({
            email: "onyesoepiphanus@gmail.com",
            password: state.form.passkey,
            admin: true,
          });

          if (response?.success === false) {
            errorMessage(response?.error);

            return;
          }

          setIsGlobal(false);

          router.push("/admin/overview");
        }

        const response = await signInAdmin({
          passkey: state.form.passkey,
          secret: responseData.secret,
          userId: responseData.userId,
        });

        if (response?.success) {
          router.push("/admin/overview");
        } else {
          errorMessage(response?.message!);
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || "An unknown error occurred";

      errorMessage(errorMessage);
    } finally {
      dispatch({ type: "SET_ISLOADING", payload: false });
    }
  };

  return (
    <AlertDialog
      open={state.open}
      onOpenChange={(newValue) =>
        dispatch({ type: "SET_OPEN", payload: newValue })
      }
    >
      <AlertDialogContent className="shad-alert-dialog" aria-label="passkey">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={30}
              height={30}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            {state.phase.passkey &&
              `Please Enter The 6-digit code ${
                !isGlobal ? "sent to your email" : ""
              }`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-2">
          {state.phase.email && (
            <>
              <Label htmlFor="email">Email:</Label>
              <div className="flex rounded-md border border-dark-500 bg-dark-400">
                <Image
                  src="/assets/icons/email.svg"
                  alt="email"
                  width={24}
                  height={24}
                  className="ml-2"
                />

                <Input
                  type="email"
                  name="email"
                  value={state.form.email}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FORM_DATA",
                      payload: { [e.target.name]: e.target.value },
                    })
                  }
                  autoFocus
                  className="shad-input border-0"
                />
              </div>
              <div className="flex-end w-full">
                <Button
                  variant="ghost"
                  className="w-32 text-gray-400 hover:text-gray-300 text-[13px]"
                  onClick={() => {
                    setIsGlobal(true);

                    dispatch({
                      type: "SET_PHASE",
                      payload: { email: false, passkey: true },
                    });
                  }}
                >
                  Use Global Password?
                </Button>
              </div>
            </>
          )}

          {state.phase.passkey && (
            <>
              <InputOTP
                maxLength={6}
                value={state.form.passkey}
                onChange={(value) =>
                  dispatch({
                    type: "SET_FORM_DATA",
                    payload: { passkey: value },
                  })
                }
              >
                <InputOTPGroup className="shad-otp">
                  {[...Array(6)].map((_, idx) => (
                    <InputOTPSlot
                      className={cn("shad-otp-slot", {
                        "bg-red-800 animate-caret-blink": state.error.animate,
                      })}
                      key={idx}
                      index={idx}
                      autoFocus={idx === 0}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              {!isGlobal && (
                <div className="flex-between">
                  <p className="text-sm">
                    Secret Phrase: {responseData.phrase}
                  </p>

                  <Button
                    variant="ghost"
                    className="w-32 text-gray-400 hover:text-gray-300 text-[10px]"
                    onClick={(e) => {
                      e.stopPropagation();

                      sendOtp(state.form.email);
                    }}
                  >
                    Resend code?
                  </Button>
                </div>
              )}
            </>
          )}

          {state.error.message && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {state.error.message}
            </p>
          )}
        </form>

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => handleSubmit(e)}
            className="shad-primary-btn w-full"
            disabled={state.isLoading}
          >
            {state.isLoading && <Loader className="animate-spin" />}
            {!state.isLoading && state.phase.email
              ? "Send Email"
              : "Enter Passkey"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModal;
