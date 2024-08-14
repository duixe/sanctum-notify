<script setup lang="ts">
import { BellRing, Check } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { ref, onMounted } from "vue";
definePageMeta({
    layout: 'dashboard'
});

const client = useSanctumClient();
const { echo } = useEcho();
const { user } = useSanctumAuth()

const switched = ref<boolean>(false)
const notifications = ref([]);

const unreadNotifications = computed(() => {
    return notifications.value.data
});

const getNotifications = async () => {
    try {
        const response = await client('/api/notification/unread');
        notifications.value = response.many
        
    } catch (error) {
        console.log(error)
    }
}

const handleNotifyEcho = (echoObj) => {
    const obj = {
        id: echoObj.id,
        data: echoObj,
        updated_at: convertToIsoTimestamp(new Date())
    }

    notifications.value.data?.unshift(obj);
}

const handleSwitch = async ($event) => {
    console.log('switched event:', $event);
    
    switched.value = $event;

    try {
        const response = await client('/api/notification/notify/test', {
            method: "POST",
            body: {
                'test_switches': switched.value ? 'switched on' : 'switched off'
            }
        });
        // console.log(response);
    } catch (error) {
        
    }
}

const readNotification = async (id: number) => {
    try {
        const response = await client(`/api/notification/${id}`, {
            method: "PATCH"
        });

        if (response.success) {
            const element = notifications.value.data.find(el => el.id === id);
            const notificationIndex = notifications.value.data.indexOf(element)
            notifications.value.data.splice(notificationIndex, 1);
        }
    } catch (error) {
        console.log(error);
    }
    
}

onMounted(() => {
    echo.private('notify.user.'+ user.value?.data?.id)
    .notification((notification) => {
      handleNotifyEcho(notification)
    });
    
    getNotifications();
})
</script>

<template>
    <div>
        <Card :class="cn('w-[680px]', $attrs.class ?? '')"
            class="mx-auto my-auto mt-[3rem]"
        >
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>You have 3 unread messages.</CardDescription>
            </CardHeader>
            <CardContent class="grid gap-4">
                <div class=" flex items-center space-x-4 rounded-md border p-4">
                    <BellRing />
                    <div class="flex-1 space-y-1">
                        <p class="text-sm font-medium leading-none">
                            Push Notifications
                        </p>
                        <p class="text-sm text-muted-foreground">
                            Send notifications to device.
                        </p>
                    </div>
                    <Switch 
                        :checked="switched"
                        @update:checked="handleSwitch"
                    />
                </div>
                <div>
                    <div 
                        v-for="(notification, index) in unreadNotifications" :key="index"
                        class="mb-4 grid grid-cols-[25px_minmax(0,1fr)] items-start pb-4 last:mb-0 last:pb-0 hover:bg-slate-200 p-4 cup"
                        @click="readNotification(notification.id)"
                    >
                        <span class="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div class="space-y-1">
                            <p class="text-sm font-medium leading-none">
                                {{ notification.data?.title }}
                            </p>
                            <p class="text-sm text-muted-foreground mt-3">
                                {{ formatTimestamp(notification.updated_at )}}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button class="w-full">
                    <Check class="mr-2 h-4 w-4" /> Mark all as read
                </Button>
            </CardFooter>
        </Card>
    </div>
</template>
<style>
.cup {
    cursor: pointer;
}
</style>