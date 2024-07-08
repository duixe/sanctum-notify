import { ref } from 'vue';

type csrf = {
    csrfToken: Ref<string>,
    fetchCsrfToken: () => Promise<void>
}

export default function useCsrf (): csrf {
    const csrfToken = ref<string>('');

    const getCsrfCookie = async () => {
        await useFetch(
            'http://localhost:8000/sanctum/csrf-cookie',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    accept: 'application/json'
                }
            }
            
        );
    };

    const getCookie = (name: string): string | undefined => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return undefined;
    }

    const fetchCsrfToken = async () => {
        await getCsrfCookie(); 
        csrfToken.value = getCookie('XSRF-TOKEN') || '';
    };

    return {
        csrfToken,
        fetchCsrfToken
    }
}