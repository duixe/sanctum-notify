export default defineNuxtRouteMiddleware(async (to, from) => {
    const isTwoFaEnabled = useIsTwoFa()
    
   if (!isTwoFaEnabled.value) {

    if (!!from.name) {
        return navigateTo({
            name: from.name
        });
    }

    return navigateTo({
        name: 'auth'
    });
   }
   
})