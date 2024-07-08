export default defineNuxtRouteMiddleware(async (to, from) => {
    const {isAuthenticated, refreshIdentity} = useSanctumAuth();

    await refreshIdentity();

    if (isAuthenticated.value === true) {
        return navigateTo({
            name: "dashboard"
        });
    }
})