import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useRuntimeConfig, useNuxtApp } from '#app';
import { FetchError } from 'ofetch';

export const useEcho = () => {
    const config = useRuntimeConfig();
    
    // const { $sanctumClient } = useNuxtApp();
    const client = useSanctumClient();
    window.Pusher = Pusher;
    const echo = new Echo({
        broadcaster: 'reverb',
        key: config.public.ReverbAppKey,
        authorizer: (channel: any) => {
            return {
                authorize: (socketId: string, callback: any) => {
                    client('/api/broadcasting/auth', {
                        method: "POST",
                        body: {
                            socket_id: socketId,
                            channel_name: channel.name
                        }
                    })
                    .then((response: any) => {           
                        callback(false, response);
                    })
                    .catch((error: FetchError) => {
                        callback(true, error);
                    });
                }
            };
        },
        wsHost: config.public.ReverbHost,
        wsPort: config.public.ReverbPort ?? 80,
        wssPort: config.public.ReverbPort ?? 443,
        forceTLS: (config.public.ReverbScheme ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
    });

    return { echo };
};
