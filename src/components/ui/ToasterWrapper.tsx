import { Toaster } from "react-hot-toast";

const ToasterWrapper = () => {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: 20,
        left: 20,
        bottom: 20,
        right: 20,
      }}
      toastOptions={{
        // Default options for all toasts
        duration: 5000,
        style: {
          background: "#363636",
          color: "#fff",
          fontSize: "16px",
          padding: "16px",
          maxWidth: "500px",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
        },
        // Styling for success toasts
        success: {
          style: {
            background: "#2E6141",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#2E6141",
          },
        },
        // Styling for error toasts
        error: {
          style: {
            background: "#e53e3e",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#e53e3e",
          },
        },
      }}
    />
  );
};

export default ToasterWrapper;
