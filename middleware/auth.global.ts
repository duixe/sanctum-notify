export default defineNuxtRouteMiddleware(async (to, from) => {
    const {isAuthenticated, refreshIdentity, user} = useSanctumAuth();
    const options = useSanctumConfig();

    const [homePage, loginPage] = [
        options.redirect.onGuestOnly,
        options.redirect.onAuthOnly
    ];

    if (homePage === false) {
        throw new Error(
          "You must define onGuestOnly route when using global middleware."
        );
    }

    if (loginPage === false) {
        throw new Error(
            "You must define onAuthOnly route when using global middleware."
        );
    }

    if (options.globalMiddleware.allow404WithoutAuth && to.matched.length === 0) {
        return;
    }

    if (isAuthenticated.value === false) {
      try {
        console.log("inside refreshing");
        await refreshIdentity();
      } catch (error) {
          console.error('Failed to refresh identity:', error);
      }
    }

    const isPageForGuestsOnly = to.path === loginPage || to.meta.sanctum?.guestOnly === true;
    const noSanctum = to.meta.sanctum?.excluded === true

    if (
      (isAuthenticated.value === false && isPageForGuestsOnly) ||
      (isAuthenticated.value === false && noSanctum)
    ) {
      return;
    }

    console.log("is authenticated", isAuthenticated.value);
    
    console.log("to", to);
    console.log("from", from);   
    
    if (isAuthenticated.value === true) {
      console.log("is auth after all");
      
      if (isPageForGuestsOnly || noSanctum) {
        console.log("is it not for guest");
        
        return navigateTo(homePage, { replace: true });
      }
      return;
    }

    if (isPageForGuestsOnly) {
      return;
    }

    if (to.meta.sanctum?.excluded === true) {
      return;
    }
    console.log("got to redirect");
    
    const redirect = { path: loginPage };
    if (options.redirect.keepRequestedRoute) {
      redirect.query = { redirect: to.fullPath };
    }

    return navigateTo(redirect, { replace: true });
})