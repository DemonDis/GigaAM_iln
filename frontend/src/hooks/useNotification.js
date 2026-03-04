import toast from 'react-hot-toast';

export const useNotification = () => {
  const success = (message) => {
    toast.success(message);
  };

  const error = (message) => {
    toast.error(message);
  };

  const info = (message) => {
    toast(message);
  };

  const loading = (message) => {
    return toast.loading(message);
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  return { success, error, info, loading, dismiss };
};
