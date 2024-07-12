export default function useHelpers() {
  let loading = ref<boolean>(false);
  let isOauthDialog = ref<boolean>(false);
  let error_confirm_password = ref<string | null>(null);

  const isEmail = (email: string): RegExpMatchArray | null => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const isEmpty = (str: string): boolean => {
    return (!str || str.length === 0);
  };

  return {
    loading,
    isOauthDialog,
    error_confirm_password,
    isEmail,
    isEmpty
  };
}
