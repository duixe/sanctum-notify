
<script setup lang="ts">
import { ref, h } from 'vue'
import { Loader2, Mail } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast/use-toast'
import { ToastAction } from '@/components/ui/toast'

definePageMeta({
    sanctum: {
        excluded: true,
    }
});

const client = useSanctumClient();
const route = useRoute();
const { loading, error_confirm_password } = useHelpers();
const { toast } = useToast()

const email = ref<string>("");

interface IuserFroms {
    email: string | null,
    password: string,
    password_confirmation: string,
    token: string,
}

const form = reactive<IuserFroms>({
    email: "",
    password: "",
    password_confirmation: "",
    token: ""
});

const submitPasswordReset = async () => {
    loading.value = true;

    try {

        const res = await client('http://localhost:8000/api/auth/reset-password', {
            method: 'POST',
            body: form
        });

        navigateTo("/");

        toast({
            title: 'Password Reset',
            description: 'Password Reset Successful ',
            action: h(ToastAction, {
                altText: 'Back',
            }, {
                default: () => 'okay',
            }),
        });
        
    } catch (error) {
        console.log("error", error);

        toast({
            title: 'Uh oh! Something went wrong.',
            description: 'Unable to authenticate',
            action: h(ToastAction, {
                altText: 'Error Sending Link',
            }, {
                default: () => 'Try again',
            }),
        });
        
    }

    loading.value = false;
}

watch(() => form.password_confirmation, 
    (confirmed_pword) => {
        if (confirmed_pword !== form.password) {
            error_confirm_password.value = "passwords does not match"
        }else {
            error_confirm_password.value = null;
        }
    }
)

onMounted(() => {
    form.email = route.query.email;
    form.token = route.query.token;
});

</script>

<template>
    <div>
        <Card class="mx-auto max-w-sm mt-[10rem]">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Password Reset
                </CardTitle>
                <CardDescription>
                    Enter new Password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid gap-4">
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required v-model="form.email" disabled/>
                    </div>

                    <div class="grid gap-2 hidden">
                        <Input id="email" type="email" placeholder="m@example.com" required v-model="form.token" disabled/>
                    </div>

                    <div class="grid gap-2">
                        <Label for="password">Password</Label>
                        <Input id="password" type="password" required v-model="form.password" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="password">Confirm Password</Label>
                        <Input id="password" type="password" required v-model="form.password_confirmation" />
                        <p v-show="!!error_confirm_password" class="text-red-500">password does not match</p>
                    </div>
                    
                    <Button :disabled="loading" type="submit" class="w-full" @click.prevent="submitPasswordReset">
                        <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                        {{ loading == false ? 'Reset Password' : 'Sending ...' }}
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
</template>


<style scoped>

</style>