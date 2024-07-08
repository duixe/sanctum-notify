export default function useHelpers() {
    let loading = ref<boolean>(false);
    let isOauthDialog = ref<boolean>(false);
    let error_confirm_password = ref<string|null>(null);

    return {
        loading,
        isOauthDialog,
        error_confirm_password
    }
}