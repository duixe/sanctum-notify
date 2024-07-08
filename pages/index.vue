<script setup lang="ts">
import { reactive, ref, h } from 'vue'
import { Loader2, Mail } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast/use-toast'
import { FetchError } from 'ofetch';
import { ToastAction } from '@/components/ui/toast'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'



definePageMeta({
    sanctum: {
        excluded: true,
    },
    // middleware: 'guests'
});

const { login, isAuthenticated, refreshIdentity } = useSanctumAuth()
const client = useSanctumClient();
const route = useRoute();
const { toast } = useToast()
const isTwoFaEnabled = useIsTwoFa()

const { loading, isOauthDialog } = useHelpers()

interface IuserFroms {
    email: string,
    password: string,
    remember: true
}

const form = reactive<IuserFroms>({
    email: "",
    password: "",
    remember: true
});

const loginUser = async () => {
    try {
        loading.value = true;

        const response = await client('http://localhost:8000/auth/login', {
            method: 'POST',
            body: form
        });
        
        loading.value = false;

        if (response?.success && response?.two_fa_required) {
            isTwoFaEnabled.value = true;
            navigateTo({
                name: 'authTwoFa'
            });
        }else {

            await refreshIdentity();
            
            navigateTo({
                name: 'dashboard'
            });
        }

    } catch (error) {
        if (error instanceof FetchError && error.response?.status === 401) {
            loading.value = false;

            const errorMsg = error?.response?._data?.message ?? "unable to authenticate";
            toast({
                title: 'Authentication Error.',
                description: errorMsg,
            });
        }

        if (error instanceof FetchError && error.response?.status === 422) {
            loading.value = false;
            console.log(error.response?._data.errors)
        }

        loading.value = false;
    }
}

const googleRedirect = () => {
    window.location.href = "http://localhost:8000/auth/google/redirect"
}


const handleOauthLogin = async () => {
    try {
        isOauthDialog.value = true;

        await refreshIdentity();

        isOauthDialog.value = false;

        navigateTo('/dashboard')
    } catch (error) {
        // isOauthDialog.value = false;

        toast({
            title: 'Uh oh! Something went wrong.',
            description: 'Unable to authenticate',
            action: h(ToastAction, {
                altText: 'Try to login',
            }, {
                default: () => 'Try again',
            }),
        });

    }
}

onMounted(() => {
    const oauthLogin = route.query.oauthLogin;

    if (oauthLogin === "true") {
        isOauthDialog.value = true;

        if (isAuthenticated.value) {
            isOauthDialog.value = false;
            
            toast({
                title: 'Authentication',
                description: "You've already been authenticated",
            });

            return navigateTo('/dashboard');
        }

        handleOauthLogin()
    }
})

</script>

<template>
    <div>
        <Card class="mx-auto max-w-sm mt-[10rem]">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Login
                </CardTitle>
                <CardDescription>
                    Enter your credentials to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid gap-4">
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required v-model="form.email" />
                    </div>
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <Label for="password">Password</Label>
                            <a 
                                @click="$router.push('forgotPassword')"
                                class="ml-auto inline-block text-sm underline cursor-pointer"
                            >
                                Forgot your password?
                            </a>
                        </div>
                        <Input id="password" type="password" required v-model="form.password" />
                    </div>
                    <Button :disabled="loading" type="submit" class="w-full" @click.prevent="loginUser">
                        <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                        {{ loading == false ? 'Login' : 'authenticating' }}
                    </Button>
                    <Button variant="outline" class="w-full" @click.prevent="googleRedirect">
                        <Mail class="w-4 h-4 mr-2" /> Login with Gmail
                    </Button>
                </div>
                <div class="mt-4 text-center text-sm">
                    Don't have an account?
                    <a href="#" class="underline">
                        Sign up
                    </a>
                </div>
            </CardContent>
        </Card>

        <Dialog v-model:open="isOauthDialog">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>⚠️ One time Login Error</DialogTitle>
                    <DialogDescription> One time login with oauth provider failed</DialogDescription>
                </DialogHeader>
                <div class="grid gap-4">
                    <Button size="sm" class="px-3" @click="googleRedirect">
                        Login with google
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>
