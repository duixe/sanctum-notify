<script setup lang="ts">
import { ref, h } from "vue";
import {
  PinInput,
  PinInputGroup,
  PinInputInput,
  PinInputSeparator,
} from "@/components/ui/pin-input";
import { ShieldCheck, Loader2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";
import { FetchError } from "ofetch";
import { ToastAction } from "@/components/ui/toast";

definePageMeta({
  title: 'Two Factor Test',
  sanctum: {
    excluded: true,
  },
  middleware: 'is-two-fa'
});

const { loading } = useHelpers();
const client = useSanctumClient();
const { refreshIdentity } = useSanctumAuth();
const { toast } = useToast()
const isTwoFaEnabled = useIsTwoFa();

const btnDisabled = ref<boolean>(true);
const pin = ref<string[]>([]);
const formattedPin = ref<string>("");

const handleComplete = (e: string[]) => {
  btnDisabled.value = false;
  formattedPin.value = e.join("");
};

const Verify2fa = async () => {
  loading.value = true;

  try {
    const response = await client(
      "http://localhost:8000/api/auth/verify-2fa",
      {
        method: "post",
        body: { code: formattedPin.value },
      }
    );

    if (response?.success === false) {

      pin.value = [];

      toast({
        title: "Verification Failed.",
        description: response?.message ?? "Sorry, unable to verify",
        action: h(ToastAction, {
                altText: 'Try again',
            }, {
                default: () => 'Try again',
        }),
      });

      loading.value = false;
      return;
    }

    //make sure to guard two fa page
    isTwoFaEnabled.value = false;
    await refreshIdentity();

    navigateTo({
      name: "dashboard"
    });

  } catch (error) {
    if (error instanceof FetchError) {
      loading.value = false;

      pin.value = [];

      const errorMsg =
        error?.response?._data?.message ?? "unable to Verify user";
      toast({
        title: "Verification Failed.",
        description: errorMsg,
        variant: 'destructive',
      });
    }

    loading.value = false;
  }
};
</script>

<template>
  <div>
    <div class="mx-auto max-w-sm mt-[10rem] flex flex-col items-center">
      <div class="mx-auto flex flex-col items-center mb-[3.5rem]">
        <ShieldCheck class="mb-2.5" />
        <h3 class="text-xl font-semibold">2FA Verification</h3>
        <p>Check your google authenticator</p>
      </div>
      <PinInput
        id="pin-input"
        v-model="pin"
        placeholder="○"
        @complete="handleComplete"
      >
        <PinInputGroup class="gap-1">
          <template v-for="(id, index) in 6" :key="id">
            <PinInputInput class="rounded-md border" :index="index" />
            <template v-if="index !== 5">
              <PinInputSeparator />
            </template>
          </template>
        </PinInputGroup>
      </PinInput>

      <Button
        :disabled="loading || btnDisabled"
        type="submit"
        class="w-1/2 mt-[3.5rem]"
        ref="btn"
        @click.prevent="Verify2fa"
      >
        <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
        {{ loading == false ? "Verify" : "Verifying ..." }}
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
