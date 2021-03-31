import { Error } from "@material-ui/icons";
import React from "react";
import { BiError } from "react-icons/bi";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message.replace(
        "GraphQL error: ",
        ""
      );
      return (
        <p className="text-lg mt-6 flex items-center font-semibold">
          <BiError className="text-4xl text-red-600 mr-3" />
          {errorMessage === "Game not found" ? (
            <>{errorMessage}</>
          ) : (
            <>
              A technical error has occurred: "{errorMessage}"
              <br /> Try to refresh the page.
            </>
          )}
        </p>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
