<script setup lang="ts">
import { ref, h } from "vue";
import { Loader2, Mail } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast/use-toast";
import { ToastAction } from "@/components/ui/toast";

definePageMeta({
  sanctum: {
    excluded: true,
  },
});

const client = useSanctumClient();
const { loading } = useHelpers();
const { toast } = useToast();

const email = ref<string>("");
const emailInput = ref(null);

const sendResetLink = async () => {
  loading.value = true;

  try {
    const response = await client(
      "http://localhost:8000/api/auth/forgot-password",
      {
        method: "post",
        body: { email: email.value },
      }
    );

    toast({
      title: "Forgot Password",
      description: "Reset Link has been sent to your email",
      action: h(
        ToastAction,
        {
          altText: "Back",
        },
        {
          default: () => 'okay',
        }
      ),
    });
  } catch (error) {
    const errorMsg =
      error?.response?._data?.message ?? "unable to send Reset Link";

    toast({
      title: "Uh oh! Something went wrong.",
      description: errorMsg,
      action: h(
        ToastAction,
        {
          altText: "Try Again",
        },
        {
          default: () => 'Try Again',
        }
      ),
    });
  }

  loading.value = false;
};
</script>

<template>
  <div>
    <Card class="mx-auto max-w-sm mt-[10rem]">
      <CardHeader>
        <CardTitle class="text-2xl"> Forgot Password </CardTitle>
        <CardDescription> Enter email to reset your password </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              v-model="email"
            />
          </div>

          <Button
            :disabled="loading"
            type="submit"
            class="w-full"
            @click.prevent="sendResetLink"
          >
            <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
            {{ loading == false ? "Send Reset Link" : "Sending ..." }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped></style>
