"use client";

import { useActionState } from "react";
import { uploadFileAction, ActionState } from "./parse-cv";

const initialState: ActionState = {
  message: "",
};

export default function UploadPage() {
  // state holds the return value from your Server Action
  // isPending is a boolean that is true while the action runs
  const [state, formAction, isPending] = useActionState(
    uploadFileAction,
    initialState
  );

  return (
    <form action={formAction}>
      <input type="file" name="file" required />
      
      <button type="submit" disabled={isPending}>
        {isPending ? "Uploading..." : "Upload"}
      </button>

      {/* Render the returned message once available */}
      {state.message && (
        <p style={{ color: state.success ? "green" : "red" }}>
          {state.message}
        </p>
      )}
    </form>
  );
}